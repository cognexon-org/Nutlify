import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import videoMp4 from "../assets/video/moments.mp4";
import videoWebm from "../assets/video/moments.webm";
import poster from "../assets/video/moments-poster.webp";

/*
 * Plays muted while on screen and pauses when scrolled away.
 * Visitors who prefer reduced motion get the poster and a play button instead.
 */
export default function MomentsVideo() {
  const ref = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) el.play().catch(() => {});
        else if (!entry.isIntersecting) el.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const togglePlay = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  const toggleSound = () => {
    const el = ref.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted && el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    }
  };

  const btn =
    "grid h-8 w-8 place-items-center rounded-full sm:h-10 sm:w-10 bg-black/35 text-cream backdrop-blur-sm transition-colors hover:bg-black/55";

  return (
    <div className="relative overflow-hidden rounded-2xl ring-1 ring-cream/15 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]">
      <video
        ref={ref}
        className="block aspect-video w-full bg-[#123A2B]"
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="NUVANA through the day: at your desk, with evening chai, shared at home and as a gift"
      >
        <source src={videoMp4} type="video/mp4" />
        <source src={videoWebm} type="video/webm" />
      </video>

      {!playing && reduced && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 grid place-items-center bg-black/10"
          aria-label="Play video"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-cream text-forest-deep shadow-lg">
            <Play size={26} className="translate-x-0.5" />
          </span>
        </button>
      )}

      <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-4">
        <button type="button" onClick={togglePlay} className={btn} aria-label={playing ? "Pause video" : "Play video"}>
          {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-px" />}
        </button>
        <button type="button" onClick={toggleSound} className={btn} aria-label={muted ? "Turn sound on" : "Turn sound off"}>
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
}
