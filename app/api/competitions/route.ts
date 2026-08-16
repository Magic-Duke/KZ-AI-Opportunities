import { NextResponse } from "next/server";
import { getAggregatedCompetitions } from "@/lib/services/aggregator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get("refresh") === "true";

    const data = await getAggregatedCompetitions(refresh);
    return NextResponse.json({
      success: true,
      data: data.competitions,
      lastUpdated: data.lastUpdated,
      counts: data.sourceCounts,
    });
  } catch (error) {
    console.error("API /api/competitions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to aggregate competitions" },
      { status: 500 }
    );
  }
}
