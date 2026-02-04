.PHONY: help prod dev restart stop logs status cleanup build test deploy

# 默认目标
.DEFAULT_GOAL := help

# 颜色定义
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
NC     := \033[0m # No Color

##@ 常用命令

help: ## 显示帮助信息
	@echo "$(BLUE)算力超市前端 - Docker 部署$(NC)"
	@echo ""
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'
	@echo ""

prod: ## 启动生产环境
	@echo "$(GREEN)🚀 启动生产环境...$(NC)"
	@./start-prod.sh

dev: ## 启动开发环境（支持热重载）
	@echo "$(GREEN)🔧 启动开发环境...$(NC)"
	@./start-dev.sh

restart: ## 重启生产环境
	@echo "$(YELLOW)🔄 重启生产环境...$(NC)"
	@./restart-prod.sh

stop: ## 停止生产环境
	@echo "$(YELLOW)🛑 停止生产环境...$(NC)"
	@./stop-prod.sh

stop-dev: ## 停止开发环境
	@echo "$(YELLOW)🛑 停止开发环境...$(NC)"
	@./stop-dev.sh

##@ 监控命令

logs: ## 查看生产环境日志
	@echo "$(BLUE)📋 生产环境日志 (Ctrl+C 退出)$(NC)"
	@docker-compose logs -f

logs-dev: ## 查看开发环境日志
	@echo "$(BLUE)📋 开发环境日志 (Ctrl+C 退出)$(NC)"
	@docker-compose -f docker-compose.dev.yml logs -f

status: ## 查看容器状态
	@./status.sh

ps: ## 快速查看运行中的容器
	@docker-compose ps

##@ 构建命令

build: ## 构建生产镜像
	@echo "$(GREEN)🔨 构建生产镜像...$(NC)"
	@docker-compose build

build-dev: ## 构建开发镜像
	@echo "$(GREEN)🔨 构建开发镜像...$(NC)"
	@docker-compose -f docker-compose.dev.yml build

rebuild: ## 重新构建（无缓存）
	@echo "$(GREEN)🔨 重新构建（无缓存）...$(NC)"
	@docker-compose build --no-cache

##@ 部署命令

deploy: ## 完整部署生产环境
	@echo "$(GREEN)🚀 部署生产环境...$(NC)"
	@./deploy.sh prod

deploy-dev: ## 完整部署开发环境
	@echo "$(GREEN)🚀 部署开发环境...$(NC)"
	@./deploy.sh dev

##@ 维护命令

cleanup: ## 清理Docker资源（交互式）
	@./cleanup.sh

prune: ## 清理未使用的Docker资源（自动）
	@echo "$(YELLOW)🧹 清理未使用的资源...$(NC)"
	@docker system prune -f

clean: clean-img clean-cont ## 清理镜像和容器

clean-cont: ## 停止并删除所有容器
	@echo "$(YELLOW)🗑️  清理容器...$(NC)"
	@docker-compose down --remove-orphans 2>/dev/null || true
	@docker-compose -f docker-compose.dev.yml down --remove-orphans 2>/dev/null || true

clean-img: ## 删除项目镜像
	@echo "$(YELLOW)🗑️  清理镜像...$(NC)"
	@docker rmi computing-marketplace:test 2>/dev/null || echo "  未找到镜像"

##@ 测试命令

test: ## 健康检查
	@echo "$(BLUE)🔍 健康检查...$(NC)"
	@curl -f http://localhost:3000/health && echo "$(GREEN)✅ 健康$(NC)" || echo "$(YELLOW)⚠️  不健康$(NC)"

test-dev: ## 开发环境健康检查
	@echo "$(BLUE)🔍 健康检查...$(NC)"
	@curl -f http://localhost:5173 && echo "$(GREEN)✅ 服务正常$(NC)" || echo "$(YELLOW)⚠️  服务异常$(NC)"

shell: ## 进入容器shell
	@docker exec -it computing-marketplace-frontend sh

shell-dev: ## 进入开发容器shell
	@docker exec -it computing-marketplace-frontend-dev sh

##@ 开发命令

dev-local: ## 本地开发（不使用Docker）
	@echo "$(GREEN)🔧 启动本地开发服务器...$(NC)"
	@npm run dev

install: ## 安装依赖
	@echo "$(GREEN)📦 安装依赖...$(NC)"
	@npm install

##@ 组合命令

all: clean-img build prod ## 完整重建并启动生产环境

all-dev: clean-img build-dev dev ## 完整重建并启动开发环境

refresh: restart logs ## 重启并查看日志

up: build prod ## 构建并启动生产环境
