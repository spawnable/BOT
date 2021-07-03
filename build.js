
const bot = 'MY-NODE-APPE51C32F1-847A-4A7B-99A3-FF485077904B'
const rig = 'MY-NODE-APP9CB40F00-65B1-4B08-8092-32BCE6DDE16B'

const obj = {
  /* write domain.com */
  name: "xxxxx",
  /* apply environment */
  env: "web dev",
  web: {
    /* paste #.#.#.# */
    host: 'xxxxx', 
    /* variable */
    web1: 'web1',
    /* variable */
    web2: 'web2'
  },
  dev: {
    host: '0.0.0.0', 
    /* variable */
    dev1: 'dev1',
    /* variable */
    dev2: 'dev2'
  }
}

try {
  
  require('up')(obj)
  
} catch (err) {
  console.log(err)
const fs = require('fs')
const json = process.cwd()+'/package.json'
const play = process.cwd() + "/../../"

const pkg = JSON
  .parse(fs.readFileSync(json))

const dir = {
  robot: fs
  .readdirSync(play)
  .filter(str => str.includes(bot))[0],
  
  up: pkg.dependencies.up, 
  
  engine: fs
  .readdirSync(play)
  .filter(str => str.includes(rig))[0],
  
  on: pkg.dependencies.on
}

  let str = ''
  for (var key in dir) {
    str += `${key}: \n ${dir[key]}\n`
  }

  console.log(str)
}
