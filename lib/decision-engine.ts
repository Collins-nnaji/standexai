export type ScoreBand = "low" | "medium" | "high";

export type DecisionInput = {
  industry: string;
  businessFunction: string;
  useCase: string;
  monthlyTaskVolume: number;
  currentProcessMonthlyCost: number;
  riskTolerance: ScoreBand;
  dataSensitivity: ScoreBand;
  repetitionLevel: ScoreBand;
  dataStructureQuality: ScoreBand;
  humanJudgmentDependency: ScoreBand;
  errorTolerance: ScoreBand;
};

export type DecisionStatus = "GO" | "PROCEED_WITH_CAUTION" | "NO_GO";

export type DecisionOutput = {
  aiFitScore: number;
  recommendation: {
    status: DecisionStatus;
    summary: string;
    confidence: number;
  };
  toolRecommendations: Array<{
    category: "cost_efficiency" | "compliance" | "scale" | "open_source";
    tool: string;
    why: string;
  }>;
  costProjection: {
    monthlyAiApiCost: number;
    monthlyInfrastructureCost: number;
    oneTimeImplementationCost: number;
    monthlyMaintenanceCost: number;
    totalMonthlyRunCost: number;
    yearOneTotalCost: number;
  };
  roiEstimate: {
    monthlyHoursSaved: number;
    monthlyLaborCostSaved: number;
    netMonthlyImpact: number;
    breakEvenMonths: number;
    oneYearRoiPercent: number;
  };
  riskAnalysis: {
    dataPrivacyRisk: number;
    hallucinationRisk: number;
    regulatoryRisk: number;
    brandRisk: number;
    keyConcerns: string[];
  };
  standoutIdeas: string[];
};

