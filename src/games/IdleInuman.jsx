import { useEffect, useMemo, useState } from "react";

const defaultPlayers = [
  { id: makeId(), name: "Player 1", shots: 0, water: 0, cheers: 0 },
  { id: makeId(), name: "Player 2", shots: 0, water: 0, cheers: 0 },
];

const promptDeck = [
  {
    type: "Kwentuhan",
    title: "Core Memory",
    text: "Share one funny memory with this group that still makes you laugh.",
    action: "Everyone can react or ask one follow-up question.",
  },
  {
    type: "Kwentuhan",
    title: "Unexpected Plot Twist",
    text: "What is one thing people would not expect about you?",
    action: "The group guesses first before you answer.",
  },
  {
    type: "Kwentuhan",
    title: "Mini Confession",
    text: "What is one harmless secret habit you have?",
    action: "No judging. Just laughs.",
  },
  {
    type: "Kwentuhan",
    title: "Barkada Origin Story",
    text: "Who in the group gave the strongest first impression?",
    action: "Tell the story.",
  },
  {
    type: "Funny Vote",
    title: "Most Likely",
    text: "Who is most likely to disappear first during a night out?",
    action: "Point at the person. They get a cheers point.",
  },
  {
    type: "Funny Vote",
    title: "Main Character",
    text: "Who looks like they would survive a horror movie the longest?",
    action: "Let them explain their survival plan.",
  },
  {
    type: "Funny Vote",
    title: "Chaos Friend",
    text: "Who is most likely to say 'one last round' and mean five more?",
    action: "Group votes. Winner gets a cheers point.",
  },
  {
    type: "Funny Vote",
    title: "Group Lawyer",
    text: "Who is best at defending a bad decision?",
    action: "They must defend pineapple on pizza for 20 seconds.",
  },
  {
    type: "Tagalog",
    title: "Real Talk",
    text: "Sino ang pinaka madaling mapatawa sa grupo?",
    action: "Everyone says their answer at the same time.",
  },
  {
    type: "Tagalog",
    title: "Barkada Award",
    text: "Sino ang pinaka mukhang laging may chika?",
    action: "They must give a fake chika headline.",
  },
  {
    type: "Tagalog",
    title: "Kilig Check",
    text: "Ano ang pinaka simpleng bagay na nakakakilig?",
    action: "Quick answer only. No long explanation.",
  },
  {
    type: "Tagalog",
    title: "Honest Answer",
    text: "Sino ang pinaka mahirap yayain pero biglang game na game?",
    action: "Tell the story.",
  },
  {
    type: "Quick Challenge",
    title: "Silent Laugh",
    text: "Everyone must stay serious for 10 seconds.",
    action: "First person to laugh gets a cheers point.",
  },
  {
    type: "Quick Challenge",
    title: "Nickname Generator",
    text: "Give the active player a funny nickname for tonight.",
    action: "Active player chooses the best one.",
  },
  {
    type: "Quick Challenge",
    title: "Commercial Break",
    text: "Sell the drink, snack, or water near you like a TV ad.",
    action: "Best ad gets a cheers point.",
  },
  {
    type: "Quick Challenge",
    title: "Pose Battle",
    text: "Active player chooses a pose. Everyone copies it.",
    action: "Last to copy gets a cheers point.",
  },
  {
    type: "Would You Rather",
    title: "No Context",
    text: "Would you rather have free food forever or free travel forever?",
    action: "Everyone answers, then explain in one sentence.",
  },
  {
    type: "Would You Rather",
    title: "Social Battery",
    text: "Would you rather be the host of every party or the guest of honor?",
    action: "Vote left or right with your hands.",
  },
  {
    type: "Would You Rather",
    title: "Phone Choice",
    text: "Would you rather lose Wi-Fi for a week or lose music for a week?",
    action: "Discuss for 30 seconds.",
  },
  {
    type: "Safe Break",
    title: "Water Check",
    text: "Everyone checks if they need water, food, or a pause.",
    action: "Log water for anyone who drinks water.",
  },
  {
    type: "Safe Break",
    title: "Snack Round",
    text: "Someone picks a snack and rates it like a food critic.",
    action: "No penalty. Just reset the vibe.",
  },
  {
    type: "Safe Break",
    title: "Stretch Break",
    text: "Everyone stretch their shoulders and reset.",
    action: "The most dramatic stretch gets a cheers point.",
  },
];

function makeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function makePlayer(name = "New Player") {
  return {
    id: makeId(),
    name,
    shots: 0,
    water: 0,
    cheers: 0,
  };
}

function loadPlayers() {
  try {
    const saved = JSON.parse(localStorage.getItem("idle-inuman-players-v2"));
    return Array.isArray(saved) && saved.length
      ? saved.map((player) => ({
          id: player.id || makeId(),
          name: player.name || "Player",
          shots: Number(player.shots || 0),
          water: Number(player.water || 0),
          cheers: Number(player.cheers || 0),
        }))
      : defaultPlayers;
  } catch {
    return defaultPlayers;
  }
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem("idle-inuman-settings-v2"));

    return {
      counterName: "Shot",
      breakEvery: 3,
      promptMode: "mixed",
      ...saved,
    };
  } catch {
    return {
      counterName: "Shot",
      breakEvery: 3,
      promptMode: "mixed",
    };
  }
}

function pickPrompt(mode = "mixed", lastPromptId = "") {
  const filtered =
    mode === "mixed"
      ? promptDeck
      : promptDeck.filter((prompt) => prompt.type === mode);

  const deck = filtered.length ? filtered : promptDeck;
  const available = deck.filter((prompt) => prompt.title !== lastPromptId);
  const pool = available.length ? available : deck;

  return pool[Math.floor(Math.random() * pool.length)];
}

