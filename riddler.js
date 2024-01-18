import fs from 'fs'
import questions from './mocks/newQuestions.js'
import cPoints from './mocks/comicsPoints.js'
import utils from './utils.js';

// Потом можно будет удалить
import nickNames from './mocks/nickNames.js';


const riddler = {
  questions: questions,
  questTable: [],
  comicsQuest: null,
  comicsAnswers: [],


  setupQuestions (plList) {
    let plKeys, tempQuest

    plKeys = Object.keys(plList)
    utils.shuffleArray(this.questions)

    plKeys.forEach((key, index, arr) => {
      tempQuest = this.createQuest(key, index, arr, plList)
    })

    this.setupComics()
    return this.questTable
  },


  setupComics () {
    let comicsFolder, comicsLinks

    comicsLinks = []
    comicsFolder = fs.readdirSync('./public/img/comicRound/')

    for (let cms of comicsFolder) {
      comicsLinks.push(`/img/comicRound/${cms}`)
    }
    
    utils.shuffleArray(comicsLinks)
    this.comicsQuest = comicsLinks.pop()
    return comicsLinks
  },


  getComicsQuest () {
    return this.comicsQuest
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


  setComicsAnswer (playerID, avatar, nikckname, text) {
    this.comicsAnswers.push({
      playerID, avatar, nikckname, text, voters:[],
      points: 0
    })
  },


  voteForComicsAnswer (answerID, voter) {
    let currAnswer = this.comicsAnswers[answerID]
    currAnswer.voters.push(voter)
  },


  voteForAnswer (questID, answer, playerID) {
    let quest = this.getQuestionByID(questID)
    let voters = quest[answer]['voters']
    voters.push(playerID)
    return quest
  },


  calcVoteResult (questID, roundPoints) {
    let quest, fPoints, sPoints,
    fVoters, sVoters, votersCount, ptsPerVote

    quest = this.questTable[questID]

    fVoters = quest.firstAnswer.voters.length
    sVoters = quest.secondAnswer.voters.length
    votersCount = fVoters + sVoters
    ptsPerVote = 0

    if (votersCount > 0) {
      ptsPerVote = Math.round(roundPoints / votersCount)
    }
    

    fPoints = ptsPerVote * fVoters
    sPoints = ptsPerVote * sVoters

    return { ptsPerVote, fPoints, sPoints }
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


  getComicsAnswers () {
    return this.comicsAnswers
  },


  calculateComicsVotes () {
    let currAns, tempVote, voters,
    votersCount

    // calc votersCount
    for (let ans in this.comicsAnswers) {
      currAns = this.comicsAnswers[ans]
      currAns.voteCount = currAns.voters.length
    }

    // sorting answers 
    this.comicsAnswers.sort((a, b) => {
      return a.voteCount > b.voteCount ? -1 : 1
    })

    for (let index in cPoints) {
      this.comicsAnswers[index]['points'] = cPoints[index]
    }

    return this.comicsAnswers
  }
}


export default riddler