'use strict'
var allowPlayerInput = function(){
  document.addEventListener('keydown', playerInput.keyDownButton.bind(playerInput))
}

var enableStartButton = function(){
  let startButton = document.getElementById('start')
  startButton.addEventListener('click', computerInput.startGame)
}

var playerInput = {

  playerControls: ['w', 'e', 's', 'd'],

  sequence: [],

  position: 0, 

  lossTimeout: 0,

  playersTurn: false,

  toggleTurn: function(){},

  youLose: function(){
    let turnText = document.getElementById('turn')
    turnText.innerText = 'YOU LOSE'
    this.playersTurn = false
    soundPlayer.playLose()
  },

  playerTurnStart: function() {
    let turnText = document.getElementById('turn')
    turnText.innerText = 'PLAYER GO'
    this.position = 0
    this.playersTurn = true
    setTimeout(playerInput.slowLose, 1000)
  },

  slowLose: function(){
    clearTimeout(playerInput.lossTimeout)
    if (playerInput.playersTurn) {
      playerInput.lossTimeout = setTimeout(playerInput.youLose,5000)
    }
  },

  beatLevel: function(){
    this.playersTurn = false      
    setTimeout(computerInput.nextSequence, 1000)
  },

  wrongKeyLose: function(key, position){
    if (key != this.playerControls[this.sequence[position]]){
      clearTimeout(this.lossTimeout)
      this.youLose()
    } else if (position == this.sequence.length-1) {
      clearTimeout(this.lossTimeout)
      this.beatLevel(key)
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
    if (!this.playersTurn){
      return
    }
    this.pressButton(key)
  },

  pressButton: function(key){
    let simonButton
    switch(key){
    case 'w':
    case 'e':
    case 's':
    case 'd':
      simonButton = document.querySelector('[data-key='+key+']')
      this.keyDown(simonButton, key)
    }
  },

  getSimonButton(key){
    return document.querySelector('[data-key='+key+']')
  }
}

var computerInput = {

  sequenceLength: 0,

  inputSequence: function(resolve){
    let i = 0
    let sequence = playerInput.sequence
    function pressAll() {
      playerInput.pressButton(playerInput.playerControls[sequence[i]])
      if (i<=sequence.length){
        i++
        setTimeout(pressAll, 1000, i)
      } else {
        resolve()
      }
    }
    pressAll()
  },

  nextSequence: function(){
    let nextMove = Math.floor(Math.random() * 4)
    playerInput.sequence.push(nextMove)
    let turnText = document.getElementById('turn')
    turnText.innerText = 'LISTEN CAREFULLY'
    playerInput.playersTurn = false   
    let inputSequence= new Promise(computerInput.inputSequence)
    inputSequence.then(playerInput.playerTurnStart.bind(playerInput))

  },

  startGame: function(){
    if (!this.gameStarted){
      this.gameStarted = true
      playerInput.sequence = []
      computerInput.nextSequence()
    }
  }

}

var soundPlayer = {
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

allowPlayerInput()
enableStartButton()

