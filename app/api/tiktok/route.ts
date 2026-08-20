import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Provider 1: TikWM
  try {
    const res1 = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const data1 = await res1.json();

    if (data1.code === 0 && data1.data) {
      const playUrl = data1.data.play || data1.data.wmplay;
      const musicUrl = data1.data.music || data1.data.music_info?.play || playUrl;
      return NextResponse.json({ downloadUrl: playUrl, audioUrl: musicUrl });
    }
  } catch (e) {
    console.log("TikWM primary provider failed, trying secondary...");
  }

  // Provider 2: Tiklydown (Backup Provider)
  try {
    const res2 = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(targetUrl)}`);
    const data2 = await res2.json();

    const playUrl = data2.video?.noWatermark || data2.url;
    const musicUrl = data2.music?.play_url || playUrl;

    if (playUrl) {
      return NextResponse.json({ downloadUrl: playUrl, audioUrl: musicUrl });
    }
  } catch (e) {
    console.log("Tiklydown backup failed.");
  }

  return NextResponse.json({ error: "Hindi makuha ang link." }, { status: 400 });
}