import { NextResponse } from "next/server";

import { generateDeterministicMockContent } from "@/lib/services/mock-generator";
import { createDraftsFromGenerated } from "@/lib/services/mock-store";
import { validateGenerateInput } from "@/lib/validation";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const validated = validateGenerateInput(payload);

  if (!validated.valid) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const variants = generateDeterministicMockContent(validated.data);
  const drafts = createDraftsFromGenerated(validated.data, variants);

  return NextResponse.json({
    source: process.env.OPENAI_API_KEY ? "ai_placeholder" : "mock",
    message: "Generated deterministic mock content. Configure OPENAI_API_KEY to replace with real model output.",
    variants,
    drafts,
  });
}
