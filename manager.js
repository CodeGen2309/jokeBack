class manager {
  constructor () {
    this.currStage = null


    this.stages = {
      'lobby': {
        handler: this.lobbyStage
      },

      'AskQuestions': {
        handler: this.askQuestHandler
      },


      'voteStage': {
        currentQuest: null,
        currRound: 1,
        roundPoints: {},
        handler: this.voteHandler,
      },

      'endRound': {
        handler: this.endRoundHandler
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

  endRoundHandler (player, isAdmin) {
    if (isAdmin) {return 'leaderboard'}
    else { return 'mscreenfocus' }
  }

  askQuestHandler (player, isAdmin) {
    if (isAdmin) { return 'waitscreen' }

    if ( player.firstAnswer == null || 
      player.secondAnswer == null
    ) 
    { return 'mgetanswer' }

    return 'waitmobile'
  }


  voteHandler (player, isAdmin) {
    if (isAdmin) { return 'votescreen' }

    console.log('STAGE!!!!!');
    let currQuest = this.currentQuest

    if (player.alreadyVoted)              { return 'waitmobile' }
    if (player.firstQuest == currQuest )  { return 'waitmobile' }
    if (player.secondQuest == currQuest ) { return 'waitmobile' }

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


  stopVoting () {
    this.stages.voteStage.currentQuest = undefined
  }


  getVotedQuest () {
    return this.stages.voteStage.currentQuest
  }


  setVotedQuest (qst) {
    this.stages.voteStage.currentQuest = qst
  }

  
  finishRound () {
    this.currStage = this.stages.endRound
    return true
  }


  showLeaderBoard () {}


  startSecondRound () {
    this.stages.voteStage.currRound = 2
    return true
  }


  startThirdRound () {
    this.stages.voteStage.currRound = 3
    return true
  }

// controllers ===============


}


export default new manager()