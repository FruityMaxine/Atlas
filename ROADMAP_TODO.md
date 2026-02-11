# ROADMAP TODO: 代码规范统一与质量修复总清单（超长执行版）

> 文档定位：本文件是 `Atlas` 项目在 `src + src-tauri` 范围内的“规范治理主清单”，只覆盖代码规范与质量修复，不包含新功能开发。
>
> 维护方式：任务完成后直接勾选，并在“结果记录位”填写命令输出摘要与提交哈希（如有）。

---

## 1. 标题与说明（目标、范围、非目标）

### 1.1 总目标（Goal）

在不引入对外公共 API 破坏性变更的前提下，完成前端与 Rust 子工程的规范统一、构建稳定、文档一致化，建立可持续执行的质量门禁。

### 1.2 范围（In Scope）

1. 目录范围：`src/`、`src-tauri/`、根目录规范文件（如 `.editorconfig`、`.prettierrc`）。
2. 任务类型：代码风格统一、工具链补齐、构建报错清零、文档一致性修复、可执行验收流程沉淀。
3. 质量目标：
   - `npm run build` 通过
   - `npx prettier --check` 通过
   - `cargo fmt --check` 通过
   - `cargo clippy -- -D warnings` 通过
   - 关键文档链接与版本信息一致

### 1.3 非目标（Out of Scope）

1. 不开发新业务功能。
2. 不新增/重构 `modules/` 生态功能。
3. 不做 UI 风格重设计。
4. 不引入大型架构迁移（如路由体系重做、状态库替换）。

### 1.4 公共 API / 接口策略（强约束）

1. 默认不引入对外公共 API 变更。
2. 仅允许内部规范性类型增强（例如 `PageId` 联合类型）且保持外部调用兼容。
3. 若后续任务涉及接口调整，必须先在本文新增“兼容性说明”条目并评审通过后执行。

### 1.5 执行原则（Principles）

1. 阻塞项优先：先清理会导致 build/test 失败的问题，再做风格类统一。
2. 格式与逻辑分离：格式化变更与业务逻辑变更分开提交。
3. 可验证优先：每个任务必须有命令级验收，不接受“感觉完成”。
4. 可回滚优先：每个阶段必须定义最小回滚单元。

---

## 2. 当前基线快照（已验证事实）

> 说明：以下事实来自本地命令复核（当前工作区状态），用于锁定起始基线。

### 2.1 构建与检查现状

1. `npm run build` 当前失败，报错：
   - `src/App.tsx:16`：`Download` 未使用（TS6133）
   - `src/contexts/NavigationContext.tsx:8`：`React` 未使用（TS6133）
   - `src/pages/SettingsPage/SettingsPage.tsx:6`：`RefreshCw` 未使用（TS6133）
2. `npx vite build` 可通过（前端打包层可构建）。
3. `cargo check` 可通过。
4. `cargo clippy -- -D warnings` 可通过。
5. `cargo fmt --check` 未通过，存在格式差异文件：
   - `src-tauri/src/commands.rs`
   - `src-tauri/src/core/process_manager.rs`
6. `npx prettier --check "src/**/*.{ts,tsx,css}" "README.md"` 检测到 55 个文件不符合格式规范。

### 2.2 规范工具配置现状

1. 根目录未检测到：
   - `.editorconfig`
   - `.prettierrc`
   - `eslint.config.js` / `eslint.config.mjs`
   - `.eslintrc` / `.eslintrc.json`
2. `package.json` 当前无 `lint` / `format:check` / `format` scripts。

### 2.3 文档与版本一致性现状

1. 版本号不一致：
   - `package.json:4` -> `0.2.1`
   - `README.md:5` -> `v0.2.0`
   - `src/pages/SettingsPage/SettingsPage.tsx:309` -> `0.2.0`
2. README 存在引用不存在文档的风险项（待在 M-015~M-017 清理）。

### 2.4 基线冻结声明

从本文件创建之时起，所有规范治理任务以本基线为参照；若中途基线发生变化，需在“变更记录”中登记并标注影响任务 ID。

---

## 3. 执行规则（命名、格式、提交、验收）

### 3.1 任务状态标签（统一）

1. `未开始`
2. `进行中`
3. `已完成`
4. `阻塞`

### 3.2 任务记录模板（统一）

每个任务卡必须包含以下字段：

1. `ID`
2. `优先级`
3. `状态`
4. `目标文件`
5. `变更类型`
6. `子任务`
7. `检查清单`
8. `验收命令`
9. `期望结果`
10. `结果记录位`

### 3.3 代码风格规则（目标态）

1. TypeScript/TSX/CSS 统一由 Prettier 格式化（单引号、分号、尾逗号、固定 printWidth）。
2. TS/TSX 静态质量由 ESLint（含 hooks 规则）保证。
3. Rust 统一使用 `rustfmt` + `clippy`。
4. 行尾策略通过 `.gitattributes` 固定，跨平台提交不再漂移。
5. 编辑器行为通过 `.editorconfig` 固定。

### 3.4 提交规则（目标态）

1. 格式化提交与逻辑提交分离。
2. 每个提交必须引用任务 ID（如 `H-005`）。
3. 同一任务允许多次提交，但必须在任务卡结果位记录最终“闭环命令输出”。

