import { useEffect, useState } from "react";

const truthTexts = [
  "What is your most embarrassing school memory?",
  "What is something you are secretly proud of?",
  "Who was your first crush?",
  "What is the last thing you searched for on your phone?",
  "What is a small habit you wish you could stop?",
  "What is the funniest lie you told when you were younger?",
  "What is your biggest pet peeve?",
  "What is one thing people often misunderstand about you?",
  "What is the weirdest food combination you enjoy?",
  "What is a talent you wish you had?",
  "What is the most awkward message you have ever sent?",
  "What is one movie or show you can watch again and again?",
  "What is the most childish thing you still do?",
  "What is something you would do if you knew nobody would judge you?",
  "What is your most-used emoji?",
  "What is the worst haircut you have ever had?",
  "What is one thing you always spend too much money on?",
  "What is the funniest nickname you have ever had?",
  "What is a song you know almost every word to?",
  "What is the most embarrassing thing in your photo gallery?",
  "What is something you were afraid of as a child?",
  "What is one thing you would change about your school or work life?",
  "Who in this group would survive longest on a deserted island?",
  "What is your biggest irrational fear?",
  "What is a trend you secretly like?",
  "What is the most awkward compliment you have received?",
  "What is one thing you are really bad at?",
  "What is the last excuse you used to avoid doing something?",
  "What is the funniest dream you can remember?",
  "What is a food you pretend to like but actually do not?",
  "What is one app you use more than you should?",
  "What is the most embarrassing song on your playlist?",
  "What is one thing you would never leave home without?",
  "What is the longest you have gone without checking your phone?",
  "What is a celebrity or fictional character you had a crush on?",
  "What is the most embarrassing thing you did to impress someone?",
  "What is a secret skill you have that most people here do not know?",
  "What is one thing you wish you could tell your younger self?",
  "What is the strangest gift you have ever received?",
  "What is a funny mistake you made recently?",
  "What is something you are competitive about?",
  "What is the worst excuse someone has used on you?",
  "What is one thing you would do with unlimited free time?",
  "What is the first thing you notice about a new person?",
  "What is a word or phrase you say too often?",
  "What is one thing you would like to learn this year?",
  "What is the funniest thing a teacher, boss, or parent has said to you?",
  "What is something that instantly makes you feel better?",
  "What is the most random fact you know?",
  "What is one harmless rule you would make everyone follow for a day?"
];

const dareTexts = [
  "Talk in an accent until your next turn.",
  "Let the group choose a song for you to sing or hum for 20 seconds.",
  "Do your best celebrity impression.",
  "Act like a cat until someone guesses what you are doing.",
  "Send a harmless funny emoji to the last person you messaged.",
  "Do 10 dramatic slow-motion steps across the room.",
  "Let the group give you a new nickname for the next two rounds.",
  "Tell a joke. Keep trying until at least one person laughs.",
  "Speak only in questions until your next turn.",
  "Do your best runway walk for 15 seconds.",
  "Pretend you are a news reporter describing what is happening in the room.",
  "Make the sound of three animals chosen by the group.",
  "Dance without music for 20 seconds.",
  "Balance a safe object on your head for 15 seconds.",
  "Let the group choose a word you must use in every sentence until your next turn.",
  "Do your best villain laugh.",
  "Pretend you are hosting a cooking show using an imaginary dish.",
  "Give everyone in the group a dramatic compliment.",
  "Try to say the alphabet backwards as far as you can.",
  "Mime a movie title until someone guesses it.",
  "Do a 10-second robot dance.",
  "Speak like a game-show host for the next round.",
  "Make up a short jingle about the person to your left.",
  "Do your best impression of someone getting surprised by a ghost.",
  "Try to keep a straight face while the group tries to make you laugh for 20 seconds.",
  "Give a weather report for the room using only dramatic hand movements.",
  "Act out your morning routine without speaking.",
  "Let the group choose an emoji. Make that facial expression for 10 seconds.",
  "Pretend your phone is a microphone and accept an award.",
  "Do a slow-motion replay of dropping something imaginary.",
  "Spell your name using only body movements.",
  "Talk like a cartoon character until your next turn.",
  "Make up a handshake with the person on your right.",
  "Describe your favorite food as if it is a luxury product advertisement.",
  "Try to whistle a song while everyone guesses it.",
  "Pretend you are a tour guide showing people around the room.",
  "Do five different poses for an imaginary photo shoot.",
  "Act like you are trying to open a very stubborn jar.",
  "Make a funny sound every time someone says your name until your next turn.",
  "Give a dramatic reading of the nearest object you can see.",
  "Pretend you are stuck in an elevator for 15 seconds.",
  "Do your best karaoke performance using only the word la.",
  "Create a two-line rhyme about this party.",
  "Walk like you are on the moon for 15 seconds.",
  "Tell the group how to make a sandwich using a serious documentary voice.",
  "Pretend you are an influencer reviewing a glass of water.",
  "Act out a sport chosen by the group.",
  "Do a three-second dance move, then teach it to everyone.",
  "Make up a superhero name and demonstrate your power.",
  "Say thank you in five different dramatic styles."
];

