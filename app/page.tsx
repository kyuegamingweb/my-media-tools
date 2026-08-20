"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("tools");
  
  // TikTok Downloader State
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleTikTokSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tiktokUrl) return;
    setLoading(true);
    setVideoUrl("");
    setAudioUrl("");

    try {
      const res = await fetch(`/api/tiktok?url=${encodeURIComponent(tiktokUrl.trim())}`);
      const data = await res.json();

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setAudioUrl(data.audioUrl || data.videoUrl);
      } else {
        alert(data.error || "Hindi makuha ang link.");
      }
    } catch (err) {
      alert("May error sa pag-fetch ng TikTok link.");
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = (mediaUrl: string, type: "video" | "audio") => {
    if (!mediaUrl) return;
    const streamEndpoint = `/api/stream?url=${encodeURIComponent(mediaUrl)}&type=${type}`;
    const a = document.createElement("a");
    a.href = streamEndpoint;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="flex min-h-screen bg-[#111410] text-[#e2e8f0] font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#111410] p-6 flex flex-col gap-6 border-r border-[#1e251c]">
        <div className="text-xl font-bold text-[#73ee98] tracking-wider mb-2">KYUE APPS</div>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${activeTab === "social" ? "bg-[#283823] text-[#73ee98]" : "text-gray-400 hover:text-white hover:bg-[#182016]"}`}
          >
            🌐 Social
          </button>
          <button 
            onClick={() => setActiveTab("preset")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${activeTab === "preset" ? "bg-[#283823] text-[#73ee98]" : "text-gray-400 hover:text-white hover:bg-[#182016]"}`}
          >
            🎛 Preset
          </button>
          <button 
            onClick={() => setActiveTab("resource")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${activeTab === "resource" ? "bg-[#283823] text-[#73ee98]" : "text-gray-400 hover:text-white hover:bg-[#182016]"}`}
          >
            📁 Resource
          </button>
          <button 
            onClick={() => setActiveTab("tools")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98] font-semibold shadow-md" : "text-gray-400 hover:text-white hover:bg-[#182016]"}`}
          >
            🛠 Tools
          </button>
          <button 
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${activeTab === "contact" ? "bg-[#283823] text-[#73ee98]" : "text-gray-400 hover:text-white hover:bg-[#182016]"}`}
          >
            ✉ Contact Us
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-[#161a14] rounded-l-[40px] border-l border-[#222a1f] my-3 mr-3 shadow-2xl overflow-y-auto">
        <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Tools</h1>

        {/* Tools Cards Grid - TikTok Downloader Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#283823] text-[#73ee98] rounded-xl font-bold text-xs">HQ</div>
                  <div>
                    <h2 className="text-base font-bold text-white">TikTok Downloader</h2>
                    <span className="text-xs text-gray-400">HQ Media Fetch <span className="bg-[#2d3f28] text-[#73ee98] px-1.5 py-0.5 rounded text-[10px]">1.0.0</span></span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleTikTokSubmit} className="space-y-4 mb-4">
                <div className="bg-[#141812] border border-[#283525] focus-within:border-[#73ee98] rounded-2xl p-3 flex items-center gap-2 transition">
                  <span className="text-gray-500 pl-2 text-sm">🔗</span>
                  <input 
                    type="text" 
                    placeholder="Paste TikTok link here..." 
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2d3f28] hover:bg-[#385032] text-[#73ee98] font-bold py-3.5 rounded-xl transition text-xs border border-[#3e5837] shadow"
                >
                  {loading ? "Processing..." : "Extract Media"}
                </button>
              </form>

              {(videoUrl || audioUrl) && (
                <div className="space-y-2 pt-2 border-t border-[#2a3627]">
                  {videoUrl && (
                    <button 
                      onClick={() => triggerDownload(videoUrl, "video")}
                      className="w-full bg-[#354f2f] hover:bg-[#41623a] text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                    >
                      🎬 Download MP4 Video
                    </button>
                  )}
                  {audioUrl && (
                    <button 
                      onClick={() => triggerDownload(audioUrl, "audio")}
                      className="w-full bg-[#1f2d1c] hover:bg-[#283b24] text-[#73ee98] font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-[#2a3d25]"
                    >
                      🎵 Download MP3 Audio
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 bg-[#141812] p-3 rounded-xl border border-[#232d20] text-[11px] text-gray-400 flex items-start gap-2">
              <span className="text-[#73ee98] font-bold">ℹ</span>
              <span>Restructures MP4 container metadata directly without compression.</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}