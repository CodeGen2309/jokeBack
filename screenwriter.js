const screenwriter = {
  currScene: scenes.startScreen,

  scenes: {
    'startScreen': {
      admin: '/lobby',
      player: '/lobbyMobile'
    },

    'AskQuestions': {
      isLastQuestion: false,
      haveQuestions: true,
      admin: '/waitScreen',
      player: '/mgetanswer'
    },

    'voting': {},

    'waitPlayers': {},

    'endGame': {},
  },


  setupQuest () {},
}


export default screenwriter