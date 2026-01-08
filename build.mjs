
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// Fix: Use default import for 'node:process' to safely access process.exit()
import process from 'node:process';

// Files to copy to the final distribution folder after build
const staticFiles = [
  'README.md',
  'privacy-policy.md',
  'ai-info.json',
  'robots.txt',
  'sitemap.xml',
  'about.html',
  'docs.html',
  'privacy-policy.html',
  'terms.html',
  'googlead42dd66f9e0cb82.html' // Added Google verification file
];

const buildDir = 'dist';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function copyStaticFiles() {
  console.log('📂 Processing static assets for distribution...');
  
  try {
    await fs.access(buildDir);

    for (const file of staticFiles) {
      const sourcePath = path.resolve(__dirname, file);
      const destPath = path.resolve(__dirname, buildDir, file);
      
      try {
        await fs.access(sourcePath);
        await fs.copyFile(sourcePath, destPath);
        console.log(`✅ Asset synced: ${file}`);
      } catch (err) {
        // Silently skip if a secondary file is missing
      }
    }
    console.log('✨ Deployment bundle finalized successfully.');
  } catch (error) {
    console.error(`❌ Dist folder not found. Build likely failed before this script ran.`);
    // Fix: Call process.exit(1) using the default imported process object
    process.exit(1);
  }
}

copyStaticFiles();