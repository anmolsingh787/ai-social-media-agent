import { NextResponse } from "next/server";

import { updateDraft } from "@/lib/services/mock-store";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const allowedStatuses = ["pending_approval", "approved", "rejected", "scheduled", "draft"];
  if (payload.status && !allowedStatuses.includes(payload.status)) {
    return NextResponse.json({ error: "Unsupported status." }, { status: 400 });
  }

  const updated = updateDraft(id, {
    status: payload.status,
    text: typeof payload.text === "string" ? payload.text : undefined,
    hashtags: Array.isArray(payload.hashtags) ? payload.hashtags : undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }

  return NextResponse.json({ draft: updated });
}
