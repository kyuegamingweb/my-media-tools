import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url, type } = await req.json();
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (data.code === 0) {
      return NextResponse.json({
        success: true,
        downloadUrl: type === 'audio' ? data.data.music : data.data.play,
      });
    }
    return NextResponse.json({ success: false, error: "Video not found" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}