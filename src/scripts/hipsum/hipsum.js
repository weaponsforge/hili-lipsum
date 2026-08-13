#!/usr/bin/env node

const { Hilipsum } = require('../../lib/classes/hilipsum')

/**
 * Generates a Hilichurlian sentence made up of non-sensical Hilichurlian words.
 * Wrapper around `Hilipsum.lipsum()` or `Hilichurl.lipsum()`
 * @param {number} wordCount - Maximum number of words to include in the sentence
 * @returns {string} Random Hilichurlian words
 */
const hipsum = (wordCount = 10) => {
  const count = parseInt(wordCount)
  const finalCount = count > 0 ? count : 10

  // Loads the scraped and pre-processed words on /data/hilichurlianDB.json
  const hilichurl = new Hilipsum()
  const sentence = hilichurl.lipsum(finalCount)
  console.log(sentence)

  return sentence
}

module.exports = {
  hipsum
}
