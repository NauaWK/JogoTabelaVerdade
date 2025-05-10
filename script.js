const startButton = document.getElementById("startButton")
const expressionsPanel = document.getElementById("expressionsPanel")
const trueButton = document.getElementById("trueButton")
const falseButton = document.getElementById("falseButton")
const mainText = document.getElementById("mainText")
const resetButton = document.getElementById("resetButton")
const expressions = document.getElementById("expressions")
const motivationalText = document.getElementById("motivationalText")
const possibleValues = {true: "V", false: "F"}
const spanPlacar = document.createElement("span");
const questionCounter = document.getElementById("questionCounter")

trueButton.setAttribute("data-value", "true")
falseButton.setAttribute("data-value", "false")

let gameState = {
  questionNumber: 0,
  placar: 0,
  contador: 0,
  result: null
}

let variable1, variable2, randomConective, notText1, notText2

function updateQuestionCounter() {
  questionCounter.innerHTML = `<span style="color:red; font-weight:bold;">${gameState.questionNumber}</span> /5`;
}
function toggleVisibility(elements, displayType) {
  elements.forEach(el => el.style.display = displayType);
}
function startGame(){
  expressionsPanel.style.display = "block"
  toggleVisibility([trueButton, falseButton, resetButton, questionCounter], "inline-block");
  toggleVisibility([startButton, mainText], "none");
  updateQuestionCounter()
  generateExpression() 
}
function generateExpression(){
  const conectives = ["AND", "OR", "NOT"]
  randomConective = conectives[Math.floor(Math.random() * conectives.length)]
  variable1 = Math.random() < 0.5
  variable2 = Math.random() < 0.5
  let hasNotConective1 = Math.random() < 0.5
  let hasNotConective2 = Math.random() < 0.5
  let replacedConective = Math.random() < 0.5 ? "AND" : "OR"

  if(randomConective === "NOT"){
    randomConective = replacedConective
  }
  const operators = {
    "AND": (a, b) => a && b,
    "OR": (a, b) => a || b
}
  if (operators[randomConective]) {
    const op = operators[randomConective]; 
    gameState.result = op(
        hasNotConective1 ? !variable1 : variable1,
        hasNotConective2 ? !variable2 : variable2
    );
}
  notText1 = hasNotConective1 ? "NOT" : ""
  notText2 = hasNotConective2 ? "NOT" : ""
  expressions.textContent = `Q = ${possibleValues[variable1]}, P = ${possibleValues[variable2]}, qual o resultado de ${notText1} Q ${randomConective} ${notText2} P?`
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
trueButton.addEventListener("click", verifyAnswer)
falseButton.addEventListener("click", verifyAnswer)
startButton.addEventListener("click", startGame)
resetButton.addEventListener("click", resetGame)