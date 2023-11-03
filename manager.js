const manager = {
  currStage: {
    admin: 'lobby',
    player: 'auth'
  },

  stages: {
    'startScreen': {
      admin: 'lobby',
      player: 'auth'
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


  initGame () {
    this.currStage = this.stages.startScreen
  },

  getCurrScreen (isAdmin) {
    let currScreen

    if (isAdmin) { currScreen = this.currStage.admin }
    else {currScreen = this.currStage.player}
    return currScreen
  },

  startGame () {},
}


export default manager