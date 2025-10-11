import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Get WEBSITE_ID - build fails if not set
const WEBSITE_ID = process.env.WEBSITE_ID;
if (!WEBSITE_ID) {
  throw new Error('WEBSITE_ID environment variable is required');
}

// Metadata schema (reused)
const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),
      canonical: z.string().url().optional(),
      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),
      description: z.string().optional(),
      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),
      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

// Blog posts (site-specific)
const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: `src/content/${WEBSITE_ID}/blog-posts` }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),
    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    metadata: metadataDefinition(),
  }),
});

// FAQ items (site-specific)
const faqCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: `src/content/${WEBSITE_ID}/faqs-page/faq-items` }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(1),
    published: z.boolean().default(true),
  }),
});

// Service items (site-specific)
const serviceCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: `src/content/${WEBSITE_ID}/services-page/services` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    anchor: z.string(),
    order: z.number().default(1),
    icon: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

// Trust badges (site-specific)
const trustBadgeCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: `src/content/${WEBSITE_ID}/site-settings/trust-badges` }),
  schema: z.object({
    name: z.string(),
    display_text: z.string(),
    logo_light: z.string(),
    logo_dark: z.string(),
    alt: z.string(),
    order: z.number().default(1),
    published: z.boolean().default(true),
  }),
});

// Text pages (site-specific)
const textPageCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: `src/content/${WEBSITE_ID}/text-pages` }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    subheading: z.string().optional(),
    image: z.string().optional(),
  }),
});

// Services page top content (site-specific)
const servicesPageTopContentCollection = defineCollection({
  loader: glob({ pattern: 'top-content.yaml', base: `src/content/${WEBSITE_ID}/services-page` }),
  schema: z.object({
    title: z.string(),
    subheading: z.string().optional(),
    image: z.string().optional(),
    body: z.string().optional(),
  }),
});

// FAQs page top content (site-specific)
const faqsPageTopContentCollection = defineCollection({
  loader: glob({ pattern: 'top-content.yaml', base: `src/content/${WEBSITE_ID}/faqs-page` }),
  schema: z.object({
    title: z.string(),
    subheading: z.string().optional(),
    image: z.string().optional(),
    body: z.string().optional(),
  }),
});

// Consultation page (site-specific)
const consultationPageCollection = defineCollection({
  loader: glob({ pattern: 'content.yaml', base: `src/content/${WEBSITE_ID}/consultation-page` }),
  schema: z.object({
    title: z.string(),
    subheading: z.string().optional(),
    image: z.string().optional(),
    body: z.string().optional(),
    google_calendar_link: z.string().url(),
  }),
});

// Contact page (site-specific)
const contactPageCollection = defineCollection({
  loader: glob({ pattern: 'content.yaml', base: `src/content/${WEBSITE_ID}/contact-page` }),
  schema: z.object({
    title: z.string(),
    subheading: z.string().optional(),
    image: z.string().optional(),
    body: z.string().optional(),
  }),
});

// Waitlist page (site-specific)
const waitlistPageCollection = defineCollection({
  loader: glob({ pattern: 'content.yaml', base: `src/content/${WEBSITE_ID}/waitlist-page` }),
  schema: z.object({
    title: z.string(),
    subheading: z.string().optional(),
    image: z.string().optional(),
    body: z.string().optional(),
    google_form_link: z.string().url(),
  }),
});

export const collections = {
  post: postCollection,
  faqs_page_items: faqCollection,
  services_page_items: serviceCollection,
  site_settings_trust_badges: trustBadgeCollection,
  text_pages: textPageCollection,
  services_page_top_content: servicesPageTopContentCollection,
  faqs_page_top_content: faqsPageTopContentCollection,
  consultation_page: consultationPageCollection,
  contact_page: contactPageCollection,
  waitlist_page: waitlistPageCollection,
};