const starterTruths = truthTexts.map((text, index) => ({
  id: `truth-${index + 1}`,
  text,
}));

const starterDares = dareTexts.map((text, index) => ({
  id: `dare-${index + 1}`,
  text,
}));

const starterPlayers = [
  { id: "player-1", name: "Player 1" },
  { id: "player-2", name: "Player 2" },
  { id: "player-3", name: "Player 3" },
];

function readSavedData(key, fallbackValue) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function getSavedPlayers() {
  const savedPlayers = readSavedData(
    "party-truth-dare-players",
    starterPlayers
  );

  if (!Array.isArray(savedPlayers) || savedPlayers.length === 0) {
    return starterPlayers;
  }

  return savedPlayers.map((player, index) => {
    if (typeof player === "string") {
      return {
        id: `saved-player-${index}`,
        name: player,
      };
    }

    return {
      id: player.id || `saved-player-${index}`,
      name: player.name || `Player ${index + 1}`,
    };
  });
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function TruthOrDare({ onBack, onSound }) {
  const [truths, setTruths] = useState(() =>
    readSavedData("party-truths", starterTruths)
  );

  const [dares, setDares] = useState(() =>
    readSavedData("party-dares", starterDares)
  );

  const [players, setPlayers] = useState(getSavedPlayers);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [activePrompt, setActivePrompt] = useState(null);
  const [activePlayer, setActivePlayer] = useState(null);
  const [lastPlayerId, setLastPlayerId] = useState(null);
  const [truthInput, setTruthInput] = useState("");
  const [dareInput, setDareInput] = useState("");

  useEffect(() => {
    localStorage.setItem("party-truths", JSON.stringify(truths));
  }, [truths]);

  useEffect(() => {
    localStorage.setItem("party-dares", JSON.stringify(dares));
  }, [dares]);

  useEffect(() => {
    localStorage.setItem("party-truth-dare-players", JSON.stringify(players));
  }, [players]);

  function getReadyPlayers() {
    return players.filter((player) => player.name.trim());
  }

  function chooseRandomPlayer() {
    const readyPlayers = getReadyPlayers();

    if (readyPlayers.length === 0) {
      setActivePlayer(null);
      return null;
    }

    let choices = readyPlayers.filter((player) => player.id !== lastPlayerId);

    if (choices.length === 0) {
      choices = readyPlayers;
    }

    const chosenPlayer =
      choices[Math.floor(Math.random() * choices.length)];

    setActivePlayer(chosenPlayer);
    setLastPlayerId(chosenPlayer.id);

    return chosenPlayer;
  }

  function choosePrompt(type) {
    const prompts = type === "truth" ? truths : dares;
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    const chosenPlayer = chooseRandomPlayer();

    setActivePrompt(
      prompt
        ? {
            type,
            text: prompt.text,
            playerName: chosenPlayer?.name.trim() || "Everyone",
          }
        : {
            type,
            text: `No ${type} prompts yet.`,
            playerName: chosenPlayer?.name.trim() || "Everyone",
          }
    );

    onSound?.("card");
  }

  function chooseAnotherPlayer() {
    const chosenPlayer = chooseRandomPlayer();

    if (!activePrompt) return;

    setActivePrompt((oldPrompt) => ({
      ...oldPrompt,
      playerName: chosenPlayer?.name.trim() || "Everyone",
    }));
  }

  function updatePlayer(index, value) {
    setPlayers((oldPlayers) =>
      oldPlayers.map((player, playerIndex) =>
        playerIndex === index ? { ...player, name: value } : player
      )
    );
  }

  function addPlayer() {
    const name = newPlayerName.trim();

    if (!name) return;

    setPlayers((oldPlayers) => [
      ...oldPlayers,
      {
        id: makeId("player"),
        name,
      },
    ]);

    setNewPlayerName("");
  }

  function removePlayer(id) {
    if (players.length <= 2) return;

    setPlayers((oldPlayers) =>
      oldPlayers.filter((player) => player.id !== id)
    );

    if (activePlayer?.id === id) {
      setActivePlayer(null);
    }
  }

  function addPrompt(type) {
    const text = type === "truth" ? truthInput.trim() : dareInput.trim();

    if (!text) return;

    const prompt = { id: makeId(type), text };

    if (type === "truth") {
      setTruths((oldTruths) => [...oldTruths, prompt]);
      setTruthInput("");
      return;
    }

    setDares((oldDares) => [...oldDares, prompt]);
    setDareInput("");
  }

  function restoreDefaultPrompts(type) {
    const shouldRestore = window.confirm(
      `Restore the 50 default ${type} prompts? Your custom ${type} prompts will be replaced.`
    );

    if (!shouldRestore) return;

    if (type === "truth") {
      setTruths(starterTruths);
      return;
    }

    setDares(starterDares);
  }

  return (
    <>
      <style>{`
        #truth-or-dare .tod-player-panel {
          margin-bottom: 24px;
          padding: 20px;
          border: 1px solid rgba(255, 220, 135, 0.22);
          border-radius: 18px;
          background:
            radial-gradient(circle at 90% 8%, rgba(255, 209, 100, 0.13), transparent 28%),
            linear-gradient(145deg, rgba(12, 64, 45, 0.98), rgba(4, 28, 19, 0.98));
          color: #fff9e9;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        #truth-or-dare .tod-player-panel h3 {
          margin: 0;
          color: #fff7da;
        }

        #truth-or-dare .tod-player-panel > p {
          margin: 8px 0 16px;
          color: #dce7d7;
          line-height: 1.5;
        }

        #truth-or-dare .tod-player-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }

        #truth-or-dare .tod-player-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
        }

        #truth-or-dare .tod-player-row input,
        #truth-or-dare .tod-add-player input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 11px;
          border: 1px solid rgba(255, 230, 158, 0.28);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.24);
          color: #fff9e9;
          font: inherit;
        }

        #truth-or-dare .tod-add-player {
          display: grid;
          grid-template-columns: minmax(180px, 1fr) auto;
          gap: 10px;
          margin-top: 12px;
        }

        #truth-or-dare .tod-active-player {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 8px 0 15px;
          padding: 9px 14px;
          border: 1px solid rgba(255, 228, 139, 0.44);
          border-radius: 999px;
          background: rgba(255, 204, 80, 0.13);
          color: #fff0b7;
          font-weight: 1000;
        }

        #truth-or-dare .prompt-editor-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        #truth-or-dare .prompt-editor-heading h3 {
          margin-top: 0;
        }

        #truth-or-dare .prompt-editor-heading span {
          color: #ffd260;
          font-size: 0.85rem;
          font-weight: 900;
        }

        #truth-or-dare .prompt-editor .secondary-button {
          margin-top: 9px;
        }

        #truth-or-dare .tod-hidden-note {
          margin: 14px 0 0;
          padding: 12px;
          border-left: 3px solid rgba(255, 210, 96, 0.9);
          border-radius: 0 10px 10px 0;
          background: rgba(255, 210, 96, 0.09);
          color: #dce7d7;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 570px) {
          #truth-or-dare .tod-add-player,
          #truth-or-dare .tod-player-row {
            grid-template-columns: 1fr;
          }

          #truth-or-dare .tod-add-player button {
            width: 100%;
          }
        }
      `}</style>

      <section id="truth-or-dare" className="page-section">
        <button className="back-button" onClick={onBack}>
          ← Back to Other Games
        </button>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Random Prompts</p>
            <h2>Truth or Dare</h2>
          </div>
        </div>

        <section className="tod-player-panel">
          <h3>Players</h3>
          <p>
            Add everyone playing. Each time you choose Truth or Dare, the game
            randomly selects a player and avoids choosing the same person twice
            in a row when possible.
          </p>

          <div className="tod-player-list">
            {players.map((player, index) => (
              <div className="tod-player-row" key={player.id}>
                <input
                  value={player.name}
                  onChange={(event) => updatePlayer(index, event.target.value)}
                  aria-label={`Player ${index + 1} name`}
                />

                {players.length > 2 && (
                  <button
                    className="delete-button"
                    onClick={() => removePlayer(player.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="tod-add-player">
            <input
              value={newPlayerName}
              onChange={(event) => setNewPlayerName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addPlayer();
              }}
              placeholder="Add a player name"
            />

            <button className="secondary-button" onClick={addPlayer}>
              Add Player
            </button>
          </div>
        </section>

        <div className="prompt-display">
          <p className="eyebrow">
            {activePrompt ? activePrompt.type : "Choose a prompt"}
          </p>

          {activePrompt && (
            <div className="tod-active-player">
              ✦ {activePrompt.playerName}&apos;s turn
            </div>
          )}

          <h3>{activePrompt?.text || "Press Truth or Dare to begin."}</h3>

          <div className="button-row center-buttons">
            <button
              className="primary-button"
              onClick={() => choosePrompt("truth")}
            >
              Random Truth
            </button>

            <button
              className="danger-button"
              onClick={() => choosePrompt("dare")}
            >
              Random Dare
            </button>

            {activePrompt && (
              <button
                className="secondary-button"
                onClick={chooseAnotherPlayer}
              >
                Randomize Player
              </button>
            )}
          </div>
        </div>

        <div className="prompt-columns">
          <div className="prompt-editor">
            <div className="prompt-editor-heading">
              <h3>Add a Truth</h3>
              <span>{truths.length} saved</span>
            </div>

            <textarea
              placeholder="Write a Truth question..."
              value={truthInput}
              onChange={(event) => setTruthInput(event.target.value)}
            />

            <button
              className="primary-button full-width"
              onClick={() => addPrompt("truth")}
            >
              Add Truth
            </button>

            <button
              className="secondary-button full-width"
              onClick={() => restoreDefaultPrompts("truth")}
            >
              Restore 50 Default Truths
            </button>

            <p className="tod-hidden-note">
              Your Truth questions are hidden here, but Random Truth still
              chooses from all saved prompts.
            </p>
          </div>

          <div className="prompt-editor">
            <div className="prompt-editor-heading">
              <h3>Add a Dare</h3>
              <span>{dares.length} saved</span>
            </div>

            <textarea
              placeholder="Write a safe Dare..."
              value={dareInput}
              onChange={(event) => setDareInput(event.target.value)}
            />

            <button
              className="danger-button full-width"
              onClick={() => addPrompt("dare")}
            >
              Add Dare
            </button>

            <button
              className="secondary-button full-width"
              onClick={() => restoreDefaultPrompts("dare")}
            >
              Restore 50 Default Dares
            </button>

            <p className="tod-hidden-note">
              Your Dare challenges are hidden here, but Random Dare still
              chooses from all saved prompts.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