export default function IdleInuman({ onBack, onSound }) {
  const [players, setPlayers] = useState(loadPlayers);
  const [settings, setSettings] = useState(loadSettings);
  const [newName, setNewName] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [currentPrompt, setCurrentPrompt] = useState(() =>
    pickPrompt("mixed")
  );
  const [lastPromptId, setLastPromptId] = useState("");
  const [message, setMessage] = useState(
    "Idle mode is ready. Count shots, draw prompts, and keep the conversation moving."
  );

  useEffect(() => {
    localStorage.setItem("idle-inuman-players-v2", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("idle-inuman-settings-v2", JSON.stringify(settings));
  }, [settings]);

  const activePlayer = players[activeIndex] || players[0];

  const totals = useMemo(() => {
    const shotTotal = players.reduce(
      (sum, player) => sum + Number(player.shots || 0),
      0
    );
    const waterTotal = players.reduce(
      (sum, player) => sum + Number(player.water || 0),
      0
    );
    const cheersTotal = players.reduce(
      (sum, player) => sum + Number(player.cheers || 0),
      0
    );
    const leader = [...players].sort(
      (a, b) => Number(b.shots || 0) - Number(a.shots || 0)
    )[0];

    return {
      shotTotal,
      waterTotal,
      cheersTotal,
      leader,
      average: players.length ? shotTotal / players.length : 0,
    };
  }, [players]);

  function updatePlayer(index, patch) {
    setPlayers((oldPlayers) =>
      oldPlayers.map((player, playerIndex) =>
        playerIndex === index ? { ...player, ...patch } : player
      )
    );
  }

  function addPlayer() {
    const name = newName.trim();
    if (!name) return;

    setPlayers((oldPlayers) => [...oldPlayers, makePlayer(name)]);
    setNewName("");
    setMessage(`${name} joined Idle Inuman.`);
    onSound?.("click");
  }

  function removePlayer(index) {
    if (players.length <= 1) {
      setMessage("Keep at least one player in the counter.");
      return;
    }

    const removedName = players[index]?.name || "Player";
    const nextLength = players.length - 1;

    setPlayers((oldPlayers) =>
      oldPlayers.filter((_, playerIndex) => playerIndex !== index)
    );
    setActiveIndex((oldIndex) => Math.max(0, Math.min(oldIndex, nextLength - 1)));
    setMessage(`${removedName} removed.`);
  }

  function incrementShot(index = activeIndex) {
    const player = players[index];
    if (!player) return;

    const nextShots = Number(player.shots || 0) + 1;
    updatePlayer(index, { shots: nextShots });

    const shouldBreak =
      settings.breakEvery > 0 && nextShots % Number(settings.breakEvery) === 0;

    setMessage(
      shouldBreak
        ? `${player.name} reached ${nextShots}. Water check or snack break muna.`
        : `${player.name}: ${nextShots} ${settings.counterName.toLowerCase()}${
            nextShots === 1 ? "" : "s"
          }.`
    );

    onSound?.(shouldBreak ? "winner" : "click");
  }

  function decrementShot(index = activeIndex) {
    const player = players[index];
    if (!player) return;

    const nextShots = Math.max(0, Number(player.shots || 0) - 1);
    updatePlayer(index, { shots: nextShots });
    setMessage(`${player.name} adjusted to ${nextShots}.`);
    onSound?.("click");
  }

  function addWater(index = activeIndex) {
    const player = players[index];
    if (!player) return;

    updatePlayer(index, { water: Number(player.water || 0) + 1 });
    setMessage(`${player.name} logged water. Good pacing.`);
    onSound?.("click");
  }

  function addCheers(index = activeIndex) {
    const player = players[index];
    if (!player) return;

    updatePlayer(index, { cheers: Number(player.cheers || 0) + 1 });
    setMessage(`${player.name} got a cheers point.`);
    onSound?.("winner");
  }

  function nextPlayer() {
    const nextIndex = players.length ? (activeIndex + 1) % players.length : 0;
    setActiveIndex(nextIndex);
    setMessage(`${players[nextIndex]?.name || "Next player"} is up.`);
    onSound?.("click");
  }

  function newPrompt() {
    const prompt = pickPrompt(settings.promptMode, lastPromptId);

    setCurrentPrompt(prompt);
    setLastPromptId(prompt.title);
    setMessage(`New ${prompt.type} prompt drawn.`);
    onSound?.("card");
  }

  function nextRound() {
    setRound((oldRound) => oldRound + 1);
    setActiveIndex(0);
    newPrompt();
    setMessage("New round started. Fresh prompt drawn.");
    onSound?.("click");
  }

  function randomPlayer() {
    if (!players.length) return;

    const index = Math.floor(Math.random() * players.length);
    setActiveIndex(index);
    setMessage(`${players[index].name} was randomly picked.`);
    onSound?.("spin");
  }

  function resetCounts() {
    const shouldReset = window.confirm("Reset all counters to zero?");
    if (!shouldReset) return;

    setPlayers((oldPlayers) =>
      oldPlayers.map((player) => ({
        ...player,
        shots: 0,
        water: 0,
        cheers: 0,
      }))
    );
    setRound(1);
    setActiveIndex(0);
    setMessage("All counters reset.");
  }

  return (
    <>
      <style>{`
        #idle-inuman-game {
          width: min(100%, 1160px) !important;
          max-width: 1160px !important;
          margin: 0 auto !important;
          padding: clamp(18px, 3vw, 28px) !important;
          color: #fff2c9;
        }

        #idle-inuman-game * {
          box-sizing: border-box;
        }

        #idle-inuman-game .ic-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        #idle-inuman-game .ic-button {
          min-height: 42px;
          padding: 0 14px;
          border: 1px solid rgba(255, 225, 150, .72);
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-weight: 1000;
          transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
        }

        #idle-inuman-game .ic-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        #idle-inuman-game .ic-button:active:not(:disabled) {
          transform: translateY(1px);
        }

        #idle-inuman-game .ic-button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        #idle-inuman-game .ic-primary {
          background: linear-gradient(145deg, #c72d3a, #78101a);
          color: #fff8e4;
          box-shadow: 0 5px 0 rgba(64, 6, 11, .62);
        }

        #idle-inuman-game .ic-secondary {
          background: linear-gradient(145deg, #84501a, #3b1606);
          color: #fff1c8;
          box-shadow: 0 4px 0 rgba(31, 8, 2, .55);
        }

        #idle-inuman-game .ic-danger {
          background: linear-gradient(145deg, #9f2a23, #560909);
          color: #fff3df;
          box-shadow: 0 4px 0 rgba(45, 5, 5, .58);
        }

        #idle-inuman-game .ic-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        #idle-inuman-game .ic-kicker {
          margin: 0 0 7px;
          color: #ffd36c;
          font-size: .72rem;
          font-weight: 1000;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        #idle-inuman-game .ic-title {
          margin: 0;
          color: #fff1c8;
          font-size: clamp(2rem, 4.4vw, 3.5rem);
          line-height: 1.02;
          text-shadow:
            3px 3px 0 rgba(47, 12, 3, .72),
            0 8px 26px rgba(0,0,0,.32);
        }

        #idle-inuman-game .ic-round-pill {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          padding: 0 14px;
          border: 1px solid rgba(255, 222, 143, .56);
          border-radius: 999px;
          background: rgba(55, 18, 5, .66);
          color: #ffd36c;
          font-weight: 1000;
        }

        #idle-inuman-game .ic-grid {
          display: grid;
          grid-template-columns: 330px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        #idle-inuman-game .ic-panel,
        #idle-inuman-game .ic-stage,
        #idle-inuman-game .ic-stat,
        #idle-inuman-game .ic-player-row,
        #idle-inuman-game .ic-message,
        #idle-inuman-game .ic-prompt-card {
          border: 1px solid rgba(255, 221, 137, .42);
          background:
            linear-gradient(145deg, rgba(30, 10, 3, .78), rgba(9, 3, 1, .58)) !important;
          box-shadow:
            0 10px 22px rgba(0,0,0,.18),
            inset 0 1px 0 rgba(255,255,255,.07);
        }

        #idle-inuman-game .ic-panel,
        #idle-inuman-game .ic-stage {
          border-radius: 22px;
          padding: 18px;
        }

        #idle-inuman-game .ic-panel h3,
        #idle-inuman-game .ic-stage h3 {
          margin: 0;
          color: #fff1c8;
          font-size: 1.25rem;
        }

        #idle-inuman-game .ic-help {
          margin: 10px 0 0;
          color: #efd8b1;
          font-size: .92rem;
          line-height: 1.52;
        }

        #idle-inuman-game .ic-add-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
          margin-top: 15px;
        }

        #idle-inuman-game input,
        #idle-inuman-game select {
          width: 100%;
          min-height: 42px;
          padding: 0 11px;
          border: 1px solid rgba(255, 221, 137, .48);
          border-radius: 10px;
          background: rgba(29, 8, 2, .72);
          color: #fff7dd;
          font: inherit;
        }

        #idle-inuman-game .ic-settings {
          display: grid;
          gap: 12px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 221, 137, .24);
        }

        #idle-inuman-game .ic-field {
          display: grid;
          gap: 7px;
          color: #ffd36c;
          font-size: .84rem;
          font-weight: 1000;
        }

        #idle-inuman-game .ic-player-list {
          display: grid;
          gap: 10px;
          margin-top: 15px;
        }

        #idle-inuman-game .ic-player-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
          align-items: center;
          padding: 10px;
          border-radius: 14px;
        }

        #idle-inuman-game .ic-player-row.is-active {
          border-color: #ffd36c;
          box-shadow:
            0 0 0 2px rgba(255, 211, 108, .16),
            0 10px 22px rgba(0,0,0,.18),
            inset 0 1px 0 rgba(255,255,255,.10);
        }

        #idle-inuman-game .ic-player-name {
          min-width: 0;
        }

        #idle-inuman-game .ic-player-name input {
          min-height: 38px;
          font-weight: 900;
        }

        #idle-inuman-game .ic-mini-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 7px;
        }

        #idle-inuman-game .ic-mini-stats span {
          display: inline-flex;
          align-items: center;
          min-height: 26px;
          padding: 0 9px;
          border: 1px solid rgba(255, 221, 137, .32);
          border-radius: 999px;
          background: rgba(255, 255, 255, .05);
          color: #f1d8ad;
          font-size: .78rem;
          font-weight: 900;
        }

        #idle-inuman-game .ic-row-actions {
          display: grid;
          gap: 7px;
        }

        #idle-inuman-game .ic-row-actions .ic-button {
          min-width: 88px;
          min-height: 36px;
          padding: 0 10px;
          font-size: .82rem;
        }

        #idle-inuman-game .ic-stage {
          min-height: 590px;
          display: grid;
          gap: 18px;
        }

        #idle-inuman-game .ic-big-card {
          display: grid;
          place-items: center;
          min-height: 300px;
          padding: clamp(24px, 5vw, 44px);
          border: 8px solid rgba(255, 226, 151, .46);
          border-radius: 30px;
          background:
            radial-gradient(circle at 82% 14%, rgba(255, 214, 103, .22), transparent 27%),
            linear-gradient(145deg, rgba(132, 39, 24, .88), rgba(52, 11, 6, .78)) !important;
          box-shadow:
            0 17px 34px rgba(0,0,0,.28),
            inset 0 1px 0 rgba(255,255,255,.12);
          text-align: center;
        }

        #idle-inuman-game .ic-active-label {
          margin: 0 0 9px;
          color: #ffd36c;
          font-size: .74rem;
          font-weight: 1000;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        #idle-inuman-game .ic-active-name {
          margin: 0;
          color: #fff1c8;
          font-size: clamp(2rem, 6vw, 4.2rem);
          line-height: .95;
          overflow-wrap: anywhere;
          text-shadow:
            4px 4px 0 rgba(52, 10, 4, .84),
            0 8px 18px rgba(0,0,0,.28);
        }

        #idle-inuman-game .ic-count {
          margin: 18px 0 0;
          color: #ffd36c;
          font-size: clamp(4rem, 13vw, 7.4rem);
          font-weight: 1000;
          line-height: .86;
          text-shadow:
            4px 4px 0 rgba(52, 10, 4, .84),
            0 8px 18px rgba(0,0,0,.28);
        }

        #idle-inuman-game .ic-count-label {
          margin: 8px 0 0;
          color: #fff7dd;
          font-size: clamp(1rem, 2vw, 1.35rem);
          font-weight: 1000;
        }

        #idle-inuman-game .ic-prompt-card {
          padding: clamp(18px, 3vw, 26px);
          border-radius: 22px;
          background:
            radial-gradient(circle at 88% 10%, rgba(255, 211, 108, .18), transparent 25%),
            linear-gradient(145deg, rgba(15, 68, 46, .84), rgba(4, 20, 14, .72)) !important;
        }

        #idle-inuman-game .ic-prompt-type {
          display: inline-flex;
          min-height: 31px;
          align-items: center;
          padding: 0 11px;
          border: 1px solid rgba(255, 221, 137, .45);
          border-radius: 999px;
          background: rgba(91, 38, 9, .54);
          color: #ffd36c;
          font-size: .72rem;
          font-weight: 1000;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        #idle-inuman-game .ic-prompt-title {
          margin: 13px 0 0;
          color: #fff1c8;
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          line-height: 1.05;
          text-shadow: 2px 2px 0 rgba(39, 10, 3, .72);
        }

        #idle-inuman-game .ic-prompt-text {
          margin: 13px 0 0;
          color: #fff7df;
          font-size: clamp(1.05rem, 2vw, 1.35rem);
          line-height: 1.42;
        }

        #idle-inuman-game .ic-prompt-action {
          margin: 12px 0 0;
          color: #f1d8ad;
          line-height: 1.45;
        }

        #idle-inuman-game .ic-prompt-actions,
        #idle-inuman-game .ic-stage-actions {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        #idle-inuman-game .ic-prompt-actions {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 15px;
        }

        #idle-inuman-game .ic-stage-actions .ic-button,
        #idle-inuman-game .ic-prompt-actions .ic-button {
          min-height: 48px;
        }

        #idle-inuman-game .ic-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        #idle-inuman-game .ic-stat {
          min-height: 92px;
          padding: 14px;
          border-radius: 16px;
        }

        #idle-inuman-game .ic-stat span {
          display: block;
          color: #f1d8ad;
          font-size: .78rem;
          font-weight: 1000;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        #idle-inuman-game .ic-stat strong {
          display: block;
          margin-top: 8px;
          color: #ffd36c;
          font-size: clamp(1.45rem, 4vw, 2.35rem);
          line-height: 1;
          overflow-wrap: anywhere;
        }

        #idle-inuman-game .ic-message {
          padding: 14px 16px;
          border-radius: 16px;
          color: #fff2c9;
          line-height: 1.45;
        }

        #idle-inuman-game .ic-safe-note {
          margin-top: 12px;
          padding: 12px;
          border-left: 3px solid #ffd36c;
          border-radius: 10px;
          background: rgba(255, 211, 108, .10);
          color: #f1d8ad;
          font-size: .86rem;
          line-height: 1.45;
        }

        @media (max-width: 950px) {
          #idle-inuman-game .ic-grid {
            grid-template-columns: 1fr;
          }

          #idle-inuman-game .ic-stage-actions,
          #idle-inuman-game .ic-prompt-actions,
          #idle-inuman-game .ic-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          #idle-inuman-game {
            padding: 15px !important;
          }

          #idle-inuman-game .ic-stage-actions,
          #idle-inuman-game .ic-prompt-actions,
          #idle-inuman-game .ic-stats {
            grid-template-columns: 1fr;
          }

          #idle-inuman-game .ic-player-row {
            grid-template-columns: 1fr;
          }

          #idle-inuman-game .ic-row-actions {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <section id="idle-inuman-game" className="page-section">
        <div className="ic-top">
          <button className="ic-button ic-secondary" onClick={onBack}>
            ← Back to Other Games
          </button>

          <button className="ic-button ic-danger" onClick={resetCounts}>
            Reset Counter
          </button>
        </div>

        <div className="ic-heading">
          <div>
            <p className="ic-kicker">Idle Inuman Tracker</p>
            <h2 className="ic-title">Talk, Laugh, Count</h2>
          </div>

          <span className="ic-round-pill">Round {round}</span>
        </div>

        <div className="ic-grid">
          <aside className="ic-panel">
            <h3>Players & Counter</h3>
            <p className="ic-help">
              Keep this open while everyone talks. Count shots or points, draw
              random conversation prompts, and log water breaks.
            </p>

            <div className="ic-add-row">
              <input
                value={newName}
                placeholder="Enter player name"
                onChange={(event) => setNewName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addPlayer();
                }}
              />

              <button className="ic-button ic-primary" onClick={addPlayer}>
                Add
              </button>
            </div>

            <div className="ic-settings">
              <label className="ic-field">
                Counter label
                <select
                  value={settings.counterName}
                  onChange={(event) =>
                    setSettings((oldSettings) => ({
                      ...oldSettings,
                      counterName: event.target.value,
                    }))
                  }
                >
                  <option value="Shot">Shot</option>
                  <option value="Drink">Drink</option>
                  <option value="Point">Point</option>
                  <option value="Penalty">Penalty</option>
                  <option value="Sip">Sip</option>
                </select>
              </label>

              <label className="ic-field">
                Water reminder every
                <select
                  value={settings.breakEvery}
                  onChange={(event) =>
                    setSettings((oldSettings) => ({
                      ...oldSettings,
                      breakEvery: Number(event.target.value),
                    }))
                  }
                >
                  <option value="0">Off</option>
                  <option value="2">2 counts</option>
                  <option value="3">3 counts</option>
                  <option value="4">4 counts</option>
                  <option value="5">5 counts</option>
                </select>
              </label>

              <label className="ic-field">
                Prompt deck
                <select
                  value={settings.promptMode}
                  onChange={(event) =>
                    setSettings((oldSettings) => ({
                      ...oldSettings,
                      promptMode: event.target.value,
                    }))
                  }
                >
                  <option value="mixed">Mixed</option>
                  <option value="Kwentuhan">Kwentuhan</option>
                  <option value="Funny Vote">Funny Vote</option>
                  <option value="Tagalog">Tagalog</option>
                  <option value="Quick Challenge">Quick Challenge</option>
                  <option value="Would You Rather">Would You Rather</option>
                  <option value="Safe Break">Safe Break</option>
                </select>
              </label>
            </div>

            <div className="ic-player-list">
              {players.map((player, index) => (
                <div
                  className={
                    index === activeIndex
                      ? "ic-player-row is-active"
                      : "ic-player-row"
                  }
                  key={player.id}
                >
                  <div className="ic-player-name">
                    <input
                      value={player.name}
                      onChange={(event) =>
                        updatePlayer(index, { name: event.target.value })
                      }
                    />

                    <div className="ic-mini-stats">
                      <span>
                        {settings.counterName}: {player.shots}
                      </span>
                      <span>Water: {player.water}</span>
                      <span>Cheers: {player.cheers}</span>
                    </div>
                  </div>

                  <div className="ic-row-actions">
                    <button
                      className="ic-button ic-primary"
                      onClick={() => incrementShot(index)}
                    >
                      +1
                    </button>
                    <button
                      className="ic-button ic-secondary"
                      onClick={() => addWater(index)}
                    >
                      Water
                    </button>
                    <button
                      className="ic-button ic-danger"
                      onClick={() => removePlayer(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="ic-safe-note">
              Use this for drinks, points, or safe alternatives. Water and food
              breaks are part of the game.
            </div>
          </aside>

          <section className="ic-stage">
            <div className="ic-big-card">
              <div>
                <p className="ic-active-label">Active Player</p>
                <h3 className="ic-active-name">
                  {activePlayer?.name?.trim() || "Player"}
                </h3>

                <p className="ic-count">{activePlayer?.shots || 0}</p>
                <p className="ic-count-label">
                  {settings.counterName}
                  {(activePlayer?.shots || 0) === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="ic-stage-actions">
              <button
                className="ic-button ic-primary"
                onClick={() => incrementShot(activeIndex)}
              >
                +1 {settings.counterName}
              </button>

              <button
                className="ic-button ic-secondary"
                onClick={() => decrementShot(activeIndex)}
              >
                Undo -1
              </button>

              <button
                className="ic-button ic-secondary"
                onClick={() => addWater(activeIndex)}
              >
                Log Water
              </button>

              <button className="ic-button ic-primary" onClick={nextPlayer}>
                Next Player
              </button>
            </div>

            <article className="ic-prompt-card">
              <span className="ic-prompt-type">{currentPrompt.type}</span>
              <h3 className="ic-prompt-title">{currentPrompt.title}</h3>
              <p className="ic-prompt-text">{currentPrompt.text}</p>
              <p className="ic-prompt-action">{currentPrompt.action}</p>

              <div className="ic-prompt-actions">
                <button className="ic-button ic-primary" onClick={newPrompt}>
                  New Prompt
                </button>

                <button className="ic-button ic-secondary" onClick={randomPlayer}>
                  Random Player
                </button>

                <button
                  className="ic-button ic-secondary"
                  onClick={() => addCheers(activeIndex)}
                >
                  +1 Cheers
                </button>
              </div>
            </article>

            <div className="ic-stats">
              <article className="ic-stat">
                <span>Total</span>
                <strong>{totals.shotTotal}</strong>
              </article>

              <article className="ic-stat">
                <span>Water</span>
                <strong>{totals.waterTotal}</strong>
              </article>

              <article className="ic-stat">
                <span>Cheers</span>
                <strong>{totals.cheersTotal}</strong>
              </article>

              <article className="ic-stat">
                <span>Most Counted</span>
                <strong>{totals.leader?.name || "None"}</strong>
              </article>
            </div>

            <div className="ic-stage-actions">
              <button className="ic-button ic-secondary" onClick={nextRound}>
                New Round
              </button>

              <button
                className="ic-button ic-secondary"
                onClick={() => setActiveIndex(0)}
              >
                Back to First
              </button>

              <button className="ic-button ic-danger" onClick={resetCounts}>
                Reset All
              </button>

              <button className="ic-button ic-primary" onClick={nextPlayer}>
                Continue
              </button>
            </div>

            <div className="ic-message">{message}</div>
          </section>
        </div>
      </section>
    </>
  );
}
