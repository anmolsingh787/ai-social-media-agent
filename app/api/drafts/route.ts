import { NextResponse } from "next/server";

import { listDrafts } from "@/lib/services/mock-store";

export async function GET() {
  return NextResponse.json({ source: "mock", drafts: listDrafts() });
}
