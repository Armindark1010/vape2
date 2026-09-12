# VAPORA Store - Agent Instructions & Workspace Context

This document provides context and rules for AI assistants working in this repository.

## Repositories & Modules
- **Storefront**: Nuxt 3 in `/app` and `/server`.
- **Admin Panel**: Angular Standalone in `/admin`.
- **Backend API**: NestJS in `/backend`.
- **State Documentation**: Complete project history and decisions are recorded in `/.antigravity/PROJECT_STATE.md`.

## Active Rules
1. **Authentication**: Username and password login only. Do NOT introduce SMS OTP unless explicitly asked.
2. **Angular Admin Guidelines**: Maintain standalone components, Signals, Reactive Forms, and RxJS Observable patterns in `/admin`. Keep educational Persian comments comparing code to Vue/Nuxt.
3. **Workflow Rule ("جنریت")**: Follow the mandatory Step 0 confirmation before executing any generation pipeline.
