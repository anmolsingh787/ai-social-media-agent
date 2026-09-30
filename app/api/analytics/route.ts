import { NextResponse } from "next/server";

import { getAnalyticsOverview } from "@/lib/services/mock-store";

export async function GET() {
  return NextResponse.json({ analytics: getAnalyticsOverview() });
}
