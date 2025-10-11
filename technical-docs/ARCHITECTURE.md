# Architecture

This document describes the technical architecture of the Together websites, including the multi-site system, configuration, directory structure, key technologies, and build processes.

## Table of Contents

1. [Multi-Site Architecture](#multi-site-architecture)
2. [Configuration System](#configuration-system)
3. [Directory Structure](#directory-structure)
4. [Key Technologies & Patterns](#key-technologies--patterns)
5. [Content Collections](#content-collections)
6. [Blog System](#blog-system)
7. [Build & Deployment](#build--deployment)

---

## Multi-Site Architecture

**Architecture Type**: Single Repository + Build-Time Site Generation

This project uses a multi-site architecture that generates three separate websites from a single codebase:

- **Together Assessments** (`togetherassessments.co.uk`)
- **Together ADHD** (`togetheradhd.co.uk`)
- **Together Autism** (`togetherautism.co.uk`)

### How It Works

The `SITE_ID` environment variable determines which site is being built. All site-specific behaviour is resolved at **build time** - there is zero runtime site detection.

```bash
# Build commands (one site at a time)
npm run build:assessments  # SITE_ID=assessments
npm run build:adhd         # SITE_ID=adhd
npm run build:autism       # SITE_ID=autism

# Development commands
npm run dev:assessments    # SITE_ID=assessments
npm run dev:adhd           # SITE_ID=adhd
npm run dev:autism         # SITE_ID=autism
```

### Site-Specific Resources

Each site has its own:

1. **Content** - `src/content/{assessments,adhd,autism}/`
   - Blog posts, FAQs, services, pages, settings
   - Completely independent content for each site

2. **Images** - `src/assets/images/{assessments,adhd,autism}/`
   - Logos (light/dark mode)
   - Hero images
   - Trust badges
   - All site-specific imagery

3. **CMS Configuration** - Generated at build time
   - `cms-config.template.js` defines collections once
   - `scripts/generate-cms-config.js` generates site-specific `public/admin/config.yml`
   - Runs automatically via `predev` and `prebuild` hooks

4. **Deployment Configuration** - Separate Netlify TOML files
   - `netlify-assessments.toml`
   - `netlify-adhd.toml`
   - `netlify-autism.toml`

### Key Implementation Files

| File                                  | Purpose             | Implementation                                                  |
| ------------------------------------- | ------------------- | --------------------------------------------------------------- |
| `src/env.d.ts`                        | Environment types   | Defines `SITE_ID` type as `'assessments' \| 'adhd' \| 'autism'` |
| `src/content/config.ts`               | Content collections | Uses `process.env.SITE_ID` to load site-specific content paths  |
| `src/components/Logo.astro`           | Dynamic logos       | Uses `import.meta.glob()` + SITE_ID to load correct logo        |
| `src/navigation.ts`                   | Dynamic navigation  | Filters "Together" menu to show other 2 sites                   |
| `src/components/widgets/Footer.astro` | Site settings       | Loads site-specific `site-settings.yaml`                        |
| `src/pages/index.astro`               | Homepage            | Loads site-specific `home-page/content.yaml`                    |
| `src/pages/contact.astro`             | Contact page        | Uses site-specific email from settings                          |

### Dynamic Together Menu

The navigation automatically shows links to the **other two sites**:

- **On Assessments site**: Shows "Together ADHD" and "Together Autism"
- **On ADHD site**: Shows "Together Assessments" and "Together Autism"
- **On Autism site**: Shows "Together Assessments" and "Together ADHD"

Implementation: `src/navigation.ts` filters the current site from the list at build time.

### Environment Variables

#### Required Variables

All builds require these environment variables:

- `SITE_ID` - Which site to build (`assessments`, `adhd`, or `autism`)
- `ASSESSMENTS_URL` - URL for Together Assessments site
- `ADHD_URL` - URL for Together ADHD site
- `AUTISM_URL` - URL for Together Autism site

#### Local Development

`.env` file (not committed to git):

```bash
ASSESSMENTS_URL=http://localhost:4321
ADHD_URL=http://localhost:4321
AUTISM_URL=http://localhost:4321
```

**Note**: Only one dev server runs at a time (always port 4321). Cross-site "Together" menu links all point to localhost during development.

#### Production (Netlify)

Environment variables set in Netlify TOML files:

```toml
[build.environment]
  SITE_ID = "assessments"
  ASSESSMENTS_URL = "https://togetherassessments.co.uk"
  ADHD_URL = "https://togetheradhd.co.uk"
  AUTISM_URL = "https://togetherautism.co.uk"
```

### CMS Configuration Generation

The CMS configuration is generated dynamically at build time:

1. **Template**: `cms-config.template.js` exports a function that takes `(siteId, siteUrls)`
2. **Generation**: `scripts/generate-cms-config.js` runs on `predev` and `prebuild` hooks
3. **Output**: `public/admin/config.yml` (site-specific, not committed)

This ensures:

- ✅ Single source of truth for all CMS collections
- ✅ Adding a field once applies to all 3 sites
- ✅ No duplicated CMS configuration
- ✅ Build fails if environment variables missing

### Build-Time Safety

The architecture enforces correctness at build time:

- ❌ Missing `SITE_ID` → Build fails with error
- ❌ Invalid `SITE_ID` → Build fails with error
- ❌ Missing site URLs → Build fails with error
- ❌ Missing logo file → Build fails with error
- ✅ All site logic resolved during build
- ✅ Zero runtime detection overhead

### Benefits of This Architecture

1. **Zero merge conflicts** - All content in one branch, separated by folders
2. **Clean dev experience** - Simple `npm run dev:*` commands
3. **Single codebase** - Bug fixes apply to all sites
4. **Flexible URLs** - Easy to change domains via environment variables
5. **Type safety** - TypeScript enforces correct SITE_ID values
6. **CMS efficiency** - Define collections once, used by all sites

---

## Configuration System

### Configuration Hierarchy

The site uses a multi-layered configuration system with **site-specific** content:

1. **src/config.yaml** - Framework-level configuration (AstroWind defaults, shared across all sites)
   - Site metadata and SEO defaults
   - Blog system settings
   - Analytics configuration
   - UI theme settings
   - **IMPORTANT**: This file OVERRIDES `astro.config.ts` settings

2. **Site-specific content configuration** - Loaded based on `SITE_ID`:
   - `src/content/{SITE_ID}/site-settings.yaml` - Company information (name, email, ICO registration), logo settings, footer information
   - `src/content/{SITE_ID}/home-page/content.yaml` - Homepage-specific content including hero section, CTAs, section titles, and how-it-works steps
   - Where `{SITE_ID}` is one of: `assessments`, `adhd`, `autism`

3. **astro.config.ts** - Astro build configuration, integrations, and markdown plugins (shared across all sites)

4. **vendor/integration/** - Custom AstroWind integration that processes config.yaml and makes it available via virtual module `astrowind:config`

5. **Environment-driven configuration**:
   - `SITE_ID` - Determines which site is being built
   - Site URLs (`ASSESSMENTS_URL`, `ADHD_URL`, `AUTISM_URL`) - Used for cross-site navigation
   - Netlify TOML files provide production environment variables

### Import Resolution

- Use `~/*` path alias for imports from src directory
  - Example: `import Logo from '~/components/Logo.astro'`
- Virtual module `astrowind:config` provides access to parsed configuration
  - Example: `import { UI } from 'astrowind:config'`

---

## Directory Structure

```
src/
├── assets/
│   ├── images/                    # Site-specific images (MULTI-SITE)
│   │   ├── assessments/           # Together Assessments images
│   │   ├── adhd/                  # Together ADHD images
│   │   └── autism/                # Together Autism images
│   └── styles/                    # Global styles (tailwind.css)
├── components/
│   ├── blog/                      # Blog-specific components
│   ├── common/                    # Shared utilities (Analytics, Metadata, etc.)
│   ├── ui/                        # UI primitives (Button, Form, Headline, etc.)
│   └── widgets/                   # Page sections (Header, Footer, Hero, Features, etc.)
├── content/                       # Site-specific content (MULTI-SITE)
│   ├── config.ts                  # Collection schemas (uses SITE_ID)
│   ├── assessments/               # Together Assessments content
│   │   ├── blog-posts/
│   │   ├── home-page/content.yaml
│   │   ├── site-settings.yaml
│   │   ├── site-settings/trust-badges/
│   │   ├── faqs-page/
│   │   ├── services-page/
│   │   ├── contact-page/
│   │   ├── consultation-page/
│   │   └── text-pages/
│   ├── adhd/                      # Together ADHD content
│   │   └── [same structure]
│   └── autism/                    # Together Autism content
│       └── [same structure]
├── layouts/                       # Page layouts (shared)
│   ├── Layout.astro
│   ├── PageLayout.astro
│   ├── MarkdownLayout.astro
│   └── LandingLayout.astro
├── pages/                         # Routes (file-based routing, shared)
│   ├── [...blog]/                 # Dynamic blog routing with categories and tags
│   ├── index.astro                # Homepage (loads site-specific content)
│   ├── about.astro
│   ├── services.astro
│   ├── fees.astro
│   ├── faq.astro
│   ├── contact.astro              # Uses site-specific email
│   ├── consultation.astro
│   ├── self-help.astro
│   ├── local-support.astro
│   ├── privacy-policy.astro
│   ├── cookie-policy.astro
│   ├── terms-of-service.astro
│   ├── safeguarding.astro
│   ├── accessibility-statement.astro
│   ├── data-retention-sar.astro
│   ├── refunds-cancellations.astro
│   ├── complaints.astro
│   ├── credits.astro
│   ├── 404.astro
│   └── rss.xml.ts
├── utils/                         # Helper functions (shared)
│   ├── blog.ts                    # Blog utilities
│   ├── images.ts                  # Image processing
│   ├── images-optimization.ts
│   ├── permalinks.ts              # URL generation
│   ├── frontmatter.ts             # Frontmatter processing
│   └── utils.ts                   # General utilities
├── navigation.ts                  # Navigation (dynamic Together menu)
├── config.yaml                    # Site configuration (shared)
└── env.d.ts                       # TypeScript environment definitions

public/
├── admin/
│   ├── config.yml                 # Generated by scripts/generate-cms-config.js
│   └── index.html                 # CMS interface with custom widgets
└── fonts/                         # Font files (woff2, woff, ttf)

scripts/
└── generate-cms-config.js         # Generates site-specific CMS config

cms-config.template.js             # CMS config template (single source of truth)

netlify-assessments.toml           # Netlify config for Assessments site
netlify-adhd.toml                  # Netlify config for ADHD site
netlify-autism.toml                # Netlify config for Autism site

.env                               # Local development environment variables

vendor/
└── integration/                   # Custom AstroWind integration
```

### Key Directories

**Site-Specific (duplicated per site)**:

- `src/content/{assessments,adhd,autism}/` - All content for each site
- `src/assets/images/{assessments,adhd,autism}/` - All images for each site

**Shared (used by all sites)**:

- `src/components/` - UI components
- `src/layouts/` - Page layouts
- `src/pages/` - Routes (load site-specific content)
- `src/utils/` - Helper functions
- `src/config.yaml` - Framework configuration

---

## Key Technologies & Patterns

### Core Technologies

- **Astro 5.0** - Static site generation with optional SSR support
- **Tailwind CSS** - Utility-first CSS with dark mode support
- **TypeScript** - Strict null checks enabled
- **Decap CMS** - Git-based content management
- **Markdown/MDX** - Content authoring with component support

### Image Optimization

- **Astro Assets** - Built-in image optimization
- **Unpic** - CDN optimization support
- Automatic generation of:
  - Multiple responsive sizes (640px to 6016px)
  - WebP format conversion
  - Proper srcset/sizes attributes

### Markdown Processing

Custom remark/rehype plugins provide:

- Reading time calculation
- Responsive tables
- Lazy image loading
- Code syntax highlighting (PrismJS)

### TypeScript Configuration

- Strict null checks enabled
- Path alias: `~/*` maps to `src/*`
- Type definitions in `src/env.d.ts` and `src/types.d.ts`

---

## Content Collections

The site uses Astro Content Collections for structured content management. All collections are defined in `src/content/config.ts` with Zod validation schemas.

**IMPORTANT**: All collection paths are **site-specific**, using `process.env.SITE_ID` to load content from the correct site folder (`assessments`, `adhd`, or `autism`).

### Available Collections

| Collection                   | Type   | Location Pattern                                       | Purpose                   |
| ---------------------------- | ------ | ------------------------------------------------------ | ------------------------- |
| `post`                       | Folder | `src/content/{SITE_ID}/blog-posts/`                    | Blog posts                |
| `faqs_page_items`            | Folder | `src/content/{SITE_ID}/faqs-page/faq-items/`           | FAQ Q&A pairs             |
| `faqs_page_top_content`      | File   | `src/content/{SITE_ID}/faqs-page/top-content.yaml`     | FAQ page header           |
| `services_page_items`        | Folder | `src/content/{SITE_ID}/services-page/services/`        | Service offerings         |
| `services_page_top_content`  | File   | `src/content/{SITE_ID}/services-page/top-content.yaml` | Services page header      |
| `consultation_page`          | File   | `src/content/{SITE_ID}/consultation-page/content.yaml` | Consultation booking page |
| `contact_page`               | File   | `src/content/{SITE_ID}/contact-page/content.yaml`      | Contact page content      |
| `site_settings_trust_badges` | Folder | `src/content/{SITE_ID}/site-settings/trust-badges/`    | Professional badges       |
| `text_pages`                 | Folder | `src/content/{SITE_ID}/text-pages/`                    | Static content pages      |

Where `{SITE_ID}` is one of: `assessments`, `adhd`, `autism`

### Collection Features

- **Glob loaders** - Automatic file watching and reloading
- **Schema validation** - Zod schemas enforce data structure
- **Published/unpublished states** - `published` field controls visibility
- **Display ordering** - `order` field (lower numbers appear first)
- **Type safety** - Full TypeScript support

### Accessing Collections

```typescript
// In .astro files
import { getCollection, getEntry } from 'astro:content';

// Get all items in a collection
const faqs = await getCollection('faqs_page_items');

// Get specific entry
const settings = await getEntry('site_settings', 'main');

// Filter published items
const published = await getCollection('faqs_page_items', ({ data }) => {
  return data.published === true;
});

// Sort by order
const sorted = published.sort((a, b) => a.data.order - b.data.order);
```

For detailed information about what each collection contains and controls, see [WEBSITE.md](./WEBSITE.md#content-management-cms).

---

## Blog System

### Configuration

**Location**: `src/config.yaml` (shared across all sites)

```yaml
apps:
  blog:
    isEnabled: true
    postsPerPage: 6

    post:
      permalink: '/%slug%' # Post URL pattern
      robots:
        index: true

    list:
      pathname: 'blog' # Main blog path
      robots:
        index: true

    category:
      pathname: 'category' # Category path
      robots:
        index: true

    tag:
      pathname: 'tag' # Tag path
      robots:
        index: false # Tags are noindex

    isRelatedPostsEnabled: true
    relatedPostsCount: 4
```

### File Structure (Multi-Site)

- **Posts location**: `src/content/{SITE_ID}/blog-posts/` (site-specific)
- **File formats**: `.md` or `.mdx`
- **Dynamic routing**: `src/pages/[...blog]/` (shared)
- Each site has its own blog posts, completely independent

### Features

- **Pagination** - 6 posts per page (configurable)
- **Categories** - Filtered archives with pagination
- **Tags** - Filtered archives (noindex for SEO)
- **Related posts** - 4 related posts shown per post
- **RSS feed** - Auto-generated at `/rss.xml`
- **Reading time** - Calculated automatically
- **Draft mode** - Hide posts in production

### URL Patterns

- Blog index: `/blog`
- Blog post: `/{slug}` (configurable)
- Category archive: `/category/{category-slug}`
- Tag archive: `/tag/{tag-slug}`
- RSS feed: `/rss.xml`

### Blog Post Schema

```typescript
{
  title: string;
  excerpt: string;        // 50-160 characters
  category: string;       // Tutorials, News, Updates, Resources
  tags: string[];         // 1-5 tags
  image: string;          // Optional featured image
  publishDate: Date;      // British format: DD/MM/YYYY
  author: string;
  draft: boolean;         // Hide in production
  // Optional SEO
  canonical?: string;
  noindex?: boolean;
}
```

---

## Build & Deployment

### Build Configuration

**Output mode**: Static (`output: 'static'`)

- Static HTML generation by default
- Supports hybrid and server modes
- Blog requires `prerender = true` for SSR

### Build Output

**Location**: `dist/` directory

- Optimised HTML, CSS, JavaScript
- Compressed images (WebP, multiple sizes)
- Minified assets
- Generated sitemap and RSS feed

### Deployment (Multi-Site)

**Architecture**: Three separate Netlify sites, one repository

Each site has its own:

- Netlify project
- Custom domain
- Build configuration (TOML file)
- Environment variables

#### Netlify Configuration Files

**netlify-assessments.toml**:

```toml
[build]
  command = "npm run build:assessments"
  publish = "dist"

[build.environment]
  SITE_ID = "assessments"
  ASSESSMENTS_URL = "https://togetherassessments.co.uk"
  ADHD_URL = "https://togetheradhd.co.uk"
  AUTISM_URL = "https://togetherautism.co.uk"
```

**netlify-adhd.toml**:

```toml
[build]
  command = "npm run build:adhd"
  publish = "dist"

[build.environment]
  SITE_ID = "adhd"
  ASSESSMENTS_URL = "https://togetherassessments.co.uk"
  ADHD_URL = "https://togetheradhd.co.uk"
  AUTISM_URL = "https://togetherautism.co.uk"
```

**netlify-autism.toml**:

```toml
[build]
  command = "npm run build:autism"
  publish = "dist"

[build.environment]
  SITE_ID = "autism"
  ASSESSMENTS_URL = "https://togetherassessments.co.uk"
  ADHD_URL = "https://togetheradhd.co.uk"
  AUTISM_URL = "https://togetherautism.co.uk"
```

#### Netlify Setup (Per Site)

1. Create new Netlify site
2. Connect to repository: `drewdotpro/assessment-site`
3. Set branch: `main`
4. Set config file path (site-specific):
   - Assessments: `netlify-assessments.toml`
   - ADHD: `netlify-adhd.toml`
   - Autism: `netlify-autism.toml`
5. Do NOT set environment variables in Netlify dashboard (all in TOML)
6. Configure domain (site-specific):
   - Assessments: `togetherassessments.co.uk`
   - ADHD: `togetheradhd.co.uk`
   - Autism: `togetherautism.co.uk`

#### Build Process (Per Site)

Each site will:

1. Trigger on push to main branch
2. Run `node scripts/generate-cms-config.js` (prebuild hook)
3. Generate site-specific CMS config to `public/admin/config.yml`
4. Run `npm run build:{site}` command
5. Build Astro with site-specific SITE_ID
6. Output to `dist/` folder
7. Deploy to respective domain

### Build Commands (Multi-Site)

```bash
# Development (one site at a time)
npm run dev:assessments    # Astro dev + CMS proxy (ports 4321 & 8081)
npm run dev:adhd           # Astro dev + CMS proxy (ports 4321 & 8081)
npm run dev:autism         # Astro dev + CMS proxy (ports 4321 & 8081)

# Production build (one site at a time)
npm run build:assessments  # Build Assessments to dist/
npm run build:adhd         # Build ADHD to dist/
npm run build:autism       # Build Autism to dist/

# Preview built site
npm run preview            # Serve dist/ locally
```

### Performance Optimisations

- **Font preloading** - Critical fonts loaded early
- **Image lazy loading** - Below-fold images defer loading
- **CSS optimization** - Tailwind purges unused styles
- **JavaScript bundling** - Code splitting and minification
- **Static generation** - Pre-rendered HTML for fast loads

### Environment Variables (Multi-Site)

**Required for all builds:**

- `SITE_ID` - Which site to build (`assessments`, `adhd`, or `autism`)
- `ASSESSMENTS_URL` - URL for Together Assessments site
- `ADHD_URL` - URL for Together ADHD site
- `AUTISM_URL` - URL for Together Autism site

**Local Development**: `.env` file (not committed):

```bash
ASSESSMENTS_URL=http://localhost:4321
ADHD_URL=http://localhost:4321
AUTISM_URL=http://localhost:4321
```

**Production**: Set in Netlify TOML files (see Deployment section above)

**Access in code:**

- Build-time: `process.env.SITE_ID`
- Runtime: `import.meta.env` (standard Astro pattern)

---

## Technical Notes

### Browser Support

- Modern browsers (ES2020+)
- CSS Grid and Flexbox required
- CSS custom properties required
- JavaScript required for:
  - Dark mode toggle
  - Font switcher
  - Mobile menu
  - Form validation

### SEO Configuration

Default SEO metadata in `src/config.yaml`:

- Title template: `%s — AstroWind`
- Default description
- OpenGraph settings (site_name, default image, type)
- Twitter Card settings (handle, cardType)
- Robots: index/follow defaults

Individual pages can override via frontmatter or page metadata.

### Analytics

Google Analytics support configured in `src/config.yaml`:

```yaml
analytics:
  vendors:
    googleAnalytics:
      id: null # Set to "G-XXXXXXXXXX" to enable
```

### Internationalization (i18n)

Currently configured for British English only:

```yaml
i18n:
  language: en
  textDirection: ltr
```

Future multi-language support would require:

- Additional language files
- Route prefixing (`/en/`, `/cy/`, etc.)
- Content duplication or translation system
- Language switcher component

---

**Last Updated**: 2025-10-11
