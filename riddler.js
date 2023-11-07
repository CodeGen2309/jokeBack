import questions from './mocks/questions.js'


const riddler = {
  players: [],
  questions: questions,
  questTable: null,

  shuffleArray (arr) {
    arr.sort(() => Math.random() - 0.5);
  },


  setupQuestions (plList) {
    let plKeys, currPlayer, nextKey,
    nextPlayer

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
    let currQuest

    if (!playerIP) { return false }

    if ( player.firstAns == null ) { currQuest = player.firstQst }
    else { currQuest = player.secondQst }
    return currQuest
  },
}


export default riddler