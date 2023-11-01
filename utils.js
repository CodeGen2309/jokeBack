import qr from 'qrcode'
import fs from  "fs"

async function createQr (path, data) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }

  let qrCode = await qr.toFile(path, data, {scale: 30, margin:2})
  return qrCode
}



export default {createQr}