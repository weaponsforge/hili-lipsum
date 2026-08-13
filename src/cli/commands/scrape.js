const { Command } = require('commander')
const { scrape } = require('../../scripts/scrape/scrape')
const { CLI_META } = require('../meta')
const {
  delayProcess,
  logError
} = require('../../lib/utils')

const scrapeCommand = new Command()

const handle = async () => {
  try {
    await scrape()
  } catch (err) {
    logError(err)
  }
}

scrapeCommand
  .name(CLI_META.CMD_SCRAPE.NAME)
  .description(CLI_META.CMD_SCRAPE.DESCRIPTION)
  .action(async () => {
    if (process.env.IS_DOCKER_DEBUG) {
      delayProcess(async () => await handle(), 5000)
    } else {
      await handle()
    }
  })

module.exports = scrapeCommand
