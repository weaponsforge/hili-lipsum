const path = require('path')
const { Hilichurl } = require('../lib/classes/hilichurl')

const main = () => {
  // Load the scraped and pre-processed words
  const hilichurldb = path.join(__dirname, '..', '..', 'data', 'hilichurlianDB.json')
  const hilichurl = new Hilichurl(hilichurldb)
  console.log(hilichurl.lipsum())
}

main()
