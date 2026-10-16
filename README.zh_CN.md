[ 中文 | [English](README.md) ]

# Write for ADHD

让 coding agent 写出对 ADHD 友好的内容的一套 skills。

长文看不下去、大段落直接劝退、读到一半忘了前面在讲啥——如果你也是这样，这个仓库就是给你准备的。它把一种验证过好用的写作方法论沉淀成 agent skill：**短章节、土味比喻、每章一句收束、Canvas 动画图解**，装上之后，你的 agent 就能替你写出这种文章。

## 效果是什么样的

- **祛魅**：读完你能用自己的话说出这东西是什么、难在哪，而不是"好像很厉害但没懂"；
- **一个土味比喻贯穿全文**：全文只需要记住一件事；
- **每章一句加粗的收束句**：随时停下来，随时接得上；
- **段落不超过 4 行**：段落墙是违法的；
- **手绘 Canvas 示意图 + 分步动画**：默认播放、滚出屏幕自动暂停、给你暂停/单步/重播按钮——动画服务你，不绑架你；
- **产出即成品**：单页自包含 HTML、分章多页书站、或 Markdown，亮暗主题、离线可用、零外部依赖。

## 已收录的 skills

每个 skill 都有**中文版和英文版**：写法规范和模板完全一样，区别只在产出文档的语言。按你要写的语言挑一个装就行（两者同名，装一个就够）。

| Skill | 干什么 | 中文版 | English |
|---|---|---|---|
| `write4adhd-book` | 用"祛魅体"写科普文章/文档/分章科普书，产出 HTML（含图表动画）或 Markdown | [`skills-cn/write4adhd-book`](skills-cn/write4adhd-book/) | [`skills-en/write4adhd-book`](skills-en/write4adhd-book/) |

skills 统一用 **`write4adhd-`** 前缀，按语言分目录存放：`skills-cn/` 是中文版，`skills-en/` 是英文版。

## 快速开始

把对应语言的 skill 目录拷到你的项目里（或用户级目录，全局可用）：

```bash
# 项目级：仅当前项目可用（英文版把 skills-cn 换成 skills-en）
cp -r skills-cn/write4adhd-book <你的项目>/.agents/skills/

# 用户级：所有项目可用
cp -r skills-cn/write4adhd-book ~/.agents/skills/
```

然后在支持 [Agent Skills](https://agentskills.io/) 的 agent（如 pi）里：

```text
/skill:write4adhd-book 写一篇《什么是 Docker》
```

或者自然语言触发："用祛魅体给我科普一下 XXX"。

## 仓库结构

```text
write4adhd/
├── skills-cn/               # 中文版 skills
│   └── write4adhd-book/
│       ├── SKILL.md         # 入口：工作流程 + 底线规则
│       ├── references/      # 文风指南、HTML 制作规范
│       └── assets/          # 可直接复制的页面/书站模板
├── skills-en/               # 英文版 skills（目录结构同中文版）
│   └── write4adhd-book/
├── README.md                # English
├── README.zh_CN.md          # 本文件
├── AGENTS.md                # 给维护本仓库的 agent 的上下文
└── LICENSE
```

## 许可

[MIT](LICENSE)
