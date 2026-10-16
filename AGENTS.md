# write4adhd 项目上下文

## 项目定位

write4adhd（write for ADHD）是一个 **agent skills 集合仓库**，不是应用程序。这里的交付物就是 skill 本身：让 coding agent 能写出对没耐心/ADHD 读者友好的"祛魅体"科普文档。仓库面向开源分享，读者可能把它拷进任何项目使用。

每个 skill 都有**中英两个语言版本**（`skills-cn/` 产出中文文档，`skills-en/` 产出英文文档），规则、模板、目录结构一一对应，只是自然语言不同。英文版不是逐字硬翻，而是用英语母语的自然表达说同一件事。

## 目录结构

```text
skills-cn/<skill-name>/      # 中文版 skill
├── SKILL.md          # 入口：frontmatter（name/description）+ 工作流程 + 底线规则
├── references/       # 按需加载的详细规范（文风指南、制作规范等）
└── assets/           # 可直接复制使用的模板/资源，agent 不需要通读
skills-en/<skill-name>/      # 英文版 skill，目录结构与中文版完全对应
README.md             # 英文 README（默认，GitHub 首页渲染这一份）
README.zh_CN.md       # 中文 README
.tmp/                 # 草稿区，已 gitignore，正式交付物不放这里
```

## 命名约定

- skill 一律用 **`write4adhd-`** 前缀（与仓库名一致），小写字母/数字/连字符（Agent Skills 规范）。
- skill 目录名必须与 SKILL.md frontmatter 的 `name` 一致（其他 Agent Skills 实现可能强制要求）。
- **同一个 skill 的中英版本 `name` 相同**（都是 `write4adhd-book`），使用者按需要的文档语言二选一安装；两个 README 都需提醒装一个就够。
- 多语言文档的文件名约定：默认语言用无后缀名（`README.md`），其他语言用 `<name>.<locale>.md`，locale 用 GitHub 风格的下划线写法（如 `README.zh_CN.md`）。
- `description` 承担路由职责：既写"做什么"也写"什么时候用"。中文版的触发词用中文（如"科普/扫盲/祛魅"），英文版的触发词用英文（如 plain-English / ELI5 / primer / demystify），两边都要带上 skill 名本身。

## 硬性规则

1. **skill 必须自包含**：不引用仓库内外部的任何原作、文章或网络资源；范文例句一律内嵌在 references 里。使用方只拷走一个 skill 目录就能完整工作。
2. **assets 模板零外部依赖**：不引 CDN、webfont、外链图片；整页/整站离线可用。
3. **中英双语必须同步**：修改任何 skill（文档、规范、模板）或新增 skill 时，**必须在 `skills-cn/` 和 `skills-en/` 两边做出对应的改动**，不允许只改一边造成规则漂移。新增 skill 时两个语言目录同时建好再提交。但**skill 内部不得提及另一个语言版本的存在**（不写 `skills-cn`/`skills-en` 路径、不写"英文版/中文版请改用……"）：使用方只安装一个语言版本，交叉引用缺乏上下文，只会干扰 agent。语言分工只写在 README 和本文件里；skill 内部最多声明自身产出语言（如"本 skill 产出的正文一律为中文"）。
4. **assets 代码两边保持一致**：`skills-cn` 与 `skills-en` 的同名模板，除**自然语言字符串**（注释、占位文案、`aria-label`/`title`、按钮文字、`lang` 属性、字体栈）外，HTML 结构、CSS、JS 必须完全相同。改完用 `diff -u` 对照，剩余差异应当只有语言相关的行。
5. **同源文件同步修改**：`write4adhd-book/assets/skeleton.html` 的内联 CSS/JS 与 `assets/site/style.css`、`assets/site/shared.js` 是同一套代码的两种组织形式；中英文两边加起来共 4 处，改任何一处必须同步其余各处（文件头注释有提醒）。
6. **文档语言**：`skills-cn/` 的文档、模板占位文案与注释用中文；`skills-en/` 一律用英文（不得残留中文，也不要用中式直译）；AGENTS.md 用中文。
7. **README 分两个文件、内容对应**：`README.md` 是英文版（默认，GitHub 仓库首页渲染这一份），`README.zh_CN.md` 是中文版。两份章节、skills 表格、仓库结构、示例命令要一一对应（改一份就要改另一份），但不做逐字直译，各自用母语者的自然说法表达同一个意思；默认语言的示例用默认语言版本的 skill（英文 README 示例用 `skills-en/`，中文 README 示例用 `skills-cn/`）。
8. **README 开头必须有语言切换按钮组**：两个 README 的第一行都是 `[ 中文 | English ]`，**当前语言是纯文本、另一种语言是指向对方文件的相对链接**——`README.md` 写 `[ [中文](README.zh_CN.md) | English ]`，`README.zh_CN.md` 写 `[ 中文 | [English](README.md) ]`。不要给当前语言加链接（包括自链接或锚点）。
9. **README 只面向使用者**：README 给人看，只写"这东西是什么 / 装哪个 / 怎么用"，不写维护规则（双语同步、同源文件同步这类约束只放在本文件里）。

## 修改后的验证清单

- [ ] `node --check` 所有 assets 中的 JS（含 HTML 内联 script，可先提取再检查），中英两边都要过；
- [ ] SKILL.md 的 `name` 与目录名一致，description 不超过 1024 字符（中英两边）；
- [ ] `diff -u skills-cn/<skill>/... skills-en/<skill>/...`：assets 差异只应是自然语言字符串与字体栈；references/SKILL.md 应逐节对应（条数、顺序一致）；
- [ ] `grep -P '[\x{4e00}-\x{9fff}]' -r skills-en/` 无输出（英文版没有中文残留）；
- [ ] `grep -rn 'skills-cn\|skills-en' skills-cn/ skills-en/` 无输出（skill 内部不交叉引用另一语言版本）；
- [ ] 用浏览器（或 playwright MCP 截图）检查模板页：亮/暗主题、窄屏（~375px）、动画控制按钮、页内链接无死链；
- [ ] 两个 README：首行语言切换按钮组格式正确（当前语言无链接、另一语言指向对方文件且路径存在），章节与表格逐条对应；
- [ ] `grep -ri` 确认没有把草稿、私有路径（如 `.tmp/`）或个人环境信息带进正式文件。

## 新增 skill 的流程

1. 同时在 `skills-cn/write4adhd-<name>/` 和 `skills-en/write4adhd-<name>/` 建目录（中文 skill 放 `skills-cn/`，英文版放 `skills-en/`），从 SKILL.md 写起：frontmatter → 工作流程 → 不可妥协的底线，详细规范下沉到 `references/`，可复制的模板放 `assets/`。
2. SKILL.md 保持短（agent 每次触发都会全文加载），把大块内容放进 references 按需读取——这本身也是 token 预算上的"ADHD 友好"。
3. 若与 write4adhd-book 同属写作类，优先复用/引用其文风规范，避免两处规则漂移；模板资源同理，能复用就复用，但要记住复用后仍是中英两份、需同步。
4. 同步更新两个 README（`README.md` 与 `README.zh_CN.md`）的 skills 表格（中文版/English 两列链接）与仓库结构。
