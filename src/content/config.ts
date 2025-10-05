import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

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

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
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

const faqCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/faqs-page/faq-items' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(1),
    published: z.boolean().default(true),
  }),
});

const serviceCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/services-page/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    anchor: z.string(),
    order: z.number().default(1),
    icon: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const trustBadgeCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/site-settings/trust-badges' }),
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

const textPageCollection = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/text-pages' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    subheading: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  post: postCollection,
  faqs_page_items: faqCollection,
  services_page_items: serviceCollection,
  site_settings_trust_badges: trustBadgeCollection,
  text_pages: textPageCollection,
};
