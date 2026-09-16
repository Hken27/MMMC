# Next.js + Claude Code + 9Router Project

This project is a [Next.js](https://nextjs.org) application bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The project is developed and maintained using [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and can use [9Router](https://docs.9router.com/) as an AI routing gateway between Claude Code and supported AI providers.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Claude Code](#claude-code)
- [9Router](#9router)
- [Claude Code + 9Router Integration](#claude-code--9router-integration)
- [Project Instructions](#project-instructions)
- [Development](#development)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Learn More](#learn-more)
- [Deployment](#deployment)

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
---

# Project Overview

This project uses Next.js as the primary web application framework.

The project follows the Next.js App Router architecture and is intended to be developed through a structured workflow using Claude Code.

Claude Code is used as the AI coding agent for:

- Understanding the project
- Inspecting the codebase
- Planning implementation
- Writing and modifying code
- Refactoring
- Debugging
- Reviewing implementation
- Running validation
- Maintaining project consistency

9Router may be used as the AI routing layer for Claude Code, allowing requests from Claude Code to be routed through a configurable AI provider/model.

---

# Technology Stack

## Core

- Next.js
- React
- TypeScript
- Node.js

## Styling

- Tailwind CSS

## AI Development

- Claude Code
- 9Router

---

# Claude Code

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) is the AI coding agent used to interact with and develop this repository.

Claude Code operates directly within the project environment and can inspect project files, modify source code, run commands, and assist with development workflows.

## Claude Code Responsibilities

Claude Code should be used to:

1. Understand project requirements.
2. Inspect the existing codebase before making changes.
3. Identify existing components and patterns.
4. Follow the project's architecture and coding conventions.
5. Implement requested functionality.
6. Avoid unnecessary changes.
7. Validate changes after implementation.
8. Review the final result before considering a task complete.

## Project Instructions

The primary instructions for Claude Code are defined in:

```text
CLAUDE.md