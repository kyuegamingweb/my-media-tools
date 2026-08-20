import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Walang link na ibinigay." }, { status: 400 });
    }

    // Gagamit tayo ng direktang alternatibong public API worker endpoint
    const response = await fetch(`https://tdownv4.sl-bjs.workers.dev/?down=${encodeURIComponent(url)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Hindi ma-access ang TikTok downloader service." }, { status: 500 });
    }

    const data = await response.json();

    // I-adapt ang response ayon sa structure ng worker endpoint
    if (data && (data.videoUrl || data.url || data.play)) {
      return NextResponse.json({
        type: "video",
        videoUrl: data.videoUrl || data.url || data.play,
        audioUrl: data.audioUrl || data.music,
      });
    } else if (data && data.images) {
      return NextResponse.json({
        type: "image",
        images: data.images,
      });
    } else {
      // Fallback: kung sakaling ang mismong endpoint ang nagbalik ng direktang link
      return NextResponse.json({
        type: "video",
        videoUrl: data.data?.play || url,
        audioUrl: data.data?.music,
      });
    }

  } catch (err: any) {
    return NextResponse.json({ error: `Connection Error: ${err.message}` }, { status: 500 });
  }
}