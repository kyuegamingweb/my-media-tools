import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    // Kinukuha ang video buffer sa server side para maipasa bilang file download
    const response = await fetch(videoUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
    }

    const videoBuffer = await response.arrayBuffer();

    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="tiktok-video.mp4"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Server error during download" }, { status: 500 });
  }
}