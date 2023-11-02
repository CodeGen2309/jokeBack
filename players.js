import fs from "fs"


const playerList = {
  avatars   : null,
  nicknames : null,
  colors    : null,
  players   : {},


  initMocks () {
    let nickNamesPath = './mocks/nickNames.json'
    let colorsPath = './mocks/colors.json'
    let colorsRes  = fs.readFileSync(colorsPath)
    let nickRes    = fs.readFileSync(nickNamesPath)
    
    this.nicknames = JSON.parse(nickRes)
    this.colors    = JSON.parse(colorsRes)
    this.avatars = fs.readdirSync('./src/icons/avatars/')

    this.shuffleArray(this.avatars)
    this.shuffleArray(this.nicknames)
  },


  shuffleArray (arr) {
    arr.sort(() => Math.random() - 0.5);
  },


  getRandInt (length) {
    return Math.floor(Math.random() * (length - 1))
  },


  createPlayer (ipaddress, nickName) {
    let isAdmin = ipaddress == "::1"
    let avatar  = this.avatars.pop()
    let colorID = this.getRandInt(this.colors.length)
    let color   = this.colors[colorID]
    let player = {avatar, login: nickName, color, ipaddress, isAdmin}
    return player
  },


  addPlayer (req, res) {
    let ipaddress, inGame, nickName,
    player

    ipaddress = req.connection.address().address
    inGame = this.checkPlayer(ipaddress)
    
    if (inGame) { 
      res.send(false)
      return false
    }
    
    nickName = req.query.nickname || this.getFreeNickName()
    player = this.createPlayer(ipaddress, nickName)
    this.players[ipaddress] = player

    console.log(this.players);
    res.send(player)
  },


  getFreeNickName () {
    return this.nicknames.shift()
  },

  changePlayer (ipaddr) {},


  checkPlayer  (ipaddress) {
    return this.players.hasOwnProperty(ipaddress)
  },

  getPlayersTable (req, res) {
    res.send(this.players)
  },
}


export default playerList