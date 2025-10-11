# Architecture

This document describes the technical architecture of the Together Assessments website, including configuration systems, directory structure, key technologies, and build processes.

## Table of Contents

1. [Configuration System](#configuration-system)
2. [Directory Structure](#directory-structure)
3. [Key Technologies & Patterns](#key-technologies--patterns)
4. [Content Collections](#content-collections)
5. [Blog System](#blog-system)
6. [Build & Deployment](#build--deployment)

---

## Configuration System

### Configuration Hierarchy

The site uses a multi-layered configuration system:

1. **src/config.yaml** - Framework-level configuration (AstroWind defaults)
   - Site metadata and SEO defaults
   - Blog system settings
   - Analytics configuration
   - UI theme settings
   - **IMPORTANT**: This file OVERRIDES `astro.config.ts` settings

2. **Content configuration** - Organised hierarchically:
   - `src/content/site-settings.yaml` - Company information (name, email, ICO registration), logo settings, footer information
   - `src/content/home-page/content.yaml` - Homepage-specific content including hero section, CTAs, section titles, and how-it-works steps

3. **astro.config.ts** - Astro build configuration, integrations, and markdown plugins

4. **vendor/integration/** - Custom AstroWind integration that processes config.yaml and makes it available via virtual module `astrowind:config`

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
│   ├── images/          # Uploaded images (optimised at build time)
│   └── styles/          # Global styles (tailwind.css)
├── components/
│   ├── blog/           # Blog-specific components
│   ├── common/         # Shared utilities (Analytics, Metadata, etc.)
│   ├── ui/             # UI primitives (Button, Form, Headline, etc.)
│   └── widgets/        # Page sections (Header, Footer, Hero, Features, etc.)
├── content/            # Content collections with CMS management
│   ├── config.ts       # Collection schemas and loaders
│   ├── site-settings.yaml
│   ├── site-settings/trust-badges/
│   ├── home-page/content.yaml
│   ├── faqs-page/
│   ├── services-page/
│   ├── contact-page/
│   ├── consultation-page/
│   ├── text-pages/
│   └── post/           # Blog posts (currently empty, posts load from src/data/post/)
├── data/
│   └── post/           # Blog posts as .md or .mdx files
├── layouts/            # Page layouts
│   ├── Layout.astro
│   ├── PageLayout.astro
│   ├── MarkdownLayout.astro
│   └── LandingLayout.astro
├── pages/              # Routes (file-based routing)
│   ├── [...blog]/      # Dynamic blog routing with categories and tags
│   ├── index.astro     # Homepage
│   ├── about.astro
│   ├── services.astro
│   ├── fees.astro
│   ├── faq.astro
│   ├── contact.astro
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
├── utils/              # Helper functions
│   ├── blog.ts         # Blog utilities
│   ├── images.ts       # Image processing
│   ├── images-optimization.ts
│   ├── permalinks.ts   # URL generation
│   ├── frontmatter.ts  # Frontmatter processing
│   └── utils.ts        # General utilities
├── navigation.ts       # Navigation configuration
├── config.yaml         # Site configuration
└── env.d.ts           # TypeScript environment definitions

public/
├── admin/
│   ├── config.yml      # Decap CMS configuration
│   └── collections/    # CMS collection definitions
└── fonts/              # Font files (woff2, woff, ttf)

vendor/
└── integration/        # Custom AstroWind integration
```

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

### Available Collections

| Collection | Type | Location | Purpose |
|------------|------|----------|---------|
| `post` | Folder | `src/data/post/` | Blog posts |
| `faqs_page_items` | Folder | `src/content/faqs-page/faq-items/` | FAQ Q&A pairs |
| `faqs_page_top_content` | File | `src/content/faqs-page/top-content.yaml` | FAQ page header |
| `services_page_items` | Folder | `src/content/services-page/services/` | Service offerings |
| `services_page_top_content` | File | `src/content/services-page/top-content.yaml` | Services page header |
| `consultation_page` | File | `src/content/consultation-page/content.yaml` | Consultation booking page |
| `contact_page` | File | `src/content/contact-page/content.yaml` | Contact page content |
| `site_settings_trust_badges` | Folder | `src/content/site-settings/trust-badges/` | Professional badges |
| `text_pages` | Folder | `src/content/text-pages/` | Static content pages |

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

**Location**: `src/config.yaml`

```yaml
apps:
  blog:
    isEnabled: true
    postsPerPage: 6

    post:
      permalink: '/%slug%'  # Post URL pattern
      robots:
        index: true

    list:
      pathname: 'blog'      # Main blog path
      robots:
        index: true

    category:
      pathname: 'category'  # Category path
      robots:
        index: true

    tag:
      pathname: 'tag'       # Tag path
      robots:
        index: false        # Tags are noindex

    isRelatedPostsEnabled: true
    relatedPostsCount: 4
```

### File Structure

- **Posts location**: `src/data/post/`
- **File formats**: `.md` or `.mdx`
- **Dynamic routing**: `src/pages/[...blog]/`

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

### Deployment

**IMPORTANT**: Site configuration is controlled by `src/config.yaml` which OVERRIDES `astro.config.ts` settings.

#### Current Deployment (Netlify)

- Site: `https://nd-assessment-site.netlify.app`
- Base path: `/`
- Auto-deploys from `main` branch
- Branch previews enabled via Editorial Workflow

#### Switching to Custom Domain

1. **Netlify**: Domain settings → Add custom domain
2. **Update `src/config.yaml`**:
   ```yaml
   site:
     site: 'https://yourcustomdomain.com'
     base: '/'
   ```
3. **Update `public/admin/config.yml`**:
   ```yaml
   site_url: https://yourcustomdomain.com
   display_url: https://yourcustomdomain.com
   ```

### Build Commands

```bash
# Development
npm run dev          # Astro dev + CMS proxy (ports 4321 & 8081)

# Production build
npm run build        # Build to dist/

# Preview built site
npm run preview      # Serve dist/ locally
```

### Performance Optimisations

- **Font preloading** - Critical fonts loaded early
- **Image lazy loading** - Below-fold images defer loading
- **CSS optimization** - Tailwind purges unused styles
- **JavaScript bundling** - Code splitting and minification
- **Static generation** - Pre-rendered HTML for fast loads

### Environment Variables

Not currently used, but Astro supports:

- `.env` - Local development
- `.env.production` - Production builds
- `import.meta.env` - Access in code

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
      id: null  # Set to "G-XXXXXXXXXX" to enable
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
