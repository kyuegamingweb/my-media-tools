import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Kasalukuyang unavailable ang TikTok Downloaders dahil sa maintenance/bugs. Subukan muli mamaya." },
    { status: 503 }
  );
}