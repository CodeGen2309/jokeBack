import fs from "fs"

import colors from "./mocks/colors.js"
import nicknames from "./mocks/nickNames.js"
import answers from "./mocks/answers.js"
import utils from "./utils.js"


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


  createPlayer (id, nickname) {
    let avatar  = utils.getRandomElem(this.avatars)
    let background = this.getRandomElem(this.colors)

    return {
      avatar, nickname, background, id,
      firstQuest: null, secondQuest: null,
      firstAnswer: null, secondAnswer: null, 
      points: 0, alreadyVoted: false,
      roundPoints: 0, questPoints: 0,
      comicsAnswer: null,
    }
  },


  createRandomVoter () {
    let nickname, avatar

    avatar = utils.getRandomElem(this.avatars)
    nickname = utils.getRandomElem(this.nicknames)
    return {avatar, nickname}
  },


  addPlayer (id, nickname) {
    let inGame, player, noNickname

    inGame = this.checkPlayer(id)
    noNickname = nickname == undefined
    
    if (inGame) { return false }
    if (noNickname) { nickname = this.getFreeNickName() }

    
    player = this.createPlayer(id, nickname)
    this.players[id] = player

    console.log(this.players);
    return player
  },


  getFreeNickName () {
    return this.nicknames.shift()
  },
  

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
      
      tmPlayer.firstAnswer = 'Пиздани =)'
      tmPlayer.secondAnswer = 'Что нибудь =))))'
      tmPlayer.comicsAnswer = this.answers.pop()

      this.players[tmIP] = tmPlayer
    }

    return this.players
  },


  addPoints (playerID, points = 1) {
    let player = this.players[playerID]
    if (!player) {return false}

    this.players[playerID]['points'] += points
    this.players[playerID]['roundPoints'] += points
    this.players[playerID]['questPoints'] += points    

    return player
  },


  addRandomAutoPoints () {
    for ( let pl in this.players ) {
      this.players[pl]['points'] = utils.getRandomInt(1000, 9000)
    }
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
      tmPlayer = this.players[vtr]
      tmpIcon = tmPlayer.avatar
      icons.push(tmpIcon)
    }

    return icons
  },


  checkComicsAnswers () {
    let checker, tmPlayer

    checker = true
    for (let index in this.players) {
      tmPlayer = this.players[index]
      
      if (tmPlayer.comicsAnswer == null) {
        checker = false
      }
    }

    return checker
  },


  checkVotedPlayers () {
    let checker, tmPlayer

    checker = true
    for (let index in this.players) {
      tmPlayer = this.players[index]
      
      if (!tmPlayer.alreadyVoted) {
        checker = false
      }
    }

    return checker
  }
}


export default playerList