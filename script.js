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

trueButton.setAttribute("data-value", "true")
falseButton.setAttribute("data-value", "false")

let placar = 0
let contador = 0
let result, variable1, variable2, randomConective, notText

function startGame(){
  expressionsPanel.style.display = "block"
  trueButton.style.display = "inline-block"
  falseButton.style.display = "inline-block"
  startButton.style.display = "none"
  mainText.style.display = "none"
  resetButton.style.display = "inline-block"
  trueButton.addEventListener("click", verifyAnswer)
  falseButton.addEventListener("click", verifyAnswer)
  generateExpression() 
}
function generateExpression(){
  const conectives = ["AND", "OR", "NOT"]
  randomConective = conectives[Math.floor(Math.random() * conectives.length)]
  variable1 = Math.random() < 0.5
  variable2 = Math.random() < 0.5
  let hasNotConective = Math.random() < 0.5
  let replacedConective = Math.random() < 0.5 ? "AND" : "OR"

  if(randomConective === "NOT"){
    randomConective = replacedConective
  }
  if (randomConective === "AND") {
    result = hasNotConective ? variable1 && !variable2 : variable1 && variable2;
  } 
  else if (randomConective === "OR") {
    result = hasNotConective ? variable1 || !variable2 : variable1 || variable2;
  }
  notText = hasNotConective ? "NOT " : "";
  expressions.textContent = `Q = ${possibleValues[variable1]}, P = ${possibleValues[variable2]}, qual o resultado de Q ${randomConective} ${notText} P?`
}
function resetGame(){
  expressionsPanel.style.display = "none"
  trueButton.style.display = "none"
  falseButton.style.display = "none"
  startButton.style.display = "inline-block"
  mainText.style.display = "block"
  resetButton.style.display = "none"
  motivationalText.style.display ="none"
  expressions.textContent = ""
}
function verifyAnswer(event){
  let userAnswer = event.target.getAttribute("data-value") === "true"
  userAnswer === result ? placar++ : placar-- 
  placar = Math.max(0, placar);
  contador ++
  if(contador < 5){
    generateExpression()
  }
  else{
    spanPlacar.textContent = placar;
    spanPlacar.style.color = "red";
    spanPlacar.style.fontWeight = "bold"; 
    expressions.innerText = "Placar final: "
    expressions.appendChild(spanPlacar)
    trueButton.style.display = "none"
    falseButton.style.display = "none"
    motivationalText.style.display = "block"
    switch(placar){
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
        motivationalText.textContent = "Aeeeee agora já dá para começar a se gabar, sem vergonha! (Não sei se essa vírgula está no lugar certo...)"
        break
      case 5:
        motivationalText.textContent = "Parabéns, deve ter prestado atenção nas aulas ou foi pura cagada mesmo... joga aí de novo pra confirmar :)"
        break
    }
    placar = 0
    contador = 0
  }
}
startButton.addEventListener("click", startGame)
resetButton.addEventListener("click", resetGame)
