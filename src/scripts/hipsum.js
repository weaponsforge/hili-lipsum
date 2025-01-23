const { Hilipsum } = require('../lib/classes/hilipsum')

const main = () => {
  const wordCount = process.env['npm_config_wordcount']

  // Loads the scraped and pre-processed words on /data/hilichurlianDB.json
  const hilichurl = new Hilipsum()
  console.log(hilichurl.lipsum(wordCount ?? 0))
}

main()
