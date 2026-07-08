import { useEffect, useState } from "react";

const barkadaDashCards = [
  {
    id: "dash-lucky-1",
    type: "fortune",
    label: "Lucky Break",
    title: "Song Switch",
    description:
      "Let the group choose a song. Sing a chorus, hum it, or act it out.",
    points: 1,
  },
  {
    id: "dash-lucky-2",
    type: "fortune",
    label: "Lucky Break",
    title: "Compliment Storm",
    description:
      "Give one genuine compliment to every player at the table.",
    points: 1,
  },
  {
    id: "dash-lucky-3",
    type: "fortune",
    label: "Lucky Break",
    title: "DJ for a Minute",
    description:
      "Choose the next background-music vibe or let the group pick one.",
    points: 1,
  },
  {
    id: "dash-lucky-4",
    type: "fortune",
    label: "Lucky Break",
    title: "Funny Walk",
    description:
      "Walk across the room using the funniest walk you can make.",
    points: 1,
  },
  {
    id: "dash-lucky-5",
    type: "fortune",
    label: "Lucky Break",
    title: "Barkada Shoutout",
    description:
      "Tell a short funny or wholesome memory with someone in the room.",
    points: 1,
  },
  {
    id: "dash-lucky-6",
    type: "fortune",
    label: "Lucky Break",
    title: "Emoji Face",
    description:
      "The group gives you an emoji. Make the face until they guess it.",
    points: 1,
  },
  {
    id: "dash-challenge-1",
    type: "challenge",
    label: "Speed Challenge",
    title: "Color Hunt",
    description:
      "Find an object in the room matching a color chosen by the group.",
    points: 2,
    seconds: 45,
  },
  {
    id: "dash-challenge-2",
    type: "challenge",
    label: "Speed Challenge",
    title: "Five-Second Category",
    description:
      "Name three things in a category chosen by the group before time runs out.",
    points: 2,
    seconds: 20,
  },
  {
    id: "dash-challenge-3",
    type: "challenge",
    label: "Speed Challenge",
    title: "Freeze Frame",
    description:
      "Pose like a movie character. Stay frozen while the group counts to 15.",
    points: 2,
    seconds: 20,
  },
  {
    id: "dash-challenge-4",
    type: "challenge",
    label: "Speed Challenge",
    title: "Mini Charades",
    description:
      "Act out a word chosen by the group. Get one correct guess to win.",
    points: 2,
    seconds: 45,
  },
  {
    id: "dash-challenge-5",
    type: "challenge",
    label: "Speed Challenge",
    title: "Tabletop Beat",
    description:
      "Make a short rhythm on the table. The group must repeat it correctly.",
    points: 2,
    seconds: 30,
  },
  {
    id: "dash-challenge-6",
    type: "challenge",
    label: "Speed Challenge",
    title: "Tongue Twister",
    description:
      "Repeat a tongue twister selected by the group three times without stopping.",
    points: 2,
    seconds: 30,
  },
  {
    id: "dash-shield-1",
    type: "shield",
    label: "Shield Card",
    title: "Lucky Pass",
    description:
      "Keep this shield. You may spend it later to skip one Speed Challenge.",
  },
  {
    id: "dash-shield-2",
    type: "shield",
    label: "Shield Card",
    title: "Barkada Backup",
    description:
      "Keep this shield. You may spend it later to skip one Speed Challenge.",
  },
  {
    id: "dash-shield-3",
    type: "shield",
    label: "Shield Card",
    title: "Free Escape",
    description:
      "Keep this shield. You may spend it later to skip one Speed Challenge.",
  },
  {
    id: "dash-shield-4",
    type: "shield",
    label: "Shield Card",
    title: "Safe Pass",
    description:
      "Keep this shield. You may spend it later to skip one Speed Challenge.",
  },
];

function createBarkadaDashDeck() {
  return [...barkadaDashCards].sort(() => Math.random() - 0.5);
}

