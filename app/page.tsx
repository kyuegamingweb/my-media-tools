"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setVideoUrl("");

    try {
      const res = await fetch(`/api/tiktok?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data.downloadUrl) {
        setVideoUrl(data.downloadUrl);
      } else {
        alert("Hindi makuha ang video link.");
      }
    } catch (err) {
      console.error(err);
      alert("May error sa pag-fetch ng TikTok link.");
    } finally {
      setLoading(false);
    }
  };

  // DIRECT FILE DOWNLOAD (WALANG NEW TAB)
  const handleForceDownload = async () => {
    if (!videoUrl) return;
    setDownloading(true);

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `tiktok-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Direct download fallback:", error);
      const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(videoUrl)}`;
      const response = await fetch(corsProxyUrl);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `tiktok-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#090b08] text-white selection:bg-[#4ade80] selection:text-black">
      {/* CARD CONTAINER WITH PRO GLOW */}
      <div className="max-w-md w-full bg-[#121611]/90 backdrop-blur-md p-8 rounded-[32px] border border-[#232b20] text-center shadow-[0_0_50px_-12px_rgba(74,222,128,0.15)] relative overflow-hidden">
        
        {/* TITLE */}
        <h1 className="text-3xl font-extrabold text-[#73ee98] tracking-tight leading-snug mb-2">
          TikTok <br /> Downloader & <br /> Audio Extractor
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
          100% Free, Clean, & Ad-Free <br /> Downloader
        </p>

        {/* INPUT & BUTTON FORM */}
        <form onSubmit={handleProcess} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Paste TikTok link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-[#181f16] text-gray-100 border border-[#283525] focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] placeholder-gray-500 transition-all duration-200 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#233a1c] hover:bg-[#2c4b24] active:scale-[0.98] text-[#73ee98] font-bold py-4 rounded-2xl transition-all duration-200 border border-[#34572a] shadow-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : "Get Download Links"}
          </button>
        </form>

        {/* RESULT AREA */}
        {videoUrl && (
          <div className="mt-6 pt-6 border-t border-[#232b20] space-y-3">
            <button
              onClick={handleForceDownload}
              disabled={downloading}
              className="w-full bg-[#325827] hover:bg-[#3d6c30] active:scale-[0.98] disabled:bg-[#181f16] text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg border border-[#487a3a]"
            >
              {downloading ? "Downloading MP4..." : "⚡ Direct Download MP4"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}