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
  variable3 : null,
  hasVariable3: false,
  randomConective1: null, 
  randomConective2: null,
  hasNotConective: false, 
  hasNotConective1: false,
  hasNotConective2: false,
  variable3Text1: "",
  variable3Text2: "",
  notOperator: "",
  notOperator1: "",
  notOperator2: ""
};

const originalConectivesList = ["AND", "OR", "→", "XOR"]
let modifiedConectivesList
const operatorsList = {
    "AND": (a, b) => a && b,
    "OR": (a, b) => a || b,
    "→": (a, b) => !a || b,
    "XOR": (a, b) => a !== b
  }

//habilitar a visualização do painel de seleção de dificuldades ao clicar no botão de "Iniciar!"
function showDifficultyPanelElements(){
  toggleVisibility([uiElements.difficultyPanel], "flex")
  toggleVisibility([uiElements.chooseDifficultyText], "block")
  toggleVisibility([mainButtons.startButton, uiElements.mainText], "none")
}

//função para atualizar o contador da questão atual
function updateQuestionCounter() {
  uiElements.questionCounter.innerHTML = `<span style="color:red; font-weight:bold;">${gameState.questionNumber}</span>/5`;
}

//função para alterar display dos elementos na página
function toggleVisibility(elements, displayType) {
  elements.forEach(el => el.style.display = displayType);
}

//adicionar um ouvinte de eventos ("click") para cada botão de dificuldade e resgatar seu valor (data-value)
Object.values(difficultyButtons).forEach(button => {
  button.addEventListener("click", event => {
    gameState.difficultyLevel = Number(event.target.getAttribute("data-value"));
    setDifficulty(gameState.difficultyLevel); 
  });
});

//função para modificar a lista de conectivos de acordo com a dificuldade
function setDifficulty(level){
  modifiedConectivesList = [...originalConectivesList]
  switch(level){
    case 1: 
      modifiedConectivesList = modifiedConectivesList.filter(conective => !["→", "XOR"].includes(conective))
      break
    case 2:
      modifiedConectivesList = modifiedConectivesList.filter(conective => !["XOR"].includes(conective))
      break
  }
  startGame()
}

//função para iniciar o jogo
function startGame(){
  toggleVisibility([uiElements.expressionsPanel],"block")
  toggleVisibility([ mainButtons.trueButton, mainButtons.falseButton, mainButtons.resetButton, uiElements.questionCounter], "inline-block");
  toggleVisibility([mainButtons.startButton, uiElements.mainText, uiElements.difficultyPanel, uiElements.motivationalText, uiElements.chooseDifficultyText], "none");
  updateQuestionCounter()
  generateExpression() 
}

