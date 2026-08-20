import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    const videoLink = data.video?.noWatermark || data.url;

    if (!videoLink) {
      return NextResponse.json({ error: "Video link not found" }, { status: 404 });
    }

    return NextResponse.json({ downloadUrl: videoLink });
  } catch (err) {
    return NextResponse.json({ error: "API fetch failed" }, { status: 500 });
  }
}