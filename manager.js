import fs from "fs"

class manager {
  constructor () {
    this.currStage = null
    this.currRound = null


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


      'comicsQuest': {
        currComics: '',
        questText: '',
        handler: this.comicsQuestHandler,
      },


      'comicsVote': {
        handler: this.comicsVoteHandler,
      },


      'comicsResults': {
        handler: this.comicsResultsHandler,
      },


      'endGame': {
        admin: '',
        player: '',
      },
    }


    this.rounds = {
      'firstRound': {
        'points': 1000,
        'pointsForVote': 0,
        'nextRound': 2,
      },

      'secondRound': {
        'points': 2000,
        'pointsForVote': 0,
        'nextRound': 3,
      },

      'thirdRound': {},
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
    let fAnsNull, sAnsNull

    if (isAdmin) { return 'waitscreen' }

    fAnsNull = player.firstAnswer == null
    sAnsNull = player.secondAnswer == null

    if ( fAnsNull || sAnsNull) {
      return 'mgetanswer' 
    }

    return 'waitmobile'
  }


  voteHandler (player, isAdmin) {
    if (isAdmin) { return 'votescreen' }

    let currQuest = this.currentQuest

    if (player.alreadyVoted)              { return 'waitmobile' }
    if (player.firstQuest == currQuest )  { return 'waitmobile' }
    if (player.secondQuest == currQuest ) { return 'waitmobile' }

    return 'mvoteanswer'
  }


  comicsQuestHandler (player, isAdmin) {
    if (isAdmin) { return 'comicsquest' }
    if (player.comicsAnswer != null) { return 'waitmobile' } 
    return 'mcomicsamswer'
  }

  comicsVoteHandler (player, isAdmin) {}
  comicsResultsHandler (player, isAdmin) {}


// handlers ===============



// controllers ===============

  startGame () {
    this.currStage = this.stages.AskQuestions
    this.currRound = this.rounds.firstRound
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


  calcPointsForVote (playersCount) {
    let firstPoints = this.rounds.firstRound.points
    let secondPoints = this.rounds.secondRound.points
    let firstCalc = Math.floor(firstPoints / playersCount)
    let secondCalc = Math.floor(secondPoints / playersCount)

    this.rounds.firstRound.pointsForVote = firstCalc
    this.rounds.secondRound.pointsForVote = secondCalc

    return {firstCalc, secondCalc}
  }


  getNextRoundIndex () {
    return this.currRound.nextRound
  }

  
  finishRound () {
    this.currStage = this.stages.endRound
    return true
  }


  startNextRound () {
    console.log(this.currRound);

    if (this.currRound.nextRound == 2) { 
      this.currRound = this.rounds.secondRound
    }

    if (this.currRound == 3) { 
      this.currRound = this.rounds.thirdRound
      this.currStage = this.stages.comicsQuest
    }

    console.log(this.currRound);
    return true
  }


  showLeaderBoard () {}


// controllers ===============


}


export default new manager()