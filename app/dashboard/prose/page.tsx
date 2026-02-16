'use client';

import { useState } from 'react';
import Link from 'next/link';
import { streamLLM, TaskType } from '@/lib/multiLLM';
// DashboardShell is provided by the layout

interface GuideStep {
  id: string;
  title: string;
  description: string;
  resources: string[];
  forms: string[];
  tips: string[];
}

const CASE_TYPES = [
  {
    id: 'small-claims',
    name: 'Small Claims Court',
    icon: '💰',
    description: 'Disputes under $10,000 (NYC) or $5,000 (other NY courts)',
    difficulty: 'Beginner-friendly',
    guides: [
      { step: 1, title: 'Determine if Small Claims is Right', content: 'Small claims court is for money disputes only. You cannot get an order to make someone do something (like return property) - only money damages.' },
      { step: 2, title: 'Gather Your Evidence', content: 'Collect all contracts, receipts, photos, text messages, and emails. Make 3 copies of everything.' },
      { step: 3, title: 'File Your Claim', content: 'Go to the clerk\'s office at your local courthouse. Filing fee is $15-$20. You\'ll get a hearing date.' },
      { step: 4, title: 'Serve the Defendant', content: 'The court will mail notice to the defendant, or you can use certified mail or a process server.' },
      { step: 5, title: 'Prepare for Your Hearing', content: 'Organize your evidence chronologically. Practice explaining your case in 5 minutes or less.' },
      { step: 6, title: 'Attend the Hearing', content: 'Arrive early. Dress professionally. Speak clearly and respectfully to the judge. Stick to facts, not emotions.' },
    ]
  },
  {
    id: 'housing',
    name: 'Housing Court (Tenant)',
    icon: '🏠',
    description: 'Eviction defense, repairs, security deposits',
    difficulty: 'Moderate',
    guides: [
      { step: 1, title: 'Respond to the Petition', content: 'You have limited time to respond. In NYC, answer within 10 days of being served. File your answer with the clerk.' },
      { step: 2, title: 'Know Your Defenses', content: 'Common defenses: improper service, rent was paid, landlord failed to maintain (warranty of habitability), retaliation, discrimination.' },
      { step: 3, title: 'Document Everything', content: 'Photos of conditions, repair requests (keep copies), rent receipts, communications with landlord.' },
      { step: 4, title: 'Request Repairs HP Action', content: 'If conditions are bad, file an HP proceeding to force repairs. This can be combined with your eviction defense.' },
      { step: 5, title: 'Attend All Court Dates', content: 'Missing court = default judgment against you = eviction. Always go, even if you think you\'ll lose.' },
      { step: 6, title: 'Negotiate a Settlement', content: 'Most cases settle. You might get more time to move, rent reduction, or repairs in exchange for moving out.' },
    ]
  },
  {
    id: 'family',
    name: 'Family Court',
    icon: '👨‍👩‍👧',
    description: 'Custody, child support, orders of protection',
    difficulty: 'Complex - Consider getting a lawyer',
    guides: [
      { step: 1, title: 'File a Petition', content: 'Go to Family Court clerk. Get the right form: custody (Form 6-1), support (Form 4-1), or protection order (Form 2).' },
      { step: 2, title: 'Understand "Best Interests"', content: 'Courts decide custody based on the child\'s best interests. Factors: stability, each parent\'s involvement, child\'s preferences (if old enough), safety.' },
      { step: 3, title: 'Gather Documentation', content: 'School records, medical records, photos, calendar of time with children, witnesses who can speak to your parenting.' },
      { step: 4, title: 'Prepare for Court Appearances', content: 'Family Court often has multiple appearances. First is usually to set a schedule and see if you can agree.' },
      { step: 5, title: 'Consider Mediation', content: 'Free mediation is often available. It\'s faster and less adversarial than trial.' },
      { step: 6, title: 'Follow Court Orders Exactly', content: 'Once there\'s an order, follow it precisely. Violations can result in contempt charges.' },
    ]
  },
  {
    id: 'traffic',
    name: 'Traffic Violations Bureau',
    icon: '🚗',
    description: 'Speeding tickets, parking tickets, license issues',
    difficulty: 'Beginner-friendly',
    guides: [
      { step: 1, title: 'Decide Whether to Fight', content: 'Check the points: 1-2 points might not be worth fighting. 4+ points could raise insurance significantly.' },
      { step: 2, title: 'Request a Hearing', content: 'Plead "Not Guilty" by mail or online. You\'ll get a hearing date.' },
      { step: 3, title: 'Gather Evidence', content: 'Get the officer\'s notes (request supporting deposition). Check for errors on the ticket. Get photos of the location.' },
      { step: 4, title: 'Prepare Your Defense', content: 'Common defenses: unclear signage, radar calibration issues, emergency circumstances, mistaken identity.' },
      { step: 5, title: 'Attend the Hearing', content: 'Officer must appear. If they don\'t, you may win by default. Cross-examine the officer politely.' },
      { step: 6, title: 'Consider Plea Bargaining', content: 'Prosecutors often reduce charges. A 4-point speeding ticket might become a 0-point parking ticket.' },
    ]
  },
  {
    id: 'consumer',
    name: 'Consumer Disputes',
    icon: '🛒',
    description: 'Debt collection, credit issues, scams',
    difficulty: 'Moderate',
    guides: [
      { step: 1, title: 'Validate the Debt', content: 'If sued by a debt collector, request debt validation within 30 days. They must prove they own the debt and the amount is correct.' },
      { step: 2, title: 'Check the Statute of Limitations', content: 'In NY, most debts have a 6-year limit. If the debt is too old, that\'s a complete defense.' },
      { step: 3, title: 'Respond to the Lawsuit', content: 'File an answer! If you don\'t respond, you\'ll get a default judgment. Deny what you don\'t know and raise defenses.' },
      { step: 4, title: 'Request Discovery', content: 'Ask for the original contract, payment history, and chain of ownership. Many collectors can\'t produce these.' },
      { step: 5, title: 'Negotiate a Settlement', content: 'Collectors often settle for 30-50% of the balance. Get any agreement in writing before paying.' },
      { step: 6, title: 'Know Your Rights', content: 'Fair Debt Collection Practices Act protects you. Collectors cannot harass, lie, or threaten you.' },
    ]
  },
  {
    id: 'name-change',
    name: 'Name Change',
    icon: '📝',
    description: 'Legal name change petition',
    difficulty: 'Straightforward',
    guides: [
      { step: 1, title: 'Get the Forms', content: 'Download from NY Courts website or get from County Clerk. Need petition, affidavit, and proposed order.' },
      { step: 2, title: 'Complete the Petition', content: 'List your current name, proposed new name, reason for change, and required background info.' },
      { step: 3, title: 'File with the Court', content: 'File in Supreme Court of your county. Filing fee is approximately $210.' },
      { step: 4, title: 'Publish in Newspaper', content: 'Court will specify which newspaper. Cost varies ($50-$150). Required for 4 weeks.' },
      { step: 5, title: 'Attend Court Date', content: 'Usually a brief appearance. Judge will ask about your reasons. Be honest and straightforward.' },
      { step: 6, title: 'Update Your Documents', content: 'Once approved, update: Social Security, DMV, passport, banks, employer, etc. Get certified copies of the order.' },
    ]
  }
];

