'use strict'


let playerInput = {

  allowPlayerInput: function(){
    document.addEventListener('keydown', (event) => {this.keyDownButton(event)})
  },

  enableStartButton: function(){
    let startButton = document.getElementById('start')
    startButton.addEventListener('click', () => {this.startGame()})
  },

  // enableDifficultySelect: function(){
  //   let difficultyInput = document.querySelector('#difficulty')
  //   difficultyInput.oninput = function() {
  //     this.difficultyLevel = difficultyInput.value - 1
  //   }
  // },

  playerControls: ['w', 'e', 's', 'd'],

  sequence: [],

  position: 0, 

  lossTimeout: 0,

  difficultyLevel: 0,

  finalSequenceLength: [8, 14, 20, 31],

  playersTurn: false,

  repeatPress: false,

  toggleTurn: function(){},

  youLose: function(){
    let turnText = document.getElementById('turn')
    turnText.innerText = 'YOU LOSE'
    this.playersTurn = false
    soundPlayer.playLose()
    this.gameStarted = false
  },

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

  beatLevel: function(sequenceLength){
    let turnText = document.getElementById('turn')
    this.playersTurn = false 
    if (sequenceLength < this.finalSequenceLength[this.difficultyLevel]){
      setTimeout(() => {this.nextSequence()}, 1000)
    } else {
      turnText.innerText = 'YOU WIN'
      this.gameStarted = false
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

  keyDown: function(simonButton, key){
    simonButton.classList.add('pressed')
    setTimeout( () =>  simonButton.classList.remove('pressed'), 100)
    soundPlayer.playSound(key)
    if (this.playersTurn){
      this.slowLose()
      this.wrongKeyLose(key, this.position)
      this.position++
    }
  },

  keyDownButton: function(event){
    let key = event.key
    if (this.playerControls.includes(key) && this.playersTurn){
      this.pressButton(key)
    }
  },

  pressButton: function(key){
    let simonButton
    simonButton = document.querySelector('[data-key='+key+']')
    this.keyDown(simonButton, key)
  },

  getSimonButton: function(key){
    return document.querySelector('[data-key='+key+']')
  },

  modifiedSpeed: function(speed, sequenceLength){
    let speedModifier = 1
    if ( (sequenceLength > 5) && (sequenceLength < 15) ) {
      speedModifier = .8 ** (Math.floor((sequenceLength - 2) / 4))
    } else if (sequenceLength >= 15) {
      speedModifier = .8 ** 3
    }
    return speed * speedModifier
  },
 
  inputSequence: function(resolve){
    let i = 0
    let sequence = this.sequence
    let speed = this.modifiedSpeed(625, sequence.length)
    let pressAll = () => {
      if (i < sequence.length){
        this.pressButton(this.playerControls[sequence[i]])
        setTimeout(pressAll, speed, i)
        i++
      } else {
        resolve()
      }
    }
    pressAll()
  },

  nextSequence: function(){
    let nextMove = Math.floor(Math.random() * 4)
    let turnText = document.getElementById('turn')
    let inputSequence
    turnText.innerText = 'LISTEN CAREFULLY'
    this.sequence.push(nextMove)
    this.playersTurn = false   
    inputSequence = new Promise((resolve) => {this.inputSequence(resolve)})
    inputSequence.then(() => {this.playerTurnStart()})
  },

  startGame: function(){
    let difficultySelect = document.getElementById('difficulty')
    if (!this.gameStarted){
      this.gameStarted = true
      this.sequence = []
      this.difficultyLevel = difficultySelect.options[difficultySelect.selectedIndex].value
      this.nextSequence()
    }
  }
}

let soundPlayer = {
  sounds: {
    'w': new Audio('sounds/a.wav'), 
    'e': new Audio('sounds/s.wav'), 
    's': new Audio('sounds/d.wav'), 
    'd': new Audio('sounds/f.wav'),
    'lose': new Audio('sounds/lose.wav')
  },

  playSound: function(soundName){
    this.sounds[soundName].currentTime = 0
    this.sounds[soundName].play()
  },

  playLose: function(){
    soundPlayer.playSound('lose')
  },

}

playerInput.allowPlayerInput()
playerInput.enableStartButton()
//playerInput.enableDifficultySelect()

