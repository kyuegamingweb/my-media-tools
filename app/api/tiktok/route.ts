import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Dito ginagawa ang pag-fetch sa totoong TikTok video link
    // Palitan ang URL ng totoong external API na ginagamit mo kung mayroon
    const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    const rawVideoUrl = data.video?.noWatermark || data.url;

    if (!rawVideoUrl) {
      return NextResponse.json({ error: "Video URL not found" }, { status: 404 });
    }

    // DIRECT PROXY LINK: Dito natin pinapadaan sa Proxy Route
    const directProxyUrl = `/api/download?url=${encodeURIComponent(rawVideoUrl)}`;

    return NextResponse.json({ downloadUrl: directProxyUrl });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch TikTok data" }, { status: 500 });
  }
}