const crypto = require('crypto')
const etc = new RegExp("[=\\/+\\d]", "g")
const txt = plain(600)
const str = 'abcdeffhijklmnopqrstuvwxyz'
const buf = Buffer.from(str, 'utf8')

let pbk
let prk

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
      
      
      let arr = buf
        .toString('hex')
      
    })
  
}
  
  
    


    .match(/.{1,200}/g)
  
  arr => {
    arr.map(hex)
  }
  

function chunk (buf) {
  let n = buf.length
  let i = Math.ceil(n / 200)
  let j = 0
  let arr = []
  let num
  
  while (i--) {
    num = j * 200
    
    const bin = crypto
       .privateDecrypt(prk2, 
       buf.slice(num, num + 200))
     
     arr.push(bin)
    
    j++
  }
  
  return arr
  
}


function chunk (buf) {
  
  
  
  
  let n = buf.length
  let i = Math.ceil(n / 200)
  let j = 0
  let arr = []
  let num
  
  while (i--) {
    num = j * 200
    
    const bin = crypto
       .publicEncrypt(pbk, 
       buf.slice(num, num + 200))
     
     arr.push(bin)
    
    j++
  }
  
  return arr
  
}

function plain (num) {
  return crypto
    .randomBytes(num + 5)
    .toString("base64")
    .replace(etc, "")
    .slice(0, num)
}
