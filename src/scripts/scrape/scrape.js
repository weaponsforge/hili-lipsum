require('dotenv').config({ quiet: true })
const { Hilichurl } = require('../../lib/classes/hilichurl')

/**
 * Fetches the current available Hilichurlian words data from `MEDIAWIKI_PAGE_NAME`
 * and writes it to a `"hilichurlDB-<timestamp>.json"` file relative to where
 * this script is run
 */
const scrape = async () => {
  const hilichurl = new Hilichurl()

  // Scrape and format hilichurlian words
  await hilichurl.fetchrecords()

  // Write scraped and formatted data to a JSON file relative to the calling process
  const writePath = hilichurl.writerecords(process.cwd())

  console.log('Hilichurlian data dictionary written at:')
  console.log(writePath)
}

module.exports = {
  scrape
}
