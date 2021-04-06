/* (1) paste #.#.#.# from copied */
const host = "xxxxx"

/* (2) write domain.com */
const name = "xxxxx"

/* (3) apply environment */
const env = "test live"

/* (4) setup process.env */
const ssl=`/etc/letsencrypt/live/${name}/`
const obj = {
  live: {
    key: ssl + 'live.key',
    cert: ssl + 'cert.crt',
    ca: ssl + 'ca.crt' 
  }, 
  test: {
    key: ssl + 'privkey.pem',
    cert: ssl + 'fullchain.pem'
  }}

/* standard setting */
const dir = "app"
const run = "index.js"
const val = {...{
  https: 443,
  http: 80,
  bot: 3000,
}, ...obj[env]}

function print () {
return `[Unit]
Description=bot
After=network.target

[Service]
ExecStart=/root/${dir}/robot.js
Restart=always
Type=simple
#User=nobody
#Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin${str}
WorkingDirectory=/root/${dir}

[Install]
WantedBy=multi-user.target
`
}

let str = ''
for (var idx in val) {
str += `\nEnvironment=${idx}=${val[idx]}`
}

require('fs')
.writeFileSync(
  require('path')
  .join(__dirname, `bot.service`),
  print())