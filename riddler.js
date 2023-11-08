import questions from './mocks/questions.js'


const riddler = {
  players: [],
  questions: questions,
  questTable: [],

  shuffleArray (arr) {
    arr.sort(() => Math.random() - 0.5);
  },


  setupQuestions (plList) {
    let plKeys, currPlayer, nextKey,
    nextPlayer, tempQuest

    this.shuffleArray(this.questions)
    plKeys = Object.keys(plList)

    plKeys.forEach(key => {
      currPlayer = plList[key]
      currPlayer.firstQst = this.questions.pop()
    });

    
    plKeys.forEach((key, index, arr) => {
      currPlayer = plList[key]
      nextKey = arr[index + 1]
      nextPlayer = plList[nextKey]
      
      if (!nextPlayer) {
        nextKey = arr[0]
        nextPlayer = plList[nextKey]
      }
      
      nextPlayer.secondQst = currPlayer.firstQst
    });

    return plList
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
}


export default riddler