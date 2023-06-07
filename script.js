let playerScore = 0;
let aiScore = 0;
let roundsPlayed = 0;
let playerChoices = { rock: 0, paper: 0, scissors: 0 };
let lastFiveChoices = ["", "", "", "", ""];
let gameActive = true;

document.body.addEventListener("click", function (event) {
  let id = event.target.id;
  if (id === "rock" || id === "paper" || id === "scissors") {
    if (gameActive) playRound(id);
  } else if (id === "playAgain") {
    resetGame();
  }
});

function playRound(playerChoice) {
  updateLastFiveChoices(playerChoice);
  playerChoices[playerChoice]++;
  let aiChoice = getAiChoice();
  let outcome = getOutcome(playerChoice, aiChoice);
  updateScore(outcome);
  updateDisplay(playerChoice, aiChoice, outcome);

  roundsPlayed++;
  document.getElementById("round").textContent = `Round ${roundsPlayed}/21`;

  // Check if either player has reached 11 wins
  if (playerScore === 11 || aiScore === 11 || roundsPlayed === 21) {
    gameActive = false;
    determineWinner();
    document.getElementById("playAgain").style.display = "block";
  }
}

function updateLastFiveChoices(choice) {
  lastFiveChoices.push(choice);
  lastFiveChoices.shift();
}

function getAiChoice() {
  if (detectPattern()) {
    return counterChoice(lastFiveChoices[4]);
  }
  if (Math.random() < 0.6) {
    return weightedChoice();
  } else {
    let choices = ["rock", "paper", "scissors"];
    return choices[Math.floor(Math.random() * 3)];
  }
}

function detectPattern() {
  return (
    lastFiveChoices[0] === lastFiveChoices[2] &&
    lastFiveChoices[1] === lastFiveChoices[3] &&
    lastFiveChoices[2] === lastFiveChoices[4]
  );
}

function counterChoice(choice) {
  if (choice === "rock") return "paper";
  if (choice === "paper") return "scissors";
  if (choice === "scissors") return "rock";
}

function weightedChoice() {
  let total = playerChoices.rock + playerChoices.paper + playerChoices.scissors;
  let randomNum = Math.random() * total;
  if (randomNum < playerChoices.rock) {
    return "paper";
  } else if (randomNum < playerChoices.rock + playerChoices.paper) {
    return "scissors";
  } else {
    return "rock";
  }
}

function getOutcome(playerChoice, aiChoice) {
  if (playerChoice === aiChoice) {
    return "tie";
  } else if (
    (playerChoice === "rock" && aiChoice === "scissors") ||
    (playerChoice === "paper" && aiChoice === "rock") ||
    (playerChoice === "scissors" && aiChoice === "paper")
  ) {
    return "win";
  } else {
    return "lose";
  }
}

function updateScore(outcome) {
  if (outcome === "win") {
    playerScore++;
  } else if (outcome === "lose") {
    aiScore++;
  }
}

function updateDisplay(playerChoice, aiChoice, outcome) {
  document.getElementById("aiChoice").textContent = aiChoice;
  document.getElementById("outcome").textContent = `You ${outcome}!`;
  document.getElementById("score").textContent = `${playerScore} - ${aiScore}`;
}

function resetGame() {
  playerScore = 0;
  aiScore = 0;
  roundsPlayed = 0;
  playerChoices = { rock: 0, paper: 0, scissors: 0 };
  lastFiveChoices = ["", "", "", "", ""];
  gameActive = true;
  document.getElementById("aiChoice").textContent = "...";
  document.getElementById("outcome").textContent = "...";
  document.getElementById("score").textContent = "0 - 0";
  document.getElementById("round").textContent = "Round 0/21";
  document.getElementById("playAgain").style.display = "none";
}

function determineWinner() {
  let outcome =
    playerScore > aiScore
      ? "You win!"
      : playerScore < aiScore
      ? "AI wins!"
      : "It's a tie!";
  document.getElementById("outcome").textContent = outcome;
}
