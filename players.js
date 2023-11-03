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


  getRandomElem (arr) {
    let random = Math.floor(Math.random() * (arr.length - 1))
    return arr[random]
  },


  createPlayer (ipaddress, nickname) {
    let isAdmin = ipaddress == "::1"   || ipaddress.includes(this.ipaddress)
    let avatar  = this.avatars.pop()
    let background = this.getRandomElem(this.colors)

    
    let player = {avatar, nickname, background, ipaddress, isAdmin}
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
}


export default playerList