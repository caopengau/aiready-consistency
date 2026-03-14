import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import prompts from 'prompts';
import { analyzeContext } from '../analyzer';
import { generateSummary } from '../summary';

/**
 * Display analysis report in console
 */
export function displayConsoleReport(
  summary: ReturnType<typeof generateSummary>,
  results: Awaited<ReturnType<typeof analyzeContext>>,
  maxResults: number = 10
): void {
  const divider =
    '──────────────────────────────────────────────────────────────────';
  const totalIssues =
    summary.criticalIssues + summary.majorIssues + summary.minorIssues;

  console.log(chalk.bold('📊 Context Analysis Summary:\n'));
  console.log(`   • Total Files:      ${chalk.cyan(summary.totalFiles)}`);
  console.log(
    `   • Total Tokens:     ${chalk.cyan(summary.totalTokens.toLocaleString())}`
  );
  console.log(
    `   • Avg Budget:       ${chalk.cyan(summary.avgContextBudget.toFixed(0))} tokens`
  );
  console.log(
    `   • Potential Saving: ${chalk.green(summary.totalPotentialSavings.toLocaleString())} tokens`
  );
  console.log();

  if (totalIssues > 0) {
    console.log(chalk.bold('⚠️ Issues Detected:\n'));
    console.log(`   • ${chalk.red('🔴 Critical:')} ${summary.criticalIssues}`);
    console.log(`   • ${chalk.yellow('🟡 Major:')}    ${summary.majorIssues}`);
    console.log(`   • ${chalk.blue('🔵 Minor:')}    ${summary.minorIssues}`);
    console.log();
  } else {
    console.log(chalk.green('✅ No significant context issues detected!\n'));
  }

  // Fragmented modules
  if (summary.fragmentedModules.length > 0) {
    console.log(chalk.bold('🧩 Top Fragmented Modules:\n'));

    summary.fragmentedModules.slice(0, maxResults).forEach((mod) => {
      const scoreColor =
        mod.fragmentationScore > 0.7
          ? chalk.red
          : mod.fragmentationScore > 0.4
            ? chalk.yellow
            : chalk.green;

      console.log(
        `   ${scoreColor('■')} ${chalk.white(mod.domain)} ${chalk.dim(`(${mod.files.length} files, ${(mod.fragmentationScore * 100).toFixed(0)}% frag)`)}`
      );
    });
    console.log();
  }

  // Top expensive files
  if (summary.topExpensiveFiles.length > 0) {
    console.log(chalk.bold('💸 Most Expensive Files (Context Budget):\n'));

    summary.topExpensiveFiles.slice(0, maxResults).forEach((item) => {
      const fileName = item.file.split('/').slice(-2).join('/');
      const severityColor =
        item.severity === 'critical'
          ? chalk.red
          : item.severity === 'major'
            ? chalk.yellow
            : chalk.blue;

      console.log(
        `   ${severityColor('●')} ${chalk.white(fileName)} ${chalk.dim(`- ${item.contextBudget.toLocaleString()} tokens`)}`
      );
    });
    console.log();
  }

  // Recommendations
  if (totalIssues > 0) {
    console.log(chalk.bold('💡 Top Recommendations:\n'));

    const topFiles = results
      .filter((r) => r.severity === 'critical' || r.severity === 'major')
      .slice(0, 3);

    topFiles.forEach((result, index) => {
      const fileName = result.file.split('/').slice(-2).join('/');
      console.log(chalk.cyan(`   ${index + 1}. ${fileName}`));
      result.recommendations.slice(0, 2).forEach((rec) => {
        console.log(chalk.dim(`      • ${rec}`));
      });
    });
    console.log();
  }

  // Footer
  console.log(chalk.cyan(divider));
  console.log(
    chalk.dim(
      '\n⭐ Like aiready? Star us on GitHub: https://github.com/caopengau/aiready-context-analyzer'
    )
  );
  console.log(
    chalk.dim(
      '🐛 Found a bug? Report it: https://github.com/caopengau/aiready-context-analyzer/issues\n'
    )
  );
}

/**
 * Generate HTML report
 */
