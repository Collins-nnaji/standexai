import { NextResponse } from "next/server";
import {
  createAzureChatCompletionsRequest,
  createChatCompletionsRequest,
  getTextDeploymentName,
  isLlmConfigured,
  llmMissingConfigMessage,
} from "@/lib/llm-client";
import {
  CONSOLE_MODEL_OPTIONS,
  isConsoleModelId,
  openAiModelNameForConsoleId,
  parseAzureModelDeploymentsJson,
} from "@/lib/console-models";

export const runtime = "nodejs";

type ComparePayload = {
  prompt?: string;
  modelIds?: string[];
  /** Optional draft from the editor for grounded comparison */
  context?: string;
};

type RowResult = {
  modelId: string;
  label: string;
  text: string;
  error?: string;
  deploymentUsed?: string;
};

const SYSTEM =
  "You are a concise assistant for a learning lab. Answer the user task directly. No markdown code fences unless they ask for code.";

function userContent(prompt: string, context?: string) {
  const c = context?.trim();
  if (!c) return prompt.trim();
  return `Task:\n${prompt.trim()}\n\nOptional context (user draft):\n${c}`;
}

async function runOneOpenAi(modelId: string, prompt: string, context?: string): Promise<RowResult> {
  const label = CONSOLE_MODEL_OPTIONS.find((m) => m.id === modelId)?.label ?? modelId;
  const model = openAiModelNameForConsoleId(modelId);
  try {
    const { url, init } = createChatCompletionsRequest({
      model,
      temperature: 0.45,
      max_tokens: 1200,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userContent(prompt, context) },
      ],
    });
    const res = await fetch(url, init);
    if (!res.ok) {
      const errText = await res.text();
      return { modelId, label, text: "", error: errText.slice(0, 400) };
    }
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { modelId, label, text: "", error: "Empty response" };
    return { modelId, label, text, deploymentUsed: model };
  } catch (e) {
    return {
      modelId,
      label,
      text: "",
      error: e instanceof Error ? e.message : "Request failed",
    };
  }
}

async function runOneAzure(modelId: string, deployment: string, prompt: string, context?: string): Promise<RowResult> {
  const label = CONSOLE_MODEL_OPTIONS.find((m) => m.id === modelId)?.label ?? modelId;
  try {
    const { url, init } = createAzureChatCompletionsRequest(deployment, {
      temperature: 0.45,
      max_tokens: 1200,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userContent(prompt, context) },
      ],
    });
    const res = await fetch(url, init);
    if (!res.ok) {
      const errText = await res.text();
      return { modelId, label, text: "", error: errText.slice(0, 400), deploymentUsed: deployment };
    }
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { modelId, label, text: "", error: "Empty response", deploymentUsed: deployment };
    return { modelId, label, text, deploymentUsed: deployment };
  } catch (e) {
    return {
      modelId,
      label,
      text: "",
      deploymentUsed: deployment,
      error: e instanceof Error ? e.message : "Request failed",
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ComparePayload;
    const prompt = body.prompt?.trim();
    const modelIds = Array.isArray(body.modelIds) ? body.modelIds.filter(isConsoleModelId) : [];
    const context = body.context?.trim();

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }
    if (modelIds.length === 0) {
      return NextResponse.json({ error: "Select at least one model" }, { status: 400 });
    }
    if (modelIds.length > 6) {
      return NextResponse.json({ error: "Select at most 6 models per run" }, { status: 400 });
    }
    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    const useOpenAi = Boolean(process.env.OPENAI_API_KEY);
    const depMap = parseAzureModelDeploymentsJson();
    const defaultAzureDep = getTextDeploymentName();

    let meta: string | undefined;
    if (!useOpenAi && !depMap && defaultAzureDep) {
      meta =
        "Azure: every row used the default text deployment. Set AZURE_OPENAI_MODEL_DEPLOYMENTS_JSON to map console model ids to Foundry deployment names for real side-by-side comparison.";
    }

    const rows: RowResult[] = await Promise.all(
      modelIds.map(async (id) => {
        if (useOpenAi) {
          return runOneOpenAi(id, prompt, context);
        }
        const dep = depMap?.[id] ?? defaultAzureDep;
        if (!dep) {
          return {
            modelId: id,
            label: CONSOLE_MODEL_OPTIONS.find((m) => m.id === id)?.label ?? id,
            text: "",
            error: "No Azure deployment configured for this model",
          };
        }
        return runOneAzure(id, dep, prompt, context);
      }),
    );

    return NextResponse.json({ results: rows, meta });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Compare failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
