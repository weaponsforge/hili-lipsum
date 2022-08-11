require('dotenv').config()
const path = require('path')
const { Hilichurl } = require('../lib/classes/hilichurl')
const { saveToJSON } = require('../lib/utils')

const main = async () => {
  const hilichurl = new Hilichurl()

  try {
    // Scrape hilichurlian words
    await hilichurl.scrapewords()
    hilichurl.formatwords()

    // Write scraped and formatted data to a JSON file
    saveToJSON({
      object: hilichurl.hilichurlianDB,
      filename: path.resolve(__dirname, '..', '..', 'hilichurlianDB.json')
    })

    process.exit(0)
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

main()
