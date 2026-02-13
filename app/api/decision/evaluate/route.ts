import { NextResponse } from "next/server";
import { evaluateUseCase, type DecisionInput } from "@/lib/decision-engine";

export const runtime = "nodejs";

function validateInput(body: Partial<DecisionInput>): string | null {
  if (!body.industry?.trim()) return "industry is required";
  if (!body.businessFunction?.trim()) return "businessFunction is required";
  if (!body.useCase?.trim()) return "useCase is required";

  if (!Number.isFinite(body.monthlyTaskVolume) || (body.monthlyTaskVolume ?? 0) <= 0) {
    return "monthlyTaskVolume must be greater than 0";
  }

  if (!Number.isFinite(body.currentProcessMonthlyCost) || (body.currentProcessMonthlyCost ?? 0) < 0) {
    return "currentProcessMonthlyCost must be >= 0";
  }

  const bands = ["low", "medium", "high"];
  const keys: Array<keyof Pick<DecisionInput, "riskTolerance" | "dataSensitivity" | "repetitionLevel" | "dataStructureQuality" | "humanJudgmentDependency" | "errorTolerance">> = [
    "riskTolerance",
    "dataSensitivity",
    "repetitionLevel",
    "dataStructureQuality",
    "humanJudgmentDependency",
    "errorTolerance",
  ];

  for (const key of keys) {
    if (!bands.includes(String(body[key]))) {
      return `${key} must be one of: low, medium, high`;
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<DecisionInput>;
    const validationError = validateInput(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const result = evaluateUseCase(body as DecisionInput);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to evaluate use case";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
