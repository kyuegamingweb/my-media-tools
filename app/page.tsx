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

  // DIRECT BLOB DOWNLOAD HANDLER (NO NEW TAB)
  const handleForceDownload = async () => {
    if (!videoUrl) return;
    setDownloading(true);

    try {
      // Kukunin ang video stream sa client side
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      // Gagawan ng Blob File link sa memory ng browser
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `tiktok-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Direct download fallback:", error);
      // Kapag ginipit ng CORS, gagamit ng CORS Proxy para mapilit ang download
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 text-center">
        <h1 className="text-3xl font-bold mb-6 text-green-400">
          TikTok Downloader
        </h1>

        <form onSubmit={handleProcess} className="space-y-4">
          <input
            type="text"
            placeholder="Paste TikTok link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? "Processing..." : "Get Video"}
          </button>
        </form>

        {videoUrl && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={handleForceDownload}
              disabled={downloading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
            >
              {downloading ? "Downloading File..." : "Direct Download MP4"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}