import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Layer 1: TikWM API
  try {
    const res1 = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36"
      },
      cache: "no-store"
    });
    const data1 = await res1.json();

    if (data1.code === 0 && data1.data) {
      const playUrl = data1.data.play || data1.data.wmplay;
      const musicUrl = data1.data.music || data1.data.music_info?.play || playUrl;
      return NextResponse.json({ downloadUrl: playUrl, audioUrl: musicUrl });
    }
  } catch (e) {
    console.log("Layer 1 failed, trying Layer 2...");
  }

  // Layer 2: Tiklydown Backup API
  try {
    const res2 = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(targetUrl)}`, {
      cache: "no-store"
    });
    const data2 = await res2.json();

    const playUrl = data2.video?.noWatermark || data2.url;
    const musicUrl = data2.music?.play_url || playUrl;

    if (playUrl) {
      return NextResponse.json({ downloadUrl: playUrl, audioUrl: musicUrl });
    }
  } catch (e) {
    console.log("Layer 2 failed, trying Layer 3...");
  }

  // Layer 3: LoFi Direct Extractor Backup
  try {
    const res3 = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}&hd=1`, {
      cache: "no-store"
    });
    const data3 = await res3.json();
    if (data3.data) {
      return NextResponse.json({ 
        downloadUrl: data3.data.hdplay || data3.data.play, 
        audioUrl: data3.data.music || data3.data.play 
      });
    }
  } catch (e) {
    console.log("Layer 3 failed.");
  }

  return NextResponse.json({ error: "Hindi makuha ang video/audio link. Paki-check ang TikTok URL." }, { status: 400 });
}