import fs from "fs"


class playerList {
  constructor (avatars, nicknames, colors) {
    this.avatars   = null
    this.nicknames = null
    this.colors    = null
    this.players   = []
    this.iplist    = []
  }


  initMocks (avatars, nicknames, colors) {
    let avaRes     = fs.readFileSync(avatars)
    let nickRes    = fs.readFileSync(nicknames)
    let colorsRes  = fs.readFileSync(colors)

    this.avatars    = JSON.parse(avaRes)
    this.nicknames = JSON.parse(nickRes)
    this.colors    = JSON.parse(colorsRes)

    this.shuffleArray(this.avatars)
    this.shuffleArray(this.nicknames)
  }


  shuffleArray (arr) {
    arr.sort(() => Math.random() - 0.5);
  }


  getRandInt (length) {
    return Math.floor(Math.random() * (length - 1))
  }


  createPlayer (ipaddress) {
    let avatar  = this.avatars.pop()
    let login   = this.nicknames.pop()

    let colorID = this.getRandInt(this.colors.length)
    let color   = this.colors[colorID]

    return {avatar, login, color, ipaddress}
  }


  getFreeLogin () {
    return this.nicknames.shift()
  }

  addPlayer    () {}
  changePlayer () {}
  checkPlayer  () {}
}


export default new playerList ()