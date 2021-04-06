const fs = require('fs')
const src = process.cwd() + '/'
const tgt = [
  'robot.js',
  'setup.js'
]

fs.readdirSync(src).forEach(str=>{
  if (tgt.includes(str)){
    fs.unlinkSync(src + str)
    console.log('ok', str)
  }
})