export default function BarkadaDash({ onBack, onSound }) {
  const [players, setPlayers] = useState(["Player 1", "Player 2"]);
  const [scores, setScores] = useState([0, 0]);
  const [shields, setShields] = useState([0, 0]);
  const [targetScore, setTargetScore] = useState(5);
  const [activePlayer, setActivePlayer] = useState(0);
  const [deck, setDeck] = useState(() => createBarkadaDashDeck());
  const [screen, setScreen] = useState("setup");
  const [currentCard, setCurrentCard] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [turnMessage, setTurnMessage] = useState("");
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState("");

  const activeName = players[activePlayer]?.trim() || `Player ${activePlayer + 1}`;
  const deckCount = deck.length;

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) {
      if (timeLeft <= 0) setIsTimerRunning(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((oldTime) => Math.max(0, oldTime - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [isTimerRunning, timeLeft]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  }

  function cleanedPlayerList() {
    return players.map((player, index) => player.trim() || `Player ${index + 1}`);
  }

  function updatePlayer(index, value) {
    setPlayers((oldPlayers) =>
      oldPlayers.map((player, playerIndex) =>
        playerIndex === index ? value : player
      )
    );
  }

  function addPlayer() {
    const name = newPlayerName.trim();

    if (!name) return;

    setPlayers((oldPlayers) => [...oldPlayers, name]);
    setNewPlayerName("");
  }

  function removePlayer(index) {
    if (players.length <= 2) return;

    setPlayers((oldPlayers) =>
      oldPlayers.filter((_, playerIndex) => playerIndex !== index)
    );
  }

  function startGame() {
    const readyPlayers = cleanedPlayerList();

    if (readyPlayers.length < 2) return;

    setPlayers(readyPlayers);
    setScores(readyPlayers.map(() => 0));
    setShields(readyPlayers.map(() => 0));
    setDeck(createBarkadaDashDeck());
    setActivePlayer(0);
    setCurrentCard(null);
    setTimeLeft(0);
    setIsTimerRunning(false);
    setTurnMessage("");
    setWinnerIndex(null);
    setScreen("turn");
  }

  function drawCard() {
    let nextDeck = deck;

    if (nextDeck.length === 0) {
      nextDeck = createBarkadaDashDeck();
    }

    const [nextCard, ...remainingCards] = nextDeck;

    setDeck(remainingCards);
    setCurrentCard(nextCard);
    setTimeLeft(nextCard.seconds || 0);
    setIsTimerRunning(false);
    setTurnMessage("");
    setScreen("card");
    onSound?.("card");
  }

  function startTimer() {
    if (!currentCard?.seconds) return;
    setIsTimerRunning(true);
  }

  function finishTurn(message) {
    setIsTimerRunning(false);
    setTurnMessage(message);
    setScreen("turn-end");
  }

  function completeCard() {
    if (!currentCard) return;

    if (currentCard.type === "shield") {
      setShields((oldShields) =>
        oldShields.map((shieldCount, index) =>
          index === activePlayer ? shieldCount + 1 : shieldCount
        )
      );
      finishTurn(`${activeName} collected a shield for a future Speed Challenge.`);
      return;
    }

    const points = currentCard.points || 0;
    const nextScores = scores.map((score, index) =>
      index === activePlayer ? score + points : score
    );

    setScores(nextScores);

    if (nextScores[activePlayer] >= targetScore) {
      setWinnerIndex(activePlayer);
      setIsTimerRunning(false);
      setScreen("winner");
      onSound?.("winner");
      return;
    }

    finishTurn(`${activeName} earned ${points} star${points === 1 ? "" : "s"}!`);
  }

  function useShield() {
    if (!currentCard || currentCard.type !== "challenge" || shields[activePlayer] <= 0) {
      return;
    }

    setShields((oldShields) =>
      oldShields.map((shieldCount, index) =>
        index === activePlayer ? shieldCount - 1 : shieldCount
      )
    );

    finishTurn(`${activeName} used one shield and skipped this Speed Challenge.`);
  }

  function skipCard() {
    finishTurn(`${activeName} skipped the card. No stars this turn.`);
  }

  function nextPlayer() {
    const nextIndex = (activePlayer + 1) % players.length;
    setActivePlayer(nextIndex);
    setCurrentCard(null);
    setTimeLeft(0);
    setIsTimerRunning(false);
    setTurnMessage("");
    setScreen("turn");
  }

  function resetRound() {
    const shouldReset = window.confirm("Reset the Barkada Dash round?");

    if (!shouldReset) return;

    setScores(players.map(() => 0));
    setShields(players.map(() => 0));
    setDeck(createBarkadaDashDeck());
    setActivePlayer(0);
    setCurrentCard(null);
    setTimeLeft(0);
    setIsTimerRunning(false);
    setTurnMessage("");
    setWinnerIndex(null);
    setScreen("setup");
  }

  return (
    <>
      <style>{`
        #barkada-dash .dash-layout {
          display: grid;
          grid-template-columns: minmax(270px, 340px) 1fr;
          gap: 24px;
          align-items: start;
        }

        #barkada-dash .dash-panel,
        #barkada-dash .dash-stage,
        #barkada-dash .dash-scoreboard,
        #barkada-dash .dash-result-card {
          border: 1px solid rgba(255, 220, 135, 0.22);
          border-radius: 20px;
          background:
            radial-gradient(circle at 90% 12%, rgba(255, 204, 80, 0.12), transparent 24%),
            linear-gradient(145deg, rgba(11, 59, 42, 0.98), rgba(4, 29, 20, 0.98));
          color: #fff9e9;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 18px 36px rgba(0, 0, 0, 0.16);
        }

        #barkada-dash .dash-panel {
          padding: 22px;
        }

        #barkada-dash .dash-panel h3,
        #barkada-dash .dash-stage h3,
        #barkada-dash .dash-result-card h3 {
          margin-top: 0;
          color: #fff7da;
        }

        #barkada-dash .dash-control {
          display: grid;
          gap: 8px;
          margin: 18px 0;
          color: #fff0c5;
          font-weight: 900;
        }

        #barkada-dash .dash-control input,
        #barkada-dash .dash-control select,
        #barkada-dash .dash-player-row input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 12px;
          border: 1px solid rgba(255, 230, 158, 0.28);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.24);
          color: #fff9e9;
          font: inherit;
        }

        #barkada-dash .dash-player-list {
          display: grid;
          gap: 9px;
          margin: 14px 0;
        }

        #barkada-dash .dash-player-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
        }

        #barkada-dash .dash-add-player {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          margin-top: 10px;
        }

        #barkada-dash .dash-scoreboard {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 10px;
          padding: 12px;
          margin-bottom: 22px;
        }

        #barkada-dash .dash-score {
          min-width: 0;
          padding: 14px 11px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.18);
          text-align: center;
        }

        #barkada-dash .dash-score.active-dash-player {
          border-color: #ffd260;
          background: rgba(255, 204, 80, 0.13);
          box-shadow: 0 0 0 2px rgba(255, 210, 96, 0.10);
        }

        #barkada-dash .dash-score span,
        #barkada-dash .dash-score strong,
        #barkada-dash .dash-score small {
          display: block;
        }

        #barkada-dash .dash-score span {
          overflow-wrap: anywhere;
          color: #f8ebc8;
          font-weight: 900;
        }

        #barkada-dash .dash-score strong {
          margin: 8px 0 4px;
          color: #ffd260;
          font-size: 2rem;
          line-height: 1;
        }

        #barkada-dash .dash-score small {
          color: #d5ddca;
          font-size: 0.78rem;
        }

        #barkada-dash .dash-stage {
          min-height: 470px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        #barkada-dash .dash-turn-copy {
          max-width: 600px;
        }

        #barkada-dash .dash-turn-copy h2 {
          margin: 10px 0;
          color: #fff7da;
          font-size: clamp(2rem, 5vw, 3.7rem);
        }

        #barkada-dash .dash-turn-copy p {
          color: #dce7d7;
          line-height: 1.6;
        }

        #barkada-dash .dash-card {
          width: min(100%, 650px);
          min-height: 300px;
          padding: 34px 26px;
          border: 9px solid rgba(255, 231, 153, 0.64);
          border-radius: 28px;
          box-sizing: border-box;
          color: #fffaf0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.34);
        }

        #barkada-dash .dash-card.fortune {
          background:
            radial-gradient(circle at 85% 13%, rgba(255, 240, 154, 0.36), transparent 24%),
            linear-gradient(145deg, #7a1835, #be3152 50%, #692041);
        }

        #barkada-dash .dash-card.challenge {
          background:
            radial-gradient(circle at 85% 13%, rgba(143, 255, 221, 0.28), transparent 24%),
            linear-gradient(145deg, #064f43, #0d8065 48%, #0b4c48);
        }

        #barkada-dash .dash-card.shield {
          background:
            radial-gradient(circle at 85% 13%, rgba(190, 221, 255, 0.34), transparent 24%),
            linear-gradient(145deg, #143a72, #2265ae 50%, #263e85);
        }

        #barkada-dash .dash-card h2 {
          max-width: 560px;
          margin: 8px 0 14px;
          font-size: clamp(2.25rem, 6vw, 4.3rem);
          line-height: 1.08;
          overflow-wrap: anywhere;
        }

        #barkada-dash .dash-card p {
          max-width: 530px;
          margin: 0;
          font-size: 1.04rem;
          line-height: 1.55;
        }

        #barkada-dash .dash-card-label {
          margin: 0 0 8px !important;
          color: #fff3ba;
          font-weight: 1000;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        #barkada-dash .dash-timer {
          margin: 20px 0 0;
          color: #fff4b5;
          font-size: clamp(2.4rem, 7vw, 4.1rem);
          font-weight: 1000;
          line-height: 1;
        }

        #barkada-dash .dash-timer.time-up {
          color: #ffd3dc;
        }

        #barkada-dash .dash-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        #barkada-dash .dash-result-card {
          width: min(100%, 620px);
          padding: 34px 26px;
        }

        #barkada-dash .dash-result-card h2 {
          margin: 12px 0;
          color: #ffd260;
          font-size: clamp(2.15rem, 6vw, 4rem);
        }

        #barkada-dash .dash-small-note {
          margin: 16px auto 0;
          max-width: 540px;
          color: #dce7d7;
          line-height: 1.55;
        }

        #barkada-dash .dash-deck-note {
          margin: 18px 0 0;
          color: #c8d9ca;
          font-size: 0.86rem;
        }

        @media (max-width: 820px) {
          #barkada-dash .dash-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 540px) {
          #barkada-dash .dash-add-player,
          #barkada-dash .dash-player-row {
            grid-template-columns: 1fr;
          }

          #barkada-dash .dash-actions .primary-button,
          #barkada-dash .dash-actions .secondary-button,
          #barkada-dash .dash-actions .danger-button,
          #barkada-dash .dash-add-player button {
            width: 100%;
          }

          #barkada-dash .dash-stage {
            min-height: 390px;
            padding: 20px 14px;
          }

          #barkada-dash .dash-card {
            min-height: 270px;
            padding: 26px 18px;
          }
        }
      `}</style>

      <section id="barkada-dash" className="page-section">
        <button className="back-button" onClick={onBack}>
          ← Back to Other Games
        </button>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Draw-a-Card Party Race</p>
            <h2>Barkada Dash</h2>
          </div>

          <button className="reset-link" onClick={resetRound}>
            Reset Round
          </button>
        </div>

        <div className="dash-scoreboard">
          {players.map((player, index) => (
            <div
              key={`dash-score-${index}`}
              className={
                activePlayer === index
                  ? "dash-score active-dash-player"
                  : "dash-score"
              }
            >
              <span>{player.trim() || `Player ${index + 1}`}</span>
              <strong>{scores[index] || 0} ★</strong>
              <small>{shields[index] || 0} shield{shields[index] === 1 ? "" : "s"}</small>
            </div>
          ))}
        </div>

        {screen === "setup" && (
          <div className="dash-layout">
            <aside className="dash-panel">
              <h3>Game Setup</h3>
              <p className="small-text">
                Add at least two players. The first player to reach the star
                target wins the round.
              </p>

              <label className="dash-control">
                Stars needed to win
                <select
                  value={targetScore}
                  onChange={(event) => setTargetScore(Number(event.target.value))}
                >
                  <option value="3">3 stars · quick round</option>
                  <option value="5">5 stars · standard round</option>
                  <option value="7">7 stars · long round</option>
                </select>
              </label>

              <div className="dash-player-list">
                {players.map((player, index) => (
                  <div className="dash-player-row" key={`dash-player-${index}`}>
                    <input
                      value={player}
                      onChange={(event) => updatePlayer(index, event.target.value)}
                      aria-label={`Player ${index + 1} name`}
                    />
                    {players.length > 2 && (
                      <button
                        className="danger-button"
                        onClick={() => removePlayer(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="dash-add-player">
                <input
                  value={newPlayerName}
                  onChange={(event) => setNewPlayerName(event.target.value)}
                  placeholder="Add a player"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addPlayer();
                  }}
                />
                <button className="secondary-button" onClick={addPlayer}>
                  Add Player
                </button>
              </div>

              <button className="primary-button full-width" onClick={startGame}>
                Start Barkada Dash
              </button>
            </aside>

            <div className="dash-stage">
              <div className="dash-turn-copy">
                <span className="rank-badge">Original Party Card Game</span>
                <h2>Draw. Do. Collect Stars.</h2>
                <p>
                  Each turn, draw a card. Finish Lucky Breaks and Speed
                  Challenges to collect stars. Shield Cards let you skip one
                  future Speed Challenge.
                </p>
                <p className="dash-small-note">
                  Use water, snacks, funny poses, or any safe alternative that
                  fits your group. Keep the challenges fun and respectful.
                </p>
              </div>
            </div>
          </div>
        )}

        {screen === "turn" && (
          <div className="dash-stage">
            <div className="dash-turn-copy">
              <span className="rank-badge">Next Turn</span>
              <h2>{activeName}'s turn</h2>
              <p>
                Draw one card and complete its task to collect stars. You have
                {shields[activePlayer] || 0} shield
                {shields[activePlayer] === 1 ? "" : "s"} available.
              </p>
              <button className="primary-button" onClick={drawCard}>
                Draw a Card
              </button>
              <p className="dash-deck-note">
                {deckCount} card{deckCount === 1 ? "" : "s"} left before the
                deck reshuffles.
              </p>
            </div>
          </div>
        )}

        {screen === "card" && currentCard && (
          <div className="dash-stage">
            <div className={`dash-card ${currentCard.type}`}>
              <p className="dash-card-label">{currentCard.label}</p>
              <h2>{currentCard.title}</h2>
              <p>{currentCard.description}</p>

              {currentCard.seconds && (
                <div
                  className={
                    timeLeft === 0 ? "dash-timer time-up" : "dash-timer"
                  }
                >
                  {timeLeft === 0 ? "Time Up" : formatTime(timeLeft)}
                </div>
              )}
            </div>

            <div className="dash-actions">
              {currentCard.type === "challenge" &&
                !isTimerRunning &&
                timeLeft > 0 && (
                  <button className="secondary-button" onClick={startTimer}>
                    Start {currentCard.seconds}-Second Timer
                  </button>
                )}

              <button className="primary-button" onClick={completeCard}>
                {currentCard.type === "shield"
                  ? "Collect Shield"
                  : `Completed +${currentCard.points} Star${
                      currentCard.points === 1 ? "" : "s"
                    }`}
              </button>

              {currentCard.type === "challenge" &&
                (shields[activePlayer] || 0) > 0 && (
                  <button className="secondary-button" onClick={useShield}>
                    Use 1 Shield
                  </button>
                )}

              <button className="danger-button" onClick={skipCard}>
                Skip Card
              </button>
            </div>

            <p className="dash-small-note">
              Only press “Completed” when the group agrees the task was done.
            </p>
          </div>
        )}

        {screen === "turn-end" && (
          <div className="dash-stage">
            <div className="dash-result-card">
              <span className="rank-badge">Turn Complete</span>
              <h2>{turnMessage}</h2>
              <p className="dash-small-note">
                Current score: <strong>{scores[activePlayer]} ★</strong> ·
                Next player:{" "}
                <strong>
                  {players[(activePlayer + 1) % players.length]?.trim() ||
                    "Next player"}
                </strong>
              </p>
              <div className="dash-actions">
                <button className="primary-button" onClick={nextPlayer}>
                  Next Player
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "winner" && winnerIndex !== null && (
          <div className="dash-stage">
            <div className="dash-result-card">
              <span className="rank-badge">Finish Line</span>
              <h2>★ {players[winnerIndex]} Wins! ★</h2>
              <p className="dash-small-note">
                They reached {scores[winnerIndex]} stars and completed the
                Barkada Dash.
              </p>
              <div className="dash-actions">
                <button className="primary-button" onClick={startGame}>
                  Play Another Round
                </button>
                <button className="secondary-button" onClick={onBack}>
                  Back to Games
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
