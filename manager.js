class manager {
  constructor () {
    this.currStage = null
    this.currRoun = 1


    this.stages = {
      'lobby': {
        handler: this.lobbyStage,
      },

      'AskQuestions': {
        handler: this.askQuestHandler
      },


      'voteStage': {
        voteQuest: null,
        handler: this.voteHandler
      },


      'endGame': {
        admin: '',
        player: '',
      },
    }


    this.initGame()
  }

  initGame () {
    this.currStage = this.stages.lobby
  }


// handlers ===============

  initLobby () {
    this.currStage = this.stages.startScreen
  }

  getCurrScreen (player, isAdmin) {
    return this.currStage.handler(player, isAdmin)
  }

  lobbyStage (player, isAdmin) {
    if (isAdmin) { return 'lobby' }

    if (!player) { return 'auth' }
    else { return 'lobbymobile' }
  }


  askQuestHandler (player, isAdmin) {
    if (isAdmin) { return 'waitscreen' }

    if (
      player.firstAns == null || 
      player.secondAns == null
    ) { return 'mgetanswer' }

    return 'waitmobile'
  }


  voteHandler (player, isAdmin) {
    if (isAdmin) { return 'voting' }
    if (player.alreadyVoted) { return 'waitmobile' }
    return 'mvoteanswer'    
  }


// handlers ===============



// controllers ===============

  startGame () {
    this.currStage = this.stages.AskQuestions
  }


  startVoting () {
    this.currStage = this.stages.voteStage
  }


  startQest () {
    this.currStage = this.stages.AskQuestions
  }

  showRoundPoints () {
    return true
  }

  showLeaderBoard () {}

// controllers ===============


}


export default new manager()