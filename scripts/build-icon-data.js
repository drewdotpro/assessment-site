/**
 * Build script to extract Tabler icon data for CMS use
 *
 * This script reads the @iconify-json/tabler package and creates
 * a lightweight JSON file containing icon names and SVG data
 * for use in the Decap CMS icon picker widget.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Read the tabler icons package
const iconsPath = join(rootDir, 'node_modules/@iconify-json/tabler/icons.json');
const iconData = JSON.parse(readFileSync(iconsPath, 'utf8'));

// Extract relevant data for each icon
const icons = {};
for (const [name, data] of Object.entries(iconData.icons)) {
  icons[name] = {
    body: data.body,
    width: data.width || iconData.width || 24,
    height: data.height || iconData.height || 24,
  };
}

// Prepare output
const output = {
  prefix: 'tabler',
  icons,
  total: Object.keys(icons).length,
  generated: new Date().toISOString(),
};

// Ensure output directory exists
const outputDir = join(rootDir, 'public/admin');
mkdirSync(outputDir, { recursive: true });

// Write the file
const outputPath = join(outputDir, 'tabler-icons.json');
writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

console.log(`✓ Generated tabler-icons.json with ${output.total} icons`);
console.log(`  Output: ${outputPath}`);
console.log(`  Size: ${(JSON.stringify(output).length / 1024).toFixed(2)} KB`);
