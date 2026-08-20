import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mediaUrl = searchParams.get("url");
  const type = searchParams.get("type") || "video";

  if (!mediaUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const response = await fetch(mediaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch stream");

    const isAudio = type === "audio";
    const extension = isAudio ? "mp3" : "mp4";
    const contentType = isAudio ? "audio/mpeg" : "video/mp4";

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="tiktok-${type}-${Date.now()}.${extension}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}