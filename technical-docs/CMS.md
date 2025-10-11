# CMS (Content Management System)

This document provides detailed information about the Decap CMS implementation, configuration, and workflows for the Together Assessments website.

## Table of Contents

1. [Overview](#overview)
2. [Local Development](#local-development)
3. [Production Editing](#production-editing)
4. [Editorial Workflow](#editorial-workflow)
5. [Image Management](#image-management)
6. [Authentication](#authentication)
7. [Configuration](#configuration)
8. [Content Organisation](#content-organisation)
9. [Adding New Collections](#adding-new-collections)

---

## Overview

**CMS**: Decap CMS (formerly Netlify CMS)
**Backend**: GitHub with Editorial Workflow
**Access**: `/admin/` route
**Storage**: Git-based (content committed to repository)

### Key Features

- Git-based content management
- Editorial Workflow for controlled publishing
- GitHub OAuth authentication
- Image optimization pipeline
- Markdown editor with rich text support
- Preview templates
- Branch-based drafts (no race conditions)

---

## Local Development

### Starting the CMS Locally

```bash
npm run dev
```

This command runs `concurrently "npx decap-server" "astro dev"` and starts:

1. **Decap CMS proxy server** on port 8081
2. **Astro dev server** on port 4321

### Accessing Local CMS

1. Navigate to `http://localhost:4321/admin/`
2. No authentication required (proxy server handles this)
3. Changes save directly to local files
4. All content collections are editable

### Local Workflow

- Edit content via CMS interface
- Changes write to local file system immediately
- Preview changes in dev server instantly
- Commit changes via Git when ready
- No Editorial Workflow stages in local mode

---

## Production Editing

### Accessing Production CMS

1. Navigate to `https://yoursite.com/admin/`
2. Click "Login with GitHub"
3. Authenticate with GitHub account (requires repository access)
4. Editorial Workflow interface loads

### User Permissions

**Required**: Write access to the GitHub repository

- Repository collaborators can edit
- External contributors need invitation
- Permissions managed via GitHub, not CMS

### Production Workflow Stages

See [Editorial Workflow](#editorial-workflow) section for details.

---

## Editorial Workflow

The CMS uses a three-stage Editorial Workflow before publishing:

### 1. Draft

**Status**: Work in progress

- Initial content creation
- Images uploaded but held in branch
- Changes saved to feature branch (not main)
- Multiple drafts can exist simultaneously
- No build triggered

**Branch naming**: `cms/{collection}/{slug}`

### 2. In Review

**Status**: Ready for review

- Creates Pull Request automatically
- Reviewers can comment on PR
- Preview deploy available (if configured)
- Can move back to Draft for edits
- Still no production build

**GitHub PR**: Automatically created and linked

### 3. Ready

**Status**: Approved and queued

- Content approved by reviewers
- Queued for publishing
- Final check before going live
- Can still move back to In Review
- Still no production build

### 4. Published

**Status**: Live on production

- **Action**: Merges PR to main branch
- **Trigger**: Single production build
- **Result**: Content goes live
- **Images**: Committed to repository
- **History**: Full Git commit history

### Benefits of Editorial Workflow

1. **No Race Conditions** - Single build per publish, not per edit
2. **No Orphaned Images** - Images only committed when content published
3. **Review Process** - Preview and approve changes before going live
4. **Version Control** - Full Git history with meaningful commit messages
5. **Rollback Capability** - Easy reversion through Git if needed
6. **Branch Isolation** - Multiple editors can work without conflicts

---

## Image Management

### Upload Location

**CMS uploads to**: `src/assets/images/`

**Referenced in content as**: `~/assets/images/filename.jpg`

### Automatic Optimization

Images are optimised at build time by Astro's asset pipeline:

- **Formats**: Original + WebP conversion
- **Sizes**: Multiple responsive sizes
  - Breakpoints: 640px, 750px, 828px, 1080px, 1200px, 1920px, 2048px, 3840px, 6016px
- **Attributes**: Proper `srcset` and `sizes` for responsive loading
- **Lazy loading**: Below-fold images load on demand
- **Quality**: Optimised compression (configurable)

### Image Workflow

1. **Upload via CMS** - File uploads to `src/assets/images/` in branch
2. **Draft stage** - Images remain in feature branch
3. **Build preview** - Images optimised for preview deploy
4. **Publish** - Images committed to main branch
5. **Production build** - Final optimised versions generated

### Image Constraints

Configured in `public/admin/config.yml`:

```yaml
media_folder: src/assets/images
public_folder: ~/assets/images
```

Maximum file sizes and formats enforced by CMS configuration per field type.

### Preventing Orphaned Images

Editorial Workflow ensures images are only committed when content is published:

- Draft edits → Images stay in branch
- Discard draft → Branch deleted, images removed
- Publish content → Images committed with content
- Result: No orphaned images in repository

---

## Authentication

### Setup (Netlify Hosted)

**Current setup**: OAuth handled automatically by Netlify

- No additional configuration needed
- Netlify manages GitHub OAuth application
- Users authenticate via GitHub
- Repository permissions determine CMS access

### Just Works

1. User clicks "Login with GitHub" at `/admin/`
2. Redirected to GitHub OAuth
3. GitHub asks for permission
4. User redirected back to CMS
5. Authenticated and ready to edit

### Self-Hosted Alternative

If not using Netlify, GitHub OAuth application required:

1. Create GitHub OAuth App
2. Configure callback URL
3. Set environment variables
4. Update `public/admin/config.yml`

---

## Configuration

### Main Configuration File

**Location**: `public/admin/config.yml`

**Key sections**:

```yaml
backend:
  name: github
  repo: owner/repo-name
  branch: main

publish_mode: editorial_workflow

media_folder: src/assets/images
public_folder: ~/assets/images

site_url: https://yoursite.com
display_url: https://yoursite.com

collections:
  # Collection definitions
```

### Collection Definitions

Collections defined in `public/admin/config.yml` with additional per-collection YAML files in `public/admin/collections/`.

**Collection types**:

- **File collections** - Single configuration files (e.g., Site Settings, Home Page)
- **Folder collections** - Multiple items (e.g., FAQ Items, Blog Posts)

### Field Types

Decap CMS supports numerous field types:

- **Text fields**: string, text (multiline)
- **Rich content**: markdown, html
- **Media**: image, file
- **Selections**: select, boolean, relation
- **Structured**: list, object
- **Numbers**: number
- **Dates**: datetime, date
- **Hidden**: hidden (auto-set values)

Full documentation: See `decap-cms-docs/` directory

---

## Content Organisation

### Hierarchical Naming Convention

The CMS UI uses "/" in labels to create logical groupings:

**Example**:

- `label: "FAQs Page / Top Content"`
- `label: "FAQs Page / FAQ Items"`
- `label: "Services Page / Service Items"`

**Benefits**:

- Groups related content visually in CMS
- Clear hierarchy in sidebar
- Intuitive navigation for editors

### Collection Naming

**Technical names** use underscores for Astro compatibility:

- File: `faqs_page_top_content`
- Folder: `faqs_page_items`
- File: `services_page_top_content`
- Folder: `services_page_items`

**Display names** use "/" for hierarchy:

- Display: "FAQs Page / Top Content"
- Display: "FAQs Page / FAQ Items"

---

## Adding New Collections

To add a new content type to the CMS:

### 1. Edit CMS Configuration

**File**: `public/admin/config.yml`

Add collection definition following hierarchical naming pattern:

```yaml
collections:
  - name: 'new_collection_items'
    label: 'New Collection / Items'
    folder: 'src/content/new-collection/items'
    create: true
    fields:
      - { label: 'Title', name: 'title', widget: 'string' }
      - { label: 'Content', name: 'body', widget: 'markdown' }
      - { label: 'Order', name: 'order', widget: 'number', default: 0 }
      - { label: 'Published', name: 'published', widget: 'boolean', default: true }
```

### 2. Create Content Directory

```bash
mkdir -p src/content/new-collection/items
```

### 3. Define Collection Schema

**File**: `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newCollectionItems = defineCollection({
  loader: glob({ pattern: '**/*.{md,yaml}', base: './src/content/new-collection/items' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  // ... existing collections
  new_collection_items: newCollectionItems,
};
```

### 4. Use in Pages

```typescript
import { getCollection } from 'astro:content';

const items = await getCollection('new_collection_items', ({ data }) => {
  return data.published === true;
});

const sorted = items.sort((a, b) => a.data.order - b.data.order);
```

### 5. Update Documentation

**Update**: [WEBSITE.md](./WEBSITE.md) to document:

- New collection and what it controls
- Where content appears on site
- Field descriptions

---

## Common CMS Tasks

### Reordering Items

Use the `order` field (lower numbers appear first):

1. Edit item in CMS
2. Change order number
3. Save and publish
4. Items automatically sort by order field in code

### Hiding Content

Use the `published` boolean field:

1. Edit item
2. Toggle "Published" to off
3. Save and publish
4. Item no longer appears on site (filtered in code)

### Preview Before Publishing

1. Move content to "In Review" stage
2. CMS creates Pull Request
3. Netlify creates preview deploy (if configured)
4. Review preview URL in PR
5. Move to "Ready" and then "Publish" when satisfied

### Discarding Drafts

1. Open draft in CMS
2. Click "Delete" button
3. Confirm deletion
4. Branch and draft removed (images cleaned up)

### Bulk Updates

For bulk updates, consider editing files directly:

1. Clone repository locally
2. Edit files in `src/content/` directories
3. Commit and push changes
4. Bypass CMS for efficiency

---

## Troubleshooting

### Can't log in to CMS

- Check GitHub repository access permissions
- Verify Netlify OAuth configuration
- Try incognito/private browser window
- Check browser console for errors

### Images not appearing

- Verify image path uses `~/assets/images/` prefix
- Check image file exists in `src/assets/images/`
- Ensure image committed to main branch (published)
- Try rebuilding site

### Changes not appearing on site

- Check Editorial Workflow stage (must be "Published")
- Verify build completed successfully
- Check deploy logs on Netlify
- Clear browser cache

### CMS showing old structure

- Redeploy CMS configuration (`public/admin/config.yml`)
- Clear browser cache and reload `/admin/`
- Check for JavaScript console errors

---

**Last Updated**: 2025-10-11
