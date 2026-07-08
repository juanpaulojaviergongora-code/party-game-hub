import { useEffect, useRef, useState } from "react";
import KingsCup from "../games/KingsCup";
import TruthOrDare from "../games/TruthOrDare";
import WheelOfNames from "../games/WheelOfNames";
import WhoIsSpy from "../games/WhoIsSpy";
import MostLikelyTo from "../games/MostLikelyTo";
import LetterRush from "../games/LetterRush";
import CharadesGame from "../games/CharadesGame";
import BarkadaDash from "../games/BarkadaDash";
import WouldYouRather from "../games/WouldYouRather";
import BarkadaSpectrum from "../games/BarkadaSpectrum";

const gameCatalog = [
  {
    id: "spin",
    title: "Wheel of Names",
    description:
      "Add players, spin the casino wheel, and randomly choose someone.",
    playable: true,
  },
  {
    id: "spy",
    title: "Who's the Spy?",
    description:
      "Players pass the device, reveal secret roles, then try to identify the spy.",
    playable: true,
  },
  {
    id: "likely",
    title: "Most Likely To",
    description:
      "Reveal a flash card, pass the device privately, and show anonymous results.",
    playable: true,
  },
  {
    id: "letter",
    title: "Letter Rush",
    description:
      "Race against the timer with a random category and a random letter.",
    playable: true,
  },
  {
    id: "charades",
    title: "Charades & Reverse Charades",
    description:
      "Choose classic Charades or Reverse Charades, race the timer, and score for your team.",
    playable: true,
  },
  {
    id: "dash",
    title: "Barkada Dash",
    description:
      "Draw original party cards, complete fun challenges, collect stars, and race to the finish.",
    playable: true,
  },
  {
    id: "wyr",
    title: "Would You Rather",
    description:
      "Pass the phone, vote privately, then the group with fewer votes takes the penalty.",
    playable: true,
  },
  {
    id: "spectrum",
    title: "Barkada Spectrum",
    description:
      "Give one clue, move the dial, and get close to the hidden target as a team.",
    playable: true,
  },
];

const tabletopGameCards = [
  { id: "kings", title: "Kings Cup", icon: "♛", className: "table-kings" },
  { id: "truth", title: "Truth or Dare", icon: "💋", className: "table-truth" },
  { id: "spy", title: "Who's the Spy?", icon: "🕵", className: "table-spy" },
  { id: "spectrum", title: "Barkada Spectrum", icon: "◒", className: "table-spectrum" },
  { id: "letter", title: "Letter Rush", icon: "A", className: "table-letter" },
  { id: "wyr", title: "Would You Rather?", icon: "?", className: "table-wyr" },
  { id: "more", title: "Other Games", icon: "⋯", className: "table-more" },
];

const tabletopMoreCards = [
  { id: "spin", title: "Wheel of Names", icon: "◉", className: "table-wheel" },
  { id: "likely", title: "Most Likely To", icon: "★", className: "table-likely" },
  { id: "charades", title: "Charades", icon: "🎭", className: "table-charades" },
];

function getSavedData(key, fallbackValue) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}


