let playerInput = {

  allowPlayerInput: function(){
    document.addEventListener('keydown', (event) => {this.keyDown(event)})
    document.addEventListener('keyup', (event) => {this.keyUp(event)})
  },

  enableStartButton: function(){
    let startButton = document.getElementById('start')
    startButton.addEventListener('click', () => {this.gameStart()})
  },

  playerControls: ['w', 'e', 's', 'd'],

  sequence: [],

  position: 0, 

  lossTimeout: 0,

  difficultyLevel: 0,

  finalSequenceLength: [8, 14, 20, 31],

  playersTurn: false,

  playerTurnStart: function() {
    let turnText = document.getElementById('turn')
    turnText.innerText = 'PLAYER GO'
    this.position = 0
    this.playersTurn = true
    setTimeout(() => {this.slowLose()}, 1000)
  },

  slowLose: function(){
    clearTimeout(this.lossTimeout)
    if (this.playersTurn) {
      this.lossTimeout = setTimeout(() => {this.youLose()},5000)
    }
  },

  youLose: function(){
    let turnText = document.getElementById('turn')
    turnText.innerText = 'YOU LOSE'
    soundPlayer.playLose()
    this.playersTurn = false
    this.gameEnd()
  },

  

 
  beatLevel: function(sequenceLength){
    let turnText = document.getElementById('turn')
    let difficultyLevel = this.difficultyLevel
    let finalSequenceLength = this.finalSequenceLength[difficultyLevel]
    this.playersTurn = false 
    if ( (difficultyLevel < 4) && (sequenceLength >= finalSequenceLength) ){
      turnText.innerText = 'YOU WIN'
      this.gameEnd()
    } else {
      setTimeout(() => {this.nextSequence()}, 1000)
    }
  },

  wrongKeyLose: function(key, position){
    if (key != this.playerControls[this.sequence[position]]){
      clearTimeout(this.lossTimeout)
      this.youLose()
    } else if (position == this.sequence.length-1) {
      clearTimeout(this.lossTimeout)
      this.beatLevel(this.sequence.length)
    }
  },

  buttonDown: function(key){
    let simonButton = this.getSimonButton(key)
    simonButton.classList.add('pressed')
    soundPlayer.playSound(key)
  },

  buttonUp: function(key){
    let simonButton = this.getSimonButton(key)
    simonButton.classList.remove('pressed')
    soundPlayer.pauseSound(key)
    if (this.playersTurn){
      this.slowLose()
      this.wrongKeyLose(key, this.position)
      this.position++
    }
  },

  keyDown: function(event){
    let key = event.key
    if (this.playerControls.includes(key) && this.playersTurn){
      this.buttonDown(key)
    }
  },

  keyUp: function(event){
    let key = event.key
    if (this.playerControls.includes(key) && this.playersTurn){
      this.buttonUp(key)
    }
  },

  getSimonButton: function(key){
    return document.querySelector(`[data-key=${key}]`)
  },

  inputTime: function(sequenceLength){
    let inputTime = 420
    if ( (sequenceLength > 5) && (sequenceLength < 15) ) {
      inputTime -= 100 * (Math.floor((sequenceLength - 2) / 4))
    } else if (sequenceLength >= 15) {
      inputTime = 120
    }
    return inputTime
  },

  inputSignal: function(key, speed){
    this.buttonDown(key)
    setTimeout(() => {this.buttonUp(key)}, speed)
  },
 
  inputSequence: function(resolve){
    let i = 0
    let sequence = this.sequence
    let inputTime = this.inputTime(sequence.length)
    let timedInput = () => {
      if (i < sequence.length){
        this.inputSignal(this.playerControls[sequence[i]], inputTime)
        setTimeout(timedInput, inputTime+50)
        i++
      } else {
        resolve()
      }
    }
    timedInput()
  },

  nextSequence: function(){
    let nextMove = Math.floor(Math.random() * 4)
    let turnText = document.getElementById('turn')
    let inputSequence
    this.sequence.push(nextMove)
    this.playersTurn = false
    turnText.innerText = 'LISTEN CAREFULLY'   
    inputSequence = new Promise((resolve) => {this.inputSequence(resolve)})
    inputSequence.then(() => {this.playerTurnStart()})
  },

  gameStart: function(){
    if (!this.gameStarted){
      let startButton = document.getElementById('start')
      startButton.disabled = true
      this.gameStarted = true
      this.sequence = []
      this.setDifficulty()
      this.nextSequence()
    }
  },

  gameEnd: function(){ 
    let startButton = document.getElementById('start')
    startButton.disabled = false
    this.gameStarted = false
    this.enableDifficultySelect()
  },  

  setDifficulty: function(){
    let difficultySelect = document.getElementById('difficulty')
    this.difficultyLevel = difficultySelect.options[difficultySelect.selectedIndex].value
    difficultySelect.disabled = true
  },

  enableDifficultySelect: function(){
    let difficultySelect = document.getElementById('difficulty')
    difficultySelect.disabled = false
  }
}

let soundPlayer = {
  sounds: {
    'w': new Audio('sounds/green.wav'), 
    'e': new Audio('sounds/red.wav'), 
    's': new Audio('sounds/yellow.wav'), 
    'd': new Audio('sounds/blue.wav'),
    'lose': new Audio('sounds/lose.wav')
  },

  playSound: function(soundName){
    this.sounds[soundName].currentTime = 0
    this.sounds[soundName].play()
  },

  pauseSound: function(soundName){
    this.sounds[soundName].pause()
  },

  playLose: function(){
    soundPlayer.playSound('lose')
  },

}

playerInput.allowPlayerInput()
playerInput.enableStartButton()

