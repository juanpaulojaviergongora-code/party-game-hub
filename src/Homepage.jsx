import { useState } from "react";

export default function HomePage({
  onBrowseGames,
  onGoGames,
  onStart,
  onOpenAbout,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("party-music-enabled")) || false;
    } catch {
      return false;
    }
  });
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("party-sound-effects-enabled");
      return saved === null ? true : JSON.parse(saved);
    } catch {
      return true;
    }
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("party-music-volume")) ?? 0.8;
    } catch {
      return 0.8;
    }
  });

  function goToGames() {
    const openGames = onBrowseGames || onGoGames || onStart;

    if (openGames) {
      openGames();
      return;
    }

    window.location.href = "/games";
  }

  function openSettings() {
    setShowSettings((oldValue) => !oldValue);
  }

  function toggleMusic() {
    setMusicEnabled((oldValue) => {
      const nextValue = !oldValue;
      localStorage.setItem("party-music-enabled", JSON.stringify(nextValue));
      return nextValue;
    });
  }

  function toggleSoundEffects() {
    setSoundEffectsEnabled((oldValue) => {
      const nextValue = !oldValue;
      localStorage.setItem(
        "party-sound-effects-enabled",
        JSON.stringify(nextValue)
      );
      return nextValue;
    });
  }

  function updateMusicVolume(value) {
    const nextValue = Number(value);
    setMusicVolume(nextValue);
    localStorage.setItem("party-music-volume", JSON.stringify(nextValue));
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      return;
    }

    document.exitFullscreen?.().catch(() => {});
  }

  function openAbout() {
    if (onOpenAbout) {
      onOpenAbout();
      return;
    }

    window.location.href = "/games?tab=about";
  }

  return (
    <>
      <style>{`
        #home-page.simple-table-home {
          --home-cream: #fff2cb;
          --home-gold: #ffd56c;
          --home-muted: #f4d9af;
          --home-dark: #2b1205;
          --home-red: #b91e29;
          --home-red-dark: #6f0d15;
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          box-sizing: border-box;
          padding: clamp(18px, 3vw, 42px);
          border: 0;
          border-radius: 0;
          color: var(--home-cream);
          background:
            linear-gradient(rgba(42, 14, 3, 0.24), rgba(17, 4, 0, 0.38)),
            url("/party-table-background.png") center center / cover no-repeat;
          box-shadow: inset 0 0 115px rgba(0, 0, 0, 0.54);
        }

        #home-page.simple-table-home::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.28;
          background:
            radial-gradient(circle at 24% 17%, rgba(255,255,255,.18), transparent 18%),
            radial-gradient(circle at 79% 78%, rgba(0,0,0,.35), transparent 32%);
          mix-blend-mode: overlay;
        }

        #home-page .simple-home-header,
        #home-page .simple-home-main,
        #home-page .simple-home-footer {
          position: relative;
          z-index: 2;
        }

        #home-page .simple-home-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        #home-page .simple-home-brand {
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

        #home-page .simple-home-brand small {
          display: block;
          color: var(--home-gold);
          font-size: .72rem;
          font-weight: 1000;
          letter-spacing: .15em;
        }

        #home-page .simple-home-brand h1 {
          margin: 2px 0 0;
          color: #fff1be;
          font-size: clamp(1.7rem, 4.2vw, 3.35rem);
          line-height: .9;
          text-shadow: 3px 3px 0 #1b0c03;
        }

        #home-page .simple-home-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        #home-page .simple-home-button {
          padding: 12px 15px;
          border: 2px solid #fff0ba;
          border-radius: 12px;
          background: rgba(36, 17, 6, .92);
          box-shadow: 0 5px 0 rgba(24, 10, 3, .75);
          color: #fff5d6;
          cursor: pointer;
          font: inherit;
          font-weight: 900;
          transition: transform .18s ease, box-shadow .18s ease;
        }

        #home-page .simple-home-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 0 rgba(24, 10, 3, .66), 0 14px 21px rgba(0,0,0,.22);
        }

        #home-page .simple-home-settings-panel {
          position: relative;
          z-index: 4;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          width: min(100%, 850px);
          margin: 20px auto 0;
          padding: 18px;
          border: 2px solid rgba(255, 221, 138, .55);
          border-radius: 18px;
          background:
            radial-gradient(circle at 87% 10%, rgba(255, 219, 117, .14), transparent 24%),
            linear-gradient(145deg, rgba(89, 41, 13, .97), rgba(37, 13, 4, .98));
          box-shadow: 0 11px 0 rgba(38, 13, 4, .48), 0 21px 29px rgba(0,0,0,.24);
        }

        #home-page .simple-home-settings-copy h3 {
          margin: 0;
          color: #fff0be;
          font-size: 1.1rem;
        }

        #home-page .simple-home-settings-copy p {
          margin: 6px 0 0;
          color: var(--home-muted);
          font-size: .9rem;
          line-height: 1.48;
        }

        #home-page .simple-home-settings-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
        }

        #home-page .simple-setting-control,
        #home-page .simple-fullscreen-control {
          min-height: 39px;
          padding: 8px 11px;
          border: 1px solid rgba(255, 229, 155, .58);
          border-radius: 10px;
          background: rgba(36, 15, 5, .88);
          color: #fff4d5;
          cursor: pointer;
          font: inherit;
          font-weight: 900;
        }

        #home-page .simple-setting-control.active {
          background: linear-gradient(145deg, #b71f2b, #6d0d15);
          border-color: #ffe48e;
        }

        #home-page .simple-volume-control {
          display: flex;
          align-items: center;
          gap: 7px;
          min-height: 39px;
          padding: 0 10px;
          border: 1px solid rgba(255, 229, 155, .42);
          border-radius: 10px;
          color: #ffe9b6;
          font-size: .82rem;
          font-weight: 900;
        }

        #home-page .simple-volume-control input {
          width: 88px;
          accent-color: #ffd56c;
        }

        #home-page .simple-home-main {
          display: grid;
          place-items: center;
          min-height: calc(100vh - 210px);
          padding: 42px 0;
        }

        #home-page .simple-home-panel {
          width: min(100%, 735px);
          padding: clamp(28px, 5vw, 58px);
          border: 3px solid rgba(255, 221, 138, .56);
          border-radius: 28px;
          background:
            radial-gradient(circle at 84% 13%, rgba(255, 220, 125, .15), transparent 23%),
            linear-gradient(145deg, rgba(89, 41, 13, .96), rgba(37, 13, 4, .98));
          box-shadow:
            0 14px 0 rgba(38, 13, 4, .52),
            0 30px 44px rgba(0,0,0,.28),
            inset 0 1px 0 rgba(255,255,255,.1);
          text-align: center;
        }

        #home-page .simple-home-eyebrow {
          margin: 0;
          color: var(--home-gold);
          font-size: .78rem;
          font-weight: 1000;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        #home-page .simple-home-panel h2 {
          margin: 12px 0 0;
          color: var(--home-cream);
          font-size: clamp(2.7rem, 7vw, 5.8rem);
          line-height: .92;
          text-shadow: 4px 4px 0 #321305;
        }

        #home-page .simple-home-copy {
          max-width: 570px;
          margin: 20px auto 0;
          color: var(--home-muted);
          font-size: clamp(1rem, 2.1vw, 1.17rem);
          font-weight: 700;
          line-height: 1.64;
        }

        #home-page .simple-home-play {
          min-width: min(100%, 255px);
          margin-top: 30px;
          padding: 18px 28px;
          border: 3px solid #ffe394;
          border-radius: 15px;
          background: linear-gradient(145deg, #cf2c35, #7c0e18);
          box-shadow:
            0 8px 0 #4a080e,
            0 17px 27px rgba(0,0,0,.27),
            inset 0 1px 0 rgba(255,255,255,.2);
          color: #fff8e5;
          cursor: pointer;
          font: inherit;
          font-size: clamp(1.2rem, 2.7vw, 1.55rem);
          font-weight: 1000;
          letter-spacing: .04em;
          text-shadow: 2px 2px 0 rgba(0,0,0,.28);
          transition: transform .18s ease, box-shadow .18s ease;
        }

        #home-page .simple-home-play:hover {
          transform: translateY(-5px) scale(1.025);
          box-shadow:
            0 12px 0 #4a080e,
            0 25px 31px rgba(0,0,0,.3),
            inset 0 1px 0 rgba(255,255,255,.23);
        }

        #home-page .simple-home-play:active {
          transform: translateY(2px) scale(.99);
          box-shadow:
            0 4px 0 #4a080e,
            0 10px 16px rgba(0,0,0,.26);
        }

        #home-page .simple-home-play small {
          display: block;
          margin-top: 6px;
          color: #ffe6aa;
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        #home-page .simple-home-footer {
          padding-bottom: 10px;
          color: #f4d9af;
          font-size: .85rem;
          font-weight: 800;
          text-align: center;
          text-shadow: 1px 1px 0 #361504;
        }

        @media (max-width: 650px) {
          #home-page.simple-table-home {
            padding: 16px 13px 30px;
          }

          #home-page .simple-home-header {
            align-items: center;
          }

          #home-page .simple-home-brand {
            min-width: 142px;
            padding: 10px 13px 12px;
          }

          #home-page .simple-home-actions {
            gap: 7px;
          }

          #home-page .simple-home-button {
            padding: 9px 10px;
            font-size: .76rem;
          }

          #home-page .simple-home-settings-panel {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          #home-page .simple-home-settings-controls {
            justify-content: flex-start;
          }

          #home-page .simple-home-main {
            min-height: calc(100vh - 160px);
            padding: 30px 0;
          }

          #home-page .simple-home-panel {
            border-radius: 20px;
          }

        }

        @media (max-width: 390px) {
          #home-page .simple-home-brand small {
            font-size: .55rem;
          }

          #home-page .simple-home-brand h1 {
            font-size: 1.55rem;
          }

          #home-page .simple-home-button {
            font-size: .66rem;
          }
        }
      `}</style>

      <section id="home-page" className="page-section simple-table-home">
        <header className="simple-home-header">
          <div className="simple-home-brand">
            <small>PARTY GAME</small>
            <h1>HUB</h1>
          </div>

          <div className="simple-home-actions">
            <button className="simple-home-button" onClick={openSettings}>
              Settings ⚙
            </button>

            <button className="simple-home-button" onClick={openAbout}>
              About
            </button>
          </div>
        </header>

        {showSettings && (
          <section
            className="simple-home-settings-panel"
            aria-label="Party settings"
          >
            <div className="simple-home-settings-copy">
              <h3>Party Settings</h3>
              <p>
                These choices are saved and will also apply when you open the
                game table.
              </p>
            </div>

            <div className="simple-home-settings-controls">
              <button
                className={
                  musicEnabled
                    ? "simple-setting-control active"
                    : "simple-setting-control"
                }
                onClick={toggleMusic}
                aria-pressed={musicEnabled}
              >
                ♫ Music: {musicEnabled ? "On" : "Off"}
              </button>

              <button
                className={
                  soundEffectsEnabled
                    ? "simple-setting-control active"
                    : "simple-setting-control"
                }
                onClick={toggleSoundEffects}
                aria-pressed={soundEffectsEnabled}
              >
                ✦ Effects: {soundEffectsEnabled ? "On" : "Off"}
              </button>

              <label className="simple-volume-control">
                Volume
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={musicVolume}
                  onChange={(event) => updateMusicVolume(event.target.value)}
                  aria-label="Music volume"
                />
                <span>{Math.round(musicVolume * 100)}%</span>
              </label>

              <button
                className="simple-fullscreen-control"
                onClick={toggleFullscreen}
              >
                ⛶ Fullscreen
              </button>
            </div>
          </section>
        )}

        <main className="simple-home-main">
          <div className="simple-home-panel">
            <p className="simple-home-eyebrow">Ready for game night?</p>
            <h2>Pick a Card<br />and Play!</h2>

            <p className="simple-home-copy">
              One phone, your barkada, and a full table of party games. Start
              playing now, then choose your game from the wooden card table.
            </p>

            <button className="simple-home-play" onClick={goToGames}>
              ▶ Play Now
              <small>Open the game table</small>
            </button>
          </div>
        </main>

        <footer className="simple-home-footer">
          Party Game Hub · Pass the phone, play together, and enjoy the night.
        </footer>
      </section>
    </>
  );
}
