
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Search, MessageSquare, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-slate-50 pt-16 pb-24 lg:pt-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
           <div className="absolute top-20 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
           <div className="absolute top-20 right-0 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
           <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8 border border-blue-100">
            <Zap size={14} />
            <span>Context v2.0 • Gemini 3 Flash</span>
          </div>
          <h1 className="text-display-2xl text-5xl md:text-8xl mb-6">
            Your Second Brain <br />
            <span className="gradient-text">for the Web</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium mb-10 leading-relaxed">
            Automatically capture, organize, and chat with your digital universe. 
            Transform browsing into a permanent, searchable intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-10 py-5 premium-gradient text-white rounded-2xl font-bold shadow-2xl shadow-blue-200 hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg">
              Start Building Your Brain
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display-xl text-4xl mb-4">Master Your Digital Knowledge</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Powerful semantic tools designed to help you capture and recall information instantly.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Search className="text-blue-600" />, title: "Semantic Search", desc: "Search by intent and concept, not just keywords. Find 'that article about async hooks' naturally." },
              { icon: <MessageSquare className="text-cyan-600" />, title: "Chat with Memories", desc: "Query your personal library. 'Summarize the three key points from the crypto report I saved last week.'" },
              { icon: <ShieldCheck className="text-slate-600" />, title: "Private & Secure", desc: "Your second brain is sovereign. Encrypted, private, and entirely under your control." }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 hover:border-blue-200 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-8">{f.icon}</div>
                <h3 className="text-display-xl text-2xl mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="premium-gradient rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-3xl">
            <div className="relative z-10">
              <h2 className="text-display-2xl text-5xl mb-8">Upgrade your memory today.</h2>
              <p className="text-blue-100 font-medium text-xl mb-12 max-w-xl mx-auto opacity-90">Join 50,000+ creators and researchers organizing their digital life with Context.</p>
              <Link to="/register" className="inline-flex items-center gap-3 px-12 py-6 bg-white text-slate-900 rounded-[2rem] font-bold text-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                Get Started for Free
                <ArrowRight size={24} />
              </Link>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
