import { NextResponse } from "next/server";
import { getAggregatedCompetitions } from "@/lib/services/aggregator";

export async function POST() {
  try {
    const data = await getAggregatedCompetitions(true);
    return NextResponse.json({
      success: true,
      message: "Data successfully synchronized with live platforms",
      lastUpdated: data.lastUpdated,
      counts: data.sourceCounts,
      totalCompetitions: data.competitions.length,
    });
  } catch (error) {
    console.error("API /api/sync error:", error);
    return NextResponse.json(
      { success: false, error: "Sync failed" },
      { status: 500 }
    );
  }
}
