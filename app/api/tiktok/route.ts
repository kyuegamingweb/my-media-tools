import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Walang link na ibinigay." }, { status: 400 });
    }

    // Ginamit ang POST method para hindi ma-block ng WAF/Cloudflare ang server request
    const response = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
      body: `url=${encodeURIComponent(url)}&hd=1`,
    });

    if (!response.ok) {
      return NextResponse.json({ error: `API Error: Status ${response.status}` }, { status: 500 });
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
        videoUrl: result.play || result.hdplay,
        audioUrl: result.music,
      });
    } else {
      return NextResponse.json({ error: data.msg || "Hindi makuha ang media sa link na ito." }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Server Error: ${err.message || "Unknown error"}` }, { status: 500 });
  }
}