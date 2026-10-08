const { parseArgs } = require('node:util')
const { logError } = require('../../lib/utils')
const { hipsum } = require('./hipsum')

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    wordcount: {
      type: 'string',
      short: 'w',
      default: '10',
      description: 'Number of words to generate'
    }
  }
})

try {
  hipsum(values.wordcount)
} catch (err) {
  logError(err)
}
