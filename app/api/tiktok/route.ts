import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Primary Scraper: TikWM
  try {
    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl.trim())}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
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
    console.error("TikWM failed");
  }

  // Backup Scraper: Tiklydown
  try {
    const resBackup = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(targetUrl.trim())}`, {
      cache: "no-store",
    });
    const backupResult = await resBackup.json();

    if (backupResult.video?.noWatermark) {
      return NextResponse.json({
        videoUrl: backupResult.video.noWatermark,
        audioUrl: backupResult.music?.play_url || backupResult.video.noWatermark,
      });
    }
  } catch (e) {
    console.error("Backup failed");
  }

  return NextResponse.json({ error: "Hindi makuha ang link. Pakisiguradong tama ang TikTok URL." }, { status: 400 });
}