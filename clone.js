const hid = [
  'package-lock.json', 
  'node_modules',
  '.git',
  '.gitkeep', 
  '.gitignore',
  'build.js',
  'patch',
  'bot.pem'
]
const bin = [
  '.gitkeep', 
  '.gitignore'
]
const fs = require('fs')
const http = require('http')
const crypto = require('crypto')

const mod = {
  on: 'file:node_modules/engine'
}

let prk
let pbk

module.exports = function (obj, buf, ...arr) {
    
  prk = crypto
    .createPrivateKey({
      key: fs
      .readFileSync(obj.rig + '/bot.key'),
      format: 'pem',
      type: 'pkcs8',
      passphrase: fs
      .readFileSync(obj.rig + '/bot.txt')
    })
    
  pbk = crypto
    .createPublicKey({
      key: buf,
      format: 'pem',
      type: 'spki'
    })
  
  arr.forEach(exe =>
    drill(exe.src, exe.dir, exe.dir, 
    (loc, buf)=>patch(obj, loc, buf)))
}

function patch (obj, loc, buf) {
  
   const arr = theta(buf, pbk)
   const use = {
      protocol: "http:",
      hostname: obj.host,
      path: '/clone' + field({loc}),
      method: "POST",
      port: obj.sftp,
      headers : {
       hex: sigma(Buffer
         .from(arr[0], 'hex'), prk)
      }
  }
  
  let post = http.request(use, res=>{
    let arr = []
    res.on("data", buf => arr.push(buf))
    res.on('end',()=>
      print(Buffer.concat(arr)))
  })
  
  post.on("error", err => {
    console.log(err)
  })
 
  post.write(
    Buffer
      .from(arr.join('\u0001'), 'utf8'))
      
  post.end()
}

function theta (buf, pub) {
  let cut
  return buf
    .toString('utf8')
    .match(/.{1,200}/g)
    .map(str=>{
       cut = Buffer
         .from(str, 'utf8')
       return crypto
         .publicEncrypt(pub, cut)
         .toString('hex')
     })
}

function sigma (buf, prv) {
  return crypto
      .sign('sha512', 
          Buffer.from(buf, 'hex'), prv)
      .toString("hex")
}

function print(buf) {
  console.log(buf.toString('utf8'))
}

function field (obj) {
  let key;
  let arr = []
  for (key in obj) {
    arr.push(`${key}=${obj[key]}`)
  }
  return `?${arr.join('&')}`
}

function drill (src, loc, put, exe) {
  const arr = fs
    .readdirSync(src + loc)

  arr.forEach(str=>{
    const dir = loc + '/' + str
    
    if (hid.includes(str)) {
      if (bin.includes(str))
        fs.unlinkSync(src + dir)
      return
    }
    
    let buf
    
    if (str === 'package.json') {
      let pkg = fs.readFileSync(src + dir)
      pkg = JSON.parse(pkg)
      delete pkg.scripts
      let obj = pkg.dependencies
      if (obj.up) delete obj.up
      if (obj.on) obj.on = mod.on
      pkg = JSON.stringify(pkg)
      buf = Buffer.from(pkg, 'utf8')
      exe(dir, buf)
      return
    }
  
    if (str.includes('.')) {
      buf = fs.readFileSync(src + dir)
      exe(dir, buf)
    } else drill(src, dir, put, exe)
  })

}