function GamesPage({ onGoHome }) {
  const initialRouteParams = new URLSearchParams(window.location.search);
  const initialGame = initialRouteParams.get("game");
  const initialTab = initialRouteParams.get("tab");

  const initialSelectedGame = [
    "spin",
    "spy",
    "likely",
    "letter",
    "charades",
    "dash",
    "wyr",
    "spectrum",
  ].includes(initialGame)
    ? initialGame
    : null;

  const initialActiveTab =
    initialTab === "about"
      ? "about"
      : initialGame === "kings"
        ? "kings"
        : initialGame === "truth"
          ? "truth"
          : "games";

  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [selectedGame, setSelectedGame] = useState(initialSelectedGame);

  const [theme, setTheme] = useState(() =>
    getSavedData("party-theme", "casino")
  );
  const [musicEnabled, setMusicEnabled] = useState(() =>
    getSavedData("party-music-enabled", false)
  );
  const [musicTrack, setMusicTrack] = useState(() =>
    getSavedData("party-music-track", "casino")
  );
  const [musicVolume, setMusicVolume] = useState(() =>
    getSavedData("party-music-volume", 0.8)
  );
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() =>
    getSavedData("party-sound-effects-enabled", true)
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPartyControls, setShowPartyControls] = useState(() =>
    getSavedData("party-controls-open", false)
  );
  const [audioReady, setAudioReady] = useState(false);

  const isTabletopLobby = activeTab === "games" && (!selectedGame || selectedGame === "more");

  const audioContextRef = useRef(null);
  const musicTimerRef = useRef(null);
  const musicStepRef = useRef(0);
  const musicVolumeRef = useRef(musicVolume);

  useEffect(() => {
    localStorage.setItem("party-theme", JSON.stringify(theme));
    document.body.dataset.partyTheme = theme;

    return () => {
      delete document.body.dataset.partyTheme;
    };
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "party-music-enabled",
      JSON.stringify(musicEnabled)
    );
  }, [musicEnabled]);

  useEffect(() => {
    localStorage.setItem(
      "party-music-track",
      JSON.stringify(musicTrack)
    );
    musicStepRef.current = 0;
  }, [musicTrack]);

  useEffect(() => {
    localStorage.setItem(
      "party-music-volume",
      JSON.stringify(musicVolume)
    );
    musicVolumeRef.current = musicVolume;
  }, [musicVolume]);

  useEffect(() => {
    localStorage.setItem(
      "party-sound-effects-enabled",
      JSON.stringify(soundEffectsEnabled)
    );
  }, [soundEffectsEnabled]);

  useEffect(() => {
    localStorage.setItem(
      "party-controls-open",
      JSON.stringify(showPartyControls)
    );
  }, [showPartyControls]);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", syncFullscreen);
    syncFullscreen();

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
    };
  }, []);

  useEffect(() => {
    if (!musicEnabled || !audioReady) {
      window.clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
      return;
    }

    const context = getAudioContext();

    if (!context || context.state !== "running") return;

    const tracks = {
      casino: {
        melody: [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23],
        bass: [130.81, 146.83, 164.81, 146.83],
        interval: 510,
        noteDuration: 0.46,
        bassDuration: 0.62,
        accentEvery: 4,
        bassEvery: 2,
        wave: "triangle",
      },
      arcade: {
        melody: [523.25, 659.25, 783.99, 659.25, 587.33, 739.99, 880.0, 739.99],
        bass: [130.81, 130.81, 146.83, 164.81],
        interval: 300,
        noteDuration: 0.24,
        bassDuration: 0.36,
        accentEvery: 4,
        bassEvery: 4,
        wave: "square",
      },
      chill: {
        melody: [293.66, 329.63, 392.0, 440.0, 392.0, 349.23, 329.63, 293.66],
        bass: [146.83, 130.81, 110.0, 130.81],
        interval: 680,
        noteDuration: 0.62,
        bassDuration: 0.78,
        accentEvery: 8,
        bassEvery: 2,
        wave: "sine",
      },
      fiesta: {
        melody: [392.0, 493.88, 587.33, 493.88, 440.0, 523.25, 659.25, 587.33],
        bass: [196.0, 220.0, 164.81, 196.0],
        interval: 380,
        noteDuration: 0.32,
        bassDuration: 0.48,
        accentEvery: 4,
        bassEvery: 2,
        wave: "sawtooth",
      },
      opmParty: {
        melody: [392.0, 440.0, 493.88, 587.33, 493.88, 440.0, 392.0, 329.63],
        bass: [196.0, 164.81, 174.61, 196.0],
        interval: 430,
        noteDuration: 0.36,
        bassDuration: 0.55,
        accentEvery: 4,
        bassEvery: 2,
        wave: "triangle",
      },
      opmHugot: {
        melody: [329.63, 392.0, 440.0, 392.0, 349.23, 329.63, 293.66, 329.63],
        bass: [164.81, 146.83, 130.81, 146.83],
        interval: 760,
        noteDuration: 0.68,
        bassDuration: 0.92,
        accentEvery: 8,
        bassEvery: 2,
        wave: "sine",
      },
      opmBarkada: {
        melody: [440.0, 493.88, 523.25, 587.33, 523.25, 493.88, 440.0, 392.0],
        bass: [220.0, 196.0, 174.61, 196.0],
        interval: 470,
        noteDuration: 0.38,
        bassDuration: 0.58,
        accentEvery: 4,
        bassEvery: 2,
        wave: "triangle",
      },
      opmKilig: {
        melody: [523.25, 493.88, 440.0, 493.88, 523.25, 587.33, 659.25, 587.33],
        bass: [261.63, 220.0, 196.0, 220.0],
        interval: 520,
        noteDuration: 0.43,
        bassDuration: 0.65,
        accentEvery: 4,
        bassEvery: 2,
        wave: "sine",
      },
      tagayTambay: {
        melody: [329.63, 392.0, 440.0, 392.0, 493.88, 440.0, 392.0, 349.23],
        bass: [164.81, 146.83, 130.81, 146.83],
        interval: 560,
        noteDuration: 0.48,
        bassDuration: 0.7,
        accentEvery: 4,
        bassEvery: 2,
        wave: "triangle",
      },
      barkadaNight: {
        melody: [440.0, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440.0],
        bass: [220.0, 196.0, 174.61, 196.0],
        interval: 360,
        noteDuration: 0.3,
        bassDuration: 0.46,
        accentEvery: 4,
        bassEvery: 2,
        wave: "square",
      },
      karaokeBreak: {
        melody: [392.0, 440.0, 493.88, 587.33, 659.25, 587.33, 493.88, 440.0],
        bass: [196.0, 164.81, 174.61, 196.0],
        interval: 445,
        noteDuration: 0.38,
        bassDuration: 0.56,
        accentEvery: 4,
        bassEvery: 2,
        wave: "sawtooth",
      },
      afterParty: {
        melody: [293.66, 329.63, 392.0, 329.63, 349.23, 392.0, 440.0, 392.0],
        bass: [146.83, 130.81, 110.0, 130.81],
        interval: 740,
        noteDuration: 0.66,
        bassDuration: 0.9,
        accentEvery: 8,
        bassEvery: 2,
        wave: "sine",
      },
    };

    const track = tracks[musicTrack] || tracks.casino;

    const playMusicStep = () => {
      const step = musicStepRef.current;
      const now = context.currentTime + 0.02;
      const note = track.melody[step % track.melody.length];

      playMusicTone(
        context,
        note,
        now,
        track.noteDuration,
        step % track.accentEvery === 0,
        false,
        track.wave
      );

      if (step % track.bassEvery === 0) {
        playMusicTone(
          context,
          track.bass[Math.floor(step / track.bassEvery) % track.bass.length],
          now,
          track.bassDuration,
          false,
          true
        );
      }

      musicStepRef.current += 1;
    };

    playMusicStep();
    musicTimerRef.current = window.setInterval(playMusicStep, track.interval);

    return () => {
      window.clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    };
  }, [musicEnabled, musicVolume, musicTrack]);

  useEffect(() => {
    return () => {
      window.clearInterval(musicTimerRef.current);

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  }

  function unlockAudio() {
    const context = getAudioContext();

    if (!context) return null;

    const markReady = () => {
      setAudioReady(context.state === "running");
    };

    if (context.state === "suspended") {
      context.resume().then(markReady).catch(() => {
        setAudioReady(false);
      });
    } else {
      markReady();
    }

    return context;
  }

  function playEffectTone(
    context,
    frequency,
    startTime,
    duration,
    volume,
    wave = "sine"
  ) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.0002, volume),
      startTime + 0.012
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  }

  function playMusicTone(
    context,
    frequency,
    startTime,
    duration,
    accent = false,
    isBass = false,
    wave = "triangle"
  ) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const baseVolume = Math.min(
      0.18,
      Math.max(
        0.003,
        musicVolumeRef.current *
          (isBass ? 0.10 : accent ? 0.15 : 0.115)
      )
    );

    oscillator.type = isBass ? "sine" : wave;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(
      baseVolume,
      startTime + 0.035
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.05);
  }

  function playSoundEffect(effect) {
    if (!soundEffectsEnabled) return;

    const context = unlockAudio();

    if (!context) return;

    const sounds = {
      click: [
        [660, 0, 0.06, 0.024, "sine"],
        [880, 0.045, 0.05, 0.014, "sine"],
      ],
      card: [
        [330, 0, 0.06, 0.032, "triangle"],
        [494, 0.055, 0.09, 0.03, "triangle"],
        [659, 0.12, 0.11, 0.026, "triangle"],
      ],
      spin: [
        [220, 0, 0.08, 0.026, "sawtooth"],
        [277, 0.08, 0.08, 0.024, "sawtooth"],
        [330, 0.16, 0.08, 0.022, "sawtooth"],
        [392, 0.24, 0.12, 0.02, "sawtooth"],
      ],
      winner: [
        [523.25, 0, 0.14, 0.05, "triangle"],
        [659.25, 0.12, 0.16, 0.048, "triangle"],
        [783.99, 0.25, 0.25, 0.052, "triangle"],
      ],
    };

    const play = () => {
      if (context.state !== "running") return;

      const now = context.currentTime + 0.01;

      (sounds[effect] || sounds.click).forEach(
        ([frequency, delay, duration, volume, wave]) => {
          playEffectTone(
            context,
            frequency,
            now + delay,
            duration,
            volume,
            wave
          );
        }
      );
    };

    if (context.state === "suspended") {
      context.resume().then(play).catch(() => {});
      return;
    }

    play();
  }

  function toggleMusic() {
    const nextValue = !musicEnabled;

    if (nextValue) {
      unlockAudio();
    }

    setMusicEnabled(nextValue);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      return;
    }

    document.exitFullscreen?.().catch(() => {});
  }

  function handleGlobalClick(event) {
    unlockAudio();

    const button = event.target.closest?.("button");

    if (!button || button.disabled || button.dataset.sound === "off") return;

    playSoundEffect("click");
  }

  function openGame(gameId) {
    if (gameId === "kings") {
      setActiveTab("kings");
      setSelectedGame(null);
      return;
    }

    if (gameId === "truth") {
      setActiveTab("truth");
      setSelectedGame(null);
      return;
    }

    setActiveTab("games");
    setSelectedGame(gameId);
  }


  function resetAllData() {
    const shouldReset = window.confirm(
      "Reset all saved game rules, prompts, questions, and settings on this device?"
    );

    if (!shouldReset) return;

    [
      "party-rules",
      "party-truths",
      "party-dares",
      "party-letter-rush-categories",
      "party-most-likely-questions",
      "party-theme",
      "party-music-enabled",
      "party-music-track",
      "party-music-volume",
      "party-sound-effects-enabled",
      "party-controls-open",
    ].forEach((key) => localStorage.removeItem(key));

    window.location.reload();
  }

  return (
    <main className={`app-shell party-table-global-theme theme-${theme} ${isTabletopLobby ? "tabletop-app-mode" : ""}`} onClickCapture={handleGlobalClick}>

      <style>{`
        .party-table-global-theme {
          --table-wood-light: #9a581f;
          --table-wood-mid: #6d3310;
          --table-wood-dark: #2c1205;
          --table-panel: rgba(47, 20, 7, 0.92);
          --table-panel-soft: rgba(89, 41, 13, 0.88);
          --table-cream: #fff1c4;
          --table-gold: #ffd46f;
          --table-red: #b61f26;
          --table-red-dark: #6f0e15;
          --table-line: rgba(255, 221, 137, 0.46);
          --table-muted: #f2d7ad;
          color: var(--table-cream);
          background: transparent !important;
          background-image: none !important;
}

        .party-table-global-theme .theme-background {
          opacity: 0.16 !important;
          mix-blend-mode: screen;
        }

        .party-table-global-theme:not(.tabletop-app-mode) {
          min-height: 100vh;
          padding: clamp(18px, 3vw, 42px) !important;
          box-sizing: border-box;
          box-shadow: none !important;
        }

        .party-table-global-theme .hero,
        .party-table-global-theme .party-settings,
        .party-table-global-theme .tabs,
        .party-table-global-theme .footer {
          position: relative;
          z-index: 2;
        }

        .party-table-global-theme .hero,
        .party-table-global-theme .party-control-bar,
        .party-table-global-theme .about-hero,
        .party-table-global-theme .about-card,
        .party-table-global-theme .about-note,
        .party-table-global-theme .footer {
          border: 2px solid var(--table-line) !important;
          border-radius: 20px !important;
          background:
            radial-gradient(circle at 86% 10%, rgba(255, 220, 132, 0.15), transparent 24%),
            linear-gradient(145deg, rgba(89, 41, 13, 0.96), rgba(39, 14, 4, 0.97)) !important;
          box-shadow:
            0 12px 0 rgba(39, 14, 4, 0.52),
            0 23px 34px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.09) !important;
        }

        .party-table-global-theme .hero h1,
        .party-table-global-theme .section-heading h2,
        .party-table-global-theme .about-hero h2,
        .party-table-global-theme .page-section h2 {
          color: var(--table-cream) !important;
          text-shadow: 3px 3px 0 #351405 !important;
        }

        .party-table-global-theme .hero-text,
        .party-table-global-theme .small-text,
        .party-table-global-theme .about-card p,
        .party-table-global-theme .about-hero p,
        .party-table-global-theme .about-note,
        .party-table-global-theme .footer p {
          color: var(--table-muted) !important;
        }

        .party-table-global-theme .eyebrow,
        .party-table-global-theme .rank-badge,
        .party-table-global-theme .deck-count,
        .party-table-global-theme .developer-name {
          color: var(--table-gold) !important;
        }

        .party-table-global-theme .tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 24px 0 26px;
        }

        .party-table-global-theme .tab,
        .party-table-global-theme .settings-toggle,
        .party-table-global-theme .party-control,
        .party-table-global-theme .primary-button,
        .party-table-global-theme .secondary-button,
        .party-table-global-theme .danger-button,
        .party-table-global-theme .delete-button,
        .party-table-global-theme .back-button,
        .party-table-global-theme .reset-link {
          border: 2px solid rgba(255, 234, 169, 0.68) !important;
          border-radius: 12px !important;
          background:
            linear-gradient(145deg, #9c1e2a, #660d15) !important;
          color: #fff7dd !important;
          box-shadow:
            0 5px 0 rgba(48, 10, 5, 0.68),
            inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
          font-weight: 900 !important;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.35);
          transition: transform 0.18s ease, box-shadow 0.18s ease !important;
        }

        .party-table-global-theme .secondary-button,
        .party-table-global-theme .tab,
        .party-table-global-theme .back-button,
        .party-table-global-theme .reset-link {
          background:
            linear-gradient(145deg, #704114, #3c1c08) !important;
        }

        .party-table-global-theme .danger-button,
        .party-table-global-theme .delete-button {
          background:
            linear-gradient(145deg, #c32732, #780f18) !important;
        }

        .party-table-global-theme .primary-button:hover,
        .party-table-global-theme .secondary-button:hover,
        .party-table-global-theme .danger-button:hover,
        .party-table-global-theme .delete-button:hover,
        .party-table-global-theme .back-button:hover,
        .party-table-global-theme .tab:hover,
        .party-table-global-theme .settings-toggle:hover,
        .party-table-global-theme .party-control:hover {
          transform: translateY(-3px) !important;
          box-shadow:
            0 8px 0 rgba(48, 10, 5, 0.62),
            0 14px 20px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.18) !important;
        }

        .party-table-global-theme .tab.active,
        .party-table-global-theme .active-control,
        .party-table-global-theme .active-settings-toggle {
          background:
            linear-gradient(145deg, #d52d36, #8a1019) !important;
          border-color: #ffe38a !important;
        }

        .party-table-global-theme input,
        .party-table-global-theme textarea,
        .party-table-global-theme select {
          border: 1px solid rgba(255, 229, 157, 0.48) !important;
          border-radius: 10px !important;
          background: rgba(35, 13, 4, 0.88) !important;
          color: #fff4d5 !important;
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.22) !important;
        }

        .party-table-global-theme input::placeholder,
        .party-table-global-theme textarea::placeholder {
          color: rgba(255, 229, 188, 0.56) !important;
        }

        .party-table-global-theme .page-section {
          position: relative;
          overflow: hidden;
          border: 2px solid var(--table-line) !important;
          border-radius: 26px !important;
          background:
            radial-gradient(circle at 89% 8%, rgba(255, 211, 99, 0.13), transparent 24%),
            linear-gradient(145deg, rgba(78, 35, 11, 0.97), rgba(38, 13, 4, 0.98)) !important;
          box-shadow:
            0 14px 0 rgba(39, 14, 4, 0.48),
            0 28px 43px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255,255,255,0.07) !important;
        }

        .party-table-global-theme .page-section::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.16;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(255, 224, 163, 0.05) 0,
              rgba(255, 224, 163, 0.05) 1px,
              transparent 1px,
              transparent 8px
            );
        }

        .party-table-global-theme .page-section > * {
          position: relative;
          z-index: 1;
        }

        .party-table-global-theme .game-card,
        .party-table-global-theme .kings-draw-panel,
        .party-table-global-theme .kings-info-box,
        .party-table-global-theme .kings-rule-card,
        .party-table-global-theme .kings-add-rule,
        .party-table-global-theme .tod-player-panel,
        .party-table-global-theme .prompt-display,
        .party-table-global-theme .prompt-editor,
        .party-table-global-theme .spy-panel,
        .party-table-global-theme .spy-stage,
        .party-table-global-theme .spy-card,
        .party-table-global-theme .likely-player-panel,
        .party-table-global-theme .likely-question-panel,
        .party-table-global-theme .likely-pass-card,
        .party-table-global-theme .likely-vote-card,
        .party-table-global-theme .likely-recorded-card,
        .party-table-global-theme .likely-results-card,
        .party-table-global-theme .letter-rush-panel,
        .party-table-global-theme .letter-rush-board,
        .party-table-global-theme .category-editor-card,
        .party-table-global-theme .wyr-setup-card,
        .party-table-global-theme .wyr-stage,
        .party-table-global-theme .wyr-result-card,
        .party-table-global-theme .wyr-score-panel,
        .party-table-global-theme .spec-panel,
        .party-table-global-theme .spec-stage,
        .party-table-global-theme .spec-card,
        .party-table-global-theme .spec-result,
        .party-table-global-theme .spec-scoreboard,
        .party-table-global-theme [class*="charades"],
        .party-table-global-theme [class*="dash"],
        .party-table-global-theme [class*="wheel"] {
          border-color: rgba(255, 226, 151, 0.38) !important;
          background:
            radial-gradient(circle at 88% 9%, rgba(255, 216, 114, 0.13), transparent 23%),
            linear-gradient(145deg, rgba(91, 41, 13, 0.95), rgba(41, 14, 4, 0.98)) !important;
          color: var(--table-cream) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 12px 23px rgba(0,0,0,0.21) !important;
        }

        .party-table-global-theme .kings-card-face.kings-card-front {
          background: linear-gradient(145deg, #fffdf1, #eee3cd) !important;
        }

        .party-table-global-theme .kings-card-back {
          background:
            repeating-linear-gradient(45deg, rgba(255, 236, 155, 0.1) 0, rgba(255, 236, 155, 0.1) 12px, transparent 12px, transparent 25px),
            radial-gradient(circle at 45% 40%, rgba(255, 211, 108, 0.26), transparent 20%),
            linear-gradient(145deg, #65152a, #9c2143 52%, #3d0e27) !important;
        }

        .party-table-global-theme .prompt-display,
        .party-table-global-theme .likely-pass-card,
        .party-table-global-theme .likely-vote-card,
        .party-table-global-theme .wyr-question-card,
        .party-table-global-theme .spec-card,
        .party-table-global-theme .kings-card {
          border-color: rgba(255, 229, 155, 0.6) !important;
        }

        .party-table-global-theme .tod-active-player,
        .party-table-global-theme .spy-role,
        .party-table-global-theme .likely-winner,
        .party-table-global-theme .letter-rush-letter,
        .party-table-global-theme .wyr-score-box strong,
        .party-table-global-theme .spec-summary strong,
        .party-table-global-theme .kings-rule-rank {
          color: var(--table-gold) !important;
          text-shadow: 2px 2px 0 rgba(52, 16, 3, 0.35) !important;
        }

        .party-table-global-theme .wyr-option,
        .party-table-global-theme .candidate-button,
        .party-table-global-theme .spectrum-direction-button {
          border-color: rgba(255, 232, 166, 0.6) !important;
          background: linear-gradient(145deg, #8b1b26, #4f0a12) !important;
          color: #fff7e4 !important;
          box-shadow: 0 8px 0 rgba(46, 10, 5, 0.48) !important;
        }

        .party-table-global-theme .wyr-option.option-b,
        .party-table-global-theme .candidate-button:nth-child(even),
        .party-table-global-theme .spectrum-direction-button:nth-child(even) {
          background: linear-gradient(145deg, #0d6a69, #063a3b) !important;
        }

        .party-table-global-theme .result-track,
        .party-table-global-theme .spectrum-board,
        .party-table-global-theme .wheel-track {
          border-color: rgba(255, 232, 166, 0.38) !important;
        }

        .party-table-global-theme .result-fill,
        .party-table-global-theme .progress-fill,
        .party-table-global-theme .timer-progress {
          background: linear-gradient(90deg, #ffd46f, #d92d31) !important;
        }

        .party-table-global-theme .rank-badge,
        .party-table-global-theme .wyr-category,
        .party-table-global-theme .spec-category,
        .party-table-global-theme .spectrum-category {
          border-color: rgba(255, 227, 152, 0.55) !important;
          background: rgba(114, 57, 15, 0.45) !important;
          color: #fff0b5 !important;
        }

        .party-table-global-theme .form-error,
        .party-table-global-theme .spy-error,
        .party-table-global-theme .kings-empty-deck {
          color: #ffd0ca !important;
        }

        .party-table-global-theme .footer {
          margin-top: 28px !important;
        }




        @media (max-width: 650px) {
          .party-table-global-theme:not(.tabletop-app-mode) {
            padding: 12px !important;
          }

          .party-table-global-theme .page-section {
            border-radius: 18px !important;
          }

          .party-table-global-theme .tabs {
            gap: 7px;
          }
        }
      `}</style>

      <div className="theme-background" aria-hidden="true">
        <span className="theme-particle" />
        <span className="theme-particle" />
        <span className="theme-particle" />
        <span className="theme-particle" />
        <span className="theme-particle" />
        <span className="theme-particle" />
        <span className="theme-particle" />
        <span className="theme-particle" />
      </div>
      {!isTabletopLobby && (
        <>
      <header className="hero">
        <p className="eyebrow">Welcome Mga Kupal To</p>

        <h1>Booze Clues Hub</h1>

        <p className="hero-text">
          Pour decisions start here. Don't Drink and Drive, Drink Responsibly!, enjoy and play safe
        </p>
      </header>

      <section className="party-settings" aria-label="Party settings">
        <button
          className={
            showPartyControls
              ? "settings-toggle active-settings-toggle"
              : "settings-toggle"
          }
          onClick={() => setShowPartyControls((oldValue) => !oldValue)}
          aria-expanded={showPartyControls}
          aria-controls="party-controls-panel"
        >
          <span className="settings-toggle-icon">⚙</span>
          {showPartyControls ? "Hide Party Settings" : "Party Settings"}
          <span className="settings-toggle-arrow">
            {showPartyControls ? "⌃" : "⌄"}
          </span>
        </button>

        {showPartyControls && (
          <section
            id="party-controls-panel"
            className="party-control-bar"
            aria-label="Party controls"
          >
            <div className="party-control-copy">
              <p className="eyebrow">Party Controls</p>
              <p>Set the mood, audio, and display before the games begin.</p>
            </div>

            <div className="party-control-actions">
              <button
                className={
                  audioReady ? "party-control active-control" : "party-control"
                }
                onClick={unlockAudio}
                aria-pressed={audioReady}
              >
                {audioReady ? "🔊 Sound Ready" : "🔊 Enable Sound"}
              </button>

              <button
                className={
                  musicEnabled ? "party-control active-control" : "party-control"
                }
                onClick={toggleMusic}
                aria-pressed={musicEnabled}
              >
                ♫ Music: {musicEnabled ? "On" : "Off"}
              </button>

              <button
                className={
                  soundEffectsEnabled
                    ? "party-control active-control"
                    : "party-control"
                }
                onClick={() =>
                  setSoundEffectsEnabled((oldValue) => !oldValue)
                }
                aria-pressed={soundEffectsEnabled}
              >
                ✦ Effects: {soundEffectsEnabled ? "On" : "Off"}
              </button>

              <button className="party-control" onClick={toggleFullscreen}>
                {isFullscreen ? "⤢ Exit Fullscreen" : "⛶ Fullscreen"}
              </button>
            </div>

            <label className="music-track-control">
              <span>Music style</span>
              <select
                value={musicTrack}
                onChange={(event) => setMusicTrack(event.target.value)}
                aria-label="Choose background music style"
              >
                <option value="casino">Casino Lounge</option>
                <option value="arcade">Neon Arcade</option>
                <option value="chill">Chill Night</option>
                <option value="fiesta">Fiesta Energy</option>
                <option value="opmParty">OPM Party Jam</option>
                <option value="opmBarkada">OPM Barkada Singalong</option>
                <option value="opmHugot">OPM Hugot Chill</option>
                <option value="opmKilig">OPM Kilig Vibes</option>
                <option value="tagayTambay">Tagay Tambay</option>
                <option value="barkadaNight">Barkada Night</option>
                <option value="karaokeBreak">Karaoke Break</option>
                <option value="afterParty">After-Party Chill</option>
              </select>
              <small>Original party and inuman-vibes instrumental loops</small>
            </label>

            <label className="music-volume-control">
              <span>Music volume</span>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={musicVolume}
                onChange={(event) => setMusicVolume(Number(event.target.value))}
                aria-label="Background music volume"
              />
              <strong>{Math.round(musicVolume * 100)}%</strong>
            </label>
          </section>
        )}
      </section>


        </>
      )}


      {activeTab === "kings" && (
        <KingsCup
          onBack={() => {
            setActiveTab("games");
            setSelectedGame(null);
          }}
          onSound={playSoundEffect}
        />
      )}

      {activeTab === "truth" && (
        <TruthOrDare
          onBack={() => {
            setActiveTab("games");
            setSelectedGame(null);
          }}
          onSound={playSoundEffect}
        />
      )}

      {activeTab === "about" && (
        <section className="page-section about-page">
          <button className="back-button" onClick={onGoHome}>
            ← Back to Home
          </button>

          <div className="about-hero">
            <span className="rank-badge">Booze Clues Hub · Version 1.0.0</span>
            <h2>Built for easy, memorable game nights.</h2>
            <p>
              Booze Clues Hub is a pass-the-device party website with classic
              games, custom questions, and flexible safe-play options for the
              group.
            </p>
          </div>

          <div className="about-grid">
            <article className="about-card">
              <span className="about-icon">♠</span>
              <h3>What is inside</h3>
              <p>
                Kings Cup, Truth or Dare, Wheel of Names, Who&apos;s the Spy,
                Most Likely To, Letter Rush, and Charades.
              </p>
            </article>

            <article className="about-card">
              <span className="about-icon">♫</span>
              <h3>Party controls</h3>
              <p>
                Use the music volume, sound-effect toggle, fullscreen mode,
                and Casino Night or Light theme to match your setup.
              </p>
            </article>

            <article className="about-card developer-card">
              <span className="about-icon">★</span>
              <h3>Developer</h3>
              <p className="developer-name">Juan Paulo Javier</p>
              <p>
                Created in 2026 as a browser-based Booze Clues experience.
                Custom data stays saved on the device you are using.
              </p>
            </article>
          </div>

          <div className="about-note">
            <strong>Play responsibly:</strong> use water, snacks, points, or
            any safe alternative whenever it works better for your group.
          </div>
        </section>
      )}

      {activeTab === "games" && selectedGame === "spin" && (
        <WheelOfNames
          onBack={() => setSelectedGame(null)}
          onSound={playSoundEffect}
        />
      )}

      {activeTab === "games" && selectedGame === "spy" && (
        <WhoIsSpy
          onBack={() => setSelectedGame(null)}
          onSound={playSoundEffect}
        />
      )}

      {activeTab === "games" && selectedGame === "likely" && (
        <MostLikelyTo onBack={() => setSelectedGame(null)} theme={theme} />
      )}

      {activeTab === "games" && selectedGame === "letter" && (
        <LetterRush onBack={() => setSelectedGame(null)} />
      )}

      {activeTab === "games" && selectedGame === "charades" && (
        <CharadesGame onBack={() => setSelectedGame(null)} />
      )}

      {activeTab === "games" && selectedGame === "dash" && (
        <BarkadaDash
          onBack={() => setSelectedGame(null)}
          onSound={playSoundEffect}
        />
      )}

      {activeTab === "games" && selectedGame === "wyr" && (
        <WouldYouRather
          onBack={() => setSelectedGame(null)}
          onSound={playSoundEffect}
        />
      )}

      {activeTab === "games" && selectedGame === "spectrum" && (
        <BarkadaSpectrum
          onBack={() => setSelectedGame(null)}
          onSound={playSoundEffect}
        />
      )}



      {activeTab === "games" &&
        selectedGame &&
        ![
          "spin",
          "spy",
          "likely",
          "letter",
          "charades",
          "dash",
          "wyr",
          "spectrum",
        ].includes(selectedGame) &&
        (
          <section className="page-section">
            <button className="back-button" onClick={() => setSelectedGame(null)}>
              ← Back to Other Games
            </button>
            <div className="hero-card" style={{ marginTop: 16 }}>
              <p className="eyebrow">Game not found</p>
              <h2>Unknown game: {selectedGame}</h2>
              <p>
                This usually means the card ID does not match the render ID in
                GamesPage.jsx.
              </p>
            </div>
          </section>
        )}

      {!isTabletopLobby && (
        <style>{`
          /*
            ONE BACKGROUND MODE
            The party-table image is the only page background.
            These rules remove the extra wooden/background surfaces created
            by the individual game screens.
          */

          .party-table-global-theme {
            background: transparent !important;
            background-image: none !important;
          }

.party-table-global-theme .page-section,
          .party-table-global-theme #most-likely-game,
          .party-table-global-theme #kings-cup-game,
          .party-table-global-theme #truth-or-dare,
          .party-table-global-theme #who-is-spy,
          .party-table-global-theme #letter-rush-game,
          .party-table-global-theme #charades-game,
          .party-table-global-theme #would-you-rather,
          .party-table-global-theme #barkada-spectrum,
          .party-table-global-theme #reference-wheel,
          .party-table-global-theme #wheel-v3,
          .party-table-global-theme #wheel-of-names {
            background: transparent !important;
            background-image: none !important;
            border-color: transparent !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          .party-table-global-theme .page-section::before,
          .party-table-global-theme .page-section::after,
          .party-table-global-theme #most-likely-game::before,
          .party-table-global-theme #most-likely-game::after,
          .party-table-global-theme #kings-cup-game::before,
          .party-table-global-theme #kings-cup-game::after,
          .party-table-global-theme #truth-or-dare::before,
          .party-table-global-theme #truth-or-dare::after,
          .party-table-global-theme #who-is-spy::before,
          .party-table-global-theme #who-is-spy::after,
          .party-table-global-theme #letter-rush-game::before,
          .party-table-global-theme #letter-rush-game::after,
          .party-table-global-theme #charades-game::before,
          .party-table-global-theme #charades-game::after,
          .party-table-global-theme #would-you-rather::before,
          .party-table-global-theme #would-you-rather::after,
          .party-table-global-theme #barkada-spectrum::before,
          .party-table-global-theme #barkada-spectrum::after {
            display: none !important;
            content: none !important;
            background: transparent !important;
          }

          /*
            Most Likely To had its own wooden game background/panels.
            These panels are now transparent glass, not a second wood image.
          */
          .party-table-global-theme #most-likely-game .likely-player-panel,
          .party-table-global-theme #most-likely-game .likely-question-panel,
          .party-table-global-theme #most-likely-game .likely-pass-card,
          .party-table-global-theme #most-likely-game .likely-vote-card,
          .party-table-global-theme #most-likely-game .likely-recorded-card,
          .party-table-global-theme #most-likely-game .likely-results-card,
          .party-table-global-theme #most-likely-game .likely-question-card {
            background:
              linear-gradient(
                145deg,
                rgba(21, 8, 3, 0.46),
                rgba(7, 3, 1, 0.34)
              ) !important;
            border-color: rgba(255, 222, 143, 0.38) !important;
            box-shadow:
              0 10px 24px rgba(0, 0, 0, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
            backdrop-filter: blur(2px);
          }

          /*
            Wheel of Names / other games: remove their big stage backgrounds,
            but keep the actual wheel, cards, buttons, inputs, and game pieces.
          */




          .party-table-global-theme #reference-wheel .reference-panel,
          .party-table-global-theme #reference-wheel .reference-wheel-stage,
          .party-table-global-theme #reference-wheel .reference-result,
          .party-table-global-theme #wheel-v3 .wheel-v3-panel,
          .party-table-global-theme #wheel-v3 .wheel-v3-stage,
          .party-table-global-theme #wheel-v3 .wheel-v3-result,
          .party-table-global-theme #wheel-of-names .player-panel,
          .party-table-global-theme #wheel-of-names .wheel-game-area,
          .party-table-global-theme #wheel-of-names .wheel-spin-result {
            background: transparent !important;
            background-image: none !important;
            border-color: transparent !important;
            box-shadow: none !important;
          }

          /*
            These are the global brown panel styles that made games look like
            they had their own wooden background. Keep them transparent.
          */
          .party-table-global-theme .kings-draw-panel,
          .party-table-global-theme .kings-info-box,
          .party-table-global-theme .tod-player-panel,
          .party-table-global-theme .prompt-editor,
          .party-table-global-theme .spy-panel,
          .party-table-global-theme .spy-stage,
          .party-table-global-theme .likely-player-panel,
          .party-table-global-theme .likely-question-panel,
          .party-table-global-theme .letter-rush-panel,
          .party-table-global-theme .category-editor-card,
          .party-table-global-theme .wyr-setup-card,
          .party-table-global-theme .wyr-stage,
          .party-table-global-theme .wyr-score-panel,
          .party-table-global-theme .spec-panel,
          .party-table-global-theme .spec-stage,
          .party-table-global-theme .spec-scoreboard {
            background:
              linear-gradient(
                145deg,
                rgba(21, 8, 3, 0.40),
                rgba(7, 3, 1, 0.28)
              ) !important;
            background-image: none !important;
            box-shadow:
              0 10px 22px rgba(0, 0, 0, 0.16),
              inset 0 1px 0 rgba(255,255,255,0.07) !important;
          }
        `}</style>
      )}




      {activeTab === "games" && (!selectedGame || selectedGame === "more") && (
        <>
          <style>{`
            .tabletop-app-mode {
              width: 100%;
              max-width: none;
              min-height: 100vh;
              padding: 0;
              background: #241005;
            }

            .tabletop-app-mode .theme-background {
              display: none;
            }

            .tabletop-app-mode .footer {
              display: none;
            }

            .tabletop-lobby {
              position: relative;
              min-height: 100vh;
              overflow: hidden;
              padding: clamp(18px, 3vw, 44px);
              box-sizing: border-box;
              background:
                linear-gradient(rgba(42, 14, 3, 0.20), rgba(17, 4, 0, 0.32)),
                url("/party-table-background.png") center center / cover no-repeat;
              box-shadow: inset 0 0 110px rgba(0, 0, 0, 0.5);
            }

            .tabletop-lobby::before {
              content: "";
              position: absolute;
              inset: 0;
              pointer-events: none;
              opacity: 0.26;
              background:
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18), transparent 19%),
                radial-gradient(circle at 78% 75%, rgba(0, 0, 0, 0.36), transparent 31%);
              mix-blend-mode: overlay;
            }

            .tabletop-header {
              position: relative;
              z-index: 3;
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 16px;
            }

            .tabletop-brand {
              min-width: 205px;
              padding: 12px 22px 14px;
              border: 4px solid #2b1408;
              border-radius: 15px;
              background: linear-gradient(145deg, #5a2e0d, #321605);
              box-shadow: 0 9px 0 #210e04, inset 0 1px 0 rgba(255,255,255,.14);
              color: #ffe7a1;
              text-align: center;
              transform: rotate(-2deg);
            }

            .tabletop-brand small {
              display: block;
              color: #ffd36c;
              font-size: 0.72rem;
              font-weight: 1000;
              letter-spacing: 0.15em;
            }

            .tabletop-brand h1 {
              margin: 2px 0 0;
              color: #fff1be;
              font-size: clamp(1.65rem, 4.1vw, 3.3rem);
              line-height: 0.9;
              text-shadow: 3px 3px 0 #1b0c03;
            }

            .tabletop-top-actions {
              display: flex;
              align-items: flex-start;
              gap: 10px;
              flex-wrap: wrap;
              justify-content: flex-end;
            }

            .tabletop-settings-button,
            .tabletop-music-button {
              padding: 12px 15px;
              border: 2px solid #fff0ba;
              border-radius: 12px;
              background: rgba(36, 17, 6, 0.9);
              color: #fff5d6;
              box-shadow: 0 5px 0 rgba(24, 10, 3, 0.75);
              cursor: pointer;
              font: inherit;
              font-weight: 900;
            }

            .tabletop-settings-button:hover,
            .tabletop-music-button:hover {
              transform: translateY(-2px);
            }

            .tabletop-controls {
              position: relative;
              z-index: 4;
              display: grid;
              grid-template-columns: 1.1fr 1fr;
              gap: 16px;
              margin: 20px auto 0;
              max-width: 1080px;
              padding: 18px;
              border: 2px solid rgba(255, 221, 138, 0.46);
              border-radius: 18px;
              background: rgba(33, 16, 6, 0.9);
              box-shadow: 0 15px 30px rgba(0,0,0,.28);
              color: #fff5d6;
            }

            .tabletop-controls h2 {
              margin: 0;
              color: #ffe4a3;
              font-size: 1.2rem;
            }

            .tabletop-controls p {
              margin: 7px 0 0;
              color: #f4ddb3;
              line-height: 1.5;
            }

            .tabletop-control-row {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              flex-wrap: wrap;
              gap: 9px;
            }

            .tabletop-control-row button,
            .tabletop-control-row select {
              min-height: 38px;
              padding: 8px 10px;
              border: 1px solid rgba(255, 229, 155, 0.55);
              border-radius: 9px;
              background: #281205;
              color: #fff6dc;
              font: inherit;
              font-weight: 800;
            }

            .tabletop-control-row button.active {
              background: linear-gradient(145deg, #bd1b2e, #791120);
            }

            .tabletop-title {
              position: relative;
              z-index: 2;
              margin: clamp(20px, 4vw, 45px) 0 26px;
              color: #fff4d1;
              text-align: center;
              text-shadow: 3px 3px 0 #301305;
            }

            .tabletop-title p {
              margin: 0;
              color: #ffd66d;
              font-size: 0.82rem;
              font-weight: 1000;
              letter-spacing: 0.15em;
              text-transform: uppercase;
            }

            .tabletop-title h2 {
              margin: 8px 0 0;
              font-size: clamp(2rem, 5vw, 4.3rem);
              line-height: 1;
            }

            .tabletop-card-grid {
              position: relative;
              z-index: 2;
              display: grid;
              grid-template-columns: repeat(3, minmax(155px, 235px));
              justify-content: center;
              gap: clamp(13px, 2.2vw, 25px);
              max-width: 850px;
              margin: 0 auto;
            }

            .table-game-card {
              min-height: 275px;
              padding: 18px 13px;
              border: 7px solid #f8ead0;
              border-radius: 19px;
              box-shadow:
                0 11px 0 rgba(39, 15, 4, 0.58),
                0 22px 28px rgba(0, 0, 0, 0.3),
                inset 0 0 0 2px rgba(255, 255, 255, 0.16);
              color: white;
              cursor: pointer;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font: inherit;
              transform: rotate(var(--card-tilt, 0deg));
              transition: transform .22s ease, box-shadow .22s ease;
            }

            .table-game-card:hover {
              transform: translateY(-13px) rotate(0deg) scale(1.025);
              box-shadow:
                0 18px 0 rgba(39, 15, 4, 0.56),
                0 34px 38px rgba(0, 0, 0, 0.34),
                inset 0 0 0 2px rgba(255, 255, 255, 0.2);
            }

            .table-game-card:active {
              transform: translateY(-3px) rotate(0deg) scale(0.99);
            }

            .table-game-card:nth-child(1) { --card-tilt: -2deg; }
            .table-game-card:nth-child(2) { --card-tilt: 1deg; }
            .table-game-card:nth-child(3) { --card-tilt: 2deg; }
            .table-game-card:nth-child(4) { --card-tilt: 1deg; }
            .table-game-card:nth-child(5) { --card-tilt: -1deg; }
            .table-game-card:nth-child(6) { --card-tilt: 2deg; }

            .table-game-icon {
              display: grid;
              place-items: center;
              width: 83px;
              height: 83px;
              margin-bottom: 18px;
              border: 2px solid rgba(255,255,255,.42);
              border-radius: 50%;
              background: rgba(0,0,0,.2);
              box-shadow: inset 0 2px 0 rgba(255,255,255,.12);
              font-size: 3rem;
              font-weight: 1000;
            }

            .table-game-title {
              max-width: 180px;
              font-size: clamp(1.2rem, 2.6vw, 1.8rem);
              font-weight: 1000;
              line-height: 1.05;
              text-align: center;
              text-transform: uppercase;
            }

            .table-game-play {
              margin-top: 18px;
              padding: 8px 12px;
              border: 1px solid rgba(255,255,255,.6);
              border-radius: 999px;
              background: rgba(0,0,0,.12);
              color: #fff9df;
              font-size: 0.71rem;
              font-weight: 1000;
              letter-spacing: .09em;
            }

            .table-kings { background: radial-gradient(circle at 70% 16%, rgba(255, 190, 116, .22), transparent 25%), linear-gradient(145deg, #bd1d13, #520807); }
            .table-truth { background: radial-gradient(circle at 70% 16%, rgba(255, 140, 230, .2), transparent 25%), linear-gradient(145deg, #871473, #2e062f); }
            .table-spy { background: radial-gradient(circle at 70% 16%, rgba(107, 168, 255, .22), transparent 25%), linear-gradient(145deg, #0e3a83, #06122d); }
            .table-spectrum { background: radial-gradient(circle at 70% 16%, rgba(85, 246, 236, .2), transparent 25%), linear-gradient(145deg, #087a93, #063a48); }
            .table-letter { background: radial-gradient(circle at 70% 16%, rgba(148, 255, 128, .2), transparent 25%), linear-gradient(145deg, #177d23, #06380b); }
            .table-wyr { background: radial-gradient(circle at 70% 16%, rgba(255, 202, 105, .24), transparent 25%), linear-gradient(145deg, #e26609, #742604); }
            .table-more { background: radial-gradient(circle at 70% 16%, rgba(255, 240, 155, .25), transparent 25%), linear-gradient(145deg, #7a5a15, #392708); }
            .table-wheel { background: radial-gradient(circle at 70% 16%, rgba(249, 220, 97, .24), transparent 25%), linear-gradient(145deg, #87511b, #3b1808); }
            .table-likely { background: radial-gradient(circle at 70% 16%, rgba(255, 137, 227, .23), transparent 25%), linear-gradient(145deg, #8c1c65, #3a0a35); }
            .table-charades { background: radial-gradient(circle at 70% 16%, rgba(109, 210, 255, .22), transparent 25%), linear-gradient(145deg, #155d85, #092746); }

            .tabletop-back-button {
              position: relative;
              z-index: 3;
              margin: 24px auto 0;
              display: block;
              padding: 11px 16px;
              border: 2px solid #fff0ba;
              border-radius: 11px;
              background: rgba(36, 17, 6, .88);
              color: #fff5d6;
              box-shadow: 0 5px 0 rgba(24, 10, 3, .75);
              cursor: pointer;
              font: inherit;
              font-weight: 900;
            }

            .tabletop-footer-text {
              position: relative;
              z-index: 2;
              margin: 34px 0 0;
              color: #fff4d1;
              font-size: clamp(1.15rem, 3vw, 1.8rem);
              font-weight: 900;
              text-align: center;
              text-shadow: 2px 2px 0 #311506;
            }

            @media (max-width: 760px) {
              .tabletop-lobby { padding: 16px 13px 35px; }
              .tabletop-header { align-items: center; }
              .tabletop-brand { min-width: 140px; padding: 10px 13px 12px; }
              .tabletop-top-actions { gap: 7px; }
              .tabletop-settings-button, .tabletop-music-button { padding: 9px 10px; font-size: .76rem; }
              .tabletop-controls { grid-template-columns: 1fr; gap: 13px; }
              .tabletop-control-row { justify-content: flex-start; }
              .tabletop-card-grid { grid-template-columns: repeat(2, minmax(125px, 1fr)); gap: 13px; }
              .table-game-card { min-height: 205px; border-width: 5px; }
              .table-game-icon { width: 59px; height: 59px; margin-bottom: 12px; font-size: 2.15rem; }
              .table-game-title { font-size: 1rem; }
              .table-game-play { margin-top: 12px; padding: 7px 9px; font-size: .62rem; }
            }

            @media (max-width: 390px) {
              .tabletop-brand small { font-size: .55rem; }
              .tabletop-brand h1 { font-size: 1.55rem; }
              .tabletop-settings-button { font-size: .66rem; }
            }
          `}</style>

          <section className="tabletop-lobby">
            <div className="tabletop-header">
              <div className="tabletop-brand">
                <small>BOOZE CLUES</small>
                <h1>HUB</h1>
              </div>

              <div className="tabletop-top-actions">
                <button
                  className="tabletop-settings-button"
                  onClick={() => setShowPartyControls((oldValue) => !oldValue)}
                >
                  Party Settings ⚙
                </button>

                <button
                  className="tabletop-music-button"
                  onClick={toggleMusic}
                  aria-label="Toggle background music"
                >
                  {musicEnabled ? "♫ On" : "♫ Off"}
                </button>
              </div>
            </div>

            {showPartyControls && (
              <section className="tabletop-controls" aria-label="Party settings">
                <div>
                  <h2>Party Settings</h2>
                  <p>Choose the mood, enable sound, and adjust music before you play.</p>
                </div>

                <div className="tabletop-control-row">
                  <button
                    className={audioReady ? "active" : ""}
                    onClick={unlockAudio}
                  >
                    {audioReady ? "🔊 Sound Ready" : "🔊 Enable Sound"}
                  </button>

                  <button
                    className={soundEffectsEnabled ? "active" : ""}
                    onClick={() => setSoundEffectsEnabled((oldValue) => !oldValue)}
                  >
                    ✦ Effects: {soundEffectsEnabled ? "On" : "Off"}
                  </button>

                  <button onClick={toggleFullscreen}>
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </button>
                </div>
              </section>
            )}

            {selectedGame === "more" ? (
              <>
                <div className="tabletop-title">
                  <p>More choices</p>
                  <h2>Other Games</h2>
                </div>

                <div className="tabletop-card-grid">
                  {tabletopMoreCards.map((game) => (
                    <button
                      key={game.id}
                      className={`table-game-card ${game.className}`}
                      onClick={() => openGame(game.id)}
                    >
                      <span className="table-game-icon">{game.icon}</span>
                      <span className="table-game-title">{game.title}</span>
                      <span className="table-game-play">PLAY NOW</span>
                    </button>
                  ))}
                </div>

                <button
                  className="tabletop-back-button"
                  onClick={() => setSelectedGame(null)}
                >
                  ← Back to Main Cards
                </button>
              </>
            ) : (
              <>
                <div className="tabletop-title">
                  <p>Choose a game</p>
                  <h2>Pick a Card and Play!</h2>
                </div>

                <div className="tabletop-card-grid">
                  {tabletopGameCards.map((game) => (
                    <button
                      key={game.id}
                      className={`table-game-card ${game.className}`}
                      onClick={() => openGame(game.id)}
                    >
                      <span className="table-game-icon">{game.icon}</span>
                      <span className="table-game-title">{game.title}</span>
                      <span className="table-game-play">
                        {game.id === "more" ? "VIEW MORE" : "PLAY NOW"}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="tabletop-footer-text">
                  Pick a card, gather your barkada, and let the games begin!
                </p>
              </>
            )}
          </section>
        </>
      )}





      {!isTabletopLobby && (
        <style>{`
          /*
            GLOBAL READABLE BOARD MODE
            Applies to every game screen.
            - One main background image only: from App.jsx
            - Every game gets a dark transparent board
            - No second wooden/table image behind individual games
          */

          .party-table-global-theme,
          .party-table-global-theme:not(.tabletop-app-mode) {
            background: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
          }

          /*
            Main game wrapper board for every game.
          */
          .party-table-global-theme .page-section,
          .party-table-global-theme #kings-cup-game,
          .party-table-global-theme #truth-or-dare,
          .party-table-global-theme #who-is-spy,
          .party-table-global-theme #most-likely-game,
          .party-table-global-theme #letter-rush-game,
          .party-table-global-theme #charades-game,
          .party-table-global-theme #would-you-rather,
          .party-table-global-theme #barkada-spectrum,
          .party-table-global-theme #reference-wheel,
          .party-table-global-theme #wheel-v3,
          .party-table-global-theme #wheel-of-names {
            background:
              linear-gradient(
                145deg,
                rgba(42, 15, 5, 0.78),
                rgba(18, 6, 2, 0.68)
              ) !important;
            background-image:
              linear-gradient(
                145deg,
                rgba(42, 15, 5, 0.78),
                rgba(18, 6, 2, 0.68)
              ) !important;
            border: 1px solid rgba(255, 220, 140, 0.42) !important;
            border-radius: 24px !important;
            box-shadow:
              0 18px 38px rgba(0, 0, 0, 0.26),
              inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
            backdrop-filter: blur(2px);
            overflow: visible !important;
          }

          /*
            Remove duplicate image layers and decorative wood overlays.
          */
          .party-table-global-theme .page-section::before,
          .party-table-global-theme .page-section::after,
          .party-table-global-theme #kings-cup-game::before,
          .party-table-global-theme #kings-cup-game::after,
          .party-table-global-theme #truth-or-dare::before,
          .party-table-global-theme #truth-or-dare::after,
          .party-table-global-theme #who-is-spy::before,
          .party-table-global-theme #who-is-spy::after,
          .party-table-global-theme #most-likely-game::before,
          .party-table-global-theme #most-likely-game::after,
          .party-table-global-theme #letter-rush-game::before,
          .party-table-global-theme #letter-rush-game::after,
          .party-table-global-theme #charades-game::before,
          .party-table-global-theme #charades-game::after,
          .party-table-global-theme #would-you-rather::before,
          .party-table-global-theme #would-you-rather::after,
          .party-table-global-theme #barkada-spectrum::before,
          .party-table-global-theme #barkada-spectrum::after,
          .party-table-global-theme #reference-wheel::before,
          .party-table-global-theme #reference-wheel::after,
          .party-table-global-theme #wheel-v3::before,
          .party-table-global-theme #wheel-v3::after,
          .party-table-global-theme #wheel-of-names::before,
          .party-table-global-theme #wheel-of-names::after {
            display: none !important;
            content: none !important;
            background: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
          }

          /*
            Inner cards and controls also use transparent dark panels only.
            This keeps text readable without creating a second wooden image.
          */
          .party-table-global-theme .game-card,
          .party-table-global-theme .panel,
          .party-table-global-theme .card,
          .party-table-global-theme .setup-card,
          .party-table-global-theme .score-card,
          .party-table-global-theme .result-card,
          .party-table-global-theme .prompt-card,
          .party-table-global-theme .question-card,
          .party-table-global-theme .display-card,
          .party-table-global-theme .control-card,
          .party-table-global-theme .settings-card,
          .party-table-global-theme .kings-draw-panel,
          .party-table-global-theme .kings-info-box,
          .party-table-global-theme .kings-rule-card,
          .party-table-global-theme .kings-add-rule,
          .party-table-global-theme .tod-player-panel,
          .party-table-global-theme .prompt-display,
          .party-table-global-theme .prompt-editor,
          .party-table-global-theme .spy-panel,
          .party-table-global-theme .spy-stage,
          .party-table-global-theme .spy-card,
          .party-table-global-theme .likely-player-panel,
          .party-table-global-theme .likely-question-panel,
          .party-table-global-theme .likely-pass-card,
          .party-table-global-theme .likely-vote-card,
          .party-table-global-theme .likely-recorded-card,
          .party-table-global-theme .likely-results-card,
          .party-table-global-theme .likely-question-card,
          .party-table-global-theme .letter-rush-panel,
          .party-table-global-theme .letter-rush-board,
          .party-table-global-theme .category-editor-card,
          .party-table-global-theme .cfx-panel,
          .party-table-global-theme .cfx-stage,
          .party-table-global-theme .cfx-pass-card,
          .party-table-global-theme .cfx-finish-card,
          .party-table-global-theme .wyr-setup-card,
          .party-table-global-theme .wyr-stage,
          .party-table-global-theme .wyr-result-card,
          .party-table-global-theme .wyr-score-panel,
          .party-table-global-theme .spec-panel,
          .party-table-global-theme .spec-stage,
          .party-table-global-theme .spec-card,
          .party-table-global-theme .spec-result,
          .party-table-global-theme .spec-scoreboard,
          .party-table-global-theme #reference-wheel .reference-panel,
          .party-table-global-theme #reference-wheel .reference-wheel-stage,
          .party-table-global-theme #reference-wheel .reference-result,
          .party-table-global-theme #wheel-v3 .wheel-v3-panel,
          .party-table-global-theme #wheel-v3 .wheel-v3-stage,
          .party-table-global-theme #wheel-v3 .wheel-v3-result,
          .party-table-global-theme #wheel-of-names .player-panel,
          .party-table-global-theme #wheel-of-names .wheel-game-area,
          .party-table-global-theme #wheel-of-names .wheel-spin-result {
            background:
              linear-gradient(
                145deg,
                rgba(30, 10, 3, 0.78),
                rgba(9, 3, 1, 0.58)
              ) !important;
            background-image:
              linear-gradient(
                145deg,
                rgba(30, 10, 3, 0.78),
                rgba(9, 3, 1, 0.58)
              ) !important;
            border-color: rgba(255, 226, 151, 0.40) !important;
            box-shadow:
              0 10px 22px rgba(0, 0, 0, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.07) !important;
          }

          /*
            Keep actual game objects untouched.
            These should stay colorful and designed.
          */
          .party-table-global-theme .kings-card,
          .party-table-global-theme .kings-card-face,
          .party-table-global-theme .reference-wheel-frame,
          .party-table-global-theme .reference-rotor,
          .party-table-global-theme .wheel-frame,
          .party-table-global-theme .wheel-rotator,
          .party-table-global-theme .wheel-v3-frame,
          .party-table-global-theme .wheel-v3-rotor,
          .party-table-global-theme .cfx-display-card,
          .party-table-global-theme .likely-title-card {
            background-image: revert-layer;
          }

          .party-table-global-theme h1,
          .party-table-global-theme h2,
          .party-table-global-theme h3,
          .party-table-global-theme p,
          .party-table-global-theme label,
          .party-table-global-theme span {
            text-shadow:
              1px 1px 0 rgba(38, 11, 3, 0.72),
              0 3px 12px rgba(0, 0, 0, 0.32);
          }
        `}</style>
      )}


      <footer className="footer">
        <div>
          <p>Saved automatically on this browser.</p>
          <p>Sponsored By:</p>
                      <p>Cinco</p>
                       <p>Gaguhan</p>
                       <p>BebeTime</p>
          <p className="developer-credit">
            Developed by Juan Paulo Javier - 2026
          </p>
        </div>

        <button className="reset-link" onClick={resetAllData}>
          Reset all app data
        </button>
      </footer>
    </main>
  );
}

export default GamesPage;
