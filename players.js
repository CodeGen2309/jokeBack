import fs from "fs"

import colors from "./mocks/colors.js"
import nicknames from "./mocks/nickNames.js"
import answers from "./mocks/answers.js"


const playerList = {
  avatars   : [],
  nicknames : nicknames,
  colors    : colors,
  answers   : answers,

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
    this.shuffleArray(this.answers)
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
    let avatar  = this.avatars.pop()
    let background = this.getRandomElem(this.colors)

    return {
      avatar, nickname, background, ipaddress,
      firstQuest: null, secondQuest: null,
      firstAnswer: null, secondAnswer: null, 
      points: 0, alreadyVoted: false,
      roundPoints: 0, questPoints: 0,
    }
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


  getPlayerByID (playerID) {
    return this.players[playerID]
  },


  setPlayerVoted (playerID) {
    let player = this.players[playerID]
    player.alreadyVoted = true
  },


  resetVotedPlayers () {
    let tmPlayer, plKeys

    plKeys = Object.keys(this.players)

    for (let key of plKeys) {
      tmPlayer = this.players[key]
      tmPlayer.alreadyVoted = false
    }

    return true
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
      tmPlayer.firstAnswer = this.answers.pop()
      tmPlayer.secondAnswer = this.answers.pop()

      this.players[tmIP] = tmPlayer
    }

    return this.players
  },

  addPoint (playerID) {
    let player = this.players[playerID]
    if (!player) {return false}

    player.points = player.points + 1
    player.roundPoints = player.roundPoints + 1
    player.questPoints = player.questPoints + 1

    return player
  },


  resetRoundPoints () {
    let plKeys, tmPlayer

    plKeys = Object.keys(this.players)

    for (let key of plKeys) {
      tmPlayer = this.players[key]
      tmPlayer.roundPoints = 0
    }
  },


  resetQuestPoints () {
    let plKeys, tmPlayer

    plKeys = Object.keys(this.players)

    for (let key of plKeys) {
      tmPlayer = this.players[key]
      tmPlayer.questPoints = 0
    }
  },


  resetPlayersAnswers () {
    let plKeys, tmPlayer

    plKeys = Object.keys(this.players)

    for (let key of plKeys) {
      tmPlayer = this.players[key]
      tmPlayer.firstAnswer = null
      tmPlayer.secondAnswer = null
    }
  },


  getPlayersIcons (voters) {
    let tmPlayer, icons, tmpIcon

    icons = []
    for (let vtr of voters) {
      console.log('CHECK VOTER!');
      console.log(this.players[vtr]);

      tmPlayer = this.players[vtr]
      tmpIcon = tmPlayer.avatar
      icons.push(tmpIcon)
    }

    return icons
  },
}


export default playerList