const fs = require('fs')
const http = require("http")
const spawn = require('./spawn')
const clone = require('./clone')

const loc = process.cwd() + "/../../"
const app = {
  src: process.cwd(),
  dir: ''
}
const bot = {
  src: src('BOT'),
  dir: '/bundle'
}
const rig = {
  src: src('RIG'),
  dir: '/engine'
}

module.exports = function (use) {
  const obj = spawn(bot.src, use)
  if (process.env.clone) {
    process.stdout.write('[• •]')
    obj.rig = rig.src + '/switch'
    auth(obj, buf => job(buf, obj))
  } else{
    process.stdout.write('[▪ ▪]')
  }
}

function auth (obj, exe) {
  const use = {
    protocol: "http:",
    hostname: obj.host,
    path: '/check',
    method: 'GET',
    port: obj.sftp
  }
  
  let load = http.request(use, res=>{
    let arr = []
    res.on("data", buf => arr.push(buf))
    res.on('end',()=>
      exe(Buffer.concat(arr)))
  })
  
  load.on("error", err => {
    exe(false)
  })
  
  if (use.key) load.write(use.key)
  load.end()
}

function src (use) {
  return loc + fs
  .readdirSync(loc)
  .filter(str => str.includes(use))[0]
  + '/src'
}

function job (buf, obj) {
  if (buf) {
   log('[^ ^]')
   clone(obj, buf, rig, app, bot)
  } else {
    log('[- -]')
  }
  console.log()
}

function log (str) {
 process
    .stdout
    .write('\r\x1b[K' + str)
}
