import { useEffect, useMemo, useRef, useState } from "react";

const defaultPlayers = [
  "Alex",
  "Jamie",
  "Chris",
  "Taylor",
  "Sam",
  "Morgan",
  "Casey",
  "Riley",
];

const themes = {
  woodParty: {
    label: "Wood Party Wheel",
    colors: [
      "#d8271b", // red
      "#0f5f9f", // blue
      "#6d2584", // purple
      "#3d860d", // green
      "#e26f0b", // orange
      "#058d95", // teal
      "#d51c4c", // pink
      "#e8ac08", // yellow
    ],
  },
  classic: {
    label: "Classic",
    colors: ["#d8271b", "#0f5f9f", "#3d860d", "#e8ac08"],
  },
  carnival: {
    label: "Carnival",
    colors: ["#d8271b", "#e8ac08", "#0f5f9f", "#3d860d", "#6d2584", "#d51c4c"],
  },
  neon: {
    label: "Neon Party",
    colors: ["#ff006e", "#8338ec", "#3a86ff", "#06ffa5", "#ffbe0b", "#fb5607"],
  },
};

const defaultSettings = {
  theme: "woodParty",
  duration: 5,
  slowSpin: false,
  showLabels: true,
  labelSize: "normal",
  showPopup: true,
  removeWinner: true,
};

function readPlayers() {
  try {
    const saved = JSON.parse(localStorage.getItem("reference-wheel-players"));
    return Array.isArray(saved) && saved.length ? saved : defaultPlayers;
  } catch {
    return defaultPlayers;
  }
}

// This uses a new settings key, so older saved themes do not override
// the new wooden party-wheel design on the first load.
function readSettings() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("reference-wheel-wood-settings-v2")
    );

    return {
      ...defaultSettings,
      ...saved,
      theme: themes[saved?.theme] ? saved.theme : "woodParty",
    };
  } catch {
    return defaultSettings;
  }
}

function shuffle(list) {
  const next = [...list];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[otherIndex]] = [next[otherIndex], next[index]];
  }

  return next;
}

function normaliseUprightRotation(angle) {
  let result = ((angle + 180) % 360 + 360) % 360 - 180;

  if (result > 90) result -= 180;
  if (result < -90) result += 180;

  return result;
}

/*
  The gradient and labels use the same sliceStart value.

  CSS conic-gradient starts at the top and runs clockwise.
  Starting one slice before 0deg puts the first player in the
  upper-left red slice, matching the reference image.
*/
function getLabelPosition(index, count, size, name) {
  const step = 360 / count;
  const sliceStart = 360 - step;
  const sliceCenter = sliceStart + (index + 0.5) * step;
  const positionAngle = sliceCenter - 90;
  const radians = (positionAngle * Math.PI) / 180;

  const labelRadius =
    count <= 4 ? 28 :
    count <= 6 ? 31 :
    count <= 8 ? 33.5 :
    count <= 10 ? 35 :
    count <= 12 ? 36 : 37;

  const countScale =
    count <= 4 ? 1.22 :
    count <= 6 ? 1.06 :
    count <= 8 ? 0.95 :
    count <= 10 ? 0.83 :
    count <= 12 ? 0.71 : 0.6;

  const nameLength = Math.max(1, name.length);
  const nameScale =
    nameLength <= 6 ? 1 :
    nameLength <= 9 ? 0.9 :
    nameLength <= 12 ? 0.77 :
    nameLength <= 15 ? 0.65 : 0.54;

  const settingScale =
    size === "large" ? 1.12 :
    size === "small" ? 0.82 : 1;

  const labelWidth =
    count <= 4 ? 43 :
    count <= 6 ? 39 :
    count <= 8 ? 35 :
    count <= 10 ? 30 :
    count <= 12 ? 26 : 23;

  return {
    left: `${50 + Math.cos(radians) * labelRadius}%`,
    top: `${50 + Math.sin(radians) * labelRadius}%`,
    "--reference-label-rotate": `${normaliseUprightRotation(sliceCenter)}deg`,
    "--reference-label-scale": countScale * nameScale * settingScale,
    "--reference-label-width": `${labelWidth}%`,
  };
}

function getRingPosition(index, count, radius) {
  const angle = (index * 360) / count - 90;
  const radians = (angle * Math.PI) / 180;

  return {
    left: `${50 + Math.cos(radians) * radius}%`,
    top: `${50 + Math.sin(radians) * radius}%`,
  };
}

