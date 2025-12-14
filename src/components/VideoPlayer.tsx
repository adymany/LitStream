import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    autoPlay?: boolean;
}

export function VideoPlayer({ src, poster, autoPlay = false }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [buffered, setBuffered] = useState(0);
    const [isHoveringProgress, setIsHoveringProgress] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Format time as mm:ss or hh:mm:ss
    const formatTime = (seconds: number): string => {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Progress percentage
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    }, [isPlaying]);

    // Handle seeking (supports both mouse and touch)
    const handleProgressInteraction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!progressRef.current || !videoRef.current || duration <= 0) return;
        const rect = progressRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clickX = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Skip forward/back
    const skip = (seconds: number) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    };

    // Toggle mute
    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = val;
            setVolume(val);
            setIsMuted(val === 0);
        }
    };

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    // Show controls and reset hide timer
    const handleActivity = useCallback(() => {
        setShowControls(true);
        if (hideControlsTimeout.current) {
            clearTimeout(hideControlsTimeout.current);
        }
        if (isPlaying) {
            hideControlsTimeout.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    }, [isPlaying]);

    // Video event listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => { setIsPlaying(false); setShowControls(true); };
        const onTimeUpdate = () => setCurrentTime(video.currentTime);
        const onLoadedMetadata = () => setDuration(video.duration);
        const onProgress = () => {
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                if (video.duration > 0) {
                    setBuffered((bufferedEnd / video.duration) * 100);
                }
            }
        };

        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('progress', onProgress);

        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('progress', onProgress);
        };
    }, []);

    // Autoplay
    useEffect(() => {
        if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    }, [autoPlay, src]);

    // Fullscreen change listener
    useEffect(() => {
        const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFSChange);
        return () => document.removeEventListener('fullscreenchange', onFSChange);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
            switch (e.code) {
                case 'Space':
                case 'KeyK':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    skip(-10);
                    break;
                case 'ArrowRight':
                    skip(10);
                    break;
                case 'KeyM':
                    toggleMute();
                    break;
                case 'KeyF':
                    toggleFullscreen();
                    break;
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [togglePlay, toggleFullscreen]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                overflow: 'hidden',
                borderRadius: '8px',
            }}
            onMouseMove={handleActivity}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            onTouchStart={handleActivity}
        >
            {/* Video */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    cursor: 'pointer',
                }}
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
                playsInline
            />

            {/* Center Play Button (when paused) */}
            {!isPlaying && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        padding: isMobile ? '16px' : '20px',
                        cursor: 'pointer',
                        pointerEvents: 'none',
                    }}
                >
                    <Play style={{ width: isMobile ? 36 : 48, height: isMobile ? 36 : 48, color: 'white', fill: 'white' }} />
                </div>
            )}

            {/* Bottom Controls Overlay */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                    padding: isMobile ? '30px 12px 10px 12px' : '40px 16px 12px 16px',
                    opacity: showControls || !isPlaying ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: showControls || !isPlaying ? 'auto' : 'none',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Progress Bar */}
                <div
                    ref={progressRef}
                    style={{
                        width: '100%',
                        height: isMobile ? '10px' : (isHoveringProgress ? '8px' : '4px'),
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        position: 'relative',
                        marginBottom: isMobile ? '10px' : '12px',
                        transition: 'height 0.15s ease',
                        touchAction: 'none',
                    }}
                    onClick={handleProgressInteraction}
                    onTouchMove={handleProgressInteraction}
                    onMouseEnter={() => setIsHoveringProgress(true)}
                    onMouseLeave={() => setIsHoveringProgress(false)}
                >
                    {/* Buffered */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: `${buffered}%`,
                            backgroundColor: 'rgba(255,255,255,0.5)',
                            borderRadius: '5px',
                        }}
                    />
                    {/* Played */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: `${progressPercent}%`,
                            backgroundColor: '#e50914', // Netflix red
                            borderRadius: '5px',
                        }}
                    />
                    {/* Thumb */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: `${progressPercent}%`,
                            transform: 'translate(-50%, -50%)',
                            width: isMobile ? '16px' : (isHoveringProgress ? '14px' : '0px'),
                            height: isMobile ? '16px' : (isHoveringProgress ? '14px' : '0px'),
                            backgroundColor: '#e50914',
                            borderRadius: '50%',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                    />
                </div>

                {/* Controls Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Left Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: isMobile ? '8px' : '0',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {isPlaying ? (
                                <Pause style={{ width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, color: 'white', fill: 'white' }} />
                            ) : (
                                <Play style={{ width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, color: 'white', fill: 'white' }} />
                            )}
                        </button>

                        {/* Skip Back */}
                        <button
                            onClick={() => skip(-10)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: isMobile ? '8px' : '0' }}
                        >
                            <SkipBack style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, color: 'white' }} />
                        </button>

                        {/* Skip Forward */}
                        <button
                            onClick={() => skip(10)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: isMobile ? '8px' : '0' }}
                        >
                            <SkipForward style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, color: 'white' }} />
                        </button>

                        {/* Volume - Hide on mobile */}
                        {!isMobile && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    onClick={toggleMute}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    {isMuted || volume === 0 ? (
                                        <VolumeX style={{ width: 24, height: 24, color: 'white' }} />
                                    ) : (
                                        <Volume2 style={{ width: 24, height: 24, color: 'white' }} />
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    style={{
                                        width: '80px',
                                        height: '4px',
                                        accentColor: '#e50914',
                                        cursor: 'pointer',
                                    }}
                                />
                            </div>
                        )}

                        {/* Time */}
                        <span style={{ color: 'white', fontSize: isMobile ? '12px' : '14px', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    {/* Right Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
                        {/* Mute button on mobile */}
                        {isMobile && (
                            <button
                                onClick={toggleMute}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                            >
                                {isMuted || volume === 0 ? (
                                    <VolumeX style={{ width: 20, height: 20, color: 'white' }} />
                                ) : (
                                    <Volume2 style={{ width: 20, height: 20, color: 'white' }} />
                                )}
                            </button>
                        )}
                        {/* Fullscreen */}
                        <button
                            onClick={toggleFullscreen}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: isMobile ? '8px' : '0' }}
                        >
                            {isFullscreen ? (
                                <Minimize style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, color: 'white' }} />
                            ) : (
                                <Maximize style={{ width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, color: 'white' }} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
