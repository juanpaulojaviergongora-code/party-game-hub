import { useEffect, useMemo, useState } from "react";

const starterRules = [
  {
    id: "ace",
    rank: "A",
    title: "Team Chicks / Team Bros",
    description:
      "Everyone with the same reproductive organ as you drinks or uses your agreed safe alternative.",
  },
  {
    id: "two",
    rank: "2",
    title: "Ikaw ’To, Boss",
    description: "You take a turn, a point, or your group's safe alternative.",
  },
  {
    id: "three",
    rank: "3",
    title: "Count or Consequence",
    description:
      "Players take turns counting. Anyone who says the same or wrong number takes the consequence.",
  },
  {
    id: "four",
    rank: "4",
    title: "Sahig, Bilis!",
    description:
      "Everyone touches the floor. The last player chooses a safe challenge.",
  },
  {
    id: "five",
    rank: "5",
    title: "Tagay Master",
    description:
      "You choose who takes the next turn until another player draws a card.",
  },
  {
    id: "six",
    rank: "6",
    title: "Suki ni Boss",
    description:
      "Choose someone who must call you Boss, Bossing, or Amo until the next card is drawn.",
  },
  {
    id: "seven",
    rank: "7",
    title: "Silent Mode Activated",
    description:
      "You cannot speak until your next card is drawn. Use only gestures or facial expressions.",
  },
  {
    id: "eight",
    rank: "8",
    title: "Last to Dance",
    description:
      "Everyone starts dancing. The last person to dance takes the consequence.",
  },
  {
    id: "nine",
    rank: "9",
    title: "Rhyme",
    description:
      "Say a word. Players take turns saying rhyming words until someone cannot continue.",
  },
  {
    id: "ten",
    rank: "10",
    title: "Category Ka Diyan",
    description:
      "Pick a category such as movies, food, games, or countries. Players take turns naming something in that category.",
  },
  {
    id: "jack",
    rank: "J",
    title: "Bawal Umupo, Soldier",
    description: "Stand until you get to draw a new card.",
  },
  {
    id: "queen",
    rank: "Q",
    title: "Mate",
    description: "Choose a partner. Both of you take the consequence together.",
  },
  {
    id: "king",
    rank: "K",
    title: "King's Cup",
    description:
      "Create one safe rule that everyone must follow until the next King is drawn.",
  },
];

const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["♥", "♦", "♣", "♠"];

function createDeck() {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      id: `${rank}-${suit}`,
      rank,
      suit,
    }))
  );
}

