"use client";

import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools" | "donation">("social");
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States para sa Remove Background
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
    alert("⚠️ Notice: The TikTok Downloader tools are currently UNAVAILABLE due to maintenance and API restrictions. We are working on a fix!");
  };

  // Handler para sa Remove Background
  const handleRemoveBackground = async (file: File) => {
    if (!file) return;
    setLoadingBg(true);
    setBgProgress("Initializing AI...");
    setResultBgImage("");

    try {
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          const percent = Math.round((current / total) * 100);
          if (key.includes("compute")) {
            setBgProgress(`Processing: ${percent}%`);
          } else {
            setBgProgress(`Loading AI: ${percent}%`);
          }
        },
      });
      const url = URL.createObjectURL(blob);
      setResultBgImage(url);
    } catch {
      alert("Error removing background. Please try again.");
    } finally {
      setLoadingBg(false);
      setBgProgress("");
    }
  };

  // Direktang pag-download para sa background removal
  const downloadFile = async (targetUrl: string, type: "bg") => {
    if (!targetUrl) return;
    setDownloading(true);

    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const filename = `kyue_bg_${Date.now()}.png`;

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(targetUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#111410] text-[#e2e8f0] font-sans overflow-x-hidden">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111410] border-b border-[#1e251c]">
        <div className="text-lg font-bold text-[#73ee98] tracking-wider">KYUE TOOLS</div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 focus:outline-none"
        >
          {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111410] border-b border-[#1e251c] p-4 flex flex-col gap-2">
          <button 
            onClick={() => handleTabChange("social")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
              activeTab === "social" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"
            }`}
          >
            🌐 Social
          </button>
          <button 
            onClick={() => handleTabChange("tools")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
              activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"
            }`}
          >
            🛠 Tools
          </button>
          <button 
            onClick={() => handleTabChange("donation")}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${
              activeTab === "donation" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"
            }`}
          >
            💳 Donation
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#111410] p-6 flex-col gap-6 border-r border-[#1e251c] shrink-0">
        <div className="text-xl font-bold text-[#73ee98] tracking-wider mb-2">KYUE TOOLS</div>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => handleTabChange("social")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "social" 
                ? "bg-[#2d3f28] text-[#73ee98] font-semibold shadow-lg border border-[#385032] translate-x-1" 
                : "text-gray-400 hover:text-white hover:bg-[#182016]"
            }`}
          >
            🌐 Social
          </button>
          
          <button 
            onClick={() => handleTabChange("tools")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "tools" 
                ? "bg-[#2d3f28] text-[#73ee98] font-semibold shadow-lg border border-[#385032] translate-x-1" 
                : "text-gray-400 hover:text-white hover:bg-[#182016]"
            }`}
          >
            🛠 Tools
          </button>

          <button 
            onClick={() => handleTabChange("donation")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === "donation" 
                ? "bg-[#2d3f28] text-[#73ee98] font-semibold shadow-lg border border-[#385032] translate-x-1" 
                : "text-gray-400 hover:text-white hover:bg-[#182016]"
            }`}
          >
            💳 Donation
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 bg-[#161a14] md:rounded-l-[40px] md:border-l border-[#222a1f] md:my-3 md:mr-3 shadow-2xl overflow-y-auto">
        <div className={`transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          {activeTab === "social" && (
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">Social Platforms</h1>
              <p className="text-gray-400 text-sm mb-8">Select a social media card or tool you want to open:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* TikTok Profile Card */}
                <a
                  href="https://www.tiktok.com/@kyyue_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1c231a] border border-[#2a3627] hover:border-[#69c9d0] transition-all cursor-pointer rounded-[28px] p-6 flex flex-col justify-between shadow-lg group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#69c9d0]/10 border border-[#69c9d0]/30 flex items-center justify-center text-lg text-[#69c9d0] font-bold">✨</div>
                      <div>
                        <h2 className="text-base font-bold text-white group-hover:text-[#69c9d0]">kyue.</h2>
                        <span className="text-xs text-gray-400">@kyyue_</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center border-t border-[#2a3627] pt-4 mt-4">
                    <div>
                      <div className="font-bold text-white text-sm">220</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">Following</div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">346</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">Followers</div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">7.7k</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">Likes</div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-[#69c9d0] font-semibold text-right">Visit TikTok ↗</div>
                </a>

                {/* Instagram Profile Card */}
                <a
                  href="https://www.instagram.com/vxjyue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1c231a] border border-[#2a3627] hover:border-[#e1306c] transition-all cursor-pointer rounded-[28px] p-6 flex flex-col justify-between shadow-lg group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#e1306c]/10 border border-[#e1306c]/30 flex items-center justify-center text-lg text-[#e1306c] font-bold">📸</div>
                      <div>
                        <h2 className="text-base font-bold text-white group-hover:text-[#e1306c]">vxjyue</h2>
                        <span className="text-xs text-gray-400">jyue • love music &lt;3</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center border-t border-[#2a3627] pt-4 mt-4">
                    <div>
                      <div className="font-bold text-white text-sm">3</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">Posts</div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">112</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">Followers</div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">114</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">Following</div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-[#e1306c] font-semibold text-right">Visit Instagram ↗</div>
                </a>

              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <div className="mb-6 bg-amber-950/40 border border-amber-900/60 p-4 rounded-2xl text-amber-300 text-xs flex items-center justify-between">
                <span>⚠️ <b>Notice:</b> TikTok Downloaders are temporarily <b>UNAVAILABLE / MAINTENANCE</b> due to API restrictions. We are working on a fix!</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-8 tracking-tight">Tools</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* VIDEO DOWNLOADER CARD - UNAVAILABLE */}
                <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between shadow-lg opacity-75">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 bg-amber-950 text-amber-400 rounded-lg font-bold text-[10px] border border-amber-800">UNAVAILABLE</div>
                        <div>
                          <h2 className="text-base font-bold text-white">Video Downloader</h2>
                          <span className="text-xs text-gray-400">TikTok No Watermark</span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleUnavailable} className="space-y-4 mb-4">
                      <div className="bg-[#141812] border border-[#283525] rounded-2xl p-3 flex items-center gap-2 opacity-50">
                        <span className="text-gray-500 pl-2 text-sm">🎬</span>
                        <input 
                          type="text" 
                          disabled 
                          placeholder="Maintenance in progress..." 
                          className="w-full bg-transparent text-xs text-gray-500 focus:outline-none cursor-not-allowed"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#252f22] hover:bg-[#2d3a2a] text-amber-400 font-bold py-3 rounded-xl text-xs border border-[#364832] shadow transition"
                      >
                        Maintenance in Progress
                      </button>
                    </form>
                  </div>
                </div>

                {/* PHOTO DOWNLOADER CARD - UNAVAILABLE */}
                <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between shadow-lg opacity-75">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 bg-amber-950 text-amber-400 rounded-lg font-bold text-[10px] border border-amber-800">UNAVAILABLE</div>
                        <div>
                          <h2 className="text-base font-bold text-white">Photo Downloader</h2>
                          <span className="text-xs text-gray-400">TikTok Slideshow Photos</span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleUnavailable} className="space-y-4 mb-4">
                      <div className="bg-[#141812] border border-[#283525] rounded-2xl p-3 flex items-center gap-2 opacity-50">
                        <span className="text-gray-500 pl-2 text-sm">📸</span>
                        <input 
                          type="text" 
                          disabled 
                          placeholder="Maintenance in progress..." 
                          className="w-full bg-transparent text-xs text-gray-500 focus:outline-none cursor-not-allowed"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#252f22] hover:bg-[#2d3a2a] text-amber-400 font-bold py-3 rounded-xl text-xs border border-[#364832] shadow transition"
                      >
                        Maintenance in Progress
                      </button>
                    </form>
                  </div>
                </div>

                {/* AUDIO EXTRACTOR CARD - UNAVAILABLE */}
                <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between shadow-lg opacity-75">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 bg-amber-950 text-amber-400 rounded-lg font-bold text-[10px] border border-amber-800">UNAVAILABLE</div>
                        <div>
                          <h2 className="text-base font-bold text-white">Audio Extractor</h2>
                          <span className="text-xs text-gray-400">TikTok to MP3</span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleUnavailable} className="space-y-4 mb-4">
                      <div className="bg-[#141812] border border-[#283525] rounded-2xl p-3 flex items-center gap-2 opacity-50">
                        <span className="text-gray-500 pl-2 text-sm">🎙</span>
                        <input 
                          type="text" 
                          disabled 
                          placeholder="Maintenance in progress..." 
                          className="w-full bg-transparent text-xs text-gray-500 focus:outline-none cursor-not-allowed"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#252f22] hover:bg-[#2d3a2a] text-amber-400 font-bold py-3 rounded-xl text-xs border border-[#364832] shadow transition"
                      >
                        Maintenance in Progress
                      </button>
                    </form>
                  </div>
                </div>

                {/* REMOVE BACKGROUND CARD - WORKING */}
                <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-[#73ee98] text-xl font-bold bg-[#283823] p-2 rounded-xl">👤-</div>
                        <div>
                          <h2 className="text-base font-bold text-white">Remove Background</h2>
                          <span className="text-xs text-gray-400">Background Removal</span>
                        </div>
                      </div>
                    </div>

                    <label className={`border-2 border-dashed border-[#354f2f] hover:border-[#73ee98] bg-[#141812] hover:bg-[#182016] transition-all rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer mb-4 block group ${loadingBg ? "pointer-events-none opacity-80" : ""}`}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={loadingBg}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleRemoveBackground(e.target.files[0]);
                          }
                        }}
                      />
                      {loadingBg ? (
                        <div className="flex flex-col items-center space-y-2 py-2">
                          <div className="w-6 h-6 border-2 border-[#73ee98] border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-xs text-[#73ee98] font-bold">
                            {bgProgress || "Processing AI..."}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl mb-2 text-gray-400 group-hover:text-[#73ee98] transition-colors">📁</div>
                          <p className="text-xs text-gray-300 font-medium px-2">
                            Drag & drop video or image here or click to select
                          </p>
                        </>
                      )}
                    </label>

                    {resultBgImage && (
                      <div className="space-y-3 pt-2 border-t border-[#2a3627]">
                        <p className="text-xs font-semibold text-[#73ee98]">✨ Result (Transparent Background):</p>
                        <div className="bg-[#141812] border border-[#2a3627] rounded-xl p-2 flex justify-center">
                          <img src={resultBgImage} alt="No Background" className="max-h-32 object-contain rounded-lg bg-[linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px]" />
                        </div>
                        <button 
                          disabled={downloading}
                          onClick={() => downloadFile(resultBgImage, "bg")}
                          className="w-full bg-[#2d3f28] hover:bg-[#385032] text-[#73ee98] font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-[#3e5837]"
                        >
                          ⬇ {downloading ? "Downloading..." : "Download Transparent PNG"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "donation" && (
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">Donation</h1>
              <p className="text-gray-400 text-sm mb-8">Support the development of Kyue Tools by sending a donation:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* GCASH DONATION CARD */}
                <div className="bg-[#1c231a] border border-[#2a3627] hover:border-[#007dfc] transition-all rounded-[28px] p-6 flex flex-col justify-between shadow-lg group">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#007dfc]/10 border border-[#007dfc]/30 flex items-center justify-center text-lg text-[#007dfc] font-bold">💳</div>
                      <div>
                        <h2 className="text-base font-bold text-white group-hover:text-[#007dfc]">Support Me</h2>
                        <span className="text-xs text-gray-400">GCash Donation</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#141812] border border-[#283525] rounded-2xl p-4 text-center space-y-2 mb-4">
                      <div className="flex justify-center mb-2">
                        <img 
                          src="gcash-qr.png" 
                          alt="GCash QR Code" 
                          className="w-28 h-28 object-contain rounded-xl border border-[#2a3627] bg-white p-1" 
                        />
                      </div>
                      <p className="text-xs text-gray-300 font-medium">Number: <span className="text-[#73ee98] font-bold text-sm">09288476050</span></p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("09288476050");
                      alert("GCash number copied to clipboard!");
                    }}
                    className="w-full bg-[#2d3f28] hover:bg-[#385032] text-[#73ee98] font-bold py-2.5 rounded-xl text-xs border border-[#3e5837] transition"
                  >
                    📋 Copy GCash Number
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}