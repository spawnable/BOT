const fs = require('fs')
const http = require("http")
const spawn = require('./spawn')
const clone = require('./clone')

const loc = process.cwd() + "/../../"
const app = {
  src: src('APP'),
  dir: ''
}
const bot = {
  src: src('BOT'),
  dir: '/packet'
}
const rig = {
  src: src('RIG'),
  dir: '/engine'
}

module.exports = function (use) {
  
  const obj = spawn(bot.src, use)
  
  auth(obj, res=>job(res, obj))
  
}

function auth (use, exe) {
  const obj = {
    protocol: "http:",
    hostname: use.host,
    path: '/check',
    method: 'GET',
    port: use.http
  }
  
  let src = http.request(obj, res=>{
    let arr = []
    res.on("data", buf => arr.push(buf)) 
    res.on('end', () => 
     exe(Buffer.concat(arr)))
  })
  
  src.on("error", err => {
    exe(false)
  })
  
  if (use.key) src.write(use.key)
  src.end()
}

function src (use) {
  return loc + fs
  .readdirSync(loc)
  .filter(str => str.includes(use))[0]
  + '/src'
}

function job (val, obj) {
  let str = ''
  if (typeof val == 'boolean') {
    if (val){
      str = '[+ +] online'
      clone(obj, rig, app, bot)
    }
    else {
      str = '[- -] offline'
    }
  }
  console.log(str)
}
 