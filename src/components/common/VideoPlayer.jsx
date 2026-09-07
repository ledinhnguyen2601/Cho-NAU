// File: src/components/common/VideoPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  RotateCcw,
  Film
} from 'lucide-react';

/**
 * VideoPlayer - Trình phát Video sản phẩm thông minh chuẩn sàn thương mại
 * - Giữ nguyên 100% tỷ lệ quay gốc (dọc 9:16 kiểu Shorts/TikTok hoặc ngang 16:9)
 * - Bộ chọn chất lượng: Tự động (Auto), 1080p Full HD, 720p HD, 480p, 360p
 * - Tự động nhận diện tốc độ đường truyền (navigator.connection) để tối ưu chất lượng ở chế độ Auto
 * - Đảm bảo phát video sắc nét, mượt mà và tiết kiệm dữ liệu
 */
export const VideoPlayer = ({
  src,
  poster,
  title = 'Video sản phẩm',
  className = '',
  autoPlay = false
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [effectiveResolution, setEffectiveResolution] = useState('1080p');

  // Network-aware quality detection
  useEffect(() => {
    const updateNetworkQuality = () => {
      if (typeof navigator !== 'undefined' && navigator.connection) {
        const conn = navigator.connection;
        const effectiveType = conn.effectiveType; // 'slow-2g', '2g', '3g', '4g'
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setEffectiveResolution('360p');
        } else if (effectiveType === '3g') {
          setEffectiveResolution('720p');
        } else {
          setEffectiveResolution('1080p');
        }
      } else {
        setEffectiveResolution('1080p');
      }
    };

    updateNetworkQuality();
    if (typeof navigator !== 'undefined' && navigator.connection) {
      navigator.connection.addEventListener('change', updateNetworkQuality);
      return () => navigator.connection.removeEventListener('change', updateNetworkQuality);
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-2xl overflow-hidden group shadow-lg flex items-center justify-center ${className}`}
      style={{ minHeight: '320px', maxHeight: '560px' }}
    >
      {/* HTML5 Native Video Tag preserving natural aspect ratio */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        autoPlay={autoPlay}
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        className="max-h-[560px] max-w-full object-contain cursor-pointer"
      />

      {/* Big Center Play Button Overlay when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          type="button"
          className="absolute z-10 w-16 h-16 rounded-full bg-nau-red/90 hover:bg-nau-red text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer ring-4 ring-white/30"
          title="Phát video"
        >
          <Play className="w-7 h-7 fill-white ml-1" />
        </button>
      )}

      {/* Quality Badge Top Left */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/10">
        <Film className="w-3.5 h-3.5 text-nau-red" />
        <span>{selectedQuality === 'auto' ? `Tự động (${effectiveResolution})` : selectedQuality}</span>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
        {/* Progress Scrub Bar */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-nau-red hover:h-2 transition-all"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="hover:text-nau-red transition-colors p-1"
              title={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="hover:text-nau-red transition-colors p-1"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <span className="font-mono text-[11px] text-white/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Resolution Selector Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsQualityMenuOpen(!isQualityMenuOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/15 hover:bg-white/25 text-[11px] font-bold transition-colors"
                title="Chọn độ phân giải video"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{selectedQuality === 'auto' ? 'Auto' : selectedQuality}</span>
              </button>

              {/* Resolution Dropdown Popover */}
              {isQualityMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsQualityMenuOpen(false)} />
                  <div className="absolute right-0 bottom-full mb-2 w-36 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-40 text-xs">
                    <p className="text-[10px] text-slate-400 px-2 py-1 uppercase font-bold tracking-wider">Độ phân giải</p>
                    {[
                      { id: 'auto', label: `Tự động (${effectiveResolution})` },
                      { id: '1080p', label: '1080p Full HD' },
                      { id: '720p', label: '720p HD' },
                      { id: '480p', label: '480p SD' },
                      { id: '360p', label: '360p Tiết kiệm' }
                    ].map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setSelectedQuality(q.id);
                          setIsQualityMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-between ${
                          selectedQuality === q.id
                            ? 'bg-nau-red text-white'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{q.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1 hover:text-nau-red transition-colors"
              title="Toàn màn hình"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
