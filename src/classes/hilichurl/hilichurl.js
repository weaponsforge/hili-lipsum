const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const { removeSpecialChars } = require('../../lib/utils')

// Manages hilichurl words-related data processing and formatting
class Hilichurl {
  /**
   * Initialize the Hilichurl class with JSON data from "jsonFile"
   * @param {String} jsonFile - Full file path to a target JSON file containing Object[] object arrays
   */
  constructor (jsonFile) {
    this.hilichurlianDB = []
    this.hilichurlianRAW = []

    if (jsonFile) {
      this.loadrecords(jsonFile)
    }
  }

  /**
   * Scrape hilichurlian words and definition from .env.example "HILICHURLIAN_TEXT_URL" variable
   * and remove special chars on the scraped content
   * @returns {Object[]} Stores an array of raw sraped hilichurlian words minus special characters in this.hilichurlianRAW[]
   *    [{ word: String, eng: String, notes: String },...]
   */
  async scrapewords () {
    try {
      const { data } = await axios.get(process.env.HILICHURLIAN_TEXT_URL)
      const $ = cheerio.load(data)
      const that = this

      $('table > tbody > tr').each(function () {
        const rowObject = {
          word: '',
          eng: '',
          notes: ''
        }

        // Extract words while removing special characters
        $(this).find('td').each(function (i, elem) {
          const string = $(this).text()

          switch (i) {
          case 0:
            rowObject.word = removeSpecialChars({ string })
            break
          case 1:
            rowObject.eng = removeSpecialChars({ string })
            break
          case 2:
            rowObject.notes = removeSpecialChars({ string })
            break
          default:
            break
          }
        })

        that.hilichurlianRAW.push(rowObject)
      })

      console.log('[SCRAPING LOGS] ----------')
      console.log(`downloaded and scraped ${this.hilichurlianRAW.length} items\n`)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /**
   * Post-processing and extra formating of the raw-scraped hilichurlian words from this.hilichurlianRAW[]
   * Stores the formatted words in this.hilichurlianDB
   * @param {Object[]} data
   */
  async formatwords (data = []) {
    let pluralCount = 0
    let validRawsCount = 0
    let splitWordsCount = 0

    const toProcess = data.length > 0
      ? data
      : this.hilichurlianRAW

    toProcess.forEach((item) => {
      if (item.word !== '') {
        const hiliWord = item.word
        validRawsCount += 1

        // Split words with plural counterparts
        const isPlural = hiliWord.match(/plural:(.+[^)])/)
        if (isPlural) {
          // Insert the extracted plural word
          const pluralWord = { ...item }
          pluralWord.word = isPlural[1].trim()
          this.hilichurlianDB.push(pluralWord)
          pluralCount += 1

          // Insert the original word minus the plural word
          // i.e., "(plural: mimi)"
          item.word = removeSpecialChars({
            string: item.word,
            removePlural: true
          })
        }

        // Split words with slash "/" divisor
        const orWords = hiliWord.split('/')

        if (orWords.length === 2) {
          splitWordsCount += 1

          orWords.forEach((word) => {
            this.hilichurlianDB.push({
              word: word.trim(),
              eng: item.eng,
              notes: item.notes
            })
          })
        }

        if (orWords.length < 2) {
          this.hilichurlianDB.push(item)
        }
      }
    })

    console.log('[FORMATTING LOGS] ----------')
    console.log(`processed ${validRawsCount} rows`)
    console.log(`created and formatted ${this.hilichurlianDB.length} entries`)
    console.log(`plural words: ${pluralCount}`)
    console.log(`split words: ${splitWordsCount}`)
  }

  /**
   * Loads the contents of a JSON file to this.hilichurlianDB[] for further processing
   * @param {String} jsonFile - Full file path to a target JSON file containing Object[] object arrays
   */
  loadrecords (jsonFile) {
    try {
      const json = fs.readFileSync(jsonFile, 'utf-8')
      this.hilichurlianDB = JSON.parse(json)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

module.exports = Hilichurl
