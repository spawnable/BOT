/* (1) paste #.#.#.# from copied */
const host = "xxxxx"
const fs = require('fs')
const http = require("http")

const bot = 3000
const goto = "/../../"
const app = process.cwd()

const rig = fs
  .readdirSync(app + goto)
  .filter(name => name.includes('RIG'))
  .map(file => app + goto + file + 
  '/src')[0]
const hid = [
  'package-lock.json', 
  'node_modules',
  '.git',
  '.gitkeep', 
  '.gitignore',
  'clone.js',
  'patch'
]
const bin = [
  '.gitkeep', 
  '.gitignore'
]
const media = {
  "json": "application/json",
  "txt": "text/plain",
  "html": "text/html",
  "css": "text/css",
  "js": "application/javascript",
  "appcache": "text/cache-manifest",
  "ico": "image/x-icon",
  "png": "image/png",
  "jpg": "image/jpg",
  "jpeg": "image/jpeg",
  "ttf": "font/ttf",
  "woff": "font/woff",
  "woff2": "font/woff2",
  "eot": "application/vnd.ms-fontobject",
  "dms": "application/octet-stream",
  "data": "multipart/form-data"
}

function patch (data, type, str) {
 const obj = {
    headers: {
    'Content-Type': media[type],
    'Content-Length': Buffer
      .byteLength(data)
    },
    protocol: "http:",
    hostname: host,
    path: str,
    method: "POST",
    port: bot
  }
  
  let post = http.request(obj, res=>{
    let str = ''
    res.setEncoding("utf8")
    res.on("data", add => str += add)
    res.on('end',()=> console.log(str))
  })
  
  post.on("error", err => {
    console.log(err)
  })
  
  post.write(data)
  post.end()
}

function field (obj) {
  let idx;
  let arr = []
  for (idx in obj) {
    arr.push(`${idx}=${obj[idx]}`)
  }
  return `?${arr.join('&')}`
}

function drill (src, loc, res) {
  const arr = fs
    .readdirSync(src + loc)

  arr.forEach(str=>{
    const dir = loc + '/' + str
    
    if (hid.includes(str)) {
      if (bin.includes(str))
        fs.unlinkSync(src + dir)
      return
    }
    
    if (str === 'package.json') {
      let p = fs.readFileSync(src + dir)
      p = JSON.parse(p)
      if (p.name !== 'engine') 
         if (p.dependencies.on) 
            p.dependencies.on
             = `file:node_modules/engine`
        
      res(
        // name
        dir,
        // type
        str.split('.')[1],
        // file
        JSON.stringify(p))
      
     return
    }
  
    if (str.includes('.'))
      res(
        // name
        dir,
        // type
        str.split('.')[1],
        // file
        fs.readFileSync(src + dir))
     else drill(src, dir, res)
  })

}

drill(app, '', (name, type, file) =>
  patch(file, type, '/clone' +
    field({
      file: name
    })
))

drill(rig, `/engine`,(name, type, file) =>
  patch(file, type, '/clone' +
    field({
      file: name
    })
))