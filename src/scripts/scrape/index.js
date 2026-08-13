const { logError } = require('../../lib/utils')
const { scrape } = require('./scrape')

;(async () => {
  try {
    await scrape()
  } catch (err) {
    logError(err)
  }
})()
