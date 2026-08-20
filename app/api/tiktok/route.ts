import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Walang link na ibinigay." }, { status: 400 });
    }

    // Paggamit ng alternatibong stable request format para sa TikTok link resolution
    const response = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}&count=12&cursor=0&web=1&hd=1`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.tikwm.com/",
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Kasalukuyang naka-block ang server IP sa TikTok. Subukan ang manual download." }, { status: 500 });
    }

    if (data && data.code === 0 && data.data) {
      const result = data.data;

      if (result.images && result.images.length > 0) {
        return NextResponse.json({
          type: "image",
          images: result.images,
        });
      }

      return NextResponse.json({
        type: "video",
        videoUrl: result.hdplay || result.play,
        audioUrl: result.music,
      });
    } else {
      return NextResponse.json({ error: data?.msg || "Hindi makuha ang media. Subukan ang ibang link." }, { status: 400 });
    }

  } catch (err: any) {
    return NextResponse.json({ error: `Connection Error: ${err.message}` }, { status: 500 });
  }
}