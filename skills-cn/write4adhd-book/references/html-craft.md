# HTML 页面制作规范

## 形态选择（动笔前先定）

| 形态 | 适用场景 | 模板 | 资源组织 |
|---|---|---|---|
| **单页自包含** | 一篇短文，或 1~3 页的小文章（主篇 + 少量番外） | `assets/skeleton.html` | 每页内联全部 CSS/JS，零依赖，双击即开 |
| **书站（多页）** | 分章的长篇科普书、探索一个技术项目后写的多章作品 | `assets/site/` 整个目录 | 共享 `style.css` + `shared.js`，每章一个 HTML |

选择原则：**页数 ≤ 3 用单页自包含；更多页用书站**，避免同一段 CSS/JS 在十几个文件里重复（既浪费 token 又难维护）。两种形态的设计语言完全一致，`site/style.css`、`site/shared.js` 与 `skeleton.html` 的内联版本同源，**修改其中一处时记得同步另一处**。

无论哪种形态：不引用任何外部资源（字体、图片、CDN 一律禁止），整站/整页离线可用。

起点：复制对应模板，只需替换占位内容，不要从零手写页面。

## 书站目录结构

```text
book/
├── index.html        # 封面 + 目录（每章一张 .toc-item 卡片）
├── ch1.html          # 章页，从 chapter.html 模板复制
├── ch2.html
├── …
├── side-xxx.html     # 番外篇，同样用章页模板，badge 换成"番外篇"
├── style.css         # 共享样式
└── shared.js         # 共享脚本（Canvas 辅助函数、动画脚手架、主题切换）
```

书站约定：

- **章页分页**：一页承载 1~3 节，别把所有章塞进一页；每页仍可独立读完（导语里做软性回顾）。
- **导航三件套**：每章页顶部 `← 目录`（`.back-link`），底部 `.pager`（上一章 / 目录 / 下一章），目录页每章一句带钩子的简介——这也是 ADHD 友好规则里"进度感"的实现方式。
- **防闪烁主题初始化脚本**（约 3 行）必须内联在每一页的 `<head>` 里，不能放进 shared.js（它加载得太晚，暗色用户会先被白屏闪一下）。
- 页内专属的图表绘制代码写在页尾 `<script src="shared.js"></script>` 之后的内联 `<script>` 里。
- 文件命名用语义化短横线小写（`ch1.html`、`side-backup.html`），链接全部用相对路径。

## 页面骨架

单页形态如下；书站章页骨架相同，只是 `<style>`/尾部大段 `<script>` 换成引用 `style.css`/`shared.js`，并加上 `.back-link`、`header.chapter-head` 和 `.pager`（见 `site/chapter.html` 模板）。

```text
<head>
  防闪烁主题初始化脚本（读 localStorage，回退 prefers-color-scheme）
  <style> 全套 CSS 变量 + 组件样式 </style>
<body>
  .theme-switcher        右上角固定的 ☀️/🌙 主题切换按钮
  .container
    header               h1 主标题（说清本页讲什么） + .subtitle（主篇/封面页：引入核心比喻 + 说清读完能知道什么）
    section × N          每章一个 <section>，h2 带 <span class="num">N</span> 编号
    .closing             总结章的收束区
    .end-mark            "· · ·" 全文结束符
    footer
  <script> Canvas 辅助函数 + 图表/动画代码 + 主题切换重绘 </script>
```

副标题要符合文风，也是引入核心比喻的位置（详见 style-guide 第 3 条），如："其实就是租在别人家的储物柜：一句话讲清云存储到底把文件放哪了"。

## 设计约定

- 字体：系统中文字体栈 `-apple-system, …, "PingFang SC", "Microsoft YaHei", …`；代码/等宽用 `"JetBrains Mono", "Fira Code", monospace`（仅 font-family 声明，不加载 webfont）。
- 正文 `font-size: 17px; line-height: 1.85`（宽松行距是 ADHD 友好的一部分，不要调小）。
- 内容最大宽度 `--max-width: 1152px`，居中容器，左右 24px padding。
- 全部颜色走 CSS 变量，`:root` 定义暗色（默认），`[data-theme="light"]` 覆盖为亮色。变量集合：`--primary / --primary-light / --primary-soft / --accent / --accent-light / --green / --green-light / --purple / --purple-light / --text / --text-muted / --text-light / --bg / --surface / --border / --radius / --max-width`。
- 主色蓝、强调色橙，绿色/紫色作图表辅助色。`strong` 显示为强调色，`em` 显示为强调色底纹胶囊（用来标"学名"术语）。
- 移动端断点 `@media (max-width: 600px)` 缩小标题与 padding。

