// The Question
const question = [
  {
    question: 'What is the capital of France?',
    choices: ['London', 'Berlin', 'Paris', 'Madrid'],
    answer: 2
  },
  {
    question: 'Which planet is know as the red planet?',
    choices: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    answer: 1
  },
  {
    question: 'What language is primarily used for web development?',
    choices: ['Java', 'Python', 'C++', 'JavaScript'],
    answer: 3
  },
  {
    question: 'What is the largest mammal in the world?',
    choices: ['Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    answer: 1
  },
  {
    question: 'Who painted the Mona Lisa?',
    choices: [
      'Vincent van Gogh',
      'Pablo Picasso',
      'Leonardo da Vinci',
      'Michelangelo'
    ],
    answer: 2
  },
  {
    question: 'Which country is home to the Kangaroo?',
    choices: ['New Zealand', 'South Africa', 'Australia', 'Brazil'],
    answer: 2
  },
  {
    question: 'What is the chemical symbol for Gold?',
    choices: ['Go', 'Gd', 'Au', 'Ag'],
    answer: 2
  },
  {
    question: 'What is the largest ocean on Earth?',
    choices: [
      'Atlantic ocean',
      'Indian ocean',
      'Arctic ocean',
      'Pacific ocean'
    ],
    answer: 3
  },
  {
    question: 'What is the main component of the Sun?',
    choices: ['Liquid Lava', 'Hydrogen', 'Oxygen', 'Carbon'],
    answer: 1
  },
  {
    question: 'Which year did World War 2 end?',
    choices: ['1943', '1945', '1946', '1944'],
    answer: 1
  }
]

// Variables
let currentQuestionIndex = 0
let score = 0
let doublePointsAvailable = 1
let removeTwoAvailable = 1
let stopTimerAvailable = 1
let questionOrder = []
let doublePointsActive = false
let correctAnswerIndex
let timerInterval
let gameActive = false
let timeLeft = 15

//DOM Element
const startScreen = document.getElementById('startScreen')
const quizContainer = document.getElementById('quizContainer')
const startButton = document.getElementById('startButton')
const questionElement = document.getElementById('question')
const scoreElement = document.getElementById('score')
const timerElement = document.getElementById('timer')
const choicesElement = [
  document.getElementById('choice0'),
  document.getElementById('choice1'),
  document.getElementById('choice2'),
  document.getElementById('choice3')
]
const guessButton = [
  document.getElementById('guess0'),
  document.getElementById('guess1'),
  document.getElementById('guess2'),
  document.getElementById('guess3')
]
const doublePointsButton = document.getElementById('doublePoints')
const removeTwoButton = document.getElementById('removeTwo')
const stopTimerButton = document.getElementById('stopTimer')
const restartButton = document.getElementById('restart')

const initializeGame = () => {
  startScreen.style.display = 'none'
  quizContainer.style.display = 'block'

  questionOrder = [...Array(question.length).keys()]
  shuffleArray(questionOrder)

  currentQuestionIndex = 0
  score = 0
  doublePointsAvailable = 1
  removeTwoAvailable = 1
  stopTimerAvailable = 1
  doublePointsActive = false
  gameActive = true

  loadQuestions()
  startTime()
  updateScore()
}

startButton.addEventListener('click', initializeGame)

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const startTime = () => {
  timeLeft = 15
  if (timerInterval) clearInterval(timerInterval)

  timerElement.textContent = timeLeft
  timerInterval = setInterval(() => {
    timeLeft--
    timerElement.textContent = timeLeft

    if (timeLeft <= 0) {
      clearInterval(timerInterval)
      handleTimeOut()
    }
  }, 1000)
}

const handleTimeOut = () => {
  clearInterval(timer)
  gameActive = false

  for (let i = 0; i < 4; i++) {
    guessButton[i].disabled = true
  }

  guessButton[correctAnswerIndex].style.backgroundColor = '#4caf50'
  questionElement.textContent = 'Time is up!'

  setTimeout(() => {
    currentQuestionIndex++
    if (currentQuestionIndex < question.length) {
      loadQuestions()
    } else {
      endGame()
    }
  }, 3000)
}

const stopTimer = () => {
  if (stopTimerAvailable > 0) {
    clearInterval(timerInterval)
    stopTimerAvailable--
    timerElement.textContent = 'Timer stopped'
  }
}
stopTimerButton.addEventListener('click', stopTimer)

const loadQuestions = () => {
  if (!gameActive) return

  if (currentQuestionIndex >= question.length) {
    endGame()
    return
  }
  const questionIndex = questionOrder[currentQuestionIndex]
  const questionObj = question[questionIndex]
  questionElement.textContent = questionObj.question
  correctAnswerIndex = questionObj.answer

  for (let i = 0; i < 4; i++) {
    choicesElement[i].textContent = questionObj.choices[i]
    guessButton[i].disabled = false
    choicesElement[i].parentElement.classList.remove('hidden', 'disabled')
  }
  startTime()
}

const checkAnswer = (selectedIndex) => {
  if (!gameActive) return

  clearInterval(timer)
  gameActive = false

  for (let i = 0; i < 4; i++) {
    guessButton[i].disabled = true
  }

  if (selectedIndex === correctAnswerIndex) {
    const points = doublePointsActive ? 10 : 5
    score += points
    updateScore()
  }

  if (doublePointsActive) {
    doublePointsActive = false
  }

  setTimeout(() => {
    currentQuestionIndex++
    if (currentQuestionIndex < question.length) {
      gameActive = true
      loadQuestions()
    } else {
      endGame
    }
  }, 2000)
}
guessButton.forEach((button, index) => {
  button.addEventListener('click', () => checkAnswer(index))
})

const updateScore = () => {
  scoreElement.textContent = `Score: ${score}`
}

const doublePoint = () => {
  if (doublePointsAvailable > 0) {
    doublePointsActive = true
    doublePointsAvailable--
    alert('Double points activated for the next correct answer!')
  }
}
doublePointsButton.addEventListener('click', doublePoint)

const removeTwoAnswers = () => {
  if (removeTwoAvailable > 0) {
    let incorrectIndices = [0, 1, 2, 3].filter((i) => i !== correctAnswerIndex)

    shuffleArray(incorrectIndices)
    const toRemove = incorrectIndices.slice(0, 2)

    toRemove.forEach((index) => {
      guessButton[index].disabled = true
      choicesElement[index].parentElement.classList.add('hidden')
    })
    removeTwoAvailable--
  }
}
removeTwoButton.addEventListener('click', removeTwoAnswers)

const endGame = () => {
  clearInterval(timer)
  gameActive = false
  questionElement.textContent = 'Quiz Completed!'

  for (let i = 0; i < 4; i++) {
    choicesElement[i].disabled = true
  }
  scoreElement.textContent = `Your Score: ${score} out of ${
    question.length * 5
  }`

  doublePointsButton.disabled = true
  removeTwoButton.disabled = true
  stopTimerButton.disabled = true
  restartButton.style.display = 'inline-block'
}

const restartGame = () => {
  startScreen.style.display = 'block'
  quizContainer.style.display = 'none'

  restartButton.style.display = 'inline=block'
}
restartButton.addEventListener('click', restartGame)
