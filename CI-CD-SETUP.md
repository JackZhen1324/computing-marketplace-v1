# GitHub Actions CI/CD 配置指南

本文档说明如何配置 GitHub Secrets 以启用自动部署到生产服务器。

## 部署方式

**本配置采用服务器本地构建方式**，无需 Docker Hub 访问。
- 服务器直接从 GitHub 拉取代码（git clone/pull）
- 服务器上直接构建 Docker 镜像并部署
- **速度最快**：不通过 GitHub Actions 中转代码
- 适用于无法访问 Docker Hub 的服务器环境

## 前置条件

1. **GitHub 仓库**: 代码已推送到 GitHub
2. **Linux 服务器**: 已安装 Docker 和 Docker Compose
3. **SSH 访问**: 可以通过 SSH 连接到服务器

## 步骤 1: 配置 GitHub Secrets

进入 GitHub 仓库页面：
1. 点击 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret** 添加以下密钥

> **⚠️ 重要**: 如果你的 SSH 端口不是默认的 22，请确保配置 `SERVER_PORT` secret。

### 必需的 Secrets

| Secret 名称 | 说明 | 示例值 | 如何获取 |
|------------|------|--------|---------|
| `SERVER_HOST` | 服务器 IP 地址 | `192.168.1.100` 或 `example.com` | 服务器公网 IP 或域名 |
| `SERVER_USER` | SSH 登录用户名 | `root` 或 `ubuntu` | 服务器 SSH 用户名 |
| `SERVER_PORT` | SSH 端口 | `8222` | 你的 SSH 端口 |
| `SSH_PRIVATE_KEY` | SSH 私钥 | `-----BEGIN OPENSSH PRIVATE KEY-----...` | 见步骤 2 |
| `REPO_URL` | **GitHub 仓库地址** | `https://github.com/username/repo.git` | **必须配置**！见下方说明 |
| `APP_URL` | 应用访问地址（健康检查用） | `http://your-domain.com:3000` | 你的应用域名或公网 IP |

> **🔑 重要**: `REPO_URL` 是新增加的必需配置！使用完整的 GitHub 仓库地址。
>
> **获取方式**:
> 1. 访问你的 GitHub 仓库页面
> 2. 点击绿色 "Code" 按钮
> 3. 选择 "HTTPS" 标签
> 4. 复制仓库地址（格式：`https://github.com/username/repo.git`）
>
> **示例**: 如果你的仓库是 `https://github.com/zhangsan/computing-marketplace`，则 `REPO_URL` = `https://github.com/zhangsan/computing-marketplace.git`

### 可选的 Secrets

| Secret 名称 | 说明 | 默认值 |
|------------|------|--------|
| `DEPLOY_PATH` | 服务器部署目录 | `/opt/computing-marketplace` |
| `APP_PORT` | 应用端口（宿主机） | `3000` |
| `BRANCH` | Git 分支名 | `main` |

## 步骤 2: 生成 SSH 密钥对

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

### 4.1 安装 Docker、Docker Compose 和 Git

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

# 安装 Git（用于从 GitHub 拉取代码）
sudo apt update
sudo apt install -y git

# 验证安装
docker --version
docker-compose --version
git --version
```

### 4.1.1 配置 Git（可选）

如果服务器无法直接访问 GitHub，可以配置代理或使用镜像：

```bash
# 方法1: 配置代理（如果有代理服务器）
git config --global http.proxy http://proxy-server:port
git config --global https.proxy https://proxy-server:port

# 方法2: 使用 SSH 方式访问 GitHub（推荐）
# 1. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "server@github" -f ~/.ssh/github_ed25519

# 2. 查看公钥
cat ~/.ssh/github_ed25519.pub

# 3. 将公钥添加到 GitHub:
#    GitHub Settings → SSH and GPG keys → New SSH key

# 4. 测试连接
ssh -i ~/.ssh/github_ed25519 -T git@github.com

# 5. 在配置 Secrets 时，REPO_URL 使用 SSH 格式:
#    git@github.com:username/repo.git
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
sudo mkdir -p /opt/computing-marketplace
sudo chown $USER:$USER /opt/computing-marketplace
cd /opt/computing-marketplace
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

### 问题 2: Git 操作失败

**错误**: `fatal: repository 'https://github.com/...' not found`

**解决**:
1. 检查 `REPO_URL` 是否正确
2. 确认仓库是公开的或已配置访问权限
3. 测试 Git 连接：
   ```bash
   ssh -p 8222 user@your-server-ip
   git clone https://github.com/username/repo.git /tmp/test
   ```

**错误**: `Could not resolve host: github.com`

**解决**:
- 服务器无法访问 GitHub，需要配置代理或使用 SSH 方式（见步骤 4.1.1）

### 问题 3: 构建失败

### 问题 3: 容器启动失败

**错误**: `Container is not running`

**解决**:
```bash
# 在服务器上查看日志
ssh -p 8222 user@your-server-ip
cd /opt/computing-marketplace
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
   - 定期轮换 SSH 密钥（建议每 90 天）
   - 使用强密码和密钥

2. **限制 SSH 密钥使用**:
   - 为 GitHub Actions 专用密钥设置权限限制
   - 在服务器上使用 `~/.ssh/authorized_keys` 的 `command` 选项限制命令

3. **监控部署日志**:
   - 定期检查 GitHub Actions 日志
   - 监控服务器资源使用

4. **备份重要数据**:
   - 定期备份应用数据
   - 保留关键配置文件的版本控制

5. **服务器安全**:
   - 定期更新系统和 Docker 版本
   - 配置防火墙规则
   - 禁用 SSH 密码登录，仅使用密钥认证

## 手动部署

如果需要手动部署到服务器而不通过 GitHub Actions：

```bash
# 在服务器上执行
cd /opt/computing-marketplace

# 重新构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 清理旧镜像
docker image prune -af
```

## 工作流程说明

当前的 CI/CD 工作流程：

```
Push to main branch
       ↓
[GitHub Actions 触发]
       ↓
[SSH 连接服务器]
       ↓
[服务器从 GitHub 拉取最新代码] (git pull)
       ↓
[在服务器上构建 Docker 镜像]
       ↓
[停止旧容器]
       ↓
[启动新容器]
       ↓
[健康检查]
       ↓
[部署完成]
```

**优势**：
- ✅ **速度快**：服务器直接从 GitHub 拉取，不经过 Actions 中转
- ✅ **节省流量**：Git 只传输变更的文件
- ✅ **可靠性高**：利用 Git 的增量传输机制

## 修改工作流

如果需要自定义部署流程，编辑 `.github/workflows/deploy.yml`：

```yaml
# 修改部署路径
env:
  DEPLOY_PATH: /your/custom/path

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
- [Docker 文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [SSH 密钥管理](https://www.ssh.com/academy/ssh/key)
- [rsync 文档](https://rsync.samba.org/documentation.html)
