import { getPermalink, getBlogPermalink } from './utils/permalinks';

// Desktop menu links (shows at xl: breakpoint and above)
const desktopLinks = [
  {
    text: 'About',
    href: getPermalink('/about'),
  },
  {
    text: 'Services',
    href: getPermalink('/services'),
  },
  {
    text: 'Fees',
    href: getPermalink('/fees'),
  },
  {
    text: 'FAQs',
    href: getPermalink('/faq'),
  },
  {
    text: 'Resources',
    links: [
      {
        text: 'Contact',
        href: getPermalink('/contact'),
      },
      {
        text: 'Self-Help',
        href: getPermalink('/self-help'),
      },
      {
        text: 'Local Support',
        href: getPermalink('/local-support'),
      },
      {
        text: 'Blog',
        href: getBlogPermalink(),
      },
    ],
  },
  {
    text: 'Together',
    links: [
      {
        text: 'Together ADHD',
        href: 'https://togetheradhd.co.uk',
        target: '_blank',
      },
      {
        text: 'Together Autism',
        href: 'https://togetherautism.co.uk',
        target: '_blank',
      },
    ],
  },
];

// Tablet menu links (shows between md: and xl: breakpoints)
const tabletLinks = [
  {
    text: 'Assessments',
    links: [
      {
        text: 'About',
        href: getPermalink('/about'),
      },
      {
        text: 'Services',
        href: getPermalink('/services'),
      },
      {
        text: 'Fees',
        href: getPermalink('/fees'),
      },
      {
        text: 'FAQs',
        href: getPermalink('/faq'),
      },
      {
        text: 'Book a Consultation',
        href: getPermalink('/consultation'),
      },
    ],
  },
  {
    text: 'Resources',
    links: [
      {
        text: 'Contact',
        href: getPermalink('/contact'),
      },
      {
        text: 'Self-Help',
        href: getPermalink('/self-help'),
      },
      {
        text: 'Local Support',
        href: getPermalink('/local-support'),
      },
      {
        text: 'Blog',
        href: getBlogPermalink(),
      },
    ],
  },
  {
    text: 'Together',
    links: [
      {
        text: 'Together ADHD',
        href: 'https://togetheradhd.co.uk',
        target: '_blank',
      },
      {
        text: 'Together Autism',
        href: 'https://togetherautism.co.uk',
        target: '_blank',
      },
    ],
  },
];

export const headerData = {
  links: desktopLinks,
  tabletLinks: tabletLinks,
  actions: [{ text: 'Book a Consultation', href: getPermalink('/consultation') }],
};

import YAML from 'yaml';
import fs from 'fs';
import path from 'path';

// Load site settings for footer
const settingsPath = path.join(process.cwd(), 'src/content/site-settings.yaml');
const settings = YAML.parse(fs.readFileSync(settingsPath, 'utf8'));

export const footerData = {
  links: [
    {
      title: 'Pages',
      links: [
        { text: 'Home', href: getPermalink('/') },
        { text: 'Book a Consultation', href: getPermalink('/consultation') },
        { text: 'About', href: getPermalink('/about') },
        { text: 'Services', href: getPermalink('/services') },
        { text: 'Fees', href: getPermalink('/fees') },
        { text: 'FAQs', href: getPermalink('/faq') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Self-Help', href: getPermalink('/self-help') },
        { text: 'Local Support', href: getPermalink('/local-support') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Website Policies',
      links: [
        { text: 'Privacy Policy', href: getPermalink('/privacy-policy') },
        { text: 'Cookie Policy', href: getPermalink('/cookie-policy') },
        { text: 'Terms of Service', href: getPermalink('/terms-of-service') },
      ],
    },
    {
      title: 'Support & Standards',
      links: [
        { text: 'Safeguarding', href: getPermalink('/safeguarding') },
        { text: 'Accessibility Statement', href: getPermalink('/accessibility-statement') },
        { text: 'Data Retention & SAR', href: getPermalink('/data-retention-sar') },
        { text: 'Refunds/Cancellations', href: getPermalink('/refunds-cancellations') },
        { text: 'Complaints', href: getPermalink('/complaints') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `
    <div class="text-sm">
      <p>Copyright © ${settings.site.name} ${new Date().getFullYear()}. ICO Registration: ${settings.site.ico_registration}</p>
      <p class="mt-2">Sole trader, trading as ${settings.site.name}. North Lincolnshire and surrounding areas, <a href="mailto:${settings.site.email}" class="text-primary hover:underline dark:text-primary">${settings.site.email}</a></p>
    </div>
  `,
};
