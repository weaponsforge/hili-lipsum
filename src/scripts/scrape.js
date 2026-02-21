require('dotenv').config({ quiet: true })
const path = require('path')
const { Hilichurl } = require('../lib/classes/hilichurl')
const { delayProcess } = require('../lib/utils')

const main = async () => {
  const hilichurl = new Hilichurl()

  try {
    // Scrape and format hilichurlian words
    await hilichurl.fetchrecords()

    // Write scraped and formatted data to a JSON file in the project's root directory
    hilichurl.writerecords(path.resolve(__dirname, '..', '..'))
    process.exit(0)
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

if (process.env.IS_DOCKER) {
  delayProcess(main, 5000)
} else {
  main()
}
