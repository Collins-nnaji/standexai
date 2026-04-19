"use client";



import Link from 'next/link';

const CloudAICourse = () => {
  const course = {
    id: 'ai-practitioner',
    title: 'Standex Certified Artificial Intelligence Practitioner (CAIP)',
    description: 'Apply AI end-to-end: strategy, use-case selection, data readiness, ML and GenAI fundamentals, deployment, governance, security, ethics, and ROI—culminating in a capstone project.',
    image: '/ArtificialIntelligence.png',
    enrollLink: 'https://buy.stripe.com/bIYaGJeDe0X47gQ5kn',
    duration: '12 weeks (part-time)',
    format: 'Online',
    topics: [
      {
        title: 'Module 1: Machine Learning & Generative AI (Foundations to Application)',
        items: [
          'Foundations of AI: what AI is (and is not), AI vs ML vs DL, enterprise use cases, AI maturity models',
          'Machine learning concepts: supervised vs unsupervised, training vs inference, evaluation trade-offs, explainability basics',
          'Generative AI and assistants: LLMs explained, prompt engineering for workflows, knowledge assistants/chatbots, managing hallucinations and reliability risks',
          'Measuring AI performance and value: business KPIs vs model metrics, effectiveness and outcomes, cost–benefit analysis, continuous improvement'
        ]
      },
      {
        title: 'Module 2: AI Systems, Architectures, and Agents',
        items: [
          'Identifying high-impact AI use cases: discovery frameworks, problem framing, feasibility and risk, prioritising initiatives for value',
          'Data strategy and readiness: structured vs unstructured data, quality/bias/governance, access/security/compliance',
          'Designing AI systems: architecture fundamentals, model-centric vs platform-centric, build vs buy, integrating into existing systems',
          'AI systems, agents, and deployment: AI development lifecycle, agents and autonomous workflows, cloud/on-prem/hybrid, MLOps fundamentals, monitoring and optimisation'
        ]
      },
      {
        title: 'Module 3: AI Governance, Ethics, and Enterprise Risk',
        items: [
          'AI governance and compliance: governance frameworks, regulatory considerations (e.g. GDPR), risk classification and controls, human-in-the-loop systems',
          'Responsible and ethical AI: bias, fairness, transparency, ethical design principles, trustworthy systems, managing sensitive data',
          'AI security and protection: threats to AI systems, data leakage and misuse, securing APIs/models, enterprise security best practices',
          'Capstone: applied AI in practice—use-case justification and solution design, architecture and governance plan, risk controls and compliance, value and ROI assessment'
        ]
      }
    ],
    benefits: [
      'Certification: Certified Artificial Intelligence Practitioner (CAIP)',
      'Applied capstone with enterprise-grade deliverables',
      'Governance, risk, and compliance baked into every stage',
      'Hands-on with ML, GenAI, security, and monitoring practices',
      'Career-focused portfolio to showcase AI solutions'
    ],
    audience: 'Professionals and leaders building, governing, or productizing AI solutions who need a practical, end-to-end view from use-case selection to deployment and ROI.',
    tagline: 'Design, deploy, and govern AI responsibly with enterprise-grade rigor'
  };

  return (
    <div className='overflow-x-hidden min-h-screen flex flex-col'>
      
      <div className="bg-zinc-950 pt-24 pb-16 px-4 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href="/Training"
              className="inline-flex items-center gap-2 text-[#7C5CFC] hover:text-[#6B4FE0] transition-colors duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Training Courses</span>
            </Link>
          </div>

          {/* Course Header */}
          <div className="mb-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="sm:w-1/4">
              <div className="bg-[#7C5CFC] rounded-full p-4 inline-flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="sm:w-3/4 text-center sm:text-left">
              <p className="text-zinc-400 text-sm mb-2">StandEx Digital - Standex Digital Training</p>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">{course.title}</h1>
              <h2 className="text-xl text-[#7C5CFC]">{course.tagline}</h2>
            </div>
          </div>

          {/* Course Image */}
          <div className="mb-8">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Course Description */}
          <div className="mb-8">
            <p className="text-zinc-400 text-lg leading-relaxed">{course.description}</p>
          </div>
          
          {/* Course Duration */}
          <div className="mb-8 bg-zinc-900 p-6 rounded-lg flex flex-col sm:flex-row gap-6">
            <div className="flex items-center gap-3 text-[#7C5CFC] font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Duration: {course.duration}</span>
            </div>
            <div className="flex items-center gap-3 text-[#7C5CFC] font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Format: {course.format}</span>
            </div>
          </div>
          
          {/* Course Content */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white tracking-tight mb-6">Course Content</h3>
            <div className="space-y-6">
              {course.topics.map((topic, index) => (
                <div key={index} className="bg-zinc-900 p-6 rounded-lg">
                  <h4 className="text-[#7C5CFC] font-semibold text-lg mb-3">{topic.title}</h4>
                  <ul className="list-disc pl-6 text-zinc-400 space-y-2">
                    {topic.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          {/* Who Should Attend */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white tracking-tight mb-4">Who Should Attend</h3>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <p className="text-zinc-400 text-lg">{course.audience}</p>
            </div>
          </div>
          
          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white tracking-tight mb-4">Benefits</h3>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <ul className="list-disc pl-6 text-zinc-400 space-y-3 text-lg">
                {course.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Microsoft Partner */}
          <div className="mb-8 bg-zinc-900 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="40" height="40">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                  <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
                  <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
                  <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
                </svg>
              </div>
              <div>
                <p className="text-white text-lg font-black tracking-tight">Microsoft Learning Partner</p>
                <p className="text-zinc-400">Official Microsoft training and certification preparation</p>
              </div>
            </div>
          </div>
          
          {/* Enroll Button */}
          <div className="mb-8">
            <a 
              href={course.enrollLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-md mx-auto bg-[#7C5CFC] hover:bg-[#6B4FE0] text-white px-8 py-4 rounded-lg transition duration-150 text-center font-semibold text-lg"
            >
              Enroll Now →
            </a>
          </div>

          {/* Contact */}
          <div className="text-center text-zinc-500">
            <p className="text-lg mb-2">Have questions? Contact us at:</p>
            <p className="text-[#7C5CFC] text-lg font-black tracking-tight space-x-2">
              <a 
                href="mailto:support@standexdigital.com" 
                className="hover:underline"
              >
                support@standexdigital.com
              </a>
              <span>|</span>
              <a 
                href="tel:+447918262629" 
                className="hover:underline"
              >
                +44 7918 262629
              </a>
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CloudAICourse; 