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

  const handleTabChange = (tab: "social" | "tools" | "donation") => {
    if (tab === activeTab) return;
    setIsAnimating(true);
    setMobileMenuOpen(false);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 150);
  };

  const handleUnavailable = (e: React.FormEvent) => {
    e.preventDefault();
    alert("⚠️ Notice: The TikTok Downloaders are currently UNAVAILABLE due to maintenance and API restrictions. We are working on a fix!");
  };

  const handleRemoveBackground = async (file: File) => {
    if (!file) return;
    setLoadingBg(true);
    setBgProgress("Initializing AI...");
    setResultBgImage("");
    try {
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          const percent = Math.round((current / total) * 100);
          setBgProgress(key.includes("compute") ? `Processing: ${percent}%` : `Loading AI: ${percent}%`);
        },
      });
      setResultBgImage(URL.createObjectURL(blob));
    } catch {
      alert("Error removing background. Please try again.");
    } finally {
      setLoadingBg(false);
      setBgProgress("");
    }
  };

  const downloadFile = async (targetUrl: string) => {
    if (!targetUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kyue_bg_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch { window.open(targetUrl, "_blank"); }
    finally { setDownloading(false); }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#111410] text-[#e2e8f0] font-sans">
      <aside className="hidden md:flex w-64 bg-[#111410] p-6 flex-col gap-6 border-r border-[#1e251c]">
        <div className="text-xl font-bold text-[#73ee98] tracking-wider mb-2">KYUE TOOLS</div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => handleTabChange("social")} className={`px-4 py-3 rounded-2xl text-sm font-medium ${activeTab === "social" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>Social</button>
          <button onClick={() => handleTabChange("tools")} className={`px-4 py-3 rounded-2xl text-sm font-medium ${activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>Tools</button>
          <button onClick={() => handleTabChange("donation")} className={`px-4 py-3 rounded-2xl text-sm font-medium ${activeTab === "donation" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>Donation</button>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-[#161a14] md:rounded-l-[40px] md:my-3 md:mr-3 overflow-y-auto">
        {activeTab === "tools" && (
          <div>
            <div className="mb-6 bg-amber-950/30 border border-amber-900/50 p-4 rounded-2xl text-amber-200 text-sm">
              📢 <b>System Status:</b> TikTok Downloaders are temporarily <b>UNAVAILABLE</b> for maintenance. We are working to resolve the API blocks.
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-8">Tools</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {["Video Downloader", "Photo Downloader", "Audio Extractor"].map((tool) => (
                <div key={tool} className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 opacity-70">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="px-3 py-1 bg-amber-900 text-amber-300 rounded-lg text-[10px] font-bold uppercase">Unavailable</div>
                    <h2 className="text-base font-bold text-white">{tool}</h2>
                  </div>
                  <button onClick={handleUnavailable} className="w-full bg-[#1e251c] text-gray-500 py-3 rounded-xl text-xs font-bold border border-[#2a3627] cursor-not-allowed">
                    Maintenance in Progress
                  </button>
                </div>
              ))}
              
              {/* Active Tool */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6">
                <h2 className="text-base font-bold text-white mb-4">Remove Background</h2>
                <label className="block border-2 border-dashed border-[#354f2f] rounded-2xl p-6 text-center cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleRemoveBackground(e.target.files[0])} />
                  {loadingBg ? <p className="text-xs text-[#73ee98]">{bgProgress}</p> : <p className="text-xs text-gray-300">Click to upload image</p>}
                </label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}