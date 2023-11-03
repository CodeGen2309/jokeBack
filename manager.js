const manager = {
  currScene: 'lobby',

  scenes: {
    'startScreen': {
      admin: 'lobby',
      player: 'lobbyMobile'
    },

    'AskQuestions': {
      isLastQuestion: false,
      admin: 'waitScreen',
      player: 'mgetanswer'
    },

    'voting': {
      admin: '',
      player: '',

    },

    'waitPlayers': {
      admin: '',
      player: '',
    },

    'endGame': {
      admin: '',
      player: '',
    },
  },


  getCurrScene () {
    return this.currScene
  },

  setupQuest () {},
  startGame () {},
}


export default manager