"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Download, Loader2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  title?: string;
  className?: string;
  onError?: () => void;
}

export function AudioPlayer({ src, title, className, onError }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = () => {
      setError(true);
      setIsLoading(false);
      onError?.();
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [onError]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setError(true);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = title || "audio.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className={cn(
        "flex items-center justify-center p-4 rounded-xl",
        "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50",
        className
      )}>
        <p className="text-sm">Audio no disponible</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-xl",
      "bg-slate-100 dark:bg-white/10",
      className
    )}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause Button */}
      <Button
        variant="primary"
        size="sm"
        onClick={togglePlay}
        disabled={isLoading}
        className="w-10 h-10 rounded-full p-0 flex items-center justify-center"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </Button>

      {/* Progress Bar */}
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs text-slate-500 dark:text-white/50 w-10 text-right font-mono">
          {formatTime(currentTime)}
        </span>

        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="flex-1 h-2 bg-slate-200 dark:bg-white/20 rounded-full cursor-pointer overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-xs text-slate-500 dark:text-white/50 w-10 font-mono">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume Button */}
      <Button
        variant="glass"
        size="sm"
        onClick={toggleMute}
        className="w-8 h-8 p-0"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </Button>

      {/* Download Button */}
      <Button
        variant="glass"
        size="sm"
        onClick={handleDownload}
        className="w-8 h-8 p-0"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}
