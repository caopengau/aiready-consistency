import React from 'react';
import CodeBlock from '../../components/CodeBlock';

const codeReceiptComparison = `// File: api/receipts/validate.ts
function checkReceiptData(data: any): boolean {
  if (!data.merchant) return false;
  if (!data.amount) return false;
  if (data.amount <= 0) return false;
  if (!data.date) return false;
  return true;
}

// File: lib/validators/receipt-validator.ts
export function isValidReceipt(receipt: ReceiptInput): boolean {
  const hasRequiredFields = receipt.merchant && 
                           receipt.amount && 
                           receipt.date;
  const hasPositiveAmount = receipt.amount > 0;
  return hasRequiredFields && hasPositiveAmount;
}`;

const codeReceiptFragmented = `src/
  api/
    receipts/
      upload.ts          # Handles file upload
      extract.ts         # Calls OCR service
      parse.ts           # Parses OCR response
  lib/
    ocr/
      google-vision.ts   # Google Vision integration
      openai-vision.ts   # OpenAI Vision integration
    parsers/
      receipt-parser.ts  # Parsing logic
  services/
    receipt-service.ts   # Business logic
  utils/
    file-upload.ts       # S3 upload helper
`;

const codeReceiptConsolidated = `src/
  domains/
    receipt-processing/
      index.ts           # Public API
      ocr-service.ts     # OCR abstraction
      parser.ts          # Parsing logic
      storage.ts         # S3 operations
      types.ts           # Shared types`;

const codeHelpersExample = `// lib/utils/helpers.ts (820 lines)
export function formatCurrency(amount: number): string { ... }
export function parseDate(dateStr: string): Date { ... }
export function uploadToS3(file: Buffer): Promise<string> { ... }
export function validateEmail(email: string): boolean { ... }
export function generateToken(): string { ... }
export function calculateGST(amount: number): number { ... }
export function hashPassword(pwd: string): Promise<string> { ... }`;

const Callout = ({
  type,
  children,
}: {
  type: 'info' | 'tip' | 'warn' | 'danger';
  children: React.ReactNode;
}) => {
  const color =
    type === 'info'
      ? 'bg-blue-50 border-blue-400 text-blue-900'
      : type === 'tip'
        ? 'bg-green-50 border-green-400 text-green-900'
        : type === 'warn'
          ? 'bg-yellow-50 border-yellow-400 text-yellow-900'
          : 'bg-red-50 border-red-400 text-red-900';
  return (
    <div className={`my-6 p-4 border-l-4 rounded-md ${color}`}>{children}</div>
  );
};

const SectionDivider = () => (
  <hr className="my-12 border-t-2 border-blue-100" />
);

const PostContent: React.FC = () => (
  <>
    <Callout type="info">
      <strong>Key Insight:</strong> AI can only see what you make visible. Code
      structure, duplication, and fragmentation all impact AI's ability to help
      you.
    </Callout>

    <p>
      I watched GitHub Copilot suggest the same validation logic three times in
      one week. Different syntax. Different variable names. Same exact purpose.
    </p>
    <p>The AI wasn't broken. My codebase was invisible.</p>

    <div className="my-12 max-w-2xl mx-auto">
      <img
        src="/series-2-invisible-to-ai.png"
        alt="Why your codebase is invisible to AI"
        className="rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 w-full"
      />
      <p className="text-center text-sm text-slate-500 mt-4 italic">
        AI models have limited visibility. If your logic is fragmented, it
        remains invisible to the AI's context.
      </p>
    </div>

    <p>
      Here's the problem: AI can write code, but it can't <em>see</em> your
      patterns. Not the way humans do. When you have the same logic scattered
      across different files with different names, AI treats each one as unique.
      So it solves it again. And again.
    </p>

    <Callout type="warn">
      <strong>Warning:</strong> This isn't just annoying. It's expensive.
    </Callout>

    <SectionDivider />

    <h2>The Context Window Crisis</h2>
    <p>
      Every time your AI assistant helps with code, it needs context. It reads
      your file, follows imports, understands dependencies. All of this costs
      tokens. The more fragmented your code, the more tokens you burn.
    </p>
    <p>
      Let me show you a real example from building{' '}
      <span className="font-semibold text-purple-700">ReceiptClaimer</span>.
    </p>

    <h3>Example 1: User Validation - The Hard Way</h3>
    <p>I had user validation logic spread across 8 files:</p>
    <ul>
      <li>
        <code>api/auth/validate-email.ts</code>
      </li>
      <li>
        <code>api/auth/validate-password.ts</code>
      </li>
      <li>
        <code>api/users/check-email-exists.ts</code>
      </li>
      <li>
        <code>api/users/validate-username.ts</code>
      </li>
      <li>
        <code>lib/validators/email.ts</code>
      </li>
      <li>
        <code>lib/validators/password-strength.ts</code>
      </li>
      <li>
        <code>utils/auth/email-format.ts</code>
      </li>
      <li>
        <code>utils/validation/user-fields.ts</code>
      </li>
    </ul>
    <p>
      <strong>Total context cost: 12,450 tokens per request.</strong>
    </p>

    <h3>Example 2: User Validation - The Smart Way</h3>
    <p>After refactoring, I consolidated to 2 files:</p>
    <ul>
      <li>
        <code>lib/user-validation/index.ts</code> - All validation logic
      </li>
      <li>
        <code>lib/user-validation/types.ts</code> - Shared types
      </li>
    </ul>

    <h2>Three Ways Your Code Becomes Invisible</h2>
    <h3>1. Semantic Duplicates: Same Logic, Different Disguise</h3>
    <CodeBlock>{codeReceiptComparison}</CodeBlock>

    <h3>2. Domain Fragmentation: Scattered Logic That Bleeds Tokens</h3>
    <CodeBlock lang="text">{codeReceiptFragmented}</CodeBlock>

    <h3>3. Low Cohesion: Mixed Concerns That Confuse Everyone</h3>
    <CodeBlock>{codeHelpersExample}</CodeBlock>

    <hr className="my-12 border-slate-200 dark:border-zinc-800" />

    <p className="text-sm italic text-slate-500">
      *Peng Cao is the founder of{' '}
      <a href="https://receiptclaimer.com">receiptclaimer</a> and creator of{' '}
      <a href="https://github.com/getaiready/aiready-cli">aiready</a>, an
      open-source suite for measuring and optimising codebases for AI adoption.*
    </p>
  </>
);

export default PostContent;
