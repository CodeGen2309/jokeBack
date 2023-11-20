import questions from './mocks/questions.js'


const riddler = {
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
      tempQuest = this.createQuest(key, index, arr, plList)
    })

    return this.questTable
  },


  createQuest (key, index, arr, plList) {
    let firstPlayer = plList[key]
    let nextKey = arr[index + 1] || arr[0]
    let secondPlayer = plList[nextKey]

    let quest = {
      text: this.questions.pop(),
      firstAnswer:  { player: key, text: '', voters: [] },
      secondAnswer: { player: nextKey, text: '', voters: [] },
      isAnswered: false, isVoted: false
    }

    let questIndex = this.questTable.push(quest) - 1

    firstPlayer.firstQuest = questIndex
    secondPlayer.secondQuest = questIndex
    return quest
  },


  getCurrQuestion (player) {
    let qTable = this.questTable
    let firstID = player.firstQuest
    let secondID = player.secondQuest

    if (player.firstAnswer == null)  { return qTable[firstID] }
    if (player.secondAnswer == null) { return qTable[secondID] }

    if (
      player.firstAns != null && 
      player.secondAns != null
    )  
    { player.alreadyVoted = true }

    return false
  },


  getQuestionByID (questID) {
    return  this.questTable[questID]
  },

  setQuestVoted (questID) {
    this.questTable[questID]['isVoted'] = true
    return this.questTable[questID]
  },

  getQuestForVote () {
    let newQuest = undefined
    this.questTable.forEach( (item, index) => {
      if (!item.isVoted) {
        newQuest = index
        return newQuest
      }
    })

    return newQuest
  },


  setAnswer (playerID, player, answer) {
    let questID, question, firstAns, secondAns

    if (player.firstAnswer == null) {
      questID = player.firstQuest
      player.firstAnswer = answer
    }

    else if (player.secondAnswer == null) {
      questID = player.secondQuest
      player.secondAnswer = answer
    }

    question = this.questTable[questID]

    firstAns = question.firstAnswer
    secondAns = question.secondAnswer
    
    if( firstAns.player == playerID ) { firstAns.text = answer }
    if( secondAns.player == playerID ) { secondAns.text = answer }

    
    if ( firstAns.text != '' &&  secondAns.text != '' ) {
      question.isAnswered = true
    }

    return {player, question}
  },


  voteForAnswer (questID, answer, player) {
    let quest = this.getQuestionByID(questID)
    let voters = quest[answer]['voters']
    voters.push(player)
    return quest
  },


  getPlayerID (questID, answer) {
    let quest, playerID
    
    quest = this.getQuestionByID(questID)
    playerID = quest[answer]['player']

    return playerID
  },


  checkAllAnswers () {
    let checker = true

    for (let qst of this.questTable) {
      if (!qst.isAnswered) { checker = false }
    }

    return checker
  },  
}


export default riddler