import { NextResponse } from "next/server";

import { listScheduledPosts, scheduleDraft } from "@/lib/services/mock-store";
import { validateScheduleDateTime } from "@/lib/validation";

export async function GET() {
  return NextResponse.json({ source: "mock", scheduledPosts: listScheduledPosts() });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (!payload.draftId || typeof payload.draftId !== "string") {
    return NextResponse.json({ error: "draftId is required." }, { status: 400 });
  }

  const dateValidation = validateScheduleDateTime(payload.scheduledFor);
  if (!dateValidation.valid) {
    return NextResponse.json({ error: dateValidation.error }, { status: 400 });
  }

  const scheduled = scheduleDraft(payload.draftId, new Date(payload.scheduledFor).toISOString());
  if (!scheduled) {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }

  return NextResponse.json({ scheduled });
}
