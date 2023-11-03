const router = {
  setupRouter (
    app,
    ipaddress = '172.16.10.32', 
    port = '8082',
    players = players,
    utils
  ) 
  {
    this.app       = app
    this.ipaddress = ipaddress
    this.port      = port
    this.players   = players
  },

  initRoutes   () {
    this.app.get('/get-qrcode', (req, res) => { this.getQrcode(req, res) })

    this.app.get('/get-nickname', (req, res) => {
      let nick = players.getFreeNickName()
      res.json(nick)
    })

    this.app.get('/add-player', (req, res) => { this.addPlayer(req, res) })

    this.app.get('/get-players', (req, res) => { this.getPlayers(req, res) })

    this.app.get('/get-curr-scene', (req, res) => { this.getCurrScene(req, res) })
  },


  getNickName  (req, res) {
    let nick = players.getFreeNickName()
    res.send(nick)  
  },

  addPlayer    (req, res) {},
  getPlayers   (req, res) {},
  checkPlayer  (req, res) {},
  getCurrScene (req, res) { res.send('lobby') },

  getQrcode    (req, res) { 
    let ip = this.ipaddress
    let port = this.port
    let link = `http://${ip}:${port}/img/qr.jpg`
    res.send(link)
  },
}



export default router