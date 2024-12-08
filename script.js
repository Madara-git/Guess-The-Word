const resetBtn = document.querySelector(".reset");
let pageName = "Guess The Word";
document.title = pageName;
document.querySelector("h1").innerHTML = pageName;
let footer = (document.querySelector(
  "footer"
).innerHTML = `${pageName} \&#169; ${new Date().getFullYear()}`);
let numberOfTries;
let numberOfLetters;
let currentTry;
let numberOfHints;
let wordToGuess;
gameSettings();
function gameSettings() {
  numberOfTries = 6;
  currentTry = 1;
  numberOfHints = 2;
  wordToGuess = "";
  numberOfLetters = 6;
  let words = [
    "Create",
    "Update",
    "Delete",
    "Master",
    "Branch",
    "Mainly",
    "School",
    "Cradle",
    "Dealer",
    "Ladder",
    "Breach",
    "Chaser",
    "Stream",
    "Marker",
    "Random",
    "Border",
    "Center",
    "Module",
    "System",
    "Mental",
    "Action",
    "Method",
    "Budget",
    "Bright",
    "Damage",
    "Senior",
    "Rescue",
    "Cancel",
    "Simple",
    "Planet",
    "Export",
    "Import",
    "Submit",
    "Handle",
    "Friend",
    "Delete",
  ];
  wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
  document.querySelector(".hint span").textContent = `${numberOfHints} `;
}
let message = document.querySelector(".message");
const getHintButton = document.querySelector(".hint");
let inputContainer;
function genetrateInputs() {
  for (let i = 1; i <= numberOfTries; i++) {
    let row = document.createElement("div");
    let tryLevel = document.createElement("span");
    tryLevel.innerHTML = `Try ${i} `;
    row.appendChild(tryLevel);
    row.classList.add(`try-${i}`);
    if (i !== 1) row.classList.add("disabled");
    inputContainer.appendChild(row);
    for (let j = 1; j <= numberOfLetters; j++) {
      let letterInput = document.createElement("input");
      letterInput.type = "text";
      letterInput.setAttribute("maxlength", 1);
      letterInput.id = `try${i}-letter${j}`;
      row.appendChild(letterInput);
    }
  }
}
function inputsPlacement() {
  inputContainer = document.querySelector(".inputs");
  genetrateInputs();
  inputContainer.children[0].children[1].focus();
  let dsiabledInputs = document.querySelectorAll(".inputs .disabled input");
  dsiabledInputs.forEach((input) => (input.disabled = true));
  let inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      let next = inputs[index + 1];
      if (next) {
        next.focus();
      }
    });
    input.addEventListener("keydown", function (e) {
      let currentIndex = Array.from(inputs).indexOf(e.target);
      if (e.key === "ArrowRight") {
        let next = currentIndex + 1;
        if (next <= inputs.length) inputs[next].focus();
      }
      if (e.key === "ArrowLeft") {
        let previous = currentIndex - 1;
        if (previous >= 0) inputs[previous].focus();
      }
    });
  });
}
let guessbutton = document.querySelector(".check-word");
guessbutton.addEventListener("click", handleGuesses);
function handleGuesses() {
  let successGuess = true;
  const actualLetterCounts = {};
  for (let char of wordToGuess) {
    actualLetterCounts[char] = (actualLetterCounts[char] || 0) + 1;
  }
  Array.from({ length: numberOfLetters }, (_, i) => {
    const input = document.querySelector(`#try${currentTry}-letter${1 + i}`);
    let letter = input.value.toLowerCase();
    let actualLetter = wordToGuess[i];
    if (letter === actualLetter) {
      input.classList.add("yes-in-place");
      actualLetterCounts[letter]--;
    }
  });
  Array.from({ length: numberOfLetters }, (_, i) => {
    const input = document.querySelector(`#try${currentTry}-letter${1 + i}`);
    let letter = input.value.toLowerCase();
    if (!input.classList.contains("yes-in-place")) {
      if (wordToGuess.includes(letter) && actualLetterCounts[letter] > 0) {
        input.classList.add("not-in-place");
        actualLetterCounts[letter]--;
      } else {
        input.classList.add("wrong-in-place");
      }
      successGuess = false;
    }
  });
  checkWinLose(successGuess);
}

function checkWinLose(successGuess) {
  if (successGuess) {
    message.innerHTML = `You Won The Word Is: <span>${wordToGuess} </span>`;
    let divs = document.querySelectorAll(".inputs >div");
    divs.forEach((val) => val.classList.add("disabled"));
    guessbutton.classList.add("disabled");
    guessbutton.disabled = true;
    getHintButton.disabled = true;
  } else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled");
    const currentTryInput = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInput.forEach((val) => (val.disabled = true));
    currentTry++;
    const element = document.querySelector(`.try-${currentTry} `);
    if (element) {
      const nextTryInput = document.querySelectorAll(
        `.try-${currentTry} input`
      );
      nextTryInput.forEach((val) => (val.disabled = false));
      document.querySelector(`.try-${currentTry}`).classList.remove("disabled");
      element.children[1].focus();
    } else {
      guessbutton.disabled = true;
      message.innerHTML = `You Lost And The Word Is <span>${wordToGuess}</span>`;
      getHintButton.disabled = true;
    }
  }
}
getHintButton.addEventListener("click", getHint);
function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").textContent = `${numberOfHints}`;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }
  let notDisabled2 = document.querySelectorAll("input:not([disabled])");
  const emptyValues = Array.from(notDisabled2).filter(
    (val) => val.value === ""
  );
  if (emptyValues.length > 0) {
    const randomNumberInput = Math.floor(Math.random() * emptyValues.length);
    const randomInput = emptyValues[randomNumberInput];
    let indexToFill = Array.from(notDisabled2).indexOf(randomInput);
    randomInput.value = wordToGuess[indexToFill].toUpperCase();
  }
}
inputsPlacement();

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      handleGuesses();
    }
  }
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Backspace") {
    let notDisabled2 = document.querySelectorAll("input:not([disabled])");
    let currentIndex = Array.from(notDisabled2).indexOf(document.activeElement);
    if (currentIndex > 0) {
      let currentInput = notDisabled2[currentIndex];
      let previous = notDisabled2[currentIndex - 1];
      const lastInput = document.querySelectorAll("input:last-of-type");
      if (currentInput.value === "") {
        previous.value = "";
        previous.focus();
      }
      lastInput.forEach((_, i) => {
        if (notDisabled2[currentIndex].id === `try${i + 1}-letter6`) {
          currentInput.value = "";
          return;
        }
      });
      if (currentInput.value) {
        previous.value = "";
        previous.focus();
      }
    }
  }
});
resetBtn.addEventListener("click", function () {
  inputContainer.innerHTML = "";
  message.innerHTML = "";
  guessbutton.disabled = false;
  getHintButton.disabled = false;
  gameSettings();
  inputsPlacement();
});
