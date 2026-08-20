import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const response = await fetch(videoUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch stream");

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="tiktok-video.mp4"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Failed to download" }, { status: 500 });
  }
}