const { Command } = require('commander')
const { scrape } = require('../../scripts/scrape/scrape')
const { delayProcess } = require('../../lib/utils')
const { CLI_META } = require('../meta')

const scrapeCommand = new Command()

scrapeCommand
  .name(CLI_META.CMD_SCRAPE.NAME)
  .description(CLI_META.CMD_SCRAPE.DESCRIPTION)
  .action(async () => {
    if (process.env.IS_DOCKER_DEBUG) {
      delayProcess(async () => await scrape(), 5000)
    } else {
      await scrape()
    }
  })

module.exports = scrapeCommand
