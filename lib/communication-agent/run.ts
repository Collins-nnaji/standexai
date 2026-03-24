import { createChatCompletionsRequest, isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import { runAnalyzeLlm, runRewriteLlm, type AnalyzeType, type RewriteMode } from "@/lib/communication-llm";

const REWRITE_MODES: RewriteMode[] = ["professional", "friendly", "persuasive", "safe", "speaker", "neutral"];

export type AgentStep =
  | { kind: "assistant"; content: string | null }
  | { kind: "tool_start"; name: string; arguments: Record<string, unknown> }
  | { kind: "tool_done"; name: string; ok: boolean; summary: string }
  | { kind: "error"; message: string };

const TOOLS: Record<string, unknown>[] = [
  {
    type: "function",
    function: {
      name: "analyze_communication",
      description:
        "Analyze tone, clarity, risk flags, strengths, and improvements (general communication quality). Uses the current working text unless `text` is provided.",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Optional. Full text to analyze; omit to use the session working text.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_compliance_risk",
      description:
        "Scan for harassment, discrimination, threats, legal/policy/privacy risks and safer alternatives. Uses working text unless `text` is provided.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "Optional override text to scan." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyze_intent_psychology",
      description:
        "Detect persuasion tactics, manipulation patterns, and cognitive biases. Uses working text unless `text` is provided.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "Optional override text." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "detect_ai_content",
      description:
        "Estimate AI vs human authorship and suggest how to sound more human. Uses working text unless `text` is provided.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "Optional override text." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "rewrite_communication",
      description:
        "Rewrite the working text (or optional `text`) in the chosen mode. Updates session working text to the rewritten version on success.",
      parameters: {
        type: "object",
        properties: {
          mode: {
            type: "string",
            enum: REWRITE_MODES,
            description: "Rewrite style to apply.",
          },
          text: {
            type: "string",
            description: "Optional. Text to rewrite; omit to rewrite the current working text.",
          },
        },
        required: ["mode"],
      },
    },
  },
];

const AGENT_SYSTEM = `You are Standex Communication Coach, an agent that improves workplace and personal communication.

You MUST use the provided tools to inspect and improve text. Do not invent scores or flags — always call tools to obtain them.

Session rules:
- "Working text" starts as the user's initial message. After a successful rewrite_communication call, working text becomes the rewritten output automatically.
- Tools accept optional "text" to analyze or rewrite a specific string; if omitted, the session working text is used.

Guidelines:
- Goals about safety, HR, legal, or policy: call check_compliance_risk (and analyze_communication if broadly useful).
- General improvement: analyze_communication first, then rewrite if needed.
- Hidden pressure or manipulation concerns: analyze_intent_psychology.
- Sounding too AI-like: detect_ai_content.
- When revising copy: rewrite_communication with the best mode (professional, friendly, persuasive, safe, speaker, neutral).
- Avoid calling the same tool twice on identical working text without reason.
- When you are done, send a concise final message for the user: what you checked, what changed, and what they should do next. Do not paste large JSON.`;

function truncateForContext(json: unknown, maxLen = 14000): string {
  const s = JSON.stringify(json, null, 0);
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen) + `… [truncated, ${s.length} chars total]`;
}

function toolSummary(name: string, payload: unknown): string {
  if (!payload || typeof payload !== "object") return "Done.";
  const o = payload as Record<string, unknown>;
  switch (name) {
    case "analyze_communication":
      return `Scores — overall: ${o.overallScore ?? "?"}, tone: ${o.toneScore ?? "?"}, risk: ${o.riskScore ?? "?"}, clarity: ${o.clarityScore ?? "?"}. ${typeof o.summary === "string" ? o.summary.slice(0, 200) : ""}`;
    case "check_compliance_risk":
      return `Risk: ${o.riskLevel ?? "?"}, safety score: ${o.overallScore ?? "?"}. ${typeof o.summary === "string" ? o.summary.slice(0, 200) : ""}`;
    case "analyze_intent_psychology":
      return `Assessment: ${o.overallAssessment ?? "?"}, confidence: ${o.confidenceScore ?? "?"}%`;
    case "detect_ai_content":
      return `AI probability: ${o.aiProbability ?? "?"}%, verdict: ${o.verdict ?? "?"}`;
    case "rewrite_communication": {
      const r = o as { rewritten?: string; summary?: string };
      return `${typeof r.summary === "string" ? r.summary.slice(0, 240) : "Rewritten."} (${(r.rewritten ?? "").split(/\s+/).filter(Boolean).length} words)`;
    }
    default:
      return "Done.";
  }
}

