---
date: 2026-05-25
title: "A privacy-first Digital Safety Toolkit prototype built at a hackathon"
cover: "https://unsplash.it/400/300/?random?safety"
slug: digital-safety-toolkit
categories:
    - Side Projects
    - Azure
    - React
    - TypeScript
tags:
    - React
    - TypeScript
    - Azure AI
    - Privacy
---

A while back I took part in a hackathon and built a small prototype called the Digital Safety Toolkit. The idea was to explore what a privacy-first digital safety resource for women in crisis could look like, with no data persistence, no tracking, and a quick exit always within reach.

This is a hackathon prototype, not an official tool. It is not affiliated with or endorsed by Women's Aid Ireland or any other organisation. For real support please use the official channels: Women's Aid Ireland 1800 341 900, or emergency services on 999 or 112.

You can try the prototype here:

**<https://goncalvesj.github.io/waid-digital-safety-toolkit/>**

And the source code is here:

**<https://github.com/goncalvesj/waid-digital-safety-toolkit>**

## The problem I wanted to explore

If someone is in an abusive situation, even a browser history entry or a saved session can become a risk. I wanted to see how far you could push a web app in the other direction: useful, but with no digital trail whatsoever.

That set a few hard rules for the prototype:

- No cookies, no local storage, no session storage.
- No analytics, no third-party scripts, no fingerprinting.
- All state lives in memory only and resets on refresh.
- A visible quick exit button that leaves no trace in history.

## Key features

- AI safety assistant: a chat interface backed by an Azure AI Agent with a trauma-informed system prompt and a curated knowledge base. Falls back to offline pattern responses if AI is not configured.
- Quick Exit button: always visible, redirects to a neutral site using `location.replace()` so the current page is not added to browser history.
- Decision trees: JSON-driven branching questionnaires for common safety scenarios, with actionable outcomes at the end.
- Checklists: step-by-step lists for securing accounts and devices, with in-memory progress only.
- Guidance panels: short, accessible explainers for specific concerns.

## How the privacy guarantees actually work

The interesting part for me was the implementation discipline. To make the privacy claims real, the app has to avoid the things web apps usually do without thinking:

- All progress and chat state lives in `useState` and friends. There is no `localStorage`, `sessionStorage`, IndexedDB, or cookie write anywhere.
- The Quick Exit uses `location.replace()` instead of `location.href` so it does not push a new entry onto the history stack.
- There are no breadcrumbs and no back navigation that could reveal previous answers.
- The only outbound network call (aside from loading the app) is the AI chat request to Azure. If that is not configured, the app stays fully local with built-in pattern responses.

A browser refresh is the universal panic button: everything is gone.

## The tech stack

- Frontend: React 19, TypeScript, Vite.
- UI: Radix UI and shadcn/ui components with Tailwind CSS 4.
- AI: Azure AI Agent against a curated digital safety knowledge base.
- Forms: React Hook Form with Zod validation.
- Icons and animation: Heroicons, Phosphor, Lucide, Framer Motion.
- Hosting: GitHub Pages.

The design uses a calm deep teal as the primary colour and a deliberate alert red for the Quick Exit button so it is always easy to find under stress.

## What I took away from the hackathon

Hackathon code is hackathon code. There are rough edges and the AI assistant is not a substitute for professional support. But the exercise was a good reminder that "no data" is a design constraint, not a slogan. As soon as you commit to it, a lot of decisions get easier: no auth, no backend state, no GDPR scope, no logout flow.

If you want to poke at the source, try the prototype, or use it as a starting point for your own safety-adjacent project, the repo is here:

**<https://github.com/goncalvesj/waid-digital-safety-toolkit>**

If you are in danger right now, please reach out to Women's Aid Ireland (1800 341 900) or call 999/112.
