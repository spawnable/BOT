#!/usr/bin/env node
const fs = require('fs')
const crypto = require('crypto')
const http = require('http')
const cwd = process.cwd()
const env = process.env

const url = new RegExp("^(\\w*\\s+)?(http:\\/\\/|https:\\/\\/)?([-_.\\w]*)?(:\\d*)?(\\/[-_./\\w]*)?(\\?.*)?")
const key = new RegExp("[?&]([^&]+)=([^&]+)", "g")
const etc = new RegExp("[=\\/+\\d]", "g")

let pbk
let idx = 0

let pbk2
let prk2

const task = {
  index: (req, res)=> res("RIG"),
  check: (req, res) => {
    idx = 0
    console
      .log((new Date()).toISOString())
    res(pbk2)
  }, 
  clone: (req, res) => {
    
    try {
      if (req.tag.utf) 
        patch(req, res)
      else 
        paste(req, res)
    } catch (err) {
      res('[x x]')
    }
    
  }
 
}

function patch (req, res) {
  const arr = req.buf
      .toString('utf8')
      .split('\u0001')
   
  if (sigma(arr[0], req.tag.utf, pbk)) {
      const buf = theta(arr, prk2)
      const loc = cwd + req.obj.loc
     
      write(loc, buf, err => err
        ? res(`${++idx} ${loc}\n${err}`)
        : res(`${++idx} ${loc}`))
        
  } else res('[> <]')
  
}

function paste (req, res) {
  if (alpha(req.buf, req.tag.bin, pbk)) {
      const loc = cwd + req.obj.loc
     
      write(loc, req.buf, err => err
        ? res(`# ${loc}\n${err}`)
        : res(`# ${loc}`))
        
  } else res('[> <]')
}

function theta (arr, prv) {
  let buf
  arr = arr.map(str => {
    buf = Buffer.from(str, 'hex')
    return crypto
       .privateDecrypt(prv, buf)
  })
  return Buffer.concat(arr)
}

function sigma (str, sig, pub) {
 
  sig = Buffer.from(sig, 'hex')
  const buf = Buffer.from(str, 'hex')

  return crypto
    .verify('sha512', buf, pub, sig)
}

function alpha (buf, sig, pub) {
 
  sig = Buffer.from(sig, 'hex')

  return crypto
    .verify('sha512', 
      buf.slice(0, 200), pub, sig)
}

function route (req, res) {
  let obj = parse(req.url)
  let arr = []
  req.on("data", buf => arr.push(buf));
  req.on('end', ()=> 
    task[obj.path]({
    buf: Buffer.concat(arr),
    tag: req.headers,
    obj: obj.query},
    out=>reply(out, res))
  )
}

function parse (str) {
  const arr = url.exec(str)
  
  return {
    method: arr[1]
      ? arr[1]
      .substring(0, arr[1].length - 1)
      .toUpperCase() 
      : undefined,
    protocol: arr[2]
      ? arr[2]
      .substring(0, arr[2].length - 2) 
      : "https:",
    hostname: arr[3],
    port: parseInt(arr[4] 
      ? arr[4].substring(1) 
      : "443"),
    path: arr[5] === '/'
      ? 'index' 
      : arr[5].split('/').join(''),
    query: query(arr[6])
  }
}

function query(str) {
  let obj = {}, arr;
  
  while (arr = key.exec(str)) {
    try {
      arr[2] = JSON.parse(arr[2]);
    } catch (err) {}
    finally {
      obj[arr[1]] = arr[2]
    }
  }
    return obj
}

function write (dir, buf, exe) {
fs.open(dir, "r+", (err, loc) => {
  if (!err && loc) 
    fs.ftruncate(loc, err => {
      if (!err) fs.writeFile(loc, buf, 
        (error) => {
          if (!err) 
          fs.close(loc, str => exe(str))
          else exe(err)
        })
      else exe(err)
      })
  else 
  fs.mkdir(dir
    .split("/")
    .slice(0, -1)
    .join("/"), {"recursive": true},
  err => {
    if (!err) fs.open(dir, "wx", 
      (err, loc) => {
        if (!err) fs.writeFile(loc, buf,
          err => {
            if (!err) 
            fs.close(loc, str => exe(str))
            else exe(err)
          })
          else exe(err)
        })
      else exe(err)
    })
  })
}

function reply (str, res) {
  res.write(str)
  res.end()
}

function plain (num) {
  return crypto
    .randomBytes(num + 5)
    .toString("base64")
    .replace(etc, "")
    .slice(0, num)
}

function proof (txt) {
  crypto
    .generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: txt
        }
    }, (err, pub, prv) => {
  
      pbk2 = pub
     
      prk2 = crypto
        .createPrivateKey({
          key: prv,
          format: 'pem',
          type: 'pkcs8',
          passphrase: txt
        })
    })
}

function index () {
 
  const fs = require('fs')
  const env = process.env

  let obj = {
    key: fs.readFileSync(env.key),
    cert:fs.readFileSync(env.cert)
  }

  let count = 0

  function out (req, res) {
    res.statusCode = 200
    res.setHeader('Content-Type','text/plain')
    for (var k in env) {
      res.write(k + ": " + env[k] + "\n")
    }
    console.log(count++, req.url)
    res.end()
  }

  require('http')
    .createServer(out)
    .listen(env.http, env.host)
  require('https')
    .createServer(obj, out)
    .listen(env. https, env.host)
}

if (env.spawn === 'index') {
  let str = index.toString()
  str = str.replace(
    "function index () {",
     "#!/usr/bin/env node")
  str = str.substring(0, str.length - 1)
  fs.writeFileSync(cwd + '/index.js', str)
  return 
}

if (env.pbk) {
  pbk = fs.readFileSync(env.pbk)
  proof(plain(600))
  http
    .createServer(route)
    .listen(env.sftp, env.host)
}




