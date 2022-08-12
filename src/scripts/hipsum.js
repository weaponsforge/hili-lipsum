const { Hilipsum } = require('../lib/classes/hilipsum')

const main = () => {
  // Loads the scraped and pre-processed words on /data/hilichurlianDB.json
  const hilichurl = new Hilipsum()
  console.log(hilichurl.lipsum())
}

main()
