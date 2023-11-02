import express from "express"
import utils from "./utils.js"
import cors from "cors"
import ip from "ip"


import players from "./players.js"



// Create App ------------
const PORT = 8082
const ipaddr = ip.address()
// const fullAddress = `http://${ipaddr}:${PORT}`
const fullAddress = `http://172.16.10.32:8080`

const app = express()
app.use( cors() )
// Create App ------------


// setUp mocks ---------
let qrPath = './src/img/qr.jpg'
let qrCode = utils.createQr(qrPath, fullAddress)
players.initMocks()
// setUp mocks ---------


// Run server!!!!---------------
app.listen(PORT) 
// Run server!!!!---------------


app.get('/get-nickname', (req, res) => {
  let nick = players.getFreeNickName()
  res.send(nick)
})


app.get('/add-player', (req, res) => { players.addPlayer(req, res) })
app.get('/get-players', (req, res) => { players.getPlayersTable(req, res) })

app.get('/check-player', (req, res) => {
  let ipaddress = req.connection.address().address
  let inGame = players.checkPlayer(ipaddress)
  res.send(inGame)
})


app.get('/get-curr-scene', (req, res) => { res.send('IN DEVELOP!') })


console.log(fullAddress);