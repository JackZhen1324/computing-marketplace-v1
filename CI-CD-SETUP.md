# GitHub Actions CI/CD 配置指南

本文档说明如何配置 GitHub Secrets 以启用自动部署到生产服务器。

## 前置条件

1. **GitHub 仓库**: 代码已推送到 GitHub
2. **Docker Hub 账号**: 用于存储 Docker 镜像
3. **Linux 服务器**: 已安装 Docker 和 Docker Compose
4. **SSH 访问**: 可以通过 SSH 连接到服务器

## 步骤 1: 准备 Docker Hub

### 1.1 注册 Docker Hub
如果还没有账号，访问 https://hub.docker.com/ 注册

### 1.2 创建访问令牌（推荐）
为了安全，建议使用访问令牌而不是密码：

1. 登录 Docker Hub
2. 点击右上角头像 → **Account Settings**
3. 选择 **Security** → **New Access Token**
4. 输入令牌描述（如 `github-actions`）
5. 权限选择 **Read & Write**
6. 点击 **Generate**
7. **重要**: 复制生成的令牌（只显示一次）

## 步骤 2: 配置 GitHub Secrets

进入 GitHub 仓库页面：
1. 点击 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret** 添加以下密钥

> **⚠️ 重要**: 如果你的 SSH 端口不是默认的 22，请确保配置 `SERVER_PORT` secret。

### 必需的 Secrets

| Secret 名称 | 说明 | 示例值 | 如何获取 |
|------------|------|--------|---------|
| `DOCKER_USERNAME` | Docker Hub 用户名 | `myusername` | 你的 Docker Hub 用户名 |
| `DOCKER_PASSWORD` | Docker Hub 密码/令牌 | `dckr_pat_xxxxx` | 步骤 1.2 生成的访问令牌 |
| `SERVER_HOST` | 服务器 IP 地址 | `192.168.1.100` 或 `example.com` | 服务器公网 IP 或域名 |
| `SERVER_USER` | SSH 登录用户名 | `root` 或 `ubuntu` | 服务器 SSH 用户名 |
| `SSH_PRIVATE_KEY` | SSH 私钥 | `-----BEGIN OPENSSH PRIVATE KEY-----...` | 见步骤 3 |
| `APP_URL` | 应用访问地址（健康检查用） | `http://your-domain.com` | 你的应用域名或公网 IP |

### 可选的 Secrets

| Secret 名称 | 说明 | 默认值 |
|------------|------|--------|
| `SERVER_PORT` | SSH 端口 | `8222` |
| `DEPLOY_PATH` | 服务器部署目录 | `/opt/app` |
| `APP_PORT` | 应用端口（宿主机） | `3000` |

## 步骤 3: 生成 SSH 密钥对

### 3.1 在本地生成密钥

```bash
# 生成新的 SSH 密钥对
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key

# 或者使用 RSA 类型
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions_key
```

执行时会提示输入密码，直接按 Enter 跳过（GitHub Actions 需要无密码密钥）

### 3.2 将公钥添加到服务器

**方法 A: 手动复制（推荐）**

```bash
# 复制公钥到服务器
ssh-copy-id -i ~/.ssh/github_actions_key.pub user@your-server-ip

# 或手动复制
cat ~/.ssh/github_actions_key.pub
```

然后在服务器上：
```bash
# 登录服务器
ssh user@your-server-ip

# 添加公钥到 authorized_keys
mkdir -p ~/.ssh
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**方法 B: 使用 ssh-copy-id**

```bash
ssh-copy-id -i ~/.ssh/github_actions_key.pub user@your-server-ip
```

### 3.3 将私钥添加到 GitHub Secrets

```bash
# 查看私钥内容
cat ~/.ssh/github_actions_key

# 或复制到剪贴板（macOS）
cat ~/.ssh/github_actions_key | pbcopy
```

复制整个私钥内容（包括 `-----BEGIN` 和 `-----END` 行），添加到 GitHub Secret `SSH_PRIVATE_KEY`

### 3.4 测试 SSH 连接

```bash
# 测试使用新密钥连接
ssh -i ~/.ssh/github_actions_key user@your-server-ip
```

如果成功登录，说明配置正确。

## 步骤 4: 服务器准备

### 4.1 安装 Docker 和 Docker Compose

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 4.2 配置防火墙（如果启用）

```bash
# 开放应用端口（如 3000）
sudo ufw allow 3000/tcp

