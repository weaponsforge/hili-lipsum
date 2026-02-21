const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const {
  removeSpecialChars,
  getParenthesisWords,
  getParenthesisStartWords,
  saveToJSON
} = require('../../utils')

/**
 * Manages hilichurl words-related data processing and formatting
 */
class Hilichurl {
  /**
   * Array of Objects containing the raw Hilichurlian data extracted from web-scraped data.
   * @type {object[]}
   */
  hilichurlianRAW = []

  /**
   * Array of Objects containing processed and formatted Hilichurlian data.
   * @type {object[]}
   */
  hilichurlianDB = []

  /**
   * Array of Objects containing invalid Hilichurlian data - items without a Hilichurlian word.
   * @type {object[]}
   */
  invalidItems = []

  /**
   * Number of columns in the Hilichurlian Lexicon website's HTML table. Default value should be 4 (as of 20241018).
   * @type {number}
   */
  COLUMN_LENGTH = 0

  /**
   * Initializes the Hilichurl class with Hilichurlian JSON data from `jsonFile`
   * @param {string} jsonFile - Full file path to a target JSON file containing object[] object arrays
   */
  constructor (jsonFile) {
    if (jsonFile) {
      this.loadrecords(jsonFile)
    }
  }

  /**
   * Scrapes Hilichurlian words and definitions from the Hilichurl Lexicon website whose URL is defined in the .env.example "HILICHURLIAN_TEXT_URL" variable
   * and remove special chars on the scraped content
   * @returns {Promise<void>} Stores an array of raw scraped Hilichurlian words minus special characters in this.hilichurlianRAW[]
   *    [{ word: String, eng: String, notes: String },...]
   */
  async scrapewords () {
    let timeoutId
    const abortController = new AbortController()

    try {
      timeoutId = setTimeout(() => abortController.abort(), 30_000) // 30 secs

      const res = await fetch(process.env.HILICHURLIAN_TEXT_URL, {
        method: 'GET',
        signal: abortController.signal
      })

      if (!res.ok) {
        const body = await res.text()
        console.error('HTTP', res.status)
        console.error(body.slice(0, 800))

        throw new Error(`Request failed with status ${res.status}`)
      }

      const data = await res.text()
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
        const columnsLength = $(this).find('td').length

        $(this).find('td').each(function (columnIndex) {
          const string = $(this).text()

          if (that.COLUMN_LENGTH === 0) {
            that.COLUMN_LENGTH = columnsLength
          }

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

        // At least 1 or more columns (keys) should have a value
        if (Object.values(rowObject).some(item => item !== '')) {
          that.hilichurlianRAW.push(rowObject)
        }
      })

      console.log('[SCRAPING LOGS] ----------')
      console.log(`downloaded and scraped ${this.hilichurlianRAW.length} items\n`)
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err
      }

      throw new Error(err.message, { cause: err })
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }

  /**
   * Post-processing and extra formating of raw-scraped Hilichurlian words from `this.hilichurlianRAW[]`.
   * Stores the formatted words in `this.hilichurlianDB[]`.
   * @param {object[]} [data] - (Optional) Array of objects containing raw Hilichurlian data. Uses the `this.hilichurlianRAW[]` data if not provided.
   * @returns {void}
   */
  formatwords (data = []) {
    let pluralCount = 0
    let validRawsCount = 0
    let splitWordsCount = 0
    let allNullCount = 0

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

        if (!item.eng) item.eng = null
        if (!item.cn) item.cn = null
        if (!item.notes) item.notes = null

        // Count items without EN translation or CN player analysis
        if (item.eng === null && item.cn === null) allNullCount += 1

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
      } else {
        // Invalid data - no Hilichurlian word
        this.invalidItems.push(item)
      }
    })

    let formatLog = '[FORMATTING LOGS] ----------\n'
    formatLog += ` - processed ${validRawsCount} rows\n`
    formatLog += ` - created and formatted ${this.hilichurlianDB.length} valid entries\n`
    formatLog += ` - invalid data: ${this.invalidItems.length}\n`
    formatLog += ` - plural words: ${pluralCount}\n`
    formatLog += ` - split words: ${splitWordsCount}\n`
    formatLog += ` - no CN/EN translations: ${allNullCount}\n`

    console.log(formatLog)
  }

  /**
   * Loads the contents of a JSON file containing Hilichulian-like data items to `this.hilichurlianDB[]` for further processing
   * @param {string} jsonFile - Full file path to a target JSON file containing object[] object arrays
   * @returns {void}
   */
  loadrecords (jsonFile) {
    try {
      const json = fs.readFileSync(jsonFile, 'utf-8')
      this.hilichurlianDB = JSON.parse(json)?.data
    } catch (err) {
      throw new Error(err.message, { cause: err })
    }
  }

  /**
   * Writes the contents of `this.hilichurlianDB[]` into a JSON file
   * @param {string} directory
   *    - (Optional) Full directory path minus the filename where to save the JSON file
   *    - Will write the JSON file to the project's root directory if ommitted
   * @returns {string} Random-generated file name
   */
  writerecords (directory) {
    const dirName = (directory) || process.cwd()
    const filename = path.join(dirName, `hilichurlDB-${Math.floor((new Date()).getTime() / 1000)}.json`)

    const metadata = {
      source: process.env.HILICHURLIAN_TEXT_URL || '',
      title: 'Hilichurlian Language Dictionary',
      description: 'Dictionary of Hilichurlian words and their English translations exctracted from the source URL.',
      date_created: new Date().toISOString()
    }

    try {
      saveToJSON({
        filename,
        data: {
          metadata,
          data: this.hilichurlianDB
        }
      })

      return filename
    } catch (err) {
      throw new Error(err.message, { cause: err })
    }
  }

  /**
   * Refreshes the in-memory Hilichurlian dictionaries by scraping data
   * from the `HILICHURLIAN_TEXT_URL` environment variable into:
   *  - `this.hilichurlianRAW[]`
   *  - `this.hilichurlianDB[]`
   * @returns {Promise<void>}
   */
  async fetchrecords () {
    this.hilichurlianRAW = []
    this.hilichurlianDB = []
    this.invalidItems = []

    try {
      await this.scrapewords()
    } catch (err) {
      throw new Error(err.message, { cause: err })
    }

    if (this.hilichurlianRAW.length > 0) {
      try {
        this.formatwords()
      } catch (err) {
        throw new Error(err.message, { cause: err })
      }
    }
  }

  /**
   * Generates a Hilichurlian sentence made up of non-sensical Hilichurlian words
   * @param {number} wordCount - Maximum number of words to include in the sentence
   * @returns {string} Random Hilichurlian words
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
