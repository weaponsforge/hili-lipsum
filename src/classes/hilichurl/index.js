const Hilichurl = require('./hilichurl')
const HL = new Hilichurl()

const scrapewords = HL.scrapewords.bind(HL)

module.exports = {
  Hilichurl,
  scrapewords
}
