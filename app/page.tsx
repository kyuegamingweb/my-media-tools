"use client";

import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools" | "donation">("tools");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState("");

  const handleDownload = async (type: 'video' | 'audio') => {
    if (!tiktokUrl) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tiktokUrl, type }),
      });
      const data = await res.json();
      if (data.success) window.open(data.downloadUrl, "_blank");
      else alert("Error sa pag-fetch");
    } catch { alert("Error"); }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#111410] text-[#e2e8f0] font-sans">
      {/* SIDEBAR - DATING UI */}
      <aside className="w-64 bg-[#111410] p-6 border-r border-[#1e251c]">
        <div className="text-xl font-bold text-[#73ee98] mb-8">KYUE TOOLS</div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab("social")} className={`px-4 py-3 rounded-2xl ${activeTab === "social" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>🌐 Social</button>
          <button onClick={() => setActiveTab("tools")} className={`px-4 py-3 rounded-2xl ${activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>🛠 Tools</button>
          <button onClick={() => setActiveTab("donation")} className={`px-4 py-3 rounded-2xl ${activeTab === "donation" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400"}`}>💳 Donation</button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {activeTab === "tools" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TIKTOK CARD */}
            <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6">
              <h2 className="font-bold text-white mb-4">TikTok Downloader</h2>
              <input className="w-full bg-[#111410] border border-[#2a3627] p-3 rounded-xl mb-3 text-white" value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)} placeholder="URL" />
              <div className="flex gap-2">
                <button onClick={() => handleDownload('video')} className="flex-1 bg-[#2d3f28] text-[#73ee98] py-2 rounded-xl font-bold">Video</button>
                <button onClick={() => handleDownload('audio')} className="flex-1 bg-[#2a3627] text-white py-2 rounded-xl font-bold">Audio</button>
              </div>
            </div>

            {/* REMOVE BG CARD */}
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
        
        {activeTab === "donation" && <div className="text-white p-6">GCASH Details: 09XX-XXX-XXXX</div>}
        {activeTab === "social" && <div className="text-white p-6">Social Links</div>}
      </main>
    </div>
  );
}