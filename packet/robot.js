#!/usr/bin/env node
const fs = require('fs')
const cwd = process.cwd()
const env = process.env

let count = 0

const task = {
  index: (req, res)=> res('SKY'),
  check: (req, res) => {
    return res('(^ ^) welcome')
  }, 
  clone: (req, res) => {
  console.log(req)
    const loc = cwd + req.obj.loc
      
    write(loc, req.buf, err => err
      ? res(`no: ${file} ${err}`)
      : res(`ok: ${file}`))
  }
 
}

function route (req, res) {
  let obj = parse(req.url)
  let arr = []
  console.log(count++, obj.path)
  req.on("data", buf => arr.push(buf));
  req.on('end', ()=>
  task[obj.path]({
    buf: Buffer.concat(arr),
    obj: obj.query},
    out=>reply(out, res)))
}

const url = new RegExp("^(\\w*\\s+)?(http:\\/\\/|https:\\/\\/)?([-_.\\w]*)?(:\\d*)?(\\/[-_./\\w]*)?(\\?.*)?")
const key = new RegExp("[?&]([^&]+)=([^&]+)", "g")

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
          fs.close(loc, str => res(str))
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
  res.setHeader(
      "Content-Type",
      "text/plain")
  res.end(str)
}

require("http")
.createServer((req,res)=>route(req,res))
.listen(env.sftp || 3000, env.host || '0.0.0.0')