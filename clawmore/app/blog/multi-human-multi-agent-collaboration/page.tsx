import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Multi-Human Multi-Agent Collaboration: The Future of Engineering',
  description:
    'Beyond simple automation. Discover how multi-human multi-agent collaboration (MH-MA) is redefining serverless infrastructure evolution and collective intelligence.',
  slug: 'multi-human-multi-agent-collaboration',
});

export default function BlogPost() {
  return <PostClient />;
}
