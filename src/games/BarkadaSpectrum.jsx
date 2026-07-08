import { useMemo, useState } from "react";

const spectrumCards = [
  { id: "s1", category: "Barkada", left: "Boring", right: "Exciting" },
  { id: "s2", category: "Food", left: "Cheap", right: "Expensive" },
  { id: "s3", category: "Barkada", left: "Chill weekend", right: "Wild weekend" },
  { id: "s4", category: "Music", left: "Bad karaoke song", right: "Great karaoke song" },
  { id: "s5", category: "Travel", left: "Easy to pack for", right: "Hard to pack for" },
  { id: "s6", category: "Funny", left: "Awkward", right: "Smooth" },
  { id: "s7", category: "Food", left: "Snack", right: "Full meal" },
  { id: "s8", category: "Barkada", left: "Quiet group chat", right: "Chaotic group chat" },
  { id: "s9", category: "Movies", left: "Bad movie night choice", right: "Perfect movie night choice" },
  { id: "s10", category: "Travel", left: "Stay indoors", right: "Go outside" },
  { id: "s11", category: "School / Work", left: "Easy deadline", right: "Stressful deadline" },
  { id: "s12", category: "Barkada", left: "Bad road-trip seat", right: "Best road-trip seat" },
  { id: "s13", category: "Food", left: "Not spicy", right: "Very spicy" },
  { id: "s14", category: "Funny", left: "Normal", right: "Very weird" },
  { id: "s15", category: "Music", left: "Listen quietly", right: "Sing at full volume" },
  { id: "s16", category: "Barkada", left: "Early arrival", right: "Late arrival" },
  { id: "s17", category: "Travel", left: "Budget trip", right: "Luxury trip" },
  { id: "s18", category: "Food", left: "Easy to cook", right: "Hard to cook" },
  { id: "s19", category: "Movies", left: "Predictable", right: "Mind-blowing" },
  { id: "s20", category: "Barkada", left: "Reliable planner", right: "Spontaneous planner" },
  { id: "s21", category: "Funny", left: "Small reaction", right: "Over-the-top reaction" },
  { id: "s22", category: "School / Work", left: "Helpful teammate", right: "Disappears before deadline" },
  { id: "s23", category: "Food", left: "Breakfast", right: "Midnight snack" },
  { id: "s24", category: "Barkada", left: "One selfie", right: "Fifty selfies" },
  { id: "s25", category: "Music", left: "Sad song", right: "Party song" },
  { id: "s26", category: "Travel", left: "Beach day", right: "Mountain day" },
  { id: "s27", category: "Funny", left: "Mildly embarrassing", right: "Extremely embarrassing" },
  { id: "s28", category: "Food", left: "Home-cooked", right: "Restaurant food" },
  { id: "s29", category: "Barkada", left: "Good party host", right: "Great party guest" },
  { id: "s30", category: "Movies", left: "Watch once", right: "Watch again and again" },
  { id: "s31", category: "Barkada", left: "Low-energy friend", right: "Life of the party" },
  { id: "s32", category: "Funny", left: "Whisper", right: "Shout" },
  { id: "s33", category: "Food", left: "Sweet", right: "Salty" },
  { id: "s34", category: "Travel", left: "Short trip", right: "Long trip" },
  { id: "s35", category: "School / Work", left: "Easy presentation", right: "Scary presentation" },
  { id: "s36", category: "Music", left: "Old-school hit", right: "New release" },
  { id: "s37", category: "Barkada", left: "Always planned", right: "Always spontaneous" },
  { id: "s38", category: "Funny", left: "Bad excuse", right: "Believable excuse" },
  { id: "s39", category: "Food", left: "One bite", right: "Second serving" },
  { id: "s40", category: "Movies", left: "Comedy", right: "Action" },
  { id: "s41", category: "Tagalog", left: "Keri lang", right: "Sobrang hirap" },
  { id: "s42", category: "Tagalog", left: "Tahimik lang", right: "Madaldal talaga" },
  { id: "s43", category: "Tagalog", left: "Porma lang", right: "May substance" },
  { id: "s44", category: "Tagalog", left: "Petiks", right: "Puyat at pagod" },
  { id: "s45", category: "Tagalog", left: "Kuripot", right: "Mapagbigay" },
  { id: "s46", category: "Tagalog", left: "Mahiyain", right: "Palaban" },
  { id: "s47", category: "Tagalog", left: "Simple lang", right: "Bongga" },
  { id: "s48", category: "Tagalog", left: "Kalmado", right: "Praning" },
  { id: "s49", category: "Tagalog", left: "Sakto lang", right: "OA" },
  { id: "s50", category: "Tagalog", left: "Tamad bumangon", right: "Laging game gumala" },
  { id: "s51", category: "Tagalog", left: "Laging may baon", right: "Laging umuutang" },
  { id: "s52", category: "Tagalog", left: "Uwi agad", right: "Last man standing" },
  { id: "s53", category: "Tagalog", left: "Bahala na", right: "Planado lahat" },
  { id: "s54", category: "Tagalog", left: "Mabilis ma-fall", right: "Walang pake" },
  { id: "s55", category: "Tagalog", left: "Pang-masa", right: "Sosyal" },
  { id: "s56", category: "Gen Z", left: "Lowkey", right: "Main character energy" },
  { id: "s57", category: "Gen Z", left: "Dry reply", right: "Novel-length reply" },
  { id: "s58", category: "Gen Z", left: "Delulu", right: "Realistic" },
  { id: "s59", category: "Gen Z", left: "Soft launch", right: "Hard launch" },
  { id: "s60", category: "Gen Z", left: "Seen zone", right: "Instant reply" },
  { id: "s61", category: "Gen Z", left: "Quiet luxury", right: "Full flex" },
  { id: "s62", category: "Gen Z", left: "Touch grass", right: "Chronically online" },
  { id: "s63", category: "Gen Z", left: "NPC energy", right: "Main character energy" },
  { id: "s64", category: "Gen Z", left: "Aura loss", right: "Aura gain" },
  { id: "s65", category: "Gen Z", left: "Casual selfie", right: "Full photoshoot" },
  { id: "s66", category: "Gen Z", left: "No cap", right: "Big cap" },
  { id: "s67", category: "Gen Z", left: "Unbothered", right: "Very invested" },
  { id: "s68", category: "Gen Z", left: "Situationship", right: "Official relationship" },
  { id: "s69", category: "Gen Z", left: "One-word caption", right: "Long emotional caption" },
  { id: "s70", category: "Gen Z", left: "FOMO", right: "JOMO" },
  { id: "s71", category: "Pinoy Life", left: "Sari-sari store run", right: "Mall day" },
  { id: "s72", category: "Pinoy Life", left: "Jeepney ride", right: "Grab ride" },
  { id: "s73", category: "Pinoy Life", left: "Barangay fiesta", right: "Big concert" },
  { id: "s74", category: "Pinoy Life", left: "Carinderia meal", right: "Restaurant meal" },
  { id: "s75", category: "Pinoy Life", left: "Tambay sa kanto", right: "Gala sa BGC" },
  { id: "s76", category: "Pinoy Life", left: "Morning palengke", right: "Night market" },
  { id: "s77", category: "Pinoy Life", left: "Videoke sa bahay", right: "Karaoke bar" },
  { id: "s78", category: "Pinoy Life", left: "Merienda", right: "Full handaan" },
  { id: "s79", category: "Pinoy Life", left: "Tricycle ride", right: "Road trip" },
  { id: "s80", category: "Pinoy Life", left: "Piso Wi-Fi", right: "Unlimited fiber" },
  { id: "s81", category: "Online Life", left: "Voice call", right: "Video call" },
  { id: "s82", category: "Online Life", left: "Group chat lurker", right: "Group chat admin" },
  { id: "s83", category: "Online Life", left: "Instagram story", right: "TikTok upload" },
  { id: "s84", category: "Online Life", left: "Private account", right: "Public account" },
  { id: "s85", category: "Online Life", left: "No notifications", right: "Notifications on for everything" },
  { id: "s86", category: "Online Life", left: "One saved photo", right: "Camera roll chaos" },
  { id: "s87", category: "Online Life", left: "Memes only", right: "Serious posts only" },
  { id: "s88", category: "Online Life", left: "Online shopping cart", right: "Actual checkout" },
  { id: "s89", category: "Online Life", left: "Reply tomorrow", right: "Reply right now" },
  { id: "s90", category: "Online Life", left: "Good Wi-Fi", right: "Good battery" },
  { id: "s91", category: "Kilig", left: "Friendly", right: "Flirty" },
  { id: "s92", category: "Kilig", left: "Cute crush", right: "Serious crush" },
  { id: "s93", category: "Kilig", left: "One compliment", right: "Grand romantic gesture" },
  { id: "s94", category: "Kilig", left: "Slow burn", right: "Love at first sight" },
  { id: "s95", category: "Kilig", left: "Holding hands", right: "Big public confession" },
  { id: "s96", category: "Barkada", left: "Inside joke", right: "Story everyone knows" },
  { id: "s97", category: "Barkada", left: "Game night at home", right: "Night out" },
  { id: "s98", category: "Barkada", left: "One close friend", right: "Big friend group" },
  { id: "s99", category: "Barkada", left: "Helpful advice", right: "Brutally honest advice" },
  { id: "s100", category: "Barkada", left: "Planned hangout", right: "Biglaang aya" },
];

