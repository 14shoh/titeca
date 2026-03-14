# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Titeca** — National Platform for Exhibitions and Conferences of Tajikistan. An online platform for organizing, promoting, and managing international and national exhibitions, forums, business events, and fairs in Tajikistan.

The full requirements specification is in `titeca.txt` (Russian).

## Tech Stack

- **Backend:** NestJS
- **Frontend:** Next.js
- **Database:** MySQL
- **Languages supported:** Tajik, Russian, English (i18n required throughout)

## Architecture

The platform is split into three main areas:

1. **Public frontend (Next.js)** — Homepage, exhibition catalog with filters (industry, date, country), individual event pages, company profiles, booth reservation UI
2. **User dashboard** — Registration management, applications, booth bookings, document uploads, payment history, messaging
3. **Admin panel** — Manage exhibitions, events, users, applications, news, payments

### Key Domain Entities
- Exhibitions/Events (with programs, participants, venue maps)
- Companies (profiles with logo, products, contacts, video links)
- Booth reservations (interactive hall map, online payment)
- Users (participants and companies)
- Applications & Documents
- News & Banners
- Messages (internal messaging between users)

### Integrations Required
- Tajikistan payment systems (online payments for booth reservations)
- Social networks (video embeds from YouTube etc.)
- Email newsletters
- CRM systems

## Development Commands

> These will be added once the project is initialized. Expected setup:

```bash
# Backend (NestJS)
cd backend
npm install
npm run start:dev

# Frontend (Next.js)
cd frontend
npm install
npm run dev

# Database
# MySQL — run migrations via NestJS TypeORM or Prisma CLI
```

## Non-Functional Requirements
- Responsive design (mobile, tablet, desktop)
- Fast page loads (SSR/SSG via Next.js)
- SEO optimization
- SSL, DDoS protection, user data protection
