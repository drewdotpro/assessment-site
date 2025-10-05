# AstroWind Complete Component Cheat Sheet

A comprehensive reference for all 55 AstroWind components with examples and configurations.

## Table of Contents
- [Widget Components (22)](#widget-components-22)
- [UI Components (9)](#ui-components-9)
- [Blog Components (10)](#blog-components-10)
- [Common Components (11)](#common-components-11)
- [Root Components (3)](#root-components-3)
- [Layouts](#layouts)
- [Common Patterns](#common-patterns)

---

## Widget Components (22)

### 1. Hero
**Primary hero section with centered content**

```astro
import Hero from '~/components/widgets/Hero.astro';

<Hero
  tagline="Optional Tagline"
  title="Main Title" // or use slot
  subtitle="Subtitle text" // or use slot
  id="hero-section"
>
  <Fragment slot="title">Custom <span class="text-accent">Title</span></Fragment>
  <Fragment slot="subtitle">Custom subtitle content</Fragment>
  <Fragment slot="content">Additional content below subtitle</Fragment>
  <Fragment slot="actions">
    <Button variant="primary" href="#">Get Started</Button>
    <Button variant="secondary" href="#features">Learn More</Button>
  </Fragment>
  <Fragment slot="image">
    <Image src="~/assets/images/hero.png" alt="Hero Image" />
  </Fragment>
  <Fragment slot="bg"><div class="absolute inset-0 bg-blue-50"></div></Fragment>
</Hero>
```

**Props:**
- `tagline`: string
- `title`: string | slot
- `subtitle`: string | slot  
- `content`: string | slot
- `actions`: slot (for action buttons)
- `image`: slot (for image content)
- `id`: string
- `bg`: slot for background

### 2. Hero2
**Side-by-side hero layout**

```astro
import Hero2 from '~/components/widgets/Hero2.astro';

<Hero2
  tagline="SaaS Demo"
  id="hero2-section"
>
  <Fragment slot="title">Your <span class="text-accent">SaaS</span> Solution</Fragment>
  <Fragment slot="subtitle">Comprehensive subtitle here</Fragment>
  <Fragment slot="actions">
    <Button variant="primary" href="#">Get Started</Button>
    <Button href="#">Learn More</Button>
  </Fragment>
  <Fragment slot="image">
    <Image src="~/assets/images/hero-image.png" alt="Hero Image" />
  </Fragment>
</Hero2>
```

**Props:**
- `tagline`: string
- `title`: string | slot
- `subtitle`: string | slot
- `content`: string | slot
- `actions`: slot (for action buttons)
- `image`: slot (for image content)
- `id`: string
- `bg`: slot for background

### 3. HeroText
**Text-only hero without image**

```astro
import HeroText from '~/components/widgets/HeroText.astro';

<HeroText
  tagline="New Launch"
  title="Text-Only Hero Section"
  subtitle="Perfect for content-focused pages"
  callToAction={{ text: 'Start Now', href: '#', variant: 'primary' }}
  callToAction2={{ text: 'Learn More', href: '#' }}
/>
```

**Props:**
- `title`: string | slot
- `subtitle`: string | slot
- `tagline`: string
- `content`: string | slot
- `callToAction`: string | CallToAction | slot
- `callToAction2`: string | CallToAction | slot

**Note:** Unlike other Hero variants, HeroText does NOT have `id` or `bg` props.

### 4. Features
**Feature grid with icon items**

```astro
import Features from '~/components/widgets/Features.astro';

<Features
  id="features"
  tagline="Features"
  title="What you get with AstroWind"
  subtitle="Professional and comprehensive template"
  columns={3} // 1, 2, 3, 4, or 6
  items={[
    {
      title: 'Tailwind CSS',
      description: 'Great framework integration',
      icon: 'tabler:brand-tailwind'
    },
    // more items...
  ]}
/>
```

**Props:**
- `title`, `subtitle`, `tagline`: Headlines
- `items`: Item[] with title, description, icon
- `columns`: number (1-6)
- `defaultIcon`: string
- `id`: string
- `isDark`: boolean
- `classes`: object with custom classes
- `bg`: slot for background

### 5. Features2
**Compact feature grid**

```astro
import Features2 from '~/components/widgets/Features2.astro';

<Features2
  title="Most used widgets"
  subtitle="Essential components for websites"
  tagline="Components"
  columns={3}
  items={[
    {
      title: 'Headers',
      description: 'Site navigation',
      icon: 'flat-color-icons:template'
    }
  ]}
/>
```

**Props:**
- `title`, `subtitle`, `tagline`: Headlines
- `items`: Item[] with title, description, icon
- `columns`: number (1-6)
- `defaultIcon`: string
- `id`: string
- `isDark`: boolean
- `classes`: object with custom classes
- `bg`: slot for background

**Note:** Uses ItemGrid2 internally for different styling than Features.

### 6. Features3
**Features with prominent image**

```astro
import Features3 from '~/components/widgets/Features3.astro';

<Features3
  title="Visual Features"
  subtitle="Image-focused feature display"
  image={{ src: 'image-url', alt: 'Feature Image' }}
  items={[...]}
  columns={2}
  isBeforeContent={false}
  isAfterContent={false}
/>
```

**Props:**
- `title`, `subtitle`, `tagline`: Headlines
- `items`: Item[] with title, description, icon
- `columns`: number (1-6)
- `defaultIcon`: string
- `image`: string | Image object (displayed prominently)
- `isBeforeContent`: boolean (adjusts spacing)
- `isAfterContent`: boolean (adjusts spacing)
- `id`: string
- `isDark`: boolean
- `classes`: object with custom classes
- `bg`: slot for background

### 7. Steps
**Process steps with image**

```astro
import Steps from '~/components/widgets/Steps.astro';

<Steps
  title="Get your website running"
  items={[
    {
      title: 'Step 1: <span class="font-medium">Download</span>',
      description: 'Fork or clone the repository',
      icon: 'tabler:package'
    },
    {
      title: 'Step 2: <span class="font-medium">Customize</span>',
      description: 'Modify styles and content',
      icon: 'tabler:paint'
    }
  ]}
  image={{ src: 'image-url', alt: 'Steps' }}
  isReversed={false}
/>
```

**Props:**
- `title`, `subtitle`, `tagline`: Headlines
- `items`: Step items with title, description, icon
- `image`: string | Image
- `isReversed`: boolean
- `id`: string
- `isDark`: boolean
- `classes`: object with custom classes
- `bg`: slot for background

### 8. Steps2
**Alternative steps layout**

```astro
import Steps2 from '~/components/widgets/Steps2.astro';

<Steps2
  title="Implementation Process"
  subtitle="Follow these steps"
  tagline="Guide"
  callToAction={{ text: 'Start Now', href: '#', variant: 'primary' }}
  items={[...]}
  isReversed={false}
/>
```

**Props:**
- `title`, `subtitle`, `tagline`: Headlines
- `items`: Step items with title, description, icon
- `callToAction`: CallToAction configuration
- `isReversed`: boolean
- `id`: string
- `isDark`: boolean
- `classes`: object with custom classes
- `bg`: slot for background

**Note:** Steps2 has `callToAction` prop while Steps does not.

### 9. Content
**Content section with image and items**

```astro
import Content from '~/components/widgets/Content.astro';

<Content
  isReversed={true}
  isAfterContent={false}
  tagline="Inside template"
  title="AstroWind's Blueprint"
  subtitle="Optional subtitle"
  items={[
    {
      title: 'Built with Astro',
      description: 'Modern static site generator'
    }
  ]}
  image={{ src: 'image-url', alt: 'Content' }}
  callToAction={{ text: 'Learn More', href: '#' }}
>
  <Fragment slot="content">
    <h3 class="text-2xl font-bold">Custom Content</h3>
    Additional rich content here
  </Fragment>
  <Fragment slot="bg">
    <div class="absolute inset-0 bg-blue-50"></div>
  </Fragment>
</Content>
```

**Props:**
- `title`, `subtitle`, `tagline`: Headlines
- `content`: string | slot
- `items`: Item[]
- `image`: string | Image
- `isReversed`: boolean
- `isAfterContent`: boolean
- `columns`: number
- `callToAction`: CallToAction
- Standard Widget props (id, isDark, classes, bg)

### 10. CallToAction
**Centered CTA section**

```astro
import CallToAction from '~/components/widgets/CallToAction.astro';

<CallToAction
  title="Ready to Start?"
  subtitle="Join thousands of satisfied users"
  tagline="Limited Time"
  actions={[
    {
      variant: 'primary',
      text: 'Download Now',
      href: '#',
      icon: 'tabler:download'
    }
  ]}
/>
```

**Props:**
- `title`: string | slot
- `subtitle`: string | slot
- `tagline`: string | slot
- `actions`: string | CallToAction[] | slot
- Standard Widget props (id, isDark, classes, bg)

**Note:** Despite the interface definition, the component only uses `actions`, not `callToAction`.

### 11. FAQs
**Frequently asked questions**

```astro
import FAQs from '~/components/widgets/FAQs.astro';

<FAQs
  title="Frequently Asked Questions"
  subtitle="Find answers here"
  tagline="Support"
  columns={2}
  items={[
    {
      title: 'Question 1?',
      description: 'Answer to question 1'
    }
  ]}
/>
```

**Props:**
- `title`: string (default: '')
- `subtitle`: string (default: '')
- `tagline`: string (default: '')
- `items`: FAQ items array
- `columns`: number (default: 2)
- Standard Widget props

**Note:** Unlike other widgets, FAQs uses empty string defaults instead of slot rendering for title/subtitle/tagline.

### 12. Stats
**Statistics display**

```astro
import Stats from '~/components/widgets/Stats.astro';

<Stats
  title="Our Impact"
  subtitle="Key metrics that matter"
  tagline="Statistics"
  stats={[
    { amount: '100K+', title: 'Users', icon: 'tabler:users' },
    { amount: '24/7', title: 'Support' },
    { amount: '99.9%', title: 'Uptime' }
  ]}
/>
```

**Props:**
- `title`: string | slot
- `subtitle`: string | slot
- `tagline`: string
- `stats`: Array of { amount, title, icon }
- Standard Widget props (id, isDark, classes, bg)

### 13. Pricing
**Pricing cards**

```astro
import Pricing from '~/components/widgets/Pricing.astro';

<Pricing
  title="Simple Pricing"
  subtitle="Choose the plan that's right for you"
  tagline="Pricing"
  prices={[
    {
      title: 'Basic',
      subtitle: 'For individuals',
      price: 29,
      period: 'per month',
      items: [
        { description: '10 users' },
        { description: '100GB storage' }
      ],
      callToAction: { text: 'Get Started', href: '#' },
      hasRibbon: false
    },
    {
      title: 'Pro',
      price: 99,
      period: 'per month',
      hasRibbon: true,
      ribbonTitle: 'Popular',
      items: [...],
      callToAction: { text: 'Get Started', href: '#', variant: 'primary' }
    }
  ]}
/>
```

**Props:**
- `title`: string (default: '')
- `subtitle`: string (default: '')
- `tagline`: string (default: '')
- `prices`: Price[] objects
- Each price: title, subtitle, price, period, items, callToAction, hasRibbon, ribbonTitle
- Standard Widget props (id, isDark, classes, bg)

### 14. Testimonials
**Customer testimonials grid**

```astro
import Testimonials from '~/components/widgets/Testimonials.astro';

<Testimonials
  title="What Clients Say"
  subtitle="Read what our customers have to say"
  tagline="Testimonials"
  testimonials={[
    {
      title: 'Great Experience', // optional title for testimonial
      testimonial: 'Amazing product that solved all our needs',
      name: 'John Doe',
      job: 'CEO at Company',
      image: { src: 'avatar-url', alt: 'John' }
    }
  ]}
  callToAction={{ text: 'More Reviews', href: '#' }}
/>
```

**Props:**
- `title`: string (default: '')
- `subtitle`: string (default: '')
- `tagline`: string (default: '')
- `testimonials`: Array of objects with:
  - `title`: optional testimonial title
  - `testimonial`: the testimonial text
  - `name`: person's name
  - `job`: person's job/title
  - `image`: person's avatar image
- `callToAction`: optional CTA button
- Standard Widget props (id, isDark, classes, bg)

### 15. Brands
**Brand logos display**

```astro
import Brands from '~/components/widgets/Brands.astro';

<Brands
  title="Trusted By"
  subtitle="Leading companies use our products"
  tagline="Partners"
  icons={['tabler:brand-google', 'tabler:brand-facebook']}
  images={[
    { src: 'logo1.png', alt: 'Brand 1' },
    { src: 'logo2.png', alt: 'Brand 2' }
  ]}
/>
```

**Props:**
- `title`: string (default: '')
- `subtitle`: string (default: '')
- `tagline`: string (default: '')
- `icons`: string[] of icon names
- `images`: Image[] objects
- Standard Widget props (id, isDark, classes, bg)

### 16. Contact
**Contact form section**

```astro
import Contact from '~/components/widgets/Contact.astro';

<Contact
  title="Get in Touch"
  subtitle="We'd love to hear from you"
  inputs={[
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      placeholder: 'Your name'
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email',
      placeholder: 'your@email.com'
    }
  ]}
  textarea={{
    label: 'Message',
    name: 'message',
    placeholder: 'Your message',
    rows: 5
  }}
  disclaimer={{
    label: 'I agree to the privacy policy'
  }}
  button="Send Message"
/>
```

**Props:** Combines Form props with Widget props

### 17. BlogLatestPosts
**Display latest blog posts**

```astro
import BlogLatestPosts from '~/components/widgets/BlogLatestPosts.astro';

<BlogLatestPosts
  title="Latest Articles"
  information="Stay updated with our latest posts"
  count={4}
  linkText="View all posts"
  linkUrl="/blog"
/>
```

**Props:**
- `title`: string | slot
- `information`: string | slot
- `count`: number of posts (default: 4)
- `linkText`: string (default: 'View all posts')
- `linkUrl`: string | URL (default: blog permalink)

### 18. BlogHighlightedPosts
**Featured blog posts**

```astro
import BlogHighlightedPosts from '~/components/widgets/BlogHighlightedPosts.astro';

<BlogHighlightedPosts
  title="Featured Posts"
  postIds={['post-slug-1', 'post-slug-2']}
  information="Our top picks"
  linkText="See all posts"
  linkUrl="/blog"
/>
```

**Props:**
- `title`: string | slot
- `postIds`: string[] of post IDs/slugs (required)
- `information`: string | slot
- `linkText`: string (default: 'View all posts')
- `linkUrl`: string | URL (default: blog permalink)

### 19. Note
**Information banner**

```astro
import Note from '~/components/widgets/Note.astro';

<Note
  icon="tabler:info-square"
  title="Important:"
  description="Key information to highlight"
/>
```

**Props:**
- `icon`: string (default: 'tabler:info-square')
- `title`: string | slot
- `description`: string | slot

### 20. Announcement
**Static announcement bar (hardcoded)**

```astro
import Announcement from '~/components/widgets/Announcement.astro';

<Announcement />
```

**Note:** This component is hardcoded with no props. It displays a fixed announcement about Astro v5.12 and GitHub stars.

### 21. Header
**Site navigation header**

```astro
import Header from '~/components/widgets/Header.astro';

<Header
  id="header"
  links={[
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
    {
      text: 'Services',
      links: [
        { text: 'Service 1', href: '/service1' },
        { text: 'Service 2', href: '/service2' }
      ]
    }
  ]}
  actions={[
    { text: 'Login', href: '/login', variant: 'secondary' },
    { text: 'Sign Up', href: '/signup', variant: 'primary' }
  ]}
  isSticky={true}
  isDark={false}
  isFullWidth={false}
  showToggleTheme={true}
  showRssFeed={false}
  position="center" // left, center, right
/>
```

**Props:**
- `id`: string (default: 'header')
- `links`: Navigation links with dropdown support
- `actions`: CTA buttons
- `isSticky`: boolean (default: false)
- `isDark`: boolean (default: false)
- `isFullWidth`: boolean (default: false)
- `showToggleTheme`: boolean (default: false)
- `showRssFeed`: boolean (default: false)
- `position`: 'left' | 'center' | 'right' (default: 'center')

### 22. Footer
**Site footer**

```astro
import Footer from '~/components/widgets/Footer.astro';

<Footer
  links={[ // Required!
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Pricing', href: '#' }
      ]
    }
  ]}
  secondaryLinks={[
    { text: 'Terms', href: '/terms' },
    { text: 'Privacy', href: '/privacy' }
  ]}
  socialLinks={[
    { ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: '#' },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: '#' }
  ]}
  footNote="© 2024 Your Company. All rights reserved."
  theme="light" // or "dark"
/>
```

**Props:**
- `links`: Link groups (REQUIRED)
- `secondaryLinks`: Secondary links array
- `socialLinks`: Social media links
- `footNote`: Copyright text
- `theme`: 'light' | 'dark' (default: 'light')
```

---

## UI Components (9)

### 1. Button
**Versatile button component**

```astro
import Button from '~/components/ui/Button.astro';

<Button
  variant="primary" // primary, secondary, tertiary, link
  text="Click Me"
  href="/page"
  target="_blank"
  icon="tabler:arrow-right"
  class="custom-class"
  type="submit" // button, submit, reset (for forms)
/>
```

**Props (CallToAction type):**
- `variant`: 'primary' | 'secondary' | 'tertiary' | 'link'
- `text`: string
- `href`: string (for links)
- `target`: string
- `icon`: string
- `type`: 'button' | 'submit' | 'reset'
- `class`: string

### 2. Form
**Form builder component**

```astro
import Form from '~/components/ui/Form.astro';

<Form
  inputs={[
    {
      type: 'text',
      name: 'fullname',
      label: 'Full Name',
      placeholder: 'John Doe',
      autocomplete: 'name'
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email',
      placeholder: 'john@example.com',
      autocomplete: 'email'
    }
  ]}
  textarea={{
    label: 'Message',
    name: 'message',
    placeholder: 'Your message here...',
    rows: 5
  }}
  disclaimer={{
    label: 'By submitting, you agree to our terms'
  }}
  button="Submit Form"
  description="Optional form description"
/>
```

### 3. Headline
**Reusable headline component**

```astro
import Headline from '~/components/ui/Headline.astro';

<Headline
  title="Section Title"
  subtitle="Section subtitle with more details"
  tagline="TAGLINE"
  classes={{
    container: 'text-center',
    title: 'text-4xl font-bold',
    subtitle: 'text-xl text-muted'
  }}
/>
```

### 4. ItemGrid
**Flexible item grid**

```astro
import ItemGrid from '~/components/ui/ItemGrid.astro';

<ItemGrid
  items={[
    {
      title: 'Item Title',
      description: 'Item description',
      icon: 'tabler:check',
      callToAction: { text: 'Learn More', href: '#' }
    }
  ]}
  columns={3}
  defaultIcon="tabler:point"
  classes={{
    container: 'gap-8',
    panel: 'relative',
    title: 'text-xl font-bold',
    description: 'text-muted',
    icon: 'text-primary'
  }}
/>
```

### 5. ItemGrid2
**Alternative item grid layout**

```astro
import ItemGrid2 from '~/components/ui/ItemGrid2.astro';

<ItemGrid2
  items={[
    {
      title: 'Item Title',
      description: 'Item description',
      icon: 'tabler:check',
      callToAction: { text: 'Learn More', href: '#' }
    }
  ]}
  columns={3}
  defaultIcon="tabler:point"
  classes={{
    container: 'gap-8',
    panel: 'rounded-lg',
    title: 'text-xl font-bold',
    description: 'text-muted',
    icon: 'text-primary'
  }}
/>
```

**Props:**
- Same as ItemGrid but with different default styling
- Card-based layout vs. row-based layout in ItemGrid

### 6. Timeline
**Timeline component for process/history**

```astro
import Timeline from '~/components/ui/Timeline.astro';

<Timeline
  items={[
    {
      title: '2024',
      description: 'Company founded',
      icon: 'tabler:flag'
    }
  ]}
  defaultIcon="tabler:point"
  classes={{
    container: 'gap-8',
    panel: 'relative',
    title: 'text-xl font-bold',
    description: 'text-muted',
    icon: 'text-primary'
  }}
/>
```

**Props:**
- `items`: Array of Item objects with title, description, icon
- `defaultIcon`: string (fallback icon if item doesn't specify one)
- `classes`: object with container, panel, title, description, icon classes

### 7. DListItem
**Definition list item**

```astro
import DListItem from '~/components/ui/DListItem.astro';

<DListItem dt="Term">
  Definition content goes here (can be HTML)
</DListItem>
```

**Props:**
- `dt`: string (the term/title)
- Content is passed via default slot

### 8. Background
**Background wrapper component**

```astro
import Background from '~/components/ui/Background.astro';

<Background isDark={false}>
  // Content here
</Background>
```

### 9. WidgetWrapper
**Base wrapper for all widgets**

```astro
import WidgetWrapper from '~/components/ui/WidgetWrapper.astro';

<WidgetWrapper
  id="section-id"
  isDark={false}
  containerClass="max-w-7xl mx-auto"
  as="section"
  bg={backgroundSlot}
>
  // Widget content
</WidgetWrapper>
```

**Props:**
- `id`: string
- `isDark`: boolean
- `containerClass`: string (container CSS classes)
- `as`: HTMLTag (default: 'section') - HTML element to render
- `bg`: slot for background

---

## Blog Components (10)

### 1. Grid
**Blog post grid container**

```astro
import Grid from '~/components/blog/Grid.astro';

<Grid posts={posts} />
```

### 2. GridItem
**Individual blog grid item**

```astro
import GridItem from '~/components/blog/GridItem.astro';

<GridItem post={postData} />
```

### 3. List
**Blog post list container**

```astro
import List from '~/components/blog/List.astro';

<List posts={posts} />
```

### 4. ListItem
**Individual blog list item**

```astro
import ListItem from '~/components/blog/ListItem.astro';

<ListItem post={postData} />
```

### 5. SinglePost
**Full blog post display**

```astro
import SinglePost from '~/components/blog/SinglePost.astro';

<SinglePost post={postData} url={Astro.url} />
```

### 6. Pagination
**Blog pagination controls**

```astro
import Pagination from '~/components/blog/Pagination.astro';

<Pagination
  prevUrl="/blog/page/1"
  nextUrl="/blog/page/3"
  prevText="Newer posts"
  nextText="Older posts"
/>
```

**Props:**
- `prevUrl`: string (optional)
- `nextUrl`: string (optional)
- `prevText`: string (default: 'Newer posts')
- `nextText`: string (default: 'Older posts')

### 7. RelatedPosts
**Related posts widget**

```astro
import RelatedPosts from '~/components/blog/RelatedPosts.astro';

<RelatedPosts post={currentPost} />
```

### 8. Tags
**Post tags display**

```astro
import Tags from '~/components/blog/Tags.astro';

<Tags 
  tags={post.tags} 
  title="Tags:"
  isCategory={false}
  class="mt-4" 
/>
```

**Props:**
- `tags`: Post['tags'] - array of tag objects
- `title`: string | undefined (optional label)
- `isCategory`: boolean (default: false) - whether showing categories vs tags
- `class`: string (default: 'text-sm')

### 9. Headline (Blog)
**Blog-specific headline**

```astro
import Headline from '~/components/blog/Headline.astro';

<Headline>
  Blog Title
  <Fragment slot="subtitle">Latest articles and updates</Fragment>
</Headline>
```

**Props:**
- Default slot: title content
- `subtitle` slot: subtitle content

**Note:** This is different from the UI Headline component - it uses slots instead of props.

### 10. ToBlogLink
**Link back to blog**

```astro
import ToBlogLink from '~/components/blog/ToBlogLink.astro';

<ToBlogLink />
```

---

## Common Components (11)

### 1. Image
**Optimized image component**

```astro
import Image from '~/components/common/Image.astro';

<Image
  src="~/assets/images/hero.jpg" // required, can be string or ImageMetadata
  alt="Description" // required!
  width={1024}
  height={576}
  widths={[400, 768, 1024, 2040]}
  sizes="(max-width: 767px) 400px, (max-width: 1023px) 768px, 1024px"
  loading="lazy" // 'lazy' | 'eager' (default: 'lazy')
  decoding="async" // 'sync' | 'async' | 'auto' (default: 'async')
  fetchpriority="auto" // 'high' | 'low' | 'auto'
  layout="constrained" // 'constrained' | 'fixed' | 'fullWidth' | 'none' (default: 'constrained')
  aspectRatio="16:9" // string or number
  objectPosition="center" // CSS object-position value
  class="rounded-lg"
/>
```

**Note:** Alt text is required and will throw an error if missing. The component automatically optimizes images using Astro's image optimization or Unpic for external URLs.

### 2. Analytics
**Analytics integration**

```astro
import Analytics from '~/components/common/Analytics.astro';

<Analytics /> // Automatically configured from config.yaml
```

### 3. Metadata
**SEO metadata**

```astro
import Metadata from '~/components/common/Metadata.astro';

<Metadata
  title="Page Title"
  description="Page description"
  canonical="https://example.com/page"
  robots={{ index: true, follow: true }}
  ignoreTitleTemplate={false}
  openGraph={{
    images: [{ url: '/og-image.jpg' }],
    type: 'website'
  }}
  twitter={{
    cardType: 'summary_large_image'
  }}
/>
```

**Props:**
- `title`: string
- `description`: string
- `canonical`: string (default: current URL)
- `robots`: { index?: boolean, follow?: boolean }
- `ignoreTitleTemplate`: boolean (skip title template)
- `openGraph`: OpenGraph object with url, images, type, etc.
- `twitter`: Twitter card configuration

### 4. SocialShare
**Social sharing buttons**

```astro
import SocialShare from '~/components/common/SocialShare.astro';

<SocialShare
  url="https://example.com/post"
  text="Check this out!"
  class="mt-4"
/>
```

### 5. ToggleMenu
**Mobile menu toggle**

```astro
import ToggleMenu from '~/components/common/ToggleMenu.astro';

<ToggleMenu 
  label="Toggle Menu"
  class="custom-class"
/>
```

**Props:**
- `label`: string (default: 'Toggle Menu')
- `class`: string (custom CSS classes)
- Default slot for custom hamburger icon

### 6. ToggleTheme
**Dark/light theme toggle**

```astro
import ToggleTheme from '~/components/common/ToggleTheme.astro';

<ToggleTheme 
  label="Toggle between Dark and Light mode"
  class="custom-class"
  iconClass="w-6 h-6"
  iconName="tabler:sun"
/>
```

**Props:**
- `label`: string (default: 'Toggle between Dark and Light mode')
- `class`: string (custom button classes)
- `iconClass`: string (default: 'w-6 h-6')
- `iconName`: string (default: 'tabler:sun')

### 7. ApplyColorMode
**Apply color mode script**

```astro
import ApplyColorMode from '~/components/common/ApplyColorMode.astro';

<ApplyColorMode /> // Add to <head>
```

### 8. BasicScripts
**Essential scripts**

```astro
import BasicScripts from '~/components/common/BasicScripts.astro';

<BasicScripts /> // Add before </body>
```

### 9. CommonMeta
**Common meta tags**

```astro
import CommonMeta from '~/components/common/CommonMeta.astro';

<CommonMeta /> // Add to <head>
```

### 10. SiteVerification
**Site verification tags**

```astro
import SiteVerification from '~/components/common/SiteVerification.astro';

<SiteVerification /> // Google verification only
```

**Note:** Adds Google site verification meta tag if configured in config.yaml

### 11. SplitbeeAnalytics
**Splitbee analytics**

```astro
import SplitbeeAnalytics from '~/components/common/SplitbeeAnalytics.astro';

<SplitbeeAnalytics 
  doNotTrack={true}
  noCookieMode={false}
  url="https://cdn.splitbee.io/sb.js"
/>
```

**Props:**
- `doNotTrack`: boolean (default: true) - Respect DNT header
- `noCookieMode`: boolean (default: false) - Disable cookies
- `url`: string (default: 'https://cdn.splitbee.io/sb.js')

---

## Root Components (3)

### 1. CustomStyles
**Custom CSS injection**

```astro
import CustomStyles from '~/components/CustomStyles.astro';

<CustomStyles /> // Add to <head>
```

### 2. Favicons
**Favicon configuration**

```astro
import Favicons from '~/components/Favicons.astro';

<Favicons /> // Add to <head>
```

### 3. Logo
**Site logo component**

```astro
import Logo from '~/components/Logo.astro';

<Logo />
```

**Note:** This component accepts no props. It displays the site name from config with a rocket emoji.

---

## Layouts

### Layout
**Base layout with all meta tags**

```astro
---
import Layout from '~/layouts/Layout.astro';

const metadata = {
  title: 'Page Title',
  description: 'Page description',
  // ... other metadata
};
---

<Layout metadata={metadata}>
  <!-- Raw page content -->
</Layout>
```

**Props:**
- `metadata`: MetaData object

**Note:** This is the base layout that includes all common meta tags, favicons, analytics, etc. Usually you'll use PageLayout instead.

### PageLayout
**Standard page layout**

```astro
---
import Layout from '~/layouts/PageLayout.astro';

const metadata = {
  title: 'Page Title',
  description: 'Page description',
  // ... other metadata
};
---

<Layout metadata={metadata}>
  <Fragment slot="announcement">
    <!-- Optional custom announcement bar -->
  </Fragment>
  <Fragment slot="header">
    <!-- Optional custom header -->
  </Fragment>
  
  <!-- Page content -->
  
  <Fragment slot="footer">
    <!-- Optional custom footer -->
  </Fragment>
</Layout>
```

### LandingLayout
**Landing page layout**

```astro
---
import Layout from '~/layouts/LandingLayout.astro';

const metadata = {
  title: 'Landing Page',
  // ... other metadata
};
---

<Layout metadata={metadata}>
  <Fragment slot="announcement">
    <!-- Optional custom announcement -->
  </Fragment>
  <Fragment slot="header">
    <!-- Optional custom header (has custom default) -->
  </Fragment>
  
  <!-- Landing page content -->
</Layout>
```

**Props:**
- `metadata`: MetaData object

**Note:** Uses a simplified header by default with just one nav link and a download button.

### MarkdownLayout
**Blog post layout**

```astro
---
import Layout from '~/layouts/MarkdownLayout.astro';
---

<Layout frontmatter={frontmatter}>
  <!-- Markdown content -->
</Layout>
```

---

## Common Patterns

### Component Composition
```astro
<!-- Typical page structure -->
<Layout metadata={metadata}>
  <Hero />
  <Note />
  <Features />
  <Content />
  <Steps />
  <FAQs />
  <CallToAction />
</Layout>
```

### Responsive Columns
```astro
<!-- Adaptive column layouts -->
<Features columns={3} /> <!-- Desktop: 3, Tablet: 2, Mobile: 1 -->
<ItemGrid columns={4} /> <!-- Desktop: 4, Tablet: 2, Mobile: 1 -->
```

### Icon Usage
```astro
<!-- Tabler icons (default) -->
icon="tabler:check"
icon="tabler:arrow-right"

<!-- Flat color icons -->
icon="flat-color-icons:template"

<!-- Custom icons -->
icon="custom:my-icon"
```

### Call-to-Action Variants
```astro
<!-- Button styles -->
variant="primary"   // Filled primary color
variant="secondary" // Outlined
variant="tertiary"  // Ghost button
variant="link"      // Text link style
```

### Conditional Styling
```astro
<!-- Dark mode -->
isDark={true}

<!-- Layout variations -->
isReversed={true}
isAfterContent={true}
isBeforeContent={true}
```

### Slot Usage
```astro
<!-- Named slots for customization -->
<Component>
  <Fragment slot="title">Custom Title</Fragment>
  <Fragment slot="subtitle">Custom Subtitle</Fragment>
  <Fragment slot="content">Rich content here</Fragment>
  <Fragment slot="bg">Background element</Fragment>
</Component>
```

### Image Optimization
```astro
<!-- Responsive images -->
<Image
  src="~/assets/images/photo.jpg"
  widths={[400, 768, 1024, 2040]}
  sizes="(max-width: 767px) 400px, (max-width: 1023px) 768px, 1024px"
  loading="lazy"
/>
```

### Configuration
All components respect settings from `src/config.yaml`:
- Site metadata
- Analytics configuration  
- UI theme settings
- Blog configuration

---

## Tips & Best Practices

1. **Import Path**: Always use `~/` for src imports
2. **TypeScript**: All components have TypeScript interfaces in `src/types.d.ts`
3. **Slots vs Props**: Use slots for rich HTML content, props for simple strings
4. **Icons**: Prefer Tabler icons (included), add custom icons as needed
5. **Dark Mode**: All components support dark mode automatically
6. **Responsive**: All components are mobile-first responsive
7. **Performance**: Use `loading="lazy"` for images below the fold
8. **SEO**: Always provide alt text for images and proper metadata
9. **Accessibility**: Components include proper ARIA attributes
10. **Customization**: Use `classes` prop for style overrides

---

## Component Type Reference

```typescript
// Common types from src/types.d.ts

interface CallToAction {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  text?: string;
  href?: string;
  target?: string;
  icon?: string;
  type?: 'button' | 'submit' | 'reset';
}

interface Item {
  title?: string;
  description?: string;
  icon?: string;
  callToAction?: CallToAction;
  image?: Image;
}

interface Image {
  src: string;
  alt?: string;
}

interface Widget {
  id?: string;
  isDark?: boolean;
  bg?: string;
  classes?: Record<string, string>;
}

interface Headline {
  title?: string;
  subtitle?: string;
  tagline?: string;
}
```

---

This cheat sheet covers all 55 AstroWind components with practical examples and configurations. Use it as your complete reference for building with AstroWind!