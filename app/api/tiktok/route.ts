import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url, type } = await req.json();
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(api);
    const data = await response.json();

    if (data.code === 0) {
      let downloadUrl = data.data.play;
      
      if (type === 'audio') {
        downloadUrl = data.data.music;
      } else if (type === 'photo') {
        // Kung slideshow/photos, ibabalik ang unang image o ang listahan
        downloadUrl = data.data.images?.[0] || data.data.play;
      }

      return NextResponse.json({
        success: true,
        downloadUrl: downloadUrl,
      });
    }
    return NextResponse.json({ success: false, error: "Error fetching media. Pakisubukan muli ang link." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}