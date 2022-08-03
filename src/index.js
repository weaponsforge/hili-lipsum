const path = require('path')
const { Hilichurl } = require('./classes/hilichurl')

const main = () => {
  // Load the scraped and pre-processed words
  const hilichurldb = path.resolve(__dirname, '..', 'data', 'hilichurlianDB.json')
  const hilichurl = new Hilichurl(hilichurldb)
  console.log(hilichurl.hilichurlianDB[0])
}

main()
