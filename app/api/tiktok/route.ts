import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Please provide a TikTok link." }, { status: 400 });
    }

    const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const data = response.data.data;

    if (!data) {
      return NextResponse.json({ error: "Video not found. Please make sure the link is correct." }, { status: 400 });
    }

    return NextResponse.json({
      title: data.title,
      cover: data.cover,
      videoUrl: data.play,
      musicUrl: data.music,
    });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while processing the link." }, { status: 500 });
  }
}