[ [中文](README.zh_CN.md) | English ]

# Write for ADHD

A set of skills that make your coding agent write for readers who won't sit still.

You bounce off walls of text, and halfway through a long post you've forgotten what it was about. If that's you, this repo was built for you. It distills a writing method that has already proven itself into an agent skill: **short chapters, homespun metaphors, a closing line for every chapter, hand-drawn Canvas animations**. Install it and your agent writes that way for you.

## What you get

- **Demystified**: you finish able to say in your own words what the thing is and where the hard part was, instead of "sounds impressive, still don't get it";
- **One homespun metaphor running through the whole piece**: exactly one thing to remember;
- **A bolded closing line for every chapter**: stop anywhere, pick it back up anywhere;
- **No paragraph longer than 4 lines**: walls of text are illegal here;
- **Hand-drawn Canvas diagrams + step animations**: they autoplay, pause when you scroll away, and hand you pause/step/replay buttons — animation serves you, it never holds you hostage;
- **The output is a finished artifact**: a single self-contained HTML page, a multi-page HTML book site, or Markdown — light and dark themes, works offline, zero external dependencies.

## Skills

Every skill comes in **two language variants**: identical rules and templates, only the output language differs. Pick the one that writes in your language — they share a name, so install just that one.

| Skill | What it does | 中文 | English |
|---|---|---|---|
| `write4adhd-book` | Explainers, docs and chaptered books in the demystified style, delivered as HTML (with animated diagrams) or Markdown | [`skills-cn/write4adhd-book`](skills-cn/write4adhd-book/) | [`skills-en/write4adhd-book`](skills-en/write4adhd-book/) |

All skills carry the **`write4adhd-`** prefix and live in a per-language directory: `skills-cn/` writes Chinese, `skills-en/` writes English.

## Quick start

Copy the skill directory for your language into your project (or into your user-level directory to make it available everywhere):

```bash
# Project level: current project only (use skills-cn for the Chinese skill)
cp -r skills-en/write4adhd-book <your-project>/.agents/skills/

# User level: every project
cp -r skills-en/write4adhd-book ~/.agents/skills/
```

Then, in any agent that supports [Agent Skills](https://agentskills.io/) (such as pi):

```text
/skill:write4adhd-book write a plain-English primer on Docker
```

Or just ask naturally: "explain XXX like I've never heard of it".

## Repo layout

```text
write4adhd/
├── skills-cn/               # Chinese skills
│   └── write4adhd-book/
│       ├── SKILL.md         # entry point: workflow + non-negotiables
│       ├── references/      # style guide, HTML page craft
│       └── assets/          # copy-paste page / book-site templates
├── skills-en/               # English skills (same layout)
│   └── write4adhd-book/
├── README.md                # this file
├── README.zh_CN.md          # 中文版
├── AGENTS.md                # context for agents maintaining this repo
└── LICENSE
```

## License

[MIT](LICENSE)
