/////////LE DOM !!!!
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
  roue.addEventListener("transitionend", () => {
    const selectedSegment = Math.floor((360 - (currentRotation % 360)) / 60);
    selectedCategory = segments[selectedSegment].textContent.trim();
    console.log(`Le thème sélectionné est : ${selectedCategory}`);

    // Appeler giveAQuestion avec la catégorie sélectionnée
    giveAQuestion(selectedCategory);
  });
}
roue.addEventListener("click", spinWheel);

/////// QUESTIONS !!!!

async function fetchQuestions() {
  try {
    const response = await fetch("questions.json");
    if (!response.ok) {
      throw new Error(
        "erreur dans ton fetch sur le try !!! " + response.status
      );
    }
    const data = await response.json();
    // const data = {
    //     "quizz": {
    //         "arts": {
    //             "débutant": [
    //                 {
    //                     "id": 1,
    //                     "question": "Qui est responsable, sur le plan artistique, de la création d'une affiche ?",
    //                     "propositions": [
    //                         "Affichiste",
    //                         "Designer",
    //                         "Cartonnier",
    //                         "Ciseleur"
    //                     ],
    //                     "reponse": "Affichiste",
    //                     "anecdote": "En France, des peintres renommés comme Henri de Toulouse-Lautrec ne dédaignent pas de travailler sur des affiches."
    //                 }
    //             ]
    //         },
    //         "divertissement": {
    //             "débutant": [
    //                 {
    //                     "id": 2,
    //                     "question": "Quel est le nom du personnage principal de la série 'Breaking Bad' ?",
    //                     "propositions": [
    //                         "Walter White",
    //                         "Jesse Pinkman",
    //                         "Saul Goodman",
    //                         "Gus Fring"
    //                     ],
    //                     "reponse": "Walter White",
    //                     "anecdote": "Bryan Cranston, qui joue Walter White, a remporté plusieurs Emmy Awards pour son rôle."
    //                 }
    //             ]
    //         },
    //         "culture générale": {
    //             "débutant": [
    //                 {
    //                     "id": 3,
    //                     "question": "Quelle est la capitale de la France ?",
    //                     "propositions": [
    //                         "Paris",
    //                         "Londres",
    //                         "Berlin",
    //                         "Madrid"
    //                     ],
    //                     "reponse": "Paris",
    //                     "anecdote": "Paris est connue comme la 'Ville Lumière'."
    //                 }
    //             ]
    //         },
    //         "musique": {
    //             "débutant": [
    //                 {
    //                     "id": 4,
    //                     "question": "Quel groupe a chanté 'Bohemian Rhapsody' ?",
    //                     "propositions": [
    //                         "Queen",
    //                         "The Beatles",
    //                         "The Rolling Stones",
    //                         "Pink Floyd"
    //                     ],
    //                     "reponse": "Queen",
    //                     "anecdote": "'Bohemian Rhapsody' est l'une des chansons les plus célèbres de Queen, sortie en 1975."
    //                 }
    //             ]
    //         },
    //         "histoire": {
    //             "débutant": [
    //                 {
    //                     "id": 5,
    //                     "question": "Qui était le premier président des États-Unis ?",
    //                     "propositions": [
    //                         "George Washington",
    //                         "Thomas Jefferson",
    //                         "Abraham Lincoln",
    //                         "John Adams"
    //                     ],
    //                     "reponse": "George Washington",
    //                     "anecdote": "George Washington est souvent appelé le 'Père de son pays'."
    //                 }
    //             ]
    //         },
    //         "sciences": {
    //             "débutant": [
    //                 {
    //                     "id": 6,
    //                     "question": "Quel est l'élément chimique ayant pour symbole 'O' ?",
    //                     "propositions": [
    //                         "Oxygène",
    //                         "Or",
    //                         "Osmium",
    //                         "Oganesson"
    //                     ],
    //                     "reponse": "Oxygène",
    //                     "anecdote": "L'oxygène est essentiel à la respiration des organismes vivants."
    //                 }
    //             ]
    //         }
    //     }
    // };

    return data;
  } catch (error) {
    console.error("erreur dans ton fetch sur le catch !!", error);
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

// à voir pour les accents : methode normalize é è à puis replace e,e a
// ou carrément la distance de Levenshtein !

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
  } else if (userAnswer === currentAnswerLowerCase) {
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
