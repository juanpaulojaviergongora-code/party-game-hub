import { useEffect, useState } from "react";

const starterCategories = [
  "Food",
  "Animal",
  "Place",
  "Object",
  "Movie",
  "Filipino Food",
  "Filipino Place",
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function getSavedCategories() {
  try {
    const saved = localStorage.getItem("party-letter-rush-categories");
    return saved ? JSON.parse(saved) : starterCategories;
  } catch {
    return starterCategories;
  }
}

function chooseRandom(items, previousItem = "") {
  const availableItems =
    items.length > 1 ? items.filter((item) => item !== previousItem) : items;

  return availableItems[Math.floor(Math.random() * availableItems.length)];
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function LetterRush({ onBack }) {
  const [categories, setCategories] = useState(getSavedCategories);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [timerLength, setTimerLength] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  const [currentCategory, setCurrentCategory] = useState("");
  const [currentLetter, setCurrentLetter] = useState("");
  const [lastLetter, setLastLetter] = useState("");

  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "party-letter-rush-categories",
      JSON.stringify(categories)
    );
  }, [categories]);

  useEffect(() => {
    if (!isRunning) return undefined;

    if (timeLeft <= 0) {
      setIsRunning(false);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((oldTime) => oldTime - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, timeLeft]);

  function stopRound() {
    setIsRunning(false);
    setCurrentCategory("");
    setCurrentLetter("");
    setTimeLeft(timerLength);
  }

  function selectCategory(category) {
    setSelectedCategory(category);
    stopRound();
    setError("");
  }

  function chooseRandomCategory() {
    const cleanCategories = categories
      .map((category) => category.trim())
      .filter(Boolean);

    if (cleanCategories.length === 0) {
      setError("Add at least one category before choosing a random category.");
      return;
    }

    const nextCategory = chooseRandom(cleanCategories, selectedCategory);
    selectCategory(nextCategory);
  }

  function startNewRound() {
    const cleanCategories = categories
      .map((category) => category.trim())
      .filter(Boolean);

    if (cleanCategories.length === 0) {
      setError("Add at least one category before starting a round.");
      return;
    }

    if (!selectedCategory) {
      setError("Choose a category first, then start the round.");
      return;
    }

    const nextLetter = chooseRandom(alphabet, lastLetter);

    setCurrentCategory(selectedCategory);
    setCurrentLetter(nextLetter);
    setLastLetter(nextLetter);
    setTimeLeft(timerLength);
    setIsRunning(true);
    setError("");
  }

  function changeTimerLength(event) {
    const nextLength = Number(event.target.value);
    setTimerLength(nextLength);

    if (!isRunning) {
      setTimeLeft(nextLength);
    }
  }

  function addCategory() {
    const category = newCategory.trim();

    if (!category) return;

    const alreadyExists = categories.some(
      (item) => item.toLowerCase() === category.toLowerCase()
    );

    if (alreadyExists) {
      setError("That category already exists.");
      return;
    }

    setCategories((oldCategories) => [...oldCategories, category]);
    setNewCategory("");
    setError("");
  }

  function updateCategory(index, value) {
    setCategories((oldCategories) =>
      oldCategories.map((category, categoryIndex) =>
        categoryIndex === index ? value : category
      )
    );

    if (categories[index] === selectedCategory) {
      setSelectedCategory(value);
    }
  }

  function removeCategory(index) {
    const categoryToRemove = categories[index];

    setCategories((oldCategories) =>
      oldCategories.filter((_, categoryIndex) => categoryIndex !== index)
    );

    if (selectedCategory === categoryToRemove) {
      setSelectedCategory("");
      stopRound();
    }
  }

  const hasRound = Boolean(currentCategory && currentLetter);
  const isTimeUp = hasRound && timeLeft === 0;

  const stageTitle = !selectedCategory
    ? "Choose one category"
    : !hasRound
    ? "Ready to start?"
    : isTimeUp
    ? "Time is up!"
    : currentCategory;

  const stageCopy = !selectedCategory
    ? "That category will stay the same until you decide to change it."
    : !hasRound
    ? `Your category is ${selectedCategory}. Press Start Round when everyone is ready.`
    : isTimeUp
    ? "Pass the phone and start another letter."
    : "Say an answer that starts with the letter below.";

  return (
    <>
      <style>{`
        #letter-rush-game {
          --lr-cream: #fff0c2;
          --lr-gold: #ffd36c;
          --lr-muted: #efd5a7;
          --lr-line: rgba(255, 222, 143, 0.48);
          --lr-line-soft: rgba(255, 222, 143, 0.28);
          --lr-panel: rgba(98, 43, 13, 0.84);
          --lr-panel-deep: rgba(54, 18, 5, 0.93);
          width: min(100%, 1120px) !important;
          max-width: 1120px !important;
          margin: 0 auto !important;
          padding: clamp(18px, 3vw, 30px) !important;
          border: 1px solid var(--lr-line) !important;
          border-radius: 24px !important;
          background:
            linear-gradient(145deg, rgba(72, 29, 9, 0.80), rgba(35, 10, 3, 0.88)) !important;
          box-shadow:
            0 20px 48px rgba(23, 6, 1, 0.30),
            inset 0 1px 0 rgba(255, 242, 203, 0.09) !important;
          color: var(--lr-cream);
          box-sizing: border-box;
        }

        #letter-rush-game .back-button {
          margin: 0 0 24px;
        }

        #letter-rush-game .section-heading {
          margin: 0 0 20px;
        }

        #letter-rush-game .section-heading .eyebrow {
          margin: 0 0 6px;
          color: var(--lr-gold);
          font-size: 0.70rem;
          font-weight: 1000;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        #letter-rush-game .section-heading h2 {
          margin: 0;
          color: var(--lr-cream);
          font-size: clamp(1.6rem, 3.4vw, 2.35rem);
          line-height: 1.05;
          text-shadow: 2px 2px 0 rgba(41, 12, 2, 0.42);
        }

        #letter-rush-game .letter-rush-layout {
          display: grid;
          grid-template-columns: 315px minmax(0, 1fr);
          gap: 22px;
          align-items: stretch;
        }

        #letter-rush-game .letter-rush-panel,
        #letter-rush-game .letter-rush-board,
        #letter-rush-game .category-editor-card {
          border: 1px solid var(--lr-line);
          border-radius: 20px;
          background:
            linear-gradient(145deg, var(--lr-panel), var(--lr-panel-deep));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.07),
            0 10px 24px rgba(24, 6, 1, 0.13);
        }

        #letter-rush-game .letter-rush-panel {
          padding: 22px;
        }

        #letter-rush-game .letter-rush-panel h3,
        #letter-rush-game .category-editor-card h3 {
          margin: 0;
          color: var(--lr-cream);
          font-size: 1.28rem;
        }

        #letter-rush-game .letter-rush-panel h3::before {
          content: "✦";
          display: inline-grid;
          place-items: center;
          width: 28px;
          height: 28px;
          margin-right: 9px;
          border: 1px solid rgba(255, 220, 134, 0.45);
          border-radius: 50%;
          color: var(--lr-gold);
          font-size: 0.86rem;
          vertical-align: 2px;
        }

        #letter-rush-game .small-text {
          margin: 15px 0 0;
          color: var(--lr-muted);
          font-size: 0.92rem;
          line-height: 1.55;
        }

        #letter-rush-game .setting-label {
          display: block;
          margin: 23px 0 9px;
          color: var(--lr-gold);
          font-size: 0.88rem;
          font-weight: 900;
        }

        #letter-rush-game .setting-label.timer-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 20px;
          border-top: 1px solid var(--lr-line-soft);
        }

        #letter-rush-game .setting-label.timer-label::before {
          content: "◷";
          color: var(--lr-gold);
          font-size: 1.1rem;
        }

        #letter-rush-game select,
        #letter-rush-game input,
        #letter-rush-game textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(255, 222, 143, 0.50);
          border-radius: 10px;
          background: rgba(26, 8, 2, 0.55);
          color: var(--lr-cream);
          font: inherit;
        }

        #letter-rush-game select,
        #letter-rush-game input {
          min-height: 47px;
          padding: 0 12px;
        }

        #letter-rush-game textarea {
          min-height: 88px;
          padding: 10px 12px;
          color: var(--lr-muted);
          resize: vertical;
        }

        #letter-rush-game select:focus,
        #letter-rush-game input:focus,
        #letter-rush-game textarea:focus {
          outline: 2px solid rgba(255, 211, 108, 0.45);
          outline-offset: 2px;
        }

        #letter-rush-game .random-category-button,
        #letter-rush-game .letter-rush-panel .primary-button,
        #letter-rush-game .letter-rush-panel .secondary-button,
        #letter-rush-game .letter-rush-board .primary-button,
        #letter-rush-game .letter-rush-board .secondary-button,
        #letter-rush-game .category-editor-card .primary-button,
        #letter-rush-game .category-editor-card .delete-button {
          width: 100%;
          min-height: 47px;
          margin-top: 13px;
          border: 1px solid rgba(255, 225, 151, 0.64);
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-weight: 1000;
          letter-spacing: 0.015em;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        #letter-rush-game .random-category-button,
        #letter-rush-game .letter-rush-panel .secondary-button,
        #letter-rush-game .letter-rush-board .secondary-button {
          background: linear-gradient(145deg, #84501a, #3e1d08);
          color: #fff0c2;
          box-shadow: 0 5px 0 rgba(38, 13, 4, 0.58);
        }

        #letter-rush-game .letter-rush-panel .primary-button,
        #letter-rush-game .letter-rush-board .primary-button,
        #letter-rush-game .category-editor-card .primary-button {
          background: linear-gradient(145deg, #c42a33, #710d16);
          color: #fff6df;
          box-shadow: 0 5px 0 rgba(67, 6, 12, 0.62);
        }

        #letter-rush-game .category-editor-card .delete-button {
          width: auto;
          min-width: 94px;
          margin: 0;
          background: linear-gradient(145deg, #8a221f, #4f0b0b);
          color: #fff0dd;
          box-shadow: 0 4px 0 rgba(48, 5, 5, 0.55);
        }

        #letter-rush-game button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        #letter-rush-game button:active:not(:disabled) {
          transform: translateY(1px);
        }

        #letter-rush-game button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        #letter-rush-game .random-category-button::before {
          content: "◈";
          margin-right: 8px;
          color: var(--lr-gold);
        }

        #letter-rush-game .letter-rush-panel .button-row {
          display: grid;
          gap: 10px;
        }

        #letter-rush-game .letter-rush-panel .reset-link {
          display: inline-block;
          width: 100%;
          margin-top: 14px !important;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--lr-gold);
          cursor: pointer;
          font: inherit;
          font-size: 0.80rem;
          font-weight: 900;
          text-align: left;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        #letter-rush-game .form-error {
          margin: 13px 0 0;
          color: #ffd0c8;
          font-size: 0.84rem;
          font-weight: 800;
          line-height: 1.45;
        }

        #letter-rush-game .letter-rush-board {
          position: relative;
          min-height: 520px;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 28px;
          text-align: center;
        }

        #letter-rush-game .letter-rush-board::before,
        #letter-rush-game .letter-rush-board::after {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: rgba(255, 214, 107, 0.84);
          pointer-events: none;
        }

        #letter-rush-game .letter-rush-board::before {
          top: 18px;
          left: 18px;
          border-top: 2px solid;
          border-left: 2px solid;
          border-radius: 7px 0 0 0;
        }

        #letter-rush-game .letter-rush-board::after {
          right: 18px;
          bottom: 18px;
          border-right: 2px solid;
          border-bottom: 2px solid;
          border-radius: 0 0 7px 0;
        }

        #letter-rush-game .board-content {
          position: relative;
          z-index: 1;
          width: min(100%, 650px);
        }

        #letter-rush-game .board-step {
          display: inline-block;
          margin: 0 0 18px;
          padding: 9px 17px;
          border: 1px solid rgba(255, 219, 125, 0.66);
          border-radius: 999px;
          background: rgba(83, 35, 9, 0.64);
          color: var(--lr-gold);
          font-size: 0.78rem;
          font-weight: 1000;
          letter-spacing: 0.14em;
        }

        #letter-rush-game .board-title {
          margin: 0;
          color: var(--lr-cream);
          font-size: clamp(2.1rem, 5.2vw, 4.3rem);
          line-height: 1;
          text-shadow: 3px 3px 0 rgba(45, 13, 2, 0.44);
        }

        #letter-rush-game .board-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 20px auto;
          color: var(--lr-gold);
        }

        #letter-rush-game .board-divider::before,
        #letter-rush-game .board-divider::after {
          content: "";
          width: 55px;
          border-top: 1px solid rgba(255, 214, 107, 0.48);
        }

        #letter-rush-game .board-copy {
          max-width: 560px;
          margin: 0 auto;
          color: var(--lr-muted);
          font-size: 1rem;
          line-height: 1.58;
        }

        #letter-rush-game .round-status {
          margin: 0 0 10px;
          color: var(--lr-gold);
          font-size: 0.76rem;
          font-weight: 1000;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        #letter-rush-game .round-category {
          margin: 0;
          color: var(--lr-cream);
          font-size: clamp(1.75rem, 4vw, 3.2rem);
          line-height: 1.08;
        }

        #letter-rush-game .letter-display {
          margin: 22px 0 0;
          color: var(--lr-gold);
          font-size: clamp(6.5rem, 20vw, 13.5rem);
          font-weight: 1000;
          line-height: 0.75;
          text-shadow: 4px 4px 0 rgba(58, 16, 2, 0.42);
        }

        #letter-rush-game .timer-display {
          margin: 27px 0 0;
          color: var(--lr-cream);
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 1000;
          line-height: 1;
        }

        #letter-rush-game .timer-display.time-up {
          color: #ffaaa2;
        }

        #letter-rush-game .center-buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 23px;
        }

        #letter-rush-game .center-buttons button {
          width: auto;
          min-width: 145px;
          margin-top: 0;
          padding: 0 16px;
        }

        #letter-rush-game .category-editor-card {
          margin-top: 22px;
          padding: 22px;
        }

        #letter-rush-game .category-editor-card .small-text {
          margin-top: 8px;
        }

        #letter-rush-game .add-category-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
          margin-top: 16px;
        }

        #letter-rush-game .add-category-row .primary-button {
          width: auto;
          min-width: 142px;
          margin: 0;
          padding: 0 16px;
        }

        #letter-rush-game .category-list {
          display: grid;
          gap: 10px;
          margin-top: 16px;
        }

        #letter-rush-game .category-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 9px;
          align-items: center;
        }

        @media (max-width: 850px) {
          #letter-rush-game .letter-rush-layout {
            grid-template-columns: 1fr;
          }

          #letter-rush-game .letter-rush-board {
            min-height: 420px;
          }
        }

        @media (max-width: 560px) {
          #letter-rush-game {
            width: min(calc(100vw - 20px), 1120px) !important;
            padding: 14px !important;
            border-radius: 17px !important;
          }

          #letter-rush-game .letter-rush-panel,
          #letter-rush-game .letter-rush-board,
          #letter-rush-game .category-editor-card {
            border-radius: 16px;
          }

          #letter-rush-game .letter-rush-panel,
          #letter-rush-game .category-editor-card {
            padding: 17px;
          }

          #letter-rush-game .letter-rush-board {
            min-height: 390px;
            padding: 22px 16px;
          }

          #letter-rush-game .board-title {
            font-size: clamp(1.9rem, 10vw, 3rem);
          }

          #letter-rush-game .add-category-row,
          #letter-rush-game .category-row {
            grid-template-columns: 1fr;
          }

          #letter-rush-game .add-category-row .primary-button,
          #letter-rush-game .category-editor-card .delete-button {
            width: 100%;
            margin: 0;
          }

          #letter-rush-game .center-buttons {
            display: grid;
          }

          #letter-rush-game .center-buttons button {
            width: 100%;
          }
        }

        /* Final warm wood overrides: removes all green tones from Letter Rush. */
        #letter-rush-game .letter-rush-panel,
        #letter-rush-game .letter-rush-board,
        #letter-rush-game .category-editor-card {
          background:
            radial-gradient(circle at 82% 10%, rgba(255, 210, 108, 0.11), transparent 24%),
            linear-gradient(145deg, rgba(109, 48, 15, 0.94), rgba(57, 18, 5, 0.97)) !important;
          border-color: rgba(255, 213, 111, 0.54) !important;
        }

        #letter-rush-game .letter-rush-board {
          background:
            radial-gradient(circle at 50% 30%, rgba(255, 214, 117, 0.10), transparent 25%),
            linear-gradient(145deg, rgba(91, 35, 10, 0.96), rgba(42, 12, 3, 0.98)) !important;
        }

        #letter-rush-game select,
        #letter-rush-game input,
        #letter-rush-game textarea {
          background: rgba(47, 14, 3, 0.82) !important;
          border-color: rgba(255, 207, 104, 0.58) !important;
        }

        #letter-rush-game .board-title,
        #letter-rush-game .round-category,
        #letter-rush-game .letter-display,
        #letter-rush-game .timer-display {
          color: #ffe087 !important;
        }

        #letter-rush-game .small-text,
        #letter-rush-game .board-copy {
          color: #f1d4a1 !important;
        }

      `}</style>

      <section id="letter-rush-game" className="page-section">
        <button className="back-button" onClick={onBack}>
          ← Back to Other Games
        </button>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Playable Game</p>
            <h2>Letter Rush</h2>
          </div>
        </div>

        <div className="letter-rush-layout">
          <aside className="letter-rush-panel">
            <h3>Round Settings</h3>

            <p className="small-text">
              Choose one category, then keep that category while every new
              round gives you a different letter.
            </p>

            <label className="setting-label" htmlFor="letter-rush-category">
              Category for this session
            </label>

            <select
              id="letter-rush-category"
              value={selectedCategory}
              onChange={(event) => selectCategory(event.target.value)}
            >
              <option value="">Choose a category</option>
              {categories
                .map((category) => category.trim())
                .filter(Boolean)
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>

            <button
              className="random-category-button"
              onClick={chooseRandomCategory}
            >
              Random Category
            </button>

            <label className="setting-label timer-label" htmlFor="letter-rush-timer">
              Timer length
            </label>

            <select
              id="letter-rush-timer"
              value={timerLength}
              onChange={changeTimerLength}
            >
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="45">45 seconds</option>
              <option value="60">1 minute</option>
              <option value="90">1 minute 30 seconds</option>
            </select>

            <div className="button-row">
              <button className="primary-button" onClick={startNewRound}>
                {hasRound ? "New Round" : "▶ Start Round"}
              </button>

              {hasRound && (
                <>
                  <button
                    className="secondary-button"
                    onClick={() => setIsRunning((oldValue) => !oldValue)}
                    disabled={isTimeUp}
                  >
                    {isRunning ? "Pause Timer" : "Resume Timer"}
                  </button>

                  <button className="reset-link" onClick={stopRound}>
                    End Current Session
                  </button>
                </>
              )}
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
              className="secondary-button"
              onClick={() => setShowCategoryEditor((oldValue) => !oldValue)}
            >
              {showCategoryEditor ? "Hide Categories" : "Edit Categories"}
            </button>
          </aside>

          <section className="letter-rush-board">
            <div className="board-content">
              {!hasRound ? (
                <>
                  <p className="board-step">
                    {!selectedCategory ? "STEP 1" : "STEP 2"}
                  </p>
                  <h3 className="board-title">{stageTitle}</h3>
                  <div className="board-divider">✦</div>
                  <p className="board-copy">{stageCopy}</p>
                </>
              ) : (
                <>
                  <p className="round-status">
                    {isTimeUp
                      ? "Round Complete"
                      : isRunning
                      ? "Round In Progress"
                      : "Timer Paused"}
                  </p>

                  <p className="board-step">
                    {isTimeUp ? "NEXT ROUND" : "CATEGORY"}
                  </p>

                  <h3 className="round-category">
                    {isTimeUp ? "Great round!" : currentCategory}
                  </h3>

                  <div className="board-divider">✦</div>

                  <p className="round-status">{isTimeUp ? "READY?" : "LETTER"}</p>

                  <div className="letter-display">
                    {isTimeUp ? "!" : currentLetter}
                  </div>

                  <div
                    className={
                      isTimeUp ? "timer-display time-up" : "timer-display"
                    }
                  >
                    {isTimeUp ? "0:00" : formatTime(timeLeft)}
                  </div>

                  <div className="center-buttons">
                    <button className="primary-button" onClick={startNewRound}>
                      New Round
                    </button>

                    {!isTimeUp && (
                      <button
                        className="secondary-button"
                        onClick={() => setIsRunning((oldValue) => !oldValue)}
                      >
                        {isRunning ? "Pause Timer" : "Resume Timer"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {showCategoryEditor && (
          <section className="category-editor-card">
            <h3>Edit Categories</h3>

            <p className="small-text">
              Your categories are saved only in this browser.
            </p>

            <div className="add-category-row">
              <input
                placeholder="Example: Filipino Celebrity"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addCategory();
                }}
              />

              <button className="primary-button" onClick={addCategory}>
                Add Category
              </button>
            </div>

            <div className="category-list">
              {categories.map((category, index) => (
                <div className="category-row" key={`${category}-${index}`}>
                  <input
                    value={category}
                    onChange={(event) =>
                      updateCategory(index, event.target.value)
                    }
                  />

                  <button
                    className="delete-button"
                    onClick={() => removeCategory(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </>
  );
}