# 开放 SSH 端口（根据你的配置，如 8222）
sudo ufw allow 8222/tcp

# 启用防火墙
sudo ufw enable
```

### 4.3 创建部署目录（可选）

如果使用自定义部署路径：

```bash
sudo mkdir -p /opt/app
sudo chown $USER:$USER /opt/app
cd /opt/app
```

## 步骤 5: 首次部署测试

### 5.1 推送代码触发部署

```bash
# 确保在 main 分支
git checkout main

# 提交并推送
git add .
git commit -m "feat: add CI/CD workflow"
git push origin main
```

### 5.2 查看部署进度

1. 访问 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看最新的 workflow 运行状态
4. 点击具体任务查看详细日志

### 5.3 验证部署

```bash
# 在服务器上查看容器状态
ssh user@your-server-ip
docker ps
docker logs computing-marketplace-frontend

# 访问应用
curl http://your-server-ip:3000
# 或在浏览器打开: http://your-server-ip:3000
```

## 常见问题

### 问题 1: SSH 连接失败

**错误**: `Permission denied (publickey)`

**解决**:
- 检查 `SSH_PRIVATE_KEY` 是否完整（包括 BEGIN 和 END 行）
- 确认公钥已正确添加到服务器的 `~/.ssh/authorized_keys`
- 检查 `SERVER_USER` 和 `SERVER_HOST` 是否正确

### 问题 2: Docker 登录失败

**错误**: `unauthorized: authentication required`

**解决**:
- 确认 `DOCKER_USERNAME` 和 `DOCKER_PASSWORD` 正确
- 如果使用访问令牌，确认令牌有 **Read & Write** 权限
- 尝试在本地测试: `docker login -u USERNAME --password-stdin`

### 问题 3: 容器启动失败

**错误**: `Container is not running`

**解决**:
```bash
# 在服务器上查看日志
ssh user@your-server-ip
cd /opt/app
docker-compose logs
docker-compose ps

# 手动运行测试
docker-compose up -d --build
```

### 问题 4: 端口被占用

**错误**: `port is already allocated`

**解决**:
```bash
# 检查端口占用
sudo lsof -i :3000

# 停止占用端口的容器
docker stop $(docker ps -q -f publish=3000)

# 或修改 APP_PORT Secret 使用其他端口
```

## 高级配置

### 配置域名（可选）

如果你有域名，可以配置 Nginx 反向代理：

```bash
# 在服务器上安装 Nginx
sudo apt install nginx

# 创建配置文件
sudo nano /etc/nginx/sites-available/computing-marketplace
```

Nginx 配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/computing-marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 配置 HTTPS（推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 安全建议

1. **定期更新 Secrets**:
   - 每 90 天更新 Docker Hub 访问令牌
   - 定期轮换 SSH 密钥

2. **限制 SSH 密钥使用**:
   - 为 GitHub Actions 专用密钥设置权限限制
   - 在服务器上使用 `~/.ssh/authorized_keys` 的 `command` 选项限制命令

3. **监控部署日志**:
   - 定期检查 GitHub Actions 日志
   - 监控服务器资源使用

4. **备份重要数据**:
   - 定期备份数据库和应用数据
   - 保留关键配置文件的版本控制

## 手动部署

如果需要手动部署到服务器而不通过 GitHub Actions：

```bash
# 在服务器上执行
cd /opt/app
docker-compose pull
docker-compose up -d
docker image prune -af
```

## 工作流程说明

当前的 CI/CD 工作流程：

```
Push to main branch
       ↓
[GitHub Actions 触发]
       ↓
[构建 Docker 镜像]
       ↓
[推送镜像到 Docker Hub]
       ↓
[SSH 连接服务器]
       ↓
[拉取最新镜像]
       ↓
[停止旧容器]
       ↓
[启动新容器]
       ↓
[健康检查]
       ↓
[部署完成]
```

## 修改工作流

如果需要自定义部署流程，编辑 `.github/workflows/deploy.yml`：

```yaml
# 修改镜像名称
env:
  IMAGE_NAME: your-custom-name

# 添加环境变量
environment:
  - CUSTOM_VAR=value

# 添加构建前测试
- name: Run tests
  run: npm test

# 添加部署后通知
- name: Send notification
  run: |
    # 发送 Slack/Email 通知
```

## 资源链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Docker Hub 文档](https://docs.docker.com/docker-hub/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [SSH 密钥管理](https://www.ssh.com/academy/ssh/key)
