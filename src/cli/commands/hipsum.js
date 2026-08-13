const { Command } = require('commander')
const { hipsum } = require('../../scripts/hipsum/hipsum')
const { delayProcess } = require('../../lib/utils')
const { CLI_META, CLI_ARGS } = require('../meta')

const hipsumCommand = new Command()

hipsumCommand
  .name(CLI_META.CMD_HIPSUM.NAME)
  .description(CLI_META.CMD_HIPSUM.DESCRIPTION)
  .option(CLI_ARGS.CMD_HIPSUM.WORDCOUNT.OPTION, CLI_ARGS.CMD_HIPSUM.DESCRIPTION, parseInt)
  .action((options) => {
    const { wordcount } = options

    if (process.env.IS_DOCKER_DEBUG) {
      setTimeout(() => {
        delayProcess(async () => await hipsum(wordcount), 5000)
      }, 5000)
    } else {
      hipsum(wordcount)
    }
  })

module.exports = hipsumCommand
