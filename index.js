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
  plList.addBots(5)
  riddler.setupQuestions(plList.players)
  manager.startGame()

  res.json(true)
})


app.get('/api/get-curr-quest', (req, res) => {
  let player, currQuest

  player = plList.getPlayer(req.ip)
  currQuest = riddler.getCurrQuestion(player)
  console.log(currQuest);
  res.json(currQuest)
})


app.get('/api/set-answer', (req, res) => {
  let answer = req.query.answer
  let player = plList.getPlayer(req.ip)
  let result = riddler.setAnswer(player, answer)
  let isAll  = riddler.checkAllAnswers(plList.players)

  if (isAll) { 
    riddler.setupVotedAnswers(plList.players)
    manager.startVoting()
  }

  console.log(isAll);
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

  console.log({playerID});

  let result = plList.addPoint(playerID)
  let players = plList.players

  console.log({result});

  res.json(players)
})



app.get('/api/set-voted', (req, res) => { 
  let player, checkVotes, nextScreen

  player = plList.getPlayer(req.ip)
  console.log(player);

  // player.alreadyVoted = true
  // checkVotes = plList.checkAllVoted()

  // if (checkVotes) { 
  //   riddler.setupVotedAnswers(plList.players)
  //   manager.showRoundPoints()
  // }

  // nextScreen = manager.getCurrScreen(player)
  // res.json(nextScreen)
})


app.get('/api/get-voted-quest', (req, res) => {
  let playerID, newQuest, setVoter

  playerID = req,ip
  setVoter = riddler.setVoter(playerID)
  newQuest = riddler.sendNewQuest(playerID)

  console.log({playerID, newQuest});

  res.json(newQuest)
})

// setup Routes ------------------






// Run server!!!!---------------
app.listen(PORT)
// Run server!!!!---------------

console.log(fullAddress);