'use client';

import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('mb-8', className)}>
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            {index > 0 && <span className="text-slate-600">/</span>}
            {index === items.length - 1 ? (
              <span className="text-cyan-400 font-medium">{item.label}</span>
            ) : (
              <a
                href={item.href}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}
