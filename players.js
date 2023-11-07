import fs from "fs"

import colors from "./mocks/colors.js"
import nicknames from "./mocks/nickNames.js"


const playerList = {
  avatars   : [],
  nicknames : nicknames,
  colors    : colors,
  players   : {},
  ipaddress : null,
  port: null,


  setIP (ipaddress, port) {
    this.ipaddress = ipaddress
    this.port = port
  },

  initAvatars () {
    let avaFolder, avaPath, symLink,
    backAddress


    symLink = 'icons/avatars'
    avaPath = `./public/${symLink}/`
    avaFolder = fs.readdirSync(avaPath)
    backAddress = `http://${this.ipaddress}:${this.port}`

    for (let img of avaFolder) {
      this.avatars.push(`${backAddress}/${symLink}/${img}`)
    }


    this.shuffleArray(this.avatars)
    this.shuffleArray(this.nicknames)
  },


  shuffleArray (arr) {
    arr.sort(() => Math.random() - 0.5);
  },


  getRandomInt (min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min) + min)
  },


  getRandomElem (arr) {
    let random = Math.floor(Math.random() * (arr.length - 1))
    return arr[random]
  },


  createRandomIP () {
    let one   = this.getRandomInt(10, 999)
    let two   = this.getRandomInt(10, 999)
    let three = this.getRandomInt(10, 999)
    let four  = this.getRandomInt(10, 999)

    return `${one}.${two}.${three}.${four}`
  },


  createPlayer (ipaddress, nickname) {
    let isAdmin = ipaddress == "::1"   || ipaddress.includes(this.ipaddress)
    let avatar  = this.avatars.pop()
    let background = this.getRandomElem(this.colors)

    
    let player = {
      avatar, nickname, background, ipaddress,
      firstQst: null, secondQst: null,
      firstAns: null, secondAns: null
    }

    return player
  },


  addPlayer (ipaddress, nickname) {
    let inGame, player, noNickname

    inGame = this.checkPlayer(ipaddress)
    noNickname = nickname == undefined
    
    if (inGame) { return false }
    if (noNickname) { nickname = this.getFreeNickName() }

    
    player = this.createPlayer(ipaddress, nickname)
    this.players[ipaddress] = player

    return player
  },


  getFreeNickName () {
    return this.nicknames.shift()
  },
  

  changePlayer (ipaddr) {},


  checkPlayer  (ipaddress) {
    return this.players.hasOwnProperty(ipaddress)
  },


  getPlayer (ip) {
    return this.players[ip]
  },


  getPlayersTable () {
    return this.players
  },

  addBots (count) {
    let tmPlayer, tmIP, nickname

    for (let i = 0; i < count; i++) {
      tmIP = this.createRandomIP()
      nickname = this.getFreeNickName()
      tmPlayer = this.createPlayer(tmIP, nickname)
      this.players[tmIP] = tmPlayer
    }

    return this.players
  },
}


export default playerList