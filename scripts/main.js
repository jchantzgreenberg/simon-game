'use strict'
var allowPlayerInput = function(){
  document.addEventListener('keydown', playerInput.keyDownButton.bind(playerInput))
}

var enableStartButton = function(){
  let startButton = document.getElementById('start')
  startButton.addEventListener('click', playerInput.startGame.bind(playerInput))
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
    setTimeout(this.slowLose.bind(this), 1000)
  },

  slowLose: function(){
    clearTimeout(this.lossTimeout)
    if (this.playersTurn) {
      this.lossTimeout = setTimeout(this.youLose,5000)
    }
  },

  beatLevel: function(){
    this.playersTurn = false  
    setTimeout(this.nextSequence.bind(this), 1000)
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
  },
 
  inputSequence: function(resolve){
    let i = 0
    let sequence = this.sequence
    let speedModifier = 1
    let speed;
    if (sequence.length > 5){
      speedModifier = 1 * (Math.pow(1.25, Math.floor((sequence.length - 2) / 4)))
      speed = 625 / speedModifier
    }
    let pressAll = () => {
      this.pressButton(this.playerControls[sequence[i]])
      if (i<=sequence.length){
        i++
        setTimeout(pressAll, speed, i)
      } else {
        resolve()
      }
    }
    pressAll()
  },

  nextSequence: function(){
    let nextMove = Math.floor(Math.random() * 4)
    this.sequence.push(nextMove)
    let turnText = document.getElementById('turn')
    turnText.innerText = 'LISTEN CAREFULLY'
    this.playersTurn = false   
    let inputSequence= new Promise(this.inputSequence.bind(this))
    inputSequence.then(this.playerTurnStart.bind(this))

  },

  startGame: function(){
    if (!this.gameStarted){
      this.gameStarted = true
      this.sequence = []
      this.nextSequence()
    }
  }
}

// var computerInput = {

//   sequenceLength: 0,

//   inputSequence: function(resolve){
//     let i = 0
//     let sequence = playerInput.sequence
//     function pressAll() {
//       playerInput.pressButton(playerInput.playerControls[sequence[i]])
//       if (i<=sequence.length){
//         i++
//         setTimeout(pressAll, 1000, i)
//       } else {
//         resolve()
//       }
//     }
//     pressAll()
//   },

//   nextSequence: function(){
//     let nextMove = Math.floor(Math.random() * 4)
//     playerInput.sequence.push(nextMove)
//     let turnText = document.getElementById('turn')
//     turnText.innerText = 'LISTEN CAREFULLY'
//     playerInput.playersTurn = false   
//     let inputSequence= new Promise(computerInput.inputSequence)
//     inputSequence.then(playerInput.playerTurnStart.bind(playerInput))

//   },

//   startGame: function(){
//     if (!this.gameStarted){
//       this.gameStarted = true
//       playerInput.sequence = []
//       computerInput.nextSequence()
//     }
//   }

// }

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

