# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Together Assessments website built on the AstroWind template (Astro 5.0 + Tailwind CSS). This is a custom implementation for a neurodiversity assessment service provider.

**For site structure and content management information**, see [WEBSITE.md](./WEBSITE.md) which documents:

- All pages and routes
- CMS collections and what they control
- Content configuration locations
- Navigation structure

This file (CLAUDE.md) focuses on **technical architecture**, development workflows, and implementation details.

## Reference Documentation

- **Template Examples**: Original AstroWind template examples are in `src/reference-examples/` for reference when building new components or understanding component usage patterns
- **Decap CMS Documentation**: Local documentation for Decap CMS is available in `decap-cms-docs/` for reference on CMS configuration and capabilities
- **Website Structure**: [WEBSITE.md](./WEBSITE.md) documents the site's pages, CMS collections, and content organisation

## Language and Spelling

**IMPORTANT**: All content, code comments, documentation, and user-facing text should be written in **British English**. This includes:

- Spelling (e.g., "colour" not "color", "centre" not "center", "optimise" not "optimize")
- Vocabulary (e.g., "organisation" not "organization", "favourite" not "favorite")
- Date formats (DD/MM/YYYY)
- Any generated content or copy

## Accessibility Features

This site implements comprehensive accessibility features tailored for neurodiversity:

### Custom Font System

The site includes three neurodiversity-friendly fonts with dynamic switching:

1. **Sylexiad Sans Medium** (default body/serif font)
   - Designed for readability with neurodiversity in mind
   - Set as `--aw-font-sans` and `--aw-font-serif` in CustomStyles.astro

2. **OpenDyslexic3** (dyslexia-friendly alternative)
   - Specialised font designed to reduce reading errors for dyslexic readers
   - Weighted bottoms help prevent letter confusion

3. **Fast Sans** (clean, fast-reading alternative)
   - Optimised for quick reading and reduced eye strain

4. **Together Assessments** (custom brand font)
   - Used for headings (`--aw-font-heading`)
   - Custom font specific to the Together brand

**Implementation:**

- Font definitions and CSS variables in `src/components/CustomStyles.astro`
- Font switcher dropdown in header via `src/components/common/ToggleFont.astro`
- User preference persisted in localStorage
- Font files located in `public/fonts/`
- Preloaded for performance with `size-adjust` for consistent metrics

**Working with fonts:**

- Fonts are set via CSS custom properties (`--aw-font-sans`, `--aw-font-serif`, `--aw-font-heading`)
- Tailwind config references these variables in `fontFamily` configuration
- All font changes should maintain accessibility and readability standards

## Essential Commands

### Development

```bash
npm run dev          # Starts BOTH Astro dev server AND CMS proxy server concurrently
npm run build        # Build production site to ./dist/
npm run preview      # Preview built site locally
```

**Note**: The `dev` command runs `concurrently "npx decap-server" "astro dev"` to enable local CMS editing at http://localhost:4321/admin/

### Code Quality & Validation

**Automated Pre-Commit Checks:**

The repository uses a git pre-commit hook that automatically enforces code quality before every commit:

- `npm run fix` - Auto-fixes all ESLint and Prettier issues
- `npm run check:astro` - Validates TypeScript types in Astro files
- Commits are **blocked** if unfixable linting issues or type errors exist
- Can bypass with `git commit --no-verify` (emergencies only)

**Manual Commands:**

```bash
npm run precommit       # Run pre-commit validation manually (fix + type check)
npm run check           # Read-only validation (for CI) - checks everything without modifying
npm run fix             # Auto-fix ESLint and Prettier issues
npm run check:astro     # Type-check Astro files only
npm run check:eslint    # Check ESLint rules only
npm run check:prettier  # Check Prettier formatting only
```

**Development Workflow:**

1. Write code as normal
2. Commit when ready - pre-commit hook runs automatically
3. Hook auto-fixes formatting and validates types
4. Commit proceeds if all checks pass, blocked if issues remain
5. Review any auto-fixes in `git diff` if commit was blocked

