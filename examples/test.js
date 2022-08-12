const { Hilichurl } = require('../src/lib/classes/hilichurl')
const path = require('path')

// Use the the following if installed via npm
// const { Hhilichurl } = require('hili-lipsum')

const main = async () => {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'hilichurlianDB.json')
    const hilichurl = new Hilichurl(dataPath)
    console.log(hilichurl.lipsum(40))

    await hilichurl.fetchrecords()
    hilichurl.writerecords()
  } catch (err) {
    console.log(err.message)
  }
}

main()