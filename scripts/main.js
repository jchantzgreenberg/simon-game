'use strict'
var allowPlayerInput = function(){
  document.addEventListener('keydown', playerInput.keyDownButton.bind(playerInput))
}

var enableStartButton = function(){
  let startButton = document.getElementById('start')
  startButton.addEventListener('click', computerInput.startGame)
}

var playerInput = {

  moveList: ['w', 'e', 's', 'd'],

  sequence: [],

  position: 0, 

  timeout: 0,

  playersTurn: false,

  toggleTurn: function(){},

  youLose: function(){
    let turnText = document.getElementById('turn')
    turnText.innerText = 'YOU LOSE'
    playerInput.playersTurn = false
    soundPlayer.playLose()
  },

  playerTurnStart: function() {
    let turnText = document.getElementById('turn')
    turnText.innerText = 'PLAYER GO'
    playerInput.position = 0
    playerInput.playersTurn = true
    setTimeout(playerInput.slowLose, 1000)
  },

  slowLose: function(key){
    clearTimeout(playerInput.timeout)
    if (playerInput.playersTurn) {
      playerInput.timeout = setTimeout(playerInput.youLose,5000)
    }
  },

  beatLevel: function(key){
    playerInput.playersTurn = false      
    setTimeout(computerInput.nextSequence, 1000)
  },

  wrongKeyLose: function(key, position){
    if (key != this.moveList[this.sequence[position]]){
      clearTimeout(this.timeout)
      playerInput.youLose()
    } else if (position == this.sequence.length-1) {
      clearTimeout(this.timeout)
      playerInput.beatLevel(key)
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

  keyUp: function(simonButton){
    simonButton.classList.remove('pressed')
  },


  keyDownButton: function(event){
    let key = event.key
    if (!this.playersTurn){
      return
    }
    playerInput.pressButton(key, playerInput.keyDown.bind(this))
  },

  keyUpButton: function (event){
    if (!this.playersTurn){
      return
    }
    let key = event.key
    playerInput.pressButton(key, playerInput.keyUp.bind(this))
  },

  pressButton: function(key, callback){
    let simonButton
    switch(key){
    case 'w':
    case 'e':
    case 's':
    case 'd':
      simonButton = document.querySelector('[data-key='+key+']')
      callback(simonButton, key)
    }
  },

  getSimonButton(key){
    return document.querySelector('[data-key='+key+']')
  }
}

var computerInput = {

  sequenceLength: 0,

  inputStep: function(key){ 
    // function keyUp(key){
    //   playerInput.pressButton(key, playerInput.keyUp.bind(playerInput))
    // }
    playerInput.pressButton(key, playerInput.keyDown.bind(playerInput)) 
    // setTimeout(keyUp, 200, key)
  },

  inputSequence: function(resolve, reject){
    let i = 0;
    let sequence = playerInput.sequence
    computerInput.sequenceLength = sequence.length
    setTimeout( function pressAll() {
      computerInput.inputStep(playerInput.moveList[sequence[i]])
      if (i<=computerInput.sequenceLength){
        i++
        setTimeout(pressAll, 1000, i)
      } else {
        resolve()
      }
    }, 0);
  },

  nextSequence: function(){
    let nextMove = Math.floor(Math.random() * 4)
    playerInput.sequence.push(nextMove)
    let turnText = document.getElementById('turn')
    turnText.innerText = 'LISTEN CAREFULLY'
    playerInput.playersTurn = false   
    let inputSequence= new Promise(computerInput.inputSequence)
    inputSequence.then(playerInput.playerTurnStart)

  },

  startGame: function(){
    playerInput.sequence = []
    computerInput.nextSequence()
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

