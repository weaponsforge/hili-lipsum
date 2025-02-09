const {
  removeSpecialChars,
  getParenthesisWords,
  getParenthesisStartWords,
  saveToJSON,
  delayProcess
} = require('./utils')

const { Hilipsum } = require('./classes/hilipsum')

const {
  Hilichurl,
  scrapewords
} = require('./classes/hilichurl')

module.exports = {
  removeSpecialChars,
  getParenthesisWords,
  getParenthesisStartWords,
  saveToJSON,
  delayProcess,
  scrapewords,
  Hilichurl,
  Hilipsum
}
