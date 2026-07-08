import { useEffect, useMemo, useRef, useState } from "react";

const starterQuestions = [
  { id: "likely-1", text: "Who is most likely to become famous?" },
  { id: "likely-2", text: "Who is most likely to be late?" },
  { id: "likely-3", text: "Who is most likely to win the lottery?" },
  {
    id: "likely-4",
    text: "Who is most likely to survive a zombie apocalypse?",
  },
  { id: "likely-5", text: "Who is most likely to become a millionaire?" },
  {
    id: "likely-6",
    text: "Who is most likely to fall asleep first at a party?",
  },
  {
    id: "likely-7",
    text: "Who is most likely to become a viral TikTok star?",
  },
  { id: "likely-8", text: "Who is most likely to start a business?" },
  {
    id: "likely-9",
    text: "Who is most likely to move to another country?",
  },
  {
    id: "likely-10",
    text: "Who is most likely to reply last in the group chat?",
  },
  {
    id: "likely-11",
    text: "Who is most likely to disappear from the group chat for weeks?",
  },
  {
    id: "likely-12",
    text: "Who is most likely to order the most food?",
  },
  {
    id: "likely-13",
    text: "Who is most likely to spend all their money in one day?",
  },
  {
    id: "likely-14",
    text: "Who is most likely to become a content creator?",
  },
  {
    id: "likely-15",
    text: "Who is most likely to get lost even with Google Maps?",
  },
  {
    id: "likely-16",
    text: "Who is most likely to laugh at the wrong time?",
  },
  {
    id: "likely-17",
    text: "Who is most likely to accidentally send a message to the wrong person?",
  },
  {
    id: "likely-18",
    text: "Who is most likely to sing karaoke without being asked?",
  },
  {
    id: "likely-19",
    text: "Who is most likely to forget where they put their phone?",
  },
  {
    id: "likely-20",
    text: "Who is most likely to win an argument?",
  },
  {
    id: "likely-21",
    text: "Who is most likely to adopt many pets?",
  },
  {
    id: "likely-22",
    text: "Who is most likely to become a gamer streamer?",
  },
  {
    id: "likely-23",
    text: "Who is most likely to go viral for a funny reason?",
  },
  {
    id: "likely-24",
    text: "Who is most likely to take the longest getting ready?",
  },
  {
    id: "likely-25",
    text: "Who is most likely to make everyone laugh?",
  },
  {
    id: "likely-26",
    text: "Who is most likely to eat dessert before the main meal?",
  },
  {
    id: "likely-27",
    text: "Who is most likely to bring snacks everywhere?",
  },
  {
    id: "likely-28",
    text: "Who is most likely to be awake at 3 AM?",
  },
  {
    id: "likely-29",
    text: "Who is most likely to plan the next barkada trip?",
  },
  {
    id: "likely-30",
    text: "Who is most likely to say 'Libre mo kami' after someone gets paid?",
  },
  {
    id: "likely-31",
    text: "Who is most likely to sing the loudest during karaoke?",
  },
  {
    id: "likely-32",
    text: "Who is most likely to order extra rice?",
  },
  {
    id: "likely-33",
    text: "Who is most likely to become the group chat admin?",
  },
  {
    id: "likely-34",
    text: "Who is most likely to forget to pay their share?",
  },
  {
    id: "likely-35",
    text: "Who is most likely to fall asleep during a road trip?",
  },
  {
    id: "likely-36",
    text: "Who is most likely to start a food business?",
  },
  {
    id: "likely-37",
    text: "Who is most likely to win a barangay pageant?",
  },
  {
    id: "likely-38",
    text: "Who is most likely to get caught singing in front of a mirror?",
  },
  {
    id: "likely-39",
    text: "Who is most likely to become a reality-show contestant?",
  },
  {
    id: "likely-40",
    text: "Who is most likely to become the strict parent in the future?",
  },
  {
    id: "likely-41",
    text: "Who is most likely to start dancing when a good song plays?",
  },
  {
    id: "likely-42",
    text: "Who is most likely to lose a game but still ask for a rematch?",
  },
  {
    id: "likely-43",
    text: "Who is most likely to become the family favorite?",
  },
  {
    id: "likely-44",
    text: "Who is most likely to be the first one ready for a trip?",
  },
  {
    id: "likely-45",
    text: "Who is most likely to forget a password?",
  },
  {
    id: "likely-46",
    text: "Who is most likely to make a playlist for every situation?",
  },
  {
    id: "likely-47",
    text: "Who is most likely to become a food vlogger?",
  },
  {
    id: "likely-48",
    text: "Who is most likely to make friends with strangers first?",
  },
  {
    id: "likely-49",
    text: "Who is most likely to turn a simple story into a long story?",
  },
  {
    id: "likely-50",
    text: "Who is most likely to win a dance battle?",
  },
];

