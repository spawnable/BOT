#!/usr/bin/env node
const path = require("path")
const fs = require('fs')
const cwd = process.cwd()
const env = process.env

let count = 0

const task = {
  index: (req, res)=>res('SKY'),
  
  clone: function (req, res) {
  
    const file = path
      .join(cwd, req.o.file)
      
    write(file, req.x, err=>{
      if (err) 
        res(`no: ${file} ${err}`)
      else
         res(`ok: ${file}`)
     })
     
  }
  
  
}

function route (req, res) {
  req.setEncoding("utf8")
  let obj = parse(req.url)
  let data = ""
  console.log(count++, obj.path)
  req.on("data", add => data += add);
  req.on('end', ()=>
  task[obj.path]({x: data,o: obj.query},
  out=>reply(out, res)))
}

const url = new RegExp("^(\\w*\\s+)?(http:\\/\\/|https:\\/\\/)?([-_.\\w]*)?(:\\d*)?(\\/[-_./\\w]*)?(\\?.*)?")
const val = new RegExp("[?&]([^&]+)=([^&]+)", "g")

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
  
  while (arr = val.exec(str)) {
    try {
      arr[2] = JSON.parse(arr[2]);
    } catch (err) {}
    finally {
      obj[arr[1]] = arr[2]
    }
  }
    return obj
}

function write (str, val, res) {
fs.open(str, "r+",(err, idx) => {
  if (!err && idx) 
    fs.ftruncate(idx, (err) => {
      if (!err) fs.writeFile(idx, val, 
        (error) => {
          if (!err) 
          fs.close(idx, val => res(val))
          else res(err)
        })
      else res(err)
      })
  else 
  fs.mkdir(str
    .split("/")
    .slice(0, -1)
    .join("/"), {"recursive": true},
 (err) => {
    if (!err) fs.open(str, "wx", 
      (err, idx) => {
        if (!err) fs.writeFile(idx, val,
         (err) => {
            if (!err) 
            fs.close(idx, val => res(val))
            else res(err)
          })
          else res(err)
        })
      else res(err)
    })
  })
}

function reply (val, res) {
  res.setHeader(
      "Content-Type",
      "text/plain")
  res.end(val)
}

require("http")
.createServer((req,res)=>route(req,res))
.listen(env.bot || 3000, env.host || '0.0.0.0')