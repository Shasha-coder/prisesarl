import { NextResponse } from "next/server";
import { SITE_LOCKED, SUSPENSION_MESSAGE } from "@/lib/site-lock";

export async function POST() {
  if (SITE_LOCKED) {
    return NextResponse.json(
      { error: SUSPENSION_MESSAGE },
      { status: 503 }
    );
  }
  return NextResponse.json({ error: "Not available" }, { status: 503 });
}

export async function GET() {
  return POST();
}
