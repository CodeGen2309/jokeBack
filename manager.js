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
        currentQuest: null,
        roundPoints: {},
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

    if ( player.firstAnswer == null || player.secondAnswer == null ) 
    { return 'mgetanswer' }

    return 'waitmobile'
  }


  voteHandler (player, isAdmin) {
    if (isAdmin) { return 'votescreen' }
    if (player.alreadyVoted) { return 'waitmobile' }

    return 'mvoteanswer'
  }


// handlers ===============



// controllers ===============

  startGame () {
    this.currStage = this.stages.AskQuestions
  }


  startVoting () {
    this.stages.voteStage.currentQuest = 0
    this.currStage = this.stages.voteStage
  }


  startQuest () {
    this.currStage = this.stages.AskQuestions
  }


  getVotedQuest () {
    return this.stages.voteStage.currentQuest
  }


  setVotedQuest (qst) {
    this.voteStage.voteQuest = qst
  }


  addPoint (player) {
  }


  showRoundPoints () {
    return true
  }

  showLeaderBoard () {}

// controllers ===============


}


export default new manager()