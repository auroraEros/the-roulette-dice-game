"use strict";

// Selecting elements
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

const themeAudio = document.getElementById("theme-audio");
playAudio(themeAudio);

const selectingAudio = document.getElementById("selecting-audio");
const strategyAudio = document.getElementById("strategy-audio");
const startingAudio = document.getElementById("starting-audio");
const shootingAudio = document.getElementById("shooting-audio");
const emptyGunAudio = document.getElementById("empty-gun-audio");
const safetyAudio = document.getElementById("safety-audio");
const diceAudio = document.getElementById("dice-audio");
let secs = 4;

function playAudio(audioElement) {
  audioElement.play();
  audioElement.volume = 0.5;
}

btnStartGame.addEventListener("mouseover", () => {
  playAudio(selectingAudio);
});

btnStartGame.addEventListener("click", () => {
  playAudio(startingAudio);
  startingTimer.classList.remove("hidden");

  const intervalId = setInterval(() => {
    secs = secs > 0 ? secs - 1 : 0;
    startingTimer.innerHTML = secs;
  }, 1000);

  setTimeout(() => {
    isplaying = true;
    clearInterval(intervalId);
    init();
    startingTimer.classList.add("hidden");
    openingPage.classList.add("hidden");
    startGamePage.classList.remove("hidden");
  }, 4000);
});

btnSterategy.addEventListener("mouseover", () => {
  playAudio(selectingAudio);
});

btnSterategy.addEventListener("click", () => {
  playAudio(strategyAudio);
});

btnClose.addEventListener("click", () => {
  playAudio(strategyAudio);
});

/////////////////////////////////////////// gamePage

let scores,
  activePlayer,
  playing,
  damages,
  winnerPlayer,
  secondsRemaining,
  MainIntervalId;
let diceNums = [];
let isplaying = false;

// initial states
function init() {
  scores = [0, 0];
  damages = [100, 100];
  activePlayer = 0;
  playing = 3;
  isplaying = true;
  winnerPlayer = null;
  secondsRemaining = 120;

  player1.classList.add("player--active");
  player2.classList.remove("player--active");

  player1.classList.remove("player--winner");
  player2.classList.remove("player--winner");

  player1.firstElementChild.textContent = "Player 1";
  player2.firstElementChild.textContent = "Player 2";

  player0Dmg.style.width = `${damages[0]}%`;
  player1Dmg.style.width = `${damages[1]}%`;

  diceEl1.src = "/img/dice-six-faces-5.png";
  diceEl2.src = "/img/dice-six-faces-3.png";

  scoreP1.innerHTML = `${scores[0]}`;
  scoreP2.innerHTML = `${scores[1]}`;

  rollingChance.innerHTML = `${playing}`;

  gunImg.src = "/img/right-gun.png";
  btnShoot.disabled = true;
  btnRoll.disabled = false;
  btnShoot.classList.remove("hidden");
  btnReset.classList.add("hidden");
  MainIntervalId = setInterval(timers, 1000);
}

// Timer Functionality
function timers() {
  secondsRemaining -= 1;
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const htmlTimer = `${mins < 10 ? "0" : ""}${mins}:${seconds < 10 ? "0" + seconds : seconds}`;
  timerEl.innerHTML = htmlTimer;

  if (secondsRemaining <= 0) {
    clearInterval(MainIntervalId);
    isplaying = false;
    winner();
  }
}

// Switching players
function switchPlayer() {
  activePlayer = activePlayer === 0 ? 1 : 0;
  player1.classList.toggle("player--active");
  player2.classList.toggle("player--active");
  gunImg.src = activePlayer === 0 ? "/img/right-gun.png" : "/img/left-gun.png";
  playing = 3;
  rollingChance.innerHTML = "3";
}

// Winner Player Functionality
function winner() {
  const maxScore = Math.max(...scores);
  const winnerPlayerIndex = damages.includes(0)
    ? damages.findIndex(d => d !== 0)
    : scores.indexOf(maxScore);
  const loserPlayerIndex = winnerPlayerIndex === 0 ? 1 : 0;

  winnerPlayer = document.querySelector(`.player--${winnerPlayerIndex}`);
  const loserPlayer = document.querySelector(`.player--${loserPlayerIndex}`);

  winnerPlayer.classList.add("player--winner");

  playerActive.classList.remove("player--active");
  winnerPlayer.classList.remove("player--active");

  winnerPlayer.firstElementChild.textContent = "";
  loserPlayer.firstElementChild.textContent = "";

  winnerPlayer.firstElementChild.textContent = "🎉Congrats🎉";
  loserPlayer.firstElementChild.textContent = "💀Dead💀";

  btnShoot.classList.add("hidden");
  btnReset.classList.remove("hidden");
  btnRoll.disabled = true;
}


