const fs = require('fs')
const src = process.cwd() + '/basic/'
const tgt = process.cwd() + '/'
const hid = [
  'renew.js',
  'reset.js'
]

fs.readdirSync(src).forEach(str=>{
  if (hid.includes(str)) return
  const file = fs.readFileSync(src + str)
  fs.writeFileSync(tgt + str, file)
  console.log('ok', str)
})