const startButton = document.getElementById("startButton")
const expressionsPanel = document.getElementById("expressionsPanel")
const trueButton = document.getElementById("trueButton")
const falseButton = document.getElementById("falseButton")
const mainText = document.getElementById("mainText")
const resetButton = document.getElementById("resetButton")
const expressions = document.getElementById("expressions")
const motivationalText = document.getElementById("motivationalText")
const spanPlacar = document.createElement("span");
const questionCounter = document.getElementById("questionCounter")
const difficultyPanel = document.getElementById("difficultyPanel")
const chooseDifficultyText = document.getElementById("chooseDifficultyText")
const possibleValues = {true: "V", false: "F"}

let gameState = {
  questionNumber: 0,
  placar: 0,
  contador: 0,
  result: null,
  difficultyLevel: null
}

const difficultyButtons = {
  easyButton: document.getElementById("easy"), 
  mediumButton: document.getElementById("medium"),
  hardButton: document.getElementById("hard")
}

Object.values(difficultyButtons).forEach(button => {
  button.addEventListener("click", event => {
    gameState.difficultyLevel = event.target.getAttribute("data-value");
    setDifficulty(gameState.difficultyLevel);
  });
});

let variable1, variable2, randomConective, notText1, notText2, hasNotConective, hasNotConective1, hasNotConective2
const originalConectives = ["AND", "OR", "→", "XOR"]
let conectives = [...originalConectives]

function setDifficulty(level){
  gameState.difficultyLevel = level
  conectives = [...originalConectives]
  switch(level){
    case "1": 
      conectives = conectives.filter(conective => !["→", "XOR"].includes(conective))
      break
    case "2":
      conectives = conectives.filter(conective => conective !== "XOR")
      break
    case "3":
      conectives = conectives.filter(conective => !["AND", "OR"].includes(conective))
      break
  }
  startGame()
}

function toggleVisibility(elements, displayType) {
  elements.forEach(el => el.style.display = displayType);
}

function showDifficultyPanel(){
  toggleVisibility([difficultyPanel], "flex")
  toggleVisibility([chooseDifficultyText], "block")
  toggleVisibility([startButton, mainText], "none")
}

function updateQuestionCounter() {
  questionCounter.innerHTML = `<span style="color:red; font-weight:bold;">${gameState.questionNumber}</span> /5`;
}
function startGame(){
  expressionsPanel.style.display = "block"
  toggleVisibility([trueButton, falseButton, resetButton, questionCounter], "inline-block");
  toggleVisibility([startButton, mainText, difficultyPanel, chooseDifficultyText], "none");
  updateQuestionCounter()
  generateExpression() 
}
function generateExpression(){
  randomConective = conectives[Math.floor(Math.random() * conectives.length)]
  variable1 = Math.random() < 0.5
  variable2 = Math.random() < 0.5 
  let parenthesis1 = ""
  let parenthesis2 = ""

  // gerar NOT dinamicamente a cada rodada com base na dificuldade
  switch(gameState.difficultyLevel){
    case "1":
      hasNotConective = false;
      hasNotConective1 = Math.random() < 0.2
      hasNotConective2 = Math.random() < 0.2
      break
    case "2":
      hasNotConective = Math.random() < 0.5
      hasNotConective1 = Math.random() < 0.5
      hasNotConective2 = Math.random() < 0.5
      break
    case "3":
      hasNotConective = Math.random() < 0.7
      hasNotConective1 = hasNotConective2 = true
      break
  }

  const operatorsList = {
    "AND": (a, b) => a && b,
    "OR": (a, b) => a || b,
    "→": (a, b) => !a || b,
    "XOR": (a, b) => a !== b
  }
  if (operatorsList[randomConective]) {
    const operator = operatorsList[randomConective]; 
    gameState.result = operator(
        hasNotConective1 ? !variable1 : variable1,
        hasNotConective2 ? !variable2 : variable2,
    );
  }
  notOperator = hasNotConective ? "NOT" : ""
  if(hasNotConective){
    parenthesis1 = "("
    parenthesis2 = ")"
    gameState.result = !gameState.result
  } 
  notOperator1 = hasNotConective1 ? "NOT" : ""
  notOperator2 = hasNotConective2 ? "NOT" : ""
  
  // expressão gerada aleatóriamente
  expressions.textContent = `Q = ${possibleValues[variable1]}, P = ${possibleValues[variable2]}, qual o resultado de ${notOperator} ${parenthesis1} ${notOperator1} Q ${randomConective} ${notOperator2} P ${parenthesis2} ?`
}
function resetGame(){
  mainText.style.display = "block"
  toggleVisibility([startButton], "inline-block");
  toggleVisibility([expressionsPanel, trueButton, falseButton, resetButton, motivationalText,questionCounter], "none");
  expressions.textContent = ""
  questionCounter.innerHTML = ""
  gameState.contador = 0
  gameState.placar = 0
  gameState.questionNumber = 0
}
function verifyAnswer(event){
  let userAnswer = event.target.getAttribute("data-value") === "true"

  if (userAnswer === gameState.result) {
  gameState.placar++;
  } 
  else if (gameState.placar > 0) {
  gameState.placar--;
  }
  gameState.questionNumber ++
  updateQuestionCounter()
  gameState.contador ++
  if(gameState.contador < 5){
    generateExpression()
  }
  else{
    // alterar o estilo apenas dos pontos do placar
    spanPlacar.textContent = gameState.placar; 
    spanPlacar.style.color = "red";
    spanPlacar.style.fontWeight = "bold"; 
    expressions.innerText = "Placar final: "
    expressions.appendChild(spanPlacar)
    toggleVisibility([trueButton, falseButton], "none")
    motivationalText.style.display = "block"
    switch(gameState.placar){
      case 0:
        motivationalText.textContent = "Bom, pelo menos você testou se o placar estava funcionando..."
        break
      case 1:
        motivationalText.textContent = "É, poderia ter sido pior..."
        break
      case 2:
        motivationalText.textContent = "2 pontos... isso já é o dobro do fracasso anterior ;)"
        break
      case 3:
        motivationalText.textContent = "É, já está acima da média pelo menos..."
        break
      case 4:
        motivationalText.textContent = "Ae agora já dá para contar nos dedos, sem vergonha! (Não sei se essa vírgula tá no lugar certo...)"
        break
      case 5:
        motivationalText.textContent = "Parabéns, deve ter prestado atenção nas aulas ou foi pura cagada mesmo... joga aí de novo pra confirmar :)"
        break
    }
  }
}
startButton.addEventListener("click", showDifficultyPanel)
trueButton.addEventListener("click", verifyAnswer)
falseButton.addEventListener("click", verifyAnswer)
resetButton.addEventListener("click", resetGame)