const SCORE_VALUE: Record<ScoreBand, number> = {
  low: 25,
  medium: 60,
  high: 90,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function rounded(value: number) {
  return Math.round(value * 100) / 100;
}

function computeIndustryRiskMultiplier(industry: string) {
  const normalized = industry.toLowerCase();
  if (["fintech", "banking", "insurance", "healthcare", "investment", "lending"].some((v) => normalized.includes(v))) {
    return 1.2;
  }
  if (["legal", "pharma"].some((v) => normalized.includes(v))) {
    return 1.25;
  }
  return 1;
}

function pickTools(input: DecisionInput, fitScore: number, riskScore: number): DecisionOutput["toolRecommendations"] {
  const sensitivityHigh = input.dataSensitivity === "high";
  const strictRisk = input.riskTolerance === "low" || riskScore > 70;

  const complianceTool = sensitivityHigh || strictRisk
    ? {
        category: "compliance" as const,
        tool: "Claude 3.5 Sonnet (with policy guardrails)",
        why: "Strong instruction adherence and safer long-form reasoning for regulated content reviews.",
      }
    : {
        category: "compliance" as const,
        tool: "GPT-4.1",
        why: "Reliable structured outputs with robust schema control for compliance workflows.",
      };

  const costTool = fitScore > 75
    ? {
        category: "cost_efficiency" as const,
        tool: "GPT-4.1 mini",
        why: "Balanced quality-to-cost profile for high-volume operational tasks.",
      }
    : {
        category: "cost_efficiency" as const,
        tool: "Llama 3.1 70B via managed endpoint",
        why: "Lower ongoing cost when workloads are predictable and prompts are stabilized.",
      };

  return [
    costTool,
    complianceTool,
    {
      category: "scale",
      tool: "Gemini 1.5 Pro",
      why: "Good for long context use cases and cross-document analysis at enterprise scale.",
    },
    {
      category: "open_source",
      tool: "Mistral Large / Llama 3.1 (self-host or VPC)",
      why: "Best when data residency and infrastructure control are non-negotiable.",
    },
  ];
}

export function evaluateUseCase(input: DecisionInput): DecisionOutput {
  const repetition = SCORE_VALUE[input.repetitionLevel];
  const structure = SCORE_VALUE[input.dataStructureQuality];
  const judgmentPenalty = SCORE_VALUE[input.humanJudgmentDependency];
  const errorTolerance = SCORE_VALUE[input.errorTolerance];
  const sensitivity = SCORE_VALUE[input.dataSensitivity];
  const riskTolerance = SCORE_VALUE[input.riskTolerance];
  const industryMultiplier = computeIndustryRiskMultiplier(input.industry);

  const aiFitRaw =
    repetition * 0.3 +
    structure * 0.25 +
    errorTolerance * 0.2 +
    (100 - judgmentPenalty) * 0.2 +
    (100 - sensitivity) * 0.05;
  const aiFitScore = clamp(Math.round(aiFitRaw), 0, 100);

  const taskComplexityMultiplier = 0.85 + judgmentPenalty / 250;
  const avgTokensPerTask = 1200 + Math.round(taskComplexityMultiplier * 800);
  const monthlyTokens = input.monthlyTaskVolume * avgTokensPerTask;

  const monthlyAiApiCost = rounded((monthlyTokens / 1_000_000) * 4.5);
  const monthlyInfrastructureCost = rounded(35 + input.monthlyTaskVolume * 0.03);
  const oneTimeImplementationCost = rounded(3500 + judgmentPenalty * 18 + sensitivity * 12);
  const monthlyMaintenanceCost = rounded(250 + judgmentPenalty * 2.2 + sensitivity * 1.5);
  const totalMonthlyRunCost = rounded(monthlyAiApiCost + monthlyInfrastructureCost + monthlyMaintenanceCost);
  const yearOneTotalCost = rounded(oneTimeImplementationCost + totalMonthlyRunCost * 12);

  const minutesSavedPerTask = clamp((repetition / 90) * 7 + (structure / 90) * 4 - (judgmentPenalty / 90) * 2, 1.5, 9);
  const monthlyHoursSaved = rounded((input.monthlyTaskVolume * minutesSavedPerTask) / 60);
  const laborCostPerHour = 38;
  const monthlyLaborCostSaved = rounded(monthlyHoursSaved * laborCostPerHour);
  const netMonthlyImpact = rounded(monthlyLaborCostSaved - totalMonthlyRunCost);
  const breakEvenMonths = netMonthlyImpact > 0 ? rounded(oneTimeImplementationCost / netMonthlyImpact) : 99;
  const oneYearRoiPercent = rounded(((monthlyLaborCostSaved * 12 - yearOneTotalCost) / Math.max(yearOneTotalCost, 1)) * 100);

  const dataPrivacyRisk = clamp(Math.round((sensitivity * 0.55 + (100 - riskTolerance) * 0.2) * industryMultiplier), 0, 100);
  const hallucinationRisk = clamp(Math.round((judgmentPenalty * 0.45 + (100 - errorTolerance) * 0.35) * industryMultiplier), 0, 100);
  const regulatoryRisk = clamp(Math.round((sensitivity * 0.35 + judgmentPenalty * 0.3 + (100 - riskTolerance) * 0.2) * industryMultiplier), 0, 100);
  const brandRisk = clamp(Math.round((hallucinationRisk * 0.45 + regulatoryRisk * 0.35 + (100 - riskTolerance) * 0.2) * 0.95), 0, 100);

  const aggregateRisk = (dataPrivacyRisk + hallucinationRisk + regulatoryRisk + brandRisk) / 4;

  let status: DecisionStatus = "PROCEED_WITH_CAUTION";
  if (aiFitScore >= 72 && aggregateRisk <= 58 && netMonthlyImpact > 0) {
    status = "GO";
  }
  if (aiFitScore < 45 || aggregateRisk > 78 || oneYearRoiPercent < -10) {
    status = "NO_GO";
  }

  const keyConcerns: string[] = [];
  if (dataPrivacyRisk > 65) keyConcerns.push("Sensitive data handling requires strict access and retention controls.");
  if (hallucinationRisk > 60) keyConcerns.push("Output verification layer is required before external publishing.");
  if (regulatoryRisk > 60) keyConcerns.push("Legal/compliance review remains mandatory for regulated statements.");
  if (brandRisk > 55) keyConcerns.push("Tone and factual drift could impact trust if guardrails are weak.");
  if (keyConcerns.length === 0) keyConcerns.push("Risk profile is manageable with baseline governance and monitoring.");

  const recommendationSummary =
    status === "GO"
      ? "Proceed with phased rollout. This use case is economically and operationally suited for AI automation."
      : status === "PROCEED_WITH_CAUTION"
        ? "Viable with controls. Launch a pilot first and enforce governance before full rollout."
        : "Current conditions are unfavorable. Redesign the workflow or defer AI adoption for now.";

  const confidence = clamp(Math.round((aiFitScore * 0.6 + (100 - aggregateRisk) * 0.4) - Math.max(0, 6 - input.monthlyTaskVolume / 400)), 35, 95);

  return {
    aiFitScore,
    recommendation: {
      status,
      summary: recommendationSummary,
      confidence,
    },
    toolRecommendations: pickTools(input, aiFitScore, aggregateRisk),
    costProjection: {
      monthlyAiApiCost,
      monthlyInfrastructureCost,
      oneTimeImplementationCost,
      monthlyMaintenanceCost,
      totalMonthlyRunCost,
      yearOneTotalCost,
    },
    roiEstimate: {
      monthlyHoursSaved,
      monthlyLaborCostSaved,
      netMonthlyImpact,
      breakEvenMonths,
      oneYearRoiPercent,
    },
    riskAnalysis: {
      dataPrivacyRisk,
      hallucinationRisk,
      regulatoryRisk,
      brandRisk,
      keyConcerns,
    },
    standoutIdeas: [
      "Run a 30-day pilot with hard success criteria: cycle time, error rate, and compliance exception rate.",
      "Adopt a human-in-the-loop release gate for high-impact outputs while auto-approving low-risk tasks.",
      "Create a use-case scorecard library so leadership can benchmark AI readiness across departments.",
    ],
  };
}
