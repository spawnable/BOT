const hid = [
  'package-lock.json', 
  'node_modules',
  '.git',
  '.gitkeep', 
  '.gitignore',
  'build.js',
  'patch'
]
const bin = [
  '.gitkeep', 
  '.gitignore'
]
const fs = require('fs')
const http = require('http')

const mod = 'file:node_modules'

module.exports = function (obj, ...arr) {
  arr.forEach(exe =>
    drill(exe.src, exe.dir, exe.dir, 
    (loc, buf)=>patch(obj, loc, buf)))
}

function patch (obj, loc, buf) {
   const use = {
      protocol: "http:",
      hostname: obj.host,
      path: '/clone' + field({loc}),
      method: "POST",
      port: obj.sftp
  }
  console.log(use)
  
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
  console.log('ok')
  post.end()
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
    let buf;
    if (str === 'package.json') {
      let pkg = fs.readFileSync(src + dir)
      pkg = JSON.parse(pkg)
      let obj = pkg.dependencies
      if (obj.up) delete obj.up
      if (obj.on) obj.on = mod.on + put
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