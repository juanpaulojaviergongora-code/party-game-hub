import { useEffect, useMemo, useState } from "react";

const wordPacks = {
  "Filipino Food": [
    "Adobo",
    "Sinigang",
    "Kare-Kare",
    "Lechon",
    "Pancit",
    "Lumpia",
    "Sisig",
    "Bulalo",
    "Halo-Halo",
    "Turon",
    "Tinola",
    "Champorado",
    "Bicol Express",
    "Laing",
    "Caldereta",
    "Afritada",
    "Menudo",
    "Dinuguan",
    "Inihaw na Liempo",
    "Longganisa",
    "Tapsilog",
    "Tocilog",
    "Arroz Caldo",
    "Lugaw",
    "Kwek-Kwek",
    "Fish Ball",
    "Isaw",
    "Banana Cue",
    "Bibingka",
    "Puto Bumbong",
  ],
  "Filipino Places": [
    "Boracay",
    "Palawan",
    "Baguio",
    "Tagaytay",
    "Cebu",
    "Siargao",
    "Batanes",
    "Intramuros",
    "Manila Bay",
    "Divisoria",
    "Rizal Park",
    "Quiapo",
    "Vigan",
    "Davao",
    "Iloilo",
    "Bohol",
    "Panglao",
    "Coron",
    "El Nido",
    "Mayon Volcano",
    "Taal Volcano",
    "Chocolate Hills",
    "Enchanted River",
    "Banaue Rice Terraces",
    "Puerto Princesa",
    "Subic",
    "Zambales",
    "Sagada",
    "La Union",
    "Makati",
  ],
  "Barkada Life": [
    "Karaoke",
    "Fiesta",
    "Barangay",
    "Parol",
    "Tinikling",
    "Videoke",
    "Family Reunion",
    "Jeepney",
    "Sari-Sari Store",
    "Simbang Gabi",
    "Bayanihan",
    "Bahay Kubo",
    "Birthday Party",
    "Christmas Party",
    "Inuman",
    "Road Trip",
    "Sleepover",
    "Beach Outing",
    "Group Chat",
    "Class Reunion",
    "Potluck",
    "House Party",
    "Movie Night",
    "Karaoke Battle",
    "Boodle Fight",
    "Talent Show",
    "Game Night",
    "Barangay Basketball",
    "Fiesta Dance",
    "Kanto Tambay",
  ],
  "Everyday Things": [
    "Walis Tambo",
    "Tabo",
    "Tsinelas",
    "Bimpo",
    "Bayong",
    "Palayok",
    "Rice Cooker",
    "Tupperware",
    "Payong",
    "Kalan",
    "Basahan",
    "Pamaypay",
    "Extension Cord",
    "Remote Control",
    "Water Bottle",
    "Flashlight",
    "Wallet",
    "Backpack",
    "Alarm Clock",
    "Pillow",
    "Blanket",
    "Toothbrush",
    "Sunglasses",
    "Earphones",
    "Power Bank",
    "Keychain",
    "Notebook",
    "Ballpen",
    "Slippers",
    "Laundry Basket",
  ],
  "Animals": [
    "Dog",
    "Cat",
    "Chicken",
    "Duck",
    "Goat",
    "Horse",
    "Monkey",
    "Elephant",
    "Tiger",
    "Lion",
    "Penguin",
    "Dolphin",
    "Shark",
    "Frog",
    "Butterfly",
    "Eagle",
    "Owl",
    "Rabbit",
    "Turtle",
    "Crocodile",
  ],
  "Movies and Shows": [
    "Spider-Man",
    "Harry Potter",
    "Titanic",
    "Frozen",
    "Shrek",
    "The Lion King",
    "Toy Story",
    "Avengers",
    "Kung Fu Panda",
    "Finding Nemo",
    "The Simpsons",
    "SpongeBob",
    "Star Wars",
    "Jurassic Park",
    "Coco",
    "Moana",
    "Encanto",
    "Wednesday",
    "Stranger Things",
    "Squid Game",
  ],
  "Jobs and Roles": [
    "Teacher",
    "Doctor",
    "Chef",
    "Firefighter",
    "Police Officer",
    "Pilot",
    "Singer",
    "Dancer",
    "Photographer",
    "Barber",
    "Farmer",
    "Mechanic",
    "Lawyer",
    "Nurse",
    "Architect",
    "Cashier",
    "Delivery Rider",
    "Security Guard",
    "Game Host",
    "Tour Guide",
  ],
  "Sports and Hobbies": [
    "Basketball",
    "Volleyball",
    "Badminton",
    "Swimming",
    "Boxing",
    "Biking",
    "Running",
    "Dancing",
    "Singing",
    "Painting",
    "Cooking",
    "Gardening",
    "Gaming",
    "Photography",
    "Fishing",
    "Skateboarding",
    "Yoga",
    "Bowling",
    "Chess",
    "Guitar",
  ],
};