export function generateHTMLReport(
  summary: ReturnType<typeof generateSummary>,
  results: Awaited<ReturnType<typeof analyzeContext>>
): string {
  const totalIssues =
    summary.criticalIssues + summary.majorIssues + summary.minorIssues;

  // 'results' may be used in templates later; reference to avoid lint warnings
  void results;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aiready Context Analysis Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    h1, h2, h3 { color: #2c3e50; }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .metric {
      font-size: 2em;
      font-weight: bold;
      color: #667eea;
    }
    .label {
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }
    .issue-critical { color: #e74c3c; }
    .issue-major { color: #f39c12; }
    .issue-minor { color: #3498db; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background-color: #667eea;
      color: white;
      font-weight: 600;
    }
    tr:hover { background-color: #f8f9fa; }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      color: #666;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 AIReady Context Analysis Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
  </div>

  <div class="summary">
    <div class="card">
      <div class="metric">${summary.totalFiles}</div>
      <div class="label">Files Analyzed</div>
    </div>
    <div class="card">
      <div class="metric">${summary.totalTokens.toLocaleString()}</div>
      <div class="label">Total Tokens</div>
    </div>
    <div class="card">
      <div class="metric">${summary.avgContextBudget.toFixed(0)}</div>
      <div class="label">Avg Context Budget</div>
    </div>
    <div class="card">
      <div class="metric ${totalIssues > 0 ? 'issue-major' : ''}">${totalIssues}</div>
      <div class="label">Total Issues</div>
    </div>
  </div>

  ${
    totalIssues > 0
      ? `
  <div class="card" style="margin-bottom: 30px;">
    <h2>⚠️ Issues Summary</h2>
    <p>
      <span class="issue-critical">🔴 Critical: ${summary.criticalIssues}</span> &nbsp;
      <span class="issue-major">🟡 Major: ${summary.majorIssues}</span> &nbsp;
      <span class="issue-minor">🔵 Minor: ${summary.minorIssues}</span>
    </p>
    <p><strong>Potential Savings:</strong> ${summary.totalPotentialSavings.toLocaleString()} tokens</p>
  </div>
  `
      : ''
  }

  ${
    summary.fragmentedModules.length > 0
      ? `
  <div class="card" style="margin-bottom: 30px;">
    <h2>🧩 Fragmented Modules</h2>
    <table>
      <thead>
        <tr>
          <th>Domain</th>
          <th>Files</th>
          <th>Fragmentation</th>
          <th>Token Cost</th>
        </tr>
      </thead>
      <tbody>
        ${summary.fragmentedModules
          .map(
            (m) => `
          <tr>
            <td>${m.domain}</td>
            <td>${m.files.length}</td>
            <td>${(m.fragmentationScore * 100).toFixed(0)}%</td>
            <td>${m.totalTokens.toLocaleString()}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>
  `
      : ''
  }

  ${
    summary.topExpensiveFiles.length > 0
      ? `
  <div class="card" style="margin-bottom: 30px;">
    <h2>💸 Most Expensive Files</h2>
    <table>
      <thead>
        <tr>
          <th>File</th>
          <th>Context Budget</th>
          <th>Severity</th>
        </tr>
      </thead>
      <tbody>
        ${summary.topExpensiveFiles
          .map(
            (f) => `
          <tr>
            <td>${f.file}</td>
            <td>${f.contextBudget.toLocaleString()} tokens</td>
            <td class="issue-${f.severity}">${f.severity.toUpperCase()}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>
  `
      : ''
  }

  <div class="footer">
    <p>Generated by <strong>@aiready/context-analyzer</strong></p>
    <p>Like AIReady? <a href="https://github.com/caopengau/aiready-context-analyzer">Star us on GitHub</a></p>
    <p>Found a bug? <a href="https://github.com/caopengau/aiready-context-analyzer/issues">Report it here</a></p>
  </div>
</body>
</html>`;
}

/**
 * Interactive setup: detect common frameworks and suggest excludes & focus areas
 */
export async function runInteractiveSetup(
  directory: string,
  current: any
): Promise<any> {
  console.log(chalk.yellow('🧭 Interactive mode: let’s tailor the analysis.'));

  const pkgPath = join(directory, 'package.json');
  let deps: Record<string, string> = {};
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    } catch (e) {
      void e;
      // Ignore parse errors, use empty deps
    }
  }

  const hasNextJs = existsSync(join(directory, '.next')) || !!deps['next'];
  const hasCDK =
    existsSync(join(directory, 'cdk.out')) ||
    !!deps['aws-cdk-lib'] ||
    Object.keys(deps).some((d) => d.startsWith('@aws-cdk/'));

  const recommendedExcludes = new Set<string>(current.exclude || []);
  if (
    hasNextJs &&
    !Array.from(recommendedExcludes).some((p) => p.includes('.next'))
  ) {
    recommendedExcludes.add('**/.next/**');
  }
  if (
    hasCDK &&
    !Array.from(recommendedExcludes).some((p) => p.includes('cdk.out'))
  ) {
    recommendedExcludes.add('**/cdk.out/**');
  }

  const { applyExcludes } = await prompts({
    type: 'toggle',
    name: 'applyExcludes',
    message: `Detected ${hasNextJs ? 'Next.js ' : ''}${hasCDK ? 'AWS CDK ' : ''}frameworks. Apply recommended excludes?`,
    initial: true,
    active: 'yes',
    inactive: 'no',
  });

  const nextOptions = { ...current };
  if (applyExcludes) {
    nextOptions.exclude = Array.from(recommendedExcludes);
  }

  const { focusArea } = await prompts({
    type: 'select',
    name: 'focusArea',
    message: 'Which areas to focus?',
    choices: [
      { title: 'Frontend (web app)', value: 'frontend' },
      { title: 'Backend (API/infra)', value: 'backend' },
      { title: 'Both', value: 'both' },
    ],
    initial: 2,
  });

  if (focusArea === 'frontend') {
    nextOptions.include = ['**/*.{ts,tsx,js,jsx}'];
    nextOptions.exclude = Array.from(
      new Set([
        ...(nextOptions.exclude || []),
        '**/cdk.out/**',
        '**/infra/**',
        '**/server/**',
        '**/backend/**',
      ])
    );
  } else if (focusArea === 'backend') {
    nextOptions.include = [
      '**/api/**',
      '**/server/**',
      '**/backend/**',
      '**/infra/**',
      '**/*.{ts,js,py,java}',
    ];
  }

  console.log(chalk.green('✓ Interactive configuration applied.'));
  return nextOptions;
}
