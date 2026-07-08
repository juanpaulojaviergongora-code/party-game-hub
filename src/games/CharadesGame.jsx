import { useEffect, useState } from "react";

const starterCharadesPrompts = [
  { id: "charades-1", category: "Animal", text: "A penguin" },
  { id: "charades-2", category: "Animal", text: "A monkey" },
  { id: "charades-3", category: "Animal", text: "A kangaroo" },
  { id: "charades-4", category: "Movie", text: "Titanic" },
  { id: "charades-5", category: "Movie", text: "Harry Potter" },
  { id: "charades-6", category: "Movie", text: "Spider-Man" },
  { id: "charades-7", category: "Job", text: "A chef" },
  { id: "charades-8", category: "Job", text: "A firefighter" },
  { id: "charades-9", category: "Job", text: "A teacher" },
  { id: "charades-10", category: "Filipino", text: "Riding a jeepney" },
  { id: "charades-11", category: "Filipino", text: "Singing karaoke" },
  { id: "charades-12", category: "Filipino", text: "Eating halo-halo" },
  { id: "charades-13", category: "Action", text: "Brushing your teeth" },
  { id: "charades-14", category: "Action", text: "Taking a selfie" },
  { id: "charades-15", category: "Action", text: "Dancing in the rain" },
  { id: "charades-16", category: "Object", text: "A broken umbrella" },
  { id: "charades-17", category: "Object", text: "A smartphone" },
  { id: "charades-18", category: "Object", text: "A guitar" },
  { id: "charades-19", category: "Pinoy Life", text: "Waiting for tricycle" },
  { id: "charades-20", category: "Pinoy Life", text: "Eating isaw" },
  { id: "charades-21", category: "Pinoy Life", text: "Opening an umbrella indoors" },
  { id: "charades-22", category: "School", text: "Late for class" },
  { id: "charades-23", category: "School", text: "Presenting a report" },
  { id: "charades-24", category: "School", text: "Copying notes fast" },
  { id: "charades-25", category: "Barkada", text: "Taking a group selfie" },
  { id: "charades-26", category: "Barkada", text: "Pretending to be sober" },
  { id: "charades-27", category: "Barkada", text: "Losing your slippers" },
  { id: "charades-28", category: "Food", text: "Eating spicy noodles" },
  { id: "charades-29", category: "Food", text: "Drinking milk tea" },
  { id: "charades-30", category: "Food", text: "Peeling a mango" },
];