//função para gerar as expressões aleatóriamente
function generateExpression(){
  expressionsVariables.randomConective1 = originalConectivesList[Math.floor(Math.random() * originalConectivesList.length)]
  expressionsVariables.randomConective2 = modifiedConectivesList[Math.floor(Math.random() * modifiedConectivesList.length)]
  expressionsVariables.variable1 = Math.random() < 0.5
  expressionsVariables.variable2 = Math.random() < 0.5
  expressionsVariables.variable3 = Math.random() < 0.5 
  const originalVariable1 = expressionsVariables.variable1;
  const originalVariable2 = expressionsVariables.variable2;

  const parenthesisObj = {
    parenthesis1: "",
    parenthesis2: "",
    parenthesis3: "",
    parenthesis4: ""
  }
  const difficultyConfig = {
  1: {hasVariable3: 0, hasNotConective: 0.1, hasNotConective1: 0.5, hasNotConective2: 0.5},
  2: {hasVariable3: 0.2, hasNotConective: 0.5, hasNotConective1: 0.7, hasNotConective2: 0.7},
  3: {hasVariable3: 1, hasNotConective: 0.7, hasNotConective1: 0.8, hasNotConective2: 0.8}
  }
  
  //gerar NOT dinamicamente nas expressões a cada rodada, com base na dificuldade escolhida, além de verficar se a variável 3 (R) tem valor true
  function applyNotAndVariable3Logic(){
    const configSelected = difficultyConfig[gameState.difficultyLevel]
    expressionsVariables.hasNotConective = Math.random() < configSelected.hasNotConective
    expressionsVariables.hasNotConective1 = Math.random() < configSelected.hasNotConective1
    expressionsVariables.hasNotConective2 = Math.random() < configSelected.hasNotConective2
    expressionsVariables.hasVariable3 = Math.random() < configSelected.hasVariable3
    }  

  applyNotAndVariable3Logic()
  
  if(expressionsVariables.hasNotConective1){
    expressionsVariables.notOperator1 = "NOT"
    expressionsVariables.variable1 = !expressionsVariables.variable1;
  }  
  else{
    expressionsVariables.notOperator1 = ""
  }
  
  if(expressionsVariables.hasNotConective2){
    expressionsVariables.notOperator2 = "NOT"
    expressionsVariables.variable2 = !expressionsVariables.variable2;
  }
  else{
    expressionsVariables.notOperator2 = ""
  }

  gameState.result = operatorsList[expressionsVariables.randomConective2](
    expressionsVariables.variable1, expressionsVariables.variable2
  );

  if(expressionsVariables.hasNotConective){
    expressionsVariables.notOperator = "NOT"
    parenthesisObj.parenthesis2 = "("
    parenthesisObj.parenthesis3 = ")"
    gameState.result = !gameState.result;
  } 
  else{
    expressionsVariables.notOperator = ""
    parenthesisObj.parenthesis2 = ""
    parenthesisObj.parenthesis3 = ""
  }

  if(expressionsVariables.hasVariable3){
    expressionsVariables.variable3Text1 = `R = ${possibleValues[expressionsVariables.variable3]},`
    expressionsVariables.variable3Text2 = "R"
    parenthesisObj.parenthesis1 = "("
    parenthesisObj.parenthesis4 = ")"
    gameState.result = operatorsList[expressionsVariables.randomConective1](
    expressionsVariables.variable3, gameState.result )
  }
  else{
    expressionsVariables.variable3Text1 = ""
    expressionsVariables.variable3Text2 = ""
    expressionsVariables.randomConective1 = ""
  }

  //expressão gerada
  uiElements.expressions.textContent = `${expressionsVariables.variable3Text1} Q = ${possibleValues[originalVariable1]} e P = ${possibleValues[originalVariable2]}. Qual o resultado de ${expressionsVariables.variable3Text2} ${expressionsVariables.randomConective1} ${parenthesisObj.parenthesis1} ${expressionsVariables.notOperator} ${parenthesisObj.parenthesis2} ${expressionsVariables.notOperator1} Q ${expressionsVariables.randomConective2} ${expressionsVariables.notOperator2} P ${parenthesisObj.parenthesis3} ${parenthesisObj.parenthesis4} ?`
}

//função para verificar a resposta do jogador
function verifyAnswer(event){
  let userAnswer = event.target.getAttribute("data-value")

  if (userAnswer == String(gameState.result)){
  gameState.placar++;
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

    //mostrar uma mensagem diferente para o jogador de acordo com o placar final
    switch(gameState.placar){
      case 0:
        motivationalText.textContent = "Pelo menos você testou se o placar estava funcionando..."
        break
      case 1:
        motivationalText.textContent = "Bem, poderia ter sido pior..."
        break
      case 2:
        motivationalText.textContent = "2 pontos... melhor se esforçar mais na próxima!"
        break
      case 3:
        motivationalText.textContent = "É, já está acima da média pelo menos..."
        break
      case 4:
        motivationalText.textContent = "Boa! Mais 1 ponto e voce gabarita!"
        break
      case 5:
        motivationalText.textContent = "Parabéns! Deve ter prestado atenção nas aulas... ou será que foi pura sorte? Eu jogaria denovo pra confirmar..."
        break
    }
  }
}
// função para reinicar o jogo
function resetGame(){
  uiElements.mainText.style.display = "block"
  toggleVisibility([mainButtons.startButton], "inline-block");
  toggleVisibility([uiElements.expressionsPanel, mainButtons.trueButton, mainButtons.falseButton, mainButtons.resetButton, uiElements.motivationalText, uiElements.questionCounter], "none");
  uiElements.expressions.textContent = ""
  gameState.contador = 0
  gameState.placar = 0
  gameState.questionNumber = 0
}
mainButtons.startButton.addEventListener("click", showDifficultyPanelElements)
mainButtons.trueButton.addEventListener("click", verifyAnswer)
mainButtons.falseButton.addEventListener("click", verifyAnswer)
mainButtons.resetButton.addEventListener("click", resetGame)
