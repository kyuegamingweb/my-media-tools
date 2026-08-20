import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Kailangan ng TikTok URL" }, { status: 400 });
  }

  // Scraper 1: TikWM Primary Engine
  try {
    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl.trim())}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });
    const result = await res.json();

    if (result.code === 0 && result.data) {
      return NextResponse.json({
        videoUrl: result.data.play || result.data.wmplay,
        audioUrl: result.data.music || result.data.music_info?.play || result.data.play,
      });
    }
  } catch (e) {
    console.error("Engine 1 Error");
  }

  // Scraper 2: Tiklydown Backup Engine
  try {
    const res2 = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(targetUrl.trim())}`, {
      cache: "no-store",
    });
    const result2 = await res2.json();

    if (result2.video?.noWatermark) {
      return NextResponse.json({
        videoUrl: result2.video.noWatermark,
        audioUrl: result2.music?.play_url || result2.video.noWatermark,
      });
    }
  } catch (e) {
    console.error("Engine 2 Error");
  }

  return NextResponse.json({ error: "Hindi makuha ang link. Siguraduhing pampublikong TikTok video ito." }, { status: 400 });
}