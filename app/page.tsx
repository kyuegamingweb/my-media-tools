"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools">("social");
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ... (Panatilihin ang states para sa downloaders)

  const handleTabChange = (tab: "social" | "tools") => {
    if (tab === activeTab) return;
    setIsAnimating(true);
    setMobileMenuOpen(false);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 150);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#111410] text-[#e2e8f0] font-sans overflow-x-hidden">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111410] border-b border-[#1e251c]">
        <div className="text-lg font-bold text-[#73ee98] tracking-wider">KYUE APPS</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
          {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111410] border-b border-[#1e251c] p-4 flex flex-col gap-2">
          <button onClick={() => handleTabChange("social")} className={`w-full text-left px-4 py-3 rounded-xl text-sm ${activeTab === "social" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>🌐 Social</button>
          <button onClick={() => handleTabChange("tools")} className={`w-full text-left px-4 py-3 rounded-xl text-sm ${activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>🛠 Tools</button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#111410] p-6 flex-col gap-6 border-r border-[#1e251c] shrink-0">
        <div className="text-xl font-bold text-[#73ee98] tracking-wider mb-2">KYUE APPS</div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => handleTabChange("social")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === "social" ? "bg-[#2d3f28] text-[#73ee98] shadow-lg border border-[#385032] translate-x-1" : "text-gray-400 hover:text-white"}`}>🌐 Social</button>
          <button onClick={() => handleTabChange("tools")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98] shadow-lg border border-[#385032] translate-x-1" : "text-gray-400 hover:text-white"}`}>🛠 Tools</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 bg-[#161a14] md:rounded-l-[40px] md:border-l border-[#222a1f] md:my-3 md:mr-3 shadow-2xl overflow-y-auto">
        <div className={`transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          {activeTab === "social" && (
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-8 tracking-tight">Social Platforms</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* TikTok Profile Card */}
                <a href="https://www.tiktok.com/@kyyue_" target="_blank" className="bg-[#1c231a] border border-[#2a3627] hover:border-[#69c9d0] transition-all cursor-pointer rounded-[28px] p-6 flex flex-col shadow-lg group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#161a14] border-2 border-[#2a3627] flex items-center justify-center text-xl">✨</div>
                    <div>
                      <h2 className="text-base font-bold text-white group-hover:text-[#69c9d0]">kyue.</h2>
                      <p className="text-xs text-gray-400">@kyyue_</p>
                    </div>
                  </div>
                  {/* Realtime Stats Placeholder */}
                  <div className="flex justify-between text-center border-t border-[#2a3627] pt-4 mt-2">
                    <div><div className="font-bold text-white">220</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Following</div></div>
                    <div><div className="font-bold text-white">346</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Followers</div></div>
                    <div><div className="font-bold text-white">7.7k</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Likes</div></div>
                  </div>
                </a>

                {/* Instagram Profile Card */}
                <a href="https://www.instagram.com/vxjyue" target="_blank" className="bg-[#1c231a] border border-[#2a3627] hover:border-[#e1306c] transition-all cursor-pointer rounded-[28px] p-6 flex flex-col shadow-lg group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#161a14] border-2 border-[#2a3627] flex items-center justify-center text-xl">📸</div>
                    <div>
                      <h2 className="text-base font-bold text-white group-hover:text-[#e1306c]">vxjyue</h2>
                      <p className="text-xs text-gray-400">jyue • love music &lt;3</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-center border-t border-[#2a3627] pt-4 mt-2">
                    <div><div className="font-bold text-white">---</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Posts</div></div>
                    <div><div className="font-bold text-white">---</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Followers</div></div>
                    <div><div className="font-bold text-white">---</div><div className="text-[10px] text-gray-500 uppercase tracking-widest">Following</div></div>
                  </div>
                </a>
              </div>
            </div>
          )}
          {/* ... (Tools section) */}
        </div>
      </main>
    </div>
  );
}