export default function CharadesGame({ onBack }) {
  const [mode, setMode] = useState("charades");
  const [teamNames, setTeamNames] = useState(["Team Red", "Team Gold"]);
  const [scores, setScores] = useState([0, 0]);
  const [activeTeam, setActiveTeam] = useState(0);

  const [timerLength, setTimerLength] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  const [screen, setScreen] = useState("setup");
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [lastPromptId, setLastPromptId] = useState("");
  const [correctThisTurn, setCorrectThisTurn] = useState(0);

  const activeTeamName =
    teamNames[activeTeam]?.trim() || `Team ${activeTeam + 1}`;
  const otherTeamIndex = activeTeam === 0 ? 1 : 0;

  const modeDetails =
    mode === "charades"
      ? {
          title: "Classic Charades",
          shortTitle: "Charades",
          setup:
            "One player silently acts out the prompt while their team guesses.",
          passTitle: "Pass the device to the actor",
          passText:
            "The actor reads the prompt. Teammates should look away until the timer starts.",
          promptInstruction:
            "Act it out without talking, making sounds, or spelling words.",
          intro: "Act it. Guess it. Score it.",
        }
      : {
          title: "Reverse Charades",
          shortTitle: "Reverse",
          setup:
            "One player gives clues while the other player acts out their guesses.",
          passTitle: "Pass the device to the clue giver",
          passText:
            "The clue giver reads the prompt first. The guessing player should look away.",
          promptInstruction:
            "Describe the prompt without saying the answer. The guessing player acts while answering.",
          intro: "Describe it. Act your guess. Score it.",
        };

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      setScreen("finished");
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((oldTime) => Math.max(0, oldTime - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isRunning, timeLeft]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function drawPrompt() {
    const availablePrompts = starterCharadesPrompts.filter(
      (prompt) => prompt.id !== lastPromptId
    );

    const pool =
      availablePrompts.length > 0 ? availablePrompts : starterCharadesPrompts;

    const nextPrompt = pool[Math.floor(Math.random() * pool.length)];

    setCurrentPrompt(nextPrompt);
    setLastPromptId(nextPrompt.id);
  }

  function cleanTeamName(value, fallback) {
    return value.trim() || fallback;
  }

  function startTurn() {
    const cleanedTeams = [
      cleanTeamName(teamNames[0], "Team Red"),
      cleanTeamName(teamNames[1], "Team Gold"),
    ];

    setTeamNames(cleanedTeams);
    setTimeLeft(timerLength);
    setCorrectThisTurn(0);
    setIsRunning(false);
    drawPrompt();
    setScreen("pass");
  }

  function revealPrompt() {
    setTimeLeft(timerLength);
    setIsRunning(true);
    setScreen("prompt");
  }

  function markCorrect() {
    setScores((oldScores) =>
      oldScores.map((score, index) =>
        index === activeTeam ? score + 1 : score
      )
    );

    setCorrectThisTurn((oldTotal) => oldTotal + 1);
    drawPrompt();
  }

  function skipPrompt() {
    drawPrompt();
  }

  function endTurn() {
    setIsRunning(false);
    setScreen("finished");
  }

  function startNextTeam() {
    setActiveTeam(otherTeamIndex);
    setTimeLeft(timerLength);
    setCurrentPrompt(null);
    setCorrectThisTurn(0);
    setScreen("setup");
  }

  function updateTeamName(index, value) {
    setTeamNames((oldNames) =>
      oldNames.map((name, teamIndex) => (teamIndex === index ? value : name))
    );
  }

  function resetScores() {
    const shouldReset = window.confirm("Reset both team scores to zero?");
    if (!shouldReset) return;

    setScores([0, 0]);
    setActiveTeam(0);
    setCurrentPrompt(null);
    setCorrectThisTurn(0);
    setTimeLeft(timerLength);
    setIsRunning(false);
    setScreen("setup");
  }

  const progressPercent =
    timerLength > 0 ? Math.max(0, (timeLeft / timerLength) * 100) : 0;

  return (
    <>
      <style>{`
        #charades-game {
          width: min(100%, 1120px) !important;
          max-width: 1120px !important;
          margin: 0 auto !important;
          padding: clamp(18px, 3vw, 28px) !important;
          color: #fff2c9;
        }

        #charades-game * {
          box-sizing: border-box;
        }

        #charades-game .cfx-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        #charades-game .cfx-back,
        #charades-game .cfx-reset,
        #charades-game .cfx-button {
          min-height: 42px;
          border: 1px solid rgba(255, 225, 150, .72);
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-weight: 1000;
          letter-spacing: .01em;
          transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
        }

        #charades-game .cfx-back,
        #charades-game .cfx-reset,
        #charades-game .cfx-secondary {
          padding: 0 14px;
          background: linear-gradient(145deg, #7b4a17, #371606);
          color: #fff1c8;
          box-shadow: 0 4px 0 rgba(31, 8, 2, .55);
        }

        #charades-game .cfx-primary {
          padding: 0 16px;
          background: linear-gradient(145deg, #c92c3a, #77101a);
          color: #fff8e4;
          box-shadow: 0 5px 0 rgba(64, 6, 11, .62);
        }

        #charades-game .cfx-danger {
          padding: 0 16px;
          background: linear-gradient(145deg, #a82922, #560909);
          color: #fff3df;
          box-shadow: 0 5px 0 rgba(45, 5, 5, .58);
        }

        #charades-game button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        #charades-game button:active:not(:disabled) {
          transform: translateY(1px);
        }

        #charades-game button:disabled {
          cursor: not-allowed;
          opacity: .58;
        }

        #charades-game .cfx-heading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 18px;
          margin-bottom: 18px;
        }

        #charades-game .cfx-kicker {
          margin: 0 0 7px;
          color: #ffd36c;
          font-size: .72rem;
          font-weight: 1000;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        #charades-game .cfx-title {
          margin: 0;
          color: #fff1c8;
          font-size: clamp(1.9rem, 4vw, 3.2rem);
          line-height: 1.02;
          text-shadow:
            3px 3px 0 rgba(47, 12, 3, .72),
            0 8px 26px rgba(0,0,0,.32);
        }

        #charades-game .cfx-scoreboard {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        #charades-game .cfx-score {
          min-height: 92px;
          padding: 14px;
          border: 1px solid rgba(255, 221, 137, .44);
          border-radius: 16px;
          background:
            linear-gradient(145deg, rgba(18, 55, 38, .78), rgba(4, 20, 14, .66)) !important;
          color: #fff2c9;
          cursor: pointer;
          font: inherit;
          text-align: center;
          box-shadow:
            0 9px 18px rgba(0,0,0,.16),
            inset 0 1px 0 rgba(255,255,255,.08);
        }

        #charades-game .cfx-score.is-active {
          border-color: #ffd36c;
          background:
            linear-gradient(145deg, rgba(115, 58, 16, .84), rgba(34, 13, 4, .76)) !important;
          box-shadow:
            0 0 0 2px rgba(255, 211, 108, .18),
            0 13px 22px rgba(0,0,0,.20),
            inset 0 1px 0 rgba(255,255,255,.12);
        }

        #charades-game .cfx-score span,
        #charades-game .cfx-score strong {
          display: block;
        }

        #charades-game .cfx-score span {
          color: #f1d8ad;
          font-size: .86rem;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        #charades-game .cfx-score strong {
          margin-top: 8px;
          color: #ffd36c;
          font-size: clamp(2rem, 6vw, 3.15rem);
          line-height: .9;
          text-shadow: 2px 2px 0 rgba(38, 12, 3, .58);
        }

        #charades-game .cfx-main-grid {
          display: grid;
          grid-template-columns: 310px minmax(0, 1fr);
          gap: 18px;
          align-items: stretch;
        }

        #charades-game .cfx-panel,
        #charades-game .cfx-stage,
        #charades-game .cfx-pass-card,
        #charades-game .cfx-finish-card {
          border: 1px solid rgba(255, 221, 137, .42);
          border-radius: 20px;
          background:
            linear-gradient(145deg, rgba(17, 62, 42, .82), rgba(3, 20, 14, .72)) !important;
          box-shadow:
            0 13px 26px rgba(0,0,0,.18),
            inset 0 1px 0 rgba(255,255,255,.08);
        }

        #charades-game .cfx-panel {
          padding: 18px;
        }

        #charades-game .cfx-panel h3,
        #charades-game .cfx-stage h3,
        #charades-game .cfx-pass-card h3,
        #charades-game .cfx-finish-card h3 {
          margin: 0;
          color: #fff1c8;
          font-size: clamp(1.2rem, 2vw, 1.55rem);
        }

        #charades-game .cfx-help {
          margin: 11px 0 0;
          color: #f0d8b0;
          font-size: .92rem;
          line-height: 1.54;
        }

        #charades-game .cfx-mode-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin: 16px 0;
        }

        #charades-game .cfx-mode {
          min-height: 118px;
          padding: 14px;
          border: 1px solid rgba(255, 221, 137, .38);
          border-radius: 15px;
          background: rgba(28, 10, 3, .46);
          color: #fff2c9;
          cursor: pointer;
          font: inherit;
          text-align: left;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
        }

        #charades-game .cfx-mode strong,
        #charades-game .cfx-mode span {
          display: block;
        }

        #charades-game .cfx-mode strong {
          color: #ffd36c;
          font-size: 1.02rem;
          margin-bottom: 8px;
        }

        #charades-game .cfx-mode span {
          color: #efd8b1;
          font-size: .82rem;
          line-height: 1.34;
        }

        #charades-game .cfx-mode.is-selected {
          border-color: #ffd36c;
          background:
            linear-gradient(145deg, rgba(133, 70, 18, .78), rgba(53, 20, 5, .70));
          box-shadow:
            0 0 0 2px rgba(255, 211, 108, .14),
            inset 0 1px 0 rgba(255,255,255,.10);
        }

        #charades-game .cfx-field {
          display: grid;
          gap: 7px;
          margin-top: 14px;
          color: #ffd36c;
          font-size: .84rem;
          font-weight: 1000;
        }

        #charades-game .cfx-field input,
        #charades-game .cfx-field select {
          min-height: 42px;
          width: 100%;
          padding: 0 11px;
          border: 1px solid rgba(255, 221, 137, .48);
          border-radius: 10px;
          background: rgba(29, 8, 2, .72);
          color: #fff7dd;
          font: inherit;
        }

        #charades-game .cfx-start {
          width: 100%;
          margin-top: 17px;
        }

        #charades-game .cfx-stage {
          min-height: 520px;
          display: grid;
          place-items: center;
          padding: clamp(18px, 4vw, 34px);
          text-align: center;
        }

        #charades-game .cfx-stage-inner {
          width: min(100%, 680px);
          margin: 0 auto;
        }

        #charades-game .cfx-turn {
          margin: 0 0 8px;
          color: #ffd36c;
          font-size: .78rem;
          font-weight: 1000;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        #charades-game .cfx-description {
          max-width: 590px;
          margin: 10px auto 20px;
          color: #efd8b1;
          line-height: 1.56;
        }

        #charades-game .cfx-display-card {
          width: min(100%, 640px);
          margin: 0 auto;
          padding: clamp(26px, 5vw, 46px) clamp(18px, 4vw, 32px);
          border: 10px solid rgba(255, 226, 151, .54);
          border-radius: 30px;
          background:
            radial-gradient(circle at 82% 14%, rgba(255, 214, 103, .22), transparent 27%),
            linear-gradient(145deg, #9f201c, #5f0c13 62%, #381006) !important;
          box-shadow:
            0 17px 34px rgba(0,0,0,.28),
            inset 0 1px 0 rgba(255,255,255,.12);
        }

        #charades-game .cfx-display-card h2 {
          margin: 12px auto;
          color: #fff1c8;
          font-size: clamp(2.1rem, 6vw, 4rem);
          line-height: 1.04;
          overflow-wrap: anywhere;
          text-shadow:
            3px 3px 0 rgba(52, 10, 4, .84),
            0 8px 18px rgba(0,0,0,.28);
        }

        #charades-game .cfx-pass-card,
        #charades-game .cfx-finish-card {
          width: min(100%, 650px);
          padding: clamp(26px, 5vw, 46px) clamp(18px, 4vw, 32px);
        }

        #charades-game .cfx-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 33px;
          padding: 0 12px;
          border: 1px solid rgba(255, 221, 137, .56);
          border-radius: 999px;
          background: rgba(99, 44, 12, .56);
          color: #ffe29a;
          font-size: .74rem;
          font-weight: 1000;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        #charades-game .cfx-timer-wrap {
          width: min(100%, 520px);
          margin: 20px auto 18px;
        }

        #charades-game .cfx-timer {
          margin: 0;
          color: ${timeLeft <= 10 ? "#ffb2a8" : "#ffd36c"};
          font-size: clamp(2.6rem, 8vw, 4.8rem);
          font-weight: 1000;
          line-height: .92;
          text-shadow:
            3px 3px 0 rgba(48, 12, 3, .72),
            0 8px 18px rgba(0,0,0,.30);
        }

        #charades-game .cfx-progress {
          height: 12px;
          margin-top: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 221, 137, .42);
          border-radius: 999px;
          background: rgba(19, 6, 2, .58);
        }

        #charades-game .cfx-progress span {
          display: block;
          height: 100%;
          width: ${progressPercent}%;
          border-radius: inherit;
          background: linear-gradient(90deg, #ffd36c, #c72d36);
          transition: width .25s linear;
        }

        #charades-game .cfx-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 11px;
        }

        #charades-game .cfx-score-note {
          margin: 15px 0 0;
          color: #efd8b1;
          font-size: .92rem;
        }

        @media (max-width: 900px) {
          #charades-game .cfx-main-grid {
            grid-template-columns: 1fr;
          }

          #charades-game .cfx-stage {
            min-height: 460px;
          }
        }

        @media (max-width: 590px) {
          #charades-game {
            padding: 15px !important;
          }

          #charades-game .cfx-heading,
          #charades-game .cfx-scoreboard {
            grid-template-columns: 1fr;
          }

          #charades-game .cfx-mode-grid {
            grid-template-columns: 1fr;
          }

          #charades-game .cfx-display-card {
            border-width: 6px;
            border-radius: 22px;
          }

          #charades-game .cfx-actions .cfx-button {
            width: 100%;
          }
        }
      `}</style>

      <section id="charades-game" className="page-section">
        <div className="cfx-top">
          <button className="cfx-back" onClick={onBack}>
            ← Back to Other Games
          </button>

          <button className="cfx-reset" onClick={resetScores}>
            Reset Scores
          </button>
        </div>

        <div className="cfx-heading">
          <div>
            <p className="cfx-kicker">Team Game</p>
            <h2 className="cfx-title">Charades & Reverse Charades</h2>
          </div>
        </div>

        <div className="cfx-scoreboard">
          {teamNames.map((teamName, index) => (
            <button
              className={
                activeTeam === index ? "cfx-score is-active" : "cfx-score"
              }
              key={`score-${index}`}
              onClick={() => {
                if (screen === "setup") setActiveTeam(index);
              }}
              title="Choose the team for the next turn"
            >
              <span>{teamName.trim() || `Team ${index + 1}`}</span>
              <strong>{scores[index]}</strong>
            </button>
          ))}
        </div>

        {screen === "setup" ? (
          <div className="cfx-main-grid">
            <aside className="cfx-panel">
              <h3>Game Setup</h3>

              <p className="cfx-help">
                Choose a mode, set the timer, then start a turn for{" "}
                <strong>{activeTeamName}</strong>.
              </p>

              <div className="cfx-mode-grid">
                <button
                  className={
                    mode === "charades" ? "cfx-mode is-selected" : "cfx-mode"
                  }
                  onClick={() => setMode("charades")}
                >
                  <strong>Charades</strong>
                  <span>One actor performs. Their team guesses.</span>
                </button>

                <button
                  className={
                    mode === "reverse" ? "cfx-mode is-selected" : "cfx-mode"
                  }
                  onClick={() => setMode("reverse")}
                >
                  <strong>Reverse</strong>
                  <span>One clue giver speaks. The other player acts guesses.</span>
                </button>
              </div>

              <label className="cfx-field">
                Timer length
                <select
                  value={timerLength}
                  onChange={(event) => {
                    const nextLength = Number(event.target.value);
                    setTimerLength(nextLength);
                    setTimeLeft(nextLength);
                  }}
                >
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="90">1 minute 30 seconds</option>
                  <option value="120">2 minutes</option>
                </select>
              </label>

              <label className="cfx-field">
                Team 1 name
                <input
                  value={teamNames[0]}
                  onChange={(event) => updateTeamName(0, event.target.value)}
                />
              </label>

              <label className="cfx-field">
                Team 2 name
                <input
                  value={teamNames[1]}
                  onChange={(event) => updateTeamName(1, event.target.value)}
                />
              </label>

              <button
                className="cfx-button cfx-primary cfx-start"
                onClick={startTurn}
              >
                Start {activeTeamName}'s Turn
              </button>
            </aside>

            <section className="cfx-stage">
              <div className="cfx-stage-inner">
                <p className="cfx-turn">{modeDetails.title}</p>
                <h3>{activeTeamName} is up next</h3>
                <p className="cfx-description">{modeDetails.setup}</p>

                <div className="cfx-display-card">
                  <span className="cfx-badge">How to Play</span>
                  <h2>{modeDetails.intro}</h2>
                  <p className="cfx-description" style={{ color: "#fff4dc" }}>
                    The game gives your team random prompts, tracks the timer,
                    and keeps score automatically.
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <section className="cfx-stage">
            <div className="cfx-stage-inner">
              <p className="cfx-turn">
                {activeTeamName} · {modeDetails.title}
              </p>

              {screen === "pass" && (
                <div className="cfx-pass-card">
                  <span className="cfx-badge">Pass the Device</span>
                  <h3>{modeDetails.passTitle}</h3>
                  <p className="cfx-description">{modeDetails.passText}</p>

                  <button className="cfx-button cfx-primary" onClick={revealPrompt}>
                    Reveal Prompt & Start Timer
                  </button>
                </div>
              )}

              {screen === "prompt" && currentPrompt && (
                <>
                  <div className="cfx-display-card">
                    <span className="cfx-badge">{currentPrompt.category}</span>
                    <h2>{currentPrompt.text}</h2>
                    <p className="cfx-description" style={{ color: "#fff4dc" }}>
                      {modeDetails.promptInstruction}
                    </p>
                  </div>

                  <div className="cfx-timer-wrap">
                    <p className="cfx-timer">{formatTime(timeLeft)}</p>
                    <div className="cfx-progress" aria-hidden="true">
                      <span />
                    </div>
                  </div>

                  <div className="cfx-actions">
                    <button className="cfx-button cfx-primary" onClick={markCorrect}>
                      Correct +1
                    </button>

                    <button className="cfx-button cfx-secondary" onClick={skipPrompt}>
                      Skip Prompt
                    </button>

                    <button className="cfx-button cfx-danger" onClick={endTurn}>
                      End Turn
                    </button>
                  </div>

                  <p className="cfx-score-note">
                    Correct this turn: {correctThisTurn} · Total score:{" "}
                    {scores[activeTeam]}
                  </p>
                </>
              )}

              {screen === "finished" && (
                <div className="cfx-finish-card">
                  <span className="cfx-badge">Turn Complete</span>
                  <h3>
                    {activeTeamName} scored {correctThisTurn} point
                    {correctThisTurn === 1 ? "" : "s"} this turn.
                  </h3>
                  <p className="cfx-description">
                    Total score: <strong>{scores[activeTeam]}</strong>. Next
                    up:{" "}
                    <strong>
                      {teamNames[otherTeamIndex].trim() ||
                        `Team ${otherTeamIndex + 1}`}
                    </strong>
                    .
                  </p>

                  <button className="cfx-button cfx-primary" onClick={startNextTeam}>
                    Start Next Team
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </>
  );
}
