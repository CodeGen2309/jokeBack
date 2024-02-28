import express from "express"
import path from "path"
import cors from "cors"
import ip from "ip"


import cookieParser from "cookie-parser"
import cookie from "cookie-session"


import utils from "./utils.js"
import plList from "./players.js"
import manager from "./manager.js"
import riddler from "./riddler.js"


// Create App ------------
const PORT = 8082
const ipaddress = ip.address()
const fullAddress = `http://${ipaddress}:${PORT}`

const app = express()
const publicFolder = path.resolve('./public')

app.use( cors() )
app.use( express.static(publicFolder) )

// Create App ------------

// module setup ----------
app.utils = utils
app.plList = plList
app.manager = manager
app.riddler = riddler
// module setup ----------


// setUp mocks ---------
utils.createQr(
  `./public/img/qr.jpg`, `http://${ipaddress}:8080/`
)

plList.setIP(ipaddress, PORT)
plList.initAvatars()

// setUp mocks ---------

let checkcer = 0

// setup Routes ------------------
app.get('/api/get-nickname', (req, res) => {
  let nick = plList.getFreeNickName()
  res.json({nick})
})


app.get('/api/add-player', (req, res) => {
  let nickname = req.query.nickname

  if (nickname == 'cdrAdmin') {
    return true
  }

  let id = utils.getRandomInt(0, 99999)

  while (plList.players[id] != undefined) {
    id = utils.getRandomInt(0, 99999)
  }

  let player = plList.addPlayer(id, nickname)
  res.json(player)
})


app.get('/api/get-players', (req, res) => {
  let table = plList.getPlayersTable()
  res.json(table)
})


app.get('/api/check-player', (req, res) => {
  let id = req.query.playerID
  let inGame = plList.checkPlayer(id)
  res.json(inGame)
})


app.get('/api/get-curr-screen', (req, res) => {
  let isAdmin = utils.checkAdmin(ipaddress, req.ip, req.query)
  let player = plList.getPlayerByID(req.query.playerID)
  let screen = manager.getCurrScreen(player, isAdmin)


  res.json(screen)
})


app.get('/api/start-game', (req, res) => {
  let points, playersArr
  
  riddler.setupQuestions(plList.players)
  playersArr = Object.keys(plList.players)
  points = manager.calcPointsForVote(playersArr.length)

  manager.startGame()


  res.json({points})
})


app.get('/api/get-next-round-index', (req, res) => {
  let round = manager.getNextRoundIndex()
  return res.json(round)
})


app.get('/api/start-new-round', (req, res) => {
  plList.resetRoundPoints()
  plList.resetPlayersAnswers()
  plList.resetVotedPlayers()
  
  riddler.questTable = []
  riddler.setupQuestions(plList.players)

  manager.startNextRound()
  res.json(true)
})


app.get('/api/get-curr-quest', (req, res) => {
  let player, currQuest

  player = plList.getPlayer(req.query.playerID)
  currQuest = riddler.getCurrQuestion(player)
  res.json(currQuest)
})


app.get('/api/set-answer', (req, res) => {
  let playerID, player, answer, result, isAll

  playerID = req.query.playerID
  player = plList.getPlayer(playerID)
  answer = req.query.answer
  result = riddler.setAnswer(playerID, player, answer)
  isAll  = riddler.checkAllAnswers()

  if (isAll) { 
    manager.startVoting()
  }

  res.json(result)
})


app.get('/api/add-bots', (req, res) => {
  let count = req.query.count || 5
  let players = plList.addBots(count)
  res.json(players)
})


app.get('/api/get-qrcode', (req, res) => { 
  res.json(`${fullAddress}/img/qr.jpg`)
})