### 3.5 验收规则（目标态）

1. 每个任务完成必须至少执行 1 条验收命令并记录结果。
2. Phase 退出必须执行对应 Gate 命令集合。
3. 若验收失败：任务状态改为 `阻塞`，并新增阻塞原因与处理分支。

### 3.6 阻塞项先清零规则（Hard Rule）

1. `H-001` ~ `H-004` 不允许跳过。
2. 高优先级任务未清零前，不进入中优先级批量整改。
3. 高优先级全部勾选后，方可进行“全量格式化类任务”。

---

## 4. 高优先级任务清单（阻塞项）

> 优先级：高  
> 原则：先恢复构建与工具链，再统一格式和文档基准。

### H-001 | 高 | `src/App.tsx:16`

- [ ] 状态：未开始
- [ ] 目标：删除未使用导入 `Download`
- [ ] 变更类型：无行为变更 / 编译阻塞修复

子任务：

- [ ] H-001.1 定位并移除 `Download` 导入
- [ ] H-001.2 复查该文件是否仍有未使用 symbol
- [ ] H-001.3 执行局部 TypeScript 构建验证

子子任务：

- [ ] H-001.1.a 核对 `src/App.tsx` import 列表
- [ ] H-001.1.b 确认无 `Download` 实际渲染引用
- [ ] H-001.2.a 执行 `npm run build` 观察 TS6133 变化

检查清单：

- [ ] 删除后不引入其他类型错误
- [ ] 该文件 import 顺序保持可读

验收命令：

```bash
npm run build
```

期望结果：

- 不再出现 `src/App.tsx(16,10)` 的 TS6133

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-002 | 高 | `src/contexts/NavigationContext.tsx:8`

- [ ] 状态：未开始
- [ ] 目标：删除未使用默认导入 `React` 或改写使用方式
- [ ] 变更类型：无行为变更 / 编译阻塞修复

子任务：

- [ ] H-002.1 修改 import 为按需命名导入
- [ ] H-002.2 运行构建确认 TS6133 消失
- [ ] H-002.3 快速扫描 `NavigationContext` 引用关系

子子任务：

- [ ] H-002.1.a 仅保留 `createContext/useContext/useState/ReactNode`
- [ ] H-002.2.a 执行 `npm run build`
- [ ] H-002.3.a 记录该 context 是否仍处“未接入”状态

检查清单：

- [ ] 文件行为无变化
- [ ] 无新增 lint 警告

验收命令：

```bash
npm run build
```

期望结果：

- 不再出现 `src/contexts/NavigationContext.tsx(8,8)` 的 TS6133

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-003 | 高 | `src/pages/SettingsPage/SettingsPage.tsx:6`

- [ ] 状态：未开始
- [ ] 目标：删除未使用导入 `RefreshCw`
- [ ] 变更类型：无行为变更 / 编译阻塞修复

子任务：

- [ ] H-003.1 移除 `RefreshCw` 导入
- [ ] H-003.2 检查该行导入列表是否保持一致
- [ ] H-003.3 运行 build 验证

子子任务：

- [ ] H-003.1.a 搜索全文确认无 `RefreshCw` 使用
- [ ] H-003.3.a 执行 `npm run build`

检查清单：

- [ ] 页面运行行为不受影响
- [ ] 未引入新的 TS 错误

验收命令：

```bash
npm run build
```

期望结果：

- 不再出现 `src/pages/SettingsPage/SettingsPage.tsx(6,60)` 的 TS6133

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-004 | 高 | `src/App.tsx:116`

- [ ] 状态：未开始
- [ ] 目标：把文件中部 import 上移到文件头部，统一 import 结构
- [ ] 变更类型：结构规范统一

子任务：

- [ ] H-004.1 将 `SchemaRenderer/parseSchema/demoLayout` 导入移动到顶部
- [ ] H-004.2 按“第三方 -> 本地模块 -> 样式”排序
- [ ] H-004.3 重新执行编译验证

子子任务：

- [ ] H-004.1.a 文件中仅保留顶部 import 区
- [ ] H-004.2.a 对齐既有导入分组风格
- [ ] H-004.3.a 运行 `npm run build`

检查清单：

- [ ] 文件中部无残留 import
- [ ] 业务渲染行为不变

验收命令：

```bash
npm run build
```

期望结果：

- 文件 import 只出现在顶部
- 构建通过（配合 H-001~H-003）

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-005 | 高 | 根目录

- [ ] 状态：未开始
- [ ] 目标：新增 `.prettierrc`
- [ ] 变更类型：工具链补齐

建议最小配置：

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

子任务：

- [ ] H-005.1 新建 `.prettierrc`
- [ ] H-005.2 约束覆盖 `ts/tsx/css/md/json`
- [ ] H-005.3 跑 `prettier --check`

子子任务：

- [ ] H-005.1.a 配置写入并版本化
- [ ] H-005.3.a 记录 warning 数量变化

检查清单：

- [ ] 配置文件可被 `npx prettier` 正常读取
- [ ] 团队约定值明确

验收命令：

```bash
npx prettier --check "src/**/*.{ts,tsx,css}" "README.md"
```

