/**
 * Console / learning lab model catalog (Azure AI Foundry–style names).
 * Map deployments via env AZURE_OPENAI_MODEL_DEPLOYMENTS_JSON, e.g.
 * {"gpt-4o":"my-gpt4o-deployment","phi-3-mini":"my-phi-mini"}
 */

export type ConsoleModelOption = {
  id: string;
  label: string;
  provider: string;
  desc: string;
};

export const CONSOLE_MODEL_OPTIONS: ConsoleModelOption[] = [
  { id: "gpt-4o", label: "GPT-4o", provider: "Azure OpenAI", desc: "Flagship multimodal reasoning" },
  { id: "gpt-4.1", label: "GPT-4.1", provider: "Azure OpenAI", desc: "Latest GPT-4 reasoning tier" },
  { id: "gpt-4.1-mini", label: "GPT-4.1 mini", provider: "Azure OpenAI", desc: "Fast, cost-lean variant" },
  { id: "gpt-4o-mini", label: "GPT-4o mini", provider: "Azure OpenAI", desc: "High-volume general-purpose" },
  { id: "gpt-4-turbo", label: "GPT-4 Turbo", provider: "Azure OpenAI", desc: "Large context window" },
  { id: "gpt-35-turbo", label: "GPT-3.5 Turbo", provider: "Azure OpenAI", desc: "Legacy lightweight option" },
  { id: "phi-3-mini", label: "Phi-3 Mini", provider: "Microsoft Phi", desc: "Small model for quick drafts" },
  { id: "phi-3-small", label: "Phi-3 Small", provider: "Microsoft Phi", desc: "Balance of speed + quality" },
  { id: "phi-3-medium", label: "Phi-3 Medium", provider: "Microsoft Phi", desc: "Larger Phi reasoning tier" },
  { id: "phi-4", label: "Phi-4", provider: "Microsoft Phi", desc: "Reasoning-focused Phi tier" },
  { id: "llama-3.1-8b", label: "Llama 3.1 8B", provider: "Meta", desc: "Compact open model" },
  { id: "llama-3.1-70b", label: "Llama 3.1 70B", provider: "Meta", desc: "High-parameter open model" },
  { id: "mistral-large", label: "Mistral Large", provider: "Mistral", desc: "Strong general-purpose model" },
  { id: "mistral-8x7b", label: "Mistral 8x7B", provider: "Mistral", desc: "Mixture-of-experts speed" },
  { id: "command-r", label: "Command R", provider: "Cohere", desc: "Retrieval-optimized model" },
  { id: "command-r-plus", label: "Command R+", provider: "Cohere", desc: "Highest quality Cohere tier" },
];

const CONSOLE_MODEL_IDS = new Set(CONSOLE_MODEL_OPTIONS.map((m) => m.id));

export function isConsoleModelId(id: string): boolean {
  return CONSOLE_MODEL_IDS.has(id);
}

/** OpenAI API model name when using OPENAI_API_KEY (approximate; adjust to your account). */
export function openAiModelNameForConsoleId(id: string): string {
  const map: Record<string, string> = {
    "gpt-4o": "gpt-4o",
    "gpt-4.1": "gpt-4.1",
    "gpt-4.1-mini": "gpt-4.1-mini",
    "gpt-4o-mini": "gpt-4o-mini",
    "gpt-4-turbo": "gpt-4-turbo",
    "gpt-35-turbo": "gpt-3.5-turbo",
    "phi-3-mini": "phi-3-mini-4k-instruct",
    "phi-3-small": "phi-3-small-8k-instruct",
    "phi-3-medium": "phi-3-medium-4k-instruct",
    "phi-4": "phi-4",
    "llama-3.1-8b": "llama-3.1-8b-instant",
    "llama-3.1-70b": "llama-3.1-70b-versatile",
    "mistral-large": "mistral-large-latest",
    "mistral-8x7b": "open-mixtral-8x7b",
    "command-r": "command-r",
    "command-r-plus": "command-r-plus",
  };
  return map[id] ?? id;
}

export function parseAzureModelDeploymentsJson(): Record<string, string> | null {
  const raw = process.env.AZURE_OPENAI_MODEL_DEPLOYMENTS_JSON?.trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === "string" && v.trim()) out[k] = v.trim();
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}
