"use client";

import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools" | "donation">("tools");
  
  const [videoUrl, setVideoUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  
  // Loading states para sa bawat button
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  
  const [bgImage, setBgImage] = useState("");
  const [loadingBg, setLoadingBg] = useState(false);

  const handleDownload = async (url: string, type: 'video' | 'audio' | 'photo') => {
    if (!url) return alert("Ilagay muna ang link!");
    
    if (type === 'video') setLoadingVideo(true);
    if (type === 'photo') setLoadingPhoto(true);
    if (type === 'audio') setLoadingAudio(true);

    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, type }),
      });
      const data = await res.json();
      
      if (data.success && data.downloadUrl) {
        // I-fetch ang direct file para ma-trigger ang auto-download nang hindi nagbubukas ng bagong tab
        const fileRes = await fetch(data.downloadUrl);
        const blob = await fileRes.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `tiktok-${type}-${Date.now()}.${type === 'audio' ? 'mp3' : 'mp4'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        alert(data.error || "May error sa pag-download.");
      }
    } catch {
      alert("Error fetching media. Pakisubukan muli ang link.");
    } finally {
      if (type === 'video') setLoadingVideo(false);
      if (type === 'photo') setLoadingPhoto(false);
      if (type === 'audio') setLoadingAudio(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#111410] text-[#e2e8f0] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111410] p-6 border-r border-[#1e251c]">
        <div className="text-xl font-bold text-[#73ee98] mb-8">KYUE TOOLS</div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab("social")} className={`px-4 py-3 rounded-2xl text-left font-medium ${activeTab === "social" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400 hover:text-white"}`}>🌐 Social</button>
          <button onClick={() => setActiveTab("tools")} className={`px-4 py-3 rounded-2xl text-left font-medium ${activeTab === "tools" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400 hover:text-white"}`}>🛠 Tools</button>
          <button onClick={() => setActiveTab("donation")} className={`px-4 py-3 rounded-2xl text-left font-medium ${activeTab === "donation" ? "bg-[#2d3f28] text-[#73ee98]" : "text-gray-400 hover:text-white"}`}>💳 Donation</button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        {activeTab === "tools" && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Tools</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. Video Downloader */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#2d3f28] text-[#73ee98] text-xs px-2 py-1 rounded-md font-bold">HQ</span>
                    <h2 className="font-bold text-white">Video Downloader</h2>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">TikTok No Watermark</p>
                  <input 
                    className="w-full bg-[#111410] border border-[#2a3627] p-3 rounded-xl mb-4 text-white text-sm" 
                    placeholder="Paste TikTok video link..." 
                    value={videoUrl} 
                    onChange={(e) => setVideoUrl(e.target.value)} 
                  />
                </div>
                <button 
                  onClick={() => handleDownload(videoUrl, 'video')} 
                  disabled={loadingVideo}
                  className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  {loadingVideo ? "Processing..." : "Download Video"}
                </button>
              </div>

              {/* 2. Photo Downloader */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#2d3f28] text-[#73ee98] text-xs px-2 py-1 rounded-md font-bold">🖼️</span>
                    <h2 className="font-bold text-white">Photo Downloader</h2>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">TikTok Slideshow Photos</p>
                  <input 
                    className="w-full bg-[#111410] border border-[#2a3627] p-3 rounded-xl mb-4 text-white text-sm" 
                    placeholder="Paste TikTok photo link..." 
                    value={photoUrl} 
                    onChange={(e) => setPhotoUrl(e.target.value)} 
                  />
                </div>
                <button 
                  onClick={() => handleDownload(photoUrl, 'photo')} 
                  disabled={loadingPhoto}
                  className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  {loadingPhoto ? "Processing..." : "Extract Photos"}
                </button>
              </div>

              {/* 3. Audio Extractor */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#2d3f28] text-[#73ee98] text-xs px-2 py-1 rounded-md font-bold">🎵</span>
                    <h2 className="font-bold text-white">Audio Extractor</h2>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">TikTok to MP3</p>
                  <input 
                    className="w-full bg-[#111410] border border-[#2a3627] p-3 rounded-xl mb-4 text-white text-sm" 
                    placeholder="Paste TikTok link..." 
                    value={audioUrl} 
                    onChange={(e) => setAudioUrl(e.target.value)} 
                  />
                </div>
                <button 
                  onClick={() => handleDownload(audioUrl, 'audio')} 
                  disabled={loadingAudio}
                  className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  {loadingAudio ? "Processing..." : "Extract MP3 Audio"}
                </button>
              </div>

              {/* 4. Remove Background */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#2d3f28] text-[#73ee98] text-xs px-2 py-1 rounded-md font-bold">👤</span>
                    <h2 className="font-bold text-white">Remove Background</h2>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Background Removal</p>
                  
                  <label className="border-2 border-dashed border-[#2a3627] hover:border-[#73ee98] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#111410] transition mb-4">
                    <span className="text-3xl mb-2">📁</span>
                    <span className="text-xs text-gray-400 text-center">Drag & drop video or image here or click to select</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={async (e) => {
                        if(!e.target.files || e.target.files.length === 0) return;
                        setLoadingBg(true);
                        try {
                          const blob = await removeBackground(e.target.files[0]);
                          setBgImage(URL.createObjectURL(blob));
                        } catch {
                          alert("May error sa pag-alis ng background.");
                        }
                        setLoadingBg(false);
                      }} 
                    />
                  </label>
                </div>

                {loadingBg && <p className="text-xs text-[#73ee98] text-center mb-2">Processing background removal...</p>}
                {bgImage && (
                  <div className="mt-2">
                    <img src={bgImage} className="rounded-xl max-h-24 mx-auto mb-2" alt="Result" />
                    <a href={bgImage} download="removed-bg.png" className="block text-center bg-[#2d3f28] text-[#73ee98] py-2 rounded-xl text-xs font-bold">Download Result</a>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-6">Social Links</h1>
            <div className="space-y-4 max-w-md">
              <a href="https://tiktok.com" target="_blank" className="block p-4 bg-[#1c231a] rounded-2xl border border-[#2a3627] hover:border-[#73ee98] transition font-bold">TikTok Profile</a>
              <a href="https://instagram.com" target="_blank" className="block p-4 bg-[#1c231a] rounded-2xl border border-[#2a3627] hover:border-[#73ee98] transition font-bold">Instagram Profile</a>
            </div>
          </div>
        )}

        {activeTab === "donation" && (
          <div className="text-white p-8 bg-[#1c231a] rounded-[28px] border border-[#2a3627] max-w-md">
            <h1 className="text-2xl font-bold mb-4">Donation</h1>
            <p className="text-gray-400 mb-2">Support this project via GCash:</p>
            <p className="text-[#73ee98] font-bold text-2xl tracking-wider">09XX-XXX-XXXX</p>
          </div>
        )}
      </main>
    </div>
  );
}