function getSavedRules() {
  try {
    const savedRules = localStorage.getItem("party-rules");
    return savedRules ? JSON.parse(savedRules) : starterRules;
  } catch {
    return starterRules;
  }
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function KingsCup({ onBack, onSound }) {
  const [deck, setDeck] = useState(createDeck);
  const [rules, setRules] = useState(getSavedRules);
  const [currentCard, setCurrentCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipNumber, setFlipNumber] = useState(0);
  const [newRuleTitle, setNewRuleTitle] = useState("");
  const [newRuleDescription, setNewRuleDescription] = useState("");
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    localStorage.setItem("party-rules", JSON.stringify(rules));
  }, [rules]);

  const currentRule = useMemo(
    () => rules.find((rule) => rule.rank === currentCard?.rank),
    [rules, currentCard]
  );

  function drawCard() {
    if (isDrawing || deck.length === 0) return;

    const selectedIndex = Math.floor(Math.random() * deck.length);
    const nextCard = deck[selectedIndex];

    setCurrentCard(nextCard);
    setIsDrawing(true);
    setIsFlipped(true);
    setFlipNumber((oldNumber) => oldNumber + 1);

    // Plays at the exact moment the new card starts turning.
    onSound?.("card");

    window.setTimeout(() => {
      setDeck((oldDeck) =>
        oldDeck.filter((_, index) => index !== selectedIndex)
      );

      if (nextCard.rank === "K") {
        onSound?.("winner");
      }

      setIsDrawing(false);
    }, 1280);
  }

  function resetDeck() {
    setDeck(createDeck());
    setCurrentCard(null);
    setIsDrawing(false);
    setIsFlipped(false);
    setFlipNumber((oldNumber) => oldNumber + 1);
  }

  function updateRule(id, field, value) {
    setRules((oldRules) =>
      oldRules.map((rule) =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  }

  function addHouseRule() {
    const title = newRuleTitle.trim();
    const description = newRuleDescription.trim();

    if (!title || !description) return;

    setRules((oldRules) => [
      ...oldRules,
      {
        id: makeId("house"),
        rank: "House",
        title,
        description,
      },
    ]);

    setNewRuleTitle("");
    setNewRuleDescription("");
  }

  function removeHouseRule(id) {
    setRules((oldRules) =>
      oldRules.filter((rule) => rule.id !== id || rule.rank !== "House")
    );
  }

  function restoreDefaultRules() {
    const shouldRestore = window.confirm(
      "Restore the original Kings Cup rules? Your custom edits will be removed."
    );

    if (!shouldRestore) return;

    setRules(starterRules);
  }

  const isRedSuit =
    currentCard?.suit === "♥" || currentCard?.suit === "♦";

  return (
    <>
      <style>{`
        #kings-cup-game {
          --kc-cream: #fff0c6;
          --kc-gold: #ffd56d;
          --kc-muted: #e5c99f;
          --kc-line: rgba(255, 222, 141, 0.42);
          --kc-panel: rgba(56, 22, 7, 0.79);
          --kc-panel-deep: rgba(31, 10, 3, 0.84);
          width: min(calc(100vw - 32px), 1080px) !important;
          max-width: 1080px !important;
          margin: 0 auto !important;
          padding: clamp(16px, 3vw, 30px) !important;
          border: 1px solid rgba(255, 222, 141, 0.42) !important;
          border-radius: 22px !important;
          background: linear-gradient(145deg, rgba(67, 28, 8, 0.82), rgba(30, 9, 2, 0.88)) !important;
          box-shadow: 0 22px 48px rgba(25, 7, 1, 0.28), inset 0 1px 0 rgba(255,255,255,.09) !important;
          color: var(--kc-cream);
          box-sizing: border-box;
        }

        #kings-cup-game .kings-minimal-header {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255, 222, 141, 0.28);
        }

        #kings-cup-game .back-button {
          margin: 0 !important;
          padding: 9px 12px !important;
          font-size: .82rem !important;
        }

        #kings-cup-game .kings-heading-copy {
          min-width: 0;
        }

        #kings-cup-game .kings-heading-copy .eyebrow {
          margin: 0 0 5px;
          color: var(--kc-gold);
          font-size: .7rem;
          font-weight: 1000;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        #kings-cup-game .kings-heading-copy h2 {
          margin: 0;
          color: var(--kc-cream);
          font-size: clamp(1.6rem, 4vw, 2.5rem);
          line-height: 1;
          text-shadow: 2px 2px 0 rgba(45, 14, 2, .4);
        }

        #kings-cup-game .kings-deck-counter {
          margin: 0;
          padding: 9px 11px;
          border: 1px solid rgba(255, 219, 129, .52);
          border-radius: 999px;
          background: rgba(110, 56, 15, .38);
          color: var(--kc-gold);
          font-size: .78rem;
          font-weight: 1000;
          white-space: nowrap;
        }

        #kings-cup-game .kings-play-area {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 240px;
          gap: 16px;
          margin-top: 18px;
          align-items: stretch;
        }

        #kings-cup-game .kings-card-zone,
        #kings-cup-game .kings-side-note,
        #kings-cup-game .kings-rules-shell {
          border: 1px solid var(--kc-line);
          border-radius: 18px;
          background: linear-gradient(145deg, var(--kc-panel), var(--kc-panel-deep));
          box-shadow: inset 0 1px 0 rgba(255,255,255,.07);
        }

        #kings-cup-game .kings-card-zone {
          min-height: 570px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 22px;
        }

        #kings-cup-game .kings-side-note {
          padding: 20px;
          align-self: stretch;
        }

        #kings-cup-game .kings-side-note h3 {
          margin: 0 0 14px;
          color: var(--kc-cream);
          font-size: 1rem;
        }

        #kings-cup-game .kings-step {
          display: grid;
          grid-template-columns: 25px minmax(0, 1fr);
          gap: 9px;
          align-items: start;
          margin: 0 0 14px;
          color: var(--kc-muted);
          font-size: .88rem;
          line-height: 1.5;
        }

        #kings-cup-game .kings-step:last-child {
          margin-bottom: 0;
        }

        /* Only the number circle is small. The instruction text stays full width. */
        #kings-cup-game .kings-step > span:first-child {
          display: grid;
          place-items: center;
          width: 24px;
          height: 24px;
          border: 1px solid rgba(255, 220, 134, .42);
          border-radius: 50%;
          color: var(--kc-gold);
          font-size: .72rem;
          font-weight: 1000;
        }

        #kings-cup-game .kings-step > span:last-child {
          display: block;
          min-width: 0;
          width: auto;
          height: auto;
          color: var(--kc-muted);
          font-size: inherit;
          font-weight: 700;
          line-height: inherit;
          overflow-wrap: anywhere;
        }

        #kings-cup-game .kings-scene {
          width: min(100%, 390px);
          min-height: 430px;
          perspective: 1200px;
          display: grid;
          place-items: center;
        }

        #kings-cup-game .kings-flip-card {
          width: min(84vw, 310px);
          min-height: 420px;
          perspective: 1500px;
          transform-style: preserve-3d;
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }

        #kings-cup-game .kings-flip-card.is-drawing {
          animation: kings-card-float 1.22s cubic-bezier(0.37, 0, 0.63, 1) both;
        }

        #kings-cup-game .kings-flip-inner {
          position: relative;
          width: 100%;
          min-height: 420px;
          transform-style: preserve-3d;
          transform: translate3d(0, 0, 0) rotateY(0deg);
          will-change: transform;
        }

        #kings-cup-game .kings-flip-inner.is-flipped {
          transform: translate3d(0, 0, 0) rotateY(180deg);
        }

        #kings-cup-game .kings-flip-inner.is-drawing {
          animation: kings-card-turn 1.22s cubic-bezier(0.37, 0, 0.63, 1) both;
        }

        #kings-cup-game .kings-card-face {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border: 10px solid #fff9e8;
          border-radius: 25px;
          box-sizing: border-box;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          box-shadow:
            0 24px 42px rgba(0, 0, 0, 0.28),
            inset 0 0 0 2px rgba(47, 83, 66, 0.1);
        }

        #kings-cup-game .kings-card-front {
          transform: rotateY(180deg);
          background: linear-gradient(145deg, #fffdf2, #eee8d8);
          color: #16382d;
        }

        #kings-cup-game .kings-card-front.red-suit {
          color: #be2341;
        }

        #kings-cup-game .kings-card-back {
          background:
            repeating-linear-gradient(
              45deg,
              rgba(255, 236, 155, 0.1) 0,
              rgba(255, 236, 155, 0.1) 12px,
              transparent 12px,
              transparent 25px
            ),
            radial-gradient(circle at 45% 40%, rgba(255, 211, 108, 0.26), transparent 20%),
            linear-gradient(145deg, #5f132c, #991e42 52%, #360f24);
          color: #fff8df;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        #kings-cup-game .kings-card-back::before,
        #kings-cup-game .kings-card-back::after {
          content: "";
          position: absolute;
          inset: 15px;
          border: 2px solid rgba(255, 229, 142, 0.52);
          border-radius: 17px;
        }

        #kings-cup-game .kings-card-back::after {
          inset: 30px;
          border-style: dashed;
          opacity: 0.72;
        }

        #kings-cup-game .kings-card-back-mark {
          z-index: 1;
          display: grid;
          place-items: center;
          width: 115px;
          height: 115px;
          border: 4px solid rgba(255, 226, 136, 0.82);
          border-radius: 50%;
          color: #ffdf80;
          font-size: 4.4rem;
          font-weight: 1000;
          line-height: 1;
          text-shadow: 0 0 16px rgba(255, 221, 115, 0.44);
        }

        #kings-cup-game .kings-card-back p,
        #kings-cup-game .kings-card-back h3 {
          position: relative;
          z-index: 1;
        }

        #kings-cup-game .kings-card-back h3 {
          margin: 24px 0 7px;
          font-size: 1.75rem;
        }

        #kings-cup-game .kings-card-back p {
          max-width: 220px;
          margin: 0;
          color: #fff1c1;
          line-height: 1.55;
        }

        #kings-cup-game .kings-card-corner {
          position: absolute;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 1.55rem;
          font-weight: 1000;
          line-height: 0.92;
        }

        #kings-cup-game .kings-card-corner.top {
          top: 16px;
          left: 17px;
        }

        #kings-cup-game .kings-card-corner.bottom {
          right: 17px;
          bottom: 16px;
          transform: rotate(180deg);
        }

        #kings-cup-game .kings-card-suit {
          position: absolute;
          top: 51px;
          left: 50%;
          opacity: 0.17;
          transform: translateX(-50%);
          font-size: 8.5rem;
          line-height: 1;
        }

        #kings-cup-game .kings-card-rule {
          position: relative;
          z-index: 1;
          min-height: 420px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 70px 34px 55px;
          text-align: center;
        }

        #kings-cup-game .kings-card-rule-label {
          margin: 0;
          color: #7f6f3f;
          font-size: 0.76rem;
          font-weight: 1000;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        #kings-cup-game .kings-card-rule h3 {
          margin: 12px 0 12px;
          color: inherit;
          font-size: clamp(1.7rem, 4.5vw, 2.35rem);
          line-height: 1.1;
        }

        #kings-cup-game .kings-card-rule p:last-child {
          margin: 0;
          color: #355549;
          font-size: 1rem;
          line-height: 1.58;
        }

        #kings-cup-game .kings-card.red-suit .kings-card-rule p:last-child {
          color: #784053;
        }


        #kings-cup-game .kings-draw-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 9px;
          width: min(100%, 390px);
          margin-top: 16px;
        }

        #kings-cup-game .kings-draw-actions button {
          min-width: 132px;
        }

        #kings-cup-game .kings-empty-deck {
          margin: 11px 0 0;
          color: #ffd0c8;
          font-size: .84rem;
          font-weight: 800;
          text-align: center;
        }

        #kings-cup-game .kings-sound-note {
          margin: 10px 0 0;
          color: rgba(255, 228, 178, .66);
          font-size: .74rem;
          text-align: center;
        }

        #kings-cup-game .kings-rules-shell {
          margin-top: 18px;
          overflow: hidden;
        }

        #kings-cup-game .kings-rules-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 16px 18px;
          border: 0;
          background: transparent;
          color: var(--kc-cream);
          cursor: pointer;
          font: inherit;
          font-weight: 1000;
          text-align: left;
        }

        #kings-cup-game .kings-rules-toggle span {
          color: var(--kc-gold);
          font-size: .78rem;
        }

        #kings-cup-game .kings-rules-content {
          padding: 0 18px 18px;
          border-top: 1px solid rgba(255, 222, 141, .22);
        }

        #kings-cup-game .kings-rules-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 18px 0 14px;
        }

        #kings-cup-game .kings-rules-heading h3 {
          margin: 0;
          color: var(--kc-cream);
          font-size: 1.05rem;
        }

        #kings-cup-game .kings-rules-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        #kings-cup-game .kings-rule-card,
        #kings-cup-game .kings-add-rule {
          border: 1px solid rgba(255, 222, 141, .28);
          border-radius: 13px;
          background: rgba(34, 11, 3, .38);
        }

        #kings-cup-game .kings-rule-card {
          padding: 12px;
        }

        #kings-cup-game .kings-rule-rank {
          display: inline-grid;
          place-items: center;
          min-width: 28px;
          height: 26px;
          margin-bottom: 8px;
          padding: 0 7px;
          border: 1px solid rgba(255, 219, 129, .43);
          border-radius: 8px;
          background: rgba(255, 213, 109, .11);
          color: var(--kc-gold);
          font-size: .74rem;
          font-weight: 1000;
        }

        #kings-cup-game .kings-rule-card input,
        #kings-cup-game .kings-rule-card textarea,
        #kings-cup-game .kings-add-rule input,
        #kings-cup-game .kings-add-rule textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 9px 10px;
          border: 1px solid rgba(255, 229, 158, .32);
          border-radius: 9px;
          background: rgba(24, 8, 2, .48);
          color: var(--kc-cream);
          font: inherit;
        }

        #kings-cup-game .kings-rule-card input,
        #kings-cup-game .kings-add-rule input {
          font-size: .88rem;
          font-weight: 800;
        }

        #kings-cup-game .kings-rule-card textarea,
        #kings-cup-game .kings-add-rule textarea {
          min-height: 78px;
          margin-top: 7px;
          color: var(--kc-muted);
          font-size: .82rem;
          line-height: 1.42;
          resize: vertical;
        }

        #kings-cup-game .kings-rule-actions {
          display: flex;
          margin-top: 9px;
        }

        #kings-cup-game .kings-add-rule {
          margin-top: 12px;
          padding: 14px;
        }

        #kings-cup-game .kings-add-rule h3 {
          margin: 0 0 10px;
          color: var(--kc-cream);
          font-size: 1rem;
        }

        #kings-cup-game .kings-add-rule-grid {
          display: grid;
          grid-template-columns: minmax(0, .85fr) minmax(0, 1.5fr) auto;
          gap: 9px;
          align-items: start;
        }

        @keyframes kings-card-turn {
          from {
            transform: translate3d(0, 0, 0) rotateY(0deg);
          }
          to {
            transform: translate3d(0, 0, 0) rotateY(180deg);
          }
        }

        @keyframes kings-card-float {
          0% {
            transform: translate3d(0, 0, 0);
          }
          36% {
            transform: translate3d(0, -7px, 0);
          }
          64% {
            transform: translate3d(0, -7px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }


        @media (max-width: 820px) {
          #kings-cup-game .kings-play-area {
            grid-template-columns: 1fr;
          }

          #kings-cup-game .kings-side-note {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }

          #kings-cup-game .kings-side-note h3 {
            grid-column: 1 / -1;
            margin-bottom: 0;
          }

          #kings-cup-game .kings-step {
            margin: 0;
          }
        }

        @media (max-width: 660px) {
          #kings-cup-game {
            width: min(calc(100vw - 20px), 1080px) !important;
            padding: 14px !important;
            border-radius: 16px !important;
          }

          #kings-cup-game .kings-minimal-header {
            grid-template-columns: 1fr auto;
          }

          #kings-cup-game .kings-heading-copy {
            grid-column: 1 / -1;
            grid-row: 1;
          }

          #kings-cup-game .back-button {
            grid-column: 1;
            grid-row: 2;
            justify-self: start;
          }

          #kings-cup-game .kings-deck-counter {
            grid-column: 2;
            grid-row: 2;
          }

          #kings-cup-game .kings-card-zone {
            min-height: 500px;
            padding: 16px 10px;
          }

          #kings-cup-game .kings-side-note {
            grid-template-columns: 1fr;
            align-self: start;
          }

          #kings-cup-game .kings-step {
            grid-template-columns: 25px minmax(0, 1fr);
          }

          #kings-cup-game .kings-rules-grid,
          #kings-cup-game .kings-add-rule-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          #kings-cup-game .kings-flip-card,
          #kings-cup-game .kings-flip-inner {
            min-height: 390px;
          }

          #kings-cup-game .kings-card-rule {
            min-height: 390px;
            padding: 66px 26px 48px;
          }

          #kings-cup-game .kings-draw-actions button {
            width: 100%;
          }
        }
      `}</style>

      <section id="kings-cup-game" className="page-section">
        <header className="kings-minimal-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>

          <div className="kings-heading-copy">
            <p className="eyebrow">Deck Game</p>
            <h2>Kings Cup</h2>
          </div>

          <p className="kings-deck-counter">
            {deck.length} card{deck.length === 1 ? "" : "s"} left
          </p>
        </header>

        <div className="kings-play-area">
          <section className="kings-card-zone">
            <div className="kings-scene">
              <div
                className={
                  isDrawing ? "kings-flip-card is-drawing" : "kings-flip-card"
                }
              >
                <div
                  key={flipNumber}
                  className={
                    isFlipped
                      ? `kings-flip-inner is-flipped ${
                          isDrawing ? "is-drawing" : ""
                        }`
                      : "kings-flip-inner"
                  }
                >
                  <div className="kings-card-face kings-card-back">
                    <div className="kings-card-back-mark">♠</div>
                    <h3>Draw a Card</h3>
                    <p>
                      {isDrawing
                        ? "Flipping your next Kings Cup rule..."
                        : "Press Draw Card to reveal a new rule."}
                    </p>
                  </div>

                  <div
                    className={
                      isRedSuit
                        ? "kings-card-face kings-card-front red-suit"
                        : "kings-card-face kings-card-front"
                    }
                  >
                    {currentCard ? (
                      <>
                        <div className="kings-card-corner top">
                          <span>{currentCard.rank}</span>
                          <span>{currentCard.suit}</span>
                        </div>

                        <div className="kings-card-suit">
                          {currentCard.suit}
                        </div>

                        <div className="kings-card-rule">
                          <p className="kings-card-rule-label">
                            King&apos;s Cup Rule
                          </p>
                          <h3>{currentRule?.title || "No rule found"}</h3>
                          <p>
                            {currentRule?.description ||
                              "Add a rule for this rank in the rule editor below."}
                          </p>
                        </div>

                        <div className="kings-card-corner bottom">
                          <span>{currentCard.rank}</span>
                          <span>{currentCard.suit}</span>
                        </div>
                      </>
                    ) : (
                      <div className="kings-card-rule">
                        <p className="kings-card-rule-label">Kings Cup</p>
                        <h3>Ready to Play</h3>
                        <p>Draw a card to reveal the first rule.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="kings-draw-actions">
              <button
                className="primary-button"
                onClick={drawCard}
                disabled={isDrawing || deck.length === 0}
              >
                {isDrawing
                  ? "Flipping..."
                  : deck.length === 0
                    ? "Deck Empty"
                    : "Draw Card"}
              </button>

              <button
                className="secondary-button"
                onClick={resetDeck}
                disabled={isDrawing}
              >
                Reset Deck
              </button>
            </div>

            {deck.length === 0 && (
              <p className="kings-empty-deck">
                Every card has been drawn. Reset the deck for another game.
              </p>
            )}

            <p className="kings-sound-note">
              Draw a card, read the rule, and pass the phone.
            </p>
          </section>

          <aside className="kings-side-note">
            <h3>How to play</h3>

            <p className="kings-step">
              <span>1</span>
              <span>Draw one card to reveal its rule.</span>
            </p>

            <p className="kings-step">
              <span>2</span>
              <span>Do the rule using drinks, points, water, or a safe alternative.</span>
            </p>

            <p className="kings-step">
              <span>3</span>
              <span>Pass the phone to the next player.</span>
            </p>
          </aside>
        </div>

        <section className="kings-rules-shell">
          <button
            className="kings-rules-toggle"
            onClick={() => setShowRules((oldValue) => !oldValue)}
            aria-expanded={showRules}
          >
            <span>Customize rules</span>
            <span>{showRules ? "− Close" : "+ Open"}</span>
          </button>

          {showRules && (
            <div className="kings-rules-content">
              <div className="kings-rules-heading">
                <h3>Kings Cup Rules</h3>

                <button className="reset-link" onClick={restoreDefaultRules}>
                  Restore defaults
                </button>
              </div>

              <div className="kings-rules-grid">
                {rules
                  .filter((rule) => rule.rank !== "House")
                  .map((rule) => (
                    <article className="kings-rule-card" key={rule.id}>
                      <span className="kings-rule-rank">{rule.rank}</span>

                      <input
                        value={rule.title}
                        onChange={(event) =>
                          updateRule(rule.id, "title", event.target.value)
                        }
                        aria-label={`${rule.rank} rule title`}
                      />

                      <textarea
                        value={rule.description}
                        onChange={(event) =>
                          updateRule(rule.id, "description", event.target.value)
                        }
                        aria-label={`${rule.rank} rule description`}
                      />
                    </article>
                  ))}

                {rules
                  .filter((rule) => rule.rank === "House")
                  .map((rule) => (
                    <article className="kings-rule-card" key={rule.id}>
                      <span className="kings-rule-rank">House</span>

                      <input
                        value={rule.title}
                        onChange={(event) =>
                          updateRule(rule.id, "title", event.target.value)
                        }
                        aria-label="House rule title"
                      />

                      <textarea
                        value={rule.description}
                        onChange={(event) =>
                          updateRule(rule.id, "description", event.target.value)
                        }
                        aria-label="House rule description"
                      />

                      <div className="kings-rule-actions">
                        <button
                          className="delete-button"
                          onClick={() => removeHouseRule(rule.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
              </div>

              <section className="kings-add-rule">
                <h3>Add a House Rule</h3>

                <div className="kings-add-rule-grid">
                  <input
                    value={newRuleTitle}
                    onChange={(event) => setNewRuleTitle(event.target.value)}
                    placeholder="Rule title"
                  />

                  <textarea
                    value={newRuleDescription}
                    onChange={(event) =>
                      setNewRuleDescription(event.target.value)
                    }
                    placeholder="What does this rule mean?"
                  />

                  <button className="primary-button" onClick={addHouseRule}>
                    Add Rule
                  </button>
                </div>
              </section>
            </div>
          )}
        </section>
      </section>
    </>
  );
}
