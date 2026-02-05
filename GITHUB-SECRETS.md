# GitHub Secrets 配置清单

## 快速配置指南

进入你的 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

## 必需的 Secrets

| Secret 名称 | 值 | 获取方法 |
|------------|-----|---------|
| `SERVER_HOST` | 服务器 IP 地址 | 如: `192.168.1.100` 或 `example.com` |
| `SERVER_USER` | SSH 登录用户名 | 如: `root`, `ubuntu` |
| `SERVER_PORT` | `8222` | 你的 SSH 端口 ⭐ |
| `SSH_PRIVATE_KEY` | SSH 私钥完整内容 | 运行 `cat ~/.ssh/github_actions_key` |
| `REPO_URL` | GitHub 仓库地址 | 如: `https://github.com/username/repo.git` |
| `APP_URL` | 应用访问地址 | 如: `http://your-domain.com:3000` |

## 可选的 Secrets

| Secret 名称 | 默认值 | 说明 |
|------------|--------|------|
| `DEPLOY_PATH` | `/opt/computing-marketplace/computing-marketplace-v1` | 服务器部署目录 |
| `APP_PORT` | `3000` | 应用监听端口 |
| `BRANCH` | `main` | Git 分支名 |

## 示例配置

假设你的配置如下：
- 服务器 IP: `123.45.67.89`
- SSH 端口: `8222` ⭐
- SSH 用户: `root`
- GitHub 仓库: `https://github.com/username/computing-marketplace.git`
- 应用地址: `http://123.45.67.89:3000`

则你需要配置的 Secrets：

```
SERVER_HOST = 123.45.67.89
SERVER_USER = root
SERVER_PORT = 8222 ⭐
SSH_PRIVATE_KEY = -----BEGIN OPENSSH PRIVATE KEY-----
                ...完整的私钥内容...
                -----END OPENSSH PRIVATE KEY-----
REPO_URL = https://github.com/username/computing-marketplace.git
APP_URL = http://123.45.67.89:3000
```

**⚠️ 重要**: 将 `REPO_URL` 修改为你实际的 GitHub 仓库地址！

## 注意事项

1. **SERVER_PORT**: 你的服务器使用自定义端口 `8222`，必须配置此 secret
2. **SSH_PRIVATE_KEY**: 复制私钥时，要包含 `-----BEGIN` 和 `-----END` 行
3. **REPO_URL**: **必须配置**！使用完整的 GitHub 仓库地址（HTTPS 或 SSH 都可以）
4. **APP_URL**: 用于健康检查，确保 URL 可以正常访问
5. **服务器访问 GitHub**: 确保服务器能访问 GitHub，首次会自动 clone 代码
6. **无需 Docker Hub**: 镜像在服务器上直接构建，不需要 Docker Hub 访问
7. **部署速度快**: 服务器直接从 GitHub 拉取代码，不通过 Actions 中转

## 测试配置

配置完成后，推送代码触发部署：

```bash
git add .
git commit -m "feat: configure CI/CD"
git push origin main
```

然后在 GitHub 仓库的 **Actions** 标签查看部署状态。

## 常见问题

**Q: 如何确认 SSH 私钥配置正确？**

A: 在本地测试：
```bash
ssh -i ~/.ssh/github_actions_key -p 8222 root@your-server-ip
```
如果能成功登录，说明密钥配置正确。

**Q: 部署失败提示 "Permission denied"？**

A: 检查以下几点：
1. `SERVER_PORT` 是否设置为 `8222`
2. `SSH_PRIVATE_KEY` 是否完整（包含 BEGIN 和 END 行）
3. 公钥是否已添加到服务器的 `~/.ssh/authorized_keys`

**Q: 如何查看服务器上公钥是否配置正确？**

A: 登录服务器执行：
```bash
cat ~/.ssh/authorized_keys
```
应该能看到你的公钥内容。

**Q: 部署很慢怎么办？**

A: 首次部署会在服务器上构建镜像，可能需要 5-10 分钟。后续部署会快很多。

**Q: 服务器无法访问 GitHub 怎么办？**

A: 有以下解决方案：
1. **配置代理**: 在服务器上配置 git 代理
   ```bash
   git config --global http.proxy http://proxy-server:port
   git config --global https.proxy https://proxy-server:port
   ```
2. **使用 SSH 方式**: 将 `REPO_URL` 改为 SSH 地址
   ```
   git@github.com:username/repo.git
   ```
3. **使用镜像**: 如果有 GitHub 镜像可用，修改 `REPO_URL` 为镜像地址

**Q: 如何确认仓库地址正确？**

A: 在服务器上测试：
```bash
git clone https://github.com/yourusername/your-repo.git /tmp/test-repo
```
如果成功克隆，说明地址正确。

---

详细配置指南请查看：[CI-CD-SETUP.md](./CI-CD-SETUP.md)
