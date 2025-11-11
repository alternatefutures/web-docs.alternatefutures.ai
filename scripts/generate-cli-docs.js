#!/usr/bin/env node

/**
 * Generate CLI documentation from the cloud-cli repository
 *
 * This script:
 * 1. Locates the cloud-cli repository
 * 2. Runs the CLI with --help flags to extract command documentation
 * 3. Parses the output and generates markdown files
 * 4. Outputs to docs/cli/commands.md
 */

import { execSync, execFileSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '../docs/cli');
const CLI_REPO = join(__dirname, '../../../cloud-cli'); // Assuming repos are siblings

console.log('🔧 Generating CLI documentation...\n');

// Check if CLI repo exists
if (!existsSync(CLI_REPO)) {
  console.error(`❌ CLI repository not found at: ${CLI_REPO}`);
  console.error('Please ensure cloud-cli repo is cloned as a sibling directory');
  process.exit(1);
}

/**
 * Run CLI command and capture output
 */
function runCliCommand(args = []) {
  try {
    const output = execFileSync(
      'node',
      [`${CLI_REPO}/dist/index.js`, ...args],
      {
        encoding: 'utf8',
        cwd: CLI_REPO
      }
    );
    return output;
  } catch (error) {
    return error.stdout || error.message;
  }
}

/**
 * Parse CLI help output into structured data
 */
function parseHelpOutput(output) {
  const lines = output.split('\n');
  const commands = [];
  let currentCommand = null;

  for (const line of lines) {
    // Detect command lines (usually start with whitespace and command name)
    if (line.trim().startsWith('af ')) {
      if (currentCommand) {
        commands.push(currentCommand);
      }
      currentCommand = {
        command: line.trim(),
        description: '',
        options: []
      };
    } else if (currentCommand && line.includes('--')) {
      // Parse options
      const match = line.match(/(--[\w-]+)\s+(.*)/);
      if (match) {
        currentCommand.options.push({
          flag: match[1],
          description: match[2]
        });
      }
    } else if (currentCommand && line.trim()) {
      // Add to description
      currentCommand.description += line.trim() + ' ';
    }
  }

  if (currentCommand) {
    commands.push(currentCommand);
  }

  return commands;
}

/**
 * Generate markdown from commands data
 */
function generateMarkdown(commands) {
  let markdown = '# CLI Commands\n\n';
  markdown += '> This documentation is auto-generated from the `cloud-cli` repository.\n\n';
  markdown += '## Available Commands\n\n';

  // Group commands by category
  const categories = {
    auth: [],
    agents: [],
    sites: [],
    storage: [],
    config: [],
    other: []
  };

  commands.forEach(cmd => {
    const cmdName = cmd.command.split(' ')[1];
    if (cmdName.includes('login') || cmdName.includes('logout') || cmdName.includes('whoami')) {
      categories.auth.push(cmd);
    } else if (cmdName.startsWith('agents')) {
      categories.agents.push(cmd);
    } else if (cmdName.startsWith('sites')) {
      categories.sites.push(cmd);
    } else if (cmdName.startsWith('storage')) {
      categories.storage.push(cmd);
    } else if (cmdName.startsWith('config')) {
      categories.config.push(cmd);
    } else {
      categories.other.push(cmd);
    }
  });

  // Generate sections
  Object.entries(categories).forEach(([category, cmds]) => {
    if (cmds.length === 0) return;

    markdown += `## ${category.charAt(0).toUpperCase() + category.slice(1)} Commands\n\n`;

    cmds.forEach(cmd => {
      markdown += `### \`${cmd.command}\`\n\n`;
      if (cmd.description) {
        markdown += `${cmd.description.trim()}\n\n`;
      }

      if (cmd.options.length > 0) {
        markdown += '**Options:**\n\n';
        cmd.options.forEach(opt => {
          markdown += `- \`${opt.flag}\` - ${opt.description}\n`;
        });
        markdown += '\n';
      }

      markdown += '---\n\n';
    });
  });

  return markdown;
}

/**
 * Main execution
 */
function main() {
  console.log('📖 Reading CLI help output...');
  const helpOutput = runCliCommand(['--help']);

  console.log('🔍 Parsing commands...');
  const commands = parseHelpOutput(helpOutput);

  console.log(`✅ Found ${commands.length} commands`);

  console.log('📝 Generating markdown...');
  const markdown = generateMarkdown(commands);

  const outputFile = join(DOCS_DIR, 'commands.md');
  writeFileSync(outputFile, markdown, 'utf8');

  console.log(`✨ CLI documentation generated at: ${outputFile}`);
  console.log('\n✅ Done!\n');
}

main();
