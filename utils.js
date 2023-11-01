import qr from 'qrcode'

function createQr (path, data) {
  return qr.toFile(path, data, {scale: 30, margin:2})
}



export default {createQr}