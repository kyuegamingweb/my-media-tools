"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "tools" | "donation">("tools");
  
  const [videoUrl, setVideoUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoDownloadUrl, setVideoDownloadUrl] = useState(""); 
  const [videoPreviewSrc, setVideoPreviewSrc] = useState("");

  const [loadingPhoto, setLoadingPhoto] = useState(false);
  
  // States para sa Audio Extractor (may kasamang format selector na mp3 o wav)
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioFormat, setAudioFormat] = useState<"mp3" | "wav">("mp3");
  const [audioDownloadUrl, setAudioDownloadUrl] = useState("");
  const [audioPreviewSrc, setAudioPreviewSrc] = useState("");
  
  const [extractedPhotos, setExtractedPhotos] = useState<string[]>([]);
  
  const [bgImage, setBgImage] = useState("");
  const [loadingBg, setLoadingBg] = useState(false);

  // States para sa Photo Enhancer tool
  const [enhanceImageSrc, setEnhanceImageSrc] = useState("");
  const [enhanceQuality, setEnhanceQuality] = useState(90);
  const [enhanceSharpness, setEnhanceSharpness] = useState(false);
  const [enhancedResultUrl, setEnhancedResultUrl] = useState("");
  const [loadingEnhance, setLoadingEnhance] = useState(false);

  // States para sa bagong QR Code Generator tool
  const [qrInputText, setQrInputText] = useState("");
  const [qrGeneratedUrl, setQrGeneratedUrl] = useState("");

  // State para sa copy notification sa donation
  const [copied, setCopied] = useState(false);
  const gcashNumber = "09288476050";

  const handleCopyGcash = () => {
    navigator.clipboard.writeText(gcashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Video Process
  const handleProcessVideo = async () => {
    if (!videoUrl) return alert("Please enter a video link first!");
    setLoadingVideo(true);
    setVideoDownloadUrl("");
    setVideoPreviewSrc("");

    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl, type: 'video' }),
      });
      const data = await res.json();
      
      if (data.success && data.downloadUrl) {
        setVideoDownloadUrl(data.downloadUrl);
        setVideoPreviewSrc(data.downloadUrl);
      } else {
        alert(data.error || "Error processing video.");
      }
    } catch {
      alert("Error fetching media. Please try the link again.");
    } finally {
      setLoadingVideo(false);
    }
  };

  const handleDirectDownloadVideo = async () => {
    try {
      const response = await fetch(videoDownloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `tiktok-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement('a');
      a.href = videoDownloadUrl;
      a.target = '_blank';
      a.download = `tiktok-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // 3. Audio Process (Ginagamit ang napiling audioFormat: mp3 o wav)
  const handleProcessAudio = async () => {
    if (!audioUrl) return alert("Please enter an audio link first!");
    setLoadingAudio(true);
    setAudioDownloadUrl("");
    setAudioPreviewSrc("");

    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: audioUrl, type: audioFormat }),
      });
      const data = await res.json();
      
      if (data.success && data.downloadUrl) {
        setAudioDownloadUrl(data.downloadUrl);
        setAudioPreviewSrc(data.downloadUrl);
      } else {
        alert(data.error || "Error processing audio.");
      }
    } catch {
      alert("Error fetching media. Please try the link again.");
    } finally {
      setLoadingAudio(false);
    }
  };

  const handleDirectDownloadAudio = async () => {
    try {
      const response = await fetch(audioDownloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `tiktok-audio-${Date.now()}.${audioFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement('a');
      a.href = audioDownloadUrl;
      a.target = '_blank';
      a.download = `tiktok-audio-${Date.now()}.${audioFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleExtractPhotos = async () => {
    if (!photoUrl) return alert("Please enter a photo link first!");
    setLoadingPhoto(true);
    setExtractedPhotos([]);

    try {
      const res = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: photoUrl, type: 'photo' }),
      });
      const data = await res.json();
      
      if (data.success && data.images) {
        setExtractedPhotos(data.images);
      } else {
        alert(data.error || "Failed to retrieve photos.");
      }
    } catch {
      alert("Error fetching photos.");
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleDownloadSinglePhoto = async (imgUrl: string, index: number) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `tiktok-photo-${index + 1}-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement('a');
      a.href = imgUrl;
      a.target = '_blank';
      a.download = `tiktok-photo-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Handler para sa Photo Enhancer
  const handleProcessEnhancePhoto = () => {
    if (!enhanceImageSrc) return alert("Please upload a photo first!");
    setLoadingEnhance(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = enhanceImageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setLoadingEnhance(false);
        return;
      }

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (enhanceSharpness) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;
        const weights = [
           0, -1,  0,
          -1,  5, -1,
           0, -1,  0
        ];
        const kat = 1;
        const dudata = new Uint8ClampedArray(data);

        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let i = (y * w + x) * 4 + c;
              let sum = 0;
              let k = 0;
              for (let oy = -1; oy <= 1; oy++) {
                for (let ox = -1; ox <= 1; ox++) {
                  let ni = ((y + oy) * w + (x + ox)) * 4 + c;
                  sum += dudata[ni] * weights[k];
                  k++;
                }
              }
              data[i] = Math.min(255, Math.max(0, sum * kat));
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      const qualityDecimal = enhanceQuality / 100;
      const resultUrl = canvas.toDataURL("image/jpeg", qualityDecimal);
      setEnhancedResultUrl(resultUrl);
      setLoadingEnhance(false);
    };
    img.onerror = () => {
      alert("Error loading image for enhancement.");
      setLoadingEnhance(false);
    };
  };

  // Handler para sa QR Code Generator
  const handleGenerateQRCode = () => {
    if (!qrInputText) return alert("Please enter a link or text first!");
    const encodedText = encodeURIComponent(qrInputText);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedText}`;
    setQrGeneratedUrl(qrApiUrl);
  };

  const handleDownloadQRCode = async () => {
    if (!qrGeneratedUrl) return;
    try {
      const response = await fetch(qrGeneratedUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement('a');
      a.href = qrGeneratedUrl;
      a.target = '_blank';
      a.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setVideoDownloadUrl(""); 
                      setVideoPreviewSrc("");
                    }} 
                  />

                  {loadingVideo && (
                    <div className="mb-4 pt-3 border-t border-[#2a3627] animate-pulse">
                      <div className="h-4 bg-[#2a3627] rounded w-28 mb-2"></div>
                      <div className="w-full h-32 bg-[#111410] rounded-xl border border-[#2a3627] flex items-center justify-center">
                        <span className="text-xs text-[#73ee98] font-semibold">Processing video quickly...</span>
                      </div>
                    </div>
                  )}

                  {videoPreviewSrc && !loadingVideo && (
                    <div className="mb-4 pt-3 border-t border-[#2a3627]">
                      <p className="text-xs text-[#73ee98] font-bold mb-2">🎬 Video Preview:</p>
                      <video 
                        src={videoPreviewSrc} 
                        controls 
                        className="w-full max-h-40 rounded-xl border border-[#2a3627] object-contain bg-black"
                      />
                    </div>
                  )}
                </div>

                {!videoDownloadUrl ? (
                  <button 
                    onClick={handleProcessVideo} 
                    disabled={loadingVideo}
                    className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
                  >
                    {loadingVideo ? "Loading..." : "Download Video"}
                  </button>
                ) : (
                  <button 
                    onClick={handleDirectDownloadVideo}
                    className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition animate-pulse"
                  >
                    Direct Download
                  </button>
                )}
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

                  {extractedPhotos.length > 0 && (
                    <div className="mt-2 mb-4 pt-3 border-t border-[#2a3627]">
                      <p className="text-xs text-[#73ee98] font-bold mb-2">🟩 {extractedPhotos.length} Photos Found (Click to download):</p>
                      <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                        {extractedPhotos.map((imgSrc, index) => (
                          <button 
                            key={index} 
                            onClick={() => handleDownloadSinglePhoto(imgSrc, index)}
                            className="block relative group cursor-pointer text-left"
                            title="Click to auto-download"
                          >
                            <img src={imgSrc} alt={`Photo ${index + 1}`} className="w-full h-16 object-cover rounded-lg border border-[#2a3627] hover:border-[#73ee98] transition" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleExtractPhotos} 
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
                  <p className="text-xs text-gray-400 mb-4">TikTok to MP3 / WAV</p>
                  
                  {/* Format Selector */}
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setAudioFormat("mp3")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${audioFormat === "mp3" ? "bg-[#73ee98] text-[#111410]" : "bg-[#111410] text-gray-400 border border-[#2a3627]"}`}
                    >
                      MP3
                    </button>
                    <button 
                      onClick={() => setAudioFormat("wav")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${audioFormat === "wav" ? "bg-[#73ee98] text-[#111410]" : "bg-[#111410] text-gray-400 border border-[#2a3627]"}`}
                    >
                      WAV
                    </button>
                  </div>

                  <input 
                    className="w-full bg-[#111410] border border-[#2a3627] p-3 rounded-xl mb-4 text-white text-sm" 
                    placeholder="Paste TikTok link..." 
                    value={audioUrl} 
                    onChange={(e) => {
                      setAudioUrl(e.target.value);
                      setAudioDownloadUrl("");
                      setAudioPreviewSrc("");
                    }} 
                  />

                  {loadingAudio && (
                    <div className="mb-4 pt-3 border-t border-[#2a3627] animate-pulse">
                      <div className="h-4 bg-[#2a3627] rounded w-28 mb-2"></div>
                      <div className="w-full h-20 bg-[#111410] rounded-xl border border-[#2a3627] flex items-center justify-center">
                        <span className="text-xs text-[#73ee98] font-semibold">Processing {audioFormat.toUpperCase()} quickly...</span>
                      </div>
                    </div>
                  )}

                  {audioPreviewSrc && !loadingAudio && (
                    <div className="mb-4 pt-3 border-t border-[#2a3627]">
                      <p className="text-xs text-[#73ee98] font-bold mb-2">🎵 Audio Preview ({audioFormat.toUpperCase()}):</p>
                      <audio 
                        src={audioPreviewSrc} 
                        controls 
                        className="w-full h-10 border border-[#2a3627] rounded-xl"
                      />
                    </div>
                  )}
                </div>

                {!audioDownloadUrl ? (
                  <button 
                    onClick={handleProcessAudio} 
                    disabled={loadingAudio}
                    className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
                  >
                    {loadingAudio ? "Loading..." : `Extract ${audioFormat.toUpperCase()} Audio`}
                  </button>
                ) : (
                  <button 
                    onClick={handleDirectDownloadAudio}
                    className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition animate-pulse"
                  >
                    Direct Download ({audioFormat.toUpperCase()})
                  </button>
                )}
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
                          const { removeBackground } = await import("@imgly/background-removal");
                          const blob = await removeBackground(e.target.files[0], {
                            model: "medium",
                            segmentation_threshold: 0.9,
                            static: true
                          });
                          setBgImage(URL.createObjectURL(blob));
                        } catch {
                          alert("Error removing background.");
                        }
                        setLoadingBg(false);
                      }} 
                    />
                  </label>
                </div>

                {loadingBg && <p className="text-xs text-[#73ee98] text-center mb-2">Processing background removal (High Accuracy)...</p>}
                {bgImage && (
                  <div className="mt-2">
                    <img src={bgImage} className="rounded-xl max-h-24 mx-auto mb-2" alt="Result" />
                    <a href={bgImage} download="removed-bg.png" className="block text-center bg-[#2d3f28] text-[#73ee98] py-2 rounded-xl text-xs font-bold">Download Result</a>
                  </div>
                )}
              </div>

              {/* 5. Photo Enhancer */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#2d3f28] text-[#73ee98] text-xs px-2 py-1 rounded-md font-bold">✨</span>
                    <h2 className="font-bold text-white">Photo Enhancer</h2>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Enhance & Clarify Photo Quality</p>
                  
                  <label className="border-2 border-dashed border-[#2a3627] hover:border-[#73ee98] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-[#111410] transition mb-3">
                    <span className="text-2xl mb-1">📷</span>
                    <span className="text-xs text-gray-400 text-center">Click to upload photo to enhance</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0) return;
                        const file = e.target.files[0];
                        setEnhanceImageSrc(URL.createObjectURL(file));
                        setEnhancedResultUrl("");
                      }} 
                    />
                  </label>

                  {enhanceImageSrc && (
                    <div className="space-y-3 mb-3 bg-[#111410] p-3 rounded-xl border border-[#2a3627]">
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Quality / Clarity:</span>
                          <span className="text-[#73ee98] font-bold">{enhanceQuality}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="100" 
                          value={enhanceQuality} 
                          onChange={(e) => setEnhanceQuality(Number(e.target.value))}
                          className="w-full accent-[#73ee98] cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Sharpen / Clarify Edges:</span>
                        <input 
                          type="checkbox" 
                          checked={enhanceSharpness}
                          onChange={(e) => setEnhanceSharpness(e.target.checked)}
                          className="accent-[#73ee98] w-4 h-4 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {enhancedResultUrl && (
                    <div className="mb-3 text-center">
                      <img src={enhancedResultUrl} alt="Enhanced" className="max-h-20 mx-auto rounded-lg border border-[#2a3627] mb-2" />
                      <a 
                        href={enhancedResultUrl} 
                        download={`enhanced-photo-${Date.now()}.jpg`}
                        className="block bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-2 rounded-xl text-xs font-bold transition"
                      >
                        Download Enhanced Photo
                      </a>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleProcessEnhancePhoto} 
                  disabled={!enhanceImageSrc || loadingEnhance}
                  className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  {loadingEnhance ? "Enhancing..." : "Enhance Photo"}
                </button>
              </div>

              {/* 6. QR Code Generator */}
              <div className="bg-[#1c231a] border border-[#2a3627] rounded-[28px] p-6 col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#2d3f28] text-[#73ee98] text-xs px-2 py-1 rounded-md font-bold">🔳</span>
                    <h2 className="font-bold text-white">QR Code Generator</h2>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Create Custom QR Code for Links</p>
                  
                  <input 
                    className="w-full bg-[#111410] border border-[#2a3627] p-3 rounded-xl mb-3 text-white text-sm" 
                    placeholder="Enter social link or URL..." 
                    value={qrInputText} 
                    onChange={(e) => setQrInputText(e.target.value)} 
                  />

                  {qrGeneratedUrl && (
                    <div className="mb-3 text-center bg-[#111410] p-3 rounded-xl border border-[#2a3627]">
                      <img src={qrGeneratedUrl} alt="QR Code" className="w-32 h-32 mx-auto rounded-lg mb-2 bg-white p-1" />
                      <button 
                        onClick={handleDownloadQRCode}
                        className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-2 rounded-xl text-xs font-bold transition"
                      >
                        Download QR Code
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleGenerateQRCode} 
                  disabled={!qrInputText}
                  className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
                >
                  Generate QR Code
                </button>
              </div>

            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-6">Social Links</h1>
            <div className="space-y-4 max-w-md">
              <a href="https://tiktok.com/@kyyue_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#1c231a] rounded-2xl border border-[#2a3627] hover:border-[#73ee98] transition font-bold">
                <svg className="w-5 h-5 fill-current text-[#73ee98]" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                TikTok Profile
              </a>
              <a href="https://instagram.com/vxjyue" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#1c231a] rounded-2xl border border-[#2a3627] hover:border-[#73ee98] transition font-bold">
                <svg className="w-5 h-5 fill-current text-[#73ee98]" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Instagram Profile
              </a>
            </div>
          </div>
        )}

        {activeTab === "donation" && (
          <div className="text-white p-8 bg-[#1c231a] rounded-[28px] border border-[#2a3627] max-w-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>💳</span> Support the Project
            </h1>
            <p className="text-gray-400 text-sm mb-6">If you like these free tools, consider supporting through GCash!</p>
            
            <div className="bg-[#111410] border border-[#2a3627] p-6 rounded-2xl flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 bg-[#2d3f28] px-4 py-1.5 rounded-full text-[#73ee98] font-bold text-sm">
                <span>GCash</span>
              </div>
              <img 
                src="/gcash-qr.png" 
                alt="GCash QR Code" 
                className="w-48 h-48 object-contain bg-white p-2 rounded-xl border border-[#2a3627]" 
              />
              <p className="text-lg font-mono text-white tracking-wider">{gcashNumber}</p>
              <button 
                onClick={handleCopyGcash}
                className="w-full bg-[#2d3f28] hover:bg-[#354c30] text-[#73ee98] py-3 rounded-xl font-bold text-sm transition"
              >
                {copied ? "Copied to Clipboard!" : "Copy GCash Number"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}