// Lightweight Gemini API wrapper using fetch
// Reads API key from Vite env: VITE_GEMINI_API_KEY

export interface GeminiOptions {
  systemInstruction?: string;
  model?: string; // default: gemini-1.5-flash
}

export async function generateWithGemini(
  prompt: string,
  opts: GeminiOptions = {}
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const model = opts.model || 'gemini-1.5-flash';

  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          ...(opts.systemInstruction
            ? [{ text: `System: ${opts.systemInstruction}` }]
            : []),
          { text: prompt },
        ],
      },
    ],
  } as const;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gemini API error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API returned no text');
  }
  return text;
}