app.get('/api/get-quest-for-vote', (req, res) => {
  let questID, quest, playerID,
  fpID, spID, endOfRound, isPlayerAnswered,
  firstPlayer, secondPlayer, falseQuest


  falseQuest = {
    quest: false, firstPlayer: false, secondPlayer: false,
  }

  playerID = req.query.playerID
  questID = manager.getVotedQuest()
  endOfRound = questID == undefined


  if (endOfRound) {
    return res.json(falseQuest)
  }

  quest = riddler.getQuestionByID(questID)
  fpID = quest.firstAnswer.player
  spID = quest.secondAnswer.player

  isPlayerAnswered = fpID == playerID || spID == playerID

  if (isPlayerAnswered) {
    plList.setPlayerVoted(fpID)
    plList.setPlayerVoted(spID)
    return res.json(falseQuest)
  }

  firstPlayer = plList.getPlayerByID(fpID)
  secondPlayer = plList.getPlayerByID(spID)

  return res.json({quest, firstPlayer, secondPlayer})
})


app.get('/api/finish-round', (req, res) => {
  manager.finishRound()
  res.json(true)
})


app.get('/api/set-vote', (req, res) => {
  let answer, questID, playerID,
  points, isAll

  answer = req.query.answer
  questID = manager.getVotedQuest()

  playerID = riddler.getPlayerID(questID, answer)
  plList.setPlayerVoted(req.query.playerID)
  riddler.voteForAnswer(questID, answer, req.query.playerID)

  res.json(true)
})


app.get('/api/get-vote-result', async (req, res) => {
  let questID, quest, fPlayerID, sPlayerID,
  firstPlayer, secondPlayer,
  firstVoters, secondVoters, roundPoints,
  voteRes

  questID = manager.getVotedQuest()
  roundPoints = manager.currRound.points
  quest = riddler.getQuestionByID(questID)

  fPlayerID = quest.firstAnswer.player
  sPlayerID = quest.secondAnswer.player

  firstPlayer = plList.getPlayerByID(fPlayerID)
  secondPlayer = plList.getPlayerByID(sPlayerID)
  
  firstVoters = plList.getPlayersIcons(
    quest.firstAnswer.voters
  )

  secondVoters = plList.getPlayersIcons(
    quest.secondAnswer.voters
  )

  quest.firstAnswer.player = firstPlayer
  quest.firstAnswer.voters = firstVoters

  quest.secondAnswer.player = secondPlayer
  quest.secondAnswer.voters = secondVoters

  voteRes = riddler.calcVoteResult(questID, roundPoints)
  plList.addPoints(fPlayerID, voteRes.fPoints)
  plList.addPoints(sPlayerID, voteRes.sPoints)

  manager.setVotedQuest(questID)
  return res.json(quest)
})


app.get('/api/set-quest-for-vote', (req, res) => {
  let questID, quest, newQuestID

  questID = manager.getVotedQuest()
  quest = riddler.getQuestionByID(questID)

  riddler.setQuestVoted(questID)
  newQuestID = riddler.getQuestForVote()
  manager.setVotedQuest(newQuestID)

  plList.resetQuestPoints()
  plList.resetVotedPlayers()


  res.json({newQuestID})
})


app.get('/api/auto-answer', (req, res) => {
  let players, tmPlayer, isAll

  players = plList.players

  for (let pl in players) {
    tmPlayer = players[pl]
    tmPlayer.firstAnswer = null
    tmPlayer.secondAnswer = null

    riddler.setAnswer(pl, tmPlayer, 'Пиздани')
    riddler.setAnswer(pl, tmPlayer, 'Что нибудь )))')

    riddler.setComicsAnswer(
      pl, tmPlayer.avatar, tmPlayer.nickname, 
      tmPlayer.comicsAnswer
    )
  }

  isAll = riddler.checkAllAnswers()
  if (isAll) { manager.startVoting() }
  return res.json(players)
})


app.get('/api/get-comics', (req, res) => {
  let comics = riddler.getComicsQuest()
  return res.json(comics)
})


app.get('/api/set-comics-answer', (req, res) => {
  let player, answer, isAll, nickname,
  avatar

  player = plList.getPlayer(req.query.playerID)
  nickname = player.nickname
  avatar = player.avatar
  answer = req.query.answer
  player.comicsAnswer = answer

  riddler.setComicsAnswer(req.query.playerID, avatar, nickname, answer)
  isAll  = plList.checkComicsAnswers()

  if (isAll) {
    console.log('COMICS ANSWERS ALL!!!!!');
    manager.startComicsVoting()
  }
  
  return res.json(true)
})


