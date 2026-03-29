import { Metadata } from 'next';
import { headers } from 'next/headers';
import ClawMoreClient from './ClawMoreClient';
import { getDictionary } from '../lib/get-dictionary';

export const metadata: Metadata = {
  title: 'ClawMore | Multi-Human Multi-Agent Collaboration for AWS',
  description:
    "ClawMore: The world's first autonomous system for Multi-Human Multi-Agent Collaboration on AWS. Real-time infrastructure synthesis, self-healing, and human-in-the-loop agentic swarms.",
  openGraph: {
    title: 'ClawMore | Multi-Human Multi-Agent Collaboration for AWS',
    description:
      "The world's first autonomous system for Multi-Human Multi-Agent Collaboration on AWS. Real-time infrastructure synthesis and agentic swarming.",
    url: 'https://clawmore.ai',
    siteName: 'ClawMore',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'ClawMore - Multi-Human Multi-Agent Collaboration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClawMore | Multi-Human Multi-Agent Collaboration for AWS',
    description:
      "The world's first autonomous system for Multi-Human Multi-Agent Collaboration on AWS. Real-time infrastructure synthesis and agentic swarming.",
    creator: '@clawmore',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://clawmore.ai',
  },
};

export default async function ClawMorePage() {
  const headerList = await headers();
  const locale = headerList.get('X-NEXT-LOCALE') || 'en';
  const dictionary = await getDictionary(locale);
  // Use environment variable which SST correctly injects at runtime
  const apiUrl = process.env.LEAD_API_URL || '';

  return <ClawMoreClient apiUrl={apiUrl} dict={dictionary} />;
}
