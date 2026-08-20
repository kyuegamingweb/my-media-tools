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
      alert("Error sa pag-fetch ng TikTok link.");
    } finally {
      setLoading(false);
    }
  };

  // DIRECT FILE DOWNLOAD LOGIC (WALANG NEW TAB)
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0d0f0c] text-white">
      <div className="max-w-md w-full bg-[#141813] p-8 rounded-3xl border border-[#232a21] text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-[#86efac] leading-tight mb-2">
          TikTok <br /> Downloader & <br /> Audio Extractor
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          100% Free, Clean, & Ad-Free <br /> Downloader
        </p>

        <form onSubmit={handleProcess} className="space-y-4">
          <input
            type="text"
            placeholder="Paste TikTok link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#1a2019] text-gray-200 border border-[#2a3428] focus:outline-none focus:border-[#4ade80] placeholder-gray-500"
          />

          <button
            type="submit"
            className="w-full bg-[#274020] hover:bg-[#325429] text-[#86efac] font-semibold py-4 rounded-2xl transition duration-200"
          >
            {loading ? "Processing..." : "Get Download Links"}
          </button>
        </form>

        {videoUrl && (
          <div className="mt-6 pt-6 border-t border-[#232a21]">
            <button
              onClick={handleForceDownload}
              disabled={downloading}
              className="w-full bg-[#325429] hover:bg-[#3f6a34] disabled:bg-[#1a2019] text-white font-semibold py-4 rounded-2xl transition duration-200"
            >
              {downloading ? "Downloading File..." : "Download MP4"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}