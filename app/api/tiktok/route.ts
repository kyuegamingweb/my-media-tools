import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  try {
    const apiRes = await fetch(
      `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(targetUrl)}`
    );

    if (!apiRes.ok) {
      throw new Error("Failed to fetch from TikTok API service");
    }

    const data = await apiRes.json();

    // 1. Pagsusuri para sa Photo Slideshows
    let rawImages = data.images || data.image_post_info?.images || data.slider || [];
    let imageUrls: string[] = [];

    if (Array.isArray(rawImages) && rawImages.length > 0) {
      imageUrls = rawImages.map((img: any) => {
        if (typeof img === "string") return img;
        return img.url || img.url_list?.[0] || img.image_url?.url_list?.[0] || "";
      }).filter(Boolean);
    }

    // 2. Pagsusuri para sa Video URL
    const videoUrl =
      data.video?.noWatermark ||
      data.video?.watermark ||
      data.video?.play_addr?.url_list?.[0] || "";

    // 3. Pagsusuri para sa Audio / MP3 URL
    const audioUrl =
      data.music?.play_url ||
      data.audio?.play_url ||
      data.music ||
      "";

    // I-return ang tamang format batay sa kung ano ang nahanap
    if (imageUrls.length > 0) {
      return NextResponse.json({
        type: "image",
        images: imageUrls,
        audioUrl: audioUrl || videoUrl,
      });
    }

    if (videoUrl) {
      return NextResponse.json({
        type: "video",
        videoUrl,
        audioUrl: audioUrl || videoUrl,
      });
    }

    return NextResponse.json({ error: "Walang nahanap na media sa link na ito." }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error fetching media. Pakisubukan muli ang link." },
      { status: 500 }
    );
  }
}