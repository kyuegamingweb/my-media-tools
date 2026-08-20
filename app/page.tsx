"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setDownloadUrl("");

    try {
      const res = await fetch(`/api/tiktok?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
      } else {
        alert("Hindi makuha ang video link.");
      }
    } catch (err) {
      console.error(err);
      alert("May error sa pag-fetch ng TikTok video.");
    } finally {
      setLoading(false);
    }
  };

  // DIRECT DOWNLOAD TRIGGER (WALANG NEW TAB)
  const handleDirectDownload = async () => {
    if (!downloadUrl) return;
    setDownloading(true);

    try {
      // 1. Hihingin sa sariling server ang file
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Download failed");

      // 2. Gagawing Blob/File Object sa memory ng browser
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // 3. Pipilitin ang browser na i-save ang file nang WALANG BINUBUKSANG NEW TAB
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "tiktok-video.mp4";
      document.body.appendChild(a);
      a.click();

      // 4. Cleanup
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Error sa pag-download ng file.");
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

        {downloadUrl && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={handleDirectDownload}
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