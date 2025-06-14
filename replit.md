# SEO Analysis Tool

## Overview

This is a comprehensive SEO analysis tool built with a modern full-stack architecture. The application allows users to input a website URL and receive detailed SEO analysis reports including technical checks, content analysis, performance metrics, and user experience evaluation. The tool provides actionable insights and recommendations to improve website SEO performance.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Web Scraping**: Puppeteer for browser automation and page analysis
- **HTML Parsing**: Cheerio for server-side DOM manipulation
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Centralized schema definition in `/shared/schema.ts`
- **Main Entity**: `seo_analyses` table storing comprehensive SEO analysis results
- **Data Types**: JSONB columns for flexible storage of issues, recommendations, and technical checks

## Key Components

### SEO Analysis Engine
- **SeoAnalyzer Class**: Core analysis engine that performs comprehensive website evaluation
- **Technical Checks**: HTTPS validation, mobile responsiveness, meta tags analysis
- **Content Analysis**: Title tags, meta descriptions, heading structure evaluation
- **Performance Metrics**: Page load time measurement using Puppeteer
- **User Experience Analysis**: Navigation, accessibility, and usability checks

### Frontend Components
- **Dashboard**: Main interface for initiating and viewing SEO analyses
- **SeoAnalysisForm**: URL input form with validation
- **SeoScoreCircle**: Animated circular progress indicator for overall scores
- **CategoryBreakdown**: Visual breakdown of technical, content, performance, and UX scores
- **IssuesRecommendations**: Tabbed interface displaying actionable insights
- **MetricsTable**: Detailed technical checks with pass/fail status

### Data Storage Strategy
- **Memory Storage**: Development fallback with in-memory data storage
- **PostgreSQL Integration**: Production-ready database with connection pooling
- **Schema Validation**: Zod schemas for runtime type validation
- **Migration System**: Drizzle Kit for database schema migrations

## Data Flow

1. **User Input**: User enters website URL through the analysis form
2. **Server Processing**: Express server receives request and initiates Puppeteer browser instance
3. **Website Analysis**: SeoAnalyzer performs comprehensive checks including:
   - Page loading and performance measurement
   - HTML content parsing with Cheerio
   - Technical SEO validation
   - Content quality assessment
4. **Data Storage**: Analysis results stored in PostgreSQL database
5. **Response Generation**: Structured analysis report sent back to client
6. **UI Rendering**: React components render interactive analysis dashboard

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database connection for serverless environments
- **puppeteer**: Headless Chrome automation for web scraping
- **cheerio**: jQuery-like server-side HTML manipulation
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management

### UI Dependencies
- **@radix-ui/react-***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **lucide-react**: Modern icon library

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **vite**: Frontend build tool with HMR support

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Hot Reload**: Vite dev server with Express middleware integration
- **Database**: Local PostgreSQL instance with Drizzle migrations

### Production Build
- **Frontend**: Static assets built to `dist/public` directory
- **Backend**: Bundled Express server with esbuild
- **Database**: PostgreSQL with connection string from environment variables
- **Deployment**: Replit autoscale deployment with port 5000 -> 80 mapping

### Configuration
- **Environment Variables**: `DATABASE_URL` required for PostgreSQL connection
- **Build Process**: Two-stage build with frontend assets and backend bundling
- **Static Serving**: Express serves built frontend assets in production

## Changelog

```
Changelog:
- June 14, 2025. Content analysis system fully implemented and working:
  - Fixed PostgreSQL JSONB array conversion issues affecting technical checks display
  - Implemented comprehensive content analysis with detailed metrics including:
    * Word count, sentence count, readability scores (Flesch Reading Ease)
    * Heading structure analysis with hierarchy validation
    * Image optimization tracking with alt text analysis
    * Link analysis (internal/external ratios)
    * Content quality scoring with emphasis and structure metrics
  - Added separate contentAnalysis database column for proper data storage
  - Connected ContentMetricsPanel to display detailed content insights
  - All SEO analysis components now working without errors
- June 14, 2025. Enhanced with comprehensive historical tracking system:
  - PostgreSQL database integration with websites, analyses, and score history tables
  - Real-time score trend visualization with Recharts line charts
  - Comparative analysis between current and previous scans
  - CSV export functionality for all historical data
  - Automated scan scheduling (daily/weekly/monthly options)
  - Website history dashboard with 4 tabs: Trends, Comparison, Analysis History, Auto-Scan
  - Fixed database schema to handle decimal scores properly
- June 14, 2025. Complete SEO analysis tool with full functionality:
  - Working Puppeteer web scraping with Chromium integration
  - Professional PDF report generation with jsPDF
  - All interactive buttons implemented (Share, Schedule, Fix Now, Guides)
  - Comprehensive SEO scoring across Technical, Content, Performance, UX
  - Real-time analysis with detailed recommendations and issues
- June 13, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```