期望结果：

- 命令稳定可执行，输出可复现

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-006 | 高 | 根目录

- [ ] 状态：未开始
- [ ] 目标：新增 `eslint.config.*`（TS + React Hooks 基础规则）
- [ ] 变更类型：工具链补齐

子任务：

- [ ] H-006.1 选择 `eslint.config.js` 或 `eslint.config.mjs`
- [ ] H-006.2 接入 TypeScript parser 与 hooks 规则
- [ ] H-006.3 配置基础忽略项（dist/target）
- [ ] H-006.4 执行 lint

子子任务：

- [ ] H-006.1.a 与当前 Node/ESM 兼容
- [ ] H-006.2.a 至少覆盖 `no-unused-vars` 与 hooks
- [ ] H-006.4.a 输出首轮告警清单

检查清单：

- [ ] lint 命令能执行
- [ ] 规则强度可逐步上线

验收命令：

```bash
npx eslint "src/**/*.{ts,tsx}"
```

期望结果：

- 能产出规则检查结果（可先允许有告警）

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-007 | 高 | `package.json`

- [ ] 状态：未开始
- [ ] 目标：增加 `lint`、`format:check`、`format`
- [ ] 变更类型：执行入口标准化

建议脚本：

```json
{
  "scripts": {
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\" \"README.md\"",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\" \"README.md\""
  }
}
```

子任务：

- [ ] H-007.1 写入 3 个脚本
- [ ] H-007.2 单独执行 3 个脚本验证
- [ ] H-007.3 将命令写入 README 规范章节

子子任务：

- [ ] H-007.1.a 避免覆盖现有脚本
- [ ] H-007.2.a 记录每条命令执行耗时和结果

检查清单：

- [ ] `npm run lint` 可执行
- [ ] `npm run format:check` 可执行
- [ ] `npm run format` 可执行

验收命令：

```bash
npm run lint
npm run format:check
npm run format
```

期望结果：

- 三条命令均可运行

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-008 | 高 | 根目录

- [ ] 状态：未开始
- [ ] 目标：新增 `.editorconfig`（缩进、换行、编码）
- [ ] 变更类型：编辑器行为统一

建议最小规则：

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

子任务：

- [ ] H-008.1 创建并提交 `.editorconfig`
- [ ] H-008.2 在 IDE 中验证生效
- [ ] H-008.3 补充到 README

子子任务：

- [ ] H-008.2.a 新建临时文件检查缩进/换行
- [ ] H-008.3.a 文档明确“编辑器需启用 EditorConfig”

检查清单：

- [ ] 新建文件默认符合规则

验收命令：

```bash
git diff --check
```

期望结果：

- 无尾随空格等基础格式问题

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-009 | 高 | 根目录

- [ ] 状态：未开始
- [ ] 目标：新增 `.gitattributes` 统一行尾策略
- [ ] 变更类型：跨平台协作稳定性

建议策略（示例）：

```gitattributes
* text=auto
*.sh text eol=lf
*.rs text eol=lf
*.ts text eol=lf
*.tsx text eol=lf
*.css text eol=lf
*.md text eol=lf
```

子任务：

- [ ] H-009.1 创建 `.gitattributes`
- [ ] H-009.2 核查现有仓库行尾现状
- [ ] H-009.3 确认后续提交不反复改行尾

子子任务：

- [ ] H-009.2.a 抽样前端与 Rust 文件
- [ ] H-009.3.a 在不同终端环境做一次提交演练（可选）

检查清单：

- [ ] 新旧环境下 diff 稳定

验收命令：

```bash
git status --short
```

期望结果：

- 正常编辑不出现大面积仅行尾变化

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-010 | 高 | `src-tauri`

- [ ] 状态：未开始
- [ ] 目标：执行并提交 `cargo fmt`
- [ ] 变更类型：Rust 格式统一

子任务：

- [ ] H-010.1 执行 `cargo fmt`
- [ ] H-010.2 复查被修改文件范围
- [ ] H-010.3 运行 `cargo fmt --check` 与 `cargo clippy`

子子任务：

- [ ] H-010.1.a 仅格式化，不改逻辑
- [ ] H-010.2.a 重点核查 `commands.rs` 与 `process_manager.rs`

检查清单：

- [ ] Rust 构建与静态检查仍通过

验收命令：

```bash
cargo fmt --check
cargo clippy -- -D warnings
```

期望结果：

- `fmt --check` 无 diff
- `clippy` 0 warnings

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-011 | 高 | `src`

- [ ] 状态：未开始
- [ ] 目标：执行一次性 Prettier 规范化（仅格式）
- [ ] 变更类型：前端格式统一

子任务：

- [ ] H-011.1 先跑 `format:check` 获取基线
- [ ] H-011.2 再跑 `format` 批量修复
- [ ] H-011.3 复跑 `format:check` 校验清零

子子任务：

- [ ] H-011.1.a 记录 warning 文件数
- [ ] H-011.3.a 记录 warning 归零结果

检查清单：

- [ ] 不做业务逻辑改动
- [ ] 大 diff 拆分提交

验收命令：

