const path = require('path')
const { Hilichurl } = require('../hilichurl')

/**
 * Hilipsum is a subclass of Hilichurl that defines the local
 * pre-scraped hilichurlianDB.json in its constructor
 */
class Hilipsum extends Hilichurl {
  constructor () {
    super(path.join(__dirname, '..', '..', '..', '..', 'data', 'hilichurlianDB.json'))
  }
}

module.exports = Hilipsum
