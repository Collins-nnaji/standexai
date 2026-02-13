import { PrismaClient, Industry, RuleType, Severity } from '@prisma/client';

const prisma = new PrismaClient();

const complianceRules = [
  // ============================================================================
  // FINTECH - SEC & FINRA RULES
  // ============================================================================
  {
    industry: Industry.FINTECH,
    ruleName: 'Prohibited Guarantee Language',
    ruleType: RuleType.PROHIBITED_CLAIM,
    severity: Severity.CRITICAL,
    pattern: '\\b(guarantee[ds]?|guaranteed|guaranteeing)\\s+(return|profit|gain|yield|income|performance)\\b',
    explanation: 'Under SEC Rule 206(4)-1(a)(5), investment advisors cannot guarantee specific returns on securities. Using "guaranteed" in connection with investment performance violates federal securities law.',
    regulationReference: 'SEC Investment Advisers Act Rule 206(4)-1(a)(5), FINRA Rule 2210',
    alternatives: [
      { text: 'potential returns', reason: 'Emphasizes possibility, not certainty' },
      { text: 'historical returns', reason: 'References past data without future promises' },
      { text: 'target returns', reason: 'Indicates goal rather than guarantee' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.FINTECH,
    ruleName: 'Unsubstantiated Performance Claims',
    ruleType: RuleType.UNSUPPORTED_STAT,
    severity: Severity.CRITICAL,
    pattern: '\\b(average|typical|expected)\\s+(return|gain|profit)\\s+of\\s+\\d+%',
    explanation: 'FINRA Rule 2210 requires that all performance claims be substantiated and include appropriate disclaimers. Specific percentage returns must be backed by actual data and include risk disclosures.',
    regulationReference: 'FINRA Rule 2210(d)(1)(F), SEC Rule 206(4)-1',
    alternatives: [
      { text: 'historical performance of approximately X% over [timeframe]', reason: 'Cites actual past data with timeframe' },
      { text: 'returns have ranged from X% to Y% over the past [period]', reason: 'Shows range, not single figure' },
      { text: 'based on historical data from [source], returns averaged X%', reason: 'Attributes claim to verifiable source' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.FINTECH,
    ruleName: 'Missing Risk Disclosure',
    ruleType: RuleType.MISSING_DISCLOSURE,
    severity: Severity.WARNING,
    pattern: '(invest|investment|portfolio|securities|stocks|bonds)(?!.*\\b(risk|loss|volatile|fluctuat))',
    explanation: 'Investment communications must include clear risk disclosures. Material omissions about investment risks can violate anti-fraud provisions.',
    regulationReference: 'SEC Rule 10b-5, FINRA Rule 2210(d)(1)(A)',
    alternatives: [
      { text: 'All investments carry risk, including potential loss of principal.', reason: 'Standard risk disclosure' },
      { text: 'Past performance does not guarantee future results. Market conditions may vary.', reason: 'Performance caveat' },
      { text: 'Investors should consider their risk tolerance before investing.', reason: 'Personalized risk warning' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.FINTECH,
    ruleName: 'Prohibited Superlatives Without Support',
    ruleType: RuleType.PROHIBITED_CLAIM,
    severity: Severity.WARNING,
    pattern: '\\b(best|top|leading|premier|superior|#1|number one|highest)\\s+(return|performance|investment|platform|service)',
    explanation: 'Superlative claims must be substantiated with objective data from an independent third party. Unsubstantiated superlatives are considered misleading.',
    regulationReference: 'FINRA Rule 2210(d)(1)(B)',
    alternatives: [
      { text: 'competitive returns', reason: 'Comparative without superlative claim' },
      { text: 'recognized by [source] as a top performer', reason: 'Attributed to verifiable third party' },
      { text: 'strong performance relative to benchmark', reason: 'Contextual comparison' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.FINTECH,
    ruleName: 'Cherry-Picked Performance Data',
    ruleType: RuleType.PERFORMANCE_CLAIM,
    severity: Severity.CRITICAL,
    pattern: '(best|top|highest)\\s+(month|quarter|year)(?!.*overall|average|typical)',
    explanation: 'Presenting only favorable time periods without full performance context is misleading. Must show overall performance, not just peak periods.',
    regulationReference: 'SEC Rule 206(4)-1(a)(5), FINRA Rule 2210(d)(1)(F)',
    alternatives: [
      { text: 'average annual return over [full period]', reason: 'Shows complete picture' },
      { text: 'performance ranged from X% to Y% across all periods', reason: 'Includes full range' },
      { text: 'total return since inception', reason: 'Complete timeframe' },
    ],
    isSystemRule: true,
  },

  // ============================================================================
  // INSURANCE - STATE REGULATIONS & NAIC
  // ============================================================================
  {
    industry: Industry.INSURANCE,
    ruleName: 'Insurance Guarantee Prohibition',
    ruleType: RuleType.PROHIBITED_CLAIM,
    severity: Severity.CRITICAL,
    pattern: '\\b(guarantee[ds]?|guaranteed|guaranteeing)\\s+(coverage|claim|payment|benefit|payout)\\b',
    explanation: 'State insurance regulations prohibit guaranteeing claim payments or coverage decisions, as these are subject to policy terms and underwriting.',
    regulationReference: 'NAIC Model Regulation on Unfair Trade Practices, State Insurance Codes',
    alternatives: [
      { text: 'eligible for coverage subject to policy terms', reason: 'Conditional language' },
      { text: 'may be covered depending on circumstances', reason: 'Indicates possibility' },
      { text: 'coverage is provided as outlined in the policy', reason: 'References contract terms' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.INSURANCE,
    ruleName: 'Premium Pricing Claims',
    ruleType: RuleType.PROHIBITED_CLAIM,
    severity: Severity.WARNING,
    pattern: '\\b(lowest|cheapest|best price|save money|reduce costs?)\\s+(premium|rate|price)',
    explanation: 'Claims about pricing must be substantiated. Stating "lowest premium" without qualification is generally prohibited as it cannot be verified.',
    regulationReference: 'NAIC Model Regulation §3(A), State Unfair Trade Practices Acts',
    alternatives: [
      { text: 'competitive pricing based on your profile', reason: 'Personalized, not absolute' },
      { text: 'rates tailored to your specific needs', reason: 'Customized approach' },
      { text: 'compare quotes to find the right coverage', reason: 'Encourages comparison shopping' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.INSURANCE,
    ruleName: 'Missing Policy Limitations Disclosure',
    ruleType: RuleType.MISSING_DISCLOSURE,
    severity: Severity.CRITICAL,
    pattern: '(coverage|benefit|policy|plan)(?!.*(exclusion|limitation|restriction|subject to|terms and conditions))',
    explanation: 'Insurance communications must disclose material limitations, exclusions, and conditions. Omitting these can constitute unfair or deceptive practices.',
    regulationReference: 'NAIC Model Regulation §4(B), State Insurance Advertising Rules',
    alternatives: [
      { text: 'Coverage subject to policy terms, conditions, and exclusions. See policy for full details.', reason: 'Standard disclosure' },
      { text: 'Certain limitations and exclusions apply. Review policy documents for complete information.', reason: 'Directs to full terms' },
      { text: 'Benefits are subject to eligibility requirements and policy limits.', reason: 'Highlights conditions' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.INSURANCE,
    ruleName: 'Misleading Comparison Language',
    ruleType: RuleType.COMPARISON,
    severity: Severity.WARNING,
    pattern: '\\b(better|superior|more comprehensive|greater protection)\\s+than\\s+(other|competitor|alternative|most)',
    explanation: 'Comparative advertising must be fair, accurate, and substantiated. Vague superiority claims without specific, verifiable data are prohibited.',
    regulationReference: 'NAIC Model Regulation §5, State Comparative Advertising Rules',
    alternatives: [
      { text: 'includes [specific feature] not available in all policies', reason: 'Specific, verifiable difference' },
      { text: 'offers additional benefits such as [X, Y, Z]', reason: 'Lists specific features' },
      { text: 'comparison based on [specific criteria] as of [date]', reason: 'Documented comparison' },
    ],
    isSystemRule: true,
  },

  // ============================================================================
  // HEALTHCARE - HIPAA & FDA
  // ============================================================================
  {
    industry: Industry.HEALTHCARE,
    ruleName: 'Medical Advice Disclaimer',
    ruleType: RuleType.MEDICAL_ADVICE,
    severity: Severity.CRITICAL,
    pattern: '(should|must|need to|recommended to)\\s+(take|use|try|consider)\\s+(medication|treatment|drug|therapy|procedure)',
    explanation: 'Content that appears to provide medical advice must include disclaimers that it is informational only. Directive language ("you should take") crosses into medical advice territory.',
    regulationReference: 'FDA Guidance, State Medical Practice Acts, HIPAA',
    alternatives: [
      { text: 'common treatments may include [options]. Consult your healthcare provider.', reason: 'Informational with disclaimer' },
      { text: 'discuss treatment options with your doctor', reason: 'Directs to professional' },
      { text: 'for informational purposes only, not medical advice', reason: 'Clear disclaimer' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.HEALTHCARE,
    ruleName: 'Unsubstantiated Health Claims',
    ruleType: RuleType.PROHIBITED_CLAIM,
    severity: Severity.CRITICAL,
    pattern: '\\b(cure[sd]?|treat|prevent|eliminate|reverse)\\s+(disease|cancer|diabetes|condition|illness)',
    explanation: 'FDA strictly prohibits disease claims for products not approved for that use. Only FDA-approved drugs can claim to cure, treat, or prevent disease.',
    regulationReference: 'FDA Act §201(g)(1), FDA Guidance on Disease Claims',
    alternatives: [
      { text: 'may support [body function]', reason: 'Structure/function claim' },
      { text: 'intended to help manage symptoms. Consult your doctor.', reason: 'Supportive, not curative' },
      { text: 'used in conjunction with prescribed treatment', reason: 'Complementary role' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.HEALTHCARE,
    ruleName: 'Missing FDA Required Warnings',
    ruleType: RuleType.RISK_WARNING,
    severity: Severity.CRITICAL,
    pattern: '(medication|drug|prescription|supplement)(?!.*(side effect|warning|risk|consult|doctor|physician))',
    explanation: 'Healthcare products must include appropriate risk information and warnings. Material omissions about side effects or risks can violate FDA regulations.',
    regulationReference: 'FDA Labeling Requirements, 21 CFR Part 201',
    alternatives: [
      { text: 'Possible side effects include [list]. Consult your healthcare provider.', reason: 'Includes risk info' },
      { text: 'Not suitable for everyone. See full prescribing information.', reason: 'Limitation disclosure' },
      { text: 'Discuss risks and benefits with your doctor.', reason: 'Professional consultation required' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.HEALTHCARE,
    ruleName: 'Privacy and Confidentiality Language',
    ruleType: RuleType.MISSING_DISCLOSURE,
    severity: Severity.WARNING,
    pattern: '(patient data|health information|medical records|personal health)(?!.*(confidential|private|HIPAA|protected|secure))',
    explanation: 'Healthcare communications involving patient data must address privacy protections. HIPAA requires safeguarding protected health information (PHI).',
    regulationReference: 'HIPAA Privacy Rule 45 CFR §164.502',
    alternatives: [
      { text: 'Your health information is protected under HIPAA and kept confidential.', reason: 'Privacy assurance' },
      { text: 'We safeguard your personal health data in compliance with federal privacy laws.', reason: 'Regulatory compliance' },
      { text: 'Protected health information is handled according to strict privacy standards.', reason: 'Security commitment' },
    ],
    isSystemRule: true,
  },

  // ============================================================================
  // LENDING - TILA & CFPB
  // ============================================================================
  {
    industry: Industry.LENDING,
    ruleName: 'Missing APR Disclosure',
    ruleType: RuleType.MISSING_DISCLOSURE,
    severity: Severity.CRITICAL,
    pattern: '(loan|financing|credit|borrow)\\s+(rate|interest)(?!.*(APR|annual percentage rate))',
    explanation: 'Truth in Lending Act (TILA) requires disclosure of the Annual Percentage Rate (APR) in credit advertising. Stating an interest rate without APR is a TILA violation.',
    regulationReference: 'TILA 15 USC §1664, Regulation Z 12 CFR §1026.24',
    alternatives: [
      { text: 'X% APR (Annual Percentage Rate)', reason: 'Compliant APR disclosure' },
      { text: 'Interest rate of X%, APR of Y%', reason: 'Both rates disclosed' },
      { text: 'See full APR and terms at [URL]', reason: 'Directs to complete disclosure' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.LENDING,
    ruleName: 'Misleading Low Rate Claims',
    ruleType: RuleType.PROHIBITED_CLAIM,
    severity: Severity.WARNING,
    pattern: '\\b(low|lowest|best)\\s+(rate|APR|interest)\\b(?!.*(as low as|starting at|for qualified borrowers))',
    explanation: 'Advertised rates must be actually available to a reasonable proportion of applicants. "Lowest rate" claims must specify qualifications (e.g., "for qualified borrowers").',
    regulationReference: 'TILA Regulation Z §1026.24(f), CFPB Guidance',
    alternatives: [
      { text: 'rates as low as X% APR for qualified borrowers', reason: 'Conditional with qualification' },
      { text: 'competitive rates starting at X% APR', reason: 'Starting point, not guarantee' },
      { text: 'rates from X% to Y% APR based on creditworthiness', reason: 'Range with criteria' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.LENDING,
    ruleName: 'Missing Fee Disclosures',
    ruleType: RuleType.MISSING_DISCLOSURE,
    severity: Severity.CRITICAL,
    pattern: '(loan|credit|financing|mortgage)(?!.*(fee|cost|charge|closing cost|origination|APR))',
    explanation: 'TILA requires disclosure of all costs associated with credit, including fees. Advertising must not be misleading by omitting material cost information.',
    regulationReference: 'TILA §1664, Regulation Z §1026.24(d)',
    alternatives: [
      { text: 'Total costs include fees. See Loan Estimate for details.', reason: 'Acknowledges fees' },
      { text: 'May include origination, closing, and other fees.', reason: 'Lists common fees' },
      { text: 'APR includes certain fees and costs. Full disclosure available at [URL].', reason: 'Comprehensive' },
    ],
    isSystemRule: true,
  },
  {
    industry: Industry.LENDING,
    ruleName: 'Prohibited "No Cost" Claims',
    ruleType: RuleType.PROHIBITED_CLAIM,
    severity: Severity.CRITICAL,
    pattern: '\\b(no cost|zero cost|free|no fee|no charge)\\s+(loan|refinance|mortgage|credit)',
    explanation: 'Claims of "no cost" or "free" loans are generally prohibited unless absolutely true. If costs exist but are rolled into the loan, this must be clearly disclosed.',
    regulationReference: 'TILA Regulation Z §1026.24(i), CFPB Enforcement Actions',
    alternatives: [
      { text: 'no out-of-pocket costs at closing (fees may be included in loan amount)', reason: 'Clarifies structure' },
      { text: 'lender-paid closing costs (may affect rate)', reason: 'Explains trade-off' },
      { text: 'see Loan Estimate for all costs and fees', reason: 'Directs to disclosure' },
    ],
    isSystemRule: true,
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing system rules
  console.log('🧹 Clearing existing system rules...');
  await prisma.complianceRule.deleteMany({
    where: { isSystemRule: true },
  });

  // Seed compliance rules
  console.log('📋 Seeding compliance rules...');
  let createdCount = 0;

  for (const rule of complianceRules) {
    await prisma.complianceRule.create({
      data: {
        industry: rule.industry,
        ruleName: rule.ruleName,
        ruleType: rule.ruleType,
        severity: rule.severity,
        pattern: rule.pattern,
        explanation: rule.explanation,
        regulationReference: rule.regulationReference,
        alternatives: JSON.stringify(rule.alternatives),
        isSystemRule: rule.isSystemRule,
        active: true,
      },
    });
    createdCount++;
  }

  console.log(`✅ Created ${createdCount} compliance rules`);

  // Summary by industry
  const rulesByIndustry = complianceRules.reduce((acc, rule) => {
    acc[rule.industry] = (acc[rule.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\n📊 Rules by industry:');
  Object.entries(rulesByIndustry).forEach(([industry, count]) => {
    console.log(`   ${industry}: ${count} rules`);
  });

  console.log('\n✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
