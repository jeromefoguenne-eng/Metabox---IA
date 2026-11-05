import { getAssetPath } from "../utils/assetPath";
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Play } from 'lucide-react';

export default function IntroVideoGenerique({ onFinish }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const attemptPlay = async () => {
      if (cancelled || !video || !video.paused) return;
      try {
        video.muted = false;
        setIsMuted(false);
        await video.play();
        if (!cancelled) setIsPlaying(true);
      } catch {
        // Si le navigateur bloque l'autoplay audio initial, démarrer immédiatement en muet
        if (cancelled || !video) return;
        try {
          video.muted = true;
          setIsMuted(true);
          await video.play();
          if (!cancelled) setIsPlaying(true);
        } catch (e2) {
          console.warn("Lecture automatique en attente :", e2);
        }
      }
    };

    attemptPlay();

    const handleReady = () => {
      if (video.paused && !cancelled) {
        attemptPlay();
      }
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => triggerFadeOut();

    video.addEventListener('loadeddata', handleReady);
    video.addEventListener('canplay', handleReady);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      cancelled = true;
      video.removeEventListener('loadeddata', handleReady);
      video.removeEventListener('canplay', handleReady);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('playing', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const triggerFadeOut = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 700);
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.muted = false;
        setIsMuted(false);
        video.play().then(() => setIsPlaying(true)).catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
      } else if (video.muted) {
        video.muted = false;
        setIsMuted(false);
      }
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Lecteur Vidéo Plein Écran */}
      <video
        ref={videoRef}
        src={getAssetPath("/videos/generique_metabox.mp4")}
        muted={isMuted}
        playsInline
        autoPlay
        preload="auto"
        className="w-full h-full object-contain md:object-cover cursor-pointer"
        onClick={handleManualPlay}
      />

      {/* Barre de progression discrète en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 backdrop-blur-xs">
        <div 
          className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bouton Play si en pause */}
      {!isPlaying && (
        <button
          onClick={handleManualPlay}
          className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition hover:scale-110 shadow-2xl group cursor-pointer"
          title="Lancer le générique"
        >
          <Play className="w-10 h-10 ml-1 fill-white text-white group-hover:scale-110 transition" />
        </button>
      )}

      {/* Badge Titre en haut à gauche avec Logo HECh */}
      <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-white pointer-events-none">
        <div className="h-8 w-8 p-0.5 rounded-lg bg-white flex items-center justify-center">
          <img
            src={getAssetPath("/images/hech_logo_officiel.png")}
            alt="Haute École Charlemagne"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-['Outfit'] font-bold text-sm tracking-wide">
          SAR HECh · Métabox IA
        </span>
      </div>

      {/* Contrôles d'Action Flottants en haut à droite */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        {/* Toggle Son */}
        <button
          onClick={handleToggleMute}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition hover:scale-105 shadow-lg text-xs font-bold cursor-pointer"
          title={isMuted ? "Activer le son" : "Couper le son"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline text-rose-300">Activer le son</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline text-emerald-300">Son actif</span>
            </>
          )}
        </button>

        {/* Bouton Passer l'intro */}
        <button
          onClick={triggerFadeOut}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-indigo-500/30 transition hover:scale-105 border border-white/20 cursor-pointer"
        >
          <span>Passer le générique</span>
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Avertissement Son si Muted */}
      {isMuted && isPlaying && (
        <div 
          onClick={handleToggleMute}
          className="absolute bottom-8 cursor-pointer flex items-center gap-2 bg-black/70 hover:bg-black/90 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-400/50 text-yellow-300 text-xs font-medium animate-bounce shadow-xl"
        >
          <VolumeX className="w-4 h-4" />
          <span>Vidéo en sourdine · Cliquez ici pour activer le son 🔊</span>
        </div>
      )}
    </div>
  );
}
