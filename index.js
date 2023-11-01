import express from "express"
import utils from "./utils.js"
import fs from 'fs'
import ip from "ip"


import playerMod from "./players.js"


const PORT = 8082
const ipaddr = ip.address()
const fullAddress = `http:\\\\${ipaddr}:${PORT}`
const app = express()


if (fs.existsSync('./test.jpg')) {
  fs.unlinkSync('./test.jpg')
}

let qr = utils.createQr('./test.jpg', fullAddress)

// console.log(uts);


// const apiFolder = path.resolve('static')
// app.use(express.static(apiFolder))


const avatars = './mocks/avatars.json'
const nicknames = './mocks/nickNames.json'
const colors = './mocks/colors.json'

let plMod  = new playerMod(avatars, nicknames, colors)

let playersIP = []




app.listen(8082) 


app.get('/', (req, res) => {
  let ipaddr, alreadyInGame, player

  ipaddr = req.connection.remoteAddress
  alreadyInGame = playersIP.indexOf(ipaddr)

  if (alreadyInGame != -1) {
    res.send('ТЫ УЖЕ ИГРАЕШЬ')
    return
  }

  player = plMod.createPlayer(ipaddr)
  playersIP.push(ipaddr)
  plMod.players.push(player)


  res.send(player)
})


console.log(fullAddress);