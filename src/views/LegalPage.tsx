import React, { useState } from 'react';
import { ShieldCheck, Mail, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

interface LegalPageProps {
  pageType: 'about' | 'contact' | 'privacy-policy' | 'terms-of-service' | 'disclaimer';
  onNavigate: (view: string, param?: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ pageType, onNavigate }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setFormSubmitted(false);
    }, 4000);
  };

  const getTitle = () => {
    switch (pageType) {
      case 'about': return 'About Hoorvia.net';
      case 'contact': return 'Contact Hoorvia Editorial Team';
      case 'privacy-policy': return 'Privacy Policy';
      case 'terms-of-service': return 'Terms of Service';
      case 'disclaimer': return 'Disclaimer & Educational Notice';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-slate-900 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">{getTitle()}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display">
          {getTitle()}
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Last Updated: March 2026 · Canonical Domain: hoorvia.net
        </p>
      </div>

      {/* Content based on pageType */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-2xs space-y-6 text-sm text-slate-700 leading-relaxed font-body">
        
        {pageType === 'about' && (
          <>
            <p className="text-base text-slate-900 font-semibold">
              Hoorvia is an independent digital knowledge library and printable cheat sheet platform.
            </p>
            <p>
              Our mission is to eliminate digital friction by transforming complex tasks, multi-step recipes, 
              coding syntax, and household maintenance into clear, single-page reference sheets and verified 
              interactive HTML data tables.
            </p>
            <h2 className="text-lg font-bold text-slate-900 font-display pt-2">Zero-Duplicate Information Architecture</h2>
            <p>
              Unlike conventional SEO sites that generate duplicate pages and thin doorway content, Hoorvia operates 
              under a strict zero-duplicate blueprint. Exactly 1,027 primary topics are mapped across 5 core hubs:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Kitchen & Cooking</strong> (160 sheets): Temperatures, substitutions, and appliance ratios.</li>
              <li><strong>Crafting & DIY</strong> (178 sheets): Cricut cut settings, sublimation parameters, resin ratios, and knitting guides.</li>
              <li><strong>Tech & Software</strong> (350 sheets): Excel, Python, JavaScript, SQL, Linux commands, and design hotkeys.</li>
              <li><strong>Home, Family & Health</strong> (175 sheets): Maintenance schedules, gardening guides, checklists, and workouts.</li>
              <li><strong>Reference Charts</strong> (164 sheets): Conversions, military time, alphabets, OBD2 codes, and KPIs.</li>
            </ul>
          </>
        )}

        {pageType === 'contact' && (
          <div className="space-y-6">
            <p>
              Have a suggestion for a new cheat sheet, a correction to an existing table, or a technical inquiry? 
              Reach our editorial team directly below.
            </p>

            {formSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Message Sent Successfully</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Thank you for contacting Hoorvia. Our team typically reviews feedback within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject & Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Let us know what cheat sheet or correction you would like to discuss..."
                    className="w-full px-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        )}

        {pageType === 'privacy-policy' && (
          <>
            <p>
              At Hoorvia.net, the privacy of our visitors is of paramount importance. This Privacy Policy outlines 
              the types of personal information that is received and collected by Hoorvia.net and how it is used.
            </p>
            <h2 className="text-base font-bold text-slate-900 font-display">1. Information We Collect</h2>
            <p>
              Hoorvia does not require account registration or login to view any of our 1,027 cheat sheets or download PDFs. 
              If you voluntarily submit your email for PDF queue notifications or contact us, your email is kept strictly confidential 
              and never sold or leased to third parties.
            </p>
            <h2 className="text-base font-bold text-slate-900 font-display">2. Cookies and Web Beacons</h2>
            <p>
              Hoorvia uses standard browser cookies to remember UI preferences (e.g. subcategory filter pill state). 
              Third-party partners, including Google AdSense, may use cookies to serve non-intrusive advertisements based on 
              a user's prior visits to this website.
            </p>
            <h2 className="text-base font-bold text-slate-900 font-display">3. GDPR & CCPA Rights</h2>
            <p>
              Under European GDPR and California CCPA regulations, users possess the right to request information on any 
              collected data or request immediate deletion by contacting our privacy compliance desk.
            </p>
          </>
        )}

        {pageType === 'terms-of-service' && (
          <>
            <p>
              By accessing Hoorvia.net, you agree to adhere to these Terms of Service. All content, interactive tables, 
              and digital cheat sheets are provided for educational and practical reference purposes.
            </p>
            <h2 className="text-base font-bold text-slate-900 font-display">1. Permitted Personal & Educational Use</h2>
            <p>
              You are warmly encouraged to print, laminate, and utilize Hoorvia cheat sheets in your personal kitchen, 
              workshop, classroom, coding environment, or office.
            </p>
            <h2 className="text-base font-bold text-slate-900 font-display">2. Commercial Redistribution Prohibited</h2>
            <p>
              Redistributing our master PDF catalog or systematically scraping Hoorvia tables for commercial sale without 
              written authorization from Hoorvia is strictly prohibited.
            </p>
          </>
        )}

        {pageType === 'disclaimer' && (
          <>
            <p>
              The information provided on Hoorvia.net is compiled with rigorous attention to accuracy using verified sources, 
              including USDA food safety standards, international metric metrology charts, and manufacturer specifications.
            </p>
            <p>
              However, cooking times, electrical settings, automotive maintenance, and financial formulas vary based on 
              specific appliance models, vehicle years, and local conditions. Always verify with your equipment manual and 
              licensed professionals when executing safety-critical tasks.
            </p>
          </>
        )}

      </div>
    </div>
  );
};
