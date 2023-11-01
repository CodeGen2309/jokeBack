import fs from "fs"


const playerList = {
  avatars   : null,
  nicknames : null,
  colors    : null,
  players   : [],
  iplist    : [],


  initMocks (avatars, nicknames, colors) {
    let avaRes     = fs.readFileSync(avatars)
    let nickRes    = fs.readFileSync(nicknames)
    let colorsRes  = fs.readFileSync(colors)

    this.avatars    = JSON.parse(avaRes)
    this.nicknames = JSON.parse(nickRes)
    this.colors    = JSON.parse(colorsRes)

    this.shuffleArray(this.avatars)
    this.shuffleArray(this.nicknames)
  },


  shuffleArray (arr) {
    arr.sort(() => Math.random() - 0.5);
  },


  getRandInt (length) {
    return Math.floor(Math.random() * (length - 1))
  },


  addPlayer (ipaddress) {
    let avatar  = this.avatars.pop()
    let login   = this.nicknames.pop()

    let colorID = this.getRandInt(this.colors.length)
    let color   = this.colors[colorID]

    return {avatar, login, color, ipaddress}
  },


  getFreeLogin () {
    return this.nicknames.shift()
  },

  changePlayer () {},

  checkPlayer  (req, res) {
    let ipaddr, alreadyInGame, player

    ipaddr = req.connection.remoteAddress
    alreadyInGame = this.iplist.indexOf(ipaddr)

    if (alreadyInGame != -1) {
      res.send('ТЫ УЖЕ ИГРАЕШЬ')
      return
    }
  
    player = this.addPlayer(ipaddr)
    this.players.push(player)
    this.iplist.push(ipaddr)
  
    res.send('HELLO!!!')  
  },
}


export default playerList