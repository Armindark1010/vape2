# VAPORA Store - Agent Instructions & Workspace Context

This document provides context and rules for AI assistants working in this repository.

## Repositories & Modules
- **Storefront**: Nuxt 3 in `/app` and `/server`.
- **Admin Panel**: Angular Standalone in `/admin`.
- **Backend API**: NestJS in `/backend`.
- **State Documentation**: Complete project history and decisions are recorded in `/.antigravity/PROJECT_STATE.md`.

## Active Rules
1. **Mobile-First Priority (قانون طلایی اولویت موبایل)**: Mobile view is the #1 design, implementation, and testing priority. All UI components, headers, dialogs, drawers, and layouts must be designed and verified for touch screens and mobile widths (375px-500px) first before desktop.
2. **Authentication**: Username and password login only. Do NOT introduce SMS OTP unless explicitly asked.
3. **Angular Admin Guidelines**: Maintain standalone components, Signals, Reactive Forms, and RxJS Observable patterns in `/admin`. Keep educational Persian comments comparing code to Vue/Nuxt.
4. **Workflow Rule ("جنریت")**: Follow the mandatory Step 0 confirmation before executing any generation pipeline.
