'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Zap,
  RefreshCcw,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Terminal,
  Activity,
} from 'lucide-react';
import Modal from '../components/Modal';
import LeadForm from '../components/LeadForm';
import Navbar from '../components/Navbar';
import FAQ from '../components/FAQ';
import JsonLd from '../components/JsonLd';

interface ClawMoreClientProps {
  apiUrl: string;
  dict?: any;
}

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ClawMore',
  url: 'https://clawmore.ai',
  logo: 'https://clawmore.ai/logo.png',
  description:
    "Simple one-click OpenClaw deployment. The world's first autonomous agentic swarm for serverless AWS.",
  sameAs: ['https://github.com/caopengau/aiready-clawmore'],
};

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ClawMore',
  url: 'https://clawmore.ai',
  description:
    'Simple one-click OpenClaw deployment for serverless agentic swarm AI orchestration.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://clawmore.ai/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const SOFTWARE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ClawMore',
  description:
    'ClawMore: The first autonomous platform for Multi-Human Multi-Agent Collaboration on serverless AWS. Orchestrate autonomous agentic swarms with human-in-the-loop workflows.',
  applicationCategory: 'DevOpsApplication',
  operatingSystem: 'AWS',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Perpetual Evolution',
  },
};

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is ClawMore?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ClawMore is an autonomous platform that manages your AWS infrastructure and automatically improves your codebase. It monitors your system, detects issues, and applies fixes — so you can focus on building features.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the auto-fix system work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ClawMore runs a continuous loop: it scans your logs and performance data, identifies areas for improvement, generates a code fix using AI, and commits it to your repository. You review and approve every change.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it safe to connect my AWS account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. ClawMore runs in your own AWS account (BYOC), not ours. It uses strict permission boundaries that prevent it from accessing data outside your infrastructure. You maintain full control.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the $29/month include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your subscription includes managed infrastructure, a web dashboard, automated code improvements, CI/CD integration, and $10/month in AI credits for code fixes. You can cancel anytime.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I try it for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. The free tier includes our full analysis CLI, 3 repositories, and 10 scans per month. No credit card required. Upgrade when you are ready.',
      },
    },
  ],
};
export default function ClawMoreClient({ apiUrl, dict }: ClawMoreClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'beta' | 'waitlist'>('beta');

  const openModal = (type: 'beta' | 'waitlist') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Fallback to static strings if dict is not yet updated for everything
  const FAQ_ITEMS = [
    {
      question: 'What is ClawMore?',
      answer:
        'ClawMore is an AI-powered platform that automatically monitors, optimizes, and fixes your AWS infrastructure. It saves you time by handling routine maintenance and improvements so you can focus on building your product.',
    },
    {
      question: 'How does the auto-fix system work?',
      answer:
        'ClawMore continuously scans your infrastructure and code for issues. When it finds something that can be improved, it generates a fix using AI and creates a pull request for your review. You maintain full control - nothing is changed without your approval.',
    },
    {
      question: 'Is it safe to connect my AWS account?',
      answer:
        'Absolutely. ClawMore uses read-only permissions by default and follows the principle of least privilege. Your code and data stay in your AWS account. We never access your sensitive information, and you can revoke access at any time.',
    },
    {
      question: 'What does the $29/month Pro plan include?',
      answer:
        "The Pro plan includes unlimited repositories and scans, $10/month in AI credits for auto-fixes, priority support, and advanced monitoring. It's perfect for growing teams who want to automate their infrastructure management.",
    },
    {
      question: 'Can I try it for free?',
      answer:
        'Yes! We offer a free tier with 3 repositories and 10 scans per month - no credit card required. You can also start a 14-day free trial of our Pro plan to experience all features before committing.',
    },
    {
      question: "What happens if I'm not satisfied?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not completely satisfied with ClawMore within the first 30 days, we'll refund your payment in full - no questions asked.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-blue/30 selection:text-cyber-blue font-sans text-left">
      <JsonLd data={ORGANIZATION_JSON_LD} />
      <JsonLd data={WEBSITE_JSON_LD} />
      <JsonLd data={SOFTWARE_JSON_LD} />
      <JsonLd data={FAQ_JSON_LD} />
      <Navbar dict={dict} />

      <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/5 isolate py-14 sm:py-20">
        {/* Cinematic Background Image - STACKING FIX & MAXIMUM IMPACT */}
        <div className="absolute inset-0 -z-20 bg-[#0a0a0a]">
          <Image
            src="/hero.png"
            alt="Hero Background"
            fill
            className="object-cover blur-[0.5px] brightness-[0.9] saturate-[1.1]"
            priority
          />
          {/* Subtle Vignette to protect text while keeping edges vibrant */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(10,10,10,0.4)_40%,_#0a0a0a_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-black/30 opacity-70" />
        </div>

        {/* Global Diffuse Blur Layer for Text Legibility */}
        <div
          className="absolute inset-0 -z-10 backdrop-blur-[30px] bg-black/40 pointer-events-none"
          style={{
            maskImage:
              'radial-gradient(circle at center, black 0%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, black 0%, transparent 80%)',
          }}
        />

        <div className="container mx-auto px-4 relative flex flex-col items-center text-center -mt-8 sm:-mt-14 md:-mt-20">
          {/* Intensified Lighting Halo to lift content from background */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(0,224,255,0.3)_0%,_transparent_60%)] blur-[100px] opacity-70" />

          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-sm border border-cyber-blue/40 bg-cyber-blue/10 text-cyber-blue text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-12 shadow-[0_0_30px_rgba(0,224,255,0.15)] backdrop-blur-sm animate-current-flow">
            <Activity className="w-3 h-3" />
            <span>Automated AWS Management • AI-Powered Fixes</span>
          </div>

          {/* Cache-buster: v2-gradient */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 sm:mb-10 bg-gradient-to-r from-[#00e0ff] to-[#bc00ff] bg-clip-text text-transparent leading-[1.1] sm:leading-[1.1] pb-3 sm:pb-4 drop-shadow-[0_10px_60px_rgba(0,0,0,1)]">
            Your AWS Infrastructure
            <br />
            <span className="italic">Manages Itself</span>
          </h1>

          <p className="text-2xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-10 sm:mb-14 leading-relaxed font-light drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
            The world's first platform for{' '}
            <strong>Multi-Human Multi-Agent Collaboration</strong>. ClawMore
            automatically monitors, optimizes, and evolves your AWS
            infrastructure through autonomous agentic swarms.
          </p>

          <div className="w-full max-w-lg sm:max-w-none flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-8">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-sm bg-white text-black hover:bg-cyber-blue transition-all font-black uppercase tracking-widest flex items-center justify-center gap-3 group shadow-[0_0_50px_rgba(255,255,255,0.2)] text-center"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => openModal('beta')}
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-sm border border-white/20 bg-white/5 hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[13px] sm:text-[14px] backdrop-blur-md"
            >
              See Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* Lead Generation Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LeadForm
          type={modalType}
          onSuccess={closeModal}
          apiUrl={apiUrl}
          dict={dict}
        />
      </Modal>

      {/* Social Proof Section */}
      <section className="py-16 bg-black/20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black mb-4 tracking-tighter">
              Trusted by Development Teams
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Join hundreds of teams saving time and reducing costs with
              automated infrastructure management
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="text-zinc-500 font-bold text-lg">Startup A</div>
            <div className="text-zinc-500 font-bold text-lg">Agency B</div>
            <div className="text-zinc-500 font-bold text-lg">Enterprise C</div>
            <div className="text-zinc-500 font-bold text-lg">Team D</div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-black text-cyber-blue mb-2">
                500+
              </div>
              <div className="text-zinc-400 text-sm">Repositories Managed</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-black text-cyber-blue mb-2">
                10,000+
              </div>
              <div className="text-zinc-400 text-sm">Issues Auto-Fixed</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-black text-cyber-blue mb-2">
                50+
              </div>
              <div className="text-zinc-400 text-sm">
                Hours Saved Per Team Monthly
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section
        className="py-16 sm:py-24 relative scroll-mt-24 sm:scroll-mt-28"
        id="features"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent,_rgba(0,255,163,0.02),_transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tighter">
              How ClawMore Works For You
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Simple, automated infrastructure management that saves time and
              reduces costs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass-card p-6 sm:p-10 hover:border-cyber-blue/30 transition-all group">
              <div className="w-14 h-14 rounded-sm bg-cyber-blue/10 flex items-center justify-center text-cyber-blue mb-8 border border-cyber-blue/20 group-hover:scale-110 transition-transform">
                <RefreshCcw className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                Autonomous Monitoring
              </h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                24/7 monitoring of your AWS infrastructure. We detect issues
                before they become problems and fix them automatically.
              </p>
            </div>

            <div className="glass-card p-6 sm:p-10 hover:border-amber-500/30 transition-all group">
              <div className="w-14 h-14 rounded-sm bg-amber-500/10 flex items-center justify-center text-amber-400 mb-8 border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                Multi-Agent Swarms
              </h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                Deploy swarms of specialized agents that collaborate to solve
                complex architectural challenges and infrastructure evolution.
              </p>
            </div>

            <div className="glass-card p-6 sm:p-10 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 rounded-sm bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8 border border-purple-500/20 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                Human-Agent Interaction
              </h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                Bridge the gap with human-in-the-loop workflows. Multi-human
                multi-agent communication enables seamless collaborative
                engineering.
              </p>
            </div>

            <div className="glass-card p-6 sm:p-10 hover:border-cyber-purple/30 transition-all group">
              <div className="w-14 h-14 rounded-sm bg-cyber-purple/10 flex items-center justify-center text-cyber-purple mb-8 border border-cyber-purple/20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                Secure Evolution
              </h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                Your code stays in your account. We enforce serverless best
                practices and maintain security compliance automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evolution Loop Visual */}
      <section
        className="py-16 sm:py-24 bg-black/40 border-y border-white/5 relative overflow-hidden scroll-mt-24 sm:scroll-mt-28"
        id="evolution"
      >
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1">
              <div className="text-cyber-blue font-mono text-[10px] uppercase tracking-[0.4em] mb-4">
                {dict.evolution.visualizer}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8 tracking-tighter italic">
                {dict.evolution.title}
              </h2>
              <p className="text-zinc-400 mb-8 sm:mb-10 leading-relaxed text-base sm:text-lg font-light">
                {dict.evolution.desc}
              </p>

              <div className="space-y-4">
                {dict.evolution.steps.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-4 sm:gap-6 p-4 sm:p-5 rounded-sm border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="text-zinc-600 font-mono text-sm group-hover:text-cyber-blue transition-colors">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-1">{item.label}</div>
                      <div className="text-xs text-zinc-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative w-full aspect-square max-w-[550px] group">
              <div className="absolute inset-0 bg-cyber-blue/10 rounded-full blur-[100px] animate-pulse group-hover:bg-cyber-blue/20 transition-all" />
              <div className="relative h-full w-full rounded-sm border border-white/10 bg-[#060606] p-4 sm:p-8 font-mono text-[10px] sm:text-[11px] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyber-blue" />
                    <span className="text-white font-bold tracking-tighter uppercase">
                      {dict.evolution.logTitle}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-cyber-blue/50" />
                  </div>
                </div>
                <div className="space-y-3 leading-relaxed">
                  <div className="text-zinc-600 font-bold">
                    [01:14:16]{' '}
                    <span className="text-cyber-blue uppercase">
                      Node_Status:
                    </span>{' '}
                    {dict.evolution.logStatus}
                  </div>
                  <div className="text-zinc-600 font-bold">
                    [01:14:17]{' '}
                    <span className="text-purple-400 uppercase">Process:</span>{' '}
                    Scoped Gap Analysis initiated...
                  </div>
                  <div className="pl-4 text-zinc-500 italic">
                    {'>>'} {dict.evolution.logIdentify}
                  </div>
                  <div className="text-zinc-600 font-bold">
                    [01:14:22]{' '}
                    <span className="text-yellow-400 uppercase">Action:</span>{' '}
                    Synthesizing patch v4.2.9
                  </div>
                  <div className="text-zinc-600 font-bold">
                    [01:14:35]{' '}
                    <span className="text-white uppercase">Ops:</span> Mutation
                    in progress (infra/limits.ts)
                  </div>
                  <div className="text-zinc-600 font-bold">
                    [01:15:02]{' '}
                    <span className="text-cyber-blue uppercase">Sync:</span>{' '}
                    Committing success to origin/main
                  </div>

                  <div className="mt-8 p-4 bg-cyber-blue/5 rounded-sm border border-cyber-blue/20 text-cyber-blue text-[10px] relative overflow-hidden group-hover:border-cyber-blue/40 transition-all">
                    <div className="absolute top-0 right-0 p-1 opacity-20">
                      <Zap size={40} />
                    </div>
                    <div className="font-black mb-1 text-white underline decoration-cyber-blue decoration-2 underline-offset-4">
                      {dict.evolution.mutVerified}
                    </div>
                    <div>{dict.evolution.mutAdded}</div>
                    <div className="text-[8px] opacity-60 mt-2">
                      HASH: 5086da9f3c6d8e2d494195...
                    </div>
                  </div>
                </div>
                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="py-20 sm:py-32 scroll-mt-24 sm:scroll-mt-28"
        id="pricing"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 tracking-tighter">
              Simple, Transparent Pricing
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="glass-card p-6 sm:p-8 flex flex-col border-white/10 hover:border-white/20 transition-all">
              <div className="mb-8">
                <h4 className="text-zinc-400 font-mono text-xs uppercase tracking-widest font-black mb-2">
                  Free
                </h4>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  $0
                  <span className="text-xl font-normal text-zinc-500">
                    /month
                  </span>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase mt-3 tracking-tighter font-bold">
                  Perfect for trying out ClawMore
                </p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <Zap className="w-4 h-4 text-zinc-400 shrink-0" /> 3
                  repositories
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <Zap className="w-4 h-4 text-zinc-400 shrink-0" /> 10 scans
                  per month
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <Zap className="w-4 h-4 text-zinc-400 shrink-0" /> Basic
                  reporting
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <Zap className="w-4 h-4 text-zinc-400 shrink-0" /> Community
                  support
                </li>
              </ul>
              <Link
                href="/signup"
                className="w-full py-4 rounded-sm bg-white hover:bg-zinc-200 transition-all text-black text-xs font-black uppercase text-center tracking-widest"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Tier - MOST POPULAR */}
            <div className="glass-card p-6 sm:p-8 border-cyber-blue/30 bg-cyber-blue/[0.03] relative flex flex-col hover:border-cyber-blue/50 transition-all shadow-[0_0_80px_rgba(0,224,255,0.08)]">
              <div className="absolute top-0 right-4 sm:right-8 -translate-y-1/2 px-3 py-1.5 rounded-sm bg-cyber-blue text-black text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,224,255,0.3)] z-10">
                Most Popular
              </div>
              <div className="mb-8">
                <h4 className="text-cyber-blue font-mono text-xs uppercase tracking-widest font-black mb-2">
                  Pro
                </h4>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  $29
                  <span className="text-xl font-normal text-zinc-500">
                    /month
                  </span>
                </div>
                <p className="text-[10px] font-mono text-cyber-blue uppercase mt-3 tracking-tighter font-bold">
                  For growing teams and projects
                </p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <Zap className="w-4 h-4 text-cyber-blue shrink-0" /> Unlimited
                  repositories
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <Zap className="w-4 h-4 text-cyber-blue shrink-0" /> Unlimited
                  scans
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <Zap className="w-4 h-4 text-cyber-blue shrink-0" /> $10/month
                  AI credits
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <Zap className="w-4 h-4 text-cyber-blue shrink-0" /> Auto-fix
                  capabilities
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <Zap className="w-4 h-4 text-cyber-blue shrink-0" /> Priority
                  support
                </li>
              </ul>
              <Link
                href="/signup"
                className="w-full py-4 rounded-sm bg-cyber-blue hover:bg-cyber-blue/90 transition-all text-black text-xs font-black uppercase text-center tracking-widest shadow-[0_0_25px_rgba(0,224,255,0.2)]"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Team Tier */}
            <div className="glass-card p-6 sm:p-8 flex flex-col border-amber-500/20 bg-amber-500/[0.02] hover:border-amber-500/40 transition-all">
              <div className="mb-8">
                <h4 className="text-amber-400 font-mono text-xs uppercase tracking-widest font-black mb-2">
                  Team
                </h4>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  $99
                  <span className="text-xl font-normal text-zinc-500">
                    /month
                  </span>
                </div>
                <p className="text-[10px] font-mono text-amber-400/70 uppercase mt-3 tracking-tighter font-bold">
                  For enterprises and large teams
                </p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />{' '}
                  Everything in Pro
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />{' '}
                  SSO integration
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />{' '}
                  Audit logs
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />{' '}
                  Custom integrations
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-100">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />{' '}
                  Dedicated support
                </li>
              </ul>
              <Link
                href="/signup"
                className="w-full py-4 rounded-sm bg-amber-500 hover:bg-amber-400 transition-all text-black text-xs font-black uppercase text-center tracking-widest"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="mt-12 sm:mt-20 glass-card p-6 sm:p-10 max-w-2xl mx-auto border-emerald-500/20 bg-emerald-500/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h5 className="font-mono text-xs font-black uppercase tracking-[0.4em] text-emerald-400">
                30-Day Money-Back Guarantee
              </h5>
            </div>
            <p className="text-sm text-zinc-400 font-mono leading-relaxed tracking-tight">
              Try ClawMore risk-free. If you're not satisfied within 30 days,
              we'll refund your payment in full. No questions asked.
            </p>
          </div>
        </div>
      </section>

      <FAQ items={FAQ_ITEMS} title="Frequently Asked Questions" />

      {/* Footer */}
      <footer className="py-14 sm:py-20 border-t border-white/5 bg-black/40">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <Image
              src="/logo.png"
              alt="ClawMore Logo"
              width={32}
              height={32}
              className="rounded-sm opacity-80"
            />
            <span className="font-black text-xl tracking-tighter italic glow-text">
              ClawMore
            </span>
          </div>
          <div className="flex items-center justify-center gap-6 mb-8">
            <Link
              href="/terms"
              className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <a
              href="mailto:support@getaiready.dev"
              className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Support
            </a>
          </div>
          <div className="text-zinc-500 text-sm">
            {dict.footer.ecosystem}{' '}
            <Link
              href="https://getaiready.dev"
              className="text-zinc-400 hover:text-cyber-blue transition-colors underline decoration-white/10 underline-offset-4"
            >
              AIReady Ecosystem
            </Link>{' '}
            neural network.
            <div className="mt-4 text-xs text-zinc-600">
              {dict.footer.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
