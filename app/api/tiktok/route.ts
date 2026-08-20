import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Walang link na ibinigay." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const data = await response.json();

    if (data.code === 0 && data.data) {
      const result = data.data;

      // Kung photo slideshow / image posts
      if (result.images && result.images.length > 0) {
        return NextResponse.json({
          type: "image",
          images: result.images,
        });
      }

      // Kung regular video
      return NextResponse.json({
        type: "video",
        videoUrl: result.play,
        audioUrl: result.music,
      });
    } else {
      return NextResponse.json({ error: "Hindi makuha ang media. Subukan muli." }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "May error sa pag-fetch ng media." }, { status: 500 });
  }
}