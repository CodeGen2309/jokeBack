import fs from "fs"


class playersFactory {
  constructor (avatars, nicknames, colors) {
    this.avatars = null
    this.nicknames = null
    this.colors = null

    this.players = []

    this.initMocks(avatars, nicknames, colors)
  }

  initMocks (avatars, nicknames, colors) {
    let avaRes = fs.readFileSync(avatars)
    let nickRes = fs.readFileSync(nicknames)
    let colorsRes = fs.readFileSync(colors)

    this.avaRes = JSON.parse(avaRes)
    this.nicknames = JSON.parse(nickRes)
    this.colors = JSON.parse(colorsRes)
  }

  getRandInt (length) {
    return Math.floor(Math.random() * (length - 1))
  }

  createPlayer (ipaddress) {
    let avatar = this.avatars.pop()
    let login = this.nicknames.pop()

    let colorID = this.getRandInt(this.colors.length)
    let color = this.colors[colorID]

    return {avatar, login, color, ipaddress}
  }

  addPlayer () {}
  changePlayer () {}
}


export default playersFactory