```bash
npx prettier --write "src/**/*.{ts,tsx,css}" "README.md"
npx prettier --check "src/**/*.{ts,tsx,css}" "README.md"
```

期望结果：

- `--check` 0 warnings

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-012 | 高 | 根目录 / `README.md`

- [ ] 状态：未开始
- [ ] 目标：在 README 增加“真实生效的规范工具”章节
- [ ] 变更类型：文档与代码一致化

子任务：

- [ ] H-012.1 列出真实生效的工具（Prettier/ESLint/rustfmt/clippy）
- [ ] H-012.2 给出项目内可执行命令
- [ ] H-012.3 明确失败时定位顺序

子子任务：

- [ ] H-012.2.a 与 `package.json` scripts 严格对应
- [ ] H-012.3.a 增加“常见失败样例与处理”

检查清单：

- [ ] 文档不再与仓库真实配置冲突

验收命令：

```bash
rg -n "ESLint|Prettier|rustfmt|clippy|format:check|npm run lint" README.md
```

期望结果：

- 章节信息完整、可执行

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-013 | 高 | 根目录 / `README.md`

- [ ] 状态：未开始
- [ ] 目标：加入最小质量门禁顺序说明
- [ ] 变更类型：流程标准化

门禁顺序：

```text
format:check -> lint -> build -> cargo check
```

子任务：

- [ ] H-013.1 在 README 固定门禁顺序
- [ ] H-013.2 给出失败中断策略（Fail Fast）
- [ ] H-013.3 给出本地执行与 CI 对齐建议

子子任务：

- [ ] H-013.1.a 顺序在文档中显式编号
- [ ] H-013.2.a 每步失败的快速定位命令

检查清单：

- [ ] 新人照文档可完整走通

验收命令：

```bash
rg -n "format:check -> lint -> build -> cargo check" README.md
```

期望结果：

- 质量门禁顺序可被检索到

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-014 | 高 | `README.md` / `src/pages/SettingsPage/SettingsPage.tsx`

- [ ] 状态：未开始
- [ ] 目标：修正版本号与代码显示版本不一致策略
- [ ] 变更类型：文档一致性修复

子任务：

- [ ] H-014.1 定义唯一版本来源（建议 `package.json`）
- [ ] H-014.2 修正文档版本展示
- [ ] H-014.3 修正 UI 手写版本展示（或改为构建注入）

子子任务：

- [ ] H-014.1.a 记录“版本来源单一化”决策
- [ ] H-014.3.a 避免硬编码散落

检查清单：

- [ ] 仓库内版本字符串一致

验收命令：

```bash
rg -n "0\\.2\\.0|0\\.2\\.1|\\*\\*版本\\*\\*" README.md src/pages/SettingsPage/SettingsPage.tsx package.json
```

期望结果：

- 版本来源规则一致

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### H-015 | 高 | 根目录 / `ROADMAP_TODO.md`

- [ ] 状态：进行中
- [ ] 目标：建立“阻塞项先清零”规则并固化在本文件
- [x] H-015.1 规则已写入第 3.6 节
- [ ] H-015.2 后续执行中严格遵守

检查清单：

- [ ] 所有高优先级任务最终勾选完成

验收命令：

```bash
rg -n "阻塞项先清零规则|H-001|H-015" ROADMAP_TODO.md
```

期望结果：

- 规则存在且高优任务链路完整

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

## 5. 中优先级任务清单（一致性与质量提升）

> 优先级：中  
> 原则：在构建稳定后做体验一致性、i18n 与文档治理。

### M-001 ~ M-008：SettingsPage 硬编码文案 i18n 化

统一目标：将以下硬编码文本迁移至 i18n keys，避免语言切换时遗漏。

任务列表：

- [ ] M-001 | 中 | `src/pages/SettingsPage/SettingsPage.tsx:253` | “开发者选项”改 i18n key
- [ ] M-002 | 中 | `src/pages/SettingsPage/SettingsPage.tsx:258` | “组件页面”改 i18n key
- [ ] M-003 | 中 | `src/pages/SettingsPage/SettingsPage.tsx:302` | “关于”改 i18n key
- [ ] M-004 | 中 | `src/pages/SettingsPage/SettingsPage.tsx:303` | “应用信息和版本号”改 i18n key
- [ ] M-005 | 中 | `src/pages/SettingsPage/SettingsPage.tsx:292` | `confirmTitle` 改 i18n key
- [ ] M-006 | 中 | `src/pages/SettingsPage/SettingsPage.tsx:293` | `confirmMessage` 改 i18n key
- [ ] M-007 | 中 | `src/pages/SettingsPage/SettingsPage.tsx:294` | `confirmButtonText` 改 i18n key
- [ ] M-008 | 中 | `src/pages/SettingsPage/SettingsPage.tsx:295` | `cancelButtonText` 改 i18n key

通用子任务：

- [ ] M-001.1~M-008.1 新增 locale keys（`zh-CN` 先行，其他语言可回退）
- [ ] M-001.2~M-008.2 替换组件调用为 `t('key', 'fallback')`
- [ ] M-001.3~M-008.3 语言切换回归验证

通用子子任务：

- [ ] 抽样验证 `zh-CN / en-US / lol-US / en-UD / tlh`
- [ ] 避免 key 命名风格不一致（建议 `settings.xxx`）

