/////////LE DOM
const roue = document.querySelector(".roue");
const segments = document.querySelectorAll(".segment");
const question = document.getElementById("question");
const show = document.getElementById("show");
const choix = document.getElementById("choix");
const submitInput = document.getElementById("submit-answer");
const userInput = document.getElementById("answer");

///////////LA ROUE !!!!
let currentRotation = 0;
let selectedCategory = "";
show.style.visibility = "hidden";

function spinWheel() {
  const randomAngle = Math.floor(Math.random() * 360);
  // Tourner 6 fois et ajouter le randomAngle
  //ajouter quelque chose pour aller de moins en moins vite ?
  currentRotation += 360 * 6 + randomAngle;

  roue.style.transition = "transform 2s ease-out";
  roue.style.transform = `rotate(${currentRotation}deg)`;

  // Après la rotation, trouver le segment sélectionné
  roue.addEventListener(
    "transitionend",
    () => {
      const selectedSegment = Math.floor((360 - (currentRotation % 360)) / 60);
      selectedCategory = segments[selectedSegment].textContent.trim();
      console.log(`Le thème sélectionné est : ${selectedCategory}`);

      // Appeler giveAQuestion avec la catégorie sélectionnée
      giveAQuestion(selectedCategory);
    }
    //{ once: true }
  );
}
roue.addEventListener("click", spinWheel);

/////// QUESTIONS DANS UNE CONSTANTE CAR PAS DE SERVEUR LOCAL ICI. A REMPLACER PAR LE FICHIER JSON ASAP :

async function fetchQuestions() {
  try {
    const response = await fetch("/questions.json");
    if (!response.ok) {
      throw new Error("erreur dans ton fetch !!! " + response.status);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Problème dans ton fetch !!", error);
  }
}

let currentPropositions = [];
let currentAnswer = "";
let propositionChoisie = "";

async function giveAQuestion(selectedCategory) {
  const questionsData = await fetchQuestions();

  if (questionsData && questionsData.quizz[selectedCategory]) {
    const difficultyLevel = "débutant"; // à voir créer un bouton niveau ? l'enlever ?
    const questions = questionsData.quizz[selectedCategory][difficultyLevel];
    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    console.log(`Thème: ${selectedCategory}`);
    console.log(`Question: ${randomQuestion.question}`);
    console.log(`Propositions: ${randomQuestion.propositions}`);
    console.log(`reponse: ${randomQuestion.reponse}`);
    console.log(`Anecdote: ${randomQuestion.anecdote}`);
    // Stocker les propositions et la reponse actuelle
    currentPropositions = randomQuestion.propositions;
    currentAnswer = randomQuestion.reponse;

    if (question) {
      question.innerHTML = `${selectedCategory} : ${randomQuestion.question}`;
    }
    if (show) {
      show.addEventListener("click", showPropositions);
    }
    if (userInput) {
      userInput.value = "";
      userInput.style.backgroundColor = "";
    }
    if (currentPropositions) {
      show.style.visibility = "visible";
      show.style.display = "flex";
      choix.innerHTML = "";
    }
  } else {
    console.log("Aucune question trouvée pour la catégorie sélectionnée");
  }
}

function showPropositions() {
  console.log("Propositions:", currentPropositions);
  choix.innerHTML = "";
  show.style.display = "none";
  currentPropositions.forEach((proposition) => {
    const choiceElement = document.createElement("button");
    choiceElement.textContent = proposition;
    choiceElement.addEventListener("click", () => {
      // Stocker la proposition sélectionnée
      selectedProposition = proposition;
      // Appeler submitButton
      submitButton(selectedProposition, choiceElement);
      console.log(selectedProposition);
    });
    choix.appendChild(choiceElement);
  });
}
giveAQuestion();

function DistanceDeLevenshtein(a, b) {
  const matrix = [];

  // Initialiser la première ligne et la première colonne de la matrice
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Remplir la matrice en comparant chaque caractère des chaînes
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j] + 1 // Suppression
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function submitAnswer() {
  const userAnswer = userInput.value.trim().toLowerCase();
  const currentAnswerLowerCase = currentAnswer.toLowerCase();

  console.log(userAnswer);
  if (userAnswer === "") {
    console.log("vide");
    userInput.style.backgroundColor = "#E23B3B";
    userInput.style.boxShadow = "none";
    question.classList.add("noSelectedQuestion");
    return;
  }

  // Vérification avec la distance de Levenshtein
  const levenshteinTolerance = 2; // Tolérance de 2 changements
  const distance = DistanceDeLevenshtein(userAnswer, currentAnswerLowerCase);

  if (distance <= levenshteinTolerance) {
    console.log("ok");
    userInput.style.backgroundColor = "#59F9A3";
    userInput.classList.add("correct-answer");
    userInput.style.boxShadow = "0px 2px 15px 0px lightblue";
  } else {
    console.log("ko");
    userInput.style.backgroundColor = "#E23B3B";
    userInput.style.boxShadow = "none";
  }
}

submitInput.addEventListener("click", submitAnswer);

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitAnswer();
  }
});

function submitButton(propositionChoisie, buttonElement) {
  if (propositionChoisie === currentAnswer) {
    buttonElement.style.backgroundColor = "#59F9A3";
    buttonElement.style.boxShadow = "0px 2px 15px 0px lightblue";
    buttonElement.classList.add("correct-answer");
    // setTimeout(() => {
    //     buttonElement.classList.remove('correct-answer');
    // }, 600);
  } else {
    buttonElement.style.backgroundColor = "#E23B3B";
    buttonElement.style.boxShadow = "none";
  }
}