async function executeTool(
  name: string,
  args: Record<string, unknown>,
  ctx: { workingText: string; setWorkingText: (t: string) => void },
): Promise<{ ok: boolean; result: unknown; error?: string }> {
  const pickText = (a: Record<string, unknown>) => {
    const t = typeof a.text === "string" ? a.text.trim() : "";
    return t || ctx.workingText;
  };

  try {
    switch (name) {
      case "analyze_communication": {
        const text = pickText(args);
        if (!text.trim()) return { ok: false, result: null, error: "No text to analyze." };
        const result = await runAnalyzeLlm(text, "text");
        return { ok: true, result };
      }
      case "check_compliance_risk": {
        const text = pickText(args);
        if (!text.trim()) return { ok: false, result: null, error: "No text to analyze." };
        const result = await runAnalyzeLlm(text, "risk");
        return { ok: true, result };
      }
      case "analyze_intent_psychology": {
        const text = pickText(args);
        if (!text.trim()) return { ok: false, result: null, error: "No text to analyze." };
        const result = await runAnalyzeLlm(text, "intent");
        return { ok: true, result };
      }
      case "detect_ai_content": {
        const text = pickText(args);
        if (!text.trim()) return { ok: false, result: null, error: "No text to analyze." };
        const result = await runAnalyzeLlm(text, "detect");
        return { ok: true, result };
      }
      case "rewrite_communication": {
        const mode = args.mode as RewriteMode;
        if (!mode || !REWRITE_MODES.includes(mode)) {
          return { ok: false, result: null, error: `Invalid mode. Use one of: ${REWRITE_MODES.join(", ")}` };
        }
        const text = pickText(args);
        if (!text.trim()) return { ok: false, result: null, error: "No text to rewrite." };
        const result = (await runRewriteLlm(text, mode)) as { rewritten?: string };
        if (typeof result.rewritten === "string" && result.rewritten.trim()) {
          ctx.setWorkingText(result.rewritten.trim());
        }
        return { ok: true, result };
      }
      default:
        return { ok: false, result: null, error: `Unknown tool: ${name}` };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Tool failed";
    return { ok: false, result: null, error: message };
  }
}

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
};

export type AgentRunResult = {
  steps: AgentStep[];
  finalMessage: string;
  workingText: string;
  usageNote?: string;
};

export async function runCommunicationAgent(options: {
  goal: string;
  initialText: string;
  maxSteps?: number;
}): Promise<AgentRunResult> {
  const maxSteps = Math.min(Math.max(options.maxSteps ?? 10, 1), 16);
  if (!isLlmConfigured()) {
    throw new Error(llmMissingConfigMessage());
  }

  let workingText = options.initialText.trim();
  const setWorkingText = (t: string) => {
    workingText = t;
  };

  const steps: AgentStep[] = [];
  const messages: ChatMessage[] = [
    { role: "system", content: AGENT_SYSTEM },
    {
      role: "user",
      content: `User goal:\n${options.goal.trim()}\n\nInitial text to improve:\n${workingText || "(empty — ask user to provide text or explain that there is nothing to analyze)"}`,
    },
  ];

  let finalMessage =
    workingText.length === 0
      ? "No text was provided. Add content in the document field and run again."
      : "";

  for (let i = 0; i < maxSteps; i++) {
    const { url, init } = createChatCompletionsRequest({
      temperature: 0.25,
      messages: messages as unknown as Record<string, unknown>[],
      tools: TOOLS,
      tool_choice: "auto",
    });

    const response = await fetch(url, init);
    if (!response.ok) {
      const errText = await response.text();
      steps.push({ kind: "error", message: errText || response.statusText });
      return {
        steps,
        finalMessage: `Agent stopped: ${errText || response.statusText}`,
        workingText,
      };
    }

    const data = (await response.json()) as {
      choices?: Array<{
        finish_reason?: string;
        message?: ChatMessage;
      }>;
    };

    const choice = data.choices?.[0];
    const msg = choice?.message;
    if (!msg) {
      steps.push({ kind: "error", message: "Empty model response" });
      return {
        steps,
        finalMessage: finalMessage || "Agent received an empty response.",
        workingText,
      };
    }

    if (msg.content?.trim()) {
      steps.push({ kind: "assistant", content: msg.content });
    }

    const toolCalls = msg.tool_calls;
    if (toolCalls?.length) {
      messages.push({
        role: "assistant",
        content: msg.content ?? null,
        tool_calls: toolCalls,
      });

      for (const call of toolCalls) {
        const name = call.function?.name ?? "";
        let args: Record<string, unknown> = {};
        try {
          args = call.function?.arguments ? (JSON.parse(call.function.arguments) as Record<string, unknown>) : {};
        } catch {
          args = {};
        }

        steps.push({ kind: "tool_start", name, arguments: args });

        const executed = await executeTool(name, args, { workingText, setWorkingText });
        const payload = executed.ok
          ? { ok: true, data: executed.result }
          : { ok: false, error: executed.error ?? "failed" };

        steps.push({
          kind: "tool_done",
          name,
          ok: executed.ok,
          summary: executed.ok ? toolSummary(name, executed.result) : (executed.error ?? "Failed"),
        });

        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: truncateForContext(payload),
        });
      }
      continue;
    }

    finalMessage = msg.content?.trim() || finalMessage || "Agent completed.";
    return { steps, finalMessage, workingText };
  }

  return {
    steps,
    finalMessage:
      finalMessage || "Agent reached the step limit. Review tool results and working text below.",
    workingText,
    usageNote: "Reached the maximum number of model steps; narrow the goal or continue in Text Analyzer / Rewrite Studio.",
  };
}
