"use client";
import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools" | "donation">("tools");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultBg, setResultBg] = useState("");

  const handleDownload = async (type: 'video' | 'audio') => {
    if (!tiktokUrl) return alert("Enter URL");
    setLoading(true);
    const res = await fetch("/api/tiktok", { method: "POST", body: JSON.stringify({ url: tiktokUrl, type }) });
    const data = await res.json();
    if (data.success) window.open(data.downloadUrl, "_blank");
    else alert("Failed");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#111410] text-gray-200">
      <aside className="w-64 border-r border-[#1e251c] p-8 flex flex-col gap-6">
        <h1 className="text-xl font-bold text-[#73ee98]">KYUE TOOLS</h1>
        {['social', 'tools', 'donation'].map(t => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={`p-3 rounded-xl text-left ${activeTab === t ? 'bg-[#2d3f28] text-[#73ee98]' : 'text-gray-500'}`}>
            {t.toUpperCase()}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {activeTab === 'tools' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1c231a] p-6 rounded-3xl border border-[#2a3627]">
                  <h2 className="font-bold mb-4">TikTok Downloader</h2>
                  <input className="w-full p-3 mb-3 bg-[#111410] rounded-xl" placeholder="Paste URL" value={tiktokUrl} onChange={e => setTiktokUrl(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={() => handleDownload('video')} className="flex-1 bg-[#2d3f28] text-[#73ee98] py-3 rounded-xl font-bold">Video</button>
                    <button onClick={() => handleDownload('audio')} className="flex-1 bg-[#2a3627] text-white py-3 rounded-xl font-bold">Audio</button>
                  </div>
                </div>
                <div className="bg-[#1c231a] p-6 rounded-3xl border border-[#2a3627]">
                  <h2 className="font-bold mb-4">Remove Background</h2>
                  <input type="file" onChange={async (e) => {
                    if(!e.target.files) return;
                    const blob = await removeBackground(e.target.files[0]);
                    setResultBg(URL.createObjectURL(blob));
                  }} />
                  {resultBg && <img src={resultBg} className="mt-4 rounded-xl max-h-20" />}
                </div>
              </div>
            )}
            {activeTab === 'donation' && <div className="p-8 bg-[#1c231a] rounded-3xl">GCASH: 09XX-XXX-XXXX</div>}
            {activeTab === 'social' && <div className="p-8 bg-[#1c231a] rounded-3xl">My Links Here</div>}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}