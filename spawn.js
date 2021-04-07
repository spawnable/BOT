function print (exe, obj, str) {
return `[Unit]
Description=${obj.dir}
After=network.target

[Service]
ExecStart=/root/${obj.dir}/${obj[exe]}
Restart=always
Type=simple
#User=nobody
#Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin${str}
WorkingDirectory=/root/${obj.dir}

[Install]
WantedBy=multi-user.target
`
}

const fs = require('fs')

exports.module = function (dir, obj) {

  const ssl = '/etc/letsencrypt/live/'
            + obj.name + '/'
            
  const loc = {
    web: {
      key: ssl + 'live.key',
      cert: ssl + 'cert.crt',
      ca: ssl + 'ca.crt' 
    }, 
    dev: {
      key: ssl + 'privkey.pem',
      cert: ssl + 'fullchain.pem'
    }}
    
  const val = {
    dir: 'app',
    https: 443,
    http: 80,
    sftp: 3000,
    app: 'index.js',
    bot: 'robot.js'
  }
  
  const env = {
    ...loc[obj.env],
    ...obj[obj.env]
  }
  
  delete obj.web
  delete obj.dev
  
  obj = {...val, ...obj}
  obj = {...env, ...obj}

  let str = ''
  for (var key in obj) {
    str += '\nEnvironment='
        + `${key}=${obj[key]}`
  }
  
  const pkg = dir + '/packet/'

  fs.writeFileSync(pkg + 'app.service', 
    print('app', obj, str))
  fs.writeFileSync(pkg + 'bot.service', 
    print('bot', obj, str))
  fs.writeFileSync(pkg + 'robot.js',
    fs.readFileSync(dir + '/robot.js'))

  return obj

}
