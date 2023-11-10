import questions from './mocks/questions.js'


const riddler = {
  players: [],
  questions: questions,
  questTable: [],

  shuffleArray (arr) {
    arr.sort(() => Math.random() - 0.5);
  },


  setupQuestions (plList) {
    let plKeys, tempQuest

    plKeys = Object.keys(plList)
    this.shuffleArray(this.questions)

    plKeys.forEach((key, index, arr) => {
      tempQuest = this.setQuest(key, index, arr, plList)
      this.questTable.push(tempQuest)
    })

    return this.questTable
  },


  setQuest (key, index, arr, plList) {
    let firstPlayer = plList[key]
    let nextKey = arr[index + 1] || arr[0]
    let secondPlayer = plList[nextKey]
    let quest = {
      firstPlayer: key, secondPlayer: nextKey,
      firstAns: null, secondAns: null,
      voters: [],
      text: this.questions.pop()
    }

    firstPlayer.firstQst = quest.text
    secondPlayer.secondQst   = quest.text
    return quest
  },


  setupVotedAnswers (players) {
    let firstPlayer, secondPlayer

    for (let qst of this.questTable) {
      firstPlayer = players[qst.firstPlayer]
      secondPlayer = players[qst.secondPlayer]

      console.log(qst);
      console.log(firstPlayer);
      console.log(secondPlayer);

      qst.firstAns = firstPlayer.firstAns
      qst.secondAns = firstPlayer.secondAns
    }

    return this.questTable
  },


  getCurrQuestion (player) {
    if ( !player ) { return false }

    if ( player.firstAns == null )  { return player.firstQst }
    if ( player.secondAns == null ) { return player.secondQst }
    return false
  },


  setAnswer (player, answer) {
    if (!player) { return false }

    if (player.firstAns == null) { player.firstAns = answer }
    else { player.secondAns = answer }
    return true
  },


  checkAllAnswers (players) {
    let tempPlayer, checker

    checker = true
    for (let pl in players) {
      tempPlayer = players[pl]
      if (tempPlayer.firstAns == null) {checker = false}
      if (tempPlayer.secondAns == null) {checker = false}
    }

    return checker
  },

  sendNewQuest (playerID) {
    for (let qst of his.questTable) {
      if ( qst.voters.includes(playerID) ) { continue }
      if ( qst.firstPlayer == playerID )   { continue }
      if ( qst.secondPlayer == playerID )  { continue }
      return qst
    }

    return false
  },

  setVoter (playerID, questionText) {
    for (let qst of his.questTable) {
      if (qst.text == questionText) { 
        qst.voters.push(playerID)
      }
    }
  }
}


export default riddler