app.get('/api/start-comics-voting', (req, res) => {
  manager.startComicsVoting()
  return res.json(true)
})


app.get('/api/start-voting', (req, res) => {
  let currStage, voteStage

  currStage = manager.currStage
  voteStage = manager.stages.voteStage

  if (currStage != voteStage) {
    manager.startVoting()
    return res.json(true)
  }

  return res.json(false)
})



app.get('/api/get-comics-answers', (req, res) => {
  let answers, ownAnswer

  answers = riddler.getComicsAnswers()

  for (let item of answers) {
    ownAnswer = item.playerID == req.query.playerID
    if ( ownAnswer) { item.hidden = true }
    else { item.hidden = false }
  }

  return res.json(answers)
})


app.get('/api/vote-comics-answer', (req, res) => {
  let tmPlayer, voter, answer,
  gold, silver, bronze, isAll

  // for test
  let botsKeys = Object.keys(plList.players)
  let botId = botsKeys[0]
  // for test


  tmPlayer = plList.getPlayerByID(req.query.playerID)
  tmPlayer.alreadyVoted = true

  voter = {
    nickname: tmPlayer.nickname, avatar: tmPlayer.avatar
  }

  gold = req.query.gold
  riddler.voteForComicsAnswer(gold, voter)
  riddler.addComicsPoints(gold, 3)

  silver = req.query.silver
  riddler.voteForComicsAnswer(silver, voter)
  riddler.addComicsPoints(silver, 2)

  bronze = req.query.bronze
  riddler.voteForComicsAnswer(bronze, voter)
  riddler.addComicsPoints(bronze, 1)

  riddler.calculateComicsVotes()

  isAll = plList.checkVotedPlayers()
  if (isAll) { manager.finishRound() }



  return res.json(true)
})


app.get('/api/get-comics-vote-results', (req, res) => {
  let result = riddler.calculateComicsVotes()
  // utils.shuffleArray(result)
  return res.json(result)
})


app.get('/api/check-admin', (req, res) => {
  let isAdmin = utils.checkAdmin(ipaddress, req.ip, req.query)
  return res.json(isAdmin)
})


app.get('/api/add-comics-points', (req, res) => {
  let users, currUser, currPoints

  users = req.query

  for (let item in users) {
    currUser = item
    currPoints = users[item]
    plList.addPoints(currUser, Number(currPoints))
  }

  return res.json(true)
})


app.get('/api/start-comics-result', (req, res) => {
  manager.startComicsResult()
  return res.json(true)
})


app.get('/api/template', (req, res) => {
  return res.json(true)
})



// setup Routes ------------------
let devStartGame = () => {  
  riddler.setupQuestions(plList.players)
  manager.startGame()

  let playList  = plList.players
  let questList = riddler.questTable

  console.log({playList, questList});
}


let devAutoAnswer = () => {
  let players, tmPlayer, isAll

  players = plList.players

  for (let pl in players) {
    if ( pl.includes('ffff')) { continue }

    
    tmPlayer = players[pl]
    tmPlayer.firstAnswer = null
    tmPlayer.secondAnswer = null

    riddler.setAnswer(pl, tmPlayer, 'Пиздани')
    riddler.setAnswer(pl, tmPlayer, 'Что нибудь )))')

    riddler.setComicsAnswer(
      pl, tmPlayer.avatar, tmPlayer.nickname, 
      tmPlayer.comicsAnswer
    )
  }

  for (let qst of riddler.questTable) {
    qst.isAnswered = true
  }

  
  isAll = riddler.checkAllAnswers()

  if (isAll) {
    // utils.shuffleArray(riddler.questTable)
    manager.startVoting()
  }
  return players
}



// Run server!!!!---------------
app.listen(PORT)
// devStartGame()
// devAutoAnswer()
// plList.addRandomAutoPoints()
// manager.startNextRound()
// manager.startNextRound()



// Log dev data
// console.log(fullAddress);