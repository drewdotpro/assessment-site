# Accessibility

This document details the accessibility features implemented on the Together Assessments website, with a focus on neurodiversity-friendly design.

**Scope**: This document covers accessibility features, neurodiversity support, WCAG compliance, and testing procedures. For colour system implementation, see [COLOURS.md](./COLOURS.md).

## Table of Contents

1. [Accessibility Settings Panel](#accessibility-settings-panel)
2. [Neurodiversity-Friendly Fonts](#neurodiversity-friendly-fonts)
3. [Dark Mode](#dark-mode)
4. [Responsive Design](#responsive-design)
5. [Semantic HTML](#semantic-html)
6. [Keyboard Navigation](#keyboard-navigation)
7. [ARIA Labels](#aria-labels)
8. [Colour Contrast](#colour-contrast)

---

## Accessibility Settings Panel

The site features a unified accessibility settings panel that provides users with centralised control over their viewing preferences. This panel consolidates multiple accessibility features into a single, easy-to-access interface.

### Accessing the Panel

**Location**: Header (top-right corner)

- **Visual Button**: Click the accessibility icon (person in circle) in the site header
- **Keyboard Shortcut**: `Ctrl + Shift + A` (Windows/Linux) or `Cmd + Shift + A` (Mac)
- **Label**: "Accessibility Settings" or "Accessibility" (depending on screen size)

The button appears in both mobile and desktop navigation with synchronised state across all instances.

### Panel Features

The accessibility panel includes the following controls:

#### 1. Font Selection

**Status**: Fully Implemented

Three neurodiversity-friendly font options with visual preview:

- **Sylexiad Sans** (default) - General neurodiversity support
- **OpenDyslexic** - Specialised dyslexia support
- **Fast Sans** - Quick reading optimisation

Font names are displayed in their own typeface, allowing users to preview the font before selection. Selected font applies instantly across the entire site.

See [Neurodiversity-Friendly Fonts](#neurodiversity-friendly-fonts) section for detailed implementation.

#### 2. Theme Selection

**Status**: Fully Implemented

Three colour scheme options:

- **Light** - High contrast with dark text on light background
- **Dark** - Reduced brightness with light text on dark background
- **System** - Automatically matches operating system preference

Theme changes apply instantly and persist across sessions.

See [Dark Mode](#dark-mode) section and [COLOURS.md](./COLOURS.md) for detailed implementation.

#### 3. Text Size

**Status**: Fully Implemented

Five text size options with visual size representation in button labels:

- **XS (Extra Small)** - 87.5% of base size (14px equivalent)
- **SM (Small)** - 93.75% of base size (15px equivalent)
- **Base (Normal)** - 100% of base size (16px equivalent) - Default
- **LG (Large)** - 112.5% of base size (18px equivalent)
- **XL (Extra Large)** - 125% of base size (20px equivalent)

Text size changes apply instantly to:

- Body text content (paragraphs, list items, table cells)
- Headings (scaled proportionally to maintain hierarchy)
- Accessibility panel content itself
- All user-facing text across the site

Button labels display in their representative sizes (e.g., the "A+" button for XL shows larger text than the "A-" button for XS), providing immediate visual preview of each size option.

**Implementation**: Uses CSS custom property `--aw-text-size-scale` to scale font sizes dynamically. See [COLOURS.md](./COLOURS.md#text-size-scaling) for technical implementation details.

#### 4. Line Height

**Status**: Fully Implemented

Three line spacing options for improved readability:

- **Compact** - 1.2x line height - Tighter spacing for users who prefer denser text
- **Normal** - 1.5x line height (WCAG recommended, default) - Standard spacing meeting WCAG 2.1 SC 1.4.12 Level AA
- **Relaxed** - 2.0x line height - Wider spacing for improved readability and tracking

Line height changes apply instantly to all body text elements (paragraphs, list items, blockquotes, table cells) whilst excluding UI elements (buttons, navigation, headers) to maintain proper interface spacing. Headings maintain a fixed 1.2x line height for visual hierarchy.

**WCAG Compliance**: Default setting (Normal, 1.5x) meets WCAG 2.1 Success Criterion 1.4.12 (Level AA) which recommends line spacing of at least 1.5 times the font size for body text.

**Implementation**: Uses CSS custom property `--aw-line-height-scale` applied via body classes (`.line-height-compact`, `.line-height-normal`, `.line-height-relaxed`). See `src/components/CustomStyles.astro:244-342` for complete CSS implementation.

#### 5. Reading Ruler

**Status**: Placeholder UI

Toggle switch to enable/disable a reading ruler that follows the user's cursor. Currently logs state to console but does not render ruler. Intended for future implementation to help users with tracking difficulties focus on one line at a time.

#### 6. Reset to Defaults

**Status**: Fully Implemented

Button that resets all accessibility settings to their default values:

- Font: Sylexiad Sans
- Theme: System
- Text Size: Base
- Line Height: Normal (when implemented)
- Reading Ruler: Off (when implemented)

### Technical Implementation

**Components**:

1. **`src/components/common/ToggleAccessibility.astro`** - Header button component (Lines 7-17)
   - Uses `data-accessibility-toggle` attribute (not ID) to support multiple instances
   - Includes ARIA attributes for screen reader support
   - Visible in both mobile and desktop navigation
   - Responsive icon sizing:
     - Mobile/Tablet (< 1280px): 24px icon (larger for easier touch targets)
     - Desktop (≥ 1280px): 20px icon (balanced with "Accessibility" text label)

2. **`src/components/common/AccessibilityPanel.astro`** - Main panel component
   - Slide-in panel with backdrop overlay
   - Focus trap for keyboard navigation
   - Event delegation to handle all toggle buttons
   - Persistent settings via localStorage

3. **`src/components/common/AccessibilitySettings.ts`** - TypeScript utility
   - Defines settings interface and types
   - Provides default values
   - Type-safe settings management

**Settings Persistence**:

All settings are stored in localStorage under the key `accessibility-preferences`:

```typescript
interface AccessibilitySettings {
  font: 'sylexiad' | 'opendyslexic' | 'fast';
  theme: 'light' | 'dark' | 'system';
  textSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  readingRuler: boolean;
}
```

Settings persist across sessions and are automatically applied on page load.

**Event Delegation Pattern**:

The panel uses event delegation to handle multiple toggle buttons without duplicate IDs:

```javascript
// Listen for clicks on ANY button with [data-accessibility-toggle]
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-accessibility-toggle]');
  if (!target) return;

  // Toggle panel and sync aria-expanded on ALL buttons
  const allToggleButtons = document.querySelectorAll('[data-accessibility-toggle]');
  allToggleButtons.forEach((btn) => {
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  });
});
```

This approach ensures that:

- Multiple toggle buttons can exist (mobile + desktop views)
- All buttons stay synchronised
- No duplicate ID conflicts
- Works with dynamic content

**Astro View Transitions Compatibility**:

The site uses Astro's ClientRouter (View Transitions API) for client-side navigation. The accessibility panel has been designed to work seamlessly across page navigations:

Location: `src/components/common/AccessibilityPanel.astro:514-826`

```javascript
// Main initialization function - called on initial load AND after each navigation
function initializeAccessibilityPanel() {
  currentSettings = getSettings();
  applySettings(currentSettings);
  updateUI(currentSettings);
}

// Run on initial page load
initializeAccessibilityPanel();

// Re-initialize after each client-side navigation
document.addEventListener('astro:page-load', () => {
  initializeAccessibilityPanel();
});
```

All event listeners use document-level event delegation (as described above) which persists across page navigations. When a user navigates to a new page:

1. Event listeners remain active (attached to document, not page-specific elements)
2. `astro:page-load` event fires
3. Settings are reloaded from localStorage
4. UI state is updated to match current settings
5. All controls remain functional

This ensures the accessibility panel opens correctly and all controls (text size, font, theme, etc.) work after navigation, without requiring page refresh.

**Focus Trap**:

When the panel opens, keyboard focus is trapped within the panel:

- `Tab` cycles forward through controls
- `Shift + Tab` cycles backward
- `Esc` closes the panel and returns focus to the toggle button
- Focus cannot escape the panel while open

**Responsive Behaviour**:

- **Desktop/Tablet** (768px+): Slides in from the right side
- **Mobile** (< 768px): Slides up from the bottom
- **Backdrop**: Semi-transparent overlay with backdrop blur effect
- **Width**: 320px on desktop/tablet, full width on mobile

**Keyboard Accessibility**:

- All controls fully keyboard accessible
- Focus indicators on all interactive elements
- Radio buttons and toggle switches support arrow key navigation
- `Enter` and `Space` activate buttons
- `Esc` closes the panel

**ARIA Attributes**:

```html
<aside
  id="accessibility-panel"
  role="dialog"
  aria-modal="true"
  aria-label="Accessibility Settings"
  class="accessibility-panel"
></aside>
```

- `role="dialog"` - Identifies as modal dialog
- `aria-modal="true"` - Indicates modal behaviour
- `aria-label` - Provides context for screen readers
- `aria-expanded` - Dynamically updated on toggle buttons

### Usage for Developers

**Adding the Panel to a Layout**:

```astro
---
import ToggleAccessibility from '~/components/common/ToggleAccessibility.astro';
import AccessibilityPanel from '~/components/common/AccessibilityPanel.astro';
---

<header>
  <!-- Other header content -->
  <ToggleAccessibility />
</header>

<!-- Panel renders once, outside header -->
<AccessibilityPanel />
```

**Reading Settings in JavaScript**:

```javascript
const settings = JSON.parse(
  localStorage.getItem('accessibility-preferences') ||
    JSON.stringify({
      font: 'sylexiad',
      theme: 'system',
      textSize: 'base',
      lineHeight: 'normal',
      readingRuler: false,
    })
);
```

**Applying Custom Settings**:

```javascript
// Example: Listen for settings changes
window.addEventListener('storage', (e) => {
  if (e.key === 'accessibility-preferences') {
    const newSettings = JSON.parse(e.newValue);
    // Apply your custom logic here
  }
});
```

---

## Neurodiversity-Friendly Fonts

The site implements a custom font system allowing users to select their preferred reading font, with a focus on neurodiversity and dyslexia support.

### Available Fonts

1. **Sylexiad Sans Medium** (default)
   - Designed for readability with neurodiversity in mind
   - Set as `--aw-font-sans` and `--aw-font-serif`
   - Used for body text and general content

2. **OpenDyslexic3**
   - Specialised font designed to reduce reading errors for dyslexic readers
   - Weighted bottoms help prevent letter confusion
   - Increases letter height and spacing

3. **Fast Sans**
   - Optimised for quick reading and reduced eye strain
   - Clean, modern design
   - OpenType contextual alternates (calt) feature for letter highlighting

4. **Together Assessments** (brand font)
   - Custom font specific to the Together brand
   - Used for headings only (`--aw-font-heading`)
   - Not user-selectable (remains consistent for branding)

### Implementation

**Font Definitions**

Location: `src/components/CustomStyles.astro:24-70`

```css
@font-face {
  font-family: 'Sylexiad Sans Medium';
  src:
    url('/fonts/SylexiadSansMedium.woff2') format('woff2'),
    url('/fonts/SylexiadSansMedium.woff') format('woff'),
    url('/fonts/SylexiadSansMedium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  size-adjust: 120%;
}

/* Similar @font-face rules for other fonts */
```

**CSS Custom Properties**

Location: `src/components/CustomStyles.astro:81-84`

```css
:root {
  --aw-font-sans: 'Sylexiad Sans Medium', ui-sans-serif, system-ui, sans-serif;
  --aw-font-serif: 'Sylexiad Sans Medium', ui-serif, Georgia, serif;
  --aw-font-heading: 'Together Assessments', ui-sans-serif, system-ui, sans-serif;
}
```

**Tailwind Configuration**

Location: `tailwind.config.js:23-27`

```javascript
fontFamily: {
  sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
  serif: ['var(--aw-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
  heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
}
```

**Font Selection Interface**

Location: `src/components/common/AccessibilityPanel.astro`

The font selection interface is part of the Accessibility Settings panel:

- **Visual Preview**: Font names are displayed in their own typeface, allowing users to see what each font looks like before selecting it
- **Radio Button Selection**: Three font options with clear labels
- **Instant Application**: Selected font is immediately applied to the page
- **Persistent Preference**: Choice saved to localStorage and persists across sessions

**Font Selection HTML**:

```html
<label class="accessibility-radio-label">
  <input type="radio" name="font" value="sylexiad" />
  <span class="font-preview" style="font-family: 'Sylexiad Sans Medium', sans-serif;"> Sylexiad Sans </span>
</label>
```

**Font Switching Logic**

Location: `src/components/common/AccessibilityPanel.astro:781-790`

```javascript
function applyFont(font) {
  const fonts = {
    sylexiad: 'Sylexiad Sans Medium, ui-sans-serif, system-ui, -apple-system',
    opendyslexic: 'OpenDyslexic3, ui-sans-serif, system-ui, -apple-system',
    fast: 'Fast Sans, ui-sans-serif, system-ui, -apple-system',
  };

  document.documentElement.style.setProperty('--aw-font-sans', fonts[font]);
}
```

### Font Files

**Location**: `public/fonts/`

**Formats provided**:

- `.woff2` - Modern browsers (primary)
- `.woff` - Fallback for older browsers
- `.ttf` - Ultimate fallback

**Font Preloading Strategy**:

Location: `src/components/CustomStyles.astro:20-23`

All four fonts are preloaded immediately on page load to eliminate FOUT (Flash of Unstyled Text):

```html
<link rel="preload" href="/fonts/TogetherAssessments-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/SylexiadSansMedium.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/OpenDyslexic3-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Fast_Sans.woff2" as="font" type="font/woff2" crossorigin />
```

**Why preload all fonts?**

- Ensures instant font switching with no loading delay
- Eliminates FOUT when accessibility panel is opened
- Small performance trade-off (~200KB compressed) for significantly better user experience
- All fonts are needed for core accessibility functionality

### Size Adjustments

**Purpose**: Ensure consistent metrics across different fonts

```css
@font-face {
  font-family: 'Sylexiad Sans Medium';
  size-adjust: 120%; /* Slightly larger for readability */
}

@font-face {
  font-family: 'OpenDyslexic3';
  size-adjust: 85%; /* Smaller to compensate for large x-height */
}

@font-face {
  font-family: 'Fast Sans';
  size-adjust: 100%; /* No adjustment needed */
}

@font-face {
  font-family: 'Together Assessments';
  size-adjust: 115%; /* Slightly larger for headings */
}
```

### User Preference Persistence

All accessibility preferences are stored together in `localStorage.accessibility-preferences`:

```javascript
{
  font: 'sylexiad' | 'opendyslexic' | 'fast',
  theme: 'light' | 'dark' | 'system',
  textSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl',
  lineHeight: 'compact' | 'normal' | 'relaxed',
  readingRuler: boolean
}
```

- All preferences persist across sessions
- Applied automatically on page load
- No account required
- Managed centrally through AccessibilityPanel component

### OpenType Features

**Location**: `src/components/CustomStyles.astro:76-79`

```css
body {
  font-feature-settings: 'calt';
  font-variant-ligatures: contextual;
}
```

**Purpose**: Enable Fast Sans letter highlighting feature

- Safari enables by default
- Chrome requires explicit activation
- Only affects fonts with calt feature

---

## Dark Mode

The site supports light/dark colour schemes with user control and system preference detection. This benefits users with:

- Light sensitivity or photophobia
- Visual processing differences
- Migraine triggers from bright screens
- Preference for high-contrast viewing

For complete implementation details, see [COLOURS.md](./COLOURS.md#dark-mode-toggle-mechanism).

---

## Responsive Design

### Breakpoints

Defined in `tailwind.config.js:8-14`:

```javascript
screens: {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```

### Mobile-First Approach

- Base styles for mobile
- Enhanced progressively for larger screens
- Touch-friendly targets (minimum 44x44px)
- Readable text sizes at all breakpoints

### Responsive Navigation

- **Mobile**: Hamburger menu
- **Tablet** (768px-1279px): Compact dropdown menu
- **Desktop** (1280px+): Full horizontal menu

See [WEBSITE.md](./WEBSITE.md#navigation) for navigation structure.

### Responsive Images

All images use Astro's optimisation with:

- Multiple sizes (640px to 6016px)
- `srcset` for resolution selection
- `sizes` attribute for layout hints
- Lazy loading for below-fold images

---

## Semantic HTML

### Structure

- Proper heading hierarchy (`<h1>` to `<h6>`)
- Semantic sectioning elements:
  - `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- Lists for groups of items
- Tables for tabular data only

### Landmarks

ARIA landmarks for screen readers:

- `role="banner"` - Site header
- `role="navigation"` - Navigation menus
- `role="main"` - Main content area
- `role="complementary"` - Sidebars
- `role="contentinfo"` - Site footer

### Link Purpose

- Clear link text (no "click here")
- External link indicators
- Button vs link semantics:
  - Links: Navigate to pages
  - Buttons: Trigger actions

---

## Keyboard Navigation

### Focus Indicators

Custom focus styles in Tailwind:

```css
.btn {
  @apply focus:ring-primary focus:ring-offset-primary focus:ring-2 focus:ring-offset-2;
}
```

**Visible focus indicators** on all interactive elements:

- Links
- Buttons
- Form fields
- Dropdowns
- Toggles

### Tab Order

- Logical tab order follows visual layout
- Skip links for main content (future enhancement)
- Focus trapping in accessibility panel modal
- `tabindex="0"` for custom interactive elements
- `tabindex="-1"` for focusable but not tab-able elements

**Focus Trap Implementation**:

The accessibility panel implements focus trapping when open:

- Focus cycles only through panel controls
- `Tab` moves to next control, wrapping to first when reaching last
- `Shift + Tab` moves to previous control, wrapping to last when reaching first
- `Esc` closes panel and returns focus to toggle button
- Focus cannot escape panel boundaries while open

Location: `src/components/common/AccessibilityPanel.astro`

### Keyboard Shortcuts

**Global**:

- `Tab` - Next focusable element
- `Shift + Tab` - Previous focusable element
- `Enter` / `Space` - Activate buttons and links
- `Esc` - Close dropdowns and modals

**Accessibility Panel**:

- `Ctrl + Shift + A` (Windows/Linux) or `Cmd + Shift + A` (Mac) - Open accessibility settings panel
- `Esc` - Close panel and return focus to toggle button
- Arrow keys - Navigate radio button groups
- `Space` - Toggle switches and activate buttons

---

## ARIA Labels

### Images

All CMS image fields include optional alt text fields. When provided, alt text is used; when omitted, sensible fallbacks are used (e.g., page title, excerpt).

**Implementation**: All 8 image locations in the CMS have dedicated `image_alt` fields:

1. **Home Page Hero** (`config.template.yml:106-110`)
2. **FAQs Page Top Content** (`config.template.yml:282-286`)
3. **Services Page Top Content** (`config.template.yml:354-358`)
4. **Consultation Page** (`config.template.yml:438-442`)
5. **Contact Page** (`config.template.yml:482-486`)
6. **Waitlist Page** (`config.template.yml:519-523`)
7. **Text Pages** (`config.template.yml:570-574`)
8. **Blog Posts Featured Image** (`config.template.yml:635-639`)

**CMS Configuration Example**:

```yaml
- label: 'Hero Image'
  name: 'image'
  widget: 'image'
- label: 'Hero Image Alt Text'
  name: 'image_alt'
  widget: 'string'
  required: false
  hint: 'Describe what the image shows (e.g., "Person using laptop in bright office space"). Leave empty for decorative images.'
```

**Fallback Strategy**:

All image rendering templates use fallback chains to ensure images always have alt text:

```typescript
// Hero image
alt={homePageContent.hero.image_alt || 'Hero image'}

// Page images (FAQ, Services, Contact, etc.)
alt={image_alt || title}

// Blog featured images
alt={post?.image_alt || post?.excerpt || 'Blog post featured image'}
```

**Enforcement**: The `Image.astro` component (src/components/common/Image.astro:20-22) throws an error if alt text is undefined or null, ensuring no images render without accessibility text.

**Content Editor Guidance**: Each CMS alt text field includes hints with good/bad examples:

- ✓ Good: "Therapist reviewing assessment notes"
- ✗ Bad: "Image of consultation", "FAQ image"

For complete CMS configuration, see [CMS.md](./CMS.md#image-alt-text-fields).

### Buttons and Controls

**Accessibility settings toggle**:

Location: `src/components/common/ToggleAccessibility.astro`

```html
<button
  data-accessibility-toggle
  type="button"
  aria-label="Accessibility Settings"
  aria-expanded="false"
  aria-controls="accessibility-panel"
>
  <!-- Universal accessibility icon (person in circle) -->
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
  <span class="ml-1 hidden xl:inline">Accessibility</span>
</button>
```

The accessibility panel includes proper ARIA attributes:

- `role="dialog"` - Identifies the panel as a modal dialog
- `aria-modal="true"` - Indicates modal behaviour
- `aria-label="Accessibility Settings"` - Provides context for screen readers
- `aria-expanded` - Dynamically indicates panel open/closed state on toggle buttons
- `aria-controls` - Links toggle button to panel ID

See [Accessibility Settings Panel](#accessibility-settings-panel) for complete implementation details.

### Dynamic Content

- `aria-live` regions for status updates
- `aria-expanded` on expandable sections
- `aria-hidden` on decorative elements
- `aria-describedby` for additional context

---

## Colour Contrast

### WCAG Compliance

Target: **WCAG 2.1 Level AA**

- Normal text: 4.5:1 minimum contrast ratio
- Large text (18pt+): 3:1 minimum contrast ratio
- UI components: 3:1 minimum contrast ratio

### Colour Palette

**For complete colour documentation, see [COLOURS.md](./COLOURS.md)**

Colours tested for contrast in both light and dark modes:

**Light mode**:

- Primary purple (`rgb(78 35 95)`) on white background
- Text (`rgb(16 16 16)`) on white background
- Muted text (`rgb(16 16 16 / 66%)`) on white background

**Dark mode**:

- Primary purple (`rgb(78 35 95)`) on dark background
- Text (`rgb(229 236 246)`) on dark background (`rgb(18 16 20)`)
- Muted text (`rgb(229 236 246 / 66%)`) on dark background

### Non-Colour Indicators

Information not conveyed by colour alone:

- Form validation: Icons + text messages
- Required fields: Asterisk + text label
- Links: Underline on hover/focus
- Buttons: Distinct shape and position

---

---

**Last Updated**: 2025-01-12
