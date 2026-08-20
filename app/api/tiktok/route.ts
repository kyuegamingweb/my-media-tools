import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Direct call sa Cobalt public API instance (MP4 Video)
    const videoRes = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: targetUrl,
        videoQuality: "max",
      }),
    });

    const videoData = await videoRes.json();

    // Direct call para sa MP3 Audio
    const audioRes = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: targetUrl,
        downloadMode: "audio",
        audioFormat: "mp3",
      }),
    });

    const audioData = await audioRes.json();

    const downloadUrl = videoData.url || videoData.picker?.[0]?.url;
    const audioUrl = audioData.url || downloadUrl;

    if (downloadUrl) {
      return NextResponse.json({ downloadUrl, audioUrl });
    } else {
      return NextResponse.json({ error: "Hindi ma-parse ang TikTok link." }, { status: 400 });
    }
  } catch (err) {
    console.error("Cobalt API error:", err);
    return NextResponse.json({ error: "Server connection failed" }, { status: 500 });
  }
}