const { parseArgs } = require('../../lib/utils')
const { hipsum } = require('./hipsum')
parseArgs

const argv = parseArgs(process.argv.slice(2))
hipsum(argv.wordcount)
