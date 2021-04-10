const crypto = require('crypto')
const etc = new RegExp("[=\\/+\\d]", "g")
const txt = plain(600)
const str = 'abcdeffhijklmnopqrstuvwxyz'

let pbk
let prk

function plain (num) {
  return crypto
    .randomBytes(num + 5)
    .toString("base64")
    .replace(etc, "")
    .slice(0, num)
}

function gen () {
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
  
      pbk = crypto
        .createPublicKey({
          key: pub,
          format: 'pem',
          type: 'spki'
        })
     
      prk = crypto
        .createPrivateKey({
          key: prv,
          format: 'pem',
          type: 'pkcs8',
          passphrase: txt
        })
        
      let buf
      let arr = str
          .match(/.{1,5}/g)
        .map(str=>{
           buf = Buffer
             .from(str, 'utf8')
           return crypto
             .publicEncrypt(pbk, buf)
             .toString('hex')
         })
         .join('\u0001')
      
      arr = Buffer.from(arr, 'utf8')
      arr = arr.toString('utf8')
      
      let end = arr
        .split('\u0001')
        .map(str => {
          buf = Buffer
             .from(str, 'hex')
          return crypto
             .privateDecrypt(prk, buf)
             .toString('utf8')
        })
        .join('')
        
        console.log(end)
      
    })
  
}

gen()