function getScore(distance) {
  if (distance <= 5) return 4;
  if (distance <= 10) return 3;
  if (distance <= 18) return 2;
  if (distance <= 25) return 1;
  return 0;
}

function zoneStyle(target, radius) {
  const left = Math.max(0, target - radius);
  const right = Math.min(100, target + radius);
  return { left: `${left}%`, width: `${right - left}%` };
}

export default function BarkadaSpectrum({ onBack, onSound }) {
  const [teamNames, setTeamNames] = useState(["Team Gold", "Team Green"]);
  const [scores, setScores] = useState([0, 0]);
  const [activeTeam, setActiveTeam] = useState(0);
  const [screen, setScreen] = useState("setup");
  const [round, setRound] = useState(null);
  const [guess, setGuess] = useState(50);
  const [opponentChoice, setOpponentChoice] = useState("");
  const [usedIds, setUsedIds] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1);

  const otherTeam = activeTeam === 0 ? 1 : 0;

  const result = useMemo(() => {
    if (!round) return null;
    const distance = Math.abs(round.target - guess);
    const teamPoints = getScore(distance);
    const actualSide = round.target < guess ? "left" : round.target > guess ? "right" : "center";
    const opponentPoints = opponentChoice && opponentChoice === actualSide ? 1 : 0;
    return { distance, teamPoints, opponentPoints, actualSide };
  }, [round, guess, opponentChoice]);

  function startRound(nextTeam = activeTeam) {
    let currentUsed = usedIds;
    if (currentUsed.length >= spectrumCards.length) currentUsed = [];

    const choices = spectrumCards.filter((card) => !currentUsed.includes(card.id));
    const card = choices[Math.floor(Math.random() * choices.length)];
    const target = Math.floor(Math.random() * 61) + 20;

    setRound({ card, target });
    setUsedIds([...currentUsed, card.id]);
    setActiveTeam(nextTeam);
    setGuess(50);
    setOpponentChoice("");
    setScreen("psychic");
    onSound?.("card");
  }

  function startMatch() {
    const cleanedNames = teamNames.map((name, index) => name.trim() || `Team ${index + 1}`);
    setTeamNames(cleanedNames);
    setScores([0, 0]);
    setUsedIds([]);
    setRoundNumber(1);
    setActiveTeam(0);
    setTimeout(() => startRound(0), 0);
  }

  function updateTeamName(index, value) {
    setTeamNames((oldNames) => oldNames.map((name, itemIndex) => itemIndex === index ? value : name));
  }

  function finishRound(side = "") {
    const distance = Math.abs(round.target - guess);
    const teamPoints = getScore(distance);
    const actualSide = round.target < guess ? "left" : round.target > guess ? "right" : "center";
    const opponentPoints = side && side === actualSide ? 1 : 0;

    setOpponentChoice(side);
    setScores((oldScores) => oldScores.map((score, index) => {
      if (index === activeTeam) return score + teamPoints;
      if (index === otherTeam) return score + opponentPoints;
      return score;
    }));
    setScreen("results");
    onSound?.(teamPoints || opponentPoints ? "winner" : "card");
  }

  function nextRound() {
    const nextTeam = activeTeam === 0 ? 1 : 0;
    setRoundNumber((oldNumber) => oldNumber + 1);
    startRound(nextTeam);
  }

  function resetMatch() {
    setScreen("setup");
    setRound(null);
    setScores([0, 0]);
    setActiveTeam(0);
    setGuess(50);
    setOpponentChoice("");
    setUsedIds([]);
    setRoundNumber(1);
  }

  function Board({ showTarget = false, showGuess = false, showZones = false }) {
    return (
      <div className="spectrum-board-wrap">
        <div className="spectrum-labels">
          <span>{round.card.left}</span>
          <span>{round.card.right}</span>
        </div>
        <div className="spectrum-board">
          {showZones && (
            <>
              <div className="spectrum-zone outer" style={zoneStyle(round.target, 25)} />
              <div className="spectrum-zone mid" style={zoneStyle(round.target, 18)} />
              <div className="spectrum-zone near" style={zoneStyle(round.target, 10)} />
              <div className="spectrum-zone bullseye" style={zoneStyle(round.target, 5)} />
            </>
          )}
          {showTarget && <div className="spectrum-target" style={{ left: `${round.target}%` }} />}
          {showGuess && <div className="spectrum-needle" style={{ left: `${guess}%` }} />}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        #barkada-spectrum { --spec-gold:#ffd46f; --spec-ink:#fff8e3; --spec-muted:#d8e5d6; --spec-line:rgba(255,222,142,.25); }
        #barkada-spectrum .spec-grid{display:grid;grid-template-columns:minmax(270px,350px) minmax(0,1fr);gap:24px;align-items:start}
        #barkada-spectrum .spec-panel,#barkada-spectrum .spec-stage,#barkada-spectrum .spec-scoreboard,#barkada-spectrum .spec-result{border:1px solid var(--spec-line);border-radius:22px;background:radial-gradient(circle at 88% 9%,rgba(255,211,108,.14),transparent 24%),linear-gradient(145deg,rgba(12,64,45,.98),rgba(4,28,19,.98));color:var(--spec-ink);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 18px 36px rgba(0,0,0,.16)}
        #barkada-spectrum .spec-panel{padding:22px} #barkada-spectrum .spec-panel h3{margin:0;color:var(--spec-ink)} #barkada-spectrum .spec-panel p{color:var(--spec-muted);line-height:1.55}
        #barkada-spectrum .spec-field{display:grid;gap:8px;margin:16px 0;color:#fff0c5;font-weight:900} #barkada-spectrum .spec-field input{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid rgba(255,230,158,.28);border-radius:10px;background:rgba(0,0,0,.24);color:var(--spec-ink);font:inherit}
        #barkada-spectrum .spec-guide{margin-top:18px;padding:14px;border-left:3px solid var(--spec-gold);border-radius:0 12px 12px 0;background:rgba(255,211,108,.09);color:var(--spec-muted);line-height:1.55;font-size:.92rem} #barkada-spectrum .spec-guide strong{color:var(--spec-gold)}
        #barkada-spectrum .spec-scoreboard{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:13px;margin-bottom:22px} #barkada-spectrum .spec-score{padding:15px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:rgba(0,0,0,.17);text-align:center} #barkada-spectrum .spec-score.active{border-color:var(--spec-gold);background:rgba(255,211,108,.12)} #barkada-spectrum .spec-score span,#barkada-spectrum .spec-score strong{display:block} #barkada-spectrum .spec-score span{font-weight:900;color:#f8ebc8;overflow-wrap:anywhere} #barkada-spectrum .spec-score strong{margin-top:7px;color:var(--spec-gold);font-size:2.3rem}
        #barkada-spectrum .spec-stage{min-height:480px;padding:28px;display:flex;align-items:center;justify-content:center;text-align:center} #barkada-spectrum .spec-content{width:min(100%,760px)} #barkada-spectrum .spec-content h2{margin:12px 0;color:var(--spec-ink);font-size:clamp(2rem,5vw,4rem);line-height:1.06} #barkada-spectrum .spec-content>p{max-width:650px;margin:0 auto;color:var(--spec-muted);line-height:1.6}
        #barkada-spectrum .spec-card{margin:20px auto 0;padding:20px;border:1px solid rgba(255,228,142,.42);border-radius:18px;background:radial-gradient(circle at 85% 14%,rgba(255,221,123,.2),transparent 23%),linear-gradient(145deg,rgba(116,25,53,.98),rgba(55,16,42,.98))} #barkada-spectrum .spec-card h3{margin:8px 0 0;color:#fff8df;font-size:clamp(1.3rem,3vw,2rem)}
        #barkada-spectrum .spec-category{display:inline-flex;padding:6px 11px;border:1px solid rgba(255,238,178,.42);border-radius:999px;color:#fff1b3;font-size:.77rem;font-weight:1000;letter-spacing:.07em;text-transform:uppercase}
        #barkada-spectrum .spectrum-board-wrap{margin:22px auto 0} #barkada-spectrum .spectrum-labels{display:flex;justify-content:space-between;gap:20px;margin-bottom:9px;color:#fff4ce;font-weight:1000} #barkada-spectrum .spectrum-labels span{text-align:left} #barkada-spectrum .spectrum-labels span:last-child{text-align:right}
        #barkada-spectrum .spectrum-board{position:relative;height:74px;overflow:hidden;border:1px solid rgba(255,238,179,.37);border-radius:18px;background:linear-gradient(90deg,#2c6f7c 0%,#55b0ab 34%,#f0dd86 50%,#e29b66 68%,#a84b5f 100%);box-shadow:inset 0 0 26px rgba(0,0,0,.2)} #barkada-spectrum .spectrum-board:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.15) 0,rgba(255,255,255,.15) 1px,transparent 1px,transparent 10%);pointer-events:none}
        #barkada-spectrum .spectrum-zone{position:absolute;top:0;bottom:0;z-index:1}.outer{background:rgba(255,233,139,.18)}.mid{background:rgba(255,235,158,.29)}.near{background:rgba(255,246,193,.42)}.bullseye{background:rgba(255,255,232,.68)}
        #barkada-spectrum .spectrum-target,#barkada-spectrum .spectrum-needle{position:absolute;top:50%;z-index:3;width:5px;height:92px;border-radius:999px;transform:translate(-50%,-50%)} #barkada-spectrum .spectrum-target{background:#fffce8;box-shadow:0 0 0 2px rgba(58,29,39,.38),0 0 18px rgba(255,248,188,.75)} #barkada-spectrum .spectrum-needle{background:#182422;box-shadow:0 0 0 2px rgba(255,242,186,.92),0 0 20px rgba(0,0,0,.32)}
        #barkada-spectrum .spectrum-slider{width:min(100%,650px);margin-top:22px;accent-color:#ffd36c;cursor:pointer} #barkada-spectrum .spec-readout{margin:12px 0 0;color:#f9edc8;font-weight:900}
        #barkada-spectrum .spec-actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-top:24px} #barkada-spectrum .spec-direction{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:24px} #barkada-spectrum .spec-direction button{min-height:120px;padding:18px;border:2px solid rgba(255,230,158,.43);border-radius:18px;background:rgba(0,0,0,.16);color:var(--spec-ink);cursor:pointer;font:inherit;font-size:clamp(1.1rem,2.5vw,1.45rem);font-weight:1000;transition:transform .2s,border-color .2s} #barkada-spectrum .spec-direction button:hover{border-color:#fff1ad;transform:translateY(-4px)}
        #barkada-spectrum .spec-result{position:relative;width:min(100%,760px);padding:30px 26px;overflow:hidden;animation:spec-pop .58s cubic-bezier(.16,1,.3,1) both} #barkada-spectrum .spec-result h2{margin:12px 0;color:var(--spec-gold);font-size:clamp(2rem,5vw,3.8rem)} #barkada-spectrum .spec-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin-top:20px} #barkada-spectrum .spec-summary div{padding:14px;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:rgba(0,0,0,.18)} #barkada-spectrum .spec-summary strong,#barkada-spectrum .spec-summary span{display:block} #barkada-spectrum .spec-summary strong{color:var(--spec-gold);font-size:1.6rem} #barkada-spectrum .spec-summary span{margin-top:5px;color:#f7eac9;font-weight:800} #barkada-spectrum .spec-result p{color:var(--spec-muted);line-height:1.6} #barkada-spectrum .spec-result p strong{color:#fff2b2}
        @keyframes spec-pop{from{opacity:0;transform:translateY(25px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @media(max-width:840px){#barkada-spectrum .spec-grid{grid-template-columns:1fr}} @media(max-width:560px){#barkada-spectrum .spec-stage{min-height:400px;padding:19px 14px}#barkada-spectrum .spec-actions button{width:100%}#barkada-spectrum .spec-direction,#barkada-spectrum .spec-summary{grid-template-columns:1fr}}
      `}</style>

      <section id="barkada-spectrum" className="page-section">
        <button className="back-button" onClick={onBack}>← Back to Other Games</button>
        <div className="section-heading"><div><p className="eyebrow">Clue and Dial Team Game</p><h2>Barkada Spectrum</h2></div>{screen !== "setup" && <button className="reset-link" onClick={resetMatch}>New Match</button>}</div>

        {screen === "setup" && <div className="spec-grid">
          <aside className="spec-panel"><h3>Team Setup</h3><p>One player is the clue giver each round. They see the hidden target, say one clue, then their team moves the dial.</p>
            <label className="spec-field">Team 1 name<input value={teamNames[0]} onChange={(event) => updateTeamName(0, event.target.value)} /></label>
            <label className="spec-field">Team 2 name<input value={teamNames[1]} onChange={(event) => updateTeamName(1, event.target.value)} /></label>
            <div className="spec-guide"><strong>Scoring guide:</strong><br />Bullseye = 4 points · Near = 3 points · Close = 2 points · Outer zone = 1 point. The other team can gain 1 point by guessing which side of your dial hides the target.</div>
            <button className="primary-button full-width" onClick={startMatch}>Start Barkada Spectrum</button>
          </aside>
          <div className="spec-stage"><div className="spec-content"><span className="rank-badge">Original Spectrum Game</span><h2>Give one clue. Find the hidden spot.</h2><p>Use your own clues and teamwork to land close to a secret target. This is an original game made for your party website.</p></div></div>
        </div>}

        {screen !== "setup" && <div className="spec-scoreboard">{teamNames.map((name,index) => <div className={index === activeTeam ? "spec-score active" : "spec-score"} key={index}><span>{name}</span><strong>{scores[index]}</strong></div>)}</div>}

        {screen === "psychic" && round && <div className="spec-stage"><div className="spec-content"><span className="rank-badge">Round {roundNumber} · {teamNames[activeTeam]} clue giver</span><h2>Show this only to the clue giver.</h2><p>Give one short verbal clue. Do not say the number or point at the dial.</p><div className="spec-card"><span className="spec-category">{round.card.category}</span><h3>Find the secret spot between these ideas.</h3><Board showTarget showZones /></div><div className="spec-actions"><button className="primary-button" onClick={() => setScreen("guess")}>Hide Target & Pass to Team</button></div></div></div>}

        {screen === "guess" && round && <div className="spec-stage"><div className="spec-content"><span className="rank-badge">Round {roundNumber} · {teamNames[activeTeam]} guessing</span><h2>Move the dial together.</h2><p>Based on the clue, decide where the hidden target might be.</p><div className="spec-card"><span className="spec-category">{round.card.category}</span><Board showGuess /><input className="spectrum-slider" type="range" min="0" max="100" value={guess} onChange={(event) => setGuess(Number(event.target.value))} aria-label="Move team dial" /><p className="spec-readout">Dial position: {guess}%</p></div><div className="spec-actions"><button className="primary-button" onClick={() => { setScreen("opponent"); onSound?.("click"); }}>Lock In Guess</button></div></div></div>}

        {screen === "opponent" && round && <div className="spec-stage"><div className="spec-content"><span className="rank-badge">Opponent Bonus · {teamNames[otherTeam]}</span><h2>Can you steal 1 point?</h2><p>Guess whether the hidden target is left or right of {teamNames[activeTeam]}&apos;s locked dial.</p><div className="spec-card"><Board showGuess /></div><div className="spec-direction"><button onClick={() => finishRound("left")}>← Target is Left</button><button onClick={() => finishRound("right")}>Target is Right →</button></div><div className="spec-actions"><button className="secondary-button" onClick={() => finishRound("")}>Skip Opponent Bonus</button></div></div></div>}

        {screen === "results" && round && result && <div className="spec-stage"><div className="spec-result"><span className="rank-badge">Round {roundNumber} Results</span><h2>{result.teamPoints === 4 ? "Bullseye!" : result.teamPoints > 0 ? "Nice Guess!" : "Missed the Target"}</h2><Board showTarget showGuess showZones /><div className="spec-summary"><div><strong>+{result.teamPoints}</strong><span>{teamNames[activeTeam]} earned</span></div><div><strong>+{result.opponentPoints}</strong><span>{result.opponentPoints ? `${teamNames[otherTeam]} stole a bonus` : `${teamNames[otherTeam]} bonus`}</span></div></div><p>{result.teamPoints > 0 ? <><strong>{teamNames[activeTeam]}</strong> landed {result.distance}% away from the target.</> : <><strong>{teamNames[activeTeam]}</strong> was {result.distance}% away from the target.</>} {opponentChoice ? result.opponentPoints ? <><strong>{teamNames[otherTeam]}</strong> correctly guessed the target was {result.actualSide} of the dial.</> : <><strong>{teamNames[otherTeam]}</strong> did not get the bonus.</> : "The opponent bonus was skipped."}</p><div className="spec-actions"><button className="primary-button" onClick={nextRound}>Next Round</button><button className="secondary-button" onClick={resetMatch}>New Match</button></div></div></div>}
      </section>
    </>
  );
}
