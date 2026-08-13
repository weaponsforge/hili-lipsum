const { Command } = require('commander')
const { hipsum } = require('../../scripts/hipsum/hipsum')
const { CLI_META, CLI_ARGS } = require('../meta')
const { logError, delayProcess } = require('../../lib/utils')

const hipsumCommand = new Command()

const handle = (count = 0) => {
  try {
    hipsum(count)
  } catch (err) {
    logError(err)
  }
}

hipsumCommand
  .name(CLI_META.CMD_HIPSUM.NAME)
  .description(CLI_META.CMD_HIPSUM.DESCRIPTION)
  .option(CLI_ARGS.CMD_HIPSUM.WORDCOUNT.OPTION, CLI_ARGS.CMD_HIPSUM.WORDCOUNT.DESCRIPTION, parseInt)
  .action((options) => {
    const { wordcount } = options

    if (process.env.IS_DOCKER_DEBUG) {
      delayProcess(async () => handle(wordcount), 5000)
    } else {
      handle(wordcount)
    }
  })

module.exports = hipsumCommand
