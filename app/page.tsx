"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools">("social");
  
  // States para sa Tools
  const [videoInputUrl, setVideoInputUrl] = useState("");
  const [photoInputUrl, setPhotoInputUrl] = useState("");
  const [audioInputUrl, setAudioInputUrl] = useState("");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#111410] text-[#e2e8f0] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111410] p-6 flex flex-col gap-6 border-r border-[#1e251c]">
        <div className="text-xl font-bold text-[#73ee98] tracking-wider mb-2">KYUE APPS</div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab("social")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === "social" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400 hover:text-white"}`}>🌐 Social</button>
          <button onClick={() => setActiveTab("tools")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400 hover:text-white"}`}>🛠 Tools</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#161a14] overflow-y-auto">
        {activeTab === "social" && (
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-8">Social Platforms</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TikTok Card */}
              <a href="https://www.tiktok.com/@kyyue_" target="_blank" className="bg-[#1c231a] border border-[#2a3627] p-6 rounded-[28px] hover:border-[#69c9d0] transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#161a14] flex items-center justify-center text-xl">✨</div>
                  <div>
                    <h2 className="text-base font-bold text-white">kyue.</h2>
                    <p className="text-xs text-gray-400">@kyyue_</p>
                  </div>
                </div>
                <div className="flex justify-between text-center border-t border-[#2a3627] pt-4">
                  <div><div className="font-bold text-white">220</div><div className="text-[10px] text-gray-500 uppercase">Following</div></div>
                  <div><div className="font-bold text-white">346</div><div className="text-[10px] text-gray-500 uppercase">Followers</div></div>
                  <div><div className="font-bold text-white">7.7k</div><div className="text-[10px] text-gray-500 uppercase">Likes</div></div>
                </div>
              </a>

              {/* Instagram Card */}
              <a href="https://www.instagram.com/vxjyue" target="_blank" className="bg-[#1c231a] border border-[#2a3627] p-6 rounded-[28px] hover:border-[#e1306c] transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#161a14] flex items-center justify-center text-xl">📸</div>
                  <div>
                    <h2 className="text-base font-bold text-white">vxjyue</h2>
                    <p className="text-xs text-gray-400">jyue • love music &lt;3</p>
                  </div>
                </div>
                <div className="flex justify-between text-center border-t border-[#2a3627] pt-4">
                  <div><div className="font-bold text-white">---</div><div className="text-[10px] text-gray-500 uppercase">Posts</div></div>
                  <div><div className="font-bold text-white">---</div><div className="text-[10px] text-gray-500 uppercase">Followers</div></div>
                  <div><div className="font-bold text-white">---</div><div className="text-[10px] text-gray-500 uppercase">Following</div></div>
                </div>
              </a>
            </div>
          </div>
        )}

        {activeTab === "tools" && (
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-8">Tools</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1c231a] p-6 rounded-2xl border border-[#2a3627]">
                <h2 className="font-bold text-lg text-white mb-4">TikTok Downloader</h2>
                <input className="w-full bg-[#161a14] border border-[#2a3627] p-3 rounded-xl mb-4" placeholder="Paste link here..." value={videoInputUrl} onChange={(e) => setVideoInputUrl(e.target.value)} />
              </div>
              <div className="bg-[#1c231a] p-6 rounded-2xl border border-[#2a3627]">
                <h2 className="font-bold text-lg text-white mb-4">Photo Slides Downloader</h2>
                <input className="w-full bg-[#161a14] border border-[#2a3627] p-3 rounded-xl mb-4" placeholder="Paste link here..." value={photoInputUrl} onChange={(e) => setPhotoInputUrl(e.target.value)} />
              </div>
              <div className="bg-[#1c231a] p-6 rounded-2xl border border-[#2a3627]">
                <h2 className="font-bold text-lg text-white mb-4">MP3 Audio Extractor</h2>
                <input className="w-full bg-[#161a14] border border-[#2a3627] p-3 rounded-xl mb-4" placeholder="Paste link here..." value={audioInputUrl} onChange={(e) => setAudioInputUrl(e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}