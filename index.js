import express from "express"
import path from "path"
import cors from "cors"
import ip from "ip"


import utils from "./utils.js"
import plList from "./players.js"
import manager from "./manager.js"


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
utils.createQr(`./public/img/qr.jpg`, 'http://172.16.10.32:8080')
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

  console.log(player);
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


  let screen = manager.getCurrScreen(isAdmin)
  res.json(screen)
})


app.get('/api/start-game', (req, res) => {
  let ip = req.ip
  let isAdmin = ip == "::1" || ip.includes(ipaddress)

  manager.startGame()
  res.json(true)
})



app.get('/api/get-qrcode', (req, res) => { 
  res.json(`${fullAddress}/img/qr.jpg`)
})

// setup Routes ------------------






// Run server!!!!---------------
app.listen(PORT)
// Run server!!!!---------------

console.log(fullAddress);