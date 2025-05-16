"use strict";


const openingPage = document.querySelector(".game__container-opening");
const startGamePage = document.querySelector(".game__container-main");
const btnStartGame = document.querySelector(".btn-start");
const btnSterategy = document.querySelector(".btn-strategy");
const btnTranslate = document.querySelector(".btn-translate");
const btnClose = document.querySelector(".btn-close");
const btnRoll = document.querySelector(".btn-roll");
const btnShoot = document.querySelector(".btn-shoot");
const btnReset = document.querySelector(".btn-reset");
const timer = document.querySelector(".timer");

const player1 = document.querySelector(".player--0");
const player2 = document.querySelector(".player--1");
const playerTitle = document.querySelector(".player__title");
const scoreP1 = document.getElementById("score--0");
const scoreP2 = document.getElementById("score--1");
const scoreText = document.querySelector(".score__text");
const playerActive = document.querySelector(".player--active");
const player0Dmg = document.getElementById("damage--0");
const player1Dmg = document.getElementById("damage--1");
const diceEl1 = document.getElementById("dice1");
const diceEl2 = document.getElementById("dice2");
const gunImg = document.querySelector(".gun");
const timerEl = document.querySelector(".timer");
const startingTimer = document.querySelector(".starting-timer");
const rollingChance = document.querySelector(".rolling-chance");
const popupDetail = document.querySelector(".popup__detail");

// صداها
const themeAudio = document.getElementById("theme-audio");
const selectingAudio = document.getElementById("selecting-audio");
const strategyAudio = document.getElementById("strategy-audio");
const startingAudio = document.getElementById("starting-audio");
const shootingAudio = document.getElementById("shooting-audio");
const emptyGunAudio = document.getElementById("empty-gun-audio");
const safetyAudio = document.getElementById("safety-audio");
const diceAudio = document.getElementById("dice-audio");

// متغیرهای بازی
let scores, activePlayer, playing, damages, winnerPlayer, secondsRemaining, MainIntervalId;
let diceNums = [];
let isplaying = false;
let secs = 4;

// ================= توابع کمکی =================
function playAudio(audioElement) {
  try {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.log("Audio play error:", e));
    audioElement.volume = 0.5;
  } catch (error) {
    console.log("Audio error:", error);
  }
}

// ================= منطق هوش مصنوعی =================
function handleAITurnUI() {
  if (activePlayer === 1) {
    btnRoll.classList.add('btn-ai-turn');
    btnShoot.classList.add('btn-ai-turn');
    btnRoll.disabled = true;
    btnShoot.disabled = true;
  } else {
    btnRoll.classList.remove('btn-ai-turn');
    btnShoot.classList.remove('btn-ai-turn');
    btnRoll.disabled = false;
    btnShoot.disabled = true;
  }
}

function AIPlayer() {
  if (!isplaying || activePlayer !== 1) return;

  setTimeout(() => {
    if (!isplaying) return;
    
    
    if (playing > 0) {
      simulateRoll();
      
      setTimeout(() => {
        if (!isplaying || activePlayer !== 1) return;
     
        if (btnShoot.disabled === false) {
          simulateShoot();
        } else {
          switchPlayer();
        }
      }, 1000);
    } else {
      switchPlayer();
    }
  }, 1500);
}

// ================= توابع اصلی بازی =================
function init() {
  scores = [100, 100];
  damages = [100, 100];
  activePlayer = 0;
  playing = 3;
  isplaying = true;
  winnerPlayer = null;
  secondsRemaining = 300; 

  player1.classList.add("player--active");
  player2.classList.remove("player--active");
  player1.classList.remove("player--winner");
  player2.classList.remove("player--winner");

  player0Dmg.style.width = `${damages[0]}%`;
  player1Dmg.style.width = `${damages[1]}%`;

  diceEl1.src = "/img/dice-six-faces-5.png";
  diceEl2.src = "/img/dice-six-faces-3.png";

  scoreP1.textContent = scores[0];
  scoreP2.textContent = scores[1];

  rollingChance.textContent = playing;
  gunImg.src = "/img/right-gun.png";
  
  btnShoot.disabled = true;
  btnRoll.disabled = false;
  btnShoot.classList.remove("hidden");
  btnReset.classList.add("hidden");
  
  handleAITurnUI();
  MainIntervalId = setInterval(timers, 1000);
}