export default function WheelOfNames({ onBack, onSound }) {
  const [players, setPlayers] = useState(readPlayers);
  const [settings, setSettings] = useState(readSettings);
  const [settingsTab, setSettingsTab] = useState("spin");
  const [newPlayer, setNewPlayer] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [status, setStatus] = useState("Ready to spin.");

  const rotorRef = useRef(null);
  const rotationRef = useRef(0);
  const finishTimerRef = useRef(null);

  const entries = useMemo(
    () =>
      players
        .map((name, sourceIndex) => ({
          id: `${sourceIndex}-${name}`,
          name: name.trim(),
          sourceIndex,
        }))
        .filter((player) => player.name),
    [players]
  );

  const wheelEntries =
    entries.length >= 2
      ? entries
      : defaultPlayers.slice(0, 4).map((name, index) => ({
          id: `sample-${index}`,
          name,
          sourceIndex: index,
          sample: true,
        }));

  const theme = themes[settings.theme] || themes.woodParty;
  const sliceStep = 360 / wheelEntries.length;
  const sliceStart = 360 - sliceStep;

  const gradient = useMemo(() => {
    const stops = wheelEntries
      .map((_, index) => {
        const color = theme.colors[index % theme.colors.length];
        const start = index * sliceStep;
        const end = (index + 1) * sliceStep;

        return `${color} ${start}deg ${end}deg`;
      })
      .join(", ");

    return `conic-gradient(from ${sliceStart}deg, ${stops})`;
  }, [sliceStart, sliceStep, theme.colors, wheelEntries]);

  useEffect(() => {
    localStorage.setItem("reference-wheel-players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(
      "reference-wheel-wood-settings-v2",
      JSON.stringify(settings)
    );
  }, [settings]);

  useEffect(() => {
    return () => window.clearTimeout(finishTimerRef.current);
  }, []);

  function changeSetting(key, value) {
    setSettings((oldSettings) => ({
      ...oldSettings,
      [key]: value,
    }));
  }

  function addPlayer() {
    const name = newPlayer.trim();
    if (!name || isSpinning) return;

    setPlayers((oldPlayers) => [...oldPlayers, name]);
    setNewPlayer("");
    setWinner(null);
    setStatus(`${name} added.`);
  }

  function changePlayer(index, value) {
    if (isSpinning) return;

    setPlayers((oldPlayers) =>
      oldPlayers.map((player, playerIndex) =>
        playerIndex === index ? value : player
      )
    );
    setWinner(null);
  }

  function removePlayer(index) {
    if (isSpinning) return;

    setPlayers((oldPlayers) =>
      oldPlayers.filter((_, playerIndex) => playerIndex !== index)
    );
    setWinner(null);
  }

  function shufflePlayers() {
    if (isSpinning) return;

    setPlayers((oldPlayers) => shuffle(oldPlayers.filter((name) => name.trim())));
    setWinner(null);
    setStatus("Player order shuffled.");
    onSound?.("click");
  }

  function sortPlayers() {
    if (isSpinning) return;

    setPlayers((oldPlayers) =>
      [...oldPlayers]
        .filter((name) => name.trim())
        .sort((first, second) => first.localeCompare(second))
    );
    setWinner(null);
    setStatus("Player names sorted.");
    onSound?.("click");
  }

  function spin() {
    if (entries.length < 2) {
      setStatus("Add at least two players first.");
      return;
    }

    if (isSpinning || !rotorRef.current) return;

    const selectedIndex = Math.floor(Math.random() * entries.length);
    const selected = entries[selectedIndex];
    const step = 360 / entries.length;
    const start = 360 - step;

    // This center uses the exact same geometry as the gradient and labels.
    const selectedCenter = start + (selectedIndex + 0.5) * step;
    const target = ((-selectedCenter % 360) + 360) % 360;
    const current = ((rotationRef.current % 360) + 360) % 360;
    const adjustment = (target - current + 360) % 360;

    const durationSeconds = settings.slowSpin
      ? Math.max(8, Number(settings.duration) + 3)
      : Number(settings.duration);

    const durationMs = durationSeconds * 1000;
    const finalRotation = rotationRef.current + 3600 + adjustment;
    const rotor = rotorRef.current;

    setIsSpinning(true);
    setWinner(null);
    setShowWinner(false);
    setStatus("Spinning...");

    rotor.style.transition = "none";
    rotor.style.transform = `rotate(${rotationRef.current}deg)`;
    void rotor.offsetWidth;

    rotor.style.transition = `transform ${durationMs}ms cubic-bezier(0.08, 0.76, 0.12, 1)`;
    rotor.style.transform = `rotate(${finalRotation}deg)`;

    rotationRef.current = finalRotation;
    onSound?.("spin");

    finishTimerRef.current = window.setTimeout(() => {
      setWinner({
        ...selected,
        color: theme.colors[selectedIndex % theme.colors.length],
      });
      setStatus(`${selected.name} was selected!`);
      setIsSpinning(false);

      if (settings.showPopup) setShowWinner(true);
      onSound?.("winner");
    }, durationMs + 80);
  }

  function removeWinner() {
    if (!winner || winner.sample) return;

    setPlayers((oldPlayers) =>
      oldPlayers.filter((_, index) => index !== winner.sourceIndex)
    );
    setShowWinner(false);
    setWinner(null);
    setStatus("Winner removed from the wheel.");
  }

  return (
    <>
      <style>{`
        #reference-wheel {
          width: min(100%, 1180px);
          margin: 0 auto;
          padding: clamp(18px, 3vw, 30px);
          border: 1px solid rgba(255, 212, 108, 0.48);
          border-radius: 24px;
          background:
            radial-gradient(circle at 72% 13%, rgba(167, 76, 16, 0.18), transparent 27%),
            linear-gradient(145deg, rgba(72, 24, 7, 0.95), rgba(27, 7, 2, 0.98));
          color: #fff6dd;
          box-sizing: border-box;
          isolation: isolate;
        }

        #reference-wheel * {
          box-sizing: border-box;
        }

        #reference-wheel .reference-back {
          margin: 0 0 20px;
          padding: 11px 16px;
          border: 1px solid #f1c45c;
          border-radius: 11px;
          background: linear-gradient(145deg, #81501a, #341306);
          color: #fff3ce;
          cursor: pointer;
          font: inherit;
          font-weight: 1000;
          box-shadow: 0 4px 0 rgba(38, 10, 2, 0.60);
        }

        #reference-wheel .reference-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 221, 141, 0.28);
        }

        #reference-wheel .reference-eyebrow {
          margin: 0 0 6px;
          color: #ffd36c;
          font-size: 0.70rem;
          font-weight: 1000;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        #reference-wheel h2 {
          margin: 0;
          color: #fff2c9;
          font-size: clamp(1.6rem, 3.4vw, 2.35rem);
        }

        #reference-wheel .reference-count {
          padding: 7px 11px;
          border: 1px solid rgba(255, 225, 140, 0.68);
          border-radius: 999px;
          background: rgba(75, 27, 7, 0.66);
          color: #ffe085;
          font-size: 0.80rem;
          font-weight: 1000;
          white-space: nowrap;
        }

        #reference-wheel .reference-layout {
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          gap: 22px;
        }

        #reference-wheel .reference-panel,
        #reference-wheel .reference-wheel-stage {
          border: 1px solid rgba(255, 220, 136, 0.48);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(112, 46, 12, 0.90), rgba(45, 12, 3, 0.97));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        #reference-wheel .reference-panel {
          padding: 18px;
        }

        #reference-wheel h3 {
          margin: 0;
          color: #fff3d3;
          font-size: 1.18rem;
        }

        #reference-wheel .reference-help {
          margin: 11px 0 0;
          color: #efd7ad;
          font-size: 0.89rem;
          line-height: 1.52;
        }

        #reference-wheel input,
        #reference-wheel select {
          width: 100%;
          min-height: 43px;
          padding: 0 11px;
          border: 1px solid rgba(255, 225, 147, 0.58);
          border-radius: 10px;
          background: #2f0d03;
          color: #fff7e5;
          font: inherit;
        }

        #reference-wheel .reference-input-row,
        #reference-wheel .reference-player-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
        }

        #reference-wheel .reference-input-row {
          margin-top: 14px;
        }

        #reference-wheel .reference-button {
          min-height: 42px;
          padding: 0 12px;
          border: 1px solid rgba(255, 232, 160, 0.75);
          border-radius: 10px;
          cursor: pointer;
          font: inherit;
          font-weight: 1000;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        #reference-wheel .reference-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        #reference-wheel .reference-button:active:not(:disabled) {
          transform: translateY(1px);
        }

        #reference-wheel .reference-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        #reference-wheel .reference-primary {
          background: linear-gradient(145deg, #d53848, #78101a);
          color: #fff9e8;
          box-shadow: 0 5px 0 rgba(70, 6, 12, 0.68);
        }

        #reference-wheel .reference-secondary {
          background: linear-gradient(145deg, #89531a, #3d1b07);
          color: #fff2c9;
          box-shadow: 0 4px 0 rgba(36, 10, 2, 0.58);
        }

        #reference-wheel .reference-danger {
          background: linear-gradient(145deg, #9d2921, #510909);
          color: #fff4e6;
          box-shadow: 0 4px 0 rgba(48, 5, 5, 0.56);
        }

        #reference-wheel .reference-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-top: 10px;
        }

        #reference-wheel .reference-player-list {
          display: grid;
          gap: 8px;
          margin-top: 11px;
        }

        #reference-wheel .reference-player-row {
          position: relative;
        }

        #reference-wheel .reference-player-row::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 8px;
          z-index: 1;
          width: 10px;
          height: 10px;
          border: 2px solid #fff9e6;
          border-radius: 50%;
          background: var(--dot-color);
          box-shadow: 0 0 10px var(--dot-color);
          transform: translateY(-50%);
          pointer-events: none;
        }

        #reference-wheel .reference-player-row input {
          padding-left: 29px;
        }

        #reference-wheel .reference-settings {
          margin-top: 17px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 221, 141, 0.28);
        }

        #reference-wheel .reference-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 12px;
        }

        #reference-wheel .reference-tab {
          min-height: 36px;
          border: 1px solid rgba(255, 225, 147, 0.46);
          border-radius: 9px;
          background: rgba(47, 12, 3, 0.60);
          color: #efd7ad;
          cursor: pointer;
          font: inherit;
          font-size: 0.70rem;
          font-weight: 1000;
        }

        #reference-wheel .reference-tab.active {
          border-color: #ffe58b;
          background: linear-gradient(145deg, #aa5219, #532008);
          color: #fff3cb;
        }

        #reference-wheel .reference-settings-body {
          display: grid;
          gap: 11px;
          margin-top: 14px;
        }

        #reference-wheel .reference-setting-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items: center;
          color: #efd7ad;
          font-size: 0.84rem;
        }

        #reference-wheel .reference-setting-row label {
          color: #fff2c9;
          font-weight: 900;
        }

        #reference-wheel .reference-setting-row select {
          width: 145px;
          min-height: 36px;
          font-size: 0.80rem;
        }

        #reference-wheel .reference-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff2c9;
          cursor: pointer;
          font-size: 0.84rem;
          font-weight: 850;
        }

        #reference-wheel .reference-toggle input {
          width: 17px;
          min-height: 17px;
          margin: 0;
          accent-color: #d53848;
        }

        /* ===== Exact wooden party wheel treatment ===== */

        #reference-wheel .reference-wheel-stage {
          min-height: 660px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 24px;
          background:
            radial-gradient(circle at 50% 47%, rgba(255, 190, 66, 0.13), transparent 39%),
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.018) 0 2px,
              rgba(0, 0, 0, 0.028) 2px 5px
            ),
            linear-gradient(145deg, #3d1708, #120502 74%) !important;
        }

        #reference-wheel .reference-machine {
          position: relative;
          width: min(100%, 555px);
          aspect-ratio: 1;
          isolation: isolate;
          overflow: visible;
        }

        #reference-wheel .reference-wheel-frame {
          position: absolute;
          inset: 5.6%;
          z-index: 2;
          overflow: hidden;
          border: 13px solid #7c3a0d;
          border-radius: 50%;
          background:
            repeating-conic-gradient(
              from 0deg,
              #6e310c 0deg 5deg,
              #8d4715 5deg 9deg,
              #592206 9deg 14deg
            );
          outline: 3px solid #f6c75e;
          outline-offset: 5px;
          box-shadow:
            0 0 0 4px #3d1604,
            0 0 0 8px rgba(243, 184, 63, 0.72),
            0 0 0 12px rgba(48, 15, 3, 0.94),
            0 22px 38px rgba(0, 0, 0, 0.64),
            inset 0 0 19px rgba(33, 7, 0, 0.76);
        }

        #reference-wheel .reference-wheel-frame::before {
          content: "";
          position: absolute;
          inset: 6px;
          z-index: 4;
          border: 4px solid rgba(255, 216, 99, 0.8);
          border-radius: 50%;
          box-shadow:
            0 0 7px rgba(255, 192, 48, 0.44),
            inset 0 0 11px rgba(255, 231, 149, 0.16);
          pointer-events: none;
        }

        #reference-wheel .reference-wheel-frame::after {
          content: "";
          position: absolute;
          inset: 15px;
          z-index: 7;
          border: 2px solid rgba(255, 238, 183, 0.78);
          border-radius: 50%;
          box-shadow:
            inset 0 0 12px rgba(255, 214, 93, 0.23),
            0 0 8px rgba(255, 200, 58, 0.38);
          pointer-events: none;
        }

        #reference-wheel .reference-rotor {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 50%;
          background: var(--reference-gradient);
          transform: rotate(0deg);
          transform-origin: 50% 50%;
          will-change: transform;
          filter: saturate(1.18) contrast(1.07) brightness(1.02);
        }

        #reference-wheel .reference-rotor::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.10), transparent 30%),
            radial-gradient(circle at 50% 50%, transparent 0 56%, rgba(29, 4, 0, 0.20) 100%),
            repeating-conic-gradient(
              from 0deg,
              rgba(255, 255, 255, 0.13) 0deg 1deg,
              transparent 1deg 6deg
            );
          opacity: 0.74;
          pointer-events: none;
        }

        #reference-wheel .reference-separator {
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 3;
          width: 4px;
          height: 50%;
          background: linear-gradient(
            to bottom,
            rgba(255, 247, 212, 0.16),
            #ffe29b 34%,
            #a45210 74%,
            rgba(69, 20, 3, 0.92)
          );
          box-shadow:
            0 0 2px rgba(255, 243, 191, 0.86),
            1px 0 3px rgba(53, 12, 2, 0.72);
          transform-origin: bottom center;
          transform: translateX(-50%) rotate(var(--reference-separator-angle));
          pointer-events: none;
        }

        #reference-wheel .reference-label {
          position: absolute;
          z-index: 5;
          width: var(--reference-label-width, 35%);
          max-width: none;
          padding: 3px 6px;
          border: 0;
          border-radius: 0;
          background: transparent;
          color: #fffdf4;
          font-family: Impact, "Arial Black", "Trebuchet MS", system-ui, sans-serif;
          font-size: clamp(1rem, 3.15vw, 1.85rem);
          font-weight: 1000;
          letter-spacing: -0.035em;
          line-height: 1.02;
          text-align: center;
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
          pointer-events: none;
          text-shadow:
            -2px -2px 0 rgba(68, 24, 6, 0.98),
            2px -2px 0 rgba(68, 24, 6, 0.98),
            -2px 2px 0 rgba(68, 24, 6, 0.98),
            2px 2px 0 rgba(68, 24, 6, 0.98),
            0 4px 5px rgba(0, 0, 0, 0.52);
          transform:
            translate(-50%, -50%)
            rotate(var(--reference-label-rotate))
            scale(var(--reference-label-scale));
        }

        #reference-wheel .reference-label.winner {
          color: #fff7b9;
          text-shadow:
            -2px -2px 0 #7b4208,
            2px -2px 0 #7b4208,
            -2px 2px 0 #7b4208,
            2px 2px 0 #7b4208,
            0 0 15px rgba(255, 236, 114, 0.95);
        }

        #reference-wheel .reference-center-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 10;
          width: 18.5%;
          aspect-ratio: 1;
          border: 5px solid #7d3d08;
          border-radius: 50%;
          background:
            radial-gradient(circle at 33% 26%, #fff5b7 0 7%, #f3bf4f 23%, #cb7a19 55%, #713006 100%);
          box-shadow:
            0 0 0 4px #f6cb62,
            0 0 0 8px #5d2406,
            0 8px 15px rgba(0, 0, 0, 0.48),
            inset -3px -4px 8px rgba(75, 22, 1, 0.48);
          transform: translate(-50%, -50%);
        }

        /*
          Downward pointer:
          the triangle tip is at the top edge of the wheel, so it always
          points directly at the selected slice instead of away from it.
        */
        #reference-wheel .reference-pointer {
          position: absolute;
          top: -4.9%;
          left: 50%;
          z-index: 16;
          width: 54px;
          height: 58px;
          border: 0;
          filter:
            drop-shadow(0 4px 1px rgba(62, 20, 2, 0.85))
            drop-shadow(0 0 2px rgba(255, 234, 158, 0.75));
          transform: translateX(-50%);
          pointer-events: none;
        }

        #reference-wheel .reference-pointer::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 54px;
          height: 58px;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          background:
            linear-gradient(
              90deg,
              #a95b0b 0%,
              #edaa2a 24%,
              #ffe18a 49%,
              #efae2c 67%,
              #934604 100%
            );
          box-shadow: inset 0 0 0 2px rgba(255, 239, 173, 0.42);
        }

        #reference-wheel .reference-pointer::before {
          content: "";
          position: absolute;
          top: -26px;
          left: 50%;
          z-index: 2;
          width: 29px;
          height: 29px;
          border: 3px solid #fff0ad;
          border-radius: 50%;
          background:
            radial-gradient(circle at 35% 27%, #fffbd1 0 9%, #efb13a 49%, #7d3d06 100%);
          box-shadow:
            0 0 0 3px rgba(77, 26, 3, 0.88),
            0 3px 6px rgba(0, 0, 0, 0.5);
          transform: translateX(-50%);
        }

        #reference-wheel .reference-bulb {
          position: absolute;
          z-index: 14;
          width: 12px;
          height: 12px;
          border: 2px solid #fff5c8;
          border-radius: 50%;
          background: #ffce52;
          box-shadow:
            0 0 0 2px rgba(86, 31, 3, 0.82),
            0 0 13px rgba(255, 204, 68, 0.96);
          transform: translate(-50%, -50%);
          animation: reference-bulb-glow 1s steps(2, end) infinite;
          animation-delay: var(--reference-delay);
          pointer-events: none;
        }

        #reference-wheel .reference-rim-bolt {
          position: absolute;
          z-index: 13;
          width: 18px;
          height: 18px;
          border: 2px solid #fff1b0;
          border-radius: 50%;
          background:
            radial-gradient(circle at 32% 27%, #fff7c9 0 12%, #eab449 43%, #8c4609 100%);
          box-shadow:
            0 0 0 2px rgba(78, 26, 3, 0.82),
            0 2px 5px rgba(0, 0, 0, 0.42);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        #reference-wheel .reference-machine.spinning .reference-bulb {
          animation-duration: 0.22s;
          box-shadow:
            0 0 0 2px rgba(86, 31, 3, 0.82),
            0 0 21px rgba(255, 224, 117, 1);
        }

        @keyframes reference-bulb-glow {
          0%, 100% {
            opacity: 0.48;
            filter: brightness(0.75);
          }

          50% {
            opacity: 1;
            filter: brightness(1.5);
          }
        }

        #reference-wheel .reference-spin {
          min-width: 220px;
          margin-top: 18px;
          font-size: 1rem;
        }

        #reference-wheel .reference-result {
          width: min(100%, 420px);
          margin-top: 15px;
          padding: 14px 16px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        #reference-wheel .reference-result p {
          margin: 0;
          color: #f7cf56;
          font-size: 0.67rem;
          font-weight: 1000;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        #reference-wheel .reference-result h3 {
          margin: 6px 0 0;
          color: #fff7dd;
          font-size: 1rem;
        }

        #reference-wheel .reference-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(4, 7, 10, 0.78);
          backdrop-filter: blur(5px);
        }

        #reference-wheel .reference-popup {
          width: min(100%, 440px);
          padding: 30px;
          border: 2px solid #f7d264;
          border-radius: 23px;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 204, 86, 0.22), transparent 38%),
            linear-gradient(145deg, #6d2f0e, #260a03 76%);
          box-shadow:
            0 0 0 5px rgba(59, 18, 3, 0.92),
            0 24px 50px rgba(0, 0, 0, 0.64);
          text-align: center;
        }

        #reference-wheel .reference-popup h2 {
          margin: 10px 0 0;
          color: #fff7dc;
          font-size: clamp(2rem, 7vw, 4rem);
          overflow-wrap: anywhere;
        }

        #reference-wheel .reference-winner-dot {
          width: 20px;
          height: 20px;
          margin: 16px auto;
          border: 3px solid #ffffff;
          border-radius: 50%;
          background: var(--reference-winner-color);
          box-shadow: 0 0 20px var(--reference-winner-color);
        }

        #reference-wheel .reference-popup-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 22px;
        }

        /* Stronger, easier-to-tap winner buttons */
        #reference-wheel .reference-popup .reference-button {
          min-width: 146px;
          min-height: 48px;
          padding: 0 18px;
          border-width: 2px;
          border-radius: 12px;
          font-size: 0.9rem;
          letter-spacing: 0.01em;
        }

        #reference-wheel .reference-popup .reference-secondary {
          border-color: #f3ca68;
          background: linear-gradient(145deg, #bd7726, #5b2208);
          color: #fff8df;
          box-shadow:
            inset 0 1px 0 rgba(255, 246, 205, 0.35),
            0 5px 0 rgba(55, 15, 3, 0.76);
        }

        #reference-wheel .reference-popup .reference-primary {
          border-color: #ffd18a;
          background: linear-gradient(145deg, #e94b57, #8f111c);
          color: #fffaf0;
          box-shadow:
            inset 0 1px 0 rgba(255, 234, 213, 0.34),
            0 5px 0 rgba(82, 6, 13, 0.82);
        }

        #reference-wheel .reference-popup .reference-button:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-2px) scale(1.02);
        }

        @media (max-width: 900px) {
          #reference-wheel .reference-layout {
            grid-template-columns: 1fr;
          }

          #reference-wheel .reference-wheel-stage {
            min-height: 590px;
          }
        }

        @media (max-width: 590px) {
          #reference-wheel {
            width: min(calc(100vw - 20px), 1180px);
            padding: 14px;
            border-radius: 17px;
          }

          #reference-wheel .reference-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          #reference-wheel .reference-wheel-stage {
            min-height: auto;
            padding: 18px 7px;
          }

          #reference-wheel .reference-machine {
            width: min(100%, 420px);
          }

          #reference-wheel .reference-tabs {
            grid-template-columns: 1fr;
          }

          #reference-wheel .reference-setting-row {
            grid-template-columns: 1fr;
            gap: 5px;
          }

          #reference-wheel .reference-setting-row select {
            width: 100%;
          }

          #reference-wheel .reference-wheel-frame {
            border-width: 9px;
          }

          #reference-wheel .reference-label {
            font-size: clamp(0.78rem, 3.9vw, 1.14rem);
          }

          #reference-wheel .reference-bulb {
            width: 8px;
            height: 8px;
          }

          #reference-wheel .reference-rim-bolt {
            width: 13px;
            height: 13px;
          }

          #reference-wheel .reference-pointer {
            top: -4.8%;
            width: 40px;
            height: 44px;
          }

          #reference-wheel .reference-pointer::after {
            width: 40px;
            height: 44px;
          }

          #reference-wheel .reference-pointer::before {
            top: -22px;
            width: 24px;
            height: 24px;
          }
        }
      `}</style>

      <section id="reference-wheel">
        {onBack && (
          <button className="reference-back" onClick={onBack}>
            ← Back to Other Games
          </button>
        )}

        <div className="reference-heading">
          <div>
            <p className="reference-eyebrow">Name Picker</p>
            <h2>Wheel of Names</h2>
          </div>
          <span className="reference-count">
            {entries.length} player{entries.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="reference-layout">
          <aside className="reference-panel">
            <h3>Players</h3>
            <p className="reference-help">
              Add names and spin the colorful wheel to choose a player.
            </p>

            <div className="reference-input-row">
              <input
                value={newPlayer}
                placeholder="Enter player name"
                onChange={(event) => setNewPlayer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addPlayer();
                }}
                disabled={isSpinning}
              />
              <button
                className="reference-button reference-primary"
                onClick={addPlayer}
                disabled={isSpinning}
              >
                Add
              </button>
            </div>

            <div className="reference-actions">
              <button
                className="reference-button reference-secondary"
                onClick={shufflePlayers}
                disabled={isSpinning}
              >
                ⤨ Shuffle
              </button>
              <button
                className="reference-button reference-secondary"
                onClick={sortPlayers}
                disabled={isSpinning}
              >
                ⇅ Sort
              </button>
            </div>

            <div className="reference-player-list">
              {players.map((player, index) => {
                const color = theme.colors[index % theme.colors.length];

                return (
                  <div
                    className="reference-player-row"
                    key={`player-row-${index}`}
                    style={{ "--dot-color": color }}
                  >
                    <input
                      value={player}
                      onChange={(event) =>
                        changePlayer(index, event.target.value)
                      }
                      autoComplete="off"
                      spellCheck="false"
                      disabled={isSpinning}
                    />
                    <button
                      className="reference-button reference-danger"
                      onClick={() => removePlayer(index)}
                      disabled={isSpinning}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <section className="reference-settings">
              <h3>Wheel Settings</h3>

              <div className="reference-tabs">
                <button
                  className={
                    settingsTab === "spin"
                      ? "reference-tab active"
                      : "reference-tab"
                  }
                  onClick={() => setSettingsTab("spin")}
                >
                  During Spin
                </button>
                <button
                  className={
                    settingsTab === "after"
                      ? "reference-tab active"
                      : "reference-tab"
                  }
                  onClick={() => setSettingsTab("after")}
                >
                  After Spin
                </button>
                <button
                  className={
                    settingsTab === "appearance"
                      ? "reference-tab active"
                      : "reference-tab"
                  }
                  onClick={() => setSettingsTab("appearance")}
                >
                  Appearance
                </button>
              </div>

              {settingsTab === "spin" && (
                <div className="reference-settings-body">
                  <div className="reference-setting-row">
                    <label htmlFor="reference-duration">Spin time</label>
                    <select
                      id="reference-duration"
                      value={settings.duration}
                      onChange={(event) =>
                        changeSetting("duration", Number(event.target.value))
                      }
                    >
                      <option value="3">3 seconds</option>
                      <option value="5">5 seconds</option>
                      <option value="7">7 seconds</option>
                      <option value="10">10 seconds</option>
                    </select>
                  </div>

                  <label className="reference-toggle">
                    <input
                      type="checkbox"
                      checked={settings.slowSpin}
                      onChange={(event) =>
                        changeSetting("slowSpin", event.target.checked)
                      }
                    />
                    Spin slowly
                  </label>
                </div>
              )}

              {settingsTab === "after" && (
                <div className="reference-settings-body">
                  <label className="reference-toggle">
                    <input
                      type="checkbox"
                      checked={settings.showPopup}
                      onChange={(event) =>
                        changeSetting("showPopup", event.target.checked)
                      }
                    />
                    Winner popup
                  </label>

                  <label className="reference-toggle">
                    <input
                      type="checkbox"
                      checked={settings.removeWinner}
                      onChange={(event) =>
                        changeSetting("removeWinner", event.target.checked)
                      }
                    />
                    Show Remove Winner button
                  </label>
                </div>
              )}

              {settingsTab === "appearance" && (
                <div className="reference-settings-body">
                  <div className="reference-setting-row">
                    <label htmlFor="reference-theme">Apply a theme</label>
                    <select
                      id="reference-theme"
                      value={settings.theme}
                      onChange={(event) =>
                        changeSetting("theme", event.target.value)
                      }
                    >
                      {Object.entries(themes).map(([key, item]) => (
                        <option key={key} value={key}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="reference-toggle">
                    <input
                      type="checkbox"
                      checked={settings.showLabels}
                      onChange={(event) =>
                        changeSetting("showLabels", event.target.checked)
                      }
                    />
                    Show names on wheel
                  </label>

                  <div className="reference-setting-row">
                    <label htmlFor="reference-label-size">Name size</label>
                    <select
                      id="reference-label-size"
                      value={settings.labelSize}
                      onChange={(event) =>
                        changeSetting("labelSize", event.target.value)
                      }
                    >
                      <option value="small">Small</option>
                      <option value="normal">Normal</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              )}
            </section>
          </aside>

          <section className="reference-wheel-stage">
            <div
              className={
                isSpinning ? "reference-machine spinning" : "reference-machine"
              }
            >
              {Array.from({ length: 30 }, (_, index) => (
                <span
                  className="reference-bulb"
                  key={`bulb-${index}`}
                  style={{
                    ...getRingPosition(index, 30, 52.5),
                    "--reference-delay": `${-index * 0.065}s`,
                  }}
                />
              ))}

              {wheelEntries.map((entry, index) => (
                <span
                  className="reference-rim-bolt"
                  key={`bolt-${entry.id}`}
                  style={getRingPosition(index, wheelEntries.length, 46.6)}
                />
              ))}

              <div className="reference-pointer" />

              <div className="reference-wheel-frame">
                <div
                  ref={rotorRef}
                  className="reference-rotor"
                  style={{ "--reference-gradient": gradient }}
                >
                  {wheelEntries.map((entry, index) => (
                    <span
                      className="reference-separator"
                      key={`separator-${entry.id}`}
                      style={{
                        "--reference-separator-angle": `${
                          sliceStart + index * sliceStep
                        }deg`,
                      }}
                    />
                  ))}

                  {settings.showLabels &&
                    wheelEntries.map((entry, index) => {
                      const isWinner = winner?.id === entry.id;

                      return (
                        <span
                          className={
                            isWinner
                              ? "reference-label winner"
                              : "reference-label"
                          }
                          key={entry.id}
                          style={getLabelPosition(
                            index,
                            wheelEntries.length,
                            settings.labelSize,
                            entry.name
                          )}
                        >
                          {entry.name.length > 18
                            ? `${entry.name.slice(0, 17)}…`
                            : entry.name}
                        </span>
                      );
                    })}
                </div>

                <div className="reference-center-hole" />
              </div>
            </div>

            <button
              className="reference-button reference-primary reference-spin"
              onClick={spin}
              disabled={isSpinning}
            >
              ⟳ {isSpinning ? "Spinning..." : "Spin the Wheel"}
            </button>

            <div className="reference-result">
              <p>{winner ? "Winner" : "Wheel Result"}</p>
              <h3>{status}</h3>
            </div>
          </section>
        </div>

        {showWinner && winner && (
          <div className="reference-overlay" role="dialog" aria-modal="true">
            <section className="reference-popup">
              <p className="reference-eyebrow">✦ We have a winner! ✦</p>
              <h2>{winner.name}</h2>
              <div
                className="reference-winner-dot"
                style={{ "--reference-winner-color": winner.color }}
              />
              <p className="reference-help">
                Pass the phone to {winner.name} — it is their turn!
              </p>

              <div className="reference-popup-actions">
                {settings.removeWinner && !winner.sample && (
                  <button
                    className="reference-button reference-secondary"
                    onClick={removeWinner}
                  >
                    Remove Winner
                  </button>
                )}
                <button
                  className="reference-button reference-primary"
                  onClick={() => setShowWinner(false)}
                  autoFocus
                >
                  Continue
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </>
  );
}
