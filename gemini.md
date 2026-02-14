# 🧬 Project Constitution (gemini.md)

**Last Updated:** 2026-02-14T15:03:36+05:30  
**Status:** Discovery Complete - Blueprint Approved  
**Phase:** Phase 1 - Blueprint (Research)

---

## 📋 Project Overview

**Project Name:** AI News Dashboard  
**Mission:** Build a beautiful, interactive dashboard that aggregates and displays the latest AI news articles from multiple sources (Ben's Bites, AI Rundown, Reddit) from the last 24 hours, with the ability to save articles and persist them across sessions.  
**Current Phase:** Blueprint - Research & Schema Definition

---

## 🗂️ Data Schemas

### Input Schema (Scraped Article)
```json
{
  "source": "string (e.g., 'bens_bites', 'ai_rundown', 'reddit')",
  "title": "string",
  "url": "string (unique identifier)",
  "published_date": "ISO 8601 timestamp",
  "summary": "string (optional)",
  "author": "string (optional)",
  "tags": ["string"],
  "scraped_at": "ISO 8601 timestamp"
}
```

### Output Schema (Dashboard Article Display)
```json
{
  "id": "uuid (generated)",
  "source": "string",
  "title": "string",
  "url": "string",
  "published_date": "ISO 8601 timestamp",
  "summary": "string",
  "author": "string",
  "tags": ["string"],
  "is_saved": "boolean",
  "saved_at": "ISO 8601 timestamp (nullable)",
  "created_at": "ISO 8601 timestamp"
}
```

### Supabase Schema (articles table)
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  published_date TIMESTAMPTZ NOT NULL,
  summary TEXT,
  author VARCHAR(255),
  tags TEXT[],
  is_saved BOOLEAN DEFAULT FALSE,
  saved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scraped_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_published_date ON articles(published_date DESC);
CREATE INDEX idx_is_saved ON articles(is_saved);
CREATE INDEX idx_source ON articles(source);
```

---

## ⚖️ Behavioral Rules

**Core Principles:**
1. Data-First: No coding before schema definition ✅
2. Self-Healing: Update architecture docs when errors occur
3. Deterministic: Business logic must be predictable and testable

**Specific Rules:**
- **Scraping Frequency:** Run scraper every 24 hours
- **Time Window:** Only fetch articles from the last 24 hours
- **Deduplication:** Use article URL as unique identifier to prevent duplicates
- **Data Persistence:** Saved articles must persist across page refreshes
- **UI/UX:** Dashboard must be gorgeous, interactive, and visually stunning
- **Error Handling:** If scraping fails, log error but don't crash the dashboard
- **Empty State:** If no new articles in 24h, display "No new articles" message
- **Performance:** Dashboard should load quickly even with 100+ articles

---

## 🏛️ Architectural Invariants

### Layer 1: Architecture (`architecture/`)
- All SOPs must be updated before code changes
- Each SOP defines: Goal, Inputs, Process, Outputs, Edge Cases

### Layer 2: Navigation (Decision Making)
- Route data between SOPs and Tools
- No complex business logic in this layer

### Layer 3: Tools (`tools/`)
- Atomic, testable Python scripts
- All secrets in `.env`
- All intermediates in `.tmp/`

---

## 🔐 Integration Points

**External Services:**
- **Supabase** (Database & Backend) - For storing articles and saved state
- **Ben's Bites Newsletter** - Web scraping target
- **AI Rundown Newsletter** - Web scraping target
- **Reddit** (r/artificial, r/MachineLearning) - API or web scraping target

**API Endpoints:**
- Ben's Bites: https://www.bensbites.co/ (web scraping)
- AI Rundown: https://www.therundown.ai/ (web scraping)
- Reddit: https://www.reddit.com/r/artificial.json (API preferred)

**Credentials Required:**
- Supabase URL and API Key (to be added to `.env`)
- Reddit API credentials (optional, can use public JSON endpoints)

---

## 🎨 Brand Guidelines (Popm)

### Color Palette
- **Primary:** `#BFF549` (Neon Green - Returns as main accent)
- **Background:** `#000300` (Almost Black)
- **Text Primary:** `#ffffff` (White - High Contrast)
- **Card Surface:** `#111111` (Dark Grey)
- **Glow:** `#BFF549` (Neon Green Shadows)

### Typography
- **Font Family:** Montserrat (Google Fonts)
- **H1:** 96px (Bold, Minimalist)
- **H2:** 48px
- **Style:** All-caps headers with subtle text shadows.

### Logo
- **Location:** `/public/logo.png`
- **Treatment:** Inverted to white + Neon Green Drop Shadow for visibility on black.

### Design Philosophy
**"Forged by Chaos, Illuminated by Purpose"**
- **Hybrid Aesthetic:** Sleek monochrome base with aggressive neon accents.
- **Interactive:** High-impact hover states (Zoom, Glow, Lift).
- **"Crazy" Thumbnails:** Saturation and contrast boost on hover to drive clicks.

### UI Implementation Requirements
- **Theme:** Ultra-dark mode (`#000300`).
- **Components:** Sharp edges, neon border glows.
- **Interactivity:** Elements must feel "alive" with neon feedback.

---

## 📊 Maintenance Log

### 2026-02-14T14:39:26+05:30
- **Action:** Project initialization
- **Status:** Created gemini.md as Project Constitution
- **Next:** Awaiting Discovery Questions responses

### 2026-02-14T15:03:36+05:30
- **Action:** Discovery Questions answered
- **Status:** Data Schema defined and approved
- **Changes:** 
  - Defined Input/Output schemas for articles
  - Created Supabase table schema
  - Documented behavioral rules
  - Identified integration points
- **Next:** Research scraping approaches for Ben's Bites, AI Rundown, Reddit

### 2026-02-14T15:30:04+05:30
- **Action:** Brand guidelines integrated
- **Status:** Popm brand identity added to project
- **Changes:**
  - Added color palette (#BFF549 neon green on #000000 black)
  - Defined typography (Inter font, H1: 96px, H2: 48px, Body: 24px)
  - Referenced logo and design inspiration
  - Specified dark theme with neon accents as primary design direction
- **Next:** Build dashboard with Popm branding
