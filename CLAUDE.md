# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AstroWind is a production-ready Astro 5.0 + Tailwind CSS template for building websites. It focuses on performance, SEO, and web best practices.

## Language and Spelling

**IMPORTANT**: All content, code comments, documentation, and user-facing text should be written in **British English**. This includes:
- Spelling (e.g., "colour" not "color", "centre" not "center", "optimise" not "optimize")
- Vocabulary (e.g., "organisation" not "organization", "favourite" not "favorite")
- Date formats (DD/MM/YYYY)
- Any generated content or copy

## Essential Commands

### Development

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview built site locally
```

### Code Quality

```bash
npm run check        # Run all checks (astro, eslint, prettier)
npm run fix          # Auto-fix ESLint and Prettier issues
npm run check:astro  # Check Astro files
npm run check:eslint # Check ESLint rules
npm run check:prettier # Check Prettier formatting
```

**IMPORTANT**: Always run `npm run fix` after making changes to automatically fix linting and formatting issues before committing.

## Component Reference Documentation

### CHEATSHEET.md - Complete Component Guide

The `CHEATSHEET.md` file in this repository is a comprehensive reference guide containing:
- **55 documented components** with usage examples and prop descriptions
- Complete code snippets showing how to import and use each component
- Detailed prop lists with types and default values
- Special notes about component behavior and requirements
- Common patterns and best practices

**How to use CHEATSHEET.md:**
1. **Finding components**: Search for component names to quickly find usage examples
2. **Understanding props**: Each component lists all available props with descriptions
3. **Copy-paste examples**: Code snippets are ready to use with minor modifications
4. **Component categories**:
   - Widget Components (22): Major page sections like Hero, Features, Pricing
   - UI Components (9): Basic building blocks like Button, Form, ItemGrid
   - Blog Components (10): Blog-specific like GridItem, Tags, Pagination
   - Common Components (11): Utilities like Image, Analytics, Metadata
   - Layouts (4): Page structure templates

**Quick component lookup example:**
- Need a hero section? Search "Hero" to find Hero, Hero2, and HeroText variants
- Building a form? Search "Form" or "Contact" for form components
- Adding features? Search "Features" for Features, Features2, and Features3 options

## Architecture & Key Files

### Configuration System

- **src/config.yaml**: Main configuration for site metadata, blog settings, analytics, and UI theme
- **astro.config.ts**: Astro build configuration, integrations, and markdown plugins
- **vendor/integration/**: Custom AstroWind integration that processes config.yaml and makes it available via virtual module `astrowind:config`

### Directory Structure

- **src/components/**: Reusable components organized by type
  - `widgets/`: Page sections (Header, Footer, Hero, Features, etc.)
  - `ui/`: UI primitives (Button, Form, Headline, etc.)
  - `blog/`: Blog-specific components
  - `common/`: Shared utilities (Analytics, Metadata, etc.)
- **src/layouts/**: Page layouts (Layout, PageLayout, MarkdownLayout, LandingLayout)
- **src/pages/**: Routes - each file creates a page route
  - `[...blog]/`: Dynamic blog routing with categories and tags
  - `homes/`: Example homepage templates
  - `landing/`: Landing page templates
- **src/content/**: Content collections, primarily blog posts in markdown/MDX
- **src/utils/**: Helper functions for blog, images, permalinks, frontmatter processing

### Key Technologies & Patterns

- **Astro 5.0**: Static site generation with optional SSR support
- **Tailwind CSS**: Utility-first CSS with dark mode support
- **TypeScript**: Strict null checks enabled, path alias `~/*` maps to `src/*`
- **Content Collections**: Blog posts managed via Astro's content collections API
- **Image Optimization**: Uses Astro Assets and Unpic for CDN optimization
- **Markdown Processing**: Custom remark/rehype plugins for reading time, responsive tables, and lazy images

### Import Resolution

- Use `~/*` path alias for imports from src directory (e.g., `import Logo from '~/components/Logo.astro'`)
- Virtual module `astrowind:config` provides access to parsed configuration

### Blog System

- Posts stored in `src/content/post/` as .md or .mdx files
- Dynamic routing handles categories, tags, and pagination
- RSS feed generation at `/rss.xml`
- Related posts widget configured in config.yaml

### Styling Approach

- Custom styles in `src/components/CustomStyles.astro` and `src/assets/styles/tailwind.css`
- Follow existing Tailwind utility patterns
- Dark mode toggle controlled via `ui.theme` in config.yaml

### Build Output

- Static HTML generation by default (`output: 'static'`)
- Supports hybrid and server modes, but blog requires `prerender = true`
- Build artifacts output to `dist/` directory

### Deployment Configuration

**IMPORTANT**: The site configuration is controlled by `src/config.yaml` which OVERRIDES `astro.config.ts` settings.

**Current Deployment** (Netlify):

- Site: `https://nd-assessment-site.netlify.app`
- Base path: `/`
- Auto-deploys from `main` branch

**To Switch to Custom Domain** (future):

1. In Netlify: Domain settings → Add custom domain
2. Update `src/config.yaml`:

```yaml
site:
  site: 'https://yourcustomdomain.com'
  base: '/'
```

3. Update `public/admin/config.yml`:

```yaml
site_url: https://yourcustomdomain.com
display_url: https://yourcustomdomain.com
```

## Content Management System (CMS)

### Overview

Decap CMS (formerly Netlify CMS) is configured for content management with GitHub-based storage and Editorial Workflow for controlled publishing.

### Local Development

1. Run `npm run dev` to start both dev server and CMS proxy
2. Access CMS at http://localhost:4321/admin/
3. No authentication required for local editing
4. Changes are saved directly to local files

### Production Editing

1. Access CMS at https://yoursite.com/admin/
2. Authenticate with GitHub (uses repository permissions)
3. Editorial Workflow stages:
   - **Draft**: Initial content creation, image uploads held in branch
   - **In Review**: Creates Pull Request for review
   - **Ready**: Content approved and ready to publish
   - **Published**: Merges PR to main branch, triggers single build

### Image Management

- Images uploaded via CMS are stored in `src/assets/images/`
- Automatic optimization occurs at build time:
  - Multiple responsive sizes (640px to 6016px)
  - WebP format conversion for better compression
  - Proper srcset/sizes attributes for responsive loading
- Images referenced in content use `~/assets/images/` path
- Only committed when content is published (prevents orphaned images)

### CMS Configuration

- **Config Location**: `public/admin/config.yml`
- **Backend**: GitHub with Editorial Workflow
- **Collections**: Blog posts (expandable to pages)
- **Media**: Git-based storage with Astro optimization pipeline

### Authentication Setup

- **Current Setup**: Hosted on Netlify - OAuth works automatically
- **No additional configuration needed** - Netlify handles GitHub authentication
- **Just works** - Login with GitHub at `/admin/`

### Benefits of Editorial Workflow

1. **No Race Conditions**: Single build per publish, not per edit
2. **No Orphaned Images**: Images only committed when published
3. **Review Process**: Preview changes before going live
4. **Version Control**: Full Git history with meaningful commit messages
5. **Rollback**: Easy reversion through Git if needed

### Adding New Content Types

To add new collections (e.g., pages, products), edit `public/admin/config.yml` and add collection definitions following the existing blog post pattern.
