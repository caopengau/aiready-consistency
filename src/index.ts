import { ToolRegistry } from '@aiready/core';
import { ContextAnalyzerProvider } from './provider';

// Register with global registry
ToolRegistry.register(ContextAnalyzerProvider);

export * from './analyzer';
export * from './graph-builder';
export * from './metrics';
export * from './classifier';
export * from './cluster-detector';
export * from './remediation';
export * from './scoring';
export * from './defaults';
export * from './summary';
export * from './types';
export * from './semantic-analysis';
export { ContextAnalyzerProvider };
export * from './utils/output-formatter';