通用检查清单：

- [ ] 业务页无新增硬编码中文文案
- [ ] locale 文件 key 完整

验收命令：

```bash
rg -n "开发者选项|组件页面|关于|应用信息和版本号|确认重置|确定要重置吗|取消" src/pages/SettingsPage/SettingsPage.tsx
```

期望结果：

- 上述文案仅出现在 locale 文件中（或只剩 fallback）

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-009 | 中 | `src`

- [ ] 状态：未开始
- [ ] 目标：统一 UI 提示替代原生 `alert/confirm`
- [ ] 变更类型：交互一致性提升

子任务：

- [ ] M-009.1 盘点 `alert/confirm` 使用点
- [ ] M-009.2 统一切换到现有 Toast/Modal 体系
- [ ] M-009.3 保持原行为语义（提示/确认）不变

子子任务：

- [ ] M-009.1.a 分页统计（Settings、ComponentShowcase）
- [ ] M-009.2.a 先替换业务页，演示页后替换

检查清单：

- [ ] 业务页不再直接调用浏览器原生弹窗

验收命令：

```bash
rg -n "\\b(alert|confirm)\\(" src
```

期望结果：

- 业务页调用清零，演示页按策略保留或迁移

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-010 | 中 | `src/App.tsx`

- [ ] 状态：未开始
- [ ] 目标：减少 inline style，迁移到样式文件或主题 token
- [ ] 变更类型：风格一致性提升

子任务：

- [ ] M-010.1 梳理所有 `style={{...}}` 块
- [ ] M-010.2 提取为 className + CSS 变量
- [ ] M-010.3 确保视觉结果一致

子子任务：

- [ ] M-010.1.a 区分结构样式与动态样式
- [ ] M-010.2.a 动态样式最小保留（仅必要值）

检查清单：

- [ ] 核心布局不依赖大段内联样式

验收命令：

```bash
rg -n "style=\\{\\{" src/App.tsx
```

期望结果：

- 行数显著减少，仅保留必要动态 style

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-011 | 中 | `src/pages/HomePage/HomePage.tsx`

- [ ] 状态：未开始
- [ ] 目标：清理演示性质内联样式并统一规范
- [ ] 变更类型：页面一致性提升

子任务：

- [ ] M-011.1 识别演示级样式
- [ ] M-011.2 合并到 `HomePage.css`
- [ ] M-011.3 与全局主题变量对齐

子子任务：

- [ ] M-011.1.a 保留必须的动态颜色映射
- [ ] M-011.2.a 清理无意义 style 片段

检查清单：

- [ ] 页面视觉不回退

验收命令：

```bash
rg -n "style=\\{\\{" src/pages/HomePage/HomePage.tsx
```

期望结果：

- 内联样式仅剩必要动态部分

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-012 | 中 | `src`

- [ ] 状态：未开始
- [ ] 目标：统一 import 分组顺序
- [ ] 变更类型：代码可读性提升

子任务：

- [ ] M-012.1 定义分组规则（第三方 / 内部 / 样式）
- [ ] M-012.2 批量调整核心文件
- [ ] M-012.3 绑定 ESLint 插件或规则

检查清单：

- [ ] 同类文件导入顺序一致

验收命令：

```bash
rg -n "^import " src/App.tsx src/components/layout/Sidebar/Sidebar.tsx src/pages/SettingsPage/SettingsPage.tsx
```

期望结果：

- 抽样文件分组一致

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-013 | 中 | `src`

- [ ] 状态：未开始
- [ ] 目标：统一注释风格（JSDoc 与行注释边界）
- [ ] 变更类型：可维护性提升

子任务：

- [ ] M-013.1 规定“导出 API 使用 JSDoc，局部逻辑用行注释”
- [ ] M-013.2 清理重复、无效、噪音注释
- [ ] M-013.3 保留关键设计意图注释

检查清单：

- [ ] 注释帮助理解而非重复代码

验收命令：

```bash
rg -n "^/\\*\\*|^\\s*//" src | head -n 200
```

期望结果：

- 注释密度与质量趋于稳定

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-014 | 中 | `src/contexts/NavigationContext.tsx`

- [ ] 状态：未开始
- [ ] 目标：决定“接入使用”或“移除死代码”
- [ ] 变更类型：死代码治理

子任务：

- [ ] M-014.1 检索使用方
- [ ] M-014.2 若无使用则移除并更新文档
- [ ] M-014.3 若接入则替换重复导航状态源

检查清单：

- [ ] 无未使用上下文遗留

验收命令：

```bash
rg -n "useNavigation|NavigationProvider|NavigationContext" src
```

期望结果：

- 状态明确：已接入或已移除

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-015 ~ M-017：README 无效链接治理

任务列表：

- [ ] M-015 | 中 | `README.md:1100` | 处理 `docs/快速开始.md`
- [ ] M-016 | 中 | `README.md:1101` | 处理 `docs/学习指南.md`
- [ ] M-017 | 中 | `README.md:1102` | 处理 `docs/项目结构说明.md`

子任务：

