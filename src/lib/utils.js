require('dotenv').config()
const fs = require('fs')

/**
 * Remove special characters and special patterns on a string
 * @param {string} string - String to process and format
 * @param {bool} removePlural - Flag to remove the string pattern "(plural: <any_word>)" from the string
 * @returns {string|undefined} Formatted string or undefined
 */
const removeSpecialChars = ({ string, removePlural = false }) => {
  if (typeof string !== 'string') return

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
 * Retrieves words enclosed in a parenthesis from strings following a _"I, me (plural: mimi)"_ format.
 * Optionally removes words in the `excludes[]` array.
 * @param {Object} param - Input parameters
 * @param {string} param.string - Input string
 * @param {string[]} param.excludes - String array of word/s to exclude from the result
 * @returns {string|undefined} Extracted words or the original string. Returns undefined if string input is invalid.
 */
const getParenthesisWords = ({ string, excludes = [] }) => {
  if (typeof string !== 'string') return

  const regex = /\(\s*([^)]*)\)/
  const match = string.match(regex)
  let result = string

  if (match) {
    result = match[1].trim()

    excludes.forEach(word => {
      if (typeof word === 'string') {
        result = result.replaceAll(word, '').trim()
      }
    })
  }

  return result
}

/**
 * Retrives words that go before an openning parenthesis character
 * @param {Object} param - Input parameters
 * @param {string} param.string - Input string
 * @returns {string|undefined} Extracted words or the original string. Returns undefined if string input is invalid.
 */
const getParenthesisStartWords = ({ string }) => {
  if (typeof string !== 'string') return

  const regex = /([^()]+)\s*\(/
  const match = string.match(regex)
  let result = string

  if (match) {
    result = match[1].trim()
  }

  return result
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

/**
 * Stalls function execution by `timeout` milliseconds
 * @param {Function} callback - Callback function to execute after `timeout` milliseconds
 * @param {Number} timeout - Milliseconds timeout delay
 */
const delayProcess = (callback, timeout = 1000) => {
  setTimeout(() => {
    console.log(`Delay ${timeout} finished. Running callback...`)
    callback()
  }, timeout)
}

module.exports = {
  removeSpecialChars,
  getParenthesisWords,
  getParenthesisStartWords,
  saveToJSON,
  delayProcess
}
