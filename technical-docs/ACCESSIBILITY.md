# Accessibility

This document details the accessibility features implemented on the Together Assessments website, with a focus on neurodiversity-friendly design.

## Table of Contents

1. [Neurodiversity-Friendly Fonts](#neurodiversity-friendly-fonts)
2. [Dark Mode](#dark-mode)
3. [Responsive Design](#responsive-design)
4. [Semantic HTML](#semantic-html)
5. [Keyboard Navigation](#keyboard-navigation)
6. [ARIA Labels](#aria-labels)
7. [Colour Contrast](#colour-contrast)
8. [Testing Accessibility](#testing-accessibility)

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

**Font Switcher Component**

Location: `src/components/common/ToggleFont.astro`

- Dropdown menu in header
- Three font options with preview
- Click to select font
- Dropdown auto-closes after selection

**Font Switching Logic**

Location: `src/components/common/BasicScripts.astro:123-154`

```javascript
attachEvent('[data-font-button]', 'click', function (_, elem) {
  const fontFamilies = {
    sylexiad: "'Sylexiad Sans Medium', ui-sans-serif, system-ui, sans-serif",
    opendyslexic: "'OpenDyslexic3', ui-sans-serif, system-ui, sans-serif",
    fastsans: "'Fast Sans', ui-sans-serif, system-ui, sans-serif",
  };

  const selectedFont = elem.getAttribute('data-font-button');
  localStorage.setItem('fontPreference', selectedFont);

  const root = document.documentElement;
  root.style.setProperty('--aw-font-sans', fontFamilies[selectedFont]);
  root.style.setProperty('--aw-font-serif', fontFamilies[selectedFont]);

  // Update visual highlighting of selected font
});
```

### Font Files

**Location**: `public/fonts/`

**Formats provided**:

- `.woff2` - Modern browsers (primary)
- `.woff` - Fallback for older browsers
- `.ttf` - Ultimate fallback

**Font preloading**:

Location: `src/components/CustomStyles.astro:20-21`

```html
<link rel="preload" href="/fonts/TogetherAssessments-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/SylexiadSansMedium.woff2" as="font" type="font/woff2" crossorigin />
```

Additional fonts preloaded when menu is opened (performance optimisation).

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

- Font choice saved to `localStorage.fontPreference`
- Persists across sessions
- Applied on page load
- No account required

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

The site supports light/dark colour schemes with user control and system preference detection.

**For complete dark mode documentation, see [COLOURS.md](./COLOURS.md)**

### Quick Overview

- **Modes**: System, Light, Dark, Light:only, Dark:only
- **Toggle**: Button in header (when not set to `:only` mode)
- **Persistence**: Saved to `localStorage.theme`
- **System detection**: Respects `prefers-color-scheme` media query

### User Control

1. **System preference** (default) - Follows operating system setting
2. **Manual override** - Click sun/moon icon to toggle
3. **Persistent choice** - Remembers user's preference

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
- Modal/dropdown focus trapping
- `tabindex="0"` for custom interactive elements
- `tabindex="-1"` for focusable but not tab-able elements

### Keyboard Shortcuts

- `Tab` - Next focusable element
- `Shift + Tab` - Previous focusable element
- `Enter` / `Space` - Activate buttons and links
- `Esc` - Close dropdowns and modals

---

## ARIA Labels

### Images

All CMS image fields require alt text:

```yaml
- label: 'Image'
  name: 'image'
  widget: 'image'
  required: false
- label: 'Image Alt Text'
  name: 'image_alt'
  widget: 'string'
  required: false
  hint: 'Describe the image for screen readers'
```

### Buttons and Controls

**Dark mode toggle**:

Location: `src/components/common/ToggleTheme.astro:14`

```html
<button aria-label="Toggle between Dark and Light mode">
  <Icon name="tabler:sun" />
</button>
```

**Font switcher**:

```html
<button aria-label="Choose reading font" data-font-toggle-button>
  <Icon name="tabler:typography" />
</button>
```

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

## Testing Accessibility

### Manual Testing

1. **Keyboard navigation**
   - Tab through entire page
   - Verify focus indicators visible
   - Activate all interactive elements with Enter/Space
   - Close modals with Esc

2. **Screen reader testing**
   - Test with NVDA (Windows), JAWS (Windows), or VoiceOver (Mac)
   - Verify heading structure
   - Check ARIA labels
   - Test form fields

3. **Zoom testing**
   - Zoom to 200% in browser
   - Verify no horizontal scroll
   - Check text doesn't overlap
   - Test layout doesn't break

4. **Colour contrast**
   - Use browser DevTools colour picker
   - Test in both light and dark modes
   - Verify against WCAG guidelines

### Automated Testing

**Browser tools**:

- Chrome DevTools Lighthouse (Accessibility audit)
- axe DevTools browser extension
- WAVE Web Accessibility Evaluation Tool

**Command line**:

```bash
# Install pa11y
npm install -g pa11y

# Test a page
pa11y http://localhost:4321

# Test with specific standard
pa11y --standard WCAG2AA http://localhost:4321
```

### Continuous Monitoring

Consider adding accessibility testing to CI/CD:

```bash
# In package.json
"scripts": {
  "test:a11y": "pa11y-ci --sitemap http://localhost:4321/sitemap.xml"
}
```

---

## Future Enhancements

### Planned Improvements

1. **Skip Links**
   - "Skip to main content" link at top of page
   - Hidden until focused with keyboard

2. **Reduced Motion**
   - Respect `prefers-reduced-motion` media query
   - Disable animations for users who prefer reduced motion

3. **Focus Management**
   - Trap focus in modals and dropdowns
   - Return focus to trigger element on close

4. **ARIA Live Regions**
   - Announce dynamic content changes
   - Status messages for form submissions

5. **Enhanced Form Validation**
   - Inline validation with clear error messages
   - Group related form fields with `<fieldset>`
   - Error summary at top of form

### Research Opportunities

- Eye-tracking studies with neurodiverse users
- User testing with assistive technology users
- Dyslexia-specific layout optimisations
- ADHD-friendly information architecture

---

## Resources

### Documentation

- **Decap CMS Docs**: `decap-cms-docs/` folder
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/

### Testing Tools

- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: https://wave.webaim.org/
- **Lighthouse**: Built into Chrome DevTools
- **Pa11y**: Command-line accessibility testing

### Fonts

- **OpenDyslexic**: https://opendyslexic.org/
- **Sylexiad**: Custom neurodiversity-friendly font
- **Fast Sans**: OpenType calt features for letter highlighting

---

**Last Updated**: 2025-10-11