function timers() {
  secondsRemaining -= 1;
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  if (secondsRemaining <= 0) {
    clearInterval(MainIntervalId);
    isplaying = false;
    winner();
  }
}

function simulateRoll() {
  playing -= 1;
  rollingChance.textContent = playing;
  
  const dice1 = rolling(diceEl1);
  const dice2 = rolling(diceEl2);
  playAudio(diceAudio);

  if (dice1 + dice2 === 8 || dice1 + dice2 === 12) {
    gunImg.classList.add("ready-to-shoot");
    playAudio(safetyAudio);
    btnShoot.disabled = false;
    btnRoll.disabled = true;
  }

  if (playing <= 0) {
    switchPlayer();
  }
}

function simulateShoot() {
  const killShot = gunFire();
  gunImg.classList.remove("ready-to-shoot");
  
  if (killShot === 2 || killShot === 4) {
    playAudio(shootingAudio);
    damageCalc();
    scoreUpdate(activePlayer);
  } else {
    playAudio(emptyGunAudio);
  }
  
  btnShoot.disabled = true;
  btnRoll.disabled = false;
  
  if (damages.includes(0)) {
    isplaying = false;
    clearInterval(MainIntervalId);
    winner();
  } else {
    switchPlayer();
  }
}

function switchPlayer() {
  activePlayer = activePlayer === 0 ? 1 : 0;
  player1.classList.toggle("player--active");
  player2.classList.toggle("player--active");
  gunImg.src = activePlayer === 0 ? "/img/right-gun.png" : "/img/left-gun.png";
  playing = 3;
  rollingChance.textContent = playing;
  
  handleAITurnUI();
  
  if (isplaying && activePlayer === 1) {
    setTimeout(() => AIPlayer(), 500);
  }
}

// ================= توابع کمکی بازی =================
function rolling(diceEl) {
  const diceNumber = Math.trunc(Math.random() * 6) + 1;
  diceNums.push(diceNumber);
  diceEl.src = `/img/dice-six-faces-${diceNumber}.png`;
  return diceNumber;
}

function gunFire() {
  return Math.trunc(Math.random() * 6) + 1;
}

function scoreUpdate(player) {
  scores[player] += 100;
  document.getElementById(`score--${player}`).textContent = scores[player];
}

function damageCalc() {
  if (activePlayer === 0) {
    damages[1] -= 25;
    player1Dmg.style.width = `${damages[1]}%`;
  } else {
    damages[0] -= 25;
    player0Dmg.style.width = `${damages[0]}%`;
  }
}

function winner() {
  const winnerIndex = damages[0] > damages[1] ? 0 : 1;
  const winnerPlayer = document.querySelector(`.player--${winnerIndex}`);
  const loserPlayer = document.querySelector(`.player--${winnerIndex === 0 ? 1 : 0}`);

  winnerPlayer.classList.add("player--winner");
  winnerPlayer.querySelector(".player__title").textContent = "🎉 Winner! 🎉";
  loserPlayer.querySelector(".player__title").textContent = "💀 Loser 💀";

  btnShoot.classList.add("hidden");
  btnReset.classList.remove("hidden");
  btnRoll.disabled = true;
}

// ================= ایونت ها =================
btnStartGame.addEventListener("mouseover", () => playAudio(selectingAudio));
btnStartGame.addEventListener("click", startGame);

btnSterategy.addEventListener("mouseover", () => playAudio(selectingAudio));
btnSterategy.addEventListener("click", () => playAudio(strategyAudio));

btnClose.addEventListener("click", () => playAudio(strategyAudio));

btnRoll.addEventListener("click", () => {
  if (isplaying && activePlayer === 0) {
    simulateRoll();
  }
});

btnShoot.addEventListener("click", () => {
  if (isplaying && activePlayer === 0) {
    simulateShoot();
  }
});

btnReset.addEventListener("click", init);

function startGame() {
  playAudio(startingAudio);
  startingTimer.classList.remove("hidden");

  const intervalId = setInterval(() => {
    startingTimer.textContent = --secs;
    if (secs <= 0) clearInterval(intervalId);
  }, 1000);

  setTimeout(() => {
    isplaying = true;
    init();
    openingPage.classList.add("hidden");
    startGamePage.classList.remove("hidden");
    startingTimer.classList.add("hidden");
  }, 4000);
}