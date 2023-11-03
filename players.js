import fs from "fs"


const playerList = {
  avatars   : [],
  nicknames : null,
  colors    : null,
  players   : {},


  initMocks (backAddress) {
    let nickNamesPath, nickRes, avaFolder,
    avaPath, symLink, avatars

    nickNamesPath = './mocks/nickNames.json'
    nickRes    = fs.readFileSync(nickNamesPath)
    this.nicknames = JSON.parse(nickRes)

    symLink = 'icons/avatars'
    avaPath = `./public/${symLink}/`
    avaFolder = fs.readdirSync(avaPath)

    for (let img of avaFolder) {
      this.avatars.push(`${backAddress}/${symLink}/${img}`)
    }

    this.shuffleArray(this.avatars)
    this.shuffleArray(this.nicknames)
  },


  shuffleArray (arr) {
    arr.sort(() => Math.random() - 0.5);
  },


  getRandInt (length) {
    return Math.floor(Math.random() * (length - 1))
  },


  createPlayer (ipaddress, nickname) {
    let isAdmin = ipaddress == "::1"
    let avatar  = this.avatars.pop()
    let player = {avatar, nickname, ipaddress, isAdmin}
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

  getPlayersTable () {
    return this.players
  },
}


export default playerList