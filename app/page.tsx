"use client";

import { useState } from "react";
import axios from "axios";
import { Music, Video, Loader2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post("/api/tiktok", { url });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred while processing the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f120e] text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-[#1a1f16] border border-[#2d3824] rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-[#86efac]">
          TikTok Downloader & Audio Extractor
        </h1>
        <p className="text-gray-400 text-center text-sm mb-6">
          100% Free, Clean, & Ad-Free Downloader
        </p>

        <form onSubmit={handleDownload} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Paste TikTok link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-[#0f120e] border border-[#2d3824] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#86efac]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e3d1d] hover:bg-[#3d5227] text-[#86efac] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Get Download Links"}
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

        {result && (
          <div className="mt-6 p-4 bg-[#0f120e] border border-[#2d3824] rounded-xl flex flex-col items-center gap-4">
            <img src={result.cover} alt="Thumbnail" className="w-32 h-32 object-cover rounded-lg" />
            <p className="text-sm font-medium text-center line-clamp-2">{result.title}</p>
            
            <div className="flex gap-4 w-full">
              <a
                href={result.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#86efac] text-black font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm hover:opacity-90"
              >
                <Video size={16} /> Download Video
              </a>
              <a
                href={result.musicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#2d3824] text-[#86efac] font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-[#3d5227]"
              >
                <Music size={16} /> Download Audio (MP3)
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}