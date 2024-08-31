function print (exe, obj, str) {
return `[Unit]
Description=${exe}
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

module.exports = function (dir, obj) {

  const etc = '/etc/app/'
            + obj.name + '/'
            
  const loc = {
    live: {
      key: etc + 'live.key',
      cert: etc + 'cert.crt',
      ca: etc + 'ca.crt' 
    }, 
    test: {
      key: etc + 'live.key',
      cert: etc + 'cert.crt',
      ca: etc + 'ca.crt'
    }
  }
    
  const val = {
    dir: 'app',
    https: 443,
    http: 80,
    sftp: 3000,
    app: 'index.js',
    bot: 'robot.js',
    pbk: etc + 'bot.pem'
  }
  
  const env = {
    ...loc[obj.mode],
    ...obj[obj.mode]
  }
  
  delete obj.test
  delete obj.live
  
  obj = {...val, ...obj}
  obj = {...env, ...obj}

  let str = ''
  for (var key in obj) {
    str += '\nEnvironment='
        + `${key}=${obj[key]}`
  }
  
  const pkg = dir + '/bundle/'

  fs.writeFileSync(pkg + 'app.service', 
    print('app', obj, str))
  fs.writeFileSync(pkg + 'bot.service', 
    print('bot', obj, str))
  fs.writeFileSync(pkg + 'robot.js',
    fs.readFileSync(dir + '/robot.js'))
 
  return obj

}
