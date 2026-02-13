import { NextResponse } from "next/server";
import { analyzeSignals } from "@/lib/sentiment-noise";
import { XMLParser } from "fast-xml-parser";

type TrendItem = {
  title: string;
  source: string;
  summary: string;
  url?: string;
  company?: string;
};

const SAMPLE_ITEMS: TrendItem[] = [
  {
    title: "OpenAI expands GPT-4o enterprise controls",
    source: "Company update",
    summary: "Adds finer admin controls and data retention options for enterprise customers.",
    company: "OpenAI",
  },
  {
    title: "Google pushes Gemini 1.5 into broader Workspace rollout",
    source: "Product release",
    summary: "New summarization and retrieval workflows for internal docs and chat.",
    company: "Google",
  },
  {
    title: "Anthropic adds safety tooling for Claude evaluations",
    source: "Research note",
    summary: "Introduces improved prompt regression testing and red-team automation.",
    company: "Anthropic",
  },
  {
    title: "Mistral highlights open-weight model adoption in EU",
    source: "Conference",
    summary: "Growing interest in sovereign AI stacks and private deployment.",
    company: "Mistral",
  },
];

async function fetchItemsFromUrl(url: string): Promise<TrendItem[]> {
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Failed to fetch trends source (${response.status})`);
  }

  const data = (await response.json()) as { items?: TrendItem[] };
  if (!Array.isArray(data.items)) {
    throw new Error("Trends source missing items array");
  }

  return data.items;
}

async function fetchItemsFromRss(url: string): Promise<TrendItem[]> {
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Failed to fetch RSS (${response.status})`);
  }

  const xml = await response.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml) as {
    rss?: { channel?: { item?: Array<Record<string, unknown>> } };
    feed?: { entry?: Array<Record<string, unknown>> };
  };

  const items = parsed.rss?.channel?.item ?? parsed.feed?.entry ?? [];
  return items.map((item) => {
    const source = item.source as Record<string, unknown> | undefined;
    const author = item.author as Record<string, unknown> | string | undefined;
    const link = item.link as Record<string, unknown> | string | undefined;
    return {
      title: String(item.title ?? "Untitled"),
      source: String(source?.["#text"] ?? source?.title ?? "RSS"),
      summary: String(item.description ?? item.summary ?? item.content ?? "No summary provided."),
      company: typeof author === "string" ? author : String((author as Record<string, unknown>)?.name ?? ""),
      url: String((link as Record<string, unknown>)?.href ?? link ?? ""),
    };
  });
}
async function summarizeWithOpenAI(items: TrendItem[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const prompt = `You are an AI trend analyst. Summarize what is happening and who is doing what using the items below.
Return JSON only with this schema:
{
  "summary": string,
  "who": [{"actor": string, "activity": string}],
  "themes": [string],
  "notable": [string]
}
Items:\n${items
    .map((item) => `- ${item.title} (${item.company ?? item.source}): ${item.summary}`)
    .join("\n")}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "Return JSON only." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return null;
  }

  try {
    return JSON.parse(content) as {
      summary: string;
      who: Array<{ actor: string; activity: string }>;
      themes: string[];
      notable: string[];
    };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { items?: TrendItem[]; filter?: string; limit?: number };
    const filter = body.filter?.trim().toLowerCase() ?? "";

    let items = Array.isArray(body.items) && body.items.length > 0 ? body.items : SAMPLE_ITEMS;
    if (process.env.TRENDS_SOURCE_URL && (!body.items || body.items.length === 0)) {
      try {
        items = await fetchItemsFromUrl(process.env.TRENDS_SOURCE_URL);
      } catch {
        items = SAMPLE_ITEMS;
      }
    }
    if (!process.env.TRENDS_SOURCE_URL && process.env.TRENDS_RSS_URL && (!body.items || body.items.length === 0)) {
      try {
        items = await fetchItemsFromRss(process.env.TRENDS_RSS_URL);
      } catch {
        items = SAMPLE_ITEMS;
      }
    }

    if (filter) {
      items = items.filter((item) =>
        `${item.title} ${item.summary} ${item.company ?? ""} ${item.source}`.toLowerCase().includes(filter),
      );
    }

    const limit = Math.max(1, Math.min(body.limit ?? 8, 30));
    items = items.slice(0, limit);

    const summaryBlock = await summarizeWithOpenAI(items);
    const summaryText = summaryBlock?.summary ??
      `Top themes: ${items.map((item) => item.title).slice(0, 3).join("; ")}.`;

    const sentiment = analyzeSignals(summaryText);

    return NextResponse.json({
      items,
      summary: summaryBlock ?? {
        summary: summaryText,
        who: items.map((item) => ({ actor: item.company ?? item.source, activity: item.summary })),
        themes: ["Model upgrades", "Enterprise controls", "Open-weight adoption"],
        notable: items.map((item) => item.title),
      },
      sentiment,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Trend analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
