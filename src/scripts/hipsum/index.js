const { parseArgs, logError } = require('../../lib/utils')
const { hipsum } = require('./hipsum')

const argv = parseArgs(process.argv.slice(2))

try {
  hipsum(argv.wordcount)
} catch (err) {
  logError(err)
}