- [ ] M-015.1~M-017.1 确认文档确实不存在或重命名
- [ ] M-015.2~M-017.2 选择“创建文件”或“删除链接”
- [ ] M-015.3~M-017.3 复检所有 docs 链接

检查清单：

- [ ] README 不再指向不存在文件

验收命令：

```bash
rg -n "\\]\\(\\./docs/" README.md
```

期望结果：

- 每个链接目标文件存在或链接已移除

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-018 | 中 | `src/pages/SettingsPage/SettingsPage.tsx:309`

- [ ] 状态：未开始
- [ ] 目标：UI 显示版本改为单一来源
- [ ] 变更类型：版本一致性修复

子任务：

- [ ] M-018.1 选择来源（构建注入 / 常量单源）
- [ ] M-018.2 替换手写版本字符串
- [ ] M-018.3 与 README 同步策略

检查清单：

- [ ] 不再手写散落版本

验收命令：

```bash
rg -n "版本:|0\\.2\\.0|0\\.2\\.1" src/pages/SettingsPage/SettingsPage.tsx README.md package.json
```

期望结果：

- 版本显示遵循单源规则

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-019 | 中 | `README.md`

- [ ] 状态：未开始
- [ ] 目标：增加“规范执行命令”小节与失败排查
- [ ] 变更类型：文档可执行性提升

子任务：

- [ ] M-019.1 编写本地执行命令顺序
- [ ] M-019.2 添加常见失败案例
- [ ] M-019.3 添加最短排查路径

检查清单：

- [ ] 新人按文档可完成自检

验收命令：

```bash
rg -n "规范执行命令|失败排查|format:check|lint|build|cargo check" README.md
```

期望结果：

- 文档具备“拿来即用”指引

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-020 | 中 | `src-tauri`

- [ ] 状态：未开始
- [ ] 目标：建立 Rust 风格说明（`fmt + clippy`）
- [ ] 变更类型：子工程规范沉淀

子任务：

- [ ] M-020.1 在 README 或 docs 增加 Rust 检查命令
- [ ] M-020.2 标注 warning 零容忍策略
- [ ] M-020.3 给出失败排查建议

检查清单：

- [ ] 文档可操作、可复现

验收命令：

```bash
cargo fmt --check
cargo clippy -- -D warnings
```

期望结果：

- 文档与执行结果一致

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

### M-021 | 中 | 根目录 / `ROADMAP_TODO.md`

- [x] 状态：进行中
- [x] 目标：将当前问题沉淀为可追踪条目
- [x] 已完成：H/M/L 任务池全部落表

后续子任务：

- [ ] M-021.1 每次发现新问题追加到对应优先级
- [ ] M-021.2 不允许口头问题不落文档

验收命令：

```bash
rg -n "H-00|M-0|L-0" ROADMAP_TODO.md
```

结果记录位：

- 命令输出摘要：`<待填写>`

---

### M-022 | 中 | 根目录 / `ROADMAP_TODO.md`

- [x] 状态：进行中
- [x] 目标：定义任务状态标签
- [x] 已完成：3.1 节状态标签已定义

后续子任务：

- [ ] M-022.1 所有任务补齐状态字段
- [ ] M-022.2 每次变更同步状态

验收命令：

```bash
rg -n "状态：未开始|状态：进行中|状态：已完成|状态：阻塞" ROADMAP_TODO.md
```

结果记录位：

- 命令输出摘要：`<待填写>`

---

### M-023 | 中 | 根目录 / `ROADMAP_TODO.md`

- [x] 状态：进行中
- [x] 目标：每个任务增加验收命令与结果位
- [x] 已完成：高优先级任务卡已全量具备

后续子任务：

- [ ] M-023.1 对中低优先级逐条补齐结果记录位
- [ ] M-023.2 执行中持续填写结果

验收命令：

```bash
rg -n "验收命令|结果记录位" ROADMAP_TODO.md
```

结果记录位：

- 命令输出摘要：`<待填写>`

---

### M-024 | 中 | 根目录

- [ ] 状态：未开始
- [ ] 目标：约束“格式化提交与逻辑提交分离”
- [ ] 变更类型：提交质量治理

子任务：

- [ ] M-024.1 在 README 或 CONTRIBUTING 写入规则
- [ ] M-024.2 提供提交示例
- [ ] M-024.3 代码评审按该规则执行

检查清单：

- [ ] 提交历史可读性提升

验收命令：

```bash
git log --oneline -n 20
```

期望结果：

- 可区分“format-only commit”与“logic commit”

结果记录位：

- 命令输出摘要：`<待填写>`
- 关联提交：`<待填写>`

---

## 6. 低优先级任务清单（长期优化）

> 优先级：低  
> 原则：不阻塞主线质量闭环，作为持续优化池。

### L-001 | 低 | `src/components/ui/TargetCursor/TargetCursor.tsx`

- [ ] 状态：未开始
- [ ] 目标：复杂组件拆分（逻辑/动画/事件）
- [ ] 验收：文件职责更清晰，回归无行为变化

子任务：

- [ ] 提取事件绑定层
- [ ] 提取动画控制层
- [ ] 保留单一入口组件

---

### L-002 | 低 | `src/core/SchemaRenderer/index.tsx`

