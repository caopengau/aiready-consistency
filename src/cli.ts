#!/usr/bin/env node

import { Command } from 'commander';
import { analyzeContext } from './analyzer';
import { generateSummary } from './summary';
import {
  displayConsoleReport,
  generateHTMLReport,
  runInteractiveSetup,
} from './utils/output-formatter';
import chalk from 'chalk';
import { writeFileSync } from 'fs';
import {
  loadMergedConfig,
  handleJSONOutput,
  handleCLIError,
  getElapsedTime,
  resolveOutputPath,
} from '@aiready/core';

const program = new Command();

program
  .name('aiready-context')
  .description('Analyze AI context window cost and code structure')
  .version('0.1.0')
  .addHelpText(
    'after',
    '\nCONFIGURATION:\n  Supports config files: aiready.json, aiready.config.json, .aiready.json, .aireadyrc.json, aiready.config.js, .aireadyrc.js\n  CLI options override config file settings'
  )
  .argument('<directory>', 'Directory to analyze')
  .option('--max-depth <number>', 'Maximum acceptable import depth')
  .option(
    '--max-context <number>',
    'Maximum acceptable context budget (tokens)'
  )
  .option('--min-cohesion <number>', 'Minimum acceptable cohesion score (0-1)')
  .option(
    '--max-fragmentation <number>',
    'Maximum acceptable fragmentation (0-1)'
  )
  .option(
    '--focus <type>',
    'Analysis focus: fragmentation, cohesion, depth, all'
  )
  .option('--include-node-modules', 'Include node_modules in analysis')
  .option('--include <patterns>', 'File patterns to include (comma-separated)')
  .option('--exclude <patterns>', 'File patterns to exclude (comma-separated)')
  .option(
    '--max-results <number>',
    'Maximum number of results to show in console output'
  )
  .option(
    '-o, --output <format>',
    'Output format: console, json, html',
    'console'
  )
  .option('--output-file <path>', 'Output file path (for json/html)')
  .option(
    '--interactive',
    'Run interactive setup to suggest excludes and focus areas'
  )
  .action(async (directory, options) => {
    console.log(chalk.blue('🔍 Analyzing context window costs...\n'));

    const startTime = Date.now();

    try {
      // Define defaults
      const defaults = {
        maxDepth: 5,
        maxContextBudget: 10000,
        minCohesion: 0.6,
        maxFragmentation: 0.5,
        focus: 'all',
        includeNodeModules: false,
        include: undefined,
        exclude: undefined,
        maxResults: 10,
      };

      // Load and merge config with CLI options
      let finalOptions = (await loadMergedConfig(directory, defaults, {
        maxDepth: options.maxDepth ? parseInt(options.maxDepth) : undefined,
        maxContextBudget: options.maxContext
          ? parseInt(options.maxContext)
          : undefined,
        minCohesion: options.minCohesion
          ? parseFloat(options.minCohesion)
          : undefined,
        maxFragmentation: options.maxFragmentation
          ? parseFloat(options.maxFragmentation)
          : undefined,
        focus:
          (options.focus as 'fragmentation' | 'cohesion' | 'depth' | 'all') ||
          undefined,
        includeNodeModules: options.includeNodeModules,
        include: options.include?.split(','),
        exclude: options.exclude?.split(','),
        maxResults: options.maxResults
          ? parseInt(options.maxResults)
          : undefined,
      })) as any;

      // Interactive setup if requested
      if (options.interactive) {
        finalOptions = await runInteractiveSetup(directory, finalOptions);
      }

      // Run analysis
      const results = await analyzeContext(finalOptions);
      const summary = generateSummary(results, finalOptions);

      const duration = getElapsedTime(startTime);

      // Handle output
      if (options.output === 'json') {
        handleJSONOutput(
          {
            summary: {
              ...summary,
              executionTime: duration,
              config: {
                scan: { tools: ['context'] },
                tools: { context: finalOptions },
              },
              toolConfigs: { context: finalOptions },
            },
            context: { results },
          },
          options.outputFile
        );
      } else if (options.output === 'html') {
        const html = generateHTMLReport(summary, results);
        const outputPath = resolveOutputPath(
          directory,
          options.outputFile,
          'context-report.html'
        );
        writeFileSync(outputPath, html, 'utf-8');
        console.log(chalk.green(`\n✅ HTML report saved to: ${outputPath}`));
      } else {
        // Default: Console
        displayConsoleReport(summary, results, finalOptions.maxResults);
        console.log(chalk.dim(`\n✨ Analysis completed in ${duration}ms\n`));
      }
    } catch (error) {
      handleCLIError(error, 'context-analyzer');
    }
  });

program.parse(process.argv);
