import qr from 'qrcode'
import fs from  "fs"

async function createQr (path, data) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }

  let qrCode = await qr.toFile(path, data, {scale: 30, margin:2})
  return qrCode
}


function checkAdmin (serverIP, userIP) {
  let isAdmin = userIP == "::1" || userIP.includes(serverIP)
  return isAdmin
}

function getRandomInt (min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min) + min)
}


function getRandomElem (arr) {
  let random = Math.floor(Math.random() * (arr.length - 1))
  return arr[random]
}


function shuffleArray (arr) {
  arr.sort(() => Math.random() - 0.5);
}



export default {
  createQr, checkAdmin, getRandomInt,
  getRandomElem, shuffleArray
}