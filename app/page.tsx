"use client";

import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools" | "donation">("tools");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [bgImage, setBgImage] = useState("");

  const handleDownload = async (type: 'video' | 'audio') => {
    if (!tiktokUrl) return alert("Enter URL");
    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tiktokUrl, type }),
      });
      const data = await res.json();
      if (data.success) window.open(data.downloadUrl, "_blank");
      else alert("Error: " + data.error);
    } catch { alert("Connection Error"); }
  };

  return (
    <div className="flex min-h-screen bg-[#111410] text-[#e2e8f0] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111410] p-6 border-r border-[#1e251c]">
        <div className="text-xl font-bold text-[#73ee98] mb-8">KYUE TOOLS</div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab("social")} className={`px-4 py-3 rounded-2xl flex items-center gap-3 ${activeTab === "social" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>🌐 Social</button>
          <button onClick={() => setActiveTab("tools")} className={`px-4 py-3 rounded-2xl flex items-center gap-3 ${activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>🛠 Tools</button>
          <button onClick={() => setActiveTab("donation")} className={`px-4 py-3 rounded-2xl flex items-center gap-3 ${activeTab === "donation" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>💳 Donation</button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {activeTab === "social" && (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-6">Social Links</h2>
            <div className="space-y-4">
              <a href="#" className="block p-4 bg-[#1c231a] rounded-xl border border-[#2a3627]">TikTok Profile</a>
              <a href="#" className="block p-4 bg-[#1c231a] rounded-xl border border-[#2a3627]">Instagram Profile</a>
            </div>
          </div>
        )}

        {activeTab === "tools" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TikTok Downloader */}
            <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6">
              <h2 className="font-bold text-white mb-4">TikTok Downloader</h2>
              <input className="w-full bg-[#111410] border border-[#2a3627] p-3 rounded-xl mb-3 text-white" value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)} placeholder="URL" />
              <div className="flex gap-2">
                <button onClick={() => handleDownload('video')} className="flex-1 bg-[#2d3f28] text-[#73ee98] py-2 rounded-xl font-bold">Video</button>
                <button onClick={() => handleDownload('audio')} className="flex-1 bg-[#2a3627] text-white py-2 rounded-xl font-bold">Audio</button>
              </div>
            </div>

            {/* Photo Downloader */}
            <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6">
              <h2 className="font-bold text-white mb-4">Photo Downloader</h2>
              <input className="w-full bg-[#111410] border border-[#2a3627] p-3 rounded-xl mb-3 text-white" placeholder="URL" />
              <button className="w-full bg-[#2a3627] text-white py-2 rounded-xl font-bold">Download Photo</button>
            </div>

            {/* Remove Background */}
            <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6">
              <h2 className="font-bold text-white mb-4">Remove Background</h2>
              <input type="file" onChange={async (e) => {
                if(!e.target.files) return;
                const blob = await removeBackground(e.target.files[0]);
                setBgImage(URL.createObjectURL(blob));
              }} />
              {bgImage && <img src={bgImage} className="mt-4 rounded-xl max-h-20" />}
            </div>
          </div>
        )}

        {activeTab === "donation" && (
          <div className="text-white p-6 bg-[#1c231a] rounded-3xl border border-[#2a3627]">
            <h2 className="text-2xl font-bold mb-4">Donation</h2>
            <p>GCash Details:</p>
            <p className="text-[#73ee98] font-bold text-xl">09XX-XXX-XXXX</p>
          </div>
        )}
      </main>
    </div>
  );
}