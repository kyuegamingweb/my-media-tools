"use client";

import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools" | "donation">("social");
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingBg, setLoadingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState("");
  const [resultBgImage, setResultBgImage] = useState("");
  const [downloading, setDownloading] = useState(false);

  // TikTok Downloader States
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [loadingTiktok, setLoadingTiktok] = useState(false);

  const handleTabChange = (tab: "social" | "tools" | "donation") => {
    if (tab === activeTab) return;
    setIsAnimating(true);
    setMobileMenuOpen(false);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 150);
  };

  // NEW: Handler para sa TikTok Download
  const handleTikTokDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tiktokUrl) return;
    setLoadingTiktok(true);
    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tiktokUrl }),
      });
      const data = await res.json();
      if (data.success) {
        window.open(data.downloadUrl, "_blank");
      } else {
        alert("Error: " + (data.error || "Failed to download"));
      }
    } catch {
      alert("Connection error.");
    } finally {
      setLoadingTiktok(false);
    }
  };

  const handleRemoveBackground = async (file: File) => {
    if (!file) return;
    setLoadingBg(true);
    setBgProgress("Initializing AI...");
    try {
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          const percent = Math.round((current / total) * 100);
          setBgProgress(key.includes("compute") ? `Processing: ${percent}%` : `Loading AI: ${percent}%`);
        },
      });
      setResultBgImage(URL.createObjectURL(blob));
    } catch {
      alert("Error removing background.");
    } finally {
      setLoadingBg(false);
      setBgProgress("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#111410] text-[#e2e8f0] font-sans overflow-x-hidden">
      {/* Sidebar - WALANG BINAGO DITO */}
      <aside className="hidden md:flex w-64 bg-[#111410] p-6 flex-col gap-6 border-r border-[#1e251c] shrink-0">
        <div className="text-xl font-bold text-[#73ee98] tracking-wider mb-2">KYUE TOOLS</div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => handleTabChange("social")} className={`px-4 py-3 rounded-2xl text-sm font-medium ${activeTab === "social" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>🌐 Social</button>
          <button onClick={() => handleTabChange("tools")} className={`px-4 py-3 rounded-2xl text-sm font-medium ${activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>🛠 Tools</button>
          <button onClick={() => handleTabChange("donation")} className={`px-4 py-3 rounded-2xl text-sm font-medium ${activeTab === "donation" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>💳 Donation</button>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-[#161a14] md:rounded-l-[40px] md:my-3 md:mr-3 overflow-y-auto">
        {activeTab === "tools" && (
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-8">Tools</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* TikTok Video Downloader Card - UPDATED */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6">
                <h2 className="text-base font-bold text-white mb-4">Video Downloader</h2>
                <form onSubmit={handleTikTokDownload} className="space-y-2">
                  <input 
                    type="text" 
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    placeholder="Paste TikTok URL here" 
                    className="w-full bg-[#111410] border border-[#2a3627] p-3 rounded-xl text-xs text-white"
                  />
                  <button type="submit" disabled={loadingTiktok} className="w-full bg-[#2d3f28] text-[#73ee98] py-2 rounded-xl text-xs font-bold">
                    {loadingTiktok ? "Processing..." : "Download"}
                  </button>
                </form>
              </div>

              {/* Ibang tools (Photo, Audio) - Pwede mong lagyan ng same logic */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 opacity-50">
                <h2 className="text-base font-bold text-white">Photo Downloader</h2>
                <p className="text-[10px] text-gray-500">Coming soon...</p>
              </div>

              {/* Remove Background - WALANG BINAGO */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6">
                <h2 className="text-base font-bold text-white mb-4">Remove Background</h2>
                <input type="file" onChange={(e) => e.target.files && handleRemoveBackground(e.target.files[0])} />
              </div>

            </div>
          </div>
        )}
        {/* Iba pang tabs (Social/Donation) - HINDI KO GINALAW */}
      </main>
    </div>
  );
}