import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Call Cobalt API for MP4 Video
    const videoRes = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: targetUrl.trim(),
        videoQuality: "max",
      }),
    });

    const videoData = await videoRes.json();

    // Call Cobalt API for MP3 Audio
    const audioRes = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: targetUrl.trim(),
        downloadMode: "audio",
        audioFormat: "mp3",
      }),
    });

    const audioData = await audioRes.json();

    const videoUrl = videoData.url || videoData.picker?.[0]?.url;
    const audioUrl = audioData.url || videoUrl;

    if (videoUrl) {
      return NextResponse.json({ videoUrl, audioUrl });
    }
  } catch (err) {
    console.error("Cobalt API primary failed, using fallback...");
  }

  // Backup Provider (TikWM) if Cobalt is slow
  try {
    const resBackup = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl.trim())}`);
    const backupData = await resBackup.json();

    if (backupData.code === 0 && backupData.data) {
      return NextResponse.json({
        videoUrl: backupData.data.play || backupData.data.wmplay,
        audioUrl: backupData.data.music || backupData.data.play,
      });
    }
  } catch (e) {
    console.error("Fallback failed");
  }

  return NextResponse.json({ error: "Hindi makuha ang link. Paki-check ang TikTok URL." }, { status: 400 });
}