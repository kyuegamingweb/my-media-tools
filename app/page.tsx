"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools">("tools");
  const [isAnimating, setIsAnimating] = useState(false);

  // States para sa Video Downloader
  const [videoInputUrl, setVideoInputUrl] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [resultVideoUrl, setResultVideoUrl] = useState("");

  // States para sa Photo Downloader
  const [photoInputUrl, setPhotoInputUrl] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [resultImages, setResultImages] = useState<string[]>([]);

  // States para sa Audio Extractor
  const [audioInputUrl, setAudioInputUrl] = useState("");
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [resultAudioUrl, setResultAudioUrl] = useState("");

  const [downloading, setDownloading] = useState(false);

  const handleTabChange = (tab: "social" | "tools") => {
    if (tab === activeTab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 150);
  };

  // Handler para sa Video
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoInputUrl) return;
    setLoadingVideo(true);
    setResultVideoUrl("");

    try {
      const res = await fetch(`/api/tiktok?url=${encodeURIComponent(videoInputUrl.trim())}`);
      const data = await res.json();
      if (data.videoUrl) {
        setResultVideoUrl(data.videoUrl);
      } else {
        alert(data.error || "Hindi makuha ang video.");
      }
    } catch {
      alert("Error sa pag-fetch ng video.");
    } finally {
      setLoadingVideo(false);
    }
  };

  // Handler para sa Photos
  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoInputUrl) return;
    setLoadingPhoto(true);
    setResultImages([]);

    try {
      const res = await fetch(`/api/tiktok?url=${encodeURIComponent(photoInputUrl.trim())}`);
      const data = await res.json();
      if (data.type === "image" && data.images?.length > 0) {
        setResultImages(data.images);
      } else {
        alert(data.error || "Walang nahanap na photo slideshow sa link na ito.");
      }
    } catch {
      alert("Error sa pag-fetch ng photos.");
    } finally {
      setLoadingPhoto(false);
    }
  };

  // Handler para sa Audio
  const handleAudioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioInputUrl) return;
    setLoadingAudio(true);
    setResultAudioUrl("");

    try {
      const res = await fetch(`/api/tiktok?url=${encodeURIComponent(audioInputUrl.trim())}`);
      const data = await res.json();
      if (data.audioUrl) {
        setResultAudioUrl(data.audioUrl);
      } else {
        alert(data.error || "Hindi makuha ang audio.");
      }
    } catch {
      alert("Error sa pag-fetch ng audio.");
    } finally {
      setLoadingAudio(false);
    }
  };

  // Direktang pag-download gamit ang Blob para gumana sa browser
  const downloadFile = async (targetUrl: string, type: "video" | "audio" | "image", index?: number) => {
    if (!targetUrl) return;
    setDownloading(true);

    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      let ext = "mp4";
      if (type === "audio") ext = "mp3";
      if (type === "image") ext = "jpg";

      const suffix = index !== undefined ? `_photo_${index + 1}` : `_${type}`;
      const filename = `tiktok${suffix}_${Date.now()}.${ext}`;

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
    <div className="flex min-h-screen bg-[#111410] text-[#e2e8f0] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111410] p-6 flex flex-col gap-6 border-r border-[#1e251c]">
        <div className="text-xl font-bold text-[#73ee98] tracking-wider mb-2">KYUE APPS</div>
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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#161a14] rounded-l-[40px] border-l border-[#222a1f] my-3 mr-3 shadow-2xl overflow-y-auto">
        <div className={`transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          {activeTab === "social" && (
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Social Platforms</h1>
              <p className="text-gray-400 text-sm mb-8">Pumili ng social media card o tool na gusto mong buksan:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  onClick={() => handleTabChange("tools")}
                  className="bg-[#1c231a] border border-[#2a3627] hover:border-[#73ee98] transition-all cursor-pointer rounded-[28px] p-6 flex flex-col justify-between shadow-lg group"
                >
                  <div>
                    <div className="text-2xl mb-2">🎵</div>
                    <h2 className="text-lg font-bold text-white group-hover:text-[#73ee98]">TikTok Suite Tools</h2>
                    <p className="text-xs text-gray-400 mt-1">Separate tools for Video, Photo Slides, and MP3 Audio.</p>
                  </div>
                  <div className="mt-6 text-xs text-[#73ee98] font-semibold">Open Tools →</div>
                </div>

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
                  <div className="mt-6 text-xs text-[#e1306c] font-semibold">Visit Instagram Profile ↗</div>
                </a>
              </div>
            </div>
          )}

          {activeTab === "tools" && (
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Tools</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* VIDEO DOWNLOADER CARD */}
                <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-[#283823] text-[#73ee98] rounded-xl font-bold text-xs">HQ</div>
                      <div>
                        <h2 className="text-base font-bold text-white">Video Downloader</h2>
                        <span className="text-xs text-gray-400">TikTok No Watermark</span>
                      </div>
                    </div>

                    <form onSubmit={handleVideoSubmit} className="space-y-4 mb-4">
                      <div className="bg-[#141812] border border-[#283525] rounded-2xl p-3 flex items-center gap-2">
                        <span className="text-gray-500 pl-2 text-sm">🎬</span>
                        <input 
                          type="text" 
                          placeholder="Paste TikTok video link..." 
                          value={videoInputUrl}
                          onChange={(e) => setVideoInputUrl(e.target.value)}
                          className="w-full bg-transparent text-xs text-white focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loadingVideo}
                        className="w-full bg-[#2d3f28] hover:bg-[#385032] text-[#73ee98] font-bold py-3 rounded-xl text-xs border border-[#3e5837] shadow disabled:opacity-50"
                      >
                        {loadingVideo ? "Processing..." : "Extract Video"}
                      </button>
                    </form>

                    {resultVideoUrl && (
                      <div className="pt-2 border-t border-[#2a3627]">
                        <button 
                          disabled={downloading}
                          onClick={() => downloadFile(resultVideoUrl, "video")}
                          className="w-full bg-[#354f2f] hover:bg-[#41623a] text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
                        >
                          🎬 {downloading ? "Downloading..." : "Download MP4 Video"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* PHOTO DOWNLOADER CARD */}
                <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-[#283823] text-[#73ee98] rounded-xl font-bold text-xs">🖼</div>
                      <div>
                        <h2 className="text-base font-bold text-white">Photo Downloader</h2>
                        <span className="text-xs text-gray-400">TikTok Slideshow Photos</span>
                      </div>
                    </div>

                    <form onSubmit={handlePhotoSubmit} className="space-y-4 mb-4">
                      <div className="bg-[#141812] border border-[#283525] rounded-2xl p-3 flex items-center gap-2">
                        <span className="text-gray-500 pl-2 text-sm">📸</span>
                        <input 
                          type="text" 
                          placeholder="Paste TikTok photo link..." 
                          value={photoInputUrl}
                          onChange={(e) => setPhotoInputUrl(e.target.value)}
                          className="w-full bg-transparent text-xs text-white focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loadingPhoto}
                        className="w-full bg-[#2d3f28] hover:bg-[#385032] text-[#73ee98] font-bold py-3 rounded-xl text-xs border border-[#3e5837] shadow disabled:opacity-50"
                      >
                        {loadingPhoto ? "Processing..." : "Extract Photos"}
                      </button>
                    </form>

                    {resultImages.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[#2a3627]">
                        <p className="text-xs font-semibold text-[#73ee98]">🖼 {resultImages.length} Photos Found:</p>
                        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                          {resultImages.map((imgUrl, idx) => (
                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#2a3627]">
                              <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-14 object-cover" />
                              <button
                                onClick={() => downloadFile(imgUrl, "image", idx)}
                                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-white font-bold"
                              >
                                Save ⬇
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AUDIO EXTRACTOR CARD */}
                <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-[#283823] text-[#73ee98] rounded-xl font-bold text-xs">🎵</div>
                      <div>
                        <h2 className="text-base font-bold text-white">Audio Extractor</h2>
                        <span className="text-xs text-gray-400">TikTok to MP3</span>
                      </div>
                    </div>

                    <form onSubmit={handleAudioSubmit} className="space-y-4 mb-4">
                      <div className="bg-[#141812] border border-[#283525] rounded-2xl p-3 flex items-center gap-2">
                        <span className="text-gray-500 pl-2 text-sm">🎙</span>
                        <input 
                          type="text" 
                          placeholder="Paste TikTok link for audio..." 
                          value={audioInputUrl}
                          onChange={(e) => setAudioInputUrl(e.target.value)}
                          className="w-full bg-transparent text-xs text-white focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loadingAudio}
                        className="w-full bg-[#2d3f28] hover:bg-[#385032] text-[#73ee98] font-bold py-3 rounded-xl text-xs border border-[#3e5837] shadow disabled:opacity-50"
                      >
                        {loadingAudio ? "Processing..." : "Extract MP3 Audio"}
                      </button>
                    </form>

                    {resultAudioUrl && (
                      <div className="pt-2 border-t border-[#2a3627]">
                        <button 
                          disabled={downloading}
                          onClick={() => downloadFile(resultAudioUrl, "audio")}
                          className="w-full bg-[#1f2d1c] hover:bg-[#283b24] text-[#73ee98] font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-[#2a3d25]"
                        >
                          🎵 {downloading ? "Downloading..." : "Download MP3 Audio"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}