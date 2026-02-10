0. 总则（最高优先级）
	1.	安全第一：不得引入任何会泄露密钥、token、账号、内网地址的改动。
	2.	稳定第一：默认不改变现有行为；如需改变必须明确说明并提供回滚方案。
	3.	最小改动原则：能改 1 行不改 10 行；能局部修复不做大重构。
	4.	可交付原则：所有输出必须能运行、能编译、能通过测试。

⸻

1. 代码修改边界（Scope）
	1.	不允许修改以下内容，除非用户明确要求：
	•	CI/CD pipeline 配置
	•	数据库 schema / migration
	•	权限鉴权逻辑
	•	计费、用量统计、审计日志逻辑
	2.	不允许删除功能代码，只能 deprecate 或 feature flag。
	3.	对于核心模块（网关、计费、鉴权、调度），改动必须做到：
	•	兼容旧接口
	•	不破坏已有 API contract

⸻

2. 依赖管理（Dependencies）
	1.	默认 禁止新增依赖，除非：
	•	该依赖是行业标准（如 axios、zod）
	•	且能明显降低复杂度
	2.	允许升级依赖，但必须：
	•	说明升级原因
	•	说明潜在风险
	3.	lockfile（package-lock / pnpm-lock / yarn.lock）：
	•	默认不改
	•	若必须改，必须解释原因

⸻

3. 编码规范（Coding Standard）
	1.	TypeScript 项目默认：
	•	开启 strict
	•	禁止 any（除非明确说明原因）
	2.	React 项目默认：
	•	hooks 依赖必须正确
	•	组件必须可复用，避免重复代码
	3.	后端项目默认：
	•	所有接口必须返回一致的错误结构
	•	日志必须结构化（JSON 或统一格式）
	4.	禁止硬编码：
	•	URL、IP、token、用户名、密码
	•	环境相关路径

⸻

4. 业务逻辑规则（Business Rules）
	1.	所有模型调用必须支持：
	•	timeout
	•	retry（可配置）
	•	fallback（可配置）
	2.	所有关键链路必须有：
	•	traceId/requestId
	•	日志埋点
	3.	所有计费/用量统计必须：
	•	以 token 为主口径
	•	支持按租户/用户/应用聚合

⸻

5. 测试与验证（Testing）
	1.	代码修改后必须保证：
	•	能 build
	•	能 lint
	•	单测能通过（如果项目有）
	2.	涉及接口变更必须提供：
	•	curl 示例
	•	mock 数据
	3.	涉及性能优化必须提供：
	•	TTFT（首 token 时间）
	•	TPS（token/s）
	•	P95/P99 延迟指标（如可测）

⸻

6. 错误处理与容灾（Reliability）
	1.	所有外部依赖调用必须处理：
	•	超时
	•	限流
	•	网络异常
	•	5xx 错误
	2.	对于网关类项目必须支持：
	•	circuit breaker（熔断）
	•	bulkhead（隔离）
	•	backpressure（背压）
	3.	出错信息必须做到：
	•	对用户友好（不泄露内部细节）
	•	对运维可定位（带 traceId）

⸻

7. 日志、审计与安全（Security）
	1.	禁止打印敏感信息：
	•	Authorization header
	•	API key
	•	用户密码
	•	个人隐私数据
	2.	必须保留审计日志（如项目支持）：
	•	谁调用了什么模型
	•	消耗多少 token
	•	发生了什么错误
	3.	对于输入输出必须支持：
	•	prompt 注入防护（如可实现）
	•	输出过滤（如需）

⸻

8. 文档与交付（Documentation）
	1.	修改必须同步更新：
	•	README（如涉及运行方式）
	•	配置说明（如新增 env）
	2.	必须输出可复制的操作步骤：
	•	安装
	•	启动
	•	验证命令
	3.	必须包含回滚建议：
	•	如何恢复旧版本
	•	如何恢复配置
9. Git 提交与 PR 规范（如果适用）
 a.commit message 推荐格式：
feat: xxx
fix: xxx
chore: xxx
perf: xxx
refactor: xxx
b.PR 描述必须包含：
背景
	•	修改点
	•	风险点
	•	测试结果
	•	回滚方案
10. Claude Code 工作方式（Agent Workflow）
Claude 必须按以下顺序工作：
	1.	先理解需求：若需求不清晰，必须先问问题再动代码
	2.	先定位再修改：先找到入口文件和调用链
	3.	小步提交：一次只解决一个问题
	4.	修改后自检：跑 lint/test/build 或给出无法运行的原因
	5.	输出可交付结果：提供最终 diff 或完整文件内容
11. 输出格式约束（Output Contract）

Claude 输出代码修改时必须提供：
	•	修改文件列表
	•	每个文件改动说明
	•	如有配置改动：必须列出 env 变量说明
	•	如有 API 改动：必须列出请求/响应示例
附录：推荐环境变量命名规范
	•	APP_ENV
	•	LOG_LEVEL
	•	LLM_PROVIDER
	•	LLM_BASE_URL
	•	LLM_API_KEY
	•	LLM_TIMEOUT_MS
	•	LLM_MAX_RETRIES
	•	LLM_FALLBACK_MODEL
	•	REDIS_URL
	•	DATABASE_URL
12.任务完成后自动提交代码