const starterPlayers = ["Player 1", "Player 2", "Player 3", "Player 4"];

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function WhoIsSpy({ onBack, onSound }) {
  const [players, setPlayers] = useState(starterPlayers);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [category, setCategory] = useState("Filipino Food");
  const [spyCount, setSpyCount] = useState(1);
  const [discussionLength, setDiscussionLength] = useState(90);
  const [stage, setStage] = useState("setup");
  const [round, setRound] = useState(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(false);
  const [discussionSeconds, setDiscussionSeconds] = useState(90);
  const [discussionRunning, setDiscussionRunning] = useState(false);
  const [error, setError] = useState("");

  const readyPlayers = useMemo(
    () =>
      players
        .map((player, index) => player.trim() || `Player ${index + 1}`)
        .filter(Boolean),
    [players]
  );

  useEffect(() => {
    if (!discussionRunning) return;

    if (discussionSeconds <= 0) {
      setDiscussionRunning(false);
      setStage("final");
      onSound?.("winner");
      return;
    }

    const countdown = window.setTimeout(() => {
      setDiscussionSeconds((oldSeconds) => oldSeconds - 1);
    }, 1000);

    return () => window.clearTimeout(countdown);
  }, [discussionRunning, discussionSeconds, onSound]);

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
    if (players.length <= 3) return;

    setPlayers((oldPlayers) =>
      oldPlayers.filter((_, playerIndex) => playerIndex !== index)
    );
  }

  function startRound() {
    if (readyPlayers.length < 3) {
      setError("Add at least 3 players before starting.");
      return;
    }

    const secretWord = getRandomItem(wordPacks[category]);
    const allowedSpyCount = Math.min(
      Math.max(1, spyCount),
      readyPlayers.length - 1
    );

    const availableIndexes = readyPlayers.map((_, index) => index);
    const spyIndexes = [];

    while (spyIndexes.length < allowedSpyCount) {
      const randomPosition = Math.floor(
        Math.random() * availableIndexes.length
      );

      spyIndexes.push(availableIndexes.splice(randomPosition, 1)[0]);
    }

    setPlayers(readyPlayers);
    setRound({
      secretWord,
      spyIndexes,
    });
    setRevealIndex(0);
    setRoleVisible(false);
    setDiscussionSeconds(discussionLength);
    setDiscussionRunning(false);
    setError("");
    setStage("reveal");
    onSound?.("card");
  }

  function revealRole() {
    setRoleVisible(true);
    onSound?.("card");
  }

  function passToNextPlayer() {
    if (revealIndex === players.length - 1) {
      setRoleVisible(false);
      setDiscussionSeconds(discussionLength);
      setDiscussionRunning(true);
      setStage("discussion");
      return;
    }

    setRevealIndex((oldIndex) => oldIndex + 1);
    setRoleVisible(false);
  }

  function endDiscussion() {
    setDiscussionRunning(false);
    setStage("final");
    onSound?.("winner");
  }

  function addDiscussionTime() {
    setDiscussionSeconds((oldSeconds) => oldSeconds + 30);
  }

  function playAgain() {
    startRound();
  }

  function returnToSetup() {
    setDiscussionRunning(false);
    setStage("setup");
    setRound(null);
    setRevealIndex(0);
    setRoleVisible(false);
    setError("");
  }

  const currentPlayerName =
    players[revealIndex]?.trim() || `Player ${revealIndex + 1}`;

  const currentPlayerIsSpy =
    Boolean(round) && round.spyIndexes.includes(revealIndex);

  const spyNames =
    round?.spyIndexes
      .map((index) => players[index])
      .filter(Boolean) || [];

  return (
    <>
      <style>{`
        #who-is-spy .spy-layout {
          display: grid;
          grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        #who-is-spy .spy-panel,
        #who-is-spy .spy-stage {
          border: 1px solid rgba(255, 220, 135, 0.24);
          border-radius: 22px;
          background:
            radial-gradient(circle at 88% 11%, rgba(255, 210, 96, 0.14), transparent 25%),
            linear-gradient(145deg, rgba(12, 64, 45, 0.98), rgba(4, 28, 19, 0.98));
          color: #fff9e9;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 18px 36px rgba(0, 0, 0, 0.16);
        }

        #who-is-spy .spy-panel {
          padding: 22px;
        }

        #who-is-spy .spy-panel h3 {
          margin: 0;
          color: #fff7da;
        }

        #who-is-spy .spy-panel > p {
          margin: 8px 0 16px;
          color: #dce7d7;
          line-height: 1.55;
        }

        #who-is-spy .spy-field {
          display: grid;
          gap: 8px;
          margin-top: 16px;
          color: #fff0c5;
          font-weight: 900;
        }

        #who-is-spy .spy-field select,
        #who-is-spy .spy-player-row input,
        #who-is-spy .spy-add-player input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 12px;
          border: 1px solid rgba(255, 230, 158, 0.28);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.24);
          color: #fff9e9;
          font: inherit;
        }

        #who-is-spy .spy-player-list {
          display: grid;
          gap: 9px;
          margin: 18px 0 12px;
        }

        #who-is-spy .spy-player-row,
        #who-is-spy .spy-add-player {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
        }

        #who-is-spy .spy-add-player {
          margin-bottom: 12px;
        }

        #who-is-spy .spy-error {
          margin: 12px 0 0;
          color: #ffb7c0;
          font-weight: 800;
        }

        #who-is-spy .spy-stage {
          min-height: 470px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          text-align: center;
        }

        #who-is-spy .spy-card {
          width: min(100%, 660px);
          padding: clamp(24px, 4vw, 42px);
          border: 1px solid rgba(255, 232, 164, 0.34);
          border-radius: 24px;
          background:
            radial-gradient(circle at 84% 12%, rgba(255, 227, 135, 0.16), transparent 23%),
            rgba(0, 0, 0, 0.18);
        }

        #who-is-spy .spy-card h2 {
          margin: 12px 0;
          color: #fff7da;
          font-size: clamp(2rem, 5vw, 4rem);
          line-height: 1.05;
        }

        #who-is-spy .spy-note {
          max-width: 570px;
          margin: 0 auto;
          color: #dce7d7;
          line-height: 1.6;
        }

        #who-is-spy .spy-role {
          margin: 22px 0;
          color: #ffd260;
          font-size: clamp(2.1rem, 6vw, 4.7rem);
          font-weight: 1000;
          line-height: 1;
          overflow-wrap: anywhere;
        }

        #who-is-spy .spy-role.spy-danger {
          color: #ff9aad;
          text-shadow: 0 0 24px rgba(255, 79, 118, 0.28);
        }

        #who-is-spy .spy-timer {
          margin: 24px 0 7px;
          color: #ffd260;
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 1000;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        #who-is-spy .spy-timer-label {
          color: #e7f0df;
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        #who-is-spy .spy-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }

        #who-is-spy .spy-reveal-strip {
          display: inline-flex;
          margin: 8px 0 12px;
          padding: 8px 13px;
          border: 1px solid rgba(255, 229, 143, 0.38);
          border-radius: 999px;
          background: rgba(255, 210, 96, 0.12);
          color: #fff0b7;
          font-weight: 900;
        }

        @media (max-width: 840px) {
          #who-is-spy .spy-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          #who-is-spy .spy-player-row,
          #who-is-spy .spy-add-player {
            grid-template-columns: 1fr;
          }

          #who-is-spy .spy-add-player button,
          #who-is-spy .spy-actions .primary-button,
          #who-is-spy .spy-actions .secondary-button,
          #who-is-spy .spy-actions .danger-button {
            width: 100%;
          }

          #who-is-spy .spy-stage {
            min-height: 400px;
            padding: 18px 12px;
          }
        }
      `}</style>

      <section id="who-is-spy" className="page-section">
        <button className="back-button" onClick={onBack}>
          ← Back to Other Games
        </button>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Secret Role Game</p>
            <h2>Who&apos;s the Spy?</h2>
          </div>

          {stage !== "setup" && (
            <button className="reset-link" onClick={returnToSetup}>
              New Setup
            </button>
          )}
        </div>

        {stage === "setup" && (
          <div className="spy-layout">
            <aside className="spy-panel">
              <h3>Round Setup</h3>
              <p>
                Everyone gets the secret word except the hidden spy or spies.
                Pass the phone privately so each player can reveal their role.
              </p>

              <label className="spy-field">
                Word pack
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {Object.keys(wordPacks).map((pack) => (
                    <option key={pack} value={pack}>
                      {pack}
                    </option>
                  ))}
                </select>
              </label>

              <label className="spy-field">
                Number of spies
                <select
                  value={spyCount}
                  onChange={(event) => setSpyCount(Number(event.target.value))}
                >
                  <option value={1}>1 spy</option>
                  <option value={2}>2 spies</option>
                  <option value={3}>3 spies</option>
                </select>
              </label>

              <label className="spy-field">
                Discussion timer
                <select
                  value={discussionLength}
                  onChange={(event) =>
                    setDiscussionLength(Number(event.target.value))
                  }
                >
                  <option value={60}>1 minute</option>
                  <option value={90}>1 minute 30 seconds</option>
                  <option value={120}>2 minutes</option>
                  <option value={180}>3 minutes</option>
                </select>
              </label>

              <div className="spy-player-list">
                {players.map((player, index) => (
                  <div className="spy-player-row" key={`spy-player-${index}`}>
                    <input
                      value={player}
                      onChange={(event) =>
                        updatePlayer(index, event.target.value)
                      }
                      aria-label={`Player ${index + 1} name`}
                    />

                    {players.length > 3 && (
                      <button
                        className="delete-button"
                        onClick={() => removePlayer(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="spy-add-player">
                <input
                  value={newPlayerName}
                  onChange={(event) => setNewPlayerName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addPlayer();
                  }}
                  placeholder="Add a player"
                />

                <button className="secondary-button" onClick={addPlayer}>
                  Add Player
                </button>
              </div>

              {error && <p className="spy-error">{error}</p>}

              <button className="primary-button full-width" onClick={startRound}>
                Start Secret Reveal
              </button>
            </aside>

            <div className="spy-stage">
              <div className="spy-card">
                <span className="rank-badge">Pass-the-Phone Game</span>
                <h2>Find the one person without the word.</h2>
                <p className="spy-note">
                  Reveal roles privately. Then discuss the word without saying
                  it directly. The spy or spies are only revealed after the
                  discussion ends.
                </p>
              </div>
            </div>
          </div>
        )}

        {stage === "reveal" && round && (
          <div className="spy-stage">
            <div className="spy-card">
              <span className="rank-badge">Private Reveal</span>
              <h2>Pass the phone to {currentPlayerName}</h2>

              {!roleVisible ? (
                <>
                  <p className="spy-note">
                    Everyone else should look away. Tap below only when{" "}
                    {currentPlayerName} is holding the phone.
                  </p>

                  <div className="spy-actions">
                    <button className="primary-button" onClick={revealRole}>
                      Reveal My Role
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="spy-note">Your role:</p>

                  <div
                    className={
                      currentPlayerIsSpy
                        ? "spy-role spy-danger"
                        : "spy-role"
                    }
                  >
                    {currentPlayerIsSpy ? "You are the SPY" : round.secretWord}
                  </div>

                  <p className="spy-note">
                    {currentPlayerIsSpy
                      ? "Listen to the clues, blend in, and do not let the group identify you."
                      : "Remember the word. Describe it during discussion without saying it directly."}
                  </p>

                  <div className="spy-actions">
                    <button
                      className="primary-button"
                      onClick={passToNextPlayer}
                    >
                      {revealIndex === players.length - 1
                        ? "Start Discussion"
                        : "Hide and Pass Phone"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {stage === "discussion" && (
          <div className="spy-stage">
            <div className="spy-card">
              <span className="rank-badge">Discussion Time</span>
              <h2>Ask Questions. Give Clues. Vote Together.</h2>
              <p className="spy-note">
                Describe the word without saying it. The spy or spies should try
                to fit in. Once the discussion ends, the game reveals every
                hidden spy.
              </p>

              <div className="spy-timer">{formatTime(discussionSeconds)}</div>
              <div className="spy-timer-label">
                {discussionRunning ? "Discussion in progress" : "Timer paused"}
              </div>

              <div className="spy-actions">
                <button
                  className="secondary-button"
                  onClick={() => setDiscussionRunning((oldValue) => !oldValue)}
                >
                  {discussionRunning ? "Pause Timer" : "Resume Timer"}
                </button>

                <button className="secondary-button" onClick={addDiscussionTime}>
                  +30 Seconds
                </button>

                <button className="danger-button" onClick={endDiscussion}>
                  End Discussion & Reveal Spies
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === "final" && round && (
          <div className="spy-stage">
            <div className="spy-card">
              <span className="rank-badge">Final Reveal</span>
              <h2>
                {spyNames.length === 1 ? "The Spy Was..." : "The Spies Were..."}
              </h2>

              <div className="spy-role spy-danger">
                {spyNames.join(" & ")}
              </div>

              <div className="spy-reveal-strip">
                Secret word: {round.secretWord}
              </div>

              <p className="spy-note">
                Did the group catch {spyNames.length === 1 ? "the spy" : "the spies"},
                or did they successfully blend in? Decide the winner together,
                then begin another round.
              </p>

              <div className="spy-actions">
                <button className="primary-button" onClick={playAgain}>
                  Play Another Round
                </button>

                <button className="secondary-button" onClick={returnToSetup}>
                  Edit Players
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
