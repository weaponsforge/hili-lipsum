const { Hilichurl } = require('./src/lib/classes/hilichurl')
const { Hilipsum } = require('./src/lib/classes/hilipsum')
const { hipsum } = require('./src/scripts/hipsum/hipsum')
const { scrape } = require('./src/scripts/scrape/scrape')

module.exports = {
  Hilichurl,
  Hilipsum,
  hipsum,
  scrape
}