**For CI/CD:** Use `npm run check` for comprehensive read-only validation without modifying files.

## Development Tools

### Playwright MCP (Browser Automation)

Playwright is available via MCP for visual debugging and verification:

**When to use Playwright:**

- Debugging visual issues and layout problems
- Verifying implementations of UI components
- Testing responsive designs at different viewport sizes
- Capturing screenshots for documentation or bug reports
- Automating browser interactions for testing

**Available tools:**

- `browser_navigate`: Navigate to URLs (both local dev and production)
- `browser_snapshot`: Get accessibility tree snapshot (better than screenshots for most debugging)
- `browser_take_screenshot`: Capture visual screenshots
- `browser_click`, `browser_type`, `browser_hover`: Interact with elements
- `browser_evaluate`: Run JavaScript in browser context
- `browser_resize`: Test different viewport sizes
- `browser_console_messages`: Check for console errors

**Common workflows:**

1. Start dev server with `npm run dev`
2. Use `browser_navigate` to http://localhost:4321
3. Use `browser_snapshot` to inspect page structure
4. Use `browser_screenshot` to capture visual state
5. Use `browser_evaluate` to debug JavaScript issues

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

**Configuration Architecture**:

1. **src/config.yaml**: Framework-level configuration (AstroWind defaults)
   - Site metadata and SEO defaults
   - Blog system settings
   - Analytics configuration
   - UI theme settings

2. **Content configuration** - Organised hierarchically:
   - `src/content/site-settings.yaml`: Company information (name, email, ICO registration), logo settings, footer information
   - `src/content/home-page/content.yaml`: Homepage-specific content including hero section, CTAs, section titles, and how-it-works steps

3. **astro.config.ts**: Astro build configuration, integrations, and markdown plugins

