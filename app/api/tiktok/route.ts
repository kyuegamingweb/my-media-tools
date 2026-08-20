import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url, type } = await req.json();
    
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const data = await response.json();

    if (data.code === 0) {
      if (type === 'photo') {
        // Ibinabalik ang buong array ng images para sa slideshow photos
        return NextResponse.json({
          success: true,
          images: data.data.images || [data.data.play],
        });
      }

      let downloadUrl = data.data.play;
      if (type === 'audio') {
        downloadUrl = data.data.music;
      }

      return NextResponse.json({
        success: true,
        downloadUrl: downloadUrl,
      });
    }
    
    return NextResponse.json({ success: false, error: "Hindi mahanap ang media. Pakisubukan ang ibang link." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error sa pag-fetch ng link." }, { status: 500 });
  }
}