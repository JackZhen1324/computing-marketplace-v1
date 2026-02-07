# HTTPS 部署指南 - HTTP/2 支持

## 问题修复

已修复 `ERR_HTTP2_PROTOCOL_ERROR` 错误，现在支持通过 `https://zqian24.synology.me:9210` 访问。

## 架构变更

### 之前（有问题）
```
浏览器 → HTTPS://zqian24.synology.me:9210
         ↓ (Synology 反向代理: HTTPS → HTTP)
    HTTP://192.168.1.99:9210
         ↓
    Docker nginx (仅 HTTP/1.1) ❌
         ↓
    ERR_HTTP2_PROTOCOL_ERROR
```

### 现在（已修复）
```
浏览器 → HTTPS://zqian24.synology.me:9210
         ↓ (Synology 反向代理: HTTPS → HTTPS)
    HTTPS://192.168.1.99:9210
         ↓
    Docker nginx (HTTP/2 + SSL) ✅
```

## 技术变更

### 1. nginx.conf 更新
- 添加 HTTPS 服务器配置（监听 8443 端口）
- 启用 HTTP/2 支持：`listen 8443 ssl http2`
- 配置 SSL 证书路径
- 添加 HSTS 安全头
- 更新 API proxy 的 `X-Forwarded-Proto` 为 `https`

### 2. Dockerfile 更新
- 在构建时生成自签名 SSL 证书
- 暴露 HTTPS 端口 8443
- 更新健康检查使用 HTTPS

### 3. docker-compose.yml 更新
- 端口映射：`9210:8443`（主机端口 9210 映射到容器 HTTPS 端口 8443）

## 部署步骤

### Step 1: 重新构建并启动容器

```bash
cd frontend
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Step 2: 更新群晖反向代理配置

1. 打开 **控制面板** → **应用程序门户** → **反向代理服务器**

2. 找到并编辑现有的 `zqian24.synology.me` 反向代理规则

3. 修改配置如下：

   | 配置项 | 值 |
   |--------|-----|
   | 反向代理名称 | computing-marketplace |
   | 源协议 | **HTTPS** |
   | 源主机名 | zqian24.synology.me |
   | 源端口 | **9210** |
   | 后端协议 | **HTTPS** ← 重要！ |
   | 后端主机名 | 192.168.1.99 |
   | 后端端口 | **9210** |
   | 启用 HSTS | ✅ |
   | HTTP/2 | ✅ |

4. **自定义头部**（重要）：

   ```
   X-Forwarded-Proto: https
   X-Forwarded-Host: $host
   X-Forwarded-For: $proxy_add_x_forwarded_for
   ```

5. 保存配置

### Step 3: 验证部署

#### 3.1 检查容器状态
```bash
docker-compose ps
# 应该看到所有服务都是 "Up" 状态
```

#### 3.2 检查 nginx HTTPS 配置
```bash
docker-compose exec frontend nginx -t
# 应该显示: configuration file /etc/nginx/conf.d/default.conf test is successful
```

#### 3.3 检查 SSL 证书
```bash
docker-compose exec frontend ls -la /etc/nginx/ssl/
# 应该看到 cert.pem 和 key.pem
```

#### 3.4 测试 HTTPS 访问（本地）
```bash
curl -k https://localhost:9210/health
# 应该返回: healthy
```

#### 3.5 测试通过域名访问
```bash
curl https://zqian24.synology.me:9210/health
# 应该返回: healthy
```

#### 3.6 浏览器测试
1. 打开浏览器访问: `https://zqian24.synology.me:9210`
2. 打开开发者工具 → Network 标签
3. 刷新页面
4. 检查：
   - ✅ 所有资源成功加载（无 ERR_HTTP2_PROTOCOL_ERROR）
   - ✅ 协议显示为 `h2`（HTTP/2）
   - ✅ API 请求正常返回

## SSL 证书说明

### 当前使用：自签名证书

Docker 容器使用构建时生成的自签名证书。这在开发环境可以工作，但浏览器会显示证书警告。

### 生产环境：使用真实证书

**推荐方案**：从 Synology 导出证书并挂载到 Docker 容器

1. **导出 Synology 证书**：
   ```
   控制面板 → 安全性 → 证书
   → 选择 zqian24.synology.me 的证书
   → 导出为 .zip 文件
   ```

2. **解压证书文件**：
   ```bash
   unzip certificate.zip
   # 得到 cert.pem 和 key.pem
   ```

3. **创建证书目录**：
   ```bash
   mkdir -p frontend/nginx-ssl
   cp cert.pem frontend/nginx-ssl/
   cp key.pem frontend/nginx-ssl/
   ```

4. **更新 docker-compose.yml**：
   ```yaml
   frontend:
     volumes:
       - ./nginx-ssl:/etc/nginx/ssl:ro
   ```

5. **重新启动**：
   ```bash
   docker-compose up -d --force-recreate
   ```

### 替代方案：Let's Encrypt

如果使用 Let's Encrypt，需要使用 Certbot 自动续期。这需要更复杂的设置，建议使用 Synology 的证书管理功能。

## 端口分配总结

| 服务 | 容器端口 | 主机端口 | 协议 |
|------|---------|---------|------|
| Frontend (HTTPS) | 8443 | 9210 | HTTPS + HTTP/2 |
| Backend (API) | 3000 | 9211 | HTTP |
| PostgreSQL | 5432 | 5434 | TCP |
| Redis | 6379 | 6379 | TCP |
| Adminer | 8080 | 8081 | HTTP |

## 常见问题

### Q1: 浏览器仍然显示 ERR_HTTP2_PROTOCOL_ERROR

**检查清单**：
1. ✅ 群晖反向代理的"后端协议"是否设置为 **HTTPS**
2. ✅ 容器是否成功启动：`docker-compose ps`
3. ✅ SSL 证书是否存在：`docker-compose exec frontend ls -la /etc/nginx/ssl/`

### Q2: API 请求返回 CORS 错误

**检查**：
- `CORS_ORIGIN` 环境变量是否包含 `https://zqian24.synology.me`
- 后端容器的日志：`docker-compose logs backend --tail 50`

### Q3: 页面可以访问，但样式没有加载

**原因**：浏览器的 Mixed Content 策略

**解决**：确保所有资源都通过 HTTPS 加载，检查 nginx 配置中的 `X-Forwarded-Proto` 头。

## 验证清单

部署完成后，确认以下所有项都通过：

- [ ] `docker-compose ps` 显示所有服务为 Up 状态
- [ ] `curl -k https://localhost:9210/health` 返回 `healthy`
- [ ] `curl https://zqian24.synology.me:9210/health` 返回 `healthy`
- [ ] `curl https://zqian24.synology.me:9210/api/navigation` 返回导航数据
- [ ] 浏览器访问 `https://zqian24.synology.me:9210` 无证书警告（如使用真实证书）
- [ ] 浏览器开发者工具 Network 标签显示协议为 `h2`
- [ ] 控制台无 ERR_HTTP2_PROTOCOL_ERROR 错误
- [ ] API 请求正常返回数据（无 CORS 错误）

## 完成后

如果所有验证都通过，恭喜！您已成功配置 HTTPS + HTTP/2 支持。

现在可以安全地通过 `https://zqian24.synology.me:9210` 访问算力超市应用。