function getSavedQuestions() {
  try {
    const saved = localStorage.getItem("party-most-likely-questions");

    if (!saved) {
      return starterQuestions;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : starterQuestions;
  } catch {
    return starterQuestions;
  }
}

function makeId() {
  return `likely-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const playerTokenPalettes = [
  "radial-gradient(circle at 35% 27%, #ffb06f 0 12%, #c83a25 44%, #6b0910 100%)",
  "radial-gradient(circle at 35% 27%, #74d5ff 0 12%, #1f83d1 44%, #074686 100%)",
  "radial-gradient(circle at 35% 27%, #ebb1ff 0 12%, #9a4fd1 44%, #471a77 100%)",
  "radial-gradient(circle at 35% 27%, #dbff7f 0 12%, #86b91d 44%, #3e6208 100%)",
  "radial-gradient(circle at 35% 27%, #ffd779 0 12%, #d88412 44%, #7b4303 100%)",
  "radial-gradient(circle at 35% 27%, #7fffe8 0 12%, #12a89d 44%, #075853 100%)",
  "radial-gradient(circle at 35% 27%, #ff9ec1 0 12%, #d83672 44%, #7b0f3c 100%)",
  "radial-gradient(circle at 35% 27%, #ffe57a 0 12%, #d0b21d 44%, #706109 100%)",
];

function getRandomPlayerToken() {
  return playerTokenPalettes[
    Math.floor(Math.random() * playerTokenPalettes.length)
  ];
}

function createPlayer(name, tokenColor = getRandomPlayerToken()) {
  return {
    id: makeId(),
    name,
    tokenColor,
  };
}

export default function MostLikelyTo({ onBack, theme = "casino" }) {
  const [players, setPlayers] = useState(() => [
    createPlayer("Player 1", playerTokenPalettes[0]),
    createPlayer("Player 2", playerTokenPalettes[1]),
    createPlayer("Player 3", playerTokenPalettes[2]),
    createPlayer("Player 4", playerTokenPalettes[3]),
  ]);

  const [playerInput, setPlayerInput] = useState("");
  const [questions, setQuestions] = useState(getSavedQuestions);
  const [questionInput, setQuestionInput] = useState("");
  const [round, setRound] = useState(null);
  const [voterIndex, setVoterIndex] = useState(0);
  const [screen, setScreen] = useState("setup");
  const [votes, setVotes] = useState({});
  const [lastQuestionId, setLastQuestionId] = useState("");
  const [error, setError] = useState("");
  const [resultsAnimationKey, setResultsAnimationKey] = useState(0);
  const audioContextRef = useRef(null);
  const resultSoundTimersRef = useRef([]);

  useEffect(() => {
    localStorage.setItem(
      "party-most-likely-questions",
      JSON.stringify(questions)
    );
  }, [questions]);

  useEffect(() => {
    return () => {
      resultSoundTimersRef.current.forEach((timer) =>
        window.clearTimeout(timer)
      );
    };
  }, []);

  function getAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }

  function playTone(frequency, duration, delay = 0, volume = 0.07) {
    const audioContext = getAudioContext();

    if (!audioContext) return;

    const play = () => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        volume,
        audioContext.currentTime + 0.015
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration + 0.03);
    };

    if (delay > 0) {
      const timer = window.setTimeout(play, delay);
      resultSoundTimersRef.current.push(timer);
      return;
    }

    play();
  }

  function playSoundEffect(type) {
    if (type === "vote") {
      playTone(420, 0.12, 0, 0.055);
      return;
    }

    if (type === "start") {
      playTone(330, 0.12, 0, 0.055);
      playTone(495, 0.14, 120, 0.06);
      return;
    }

    if (type === "result") {
      playTone(392, 0.16, 0, 0.07);
      playTone(523.25, 0.17, 150, 0.075);
      playTone(659.25, 0.22, 310, 0.08);
    }
  }

  const voteResults = useMemo(() => {
    if (!round) return [];

    return round.players
      .map((player) => ({
        player,
        total: votes[player] || 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [round, votes]);

  const highestVotes = voteResults.length > 0 ? voteResults[0].total : 0;

  const winners = voteResults.filter(
    (result) => result.total === highestVotes && highestVotes > 0
  );

  const currentVoter =
    round && voterIndex < round.players.length
      ? round.players[voterIndex]
      : "";

  function addPlayer() {
    const name = playerInput.trim();

    if (!name) return;

    setPlayers((oldPlayers) => [...oldPlayers, createPlayer(name)]);
    setPlayerInput("");
  }

  function updatePlayer(index, value) {
    setPlayers((oldPlayers) =>
      oldPlayers.map((player, playerIndex) =>
        playerIndex === index ? { ...player, name: value } : player
      )
    );
  }

  function removePlayer(index) {
    setPlayers((oldPlayers) =>
      oldPlayers.filter((_, playerIndex) => playerIndex !== index)
    );
  }

  function addQuestion() {
    const text = questionInput.trim();

    if (!text) return;

    setQuestions((oldQuestions) => [
      ...oldQuestions,
      { id: makeId(), text },
    ]);

    setQuestionInput("");
  }

  function addAndStartQuestion() {
    const text = questionInput.trim();

    if (!text) {
      setError("Write a custom question first.");
      return;
    }

    const question = { id: makeId(), text };

    setQuestions((oldQuestions) => [...oldQuestions, question]);
    setQuestionInput("");
    startRound(question);
  }

  function restoreDefaultQuestions() {
    const shouldRestore = window.confirm(
      "Restore the 50 default questions? Your custom questions will be removed."
    );

    if (!shouldRestore) return;

    setQuestions(starterQuestions);
    setLastQuestionId("");
    setError("");
  }

  function startRound(question) {
    const normalizedPlayers = players
      .map((player) => ({
        ...player,
        name: player.name.trim(),
      }))
      .filter((player) => player.name.length > 0);

    const cleanPlayers = normalizedPlayers.map((player) => player.name);

    if (cleanPlayers.length < 3) {
      setError("Add at least 3 players before starting a vote.");
      return;
    }

    if (!question?.text?.trim()) {
      setError("Choose or create a question first.");
      return;
    }

    const emptyVotes = {};

    cleanPlayers.forEach((player) => {
      emptyVotes[player] = 0;
    });

    setPlayers(normalizedPlayers);
    setRound({
      players: cleanPlayers,
      question: question.text,
      questionId: question.id,
    });
    setVotes(emptyVotes);
    setVoterIndex(0);
    setScreen("pass");
    setLastQuestionId(question.id);
    setResultsAnimationKey(0);
    setError("");
    playSoundEffect("start");
  }

  function startRandomRound() {
    if (questions.length === 0) {
      setError("Add at least one question first.");
      return;
    }

    const availableQuestions = questions.filter(
      (question) => question.id !== lastQuestionId
    );

    const questionPool =
      availableQuestions.length > 0 ? availableQuestions : questions;

    const randomQuestion =
      questionPool[Math.floor(Math.random() * questionPool.length)];

    startRound(randomQuestion);
  }

  function recordVote(candidate) {
    setVotes((oldVotes) => ({
      ...oldVotes,
      [candidate]: (oldVotes[candidate] || 0) + 1,
    }));

    playSoundEffect("vote");
    setScreen("recorded");
  }

  function nextVoter() {
    if (!round) return;

    if (voterIndex === round.players.length - 1) {
      setResultsAnimationKey((oldKey) => oldKey + 1);
      playSoundEffect("result");
      setScreen("results");
      return;
    }

    setVoterIndex((oldIndex) => oldIndex + 1);
    setScreen("pass");
  }

  function returnToSetup() {
    setRound(null);
    setVoterIndex(0);
    setVotes({});
    setScreen("setup");
    setError("");
  }

  return (
    <>
      <style>{`
        #most-likely-game,
        #most-likely-game * {
          box-sizing: border-box;
        }

        #most-likely-game {
          --wood-dark: #170702;
          --wood-mid: #4d1a06;
          --wood-light: #8d3b0a;
          --felt: #063d28;
          --felt-deep: #022817;
          --felt-soft: #0a5939;
          --gold-light: #fff0a8;
          --gold: #f5be45;
          --gold-deep: #a45a08;
          --gold-shadow: #4c2203;
          --cream: #fff2c7;
          --muted: #f2d9a4;
          --red: #a70d18;
          --red-dark: #58040a;
          --ink: #241006;
          min-height: 100%;
          color: var(--cream);
          font-family: "Trebuchet MS", "Segoe UI", sans-serif;
        }

        #most-likely-game.likely-carnival-page {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          overflow: hidden;
          padding: clamp(24px, 4vw, 58px) clamp(16px, 4vw, 64px) clamp(42px, 6vw, 82px);
          background-color: var(--wood-dark);
          background-image:
            radial-gradient(ellipse at 50% 5%, rgba(231, 125, 19, 0.28), transparent 34%),
            radial-gradient(ellipse at 50% 105%, rgba(255, 179, 39, 0.12), transparent 44%),
            repeating-linear-gradient(4deg, rgba(255, 183, 66, 0.045) 0 1px, transparent 2px 9px),
            repeating-linear-gradient(91deg, rgba(0, 0, 0, 0.24) 0 2px, transparent 3px 74px),
            linear-gradient(115deg, #160602 0%, #5b2108 48%, #210a03 100%);
        }

        #most-likely-game.likely-carnival-page::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          opacity: 0.46;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(31, 8, 1, 0.84) 0 3px,
              rgba(158, 70, 18, 0.3) 4px 6px,
              rgba(45, 13, 2, 0.55) 7px 14px
            );
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        #most-likely-game.likely-carnival-page::after {
          content: "";
          position: absolute;
          inset: 10px;
          z-index: -1;
          border: 1px solid rgba(255, 189, 69, 0.22);
          box-shadow: inset 0 0 90px rgba(0, 0, 0, 0.72);
          pointer-events: none;
        }

        #most-likely-game .likely-carnival-shell {
          position: relative;
          z-index: 2;
          width: min(100%, 1420px);
          margin: 0 auto;
        }

        #most-likely-game .likely-stage-decor {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        #most-likely-game .likely-stage-decor span {
          position: absolute;
          display: block;
        }

        #most-likely-game .confetti {
          width: 10px;
          height: 18px;
          border-radius: 2px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
          transform: rotate(22deg);
          animation: likely-confetti-float 4.8s ease-in-out infinite;
        }

        #most-likely-game .confetti.one { top: 9%; left: 4%; background: #13b6da; }
        #most-likely-game .confetti.two { top: 17%; right: 5%; background: #f4541a; transform: rotate(-30deg); animation-delay: -1.2s; }
        #most-likely-game .confetti.three { top: 47%; left: 2.4%; background: #ffc41c; transform: rotate(60deg); animation-delay: -2s; }
        #most-likely-game .confetti.four { top: 58%; right: 3.4%; background: #a33ce0; transform: rotate(30deg); animation-delay: -0.8s; }
        #most-likely-game .confetti.five { bottom: 9%; left: 12%; background: #e62c76; transform: rotate(-20deg); animation-delay: -2.8s; }
        #most-likely-game .confetti.six { bottom: 17%; right: 13%; background: #57c63a; transform: rotate(46deg); animation-delay: -1.6s; }

        #most-likely-game .star {
          width: 15px;
          height: 15px;
          background: #ffb422;
          clip-path: polygon(50% 0%, 61% 36%, 100% 50%, 61% 64%, 50% 100%, 39% 64%, 0% 50%, 39% 36%);
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.65));
          animation: likely-star-twinkle 2.8s ease-in-out infinite;
        }

        #most-likely-game .star.one { top: 8%; left: 14%; }
        #most-likely-game .star.two { top: 19%; right: 16%; background: #c266e6; animation-delay: -1s; }
        #most-likely-game .star.three { top: 78%; left: 5%; background: #f66c19; animation-delay: -2.2s; }
        #most-likely-game .star.four { bottom: 8%; right: 6%; background: #178ecb; animation-delay: -1.5s; }

        #most-likely-game .chip {
          width: clamp(48px, 5vw, 72px);
          aspect-ratio: 1;
          border-radius: 50%;
          border: 6px dashed rgba(255, 244, 202, 0.86);
          box-shadow:
            inset 0 0 0 5px rgba(44, 5, 4, 0.52),
            inset 0 0 0 12px rgba(255, 255, 255, 0.08),
            0 9px 12px rgba(0, 0, 0, 0.45);
        }

        #most-likely-game .chip::after {
          content: "";
          position: absolute;
          inset: 15%;
          border-radius: inherit;
          border: 2px solid rgba(255, 255, 255, 0.52);
        }

        #most-likely-game .chip.blue { top: 5%; right: 4%; background: #054f9b; transform: rotate(21deg); }
        #most-likely-game .chip.red { bottom: 4%; left: 2.2%; background: #b6261a; transform: rotate(-14deg); }
        #most-likely-game .chip.red-two { bottom: 3%; right: 3%; background: #ae2115; transform: rotate(18deg); }

        #most-likely-game .back-button.carnival-back {
          position: relative;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          margin: 0 0 18px;
          padding: 10px 16px;
          border: 2px solid var(--gold);
          border-radius: 999px;
          background:
            linear-gradient(180deg, rgba(123, 48, 8, 0.98), rgba(53, 16, 3, 0.98));
          color: var(--cream);
          box-shadow:
            inset 0 1px 0 rgba(255, 247, 191, 0.45),
            0 5px 0 #2a0b01,
            0 9px 18px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          font: 900 0.9rem/1 "Trebuchet MS", sans-serif;
          letter-spacing: 0.02em;
          transition: transform 0.18s ease, filter 0.18s ease;
        }

        #most-likely-game .back-button.carnival-back:hover {
          filter: brightness(1.13);
          transform: translateY(-2px);
        }

        #most-likely-game .likely-game-header {
          display: block;
          min-height: auto;
          margin: 0 auto 12px;
        }

        #most-likely-game .likely-title-stack {
          position: relative;
          z-index: 2;
          display: grid;
          justify-items: start;
          padding-left: clamp(2px, 3vw, 42px);
        }

        #most-likely-game .likely-title-kicker,
        #most-likely-game .rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 2px solid var(--gold);
          border-radius: 999px;
          background:
            linear-gradient(180deg, #72300b, #2c0d02);
          color: #ffe48b;
          box-shadow:
            inset 0 1px 0 rgba(255, 247, 192, 0.55),
            0 3px 0 #421602,
            0 6px 10px rgba(0, 0, 0, 0.28);
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          text-shadow: 0 2px 0 #3b1602;
        }

        #most-likely-game .likely-title-kicker {
          position: relative;
          z-index: 2;
          min-height: 44px;
          padding: 8px 22px;
          margin: 0 0 -3px 31px;
          font-size: clamp(0.74rem, 1.6vw, 1rem);
        }

        #most-likely-game .likely-title-plaque {
          position: relative;
          width: min(100%, 690px);
          padding: clamp(24px, 4vw, 45px) clamp(22px, 5vw, 56px);
          border: 4px solid var(--gold);
          border-radius: 28px 28px 42px 42px;
          background:
            linear-gradient(105deg, rgba(255, 139, 28, 0.18), transparent 26%),
            repeating-linear-gradient(8deg, rgba(255, 210, 90, 0.08) 0 1px, transparent 2px 8px),
            linear-gradient(135deg, #981811, #4d0907 76%);
          box-shadow:
            inset 0 0 0 3px #6b2105,
            inset 0 0 0 6px rgba(255, 228, 131, 0.46),
            0 6px 0 #471301,
            0 17px 28px rgba(0, 0, 0, 0.42);
        }

        #most-likely-game .likely-title-plaque::before,
        #most-likely-game .likely-title-plaque::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 17px;
          height: 17px;
          border: 2px solid #ffeeb0;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #fff6b9 0 9%, #eba52d 35%, #794003 75%);
          box-shadow: 0 2px 0 #5b2601;
          transform: translateY(-50%);
        }

        #most-likely-game .likely-title-plaque::before { left: 17px; }
        #most-likely-game .likely-title-plaque::after { right: 17px; }

        #most-likely-game .likely-title-plaque h2 {
          margin: 0;
          color: #ffe49a;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.55rem, 6.7vw, 6rem);
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.88;
          text-align: center;
          text-shadow:
            0 2px 0 #8e3e04,
            0 5px 0 #5e2002,
            0 8px 12px rgba(0, 0, 0, 0.56);
          transform: skewY(-2deg);
        }

        #most-likely-game .likely-wheel-emblem {
          position: relative;
          justify-self: center;
          width: min(100%, 294px);
          aspect-ratio: 1;
          border: 8px solid #6d3405;
          border-radius: 50%;
          background:
            conic-gradient(
              #d01911 0deg 45deg,
              #0662ad 45deg 90deg,
              #7b2e98 90deg 135deg,
              #f17806 135deg 180deg,
              #c41d13 180deg 225deg,
              #129383 225deg 270deg,
              #f1ad0b 270deg 315deg,
              #b71d11 315deg 360deg
            );
          box-shadow:
            inset 0 0 0 4px #ffdd76,
            inset 0 0 0 10px #984a05,
            0 0 0 4px #d78c16,
            0 0 0 6px #482003,
            0 14px 25px rgba(0, 0, 0, 0.44);
          transform: rotate(-7deg);
        }

        #most-likely-game .likely-wheel-emblem::before {
          content: "";
          position: absolute;
          z-index: 3;
          top: -24px;
          left: 50%;
          width: 48px;
          height: 84px;
          clip-path: polygon(50% 0%, 98% 8%, 61% 97%, 50% 100%, 39% 97%, 2% 8%);
          border-radius: 8px;
          background: linear-gradient(90deg, #cd7e13, #fff0a1 44%, #9a4d07);
          box-shadow: 0 6px 0 #582601, 0 9px 12px rgba(0, 0, 0, 0.4);
          transform: translateX(-50%) rotate(7deg);
        }

        #most-likely-game .likely-wheel-emblem::after {
          content: "";
          position: absolute;
          z-index: 4;
          top: 50%;
          left: 50%;
          width: 66px;
          aspect-ratio: 1;
          border: 4px solid #7b3703;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 27%, #fff1a0 0 8%, #f5b832 30%, #9c4c04 75%);
          box-shadow: 0 3px 0 #552300, 0 7px 13px rgba(0, 0, 0, 0.42);
          transform: translate(-50%, -50%);
        }

        #most-likely-game .wheel-bulbs {
          position: absolute;
          inset: -22px;
          z-index: 4;
          border-radius: 50%;
          background: repeating-conic-gradient(
            from 0deg,
            transparent 0deg 9deg,
            rgba(255, 210, 76, 0.95) 10deg 12deg,
            transparent 13deg 23deg
          );
          filter: drop-shadow(0 0 4px #ffc936);
          mask: radial-gradient(transparent 60%, #000 62% 72%, transparent 73%);
          animation: likely-bulb-pulse 1.8s ease-in-out infinite alternate;
        }

        #most-likely-game .likely-marquee-line {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          height: 22px;
          margin: -8px 6% 26px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 11px 11px, #fffbe1 0 3px, #ffd34e 4px 6px, transparent 7px) 0 0 / 46px 22px repeat-x,
            linear-gradient(180deg, #b55f0c, #562002);
          box-shadow: 0 2px 0 #2c0c01, 0 6px 13px rgba(0, 0, 0, 0.42);
        }

        #most-likely-game .likely-layout {
          display: grid;
          grid-template-columns: minmax(285px, 0.82fr) minmax(0, 1.82fr);
          gap: clamp(22px, 3vw, 40px);
          align-items: stretch;
        }

        #most-likely-game .likely-player-panel,
        #most-likely-game .likely-question-panel,
        #most-likely-game .likely-pass-card,
        #most-likely-game .likely-vote-card,
        #most-likely-game .likely-recorded-card,
        #most-likely-game .likely-results-card {
          position: relative;
          border: 4px solid #a75c09;
          border-radius: 32px;
          background:
            radial-gradient(circle at 16% 8%, rgba(58, 183, 110, 0.16), transparent 30%),
            repeating-linear-gradient(110deg, rgba(255, 255, 255, 0.016) 0 1px, transparent 2px 8px),
            linear-gradient(140deg, #075237 0%, #06301e 52%, #021c10 100%);
          box-shadow:
            inset 0 0 0 2px #ffd772,
            inset 0 0 0 6px rgba(70, 29, 1, 0.86),
            0 0 0 2px #4b1f02,
            0 8px 0 #351100,
            0 18px 28px rgba(0, 0, 0, 0.46);
        }

        #most-likely-game .likely-player-panel::before,
        #most-likely-game .likely-question-panel::before,
        #most-likely-game .likely-pass-card::before,
        #most-likely-game .likely-vote-card::before,
        #most-likely-game .likely-recorded-card::before,
        #most-likely-game .likely-results-card::before {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(255, 228, 124, 0.45);
          border-radius: 22px;
          pointer-events: none;
        }

        #most-likely-game .likely-player-panel,
        #most-likely-game .likely-question-panel {
          min-height: 430px;
          padding: clamp(23px, 3vw, 34px);
        }

        #most-likely-game .likely-player-panel {
          display: flex;
          flex-direction: column;
        }

        #most-likely-game .panel-title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: -4px 0 18px;
        }

        #most-likely-game .panel-star {
          color: #ffda48;
          font-size: 1.8rem;
          line-height: 1;
          filter: drop-shadow(0 2px 0 #784000);
          animation: likely-star-twinkle 2.4s ease-in-out infinite;
        }

        #most-likely-game .likely-player-panel h3,
        #most-likely-game .likely-question-panel h3,
        #most-likely-game .likely-pass-card h3,
        #most-likely-game .likely-vote-card h3,
        #most-likely-game .likely-recorded-card h3,
        #most-likely-game .likely-results-card > h3 {
          margin: 0;
          color: var(--cream);
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 900;
          text-shadow: 0 2px 0 #173315, 0 4px 8px rgba(0, 0, 0, 0.5);
        }

        #most-likely-game .likely-player-panel h3 {
          padding: 7px 25px 9px;
          border: 2px solid var(--gold);
          border-radius: 999px;
          background: linear-gradient(180deg, #76400c, #321401);
          box-shadow: inset 0 1px 0 rgba(255, 250, 190, 0.48), 0 3px 0 #2d1000;
          font-size: clamp(1.65rem, 3vw, 2.2rem);
        }

        #most-likely-game .likely-question-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 12px;
        }

        #most-likely-game .likely-question-heading h3 {
          margin-top: 13px;
          font-size: clamp(1.7rem, 3.4vw, 3rem);
          line-height: 1.05;
        }

        #most-likely-game .eyebrow,
        #most-likely-game .small-text,
        #most-likely-game .anonymous-note,
        #most-likely-game .likely-progress {
          color: var(--muted);
          font-size: 0.97rem;
          font-weight: 700;
          line-height: 1.55;
        }

        #most-likely-game .small-text {
          margin: 0;
        }

        #most-likely-game .rank-badge {
          min-height: 34px;
          padding: 6px 14px;
          font-size: 0.72rem;
        }

        #most-likely-game .add-player-row,
        #most-likely-game .likely-question-actions,
        #most-likely-game .button-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        #most-likely-game .add-player-row {
          margin: 18px 0 14px;
        }

        #most-likely-game .player-list {
          display: grid;
          gap: 10px;
        }

        #most-likely-game .player-edit-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 9px;
        }

        #most-likely-game .player-input-wrap {
          position: relative;
        }

        #most-likely-game .player-token {
          position: absolute;
          z-index: 2;
          top: 50%;
          left: 12px;
          display: grid;
          width: 30px;
          height: 30px;
          place-items: center;
          border: 2px solid rgba(255, 243, 175, 0.58);
          border-radius: 50%;
          color: rgba(255, 251, 218, 0.92);
          background: radial-gradient(circle at 35% 27%, #ffac68 0 12%, #b5241c 44%, #65050a 100%);
          box-shadow: 0 2px 0 #4a0803;
          font-size: 0;
          transform: translateY(-50%);
        }

        #most-likely-game .player-token::before {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: rgba(255, 241, 202, 0.94);
          box-shadow: 0 8px 0 2px rgba(255, 241, 202, 0.94);
        }


        #most-likely-game input,
        #most-likely-game textarea {
          width: 100%;
          border: 2px solid #c7821d;
          border-radius: 12px;
          outline: none;
          background:
            linear-gradient(105deg, rgba(255, 164, 51, 0.08), transparent 30%),
            linear-gradient(180deg, #351304, #1b0802);
          color: #fff3ce;
          box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.66), 0 2px 0 rgba(255, 211, 105, 0.1);
          font: 800 0.96rem/1.35 "Trebuchet MS", sans-serif;
          transition: border-color 0.17s ease, box-shadow 0.17s ease;
        }

        #most-likely-game input {
          min-height: 45px;
          padding: 10px 12px;
        }

        #most-likely-game .player-input-wrap input {
          padding-left: 51px;
        }

        #most-likely-game textarea {
          min-height: 120px;
          padding: 15px 16px;
          resize: vertical;
        }

        #most-likely-game input::placeholder,
        #most-likely-game textarea::placeholder {
          color: rgba(255, 224, 173, 0.54);
        }

        #most-likely-game input:focus,
        #most-likely-game textarea:focus {
          border-color: #ffe07b;
          box-shadow: 0 0 0 3px rgba(255, 185, 45, 0.18), inset 0 1px 5px rgba(0, 0, 0, 0.65);
        }

        #most-likely-game .primary-button,
        #most-likely-game .secondary-button,
        #most-likely-game .delete-button,
        #most-likely-game .candidate-button,
        #most-likely-game .reset-link {
          min-height: 43px;
          border-radius: 13px;
          cursor: pointer;
          font-family: "Trebuchet MS", "Segoe UI", sans-serif;
          font-size: 0.92rem;
          font-weight: 900;
          letter-spacing: 0.01em;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.42);
          transition: transform 0.16s ease, filter 0.16s ease, box-shadow 0.16s ease;
        }

        #most-likely-game .primary-button {
          padding: 10px 17px;
          border: 2px solid #ffb775;
          background:
            linear-gradient(180deg, #da3b32 0%, #a70c15 50%, #630308 100%);
          color: #fff3d1;
          box-shadow:
            inset 0 1px 0 rgba(255, 228, 191, 0.56),
            0 4px 0 #540107,
            0 7px 12px rgba(0, 0, 0, 0.28);
        }

        #most-likely-game .secondary-button,
        #most-likely-game .reset-link {
          padding: 10px 17px;
          border: 2px solid #ffe189;
          background:
            linear-gradient(180deg, #d99320 0%, #a35a07 57%, #693002 100%);
          color: #fff4ce;
          box-shadow:
            inset 0 1px 0 rgba(255, 246, 184, 0.58),
            0 4px 0 #593003,
            0 7px 12px rgba(0, 0, 0, 0.27);
        }

        #most-likely-game .delete-button {
          padding: 10px 12px;
          border: 2px solid #ffaf95;
          background: linear-gradient(180deg, #c72a2b, #85070d 62%, #4d0307);
          color: #fff0e8;
          box-shadow: inset 0 1px 0 rgba(255, 221, 211, 0.42), 0 4px 0 #4f0105;
        }

        #most-likely-game .primary-button:hover,
        #most-likely-game .secondary-button:hover,
        #most-likely-game .delete-button:hover,
        #most-likely-game .candidate-button:hover,
        #most-likely-game .reset-link:hover {
          filter: brightness(1.13) saturate(1.08);
          transform: translateY(-2px);
        }

        #most-likely-game .primary-button:active,
        #most-likely-game .secondary-button:active,
        #most-likely-game .delete-button:active,
        #most-likely-game .candidate-button:active,
        #most-likely-game .reset-link:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #3f1702;
        }

        #most-likely-game .add-question-box {
          display: grid;
          gap: 14px;
          margin: 16px 0 0;
        }

        #most-likely-game .likely-question-actions {
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        #most-likely-game .likely-hidden-question-note {
          position: relative;
          margin: 15px 0 0;
          padding: 14px 16px 14px 22px;
          border: 1px solid rgba(253, 201, 78, 0.28);
          border-left: 4px solid #ffe078;
          border-radius: 0 13px 13px 0;
          background: rgba(74, 129, 45, 0.2);
          color: #f4e6be;
          font-size: 0.94rem;
          font-weight: 700;
          line-height: 1.5;
        }

        #most-likely-game .question-tools {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
        }

        #most-likely-game .question-tools .small-text {
          color: #ffe2a0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1rem;
          font-weight: 900;
        }

        #most-likely-game .reset-link {
          border: 2px solid #ffe18a;
          color: #fff3ce;
          text-decoration: none;
          white-space: nowrap;
        }

        #most-likely-game .form-error {
          margin: 15px 0 0;
          padding: 11px 13px;
          border: 1px solid rgba(255, 172, 143, 0.48);
          border-radius: 11px;
          background: rgba(125, 9, 9, 0.32);
          color: #ffd8ca;
          font-weight: 900;
        }

        #most-likely-game .likely-private-wrapper {
          width: min(100%, 870px);
          margin: 0 auto;
          text-align: center;
        }

        #most-likely-game .likely-progress {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          margin: 0 0 12px;
          padding: 6px 16px;
          border: 1px solid rgba(255, 211, 94, 0.6);
          border-radius: 999px;
          background: rgba(31, 9, 2, 0.86);
          color: #ffe6a0;
          box-shadow: 0 3px 0 #3f1501;
        }

        #most-likely-game .likely-pass-card,
        #most-likely-game .likely-vote-card,
        #most-likely-game .likely-recorded-card,
        #most-likely-game .likely-results-card {
          padding: clamp(28px, 5vw, 54px);
        }

        #most-likely-game .likely-pass-card h3,
        #most-likely-game .likely-recorded-card h3 {
          margin: 18px 0 8px;
          font-size: clamp(1.75rem, 4vw, 2.65rem);
        }

        #most-likely-game .likely-vote-card h3,
        #most-likely-game .likely-results-card > h3 {
          max-width: 720px;
          margin: 18px auto 12px;
          font-size: clamp(1.7rem, 4.8vw, 3.15rem);
          line-height: 1.15;
        }

        #most-likely-game .likely-voter-name,
        #most-likely-game .likely-winner {
          color: #ffe087;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 900;
          text-shadow: 0 3px 0 #502001, 0 5px 10px rgba(0, 0, 0, 0.45);
        }

        #most-likely-game .likely-voter-name {
          margin: 18px 0;
          font-size: clamp(2.25rem, 7vw, 4.55rem);
          overflow-wrap: anywhere;
        }

        #most-likely-game .button-row.center-buttons {
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 25px;
        }

        #most-likely-game .candidate-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 14px;
          margin-top: 26px;
        }

        #most-likely-game .candidate-button {
          min-height: 62px;
          padding: 12px 16px;
          border: 2px solid #d58c21;
          background:
            linear-gradient(120deg, rgba(255, 170, 48, 0.12), transparent 44%),
            linear-gradient(180deg, #4a1906, #210901);
          color: #fff2c6;
          box-shadow: inset 0 1px 0 rgba(255, 222, 152, 0.18), 0 4px 0 #310c01;
          font-size: 1.05rem;
        }

        #most-likely-game .candidate-button:hover {
          border-color: #ffe48b;
          background:
            linear-gradient(180deg, #d99423, #894206);
          color: #fff9de;
        }

        #most-likely-game .likely-winner {
          margin: 22px 0 28px;
          font-size: clamp(1.22rem, 3vw, 1.62rem);
          line-height: 1.45;
        }

        #most-likely-game .result-bars {
          display: grid;
          gap: 15px;
          margin-top: 22px;
          text-align: left;
        }

        #most-likely-game .result-row {
          display: grid;
          gap: 7px;
        }

        #most-likely-game .result-label {
          display: flex;
          justify-content: space-between;
          gap: 13px;
          color: #fff0c7;
          font-weight: 900;
        }

        #most-likely-game .result-track {
          height: 16px;
          overflow: hidden;
          border: 2px solid rgba(255, 209, 90, 0.46);
          border-radius: 999px;
          background: rgba(23, 7, 1, 0.65);
          box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.56);
        }

        #most-likely-game .result-fill {
          height: 100%;
          min-width: 3px;
          border-radius: inherit;
          background: linear-gradient(90deg, #df7212, #ffdb54 56%, #fff3a4);
          box-shadow: 0 0 10px rgba(255, 205, 57, 0.65);
          transition: width 0.45s ease;
        }

        #most-likely-game .anonymous-note {
          margin: 24px 0 0;
          color: #f2d6a1;
        }

        #most-likely-game .likely-results-card {
          overflow: hidden;
          text-align: center;
        }

        #most-likely-game .likely-results-card.results-reveal {
          animation: likely-results-pop 0.64s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        #most-likely-game .likely-results-card.results-reveal .rank-badge {
          animation: likely-badge-drop 0.5s 0.06s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        #most-likely-game .likely-results-card.results-reveal > h3 {
          animation: likely-question-rise 0.55s 0.12s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        #most-likely-game .likely-results-card.results-reveal .likely-winner {
          animation: likely-winner-burst 0.72s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        #most-likely-game .likely-results-card.results-reveal .result-row {
          opacity: 0;
          animation: likely-row-rise 0.48s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        #most-likely-game .likely-results-card.results-reveal .result-fill {
          transform: scaleX(0);
          transform-origin: left center;
          animation: likely-bar-fill 0.76s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        #most-likely-game .likely-confetti {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        #most-likely-game .likely-confetti span {
          position: absolute;
          top: -16px;
          width: 9px;
          height: 18px;
          border-radius: 3px;
          opacity: 0;
          background: var(--gold);
          animation: likely-confetti-fall 1.45s ease-out both;
        }

        #most-likely-game .likely-confetti span:nth-child(1) { left: 4%; background: #ff616c; animation-delay: 0.05s; }
        #most-likely-game .likely-confetti span:nth-child(2) { left: 11%; background: #ffe064; animation-delay: 0.22s; }
        #most-likely-game .likely-confetti span:nth-child(3) { left: 18%; background: #2dd6cc; animation-delay: 0.11s; }
        #most-likely-game .likely-confetti span:nth-child(4) { left: 27%; background: #9a67e2; animation-delay: 0.31s; }
        #most-likely-game .likely-confetti span:nth-child(5) { left: 35%; background: #ffbd46; animation-delay: 0.16s; }
        #most-likely-game .likely-confetti span:nth-child(6) { left: 44%; background: #ff6696; animation-delay: 0.36s; }
        #most-likely-game .likely-confetti span:nth-child(7) { left: 53%; background: #35cbae; animation-delay: 0.09s; }
        #most-likely-game .likely-confetti span:nth-child(8) { left: 62%; background: #ffe064; animation-delay: 0.26s; }
        #most-likely-game .likely-confetti span:nth-child(9) { left: 70%; background: #4d9be4; animation-delay: 0.19s; }
        #most-likely-game .likely-confetti span:nth-child(10) { left: 78%; background: #ff616c; animation-delay: 0.32s; }
        #most-likely-game .likely-confetti span:nth-child(11) { left: 86%; background: #ffbd46; animation-delay: 0.13s; }
        #most-likely-game .likely-confetti span:nth-child(12) { left: 94%; background: #35cbae; animation-delay: 0.28s; }

        @keyframes likely-bulb-pulse {
          from { opacity: 0.58; }
          to { opacity: 1; }
        }

        @keyframes likely-star-twinkle {
          0%, 100% { transform: scale(0.9) rotate(0deg); filter: brightness(0.88) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.65)); }
          50% { transform: scale(1.18) rotate(14deg); filter: brightness(1.3) drop-shadow(0 0 5px rgba(255, 200, 39, 0.7)); }
        }

        @keyframes likely-confetti-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -13px; }
        }

        @keyframes likely-results-pop {
          0% { opacity: 0; transform: translateY(28px) scale(0.94); }
          62% { opacity: 1; transform: translateY(-4px) scale(1.018); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes likely-badge-drop {
          from { opacity: 0; transform: translateY(-14px) scale(0.82); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes likely-question-rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes likely-winner-burst {
          0% { opacity: 0; transform: scale(0.76); filter: brightness(1.6); }
          68% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); filter: brightness(1); }
        }

        @keyframes likely-row-rise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes likely-bar-fill {
          to { transform: scaleX(1); }
        }

        @keyframes likely-confetti-fall {
          0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
          14% { opacity: 0.95; }
          100% { opacity: 0; transform: translateY(410px) rotate(520deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          #most-likely-game *,
          #most-likely-game *::before,
          #most-likely-game *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }

        @media (max-width: 900px) {
          #most-likely-game .likely-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          #most-likely-game.likely-carnival-page {
            padding-inline: 12px;
          }

          #most-likely-game .likely-game-header {
            min-height: 0;
          }

          #most-likely-game .likely-title-stack {
            justify-items: center;
            padding-left: 0;
          }

          #most-likely-game .likely-title-kicker {
            margin-left: 0;
          }

          #most-likely-game .likely-title-plaque {
            border-radius: 22px 22px 32px 32px;
          }

          #most-likely-game .likely-marquee-line {
            margin: 10px 0 22px;
          }

          #most-likely-game .likely-player-panel,
          #most-likely-game .likely-question-panel {
            padding: 23px 18px;
          }

          #most-likely-game .likely-question-heading,
          #most-likely-game .question-tools,
          #most-likely-game .likely-question-actions,
          #most-likely-game .button-row {
            flex-direction: column;
            align-items: stretch;
          }

          #most-likely-game .likely-question-heading > .primary-button,
          #most-likely-game .question-tools > *,
          #most-likely-game .likely-question-actions > *,
          #most-likely-game .button-row > * {
            width: 100%;
          }

          #most-likely-game .candidate-grid {
            grid-template-columns: 1fr;
          }

          #most-likely-game .chip.blue,
          #most-likely-game .chip.red,
          #most-likely-game .chip.red-two {
            opacity: 0.54;
          }
        }

        @media (max-width: 430px) {
          #most-likely-game .add-player-row {
            flex-direction: column;
            align-items: stretch;
          }

          #most-likely-game .player-edit-row {
            grid-template-columns: 1fr;
          }

          #most-likely-game .delete-button {
            width: 100%;
          }

          #most-likely-game .likely-title-plaque h2 {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <section
        id="most-likely-game"
        className="page-section likely-carnival-page"
        data-party-theme={theme}
      >
        <div className="likely-stage-decor" aria-hidden="true">
          <span className="confetti one" />
          <span className="confetti two" />
          <span className="confetti three" />
          <span className="confetti four" />
          <span className="confetti five" />
          <span className="confetti six" />
          <span className="star one" />
          <span className="star two" />
          <span className="star three" />
          <span className="star four" />
          <span className="chip blue" />
          <span className="chip red" />
          <span className="chip red-two" />
        </div>

        <div className="likely-carnival-shell">
          <button className="back-button carnival-back" onClick={onBack}>
            ← Back to Other Games
          </button>

          <header className="likely-game-header">
            <div className="likely-title-stack">
              <span className="likely-title-kicker">★ Playable Game ★</span>

              <div className="likely-title-plaque">
                <h2>Most Likely To</h2>
              </div>
            </div>

          </header>

          <div className="likely-marquee-line" aria-hidden="true" />

          {screen === "setup" && (
            <div className="likely-layout">
              <aside className="likely-player-panel">
                <div className="panel-title-row">
                  <span className="panel-star">★</span>
                  <h3>Players</h3>
                  <span className="panel-star">★</span>
                </div>

                <p className="small-text">
                  Add at least 3 players. Each player votes privately, one at a
                  time.
                </p>

                <div className="add-player-row">
                  <input
                    placeholder="Enter player name"
                    value={playerInput}
                    onChange={(event) => setPlayerInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addPlayer();
                    }}
                  />

                  <button className="primary-button" onClick={addPlayer}>
                    Add
                  </button>
                </div>

                <div className="player-list">
                  {players.map((player, index) => (
                    <div className="player-edit-row" key={player.id}>
                      <div className="player-input-wrap">
                        <span
                          className="player-token"
                          aria-hidden="true"
                          style={{ background: player.tokenColor }}
                        />

                        <input
                          value={player.name}
                          onChange={(event) =>
                            updatePlayer(index, event.target.value)
                          }
                        />
                      </div>

                      <button
                        className="delete-button"
                        onClick={() => removePlayer(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {error && <p className="form-error">{error}</p>}
              </aside>

              <div className="likely-question-panel">
                <div className="likely-question-heading">
                  <div>
                    <span className="rank-badge">
                      ★ Hidden Question Deck ★
                    </span>

                    <h3>Start a Random Question</h3>
                  </div>

                  <button
                    className="primary-button"
                    onClick={startRandomRound}
                  >
                    Start Random Question
                  </button>
                </div>

                <p className="small-text">
                  The question deck is hidden during setup. Random rounds still
                  use every saved question, including your custom additions.
                </p>

                <div className="add-question-box">
                  <textarea
                    placeholder="Write your own Most Likely To question..."
                    value={questionInput}
                    onChange={(event) => setQuestionInput(event.target.value)}
                  />

                  <div className="likely-question-actions">
                    <button className="secondary-button" onClick={addQuestion}>
                      Add to Hidden Deck
                    </button>

                    <button
                      className="primary-button"
                      onClick={addAndStartQuestion}
                    >
                      Add & Start Vote
                    </button>
                  </div>
                </div>

                <p className="likely-hidden-question-note">
                  Questions stay private in the deck. You can add more without
                  showing, editing, or deleting the full question list.
                </p>

                <div className="question-tools">
                  <p className="small-text">
                    {questions.length} question
                    {questions.length === 1 ? "" : "s"} saved
                  </p>

                  <button
                    className="reset-link"
                    onClick={restoreDefaultQuestions}
                  >
                    Restore 50 Default Questions
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === "pass" && round && (
            <div className="likely-private-wrapper">
              <div className="likely-progress">
                Voter {voterIndex + 1} of {round.players.length}
              </div>

              <div className="likely-pass-card">
                <span className="rank-badge">★ Private Vote ★</span>

                <h3>Pass the device to:</h3>

                <p className="likely-voter-name">{currentVoter}</p>

                <p className="small-text">
                  Make sure the other players cannot see the screen.
                </p>

                <div className="button-row center-buttons">
                  <button
                    className="primary-button"
                    onClick={() => setScreen("vote")}
                  >
                    Start My Private Vote
                  </button>

                  <button className="secondary-button" onClick={returnToSetup}>
                    Change Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === "vote" && round && (
            <div className="likely-private-wrapper">
              <div className="likely-progress">
                Voter {voterIndex + 1} of {round.players.length}
              </div>

              <div className="likely-vote-card">
                <span className="rank-badge">★ Vote Privately ★</span>

                <h3>{round.question}</h3>

                <p className="small-text">
                  Select one person. Your vote will not be shown to the group.
                </p>

                <div className="candidate-grid">
                  {round.players
                    .filter((player) => player !== currentVoter)
                    .map((candidate) => (
                      <button
                        className="candidate-button"
                        key={candidate}
                        onClick={() => recordVote(candidate)}
                      >
                        {candidate}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {screen === "recorded" && round && (
            <div className="likely-private-wrapper">
              <div className="likely-recorded-card">
                <span className="rank-badge">★ Vote Recorded ★</span>

                <h3>Your vote is private.</h3>

                <p className="small-text">
                  Do not tell the group who you selected. Pass the device to the
                  next voter.
                </p>

                <div className="button-row center-buttons">
                  <button className="primary-button" onClick={nextVoter}>
                    {voterIndex === round.players.length - 1
                      ? "Show Anonymous Results"
                      : "Pass to Next Voter"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === "results" && round && (
            <div
              className="likely-results-card results-reveal"
              key={`results-${resultsAnimationKey}`}
            >
              <div className="likely-confetti" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>

              <span className="rank-badge">★ Anonymous Results ★</span>

              <h3>{round.question}</h3>

              {winners.length === 1 ? (
                <p className="likely-winner">
                  Most likely to: <strong>{winners[0].player}</strong>
                </p>
              ) : (
                <p className="likely-winner">
                  It is a tie between{" "}
                  <strong>
                    {winners.map((winner) => winner.player).join(" and ")}
                  </strong>
                  .
                </p>
              )}

              <div className="result-bars">
                {voteResults.map((result, index) => (
                  <div
                    className="result-row"
                    key={result.player}
                    style={{ animationDelay: `${260 + index * 105}ms` }}
                  >
                    <div className="result-label">
                      <span>{result.player}</span>
                      <strong>{result.total} vote(s)</strong>
                    </div>

                    <div className="result-track">
                      <div
                        className="result-fill"
                        style={{
                          width: `${
                            (result.total / round.players.length) * 100
                          }%`,
                          animationDelay: `${350 + index * 105}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="anonymous-note">
                Only totals are shown. The app does not reveal who voted for
                whom.
              </p>

              <div className="button-row center-buttons">
                <button className="primary-button" onClick={startRandomRound}>
                  Next Random Question
                </button>

                <button className="secondary-button" onClick={returnToSetup}>
                  Edit Players
                </button>

                <button className="secondary-button" onClick={onBack}>
                  Back to Other Games
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
