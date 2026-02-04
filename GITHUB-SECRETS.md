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
| `APP_URL` | 应用访问地址 | 如: `http://your-domain.com:3000` |

## 可选的 Secrets

| Secret 名称 | 默认值 | 说明 |
|------------|--------|------|
| `DEPLOY_PATH` | `/opt/computing-marketplace` | 服务器部署目录 |
| `APP_PORT` | `3000` | 应用监听端口 |

## 示例配置

假设你的配置如下：
- 服务器 IP: `123.45.67.89`
- SSH 端口: `8222` ⭐
- SSH 用户: `root`
- 应用地址: `http://123.45.67.89:3000`

则你需要配置的 Secrets：

```
SERVER_HOST = 123.45.67.89
SERVER_USER = root
SERVER_PORT = 8222 ⭐
SSH_PRIVATE_KEY = -----BEGIN OPENSSH PRIVATE KEY-----
                ...完整的私钥内容...
                -----END OPENSSH PRIVATE KEY-----
APP_URL = http://123.45.67.89:3000
```

## 注意事项

1. **SERVER_PORT**: 你的服务器使用自定义端口 `8222`，必须配置此 secret
2. **SSH_PRIVATE_KEY**: 复制私钥时，要包含 `-----BEGIN` 和 `-----END` 行
3. **APP_URL**: 用于健康检查，确保 URL 可以正常访问
4. **无需 Docker Hub**: 镜像在服务器上直接构建，不需要 Docker Hub 访问

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

---

详细配置指南请查看：[CI-CD-SETUP.md](./CI-CD-SETUP.md)
