import express from "express"
import path from "path"
import fs from "fs"


const app = express()
const PORT = 8082

const apiFolder = path.resolve('static')
const nickFile = fs.readFileSync('./mocks/nickNames.json')
const nicknames = JSON.parse(nickFile)


app.listen(8082) 
app.use(express.static(apiFolder))


console.log(apiFolder);
// console.log(nicknames);



console.log(nicknames);