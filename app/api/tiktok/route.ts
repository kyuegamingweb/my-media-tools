import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  try {
    // Gagamit tayo ng tikwm API na mas stable para sa video, audio, at photo slideshows
    const apiRes = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}`
    );

    if (!apiRes.ok) {
      throw new Error("Failed to connect to TikTok parser");
    }

    const json = await apiRes.json();
    if (json.code !== 0 || !json.data) {
      return NextResponse.json(
        { error: "Hindi mahanap ang media sa link na ito. Siguraduhing tama ang URL." },
        { status: 404 }
      );
    }

    const data = json.data;

    // 1. Check kung Photo Slideshow ito
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      return NextResponse.json({
        type: "image",
        images: data.images,
        audioUrl: data.music || data.play || "",
      });
    }

    // 2. Kung Video ito
    const videoUrl = data.play || data.hdplay || "";
    const audioUrl = data.music || "";

    if (videoUrl) {
      return NextResponse.json({
        type: "video",
        videoUrl,
        audioUrl,
      });
    }

    return NextResponse.json(
      { error: "Walang nahanap na valid media." },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error fetching media. Pakisubukan muli ang link." },
      { status: 500 }
    );
  }
}