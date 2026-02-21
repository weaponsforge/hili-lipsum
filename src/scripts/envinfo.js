const { execSync } = require('child_process')

console.log('Node version:', process.version)
console.log('Platform:', process.platform)
console.log('Arch:', process.arch)
console.log('V8 version:', process.versions.v8)

try {
  console.log('npm version:', execSync('npm -v').toString().trim())
} catch (err) {
  console.log('npm version: unavailable')
}
