require('dotenv').config()
const fs = require('fs')

/**
 * Remove special characters and special patterns on a string
 * @param {String} string - String to process and format
 * @param {Bool} removePlural - Flag to remove the string pattern "(plural: <any_word>)" from the string
 * @returns {String} formatted string
 */
const removeSpecialChars = ({ string, removePlural = false }) => {
  if (string === undefined) {
    return ''
  }

  // Replace all newlines and tabs
  let str = string.replace(/(\r\n|\n|\r)/gm, '')

  // Replace all [1], [2], patterns
  str = str.replace(/[|[0-9]|]/g, '')

  str = str.replace(/"/g, '')

  // Remove all plural word notes i.e., "(plural: mimi)"
  if (removePlural) {
    str = str.replace(/ *\([^)]*\) */g, '')
  }

  return str
}

/**
 * Write a single or array of JavaScript objects to a JSON file
 * @param {Object[]} object - Array of simple JavaScript objects
 * @param {String} filename - Full file path to the target destination file
 * @returns Creates a JSON file on the specified filename location
 */
const saveToJSON = ({ object, filename }) => {
  fs.writeFileSync(
    filename,
    JSON.stringify(object, null, 2),
    'utf-8'
  )
}

module.exports = {
  removeSpecialChars,
  saveToJSON
}
