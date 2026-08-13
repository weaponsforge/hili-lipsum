const { execSync } = require('child_process')
const packageJson = require('../../package.json')

const main = () => {
  const info = {
    'Node version': process?.version ?? '-',
    'Platform': process?.platform ?? '-',
    'Arch':  process?.arch ?? '-',
    'V8 version': process?.versions.v8 ?? '-'
  }

  for (let key in info) {
    console.log(`${key}: ${info[key]}`)
  }

  try {
    console.log('npm version:', execSync('npm -v').toString().trim())
    console.log('hili-lipsum version:', packageJson?.version ?? '0.0.0')
  } catch {
    console.log('npm version: unavailable')
  }
}

main()
