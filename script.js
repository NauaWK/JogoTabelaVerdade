const possibleValues = {
  true: "V", 
  false: "F"
}
const uiElements = {
  expressionsPanel: document.getElementById("expressionsPanel"),
  mainText: document.getElementById("mainText"),
  expressions: document.getElementById("expressions"),
  motivationalText: document.getElementById("motivationalText"),
  difficultyPanel: document.getElementById("difficultyPanel"),
  chooseDifficultyText: document.getElementById("chooseDifficultyText"),
  questionCounter: document.getElementById("questionCounter")
}
const mainButtons = {
  startButton: document.getElementById("startButton"),
  trueButton: document.getElementById("trueButton"),
  falseButton: document.getElementById("falseButton"),
  resetButton: document.getElementById("resetButton")
}
const difficultyButtons = {
  easyButton: document.getElementById("easy"), 
  mediumButton: document.getElementById("medium"),
  hardButton: document.getElementById("hard")
}
let gameState = {
  questionNumber: 0,
  placar: 0,
  contador: 0,
  result: null,
  difficultyLevel: 0
}
let expressionsVariables = {
  variable1: null,
  variable2: null,
  randomConective: null, 
  hasNotConective: false, 
  hasNotConective1: false,
  hasNotConective2: false,
  notOperator: "",
  notOperator1: "",
  notOperator2: ""
};

let originalConectivesList = ["AND", "OR", "→", "XOR"]
let modifiedConectivesList

// habilitar a visualização da tela de seleção de dificuldades ao clicar no botão de Iniciar
function showDifficultyPanelElements(){
  toggleVisibility([uiElements.difficultyPanel], "flex")
  toggleVisibility([uiElements.chooseDifficultyText], "block")
  toggleVisibility([mainButtons.startButton, uiElements.mainText], "none")
}

// adicionar um ouvinte de eventos ("click") para cada botão de dificuldade e resgatar seu valor(data-value)
Object.values(difficultyButtons).forEach(button => {
  button.addEventListener("click", event => {
    gameState.difficultyLevel = Number(event.target.getAttribute("data-value"));
    setDifficulty(gameState.difficultyLevel); 
  });
});

// função para modificar a lista de conectivos de acordo com a dificuldade
function setDifficulty(level){
  modifiedConectivesList = [...originalConectivesList]
  switch(level){
    case 1: 
      modifiedConectivesList = modifiedConectivesList.filter(conective => !["→", "XOR"].includes(conective))
      break
    case 2:
      modifiedConectivesList = modifiedConectivesList.filter(conective => !["XOR"].includes(conective))
      break
    case 3:
      modifiedConectivesList = modifiedConectivesList.filter(conective => !["AND", "OR"].includes(conective))
      break  
  }
  startGame()
}

// função para alterar display dos elementos na página
function toggleVisibility(elements, displayType) {
  elements.forEach(el => el.style.display = displayType);
}
// função para atualizar o contador da questão atual
function updateQuestionCounter() {
  uiElements.questionCounter.innerHTML = `<span style="color:red; font-weight:bold;">${gameState.questionNumber}</span>/5`;
}
// função para iniciar o jogo
function startGame(){
  toggleVisibility([uiElements.expressionsPanel],"block")
  toggleVisibility([ mainButtons.trueButton, mainButtons.falseButton, mainButtons.resetButton, uiElements.questionCounter], "inline-block");
  toggleVisibility([mainButtons.startButton, uiElements.mainText, uiElements.difficultyPanel, uiElements.motivationalText, uiElements.chooseDifficultyText], "none");
  updateQuestionCounter()
  generateExpression() 
}
// função para gerar as expressões aleatóriamente
function generateExpression(){
  expressionsVariables.randomConective = modifiedConectivesList[Math.floor(Math.random() * modifiedConectivesList.length)]
  expressionsVariables.variable1 = Math.random() < 0.5
  expressionsVariables.variable2 = Math.random() < 0.5 
  let parenthesis1 = ""
  let parenthesis2 = ""

  // gerar NOT dinamicamente nas expressões a cada rodada, com base na dificuldade escolhida
  switch(gameState.difficultyLevel){
    case 1:
      expressionsVariables.hasNotConective = false;
      expressionsVariables.hasNotConective1 = Math.random() < 0.2
      expressionsVariables.hasNotConective2 = Math.random() < 0.2
      break
    case 2:
      expressionsVariables.hasNotConective = Math.random() < 0.5
      expressionsVariables.hasNotConective1 = Math.random() < 0.8
      expressionsVariables.hasNotConective2 = Math.random() < 0.8
      break
    case 3:
      expressionsVariables.hasNotConective = Math.random() < 0.7
      expressionsVariables.hasNotConective1 = expressionsVariables.hasNotConective2 = true
      break
  }
  const operatorsList = {
    "AND": (a, b) => a && b,
    "OR": (a, b) => a || b,
    "→": (a, b) => !a || b,
    "XOR": (a, b) => a !== b
  }
  if (operatorsList[expressionsVariables.randomConective]) {
    const operator = operatorsList[expressionsVariables.randomConective]; 
    gameState.result = operator(
      expressionsVariables.hasNotConective1 ? !expressionsVariables.variable1 : expressionsVariables.variable1,
      expressionsVariables.hasNotConective2 ? !expressionsVariables.variable2 : expressionsVariables.variable2
    );
  }
   expressionsVariables.notOperator = expressionsVariables.hasNotConective ? "NOT" : ""
  if(expressionsVariables.hasNotConective){
    parenthesis1 = "("
    parenthesis2 = ")"
    gameState.result = !gameState.result
  } 
  
  expressionsVariables.notOperator1 = expressionsVariables.hasNotConective1 ? "NOT" : ""
  expressionsVariables.notOperator2 = expressionsVariables.hasNotConective2 ? "NOT" : ""
  
  // expressão gerada aleatóriamente
  uiElements.expressions.textContent = `Q = ${possibleValues[expressionsVariables.variable1]}, P = ${possibleValues[expressionsVariables.variable2]}, qual o resultado de ${expressionsVariables.notOperator} ${parenthesis1} ${expressionsVariables.notOperator1} Q ${expressionsVariables.randomConective} ${expressionsVariables.notOperator2} P ${parenthesis2} ?`
}
// função para verificar a resposta do jogador
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
    uiElements.expressions.innerHTML = `Placar final: <span style="color: red; font-weight: bold;"> ${gameState.placar} </span>`
    toggleVisibility([mainButtons.trueButton, mainButtons.falseButton], "none")
    toggleVisibility([uiElements.motivationalText], "inline-block")
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
// função para reinicar o jogo
function resetGame(){
  uiElements.mainText.style.display = "block"
  toggleVisibility([mainButtons.startButton], "inline-block");
  toggleVisibility([uiElements.expressionsPanel, mainButtons.trueButton, mainButtons.falseButton, mainButtons.resetButton, motivationalText,questionCounter], "none");
  uiElements.expressions.textContent = ""
  questionCounter.innerHTML = ""
  gameState.contador = 0
  gameState.placar = 0
  gameState.questionNumber = 0
}
mainButtons.startButton.addEventListener("click", showDifficultyPanelElements)
mainButtons.trueButton.addEventListener("click", verifyAnswer)
mainButtons.falseButton.addEventListener("click", verifyAnswer)
mainButtons.resetButton.addEventListener("click", resetGame)
