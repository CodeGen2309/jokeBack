import express from "express"
import utils from "./utils.js"
import cors from "cors"
import ip from "ip"


import playerFactory from "./players.js"


let PORT = 8082
let ipaddr = ip.address()
let fullAddress = `http:\\\\${ipaddr}:${PORT}`

let app = express()
app.use(cors())


let qr = utils.createQr('./src/img/qr.jpg', fullAddress)


let avatars = './mocks/avatars.json'
let nicknames = './mocks/nickNames.json'
let colors = './mocks/colors.json'

playerFactory.initMocks(avatars, nicknames, colors)




app.listen(PORT) 



app.get('/api/getLogin', (req, res) => {
  let nick = playerFactory.getFreeLogin()
  res.send(nick)
})


app.get('/', (req, res) => {
  let ipaddr, alreadyInGame, player

  ipaddr = req.connection.remoteAddress

  // if (alreadyInGame != -1) {
  //   res.send('ТЫ УЖЕ ИГРАЕШЬ')
    // return
  // }

  // player = plMod.createPlayer(ipaddr)

  res.send('HELLO!!!')
})


console.log(fullAddress);