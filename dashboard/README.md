# 🚀 Popm AI News Dashboard

A beautiful, interactive dashboard that aggregates and displays the latest AI news articles from multiple sources, built with React, TypeScript, and Supabase.

![Popm Logo](./public/logo.png)

## ✨ Features

- 📰 **Multi-Source Aggregation**: Fetches AI news from Reddit, AI Rundown, and Ben's Bites
- 🎨 **Gorgeous UI**: Built with Popm brand guidelines (neon green #BFF549 on pure black #000000)
- 💾 **Save Articles**: Bookmark articles for later reading with persistent storage
- 🔍 **Advanced Filtering**: Filter by source, sort by date, and view saved articles
- ⚡ **Real-time Updates**: Automatic 24-hour refresh cycle
- 📱 **Responsive Design**: Mobile-first approach with smooth animations
- 🌙 **Dark Mode**: Sleek dark theme with neon green accents

## 🎨 Brand Guidelines

**Color Palette:**
- Primary: `#BFF549` (Vibrant Lime/Neon Green)
- Background: `#000000` (Pure Black)
- Text: `#FFFFFF` (White)
- Link: `#99A1AF` (Cool Gray)

**Typography:**
- Font: Inter (Google Fonts)
- H1: 96px
- H2: 48px
- Body: 24px

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Database**: Supabase
- **Styling**: Vanilla CSS with CSS Variables
- **Date Formatting**: date-fns

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Set up Supabase database**
   
   Create a table called `articles` with the following schema:
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

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Usage

### Viewing Articles
- The dashboard displays all articles from the last 24 hours by default
- Articles are shown in card format with source badges, titles, summaries, and metadata

### Filtering
- **By Source**: Click on source buttons (All, Reddit, AI Rundown, Ben's Bites)
- **By Date**: Sort by newest or oldest first
- **Saved Only**: Toggle to view only your saved articles

### Saving Articles
- Click the bookmark icon on any article card to save it
- Saved articles persist across sessions in Supabase
- View all saved articles by clicking "Saved Only"

### Refreshing
- Click the refresh button in the header to fetch the latest articles
- The dashboard automatically shows when it was last updated

## 📁 Project Structure

```
dashboard/
├── public/
│   └── logo.png              # Popm logo
├── src/
│   ├── components/
│   │   ├── ArticleCard.tsx   # Article card component
│   │   ├── Filters.tsx       # Filter controls
│   │   └── Header.tsx        # Header with logo and refresh
│   ├── App.tsx               # Main application component
│   ├── index.css             # Design system & styles
│   ├── main.tsx              # Application entry point
│   ├── supabase.ts           # Supabase client & services
│   └── types.ts              # TypeScript type definitions
├── .env.example              # Environment variables template
├── index.html                # HTML entry point
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🎯 Data Schema

### Article Object
```typescript
interface Article {
  id: string;
  source: 'reddit' | 'ai_rundown' | 'bens_bites';
  title: string;
  url: string;
  published_date: string;
  summary?: string;
  author?: string;
  tags: string[];
  is_saved: boolean;
  saved_at?: string;
  created_at: string;
  scraped_at: string;
}
```

## 🔧 Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🌟 Design Philosophy

This dashboard follows the **B.L.A.S.T. Protocol**:
- **Blueprint**: Data-first architecture with defined schemas
- **Link**: Supabase connectivity for persistent storage
- **Assemble**: Component-based React architecture
- **Stylize**: Popm brand guidelines with neon green accents
- **Trigger**: Ready for deployment and automation

## 📝 Next Steps

1. **Set up scrapers** in the `tools/` directory to populate the database
2. **Configure cron jobs** for 24-hour automated scraping
3. **Deploy to production** (Vercel, Netlify, or similar)
4. **Add search functionality** for finding specific articles
5. **Implement real-time updates** using Supabase subscriptions

## 🤝 Contributing

This project follows strict architectural principles:
- All changes must update relevant documentation
- Data schemas are defined before implementation
- Components are atomic and reusable
- Brand guidelines must be followed

## 📄 License

Built with ♥ using Popm brand guidelines

---

**Need help?** Check the project documentation in the parent directory:
- `gemini.md` - Project constitution
- `task_plan.md` - Development roadmap
- `findings.md` - Research and discoveries
- `progress.md` - Activity log
