import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    // Ito ay gumagamit ng pampublikong API para i-bypass ang scraping issues
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(api);
    const data = await response.json();

    if (data.code === 0) {
      return NextResponse.json({
        success: true,
        downloadUrl: data.data.play,
        title: data.data.title,
      });
    } else {
      return NextResponse.json({ success: false, error: "Video not found or API blocked" }, { status: 400 });
    }
  } catch (error) {
    console.error("TikTok API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}