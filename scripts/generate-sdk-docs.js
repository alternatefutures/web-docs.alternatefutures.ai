#!/usr/bin/env node

/**
 * Generate SDK documentation from the cloud-sdk repository
 *
 * This script:
 * 1. Locates the cloud-sdk repository
 * 2. Runs TypeDoc to generate markdown from TypeScript source
 * 3. Processes and formats the output
 * 4. Outputs to docs/sdk/api.md
 */

import { execSync, execFileSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '../docs/sdk');
const SDK_REPO = join(__dirname, '../../package-cloud-sdk'); // SDK repo in alternatefutures folder

console.log('🔧 Generating SDK documentation...\n');

// Check if SDK repo exists
if (!existsSync(SDK_REPO)) {
  console.error(`❌ SDK repository not found at: ${SDK_REPO}`);
  console.error('Please ensure cloud-sdk repo is cloned as a sibling directory');
  process.exit(1);
}

/**
 * Run TypeDoc to generate documentation
 */
function runTypeDoc() {
  console.log('📖 Running TypeDoc...');

  try {
    execFileSync(
      "npx",
      [
        "typedoc",
        "--plugin",
        "typedoc-plugin-markdown",
        "--out",
        `${DOCS_DIR}/generated`,
        "src/index.ts"
      ],
      {
        cwd: SDK_REPO,
        stdio: 'inherit',
        shell: false
      }
    );
    console.log('✅ TypeDoc generation complete');
  } catch (error) {
    console.error('❌ TypeDoc generation failed:', error.message);
    process.exit(1);
  }
}

/**
 * Process and combine generated docs into a single API reference
 */
function processGeneratedDocs() {
  console.log('📝 Processing generated documentation...');

  const generatedDir = join(DOCS_DIR, 'generated');

  if (!existsSync(generatedDir)) {
    console.error('❌ Generated docs directory not found');
    process.exit(1);
  }

  // Read the main README from TypeDoc
  const readmePath = join(generatedDir, 'README.md');
  let content = '# SDK API Reference\n\n';
  content += '> This documentation is auto-generated from the `cloud-sdk` repository using TypeDoc.\n\n';

  if (existsSync(readmePath)) {
    const readmeContent = readFileSync(readmePath, 'utf8');
    // Remove the TypeDoc header
    content += readmeContent.replace(/^#.*\n/, '');
  }

  // Write the combined API reference
  const outputFile = join(DOCS_DIR, 'api.md');
  writeFileSync(outputFile, content, 'utf8');

  console.log(`✨ SDK documentation generated at: ${outputFile}`);
}

/**
 * Generate quick reference from package exports
 * NOTE: This file is manually maintained at docs/sdk/quickstart.md
 * Do not overwrite it with auto-generated content
 */
function generateQuickReference() {
  console.log('📚 Checking quick reference...');

  const quickRefPath = join(DOCS_DIR, 'quickstart.md');

  // Check if manual quickstart exists and preserve it
  if (existsSync(quickRefPath)) {
    const content = readFileSync(quickRefPath, 'utf8');
    // If file has substantial content (more than a basic template), preserve it
    if (content.length > 500) {
      console.log('✅ Quickstart.md already exists with manual content, preserving it');
      return;
    }
  }

  const packageJsonPath = join(SDK_REPO, 'package.json');

  if (!existsSync(packageJsonPath)) {
    console.warn('⚠️  package.json not found, skipping quick reference');
    return;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  let quickRef = '# SDK Quickstart\n\n';
  quickRef += 'Get started with the Alternate Futures SDK in under 5 minutes.\n\n';
  quickRef += '## Installation\n\n';
  quickRef += '::: code-group\n\n';
  quickRef += '```bash [npm]\n';
  quickRef += `npm install ${packageJson.name}\n`;
  quickRef += '```\n\n';
  quickRef += '```bash [pnpm]\n';
  quickRef += `pnpm add ${packageJson.name}\n`;
  quickRef += '```\n\n';
  quickRef += '```bash [yarn]\n';
  quickRef += `yarn add ${packageJson.name}\n`;
  quickRef += '```\n\n';
  quickRef += ':::\n\n';

  quickRef += '## Basic Setup\n\n';
  quickRef += '### Node.js\n\n';
  quickRef += '```typescript\n';
  quickRef += `import { AlternateFuturesSdk, PersonalAccessTokenService } from '${packageJson.name}/node';\n\n`;
  quickRef += '// Create the access token service\n';
  quickRef += 'const accessTokenService = new PersonalAccessTokenService({\n';
  quickRef += '  personalAccessToken: process.env.AF_TOKEN,\n';
  quickRef += '  projectId: process.env.AF_PROJECT_ID,\n';
  quickRef += '});\n\n';
  quickRef += '// Initialize the SDK\n';
  quickRef += 'const af = new AlternateFuturesSdk({\n';
  quickRef += '  accessTokenService,\n';
  quickRef += '});\n\n';
  quickRef += '// You\'re ready to go!\n';
  quickRef += 'const sites = await af.sites().list();\n';
  quickRef += 'console.log(\'Sites:\', sites);\n';
  quickRef += '```\n\n';

  quickRef += '### Browser\n\n';
  quickRef += '```typescript\n';
  quickRef += `import { AlternateFuturesSdk, StaticAccessTokenService } from '${packageJson.name}';\n\n`;
  quickRef += '// For browser apps, use StaticAccessTokenService\n';
  quickRef += 'const accessTokenService = new StaticAccessTokenService({\n';
  quickRef += '  token: \'your-access-token\',\n';
  quickRef += '  projectId: \'your-project-id\',\n';
  quickRef += '});\n\n';
  quickRef += 'const af = new AlternateFuturesSdk({\n';
  quickRef += '  accessTokenService,\n';
  quickRef += '});\n';
  quickRef += '```\n\n';

  quickRef += 'For complete API documentation, see the [API Reference](./api.md).\n';

  writeFileSync(quickRefPath, quickRef, 'utf8');

  console.log(`✨ Quick reference generated at: ${quickRefPath}`);
}

/**
 * Main execution
 */
function main() {
  runTypeDoc();
  processGeneratedDocs();
  generateQuickReference();

  console.log('\n✅ SDK documentation generation complete!\n');
}

main();
