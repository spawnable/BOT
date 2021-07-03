const crypto = require('crypto')
const fs = require('fs')
const rg = new RegExp("[=\\/+\\d]", "g")

const txt = gen(600)
const loc = process.cwd() + '/../../'
const bot = process.cwd() + "/bundle/"
const rig = src('MY-NODE-APP9CB40F00-65B1-4B08-8092-32BCE6DDE16B') + '/switch/'

function gen (num) {
  return crypto
    .randomBytes(num + 5)
    .toString("base64")
    .replace(rg, "")
    .slice(0, num)
}

function src (use) {
  return loc + fs
    .readdirSync(loc)
    .filter(str => str.includes(use))[0]
    + '/src'
}

function put (err, pub, prv) {
  if (!err) {
   const clr = "\r\x1b"
 fs.writeFileSync(rig + 'bot.txt', txt)
  fs.writeFileSync(bot + 'bot.pem', pub)
  fs.writeFileSync(rig + 'bot.key', prv)
   process.stdout.write('\r\x1b' + '⁎[* *]')
  } else
  process.stdout.write('\r\x1b[x x]')
}

   
function run (exe) {
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
  }, exe)
}

         
process.stdout.write('[▪ ▪]')
run(put)
