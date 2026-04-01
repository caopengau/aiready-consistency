import React from 'react';
import CodeBlock from '../../components/CodeBlock';

const PostContent = () => (
  <>
    <p>
      You've just asked your AI assistant to add email validation to your new
      signup form. It writes this:
    </p>

    <CodeBlock lang="typescript">{`function validateEmail(email: string): boolean {
  return email.includes('@') && email.includes('.');
}`}</CodeBlock>

    <p>
      Simple enough. But here's the problem: this exact logic—checking for '@'
      and '.'—already exists in four other places in your codebase, just written
      differently:
    </p>

    <CodeBlock lang="typescript">{`// In src/utils/validators.ts
const isValidEmail = (e) => e.indexOf('@') !== -1 && e.indexOf('.') !== -1;

// In src/api/auth.ts
if (user.email.match(/@/) && user.email.match(/\\./)) { /* ... */ }

// In src/components/EmailForm.tsx
const checkEmail = (val) => val.split('').includes('@') && val.split('').includes('.');

// In src/services/user-service.ts
return email.search('@') >= 0 && email.search('.') >= 0;`}</CodeBlock>

    <p>
      Your AI didn't see these patterns. Why? Because they look different
      syntactically, even though they're semantically identical. This is{' '}
      <strong>semantic duplication</strong>—and it's one of the biggest hidden
      costs in AI-assisted development.
    </p>

    <div className="my-12 max-w-2xl mx-auto">
      <img
        src="/series-4-semantic-duplicate-detection.png"
        alt="Semantic Duplicate Detection - How AI keeps rewriting the same logic in different ways"
        className="rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-full"
      />
      <p className="text-center text-sm text-slate-500 mt-4 italic">
        How AI models miss semantic duplicates: same logic, different syntax,
        invisible to traditional analysis.
      </p>
    </div>

    <h2>The Problem: Syntax Blinds AI Models</h2>
    <p>
      Traditional duplicate detection tools look for <em>exact</em> or
      near-exact text matches. They catch copy-paste duplicates, but miss logic
      that's been rewritten with different:
    </p>
    <ul>
      <li>
        Variable names (<code>email</code> vs <code>e</code> vs <code>val</code>
        )
      </li>
      <li>
        Methods (<code>includes()</code> vs <code>indexOf()</code> vs{' '}
        <code>match()</code> vs <code>search()</code>)
      </li>
      <li>Structure (inline vs function vs arrow function)</li>
    </ul>
    <p>
      AI models suffer from the same limitation. When they scan your codebase
      for context, they see these five implementations as completely unrelated.
      Each one consumes precious context window tokens, yet provides zero new
      information.
    </p>

    <h2>Real-World Impact: The receiptclaimer Story</h2>
    <p>
      When I ran <code>@aiready/pattern-detect</code> on{' '}
      <a href="https://receiptclaimer.com">receiptclaimer</a>'s codebase, I
      found <strong>23 semantic duplicate patterns</strong> scattered across 47
      files. Here's what that looked like:
    </p>

    <p>
      <strong>Before:</strong>
    </p>
    <ul>
      <li>23 duplicate patterns (validation, formatting, error handling)</li>
      <li>8,450 wasted context tokens</li>
      <li>AI suggestions kept reinventing existing logic</li>
      <li>Code reviews: "Didn't we already have this somewhere?"</li>
    </ul>

    <p>
      <strong>After consolidation:</strong>
    </p>
    <ul>
      <li>3 remaining patterns (acceptable, different contexts)</li>
      <li>1,200 context tokens (85% reduction)</li>
      <li>AI now references existing patterns</li>
      <li>Faster code reviews, cleaner suggestions</li>
    </ul>

    <p>
      The math: Each duplicate pattern cost ~367 tokens on average. When AI
      assistants tried to understand feature areas, they had to load multiple
      variations of the same logic, quickly exhausting their context window.
    </p>

    <h2>How It Works: Jaccard Similarity on AST Tokens</h2>
    <p>
      <code>@aiready/pattern-detect</code> uses a technique called{' '}
      <strong>Jaccard similarity</strong> on{' '}
      <strong>Abstract Syntax Tree (AST) tokens</strong> to detect semantic
      duplicates. Let me break that down.
    </p>

    <h3>Step 1: Parse to AST</h3>
    <p>
      First, we parse your code into an Abstract Syntax Tree—a structural
      representation that ignores syntax and focuses on meaning:
    </p>

    <CodeBlock lang="typescript">{`// Original code
function validateEmail(email) {
  return email.includes('@') && email.includes('.');
}

// AST tokens (simplified)
[
  'FunctionDeclaration',
  'Identifier:validateEmail',
  'Identifier:email',
  'ReturnStatement',
  'LogicalExpression:&&',
  'CallExpression:includes',
  'MemberExpression:email',
  'StringLiteral:@',
  'CallExpression:includes',
  'MemberExpression:email',
  'StringLiteral:.'
]`}</CodeBlock>

    <h3>Step 2: Normalize</h3>
    <p>We normalize these tokens by:</p>
    <ul>
      <li>Removing specific identifiers (variable/function names)</li>
      <li>Keeping operation types (CallExpression, LogicalExpression)</li>
      <li>Preserving structure (nesting, flow control)</li>
    </ul>

    <CodeBlock lang="typescript">{`// Normalized tokens
[
  'FunctionDeclaration',
  'ReturnStatement',
  'LogicalExpression:&&',
  'CallExpression:includes',
  'StringLiteral',
  'CallExpression:includes',
  'StringLiteral'
]`}</CodeBlock>

    <h3>Step 3: Calculate Jaccard Similarity</h3>
    <p>Jaccard similarity measures how similar two sets are:</p>

    <CodeBlock lang="text">{`Jaccard(A, B) = |A ∩ B| / |A ∪ B|`}</CodeBlock>

    <p>Where:</p>
    <ul>
      <li>
        <strong>A ∩ B</strong> = tokens in both sets (intersection)
      </li>
      <li>
        <strong>A ∪ B</strong> = tokens in either set (union)
      </li>
    </ul>

    <p>
      <strong>Example:</strong>
    </p>

    <CodeBlock lang="typescript">{`// Pattern A (normalized)
Set A = ['FunctionDeclaration', 'ReturnStatement', 'LogicalExpression:&&', 
         'CallExpression:includes', 'StringLiteral']

// Pattern B (normalized)
Set B = ['FunctionDeclaration', 'ReturnStatement', 'LogicalExpression:&&', 
         'CallExpression:indexOf', 'StringLiteral']

// Intersection
A ∩ B = ['FunctionDeclaration', 'ReturnStatement', 'LogicalExpression:&&', 
         'StringLiteral']
|A ∩ B| = 4

// Union
A ∪ B = ['FunctionDeclaration', 'ReturnStatement', 'LogicalExpression:&&', 
         'CallExpression:includes', 'CallExpression:indexOf', 'StringLiteral']
|A ∪ B| = 6

// Jaccard similarity
Jaccard(A, B) = 4 / 6 = 0.67 (67%)`}</CodeBlock>

    <p>
      By default, <code>pattern-detect</code> flags patterns with{' '}
      <strong>≥70% similarity</strong> as duplicates. This catches most semantic
      duplicates while avoiding false positives.
    </p>

    <h2>Pattern Classification</h2>
    <p>The tool automatically classifies patterns into categories:</p>

    <h3>1. Validators</h3>
    <p>Logic that checks conditions and returns boolean:</p>
    <CodeBlock lang="typescript">{`// Pattern: Email validation
function validateEmail(email) { return email.includes('@'); }
const isValidEmail = (e) => e.indexOf('@') !== -1;`}</CodeBlock>

    <h3>2. Formatters</h3>
    <p>Logic that transforms input to output:</p>
    <CodeBlock lang="typescript">{`// Pattern: Phone number formatting
function formatPhone(num) { return num.replace(/\\D/g, ''); }
const cleanPhone = (n) => n.split('').filter(c => /\\d/.test(c)).join('');`}</CodeBlock>

    <h3>3. API Handlers</h3>
    <p>Request/response processing logic:</p>
    <CodeBlock lang="typescript">{`// Pattern: Error response handling
function handleError(err) { return { status: 500, message: err.message }; }
const errorResponse = (e) => ({ status: 500, message: e.message });`}</CodeBlock>

    <h3>4. Utilities</h3>
    <p>General helper functions:</p>
    <CodeBlock lang="typescript">{`// Pattern: Array deduplication
function unique(arr) { return [...new Set(arr)]; }
const dedupe = (a) => Array.from(new Set(a));`}</CodeBlock>

    <hr className="my-12 border-slate-200 dark:border-zinc-800" />

    <p className="text-sm italic text-slate-500">
      *Peng Cao is the founder of{' '}
      <a href="https://receiptclaimer.com">receiptclaimer</a> and creator of{' '}
      <a href="https://github.com/getaiready/aiready-cli">aiready</a>, an
      open-source suite for measuring and optimizing codebases for AI adoption.*
    </p>
  </>
);

export default PostContent;