## 可用组件（skeleton 中均有示例）

| 组件 | class | 用途 |
|---|---|---|
| 章节编号 | `h2 > .num` | 每章标题前的圆角数字块 |
| 高亮卡 | `.card` | 一小块补充说明，内含 `code` 样式 |
| 问答框 | `.callout`（橙）/ `.callout.blue` | 自问自答、读者质疑 |
| 公式框 | `.formula-box` + `.big` | 全文核心公式，如 `前台 + 传菜口 + 后厨 = 外卖` |
| 流程胶囊 | `.flow-list > .flow-step` + `.arrow-sep` | 横向步骤链：A → B → C |
| 图表容器 | `.diagram-wrap` | 包住 canvas + `.caption` 人话图注 |
| 动画控制条 | `.anim-bar > .anim-btn` | 暂停/单步/重播按钮 |
| 结束符 | `.end-mark` | "· · ·" |
| 番外/章节徽章 | `.badge` | 页首胶囊："番外篇""第 N 章"；正文中链接番外用 "👉 …参见番外篇：《…》" |
| 目录卡片 | `.toc > .toc-item`（番外用 `.toc-item.side`） | 书站目录页：编号块 + 标题 + 带钩子的一句简介 |
| 章页导航 | `.back-link` / `.pager` | "← 目录" / 上一章·目录·下一章 |
| 章页头 | `header.chapter-head` | 比封面页紧凑的左对齐页头 |

## Canvas 图表规范

- 一律用 `<canvas>` 手绘，不用 SVG 图片、不引外部图。设计空间尺寸固定（宽 680 左右，高按内容 280~360），`setupCanvas()` 负责 DPR 适配和窄屏等比缩放。
- 颜色通过 `getColors()` 从当前主题的 CSS 变量读取，**保证亮/暗主题下都清晰**；主题切换时通过 `__redraws` 注册表重绘所有图表。
- 复用辅助函数：`roundRect` / `drawBox`（多行文字圆角框）/ `drawArrow`（带箭头连线）/ `drawLabel`（多行标签）。图形语言保持"示意图"感：圆角框 + 箭头 + 大字标签，不追求精致，允许在图注里声明"示意，非实际数量"。
- 每章至少一张图讲清核心机制；图注必须是一句人话，点出这张图想让人看到什么（见 style-guide 第 8 条）。

## 动画规范（ADHD 友好）

- 流程类概念优先做成**分步动画**：skeleton 提供 `setupAnim(id, spec)`，`spec.draw(ctx, w, h, step, t)` 按步绘制，`t` 是步内 0→1 的插值进度。
- 三按钮控制条：`⏸ 暂停 / ▶ 播放`（切换）、`下一步 ▸`（单步）、`↺ 重播`。按钮 id 约定为 `<canvas-id>-play / -step / -reset`。
- **默认自动播放**，但用 `IntersectionObserver` 在滚出视口时自动暂停（省电 + 不绑架注意力），滚回来恢复。
- 静态图用 `setupCanvas(id, drawFn)` 即可，不需要动画条。

## 主题切换

- `<head>` 内联一段立即执行脚本，在首次绘制前从 `localStorage`（key 按项目自定，如 `xxx-theme`）读取主题，无记录则跟随 `prefers-color-scheme`，避免暗色用户被白屏闪一下。
- 切换按钮更新 `data-theme` 属性 + 写 localStorage + 依次调用 `__redraws` 重绘图表。

## 主篇 + 番外篇

- 番外页首加 `.badge`"番外篇"徽章和返回链接（单页形态回主篇，书站形态进 `.pager` 导航）。
- 主篇链接番外：`👉 好奇……？参见番外篇：<a href="xxx.html">《标题》</a>`；番外开头承接："读完正文你可能好奇：……"。
- 单页形态下各篇 CSS/JS 完全复制同一套（自包含优先于 DRY）；书站形态下自然共享 `style.css`/`shared.js`。

## 验证

- 写完在浏览器中打开检查：亮/暗两种主题、窄屏（~375px）与宽屏、动画播放/暂停/单步/重播、所有链接可点。
- 环境中有 playwright MCP 时，用它分别以亮/暗主题截图自查排版与图表渲染。
