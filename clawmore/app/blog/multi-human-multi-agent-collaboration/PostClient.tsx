'use client';

import { useState } from 'react';
import {
  Clock,
  Hash,
  Zap,
  Users,
  Cpu,
  ShieldCheck,
  MessageSquare,
  Network,
} from 'lucide-react';
import Modal from '../../../components/Modal';
import LeadForm from '../../../components/LeadForm';
import Navbar from '../../../components/Navbar';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';
import Link from 'next/link';

export default function BlogPost() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const apiUrl = process.env.NEXT_PUBLIC_LEAD_API_URL || '';

  const BLOG_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline:
      'Multi-Human Multi-Agent Collaboration: The Future of Engineering',
    description:
      'Discover how multi-human multi-agent collaboration (MH-MA) is redefining serverless infrastructure evolution and collective intelligence.',
    datePublished: '2026-03-29',
    author: {
      '@type': 'Organization',
      name: 'ClawMore Team',
    },
    image: '/blog-assets/multi-human-multi-agent-collaboration.png',
    url: '/blog/multi-human-multi-agent-collaboration',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyber-blue/30 selection:text-cyber-blue font-sans text-left">
      <JsonLd data={BLOG_JSON_LD} />
      <Navbar variant="post" />

      <header className="py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(0,224,255,0.05)_0%,_transparent_70%)] opacity-30" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-cyber-blue font-mono text-[9px] uppercase tracking-[0.4em] font-black border border-cyber-blue/20 px-2 py-1 bg-cyber-blue/5">
                MH_MA_PROTOCOL
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Hash className="w-3 h-3" />
                <span>HASH: collaborative-evolution</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>08 MIN READ</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 italic uppercase leading-[1.1]">
              Multi-Human <span className="text-cyber-blue">Multi-Agent</span>{' '}
              Collaboration
            </h1>

            <p className="text-xl text-zinc-200 font-light leading-relaxed italic max-w-2xl mx-auto">
              Engineering is no longer a solitary act. It is a symphony of human
              intuition and agentic precision. Welcome to the era of MH-MA.
            </p>

            <div className="mt-12 bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative group max-w-4xl mx-auto">
              <img
                src="/blog-assets/multi-human-multi-agent-collaboration.png"
                alt="Multi-Human Multi-Agent Collaboration: The Future of Engineering"
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>
        </div>
      </header>

      <main className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs
              items={[
                { label: 'BLOG', href: '/blog' },
                {
                  label: 'MH-MA COLLABORATION',
                  href: '/blog/multi-human-multi-agent-collaboration',
                },
              ]}
            />

            <article className="prose prose-invert prose-zinc max-w-none">
              <section className="mt-12">
                <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4 italic uppercase">
                  <span className="text-cyber-blue font-mono text-sm not-italic border-b border-cyber-blue/30">
                    01
                  </span>
                  Beyond Simple Automation
                </h2>
                <p className="text-zinc-200 leading-relaxed text-lg">
                  For years, the goal of AI in DevOps was simple automation: "Do
                  X when Y happens." But as systems grow in complexity, simple
                  triggers are no longer enough. We need systems that can
                  reason, collaborate, and evolve. This is where{' '}
                  <strong>Multi-Human Multi-Agent (MH-MA)</strong> collaboration
                  comes in.
                </p>
                <p className="text-zinc-200 leading-relaxed text-lg mt-4">
                  MH-MA is the orchestration of multiple human stakeholders and
                  multiple autonomous AI agents working towards a shared
                  objective. In the context of ClawMore, this means your
                  infrastructure is managed by a swarm of specialized agents
                  that communicate not just with each other, but with your
                  entire team.
                </p>
              </section>

              <section className="mt-16">
                <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4 italic uppercase">
                  <span className="text-cyber-blue font-mono text-sm not-italic border-b border-cyber-blue/30">
                    02
                  </span>
                  The MH-MA Stack
                </h2>
                <p className="text-zinc-200 leading-relaxed text-lg">
                  Effective MH-MA collaboration requires three core pillars:
                </p>
                <div className="grid md:grid-cols-3 gap-6 my-10">
                  <div className="p-6 bg-zinc-900 border border-white/5 rounded-sm">
                    <MessageSquare className="w-6 h-6 text-cyber-blue mb-4" />
                    <h4 className="font-black text-sm uppercase mb-2">
                      Universal Communication
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Agents and humans share a unified communication bus (via
                      EventBridge and Discord/Slack), ensuring everyone is in
                      the loop.
                    </p>
                  </div>
                  <div className="p-6 bg-zinc-900 border border-white/5 rounded-sm">
                    <Cpu className="w-6 h-6 text-purple-400 mb-4" />
                    <h4 className="font-black text-sm uppercase mb-2">
                      Task Decomposition
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Complex goals are broken down by "Architect Agents" and
                      assigned to "Worker Agents," with human oversight at
                      critical junctions.
                    </p>
                  </div>
                  <div className="p-6 bg-zinc-900 border border-white/5 rounded-sm">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 mb-4" />
                    <h4 className="font-black text-sm uppercase mb-2">
                      Consensus Protocols
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Major architectural shifts require consensus among agents
                      and explicit approval from human leads.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-16">
                <h2 className="text-3xl font-black tracking-tight mb-6 flex items-center gap-4 italic uppercase">
                  <span className="text-cyber-blue font-mono text-sm not-italic border-b border-cyber-blue/30">
                    03
                  </span>
                  Human-in-the-Loop: The Critical Edge
                </h2>
                <p className="text-zinc-200 leading-relaxed text-lg">
                  The "Multi-Human" aspect is what separates a reckless script
                  from a professional managed evolution. In the ClawMore
                  ecosystem, humans act as{' '}
                  <strong>Curators of Evolution</strong>. Agents propose
                  mutations, provide the rationale (via the "Reflector"
                  protocol), and wait for human validation when the blast radius
                  exceeds safe thresholds.
                </p>
                <ul className="list-none space-y-4 my-8">
                  <li className="flex gap-4 items-center">
                    <Zap className="w-5 h-5 text-cyber-blue" />
                    <span className="text-lg">
                      <strong>Collaborative Debugging</strong>: Agents identify
                      root causes and humans provide the strategic direction for
                      the fix.
                    </span>
                  </li>
                  <li className="flex gap-4 items-center">
                    <Users className="w-5 h-5 text-cyber-blue" />
                    <span className="text-lg">
                      <strong>Collective Wisdom</strong>: Patterns harvested
                      from one human-agent pair benefit the entire organization.
                    </span>
                  </li>
                </ul>
              </section>

              <div className="mt-20 p-10 bg-cyber-blue text-black rounded-3xl text-center group">
                <Network className="w-12 h-12 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-3xl font-black mb-4 uppercase italic">
                  Evolve Your Team
                </h3>
                <p className="font-medium mb-8">
                  Experience the power of Multi-Human Multi-Agent Collaboration
                  today.
                </p>
                <Link
                  href="/signup"
                  className="inline-block py-3 px-8 bg-black text-white font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Start Your Swarm
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>

      <footer className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center text-zinc-700 text-[10px] font-mono uppercase tracking-[0.5em]">
          COLLABORATION_ACTIVE // 2026 MH_MA_LOG
        </div>
      </footer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <LeadForm type="waitlist" onSuccess={closeModal} apiUrl={apiUrl} />
      </Modal>
    </div>
  );
}