- [ ] 状态：未开始
- [ ] 目标：清理 `@ts-ignore`，补全类型收敛
- [ ] 验收：无忽略注解

---

### L-003 | 低 | `src/index.css`

- [ ] 状态：未开始
- [ ] 目标：主题变量与注释体系二次整理
- [ ] 验收：变量命名一致，重复定义减少

---

### L-004 | 低 | `src`

- [ ] 状态：未开始
- [ ] 目标：统一过渡动画配置常量化
- [ ] 验收：关键动画参数集中管理

---

### L-005 | 低 | `src`

- [ ] 状态：未开始
- [ ] 目标：路由 pageId 抽成类型常量
- [ ] 验收：减少魔法字符串

---

### L-006 | 低 | 根目录

- [ ] 状态：未开始
- [ ] 目标：可选增加 Markdown lint
- [ ] 验收：文档样式自动检查可执行

---

### L-007 | 低 | 根目录

- [ ] 状态：未开始
- [ ] 目标：增加轻量链接校验脚本
- [ ] 验收：README/docs 坏链接可自动发现

---

### L-008 | 低 | `src`

- [ ] 状态：未开始
- [ ] 目标：演示页示例代码与生产页逻辑隔离
- [ ] 验收：演示逻辑不污染主流程

---

### L-009 | 低 | 根目录

- [ ] 状态：未开始
- [ ] 目标：建立规范回归周期（每 2 周）
- [ ] 验收：有固定执行记录

---

### L-010 | 低 | 根目录 / `ROADMAP_TODO.md`

- [ ] 状态：未开始
- [ ] 目标：追加完成项归档区，避免主清单膨胀
- [ ] 验收：主清单可读性长期稳定

---

## 7. 分阶段执行顺序（Phase 0~4）

### Phase 0：阻塞清零（H-001 ~ H-004）

目标：

1. 清除当前 build 阻塞 TS6133。
2. 统一 `App.tsx` import 结构。

退出条件：

1. `npm run build` 通过。
2. 三个未使用导入错误全部消失。

Gate 命令：

```bash
npm run build
```

---

### Phase 1：规范工具链落地（H-005 ~ H-013）

目标：

1. 完成 Prettier/ESLint/.editorconfig/.gitattributes/scrips 基础设施。
2. 建立最小质量门禁顺序。

退出条件：

1. `npm run lint`、`npm run format:check` 可执行。
2. `cargo fmt --check` 通过。
3. `README` 中规范章节与仓库配置一致。

Gate 命令：

```bash
npm run lint
npm run format:check
cargo fmt --check
```

---

### Phase 2：文档与版本一致化（H-014 ~ H-015 + M-015 ~ M-019）

目标：

1. 版本来源单一化。
2. README 链接有效化。
3. 规范执行说明可复制运行。

退出条件：

1. 版本检索不再冲突。
2. README 不含无效 docs 链接。

Gate 命令：

```bash
rg -n "0\\.2\\.0|0\\.2\\.1" README.md src/pages/SettingsPage/SettingsPage.tsx package.json
rg -n "\\]\\(\\./docs/" README.md
```

---

### Phase 3：i18n 与交互一致性（M-001 ~ M-011）

目标：

1. 清理 Settings 页硬编码文案。
2. 统一提示交互形态，降低原生弹窗依赖。
3. 减少内联样式。

退出条件：

1. 关键硬编码文本迁移完成。
2. 业务页不再直接 `alert/confirm`。

Gate 命令：

```bash
rg -n "\\b(alert|confirm)\\(" src
rg -n "开发者选项|组件页面|关于|应用信息和版本号|确认重置|取消" src/pages/SettingsPage/SettingsPage.tsx
```

---

### Phase 4：结构与长期优化（M-012 ~ M-024 + L-*）

目标：

1. 完成 import/注释一致化与死代码治理。
2. 完成长期优化条目规划与归档机制。

退出条件：

1. 中优先级收口，低优先级进入迭代节奏。
2. 本文可持续维护，不再失效。

---

## 8. 验收命令清单（可复制执行）

### 8.1 场景 A：未使用导入清零

```bash
npm run build
```

期望：TS6133 为 0。

---

### 8.2 场景 B：前端格式统一

```bash
npx prettier --check "src/**/*.{ts,tsx,css}"
```

期望：0 warnings。

---

### 8.3 场景 C：Rust 格式统一

```bash
cd src-tauri
cargo fmt --check
```

期望：无 diff。

---

### 8.4 场景 D：Rust 质量门禁

```bash
cd src-tauri
cargo clippy -- -D warnings
```

期望：0 warnings。

---

### 8.5 场景 E：文档一致性（版本）

```bash
rg -n "v0\\.2\\.0|v0\\.2\\.1|0\\.2\\.0|0\\.2\\.1" README.md src/pages/SettingsPage/SettingsPage.tsx package.json
```

期望：版本来源单一化。

---

### 8.6 场景 F：README 链接有效性

```bash
rg -n "\\]\\(\\./docs/" README.md
```

期望：所有链接目标存在或已移除。

---

### 8.7 场景 G：i18n 覆盖检查

