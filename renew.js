const fs = require('fs')
const src = process.cwd() + '/basic/'
const tgt = process.cwd() + '/equip/'

fs.readdirSync(src).forEach(str=>{
  const file = fs.readFileSync(src + str)
  fs.writeFileSync(tgt + str, file)
  console.log('ok', str)
})
   