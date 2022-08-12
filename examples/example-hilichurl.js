const { Hilichurl } = require('../src/lib/classes/hilichurl')
const path = require('path')

// Example usage of the Hilichurl class
const dataPath = path.join(__dirname, '..', 'data', 'hilichurlianDB.json')
const hilichurl = new Hilichurl(dataPath)
console.log(hilichurl.lipsum(40))
