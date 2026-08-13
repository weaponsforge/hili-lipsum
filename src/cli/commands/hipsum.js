const { Command } = require('commander')
const { hipsum } = require('../../scripts/hipsum/hipsum')
const { CLI_META, CLI_ARGS } = require('../meta')
const {
  delayProcess,
  logError
} = require('../../lib/utils')

const hipsumCommand = new Command()

const handle = async (count = 0) => {
  try {
    await hipsum(count)
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
      setTimeout(() => {
        delayProcess(async () => await handle(wordcount), 5000)
      }, 5000)
    } else {
      handle(wordcount)
    }
  })

module.exports = hipsumCommand
