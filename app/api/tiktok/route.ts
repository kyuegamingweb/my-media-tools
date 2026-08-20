import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Walang link na ibinigay." }, { status: 400 });
    }

    // Subukan muna natin ang TikWM API sa pamamagitan ng GET na may mas kumpletong headers
    let response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
      },
    });

    let data = await response.json();

    // Kung sakaling mag-fail, subukan ang alternative endpoint o format
    if (!data || data.code !== 0) {
      return NextResponse.json({ error: "Kasalukuyang hinaharangan ng TikTok/Cloudflare ang request. Subukan mamaya." }, { status: 400 });
    }

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

  } catch (err: any) {
    return NextResponse.json({ error: `Connection Error: ${err.message}` }, { status: 500 });
  }
}