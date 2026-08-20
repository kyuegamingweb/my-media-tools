import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Walang link na ibinigay." }, { status: 400 });
    }

    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Hindi ma-access ang TikTok service." }, { status: 500 });
    }

    const data = await response.json();

    if (data.code === 0 && data.data) {
      const result = data.data;

      if (result.images && result.images.length > 0) {
        return NextResponse.json({
          type: "image",
          images: result.images,
        });
      }

      return NextResponse.json({
        type: "video",
        videoUrl: result.play,
        audioUrl: result.music,
      });
    } else {
      return NextResponse.json({ error: data.msg || "Hindi makuha ang media sa link na ito." }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Server Error: ${err.message || "Unknown error"}` }, { status: 500 });
  }
}