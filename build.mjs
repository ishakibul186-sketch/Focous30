
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// List of static files to copy from the root to the build output directory
const staticFiles = [
  'README.md',
  'ai-info.json',
  'robots.txt',
  'sitemap.xml',
];

// Vite's default build output directory
const buildDir = 'dist';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Copies the static files to the build directory.
 */
async function copyStaticFiles() {
  try {
    // Ensure the build directory exists before trying to copy files into it.
    await fs.access(buildDir);

    for (const file of staticFiles) {
      const sourcePath = path.resolve(__dirname, file);
      const destPath = path.resolve(__dirname, buildDir, file);
      
      try {
        // Check if the source file exists before attempting to copy.
        await fs.access(sourcePath);
        await fs.copyFile(sourcePath, destPath);
        console.log(`✅ Copied ${file} to ${buildDir}/`);
      } catch (err) {
        // Log a warning if a specific file is missing, but don't fail the whole build.
        console.warn(`⚠️ Could not find or copy ${file}. Skipping.`);
      }
    }
  } catch (error) {
    console.error(`❌ Error copying static files: The '${buildDir}' directory might not exist.`, error);
    process.exit(1);
  }
}

/**
 * Main build function to orchestrate the build process.
 */
async function build() {
  console.log('🚀 Starting production build...');

  try {
    // Step 1: Run the standard Vite build command.
    // We use 'npx' to ensure Vite is resolved correctly from local dependencies.
    console.log('📦 Running vite build...');
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('🎉 Vite build completed successfully.');

    // Step 2: Copy the static files into the completed build directory.
    console.log('📂 Copying static files...');
    await copyStaticFiles();

    console.log('✨ Build process finished successfully!');
  } catch (error) {
    // The error from execSync will already be printed, so we just add a final message.
    console.error('❌ Build failed.');
    process.exit(1);
  }
}

// Start the build process.
build();