4. **vendor/integration/**: Custom AstroWind integration that processes config.yaml and makes it available via virtual module `astrowind:config`

### Directory Structure

- **src/components/**: Reusable components organized by type
  - `widgets/`: Page sections (Header, Footer, Hero, Features, etc.)
  - `ui/`: UI primitives (Button, Form, Headline, etc.)
  - `blog/`: Blog-specific components
  - `common/`: Shared utilities (Analytics, Metadata, etc.)
- **src/layouts/**: Page layouts (Layout, PageLayout, MarkdownLayout, LandingLayout)
- **src/pages/**: Routes - each file creates a page route
  - `[...blog]/`: Dynamic blog routing with categories and tags
  - Various policy and legal pages
- **src/content/**: Content collections with CMS management
  - `config.ts`: Collection schemas and loaders
  - `site-settings.yaml`: Site-wide configuration
  - `site-settings/trust-badges/`: Professional accreditation badges
  - `home-page/content.yaml`: Homepage content configuration
  - `faqs-page/faq-items/`: FAQ content items
  - `services-page/services/`: Service descriptions
  - `post/`: Blog posts (currently empty, posts load from src/data/post/)
- **src/utils/**: Helper functions for blog, images, permalinks, frontmatter processing
- **src/navigation.ts**: Navigation configuration with responsive menu structures

### Navigation Architecture

The site uses a responsive navigation system defined in `src/navigation.ts`:

- **Desktop Navigation** (`desktopLinks`): Displays at `xl:` breakpoint and above (1280px+)
- **Tablet Navigation** (`tabletLinks`): Displays between `md:` and `xl:` breakpoints (768px-1279px)
- **Footer Navigation** (`footerData`): Pulls site name and email from `src/content/site-settings.yaml`

**Implementation:**

- Header component (`src/components/widgets/Header.astro`) switches between desktop/tablet menus based on breakpoint
- Permalink utilities (`getPermalink()`, `getBlogPermalink()`) used for consistent URL generation
- External links to sister sites use `target: '_blank'`

**When modifying navigation:**

- Update both `desktopLinks` and `tabletLinks` to maintain consistency across breakpoints
- See [WEBSITE.md](./WEBSITE.md#navigation) for the full navigation structure

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

### Content Collections

The site uses Astro Content Collections for structured content management. All collections are defined in `src/content/config.ts` with schemas using Zod validation.

**Available Collections:**

- `post` - Blog posts (loaded from `src/data/post/`)
- `faqs_page_items` - FAQ question/answer pairs
- `faqs_page_top_content` - FAQ page header content
- `services_page_items` - Service offerings
- `services_page_top_content` - Services page header content
- `consultation_page` - Consultation booking page content
- `site_settings_trust_badges` - Professional accreditation badges
- `text_pages` - Static content pages (About, Fees, policies, etc.)

**Technical Details:**

- Collections use glob loaders to watch file changes
- Schemas enforce data validation and type safety
- Collections support published/unpublished states via `published` field
- Display order controlled via `order` field (lower numbers appear first)
- Access collections in pages using `getCollection('collection_name')` or `getEntry('collection_name', 'entry_id')`

For detailed information about what each collection contains and controls, see [WEBSITE.md](./WEBSITE.md#content-management-cms).

### Blog System

- Posts stored in `src/data/post/` as .md or .mdx files
- Dynamic routing handles categories, tags, and pagination
- RSS feed generation at `/rss.xml`
- Related posts widget configured in config.yaml

### Styling Approach

- Custom styles in `src/components/CustomStyles.astro` and `src/assets/styles/tailwind.css`
  - `CustomStyles.astro` contains font definitions, CSS variables for fonts, colour theming, and dark mode styles
  - Defines `--aw-color-primary`, `--aw-color-secondary`, `--aw-color-accent` and text colours
  - Font preloading for performance optimisation
- Follow existing Tailwind utility patterns
- Dark mode toggle controlled via `ui.theme` in config.yaml
- Font switcher in header allows users to select preferred neurodiversity-friendly fonts

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

1. Run `npm run dev` - automatically starts:
   - Astro dev server at http://localhost:4321
   - Decap CMS proxy server for local editing
2. Access CMS at http://localhost:4321/admin/
3. No authentication required for local editing
4. Changes are saved directly to local files
5. All content collections are editable locally

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
- **Media**: Git-based storage in `src/assets/images/` with Astro optimisation pipeline
- **Collections**: Organised hierarchically in CMS UI using "/" in labels (e.g., "FAQs Page / FAQ Items")

For details on available CMS collections and what they control, see [WEBSITE.md](./WEBSITE.md#content-management-cms).

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

### Content Organisation Strategy

The CMS uses a hierarchical naming convention to group related content:

- **File Collections**: Used for single configuration files (Site Settings, Home Page)
- **Folder Collections**: Used for multiple items (FAQ Items, Service Items, Trust Badges)
- **Naming Convention**: Uses "/" in labels to create logical groupings in the CMS UI
- **Collection Names**: Use underscores in technical names (e.g., `faqs_page_items`) for Astro compatibility

### Adding New Content Types

To add new collections:

1. Edit `public/admin/config.yml` following the hierarchical naming pattern
2. Create corresponding content directories under `src/content/`
3. Update `src/content/config.ts` with the collection schema
4. Import collections in pages using `getCollection('collection_name')`
5. **Update [WEBSITE.md](./WEBSITE.md)** to document the new collection and what it controls

## Maintaining Documentation

**IMPORTANT**: When adding new features, pages, or CMS collections:

1. **Update WEBSITE.md** to document:
   - New pages and their routes
   - New CMS collections and what they control
   - Changes to navigation structure
   - New configuration options

2. **Update CLAUDE.md** (this file) only for:
   - Technical architecture changes
   - New development workflows or commands
   - Build system or deployment changes
   - Component library additions

This separation keeps WEBSITE.md focused on **what the site contains** and CLAUDE.md focused on **how to build and maintain it**.
