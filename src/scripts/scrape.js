#!/usr/bin/env node

require('dotenv').config({ quiet: true })
const { Hilichurl } = require('../lib/classes/hilichurl')
const { delayProcess } = require('../lib/utils')

const main = async () => {
  const hilichurl = new Hilichurl()

  try {
    // Scrape and format hilichurlian words
    await hilichurl.fetchrecords()

    // Write scraped and formatted data to a JSON file relative to the calling process
    const writePath = hilichurl.writerecords(process.cwd())

    console.log('Hilichurlian data dictionary written at:')
    console.log(writePath)

    process.exit(0)
  } catch (err) {
    console.error(err.message)
    console.error(err.cause)
    process.exit(1)
  }
}

if (process.env.IS_DOCKER) {
  delayProcess(main, 5000)
} else {
  main()
}
