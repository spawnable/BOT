const path = require('path');
const env = 'test';
const app = {
  host: '157.230.254.141', 
  name: 'numerables.com', 
  https: 443,
  http: 80,
  push: 3000
};
const ssl = `/etc/letsencrypt/live/${app.name}/`;
const obj = {
live: {
  key: ssl + 'live.key',
  cert: ssl + 'cert.crt',
  ca: ssl + 'ca.crt' 
}, 
test: {
  key: ssl + 'privkey.pem',
  cert: ssl + 'fullchain.pem'
}};

const val = {...app, ...obj[env]};
let str = '';
for (var idx in val) {
str += `\nEnvironment=${idx}=${val[idx]}`;
};

require('fs')
.writeFileSync(
  path.join(__dirname, 'app.service'),
  print('app', 'app', 'index.js'));

require('fs')
.writeFileSync(
  path.join(__dirname, 'bot.service'),
  print('bot', 'app','robot.js'));

function print (name, main, exec) {
return `[Unit]
Description=${name}
After=network.target

[Service]
ExecStart=/root/${main}/${exec}
Restart=always
Type=simple
#User=nobody
#Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin${str}
WorkingDirectory=/root/${main}

[Install]
WantedBy=multi-user.target
`
}

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
Description=${dir}
After=network.target

[Service]
ExecStart=/root/${dir}/${run}
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
  .join(__dirname, `${dir}.service`),
  print())