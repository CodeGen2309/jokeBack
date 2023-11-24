import express from "express"
import path from "path"
import cors from "cors"
import ip from "ip"


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
app.use(express.static(publicFolder))
// Create App ------------


// setUp mocks ---------
utils.createQr(`./public/img/qr.jpg`, `http://${ipaddress}:8080/`)
plList.setIP(ipaddress, PORT)
plList.initAvatars()
// setUp mocks ---------


// setup Routes ------------------
app.get('/api/get-nickname', (req, res) => {
  let nick = plList.getFreeNickName()
  res.json(nick)
})


app.get('/api/add-player', (req, res) => {
  let ip = req.ip
  let nickname = req.query.nickname
  let player = plList.addPlayer(ip, nickname)

  res.json(player)
})


app.get('/api/get-players', (req, res) => {
  let table = plList.getPlayersTable()
  res.json(table)
})


app.get('/api/check-player', (req, res) => {
  let ipaddress = req.ip
  let inGame = plList.checkPlayer(ipaddress)
  res.json(inGame)
})


app.get('/api/get-curr-screen', (req, res) => {
  let isAdmin = utils.checkAdmin(ipaddress, req.ip)
  let player = plList.getPlayer(req.ip)

  let screen = manager.getCurrScreen(player, isAdmin)
  res.json(screen)
})


app.get('/api/start-game', (req, res) => {
  plList.addBots(4)
  riddler.setupQuestions(plList.players)
  manager.startGame()

  res.json(true)
})




app.get('/api/start-new-round', (req, res) => {
  let currRound = manager.stages.voteStage.currRound

  plList.resetRoundPoints()
  plList.resetPlayersAnswers()

  if (currRound == 1) {manager.startSecondRound()}
  if (currRound == 2) {manager.startThirdRound()}


  riddler.questTable = []
  riddler.setupQuestions(plList.players)
  
  console.log('NEW ROUND!!!');
  manager.startQuest()

  res.json(true)
})


app.get('/api/get-curr-quest', (req, res) => {
  let player, currQuest

  player = plList.getPlayer(req.ip)
  currQuest = riddler.getCurrQuestion(player)
  res.json(currQuest)
})


app.get('/api/set-answer', (req, res) => {
  let playerID, player, answer, result, isAll

  playerID = req.ip
  player = plList.getPlayer(playerID)
  answer = req.query.answer
  result = riddler.setAnswer(playerID, player, answer)
  isAll  = riddler.checkAllAnswers()

  if (isAll) { manager.startVoting() }
  
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


app.get('/api/add-point', (req, res) => { 
  let playerID = req.query.playerid

  let result = plList.addPoint(playerID)
  let players = plList.players

  res.json(players)
})


app.get('/api/get-quest-for-vote', (req, res) => {
  let questID, quest, playerID,
  fpID, spID, endOfRound, isPlayerAnswered,
  firstPlayer, secondPlayer, falseQuest


  falseQuest = {
    quest: false, firstPlayer: false, secondPlayer: false,
  }

  playerID = req.ip
  questID = manager.getVotedQuest()
  endOfRound = questID == undefined


  if (questID == undefined) {
    return res.json(falseQuest)
  }

  quest = riddler.getQuestionByID(questID)
  fpID = quest.firstAnswer.player
  spID = quest.secondAnswer.player

  isPlayerAnswered = fpID == playerID || spID == playerID
  if (isPlayerAnswered) { return res.json(falseQuest) }

  firstPlayer = plList.getPlayerByID(fpID)
  secondPlayer = plList.getPlayerByID(spID)

  res.json({quest, firstPlayer, secondPlayer})
})


app.get('/api/finish-round', (req, res) => {
  manager.finishRound()
  res.json(true)
})



app.get('/api/set-vote', (req, res) => {
  let voter, answer, questID, question,
  playerID, player

  answer = req.query.answer
  questID = manager.getVotedQuest()
  question = riddler.voteForAnswer(questID, answer, req.ip)

  playerID = riddler.getPlayerID(questID, answer)
  player = plList.getPlayerByID(playerID)
  plList.addPoint(playerID)

  voter = plList.getPlayer(req.ip)
  plList.setPlayerVoted(req.ip)

  console.log('NEW WOOOOOTE!!!!!');
  console.log({voter, question, player});

  res.json(true)
})


app.get('/api/get-vote-result', (req, res) => {
  let questID, quest, firstPlayer, secondPlayer,
  firstVoters, secondVoters, newQuestID,
  reslutEpt

  questID = manager.getVotedQuest()
  quest = riddler.getQuestionByID(questID)


  firstPlayer = plList.getPlayerByID(quest.firstAnswer.player)
  secondPlayer = plList.getPlayerByID(quest.secondAnswer.player)
  firstVoters = plList.getPlayersIcons(quest.firstAnswer.voters)
  secondVoters = plList.getPlayersIcons(quest.secondAnswer.voters)

  quest.firstAnswer.player = firstPlayer
  quest.firstAnswer.voters = firstVoters

  quest.secondAnswer.player = secondPlayer
  quest.secondAnswer.voters = secondVoters

  res.json(quest)
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
    if ( pl.includes('ffff')) { continue }

    tmPlayer = players[pl]
    tmPlayer.firstAnswer = null
    tmPlayer.secondAnswer = null

    riddler.setAnswer(pl, tmPlayer, 'Пиздани')
    riddler.setAnswer(pl, tmPlayer, 'Что нибудь )))')
  }

  isAll = riddler.checkAllAnswers()
  if (isAll) {  manager.startVoting() }
  res.json(players)
})

// setup Routes ------------------






// Run server!!!!---------------
app.listen(PORT)
// Run server!!!!---------------

console.log(fullAddress);