```bash
rg -n "开发者选项|组件页面|关于|应用信息和版本号|确认重置|取消" src/pages/SettingsPage/SettingsPage.tsx
```

期望：业务文案全部可翻译（仅 fallback 可留）。

---

### 8.8 推荐日常门禁（本地）

```bash
npm run format:check
npm run lint
npm run build
cd src-tauri && cargo check && cargo fmt --check && cargo clippy -- -D warnings
```

---

## 9. 风险与回滚策略

### 风险 1：一次性格式化导致大 diff 难 review

策略：

1. 按目录分批格式化（如 `src/components`、`src/pages`）。
2. 每批次单独提交，标题明确 `format-only`。
3. 每批次后跑最小门禁。

回滚：

1. 单提交回滚，避免影响逻辑改动。

---

### 风险 2：规则过严导致开发阻塞

策略：

1. 先启用核心规则（unused、hooks、format）。
2. 增强规则分阶段升级。
3. 临时例外需记录并限时清理。

回滚：

1. 下调规则级别但保留问题清单。

---

### 风险 3：i18n 改造引入 key 缺失

策略：

1. 改一处测一处。
2. 保留 fallback，最终统一清理 fallback。
3. locale key 命名统一。

回滚：

1. 按任务回滚到上一可用版本。

---

### 风险 4：版本来源改造影响构建流程

策略：

1. 先做只读注入方案，不改打包链路。
2. 仅在显示层收敛版本读取方式。

回滚：

1. 回退显示层，不影响核心构建。

---

## 10. 冻结项与暂不处理项

1. `modules/` 目录规范治理暂不纳入本轮执行。
2. 新功能开发需求暂不纳入本轮执行。
3. 大规模架构重构（路由体系、状态管理替换）暂不处理。
4. 非质量问题的 UI 大改暂不处理。

冻结解除条件：

1. 高优先级与中优先级主线任务完成率 >= 90%。
2. 质量门禁连续 2 次全通过。

---

## 11. 完成定义（Definition of Done）

1. 高优先级任务全部勾选完成。
2. `build + format + lint + cargo check/fmt/clippy` 全通过。
3. README 与代码配置一致，坏链接清零。
4. `ROADMAP_TODO.md` 中每个完成项都有验收记录。
5. 新增代码默认遵循统一规则，不再出现明显风格分裂。

DoD 验收签字区：

- 技术负责人：`<待填写>`
- 完成日期：`<待填写>`
- 最终门禁输出摘要：`<待填写>`

---

## 12. 变更记录（文档维护日志）

### 12.1 维护规则

1. 每次新增任务必须登记日期与原因。
2. 每次任务状态变化需更新对应任务卡。
3. 每次阶段切换需补充 Gate 结果。

### 12.2 记录模板

```text
[YYYY-MM-DD] [作者] [任务ID]
变更类型：新增/修改/完成/阻塞
变更摘要：
影响范围：
验收命令与结果：
```

### 12.3 初始记录

```text
[2026-02-06] [Codex] [INIT]
变更类型：新增
变更摘要：创建 ROADMAP_TODO.md，按“超长超详细”结构落地 H/M/L 任务池与执行规则。
影响范围：根目录文档
验收命令与结果：文档生成完成，待后续按任务逐条执行与回填。
```

---

## 附录 A：任务速览索引（ID -> 节）

### 高优先级

1. H-001 -> 4
2. H-002 -> 4
3. H-003 -> 4
4. H-004 -> 4
5. H-005 -> 4
6. H-006 -> 4
7. H-007 -> 4
8. H-008 -> 4
9. H-009 -> 4
10. H-010 -> 4
11. H-011 -> 4
12. H-012 -> 4
13. H-013 -> 4
14. H-014 -> 4
15. H-015 -> 4

### 中优先级

1. M-001 ~ M-008 -> 5
2. M-009 -> 5
3. M-010 -> 5
4. M-011 -> 5
5. M-012 -> 5
6. M-013 -> 5
7. M-014 -> 5
8. M-015 ~ M-017 -> 5
9. M-018 -> 5
10. M-019 -> 5
11. M-020 -> 5
12. M-021 -> 5
13. M-022 -> 5
14. M-023 -> 5
15. M-024 -> 5

### 低优先级

1. L-001 -> 6
2. L-002 -> 6
3. L-003 -> 6
4. L-004 -> 6
5. L-005 -> 6
6. L-006 -> 6
7. L-007 -> 6
8. L-008 -> 6
9. L-009 -> 6
10. L-010 -> 6

---

## 附录 B：执行顺序总览（单页版）

```text
Phase 0: H-001~H-004
Phase 1: H-005~H-013
Phase 2: H-014~H-015 + M-015~M-019
Phase 3: M-001~M-011
Phase 4: M-012~M-024 + L-*
```

---

## 附录 C：显式假设与默认值（锁定）

1. 本轮仅治理规范与质量，不做功能开发。
2. 文档覆盖范围仅 `src + src-tauri`。
3. 任务优先级使用高/中/低。
4. 进度机制使用勾选，不引入日报周报模板。
5. 文档语言为中文主叙述 + 英文术语。
6. 工具链目标态包含：Prettier、ESLint、EditorConfig、Gitattributes、rustfmt、clippy。

