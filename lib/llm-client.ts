/**
 * Azure OpenAI — text and speech are configured separately.
 *
 * Text (chat / JSON / rewrite):
 * - AZURE_OPENAI_ENDPOINT
 * - AZURE_OPENAI_API_KEY
 * - AZURE_OPENAI_DEPLOYMENT_TEXT (or legacy AZURE_OPENAI_DEPLOYMENT)
 *
 * Speech (audio → text):
 * - AZURE_OPENAI_DEPLOYMENT_SPEECH (preferred) or AZURE_OPENAI_DEPLOYMENT_AUDIO
 * - Same resource as text: omit SPEECH_ENDPOINT; uses text endpoint + key.
 * - Separate voice resource: set AZURE_OPENAI_SPEECH_ENDPOINT + AZURE_OPENAI_SPEECH_API_KEY (both required;
 *   the text API key is never sent to the voice host).
 * - Optional: AZURE_OPENAI_SPEECH_API_VERSION (defaults to AZURE_OPENAI_API_VERSION)
 */

export type LlmProviderId = "azure_openai";

function trimEnv(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v || undefined;
}

function azureEndpoint(): string | undefined {
  return trimEnv(process.env.AZURE_OPENAI_ENDPOINT)?.replace(/\/$/, "");
}

function azureApiKey(): string | undefined {
  return trimEnv(process.env.AZURE_OPENAI_API_KEY);
}

function azureApiVersion(): string {
  return trimEnv(process.env.AZURE_OPENAI_API_VERSION) ?? "2024-08-01-preview";
}

/** Chat deployment for text / JSON / analysis (including “speech” coaching over transcript text). */
export function getTextDeploymentName(): string | undefined {
  return (
    trimEnv(process.env.AZURE_OPENAI_DEPLOYMENT_TEXT) ??
    trimEnv(process.env.AZURE_OPENAI_DEPLOYMENT)
  );
}

/** Whisper (or compatible) deployment for audio transcriptions. */
export function getAudioDeploymentName(): string | undefined {
  return (
    trimEnv(process.env.AZURE_OPENAI_DEPLOYMENT_SPEECH) ??
    trimEnv(process.env.AZURE_OPENAI_DEPLOYMENT_AUDIO)
  );
}

function hasDedicatedSpeechResource(): boolean {
  return Boolean(trimEnv(process.env.AZURE_OPENAI_SPEECH_ENDPOINT));
}

/** Base URL for audio transcriptions: dedicated speech resource, else same as chat. */
function transcriptionEndpoint(): string | undefined {
  const dedicated = trimEnv(process.env.AZURE_OPENAI_SPEECH_ENDPOINT)?.replace(/\/$/, "");
  if (dedicated) return dedicated;
  return azureEndpoint();
}

/**
 * API key for transcriptions only.
 * If AZURE_OPENAI_SPEECH_ENDPOINT is set, only AZURE_OPENAI_SPEECH_API_KEY is used (never the text key),
 * so a separate voice resource is never sent the wrong credential.
 */
function transcriptionApiKey(): string | undefined {
  const speechKey = trimEnv(process.env.AZURE_OPENAI_SPEECH_API_KEY);
  if (hasDedicatedSpeechResource()) {
    return speechKey;
  }
  return speechKey ?? azureApiKey();
}

function transcriptionApiVersion(): string {
  return trimEnv(process.env.AZURE_OPENAI_SPEECH_API_VERSION) ?? azureApiVersion();
}

export function isAzureChatConfigured(): boolean {
  return Boolean(azureEndpoint() && azureApiKey() && getTextDeploymentName());
}

/** True when Azure OpenAI can run chat completions. */
export function isLlmConfigured(): boolean {
  return isAzureChatConfigured();
}

export function getActiveLlmProvider(): LlmProviderId {
  return "azure_openai";
}

/** Deployment name for analytics / UI. */
export function getDefaultChatModelLabel(): string {
  return getTextDeploymentName() ?? "azure";
}

export function llmMissingConfigMessage(): string {
  return (
    "Azure OpenAI is not configured. Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, " +
    "and AZURE_OPENAI_DEPLOYMENT_TEXT (or AZURE_OPENAI_DEPLOYMENT)."
  );
}

function azureChatUrl(deployment: string): string {
  const base = azureEndpoint()!;
  const v = encodeURIComponent(azureApiVersion());
  const dep = encodeURIComponent(deployment);
  return `${base}/openai/deployments/${dep}/chat/completions?api-version=${v}`;
}

/**
 * POST URL for Azure OpenAI audio transcriptions (e.g. Whisper).
 * Returns null if endpoint, api key, or AZURE_OPENAI_DEPLOYMENT_AUDIO is missing.
 */
export function getAzureAudioTranscriptionUrl(): string | null {
  const base = transcriptionEndpoint();
  const key = transcriptionApiKey();
  const deployment = getAudioDeploymentName();
  if (!base || !key || !deployment) return null;
  const v = encodeURIComponent(transcriptionApiVersion());
  const dep = encodeURIComponent(deployment);
  return `${base}/openai/deployments/${dep}/audio/transcriptions?api-version=${v}`;
}

/** True when Azure Whisper (or compatible) transcription is available. */
export function isTranscriptionConfigured(): boolean {
  return getAzureAudioTranscriptionUrl() !== null;
}

export function transcriptionMissingConfigMessage(): string {
  if (hasDedicatedSpeechResource() && !trimEnv(process.env.AZURE_OPENAI_SPEECH_API_KEY)) {
    return (
      "Speech-to-text: AZURE_OPENAI_SPEECH_ENDPOINT is set but AZURE_OPENAI_SPEECH_API_KEY is missing. " +
      "Use the API key for that voice resource (not the text model key)."
    );
  }
  return (
    "Speech-to-text is not configured. Set AZURE_OPENAI_DEPLOYMENT_SPEECH (or AZURE_OPENAI_DEPLOYMENT_AUDIO). " +
    "For a separate voice Azure resource, set AZURE_OPENAI_SPEECH_ENDPOINT and AZURE_OPENAI_SPEECH_API_KEY together."
  );
}

/** Headers for Azure OpenAI text/chat (api-key). */
export function azureOpenAiHeaders(): Record<string, string> {
  return {
    "api-key": azureApiKey()!,
  };
}

/** Headers for speech transcription (dedicated speech key when a separate endpoint is configured). */
export function azureSpeechTranscriptionHeaders(): Record<string, string> {
  const key = transcriptionApiKey();
  if (!key) {
    throw new Error(transcriptionMissingConfigMessage());
  }
  return { "api-key": key };
}

/**
 * Build an Azure chat/completions request. The `model` field is omitted (deployment is in the URL).
 * Call only when isLlmConfigured() is true.
 */
export function createChatCompletionsRequest(body: Record<string, unknown>): { url: string; init: RequestInit } {
  const endpoint = azureEndpoint();
  const key = azureApiKey();
  const deployment = getTextDeploymentName();

  if (!endpoint || !key || !deployment) {
    throw new Error(llmMissingConfigMessage());
  }

  const { model: _drop, ...rest } = body;
  return {
    url: azureChatUrl(deployment),
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
      body: JSON.stringify(rest),
    },
  };
}
