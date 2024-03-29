
const bin = [
  '.gitkeep', 
  '.gitignore'
]
const fs = require('fs')
const http = require('http')
const crypto = require('crypto')

const utf = 
['js', 'html', 'css', 'json', 'txt', 'service']
let prk
let pbk

let hidden = []
let plugin = {}

module.exports = 
function (obj, buf, mod, hid, ...arr) {
  
  hidden = hid
  plugin = mod
  
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
    (loc, buf)=> {
    
      const type = loc
        .split('.')
        .reverse()[0]
      if (utf.includes(type))
        patch(obj, loc, buf)
      else 
        paste(obj, loc, buf)
    }))
}

function paste (obj, loc, buf) {
 
   const use = {
      protocol: "http:",
      hostname: obj.host,
      path: '/clone' + field({loc}),
      method: "POST",
      port: obj.sftp,
      headers : {
       bin: alpha(buf, prk), 
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
  post.write(buf)
  post.end()
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
       utf: sigma(arr[0], prk)
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
  
  post.write(Buffer.from(arr.join('\u0001'), 'utf8'))
      
  post.end()
}

function theta (buf, pub) {
  let cut
  
  buf = buf.toString('utf8')
  
  if (!buf.length) {
   throw "**EXIST EMPTY FILE**"
  }
  
  return buf
    .match(/(.|[\r\n]){1,300}/g)
    .map(str=>{
       cut = Buffer
         .from(str, 'utf8')
       return crypto
         .publicEncrypt(pub, cut)
         .toString('hex')
     })
}

function sigma (hex, prv) {
  return crypto
      .sign('sha512', 
          Buffer.from(hex, 'hex'), prv)
      .toString("hex")
}

function alpha (buf, prv) {
  return crypto
     .sign('sha512', 
         buf.slice(0, 200), prv)
     .toString('hex')
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
 console.log("packing:", loc)
  const arr = fs
    .readdirSync(src + loc)

  arr.forEach(str=>{
    const dir = loc + '/' + str
   
    if (hidden.includes(str)) {
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
      if (obj) {
        if (obj.up) delete obj.up
        
        Object.keys(obj).
         forEach(field => {
          obj[field] = plugin[field]
         })
        
        pkg = JSON.stringify(pkg)
        buf = Buffer.from(pkg, 'utf8')
        exe(dir, buf)
        return
      }
    }
   
  
    if (str.includes('.')) {
      buf = fs.readFileSync(src + dir)
      
      exe(dir, buf)
    } else drill(src, dir, put, exe)
  })

}