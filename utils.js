import qr from 'qrcode'
import fs from  "fs"

import nickNames from './mocks/nickNames.js'


async function createQr (path, data) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }

  let qrCode = await qr.toFile(path, data, {scale: 30, margin:2})
  return qrCode
}


function checkAdmin (serverIP, userIP, query) {
  let isAdmin = query.isAdmin == 'true'
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
  return arr.sort(() => Math.random() - 0.5);
}


async function sleep (sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

export default {
  createQr, checkAdmin, getRandomInt,
  getRandomElem, shuffleArray, sleep,
}