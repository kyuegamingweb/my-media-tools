import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}`);
    const result = await response.json();

    if (result.code === 0 && result.data) {
      const playUrl = result.data.play || result.data.wmplay;
      return NextResponse.json({ downloadUrl: playUrl });
    } else {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ error: "API connection error" }, { status: 500 });
  }
}