const RESOURCES = [
  {
    name: 'NY Courts Self-Help',
    url: 'https://nycourts.gov/courthelp/',
    description: 'Official NY court forms and guides'
  },
  {
    name: 'LawHelp NY',
    url: 'https://www.lawhelpny.org/',
    description: 'Free legal information and referrals'
  },
  {
    name: 'Legal Aid Society',
    url: 'https://legalaidnyc.org/',
    description: 'Free legal help for qualifying New Yorkers'
  },
  {
    name: 'NYC Bar Legal Referral',
    url: 'https://www.nycbar.org/get-legal-help/',
    description: 'Low-cost legal consultations'
  },
  {
    name: 'Court Navigator Program',
    url: 'https://nycourts.gov/courts/nyc/housing/rap.shtml',
    description: 'Free help in Housing Court'
  }
];

export default function ProSePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedCase = CASE_TYPES.find(c => c.id === selectedType);

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setAnswer('');
    
    try {
      const systemPrompt = `You are a helpful, empathetic legal guide for pro se litigants in New York. 
          Your goal is to explain legal concepts simply, without jargon. 
          Always clarify that you are not a lawyer and this is information, not advice.
          Structure your answer with: **Key Points**, **Next Steps**, and **Resources**.
          Context: The user is asking about ${selectedType || 'general legal issues'}.`;

      let content = '';
      
      await streamLLM('cerebras', [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ], (chunk) => {
        content += chunk;
        setAnswer(prev => prev + chunk);
      }, { task: 'chat' as TaskType });

    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('**Error:** I having trouble connecting to the legal helper right now. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">🆓 Pro Se Help Center</h1>
          <p className="opacity-90">
            Representing yourself in court? We'll help you understand the process, 
            find the right forms, and know what to expect.
          </p>
          <div className="mt-4 p-3 bg-white/20 rounded-lg">
            <p className="text-sm">
              <strong>⚠️ Important:</strong> This tool provides general information, 
              not legal advice. For complex cases, consider consulting with an attorney.
              <a href="https://www.lawhelpny.org/" target="_blank" rel="noopener noreferrer" 
                 className="underline ml-1">Find free legal help →</a>
            </p>
          </div>
        </div>

        {/* Case Type Selection */}
        {!selectedType && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">What type of case do you have?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CASE_TYPES.map(caseType => (
                <button
                  key={caseType.id}
                  onClick={() => setSelectedType(caseType.id)}
                  className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
                >
                  <div className="text-3xl mb-2">{caseType.icon}</div>
                  <h3 className="font-semibold text-gray-900">{caseType.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{caseType.description}</p>
                  <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                    caseType.difficulty === 'Beginner-friendly' 
                      ? 'bg-green-100 text-green-700'
                      : caseType.difficulty === 'Moderate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {caseType.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Case Guide */}
        {selectedCase && (
          <div className="space-y-6">
            <button
              onClick={() => { setSelectedType(null); setCurrentStep(0); }}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to case types
            </button>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCase.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCase.name}</h2>
                    <p className="text-gray-600">{selectedCase.description}</p>
                  </div>
                </div>
                <Link 
                  href={`/dashboard/cases?new=${selectedCase.id}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
                >
                  Start This Case →
                </Link>
              </div>

              {/* Progress Steps */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Your Roadmap</h3>
                  <span className="text-sm text-gray-600">
                    Step {currentStep + 1} of {selectedCase.guides.length}
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedCase.guides.map((guide, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        index === currentStep
                          ? 'bg-blue-600 text-white'
                          : index < currentStep
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index < currentStep ? '✓' : index + 1}. {guide.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Step Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Step {currentStep + 1}: {selectedCase.guides[currentStep].title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedCase.guides[currentStep].content}
                </p>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(selectedCase.guides.length - 1, currentStep + 1))}
                    disabled={currentStep === selectedCase.guides.length - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ask a Question */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">💬 Ask a Question</h2>
          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Describe your situation. Be specific about what happened and what you want to achieve..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <button
              onClick={askQuestion}
              disabled={isLoading || !question.trim()}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? 'Thinking...' : 'Get Help'}
            </button>
          </div>

          {answer && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="prose prose-sm max-w-none">
                {answer.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('**') ? 'font-semibold' : ''}>
                    {line.replace(/\*\*/g, '')}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">📚 Free Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESOURCES.map(resource => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-medium text-blue-600">{resource.name} →</h3>
                <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-800 mb-2">⚖️ When to Get a Lawyer</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Criminal charges (you have a right to a free lawyer if you can't afford one)</li>
            <li>• Child custody disputes where abuse or relocation is involved</li>
            <li>• Lawsuits over $25,000</li>
            <li>• Immigration matters (deportation consequences)</li>
            <li>• When the other side has a lawyer and you're feeling overwhelmed</li>
          </ul>
          <a 
            href="https://www.lawhelpny.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-3 text-amber-800 underline font-medium"
          >
            Find free or low-cost legal help in NY →
          </a>
        </div>
      </div>
  );
}
