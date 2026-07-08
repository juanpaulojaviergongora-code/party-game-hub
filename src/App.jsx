import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import HomePage from "./Homepage.jsx";
import GamesPage from "./pages/GamesPage.jsx";
import "./App.css";

function getCurrentRoute() {
  return `${window.location.pathname}${window.location.search}`;
}

function getSavedTheme() {
  try {
    return JSON.parse(localStorage.getItem("party-theme")) || "casino";
  } catch {
    return "casino";
  }
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);
  const [pageKey, setPageKey] = useState(0);
  const [transitionPhase, setTransitionPhase] = useState("idle");

  const pendingRouteRef = useRef(null);
  const isTransitioningRef = useRef(false);

  function updateRenderedRoute() {
    flushSync(() => {
      setCurrentRoute(getCurrentRoute());
      setPageKey((oldKey) => oldKey + 1);
    });

    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function startNavigation(path) {
    if (isTransitioningRef.current || path === currentRoute) return;

    isTransitioningRef.current = true;
    pendingRouteRef.current = path;
    setTransitionPhase("cover");
  }

  function changeRouteBehindCurtain() {
    const nextPath = pendingRouteRef.current;

    if (!nextPath) {
      setTransitionPhase("reveal");
      return;
    }

    window.history.pushState({}, "", nextPath);
    updateRenderedRoute();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setTransitionPhase("reveal");
      });
    });
  }

  function completeTransition() {
    pendingRouteRef.current = null;
    isTransitioningRef.current = false;
    setTransitionPhase("idle");
  }

  function handleCardAnimationEnd(event) {
    if (event.target !== event.currentTarget) return;

    if (
      transitionPhase === "cover" &&
      event.animationName === "party-silk-card-in"
    ) {
      changeRouteBehindCurtain();
      return;
    }

    if (
      transitionPhase === "reveal" &&
      event.animationName === "party-silk-card-out"
    ) {
      completeTransition();
    }
  }

  useEffect(() => {
    document.body.dataset.partyTheme = getSavedTheme();

    function handleBrowserBackForward() {
      if (isTransitioningRef.current) return;

      isTransitioningRef.current = true;
      pendingRouteRef.current = null;
      updateRenderedRoute();
      setTransitionPhase("reveal");
    }

    window.addEventListener("popstate", handleBrowserBackForward);

    return () => {
      window.removeEventListener("popstate", handleBrowserBackForward);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.partyTheme = getSavedTheme();
  }, [currentRoute]);

  const isGamesRoute =
    currentRoute === "/games" || currentRoute.startsWith("/games?");

  return (
    <>
      <style>{`
        .party-route-shell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
          background: transparent;
        }

        /*
          Fixed background:
          This stays in one place even when a game tab opens,
          content gets longer, or the user scrolls.
        */
        .party-route-shell::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;

          background:
            linear-gradient(
              rgba(42, 14, 3, 0.22),
              rgba(17, 4, 0, 0.34)
            ),
            url("/party-table-background.png");

          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .party-route-page {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          background: transparent !important;
          transform: translate3d(0, 0, 0);
        }

        .party-route-curtain {
          position: fixed;
          inset: 0;
          z-index: 99999;
          overflow: hidden;
          pointer-events: none;
          visibility: hidden;
          contain: paint;
        }

        .party-route-curtain.cover,
        .party-route-curtain.reveal {
          visibility: visible;
        }

        .party-route-wood,
        .party-route-card {
          position: absolute;
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .party-route-wood {
          inset: -11% -16%;
          transform: translate3d(-118%, 0, 0);
          background:
            radial-gradient(
              circle at 17% 25%,
              rgba(255, 236, 167, 0.18),
              transparent 17%
            ),
            radial-gradient(
              circle at 76% 76%,
              rgba(0, 0, 0, 0.26),
              transparent 28%
            ),
            repeating-linear-gradient(
              0deg,
              #934d1e 0,
              #934d1e 3px,
              #6a300e 4px,
              #a75f28 8px
            );
          box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.42);
        }

        .party-route-card {
          top: 50%;
          left: 50%;
          width: min(78vw, 500px);
          aspect-ratio: 1.52 / 1;
          display: grid;
          place-items: center;
          padding: 26px;
          border: 4px solid #ffe7a0;
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 79% 14%,
              rgba(255, 225, 137, 0.18),
              transparent 24%
            ),
            linear-gradient(145deg, #bf2933, #790f18);
          box-shadow:
            0 11px 0 #42060d,
            0 20px 30px rgba(0, 0, 0, 0.27),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          color: #fff2c5;
          text-align: center;
          transform: translate3d(-165%, -50%, 0) scale(0.97);
        }

        .party-route-card span {
          display: block;
          color: #ffe099;
          font-size: clamp(0.7rem, 1.8vw, 0.93rem);
          font-weight: 1000;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .party-route-card strong {
          display: block;
          margin-top: 8px;
          font-size: clamp(2rem, 6vw, 4.1rem);
          line-height: 0.9;
          text-shadow: 3px 3px 0 #4b080d;
        }

        .party-route-card small {
          display: block;
          margin-top: 12px;
          color: #ffe5b4;
          font-size: clamp(0.74rem, 1.7vw, 0.9rem);
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .party-route-curtain.cover .party-route-wood {
          animation: party-silk-wood-in 560ms cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .party-route-curtain.cover .party-route-card {
          animation: party-silk-card-in 560ms cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .party-route-curtain.reveal .party-route-wood {
          transform: translate3d(0, 0, 0);
          animation: party-silk-wood-out 760ms cubic-bezier(.16, 1, .3, 1)
            both;
        }

        .party-route-curtain.reveal .party-route-card {
          transform: translate3d(-50%, -50%, 0) scale(1);
          animation: party-silk-card-out 700ms cubic-bezier(.16, 1, .3, 1)
            both;
        }

        @keyframes party-silk-wood-in {
          from {
            transform: translate3d(-118%, 0, 0);
          }

          to {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes party-silk-card-in {
          from {
            transform: translate3d(-165%, -50%, 0) scale(0.97);
            opacity: 0.92;
          }

          to {
            transform: translate3d(-50%, -50%, 0) scale(1);
            opacity: 1;
          }
        }

        @keyframes party-silk-wood-out {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(118%, 0, 0);
          }
        }

        @keyframes party-silk-card-out {
          from {
            transform: translate3d(-50%, -50%, 0) scale(1);
            opacity: 1;
          }

          to {
            transform: translate3d(145%, -50%, 0) scale(0.98);
            opacity: 0.98;
          }
        }

        @media (max-width: 560px) {
          .party-route-card {
            width: min(86vw, 450px);
            border-width: 4px;
            border-radius: 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .party-route-curtain.cover .party-route-wood,
          .party-route-curtain.cover .party-route-card,
          .party-route-curtain.reveal .party-route-wood,
          .party-route-curtain.reveal .party-route-card {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div
        className={`party-route-shell ${
          transitionPhase === "idle" ? "" : "is-transitioning"
        }`}
      >
        <div
          className={`party-route-curtain ${
            transitionPhase === "idle" ? "" : transitionPhase
          }`}
          aria-hidden="true"
        >
          <div className="party-route-wood" />

          <div
            className="party-route-card"
            onAnimationEnd={handleCardAnimationEnd}
          >
            <div>
              <span>Party Game Hub</span>
              <strong>Next Round!</strong>
              <small>Pass the phone • Play together</small>
            </div>
          </div>
        </div>

        <div key={`${currentRoute}-${pageKey}`} className="party-route-page">
          {isGamesRoute ? (
            <GamesPage onGoHome={() => startNavigation("/")} />
          ) : (
            <HomePage
              onBrowseGames={() => startNavigation("/games")}
              onPlayGame={(gameId) => startNavigation(`/games?game=${gameId}`)}
              onOpenAbout={() => startNavigation("/games?tab=about")}
            />
          )}
        </div>
      </div>
    </>
  );
}