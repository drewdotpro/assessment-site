import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import generateCMSConfig from '../cms-config.template.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get environment variables
const SITE_ID = process.env.SITE_ID;
const ASSESSMENTS_URL = process.env.ASSESSMENTS_URL;
const ADHD_URL = process.env.ADHD_URL;
const AUTISM_URL = process.env.AUTISM_URL;

// Validate required environment variables
if (!SITE_ID) {
  console.error('❌ ERROR: SITE_ID environment variable is required');
  console.error('   Use: SITE_ID=assessments npm run dev');
  process.exit(1);
}

if (!['assessments', 'adhd', 'autism'].includes(SITE_ID)) {
  console.error(`❌ ERROR: Invalid SITE_ID "${SITE_ID}"`);
  console.error('   Must be: assessments, adhd, or autism');
  process.exit(1);
}

if (!ASSESSMENTS_URL || !ADHD_URL || !AUTISM_URL) {
  console.error('❌ ERROR: All site URLs must be set:');
  console.error('   ASSESSMENTS_URL, ADHD_URL, AUTISM_URL');
  process.exit(1);
}

// Site URLs object
const siteUrls = {
  assessments: ASSESSMENTS_URL,
  adhd: ADHD_URL,
  autism: AUTISM_URL,
};

// Generate config
console.log(`\n🔧 Generating CMS config for: ${SITE_ID}`);
console.log(`   URL: ${siteUrls[SITE_ID]}\n`);

const config = generateCMSConfig(SITE_ID, siteUrls);

// Convert to YAML
const yamlConfig = yaml.dump(config, {
  lineWidth: -1, // Don't wrap lines
  noRefs: true,
});

// Write to public/admin/config.yml
const configPath = path.join(__dirname, '../public/admin/config.yml');
fs.writeFileSync(configPath, yamlConfig, 'utf8');

console.log(`✅ CMS config generated: public/admin/config.yml\n`);
