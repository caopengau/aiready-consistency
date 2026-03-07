'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  showClose?: boolean;
  variant?: 'default' | 'glass';
}

export function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-4xl',
  showClose = true,
  variant = 'glass',
}: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              'relative w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all',
              maxWidth,
              variant === 'glass'
                ? 'bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-indigo-500/30'
                : 'bg-white rounded-3xl',
              'scrollbar-thin scrollbar-thumb-slate-700'
            )}
          >
            {/* Close Button */}
            {showClose && (
              <button
                onClick={onClose}
                className={cn(
                  'absolute top-6 right-6 p-2 rounded-full transition-colors z-50',
                  variant === 'glass'
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'bg-white/80 backdrop-blur-sm text-slate-500 hover:bg-slate-100'
                )}
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            <div className="p-2 sm:p-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