// Player's Score functionality
function scoreUpdate(activePlayer) {
  scores[activePlayer] += 100;
  document.getElementById(
    `score--${activePlayer}`
  ).innerHTML = `${scores[activePlayer]}`;
}

// Player's Chance functionality
function chance() {
  if (playing === 1) return switchPlayer();

  playing -= 1;
  rollingChance.innerHTML = `${playing}`;
}

// Damage functionality
function damageCalc() {
  if (activePlayer === 0) {
    damages[1] = damages[1] - 25;
    player1Dmg.style.width = `${damages[1]}%`;
  }
  if (activePlayer === 1) {
    damages[0] = damages[0] - 25;
    player0Dmg.style.width = `${damages[0]}%`;
  }
}

// Rolling dice functionality
function rolling(diceEl) {
  const diceNumber = Math.trunc(Math.random() * 6) + 1;
  diceNums.push(diceNumber);
  diceEl.src = `/img/dice-six-faces-${diceNumber}.png`;
  return diceNumber;
}

// Rolling Dice Event
btnRoll.addEventListener("click", () => {
  if (isplaying) {
    playAudio(diceAudio);
    chance();
    rolling(diceEl1);
    rolling(diceEl2);

    if (diceNums[0] + diceNums[1] === 8 || diceNums[0] + diceNums[1] === 12) {
      gunImg.src =
        activePlayer === 0 ? "/img/right-gun.png" : "/img/left-gun.png";
      gunImg.classList.add("ready-to-shoot");
      playAudio(safetyAudio);
      scoreUpdate(activePlayer);
      btnShoot.disabled = false;
      btnRoll.disabled = true;
    }

    diceNums = [];
  }
});

// Gun fire functionality
function gunFire() {
  const gun = Math.trunc(Math.random() * 6) + 1;
  return gun;
}

// Gun Fire Event
btnShoot.addEventListener("click", () => {
  const killShot = gunFire();
  gunImg.classList.remove("ready-to-shoot");
  if (killShot === 2 || killShot === 4) {
    playAudio(shootingAudio);
    damageCalc();
    scoreUpdate(activePlayer);
  }
  btnShoot.disabled = true;
  btnRoll.disabled = false;
  playAudio(emptyGunAudio);

  if (damages.includes(0)) {
    isplaying = false;
    clearInterval(MainIntervalId);
    winner();
  } else switchPlayer();
});

// //////////////////////////////////////////////Reset Event
btnReset.addEventListener("click", init);

// //////////////////////////////////////////////Translate Event
btnTranslate.addEventListener("click", () => {
  playAudio(strategyAudio);
  const htmlEn = `This game is a combination of Russian roulette and dice. Each player has three chances to roll their dice. If the sum of the numbers of two dice equals 8 or 12, you can shoot the opponent. If you are lucky and the gun fires, you will get shooting points in addition to the dice points, and if the gun is empty, you will only get the dice points.
  The player who has 100% damage loses. Also, when the game time ends, the player with the least damage wins!
  <span class="popup__detail--primary">good luck!</span>`;

  const htmlFa = `این بازی ترکیبی از بازی رولت روسی و تاس است. هر بازیکن سه فرصت برای انداختن تاس‌های خود دارد. اگر مجموع اعداد دو تاس برابر هشت  یا دوازده شود، امکان تیراندازی به حریف را پیدا می‌کنید. اگر بخت یار‌تان باشد و اسلحه شلیک کند علاوه بر امتیاز تاس، امتیاز شلیک هم کسب می‌کنید و اگر اسلحه خالی باشد فقط امتیاز تاس را دریافت می‌کنید.
  !بازیکنی که میزان آسیب ۱۰۰ درصدی داشته باشد بازنده می‌شود. همچنین با پایان یافتن زمان بازی، بازیکنی که کمترین آسیب را دارد برنده می‌شود
  <span class="popup__detail--primary">!موفق باشید</span>`;

  const popupTitle = document.querySelector(".popup__content :nth-child(3)");

  btnTranslate.innerHTML = btnTranslate.innerHTML === "En" ? "Fa" : "En";
  popupDetail.innerHTML = btnTranslate.innerHTML === "Fa" ? htmlFa : htmlEn;
  popupTitle.innerHTML =
    btnTranslate.innerHTML === "Fa"
      ? "!چطور بازی کنیم"
      : "how to play this game!";
});

