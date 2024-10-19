const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const {
  removeSpecialChars,
  getParenthesisWords,
  getParenthesisStartWords,
  saveToJSON
} = require('../../utils')

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

      // HTML column table indices
      const COL_HILIHURLIAN_INDEX = 0
      const COL_ENG_INDEX = 1
      const COL_CN_INDEX = 2
      const COL_NOTES_INDEX = 3

      $('table > tbody > tr').each(function () {
        const rowObject = {
          word: '', // Hilichurlian word(s)
          eng: '', // English definition
          cn: '', // Chinese-translated definition
          notes: '' // Additional notes
        }

        // Extract words while removing special characters
        $(this).find('td').each(function (columnIndex, elem) {
          const string = $(this).text()

          switch (columnIndex) {
          case COL_HILIHURLIAN_INDEX:
            rowObject.word = removeSpecialChars({ string })
            break
          case COL_ENG_INDEX:
            rowObject.eng = removeSpecialChars({ string })
            break
          case COL_CN_INDEX:
            rowObject.cn = removeSpecialChars({ string })
            break
          case COL_NOTES_INDEX:
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
          // Insert the extracted plural word and en/cn definitions
          const pluralWord = { ...item }

          pluralWord.word = isPlural[1].trim()
          pluralWord.eng = getParenthesisWords({ string: pluralWord.eng, excludes: ['plural:'] })
          pluralWord.cn = getParenthesisWords({ string: pluralWord.cn, excludes: ['plural:'] })

          this.hilichurlianDB.push(pluralWord)
          pluralCount += 1

          // Insert the original (singular) word minus the plural word and singular en/cn definitions
          // i.e., "I, me (plural: mimi)"
          item.word = removeSpecialChars({ string: item.word, removePlural: true })
          item.eng = getParenthesisStartWords({ string: item.eng }) ?? ''
          item.cn = getParenthesisStartWords({ string: item.cn }) ?? ''
        }

        // Split words with slash "/" divisor
        const orWords = hiliWord.split('/')

        if (orWords.length === 2) {
          splitWordsCount += 1

          orWords.forEach((word) => {
            this.hilichurlianDB.push({
              word: word.trim(),
              eng: item.eng,
              cn: item.cn,
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

  /**
   * Write the contents of "this.hilichurlianDB" into a JSON file
   * @param {String} filePath
   *    - (Optional) Full directory path minus the filename where to save the JSON file
   *    - Will write the JSON file to the project's root directory if ommitted
   */
  writerecords (directory) {
    const dirName = (directory) || process.cwd()

    try {
      saveToJSON({
        object: this.hilichurlianDB,
        filename: path.join(dirName, `hilichurlDB-${Math.floor((new Date()).getTime() / 1000)}.json`)
      })
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /**
   * Refresh the in-memory hilichurlian dictionaries by scraping data
   * from HILICHURLIAN_TEXT_URL into:
   *  - this.hilichurlianRAW
   *  - this.hilichurlianDB
   */
  async fetchrecords () {
    this.hilichurlianRAW = []
    this.hilichurlianDB = []

    try {
      await this.scrapewords()
    } catch (err) {
      throw new Error(err.message)
    }

    if (this.hilichurlianRAW.length > 0) {
      try {
        this.formatwords()
      } catch (err) {
        throw new Error(err.message)
      }
    }
  }

  /**
   * Generate a Hilichurlian sentence made up of non-sensical Hilichurlian words
   * @param {Number} wordCount - Maximum number of words to include in the sentence
   * @returns {String} Random Hilichurlian words
   */
  lipsum (wordCount = 0) {
    const minw = 5
    const maxw = 15

    // Set a specified word length or use a random max (15) word length
    const maxWords = (wordCount > 0)
      ? wordCount
      : Math.floor(Math.random() * (maxw - minw + 1) + minw)

    // Generate random unique word indices
    const wordIndex = []

    while (wordIndex.length < maxWords) {
      const min = 0
      const max = this.hilichurlianDB.length - 1

      // Random word index
      const index = Math.floor(Math.random() * (max - min + 1) + min)

      if (maxWords < max) {
        // Generate unique indices if the total words required
        // is less than the total word entries in DB
        if (!wordIndex.includes(index)) {
          wordIndex.push(index)
        }
      } else {
        // Use repeating words
        wordIndex.push(index)
      }
    }

    // Construct the random-word sentence
    const sentence = wordIndex.reduce((acc, curr) => {
      acc += this.hilichurlianDB[curr].word + ' '
      return acc
    }, '')

    return sentence
  }
}

module.exports = Hilichurl
