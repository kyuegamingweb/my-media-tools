import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Stable TikTok Scraper Endpoint (TikWM)
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}`);
    const result = await response.json();

    if (result.code === 0 && result.data) {
      // Direct HD No-Watermark MP4 Link
      const playUrl = result.data.play || result.data.wmplay;
      return NextResponse.json({ downloadUrl: playUrl });
    } else {
      return NextResponse.json({ error: "Invalid link or video not found" }, { status: 404 });
    }
  } catch (err) {
    console.error("TikTok API Error:", err);
    return NextResponse.json({ error: "Failed to connect to TikTok parser" }, { status: 500 });
  }
}