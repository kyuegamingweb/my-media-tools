import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    // 1. Kukunin ang totoong video file gamit ang backend server
    const response = await fetch(videoUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
      redirect: "follow", // Susundan ang lahat ng CDN redirects
    });

    if (!response.ok) throw new Error("Failed to fetch video file");

    // 2. Kukunin bilang raw ArrayBuffer (Binary Data)
    const videoData = await response.arrayBuffer();

    // 3. I-pumilit sa browser na ITREAT ITO BILANG DOWNLOADABLE FILE (.mp4)
    return new NextResponse(videoData, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'attachment; filename="tiktok-video.mp4"',
        "Content-Length": videoData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Failed to download video" }, { status: 500 });
  }
}