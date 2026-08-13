const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const {
  removeSpecialChars,
  getParenthesisWords,
  getParenthesisStartWords,
  saveToJSON,
  buildQuery
} = require('../../utils')

const { API_ROOT, PAGE_NAME } = require('../../constants')

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
   * Hilichurlian words data full API URL source
   * @type {string}
   */
  apiUrl = ''

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
   * Fetches Hilichurlian words and definitions from the Genshin Impact Fandom WikiMedia API whose URL is defined in the .env.example "MEDIAWIKI_API_ROOT" variable
   * and remove special chars on the scraped content
   * @param {object} mediaWikiQueryUrl - Full Genshin Impact Fandom WikiMedia API `URL`ss Object
   * @returns {Promise<void>} Stores an array of raw scraped Hilichurlian words minus special characters in this.hilichurlianRAW[]
   *    [{ word: String, eng: String, notes: String },...]
   */
  async scrapewords (mediaWikiQueryUrl = '') {
    let timeoutId
    const abortController = new AbortController()

    try {
      this.isURLObject()
      timeoutId = setTimeout(() => abortController.abort(), 30_000) // 30 secs

      const res = await fetch(mediaWikiQueryUrl, {
        method: 'GET',
        signal: abortController.signal
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        const body = await res.text()
        const errMsg = `Request failed with status ${res.status}`
        throw new Error(errMsg, { cause: new Error(body.slice(0, 800)) })
      }

      let data = this.isMediaWikiUrl(mediaWikiQueryUrl)
        ? await res.json()  // response from mediawiki API
        : await res.text()  // response from web page (older versions)

      const htmlString = data?.parse?.text ?? data

      if (typeof htmlString !== 'string') {
        throw new Error('Extracted data is not a string')
      }

      const $ = cheerio.load(data?.parse?.text ?? data)
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
      const dbData = JSON.parse(json)

      this.hilichurlianDB = dbData?.data ?? []
      this.apiUrl = dbData?.metadata?.source ?? ''
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
      source: this.apiUrl,
      title: 'Hilichurlian Language Dictionary',
      description: 'Dictionary of Hilichurlian words and their English translations extracted from the source URL.',
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
   * from the `MEDIAWIKI_API_ROOT` environment variable into:
   *  - `this.hilichurlianRAW[]`
   *  - `this.hilichurlianDB[]`
   * @param {string} url - API URL string
   * @param {object} options - Genshin Impact Fandom MediaWiki API query parameters
   * @returns {Promise<void>}
   */
  async fetchrecords (url, options) {
    this.hilichurlianRAW = []
    this.hilichurlianDB = []
    this.invalidItems = []

    const apiRootUrl = url ?? API_ROOT
    const isMediaWiki = this.isMediaWikiUrl(new URL(apiRootUrl))

    const queryUrl = isMediaWiki
      ? buildQuery(apiRootUrl, options ?? {
        action: 'parse',
        format: 'json',
        formatversion: 2,
        prop: 'text',
        page: PAGE_NAME
      })
      : buildQuery(apiRootUrl, options ?? {})

    try {
      await this.scrapewords(queryUrl)
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err
      }

      throw new Error(err.message, { cause: err })
    }

    if (this.hilichurlianRAW.length > 0) {
      try {
        this.formatwords()
        this.apiUrl = queryUrl?.href
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

  /**
   * Partially checks if an Object is a URL Object
   * @param {URL} url - URL() object
   * @returns {boolean}
   */
  isURLObject (url) {
    return !(url instanceof URL) || !('href' in url)
  }

  /**
   * Checks if the `pathname` in a `URL` object is a MediaWiki URL
   * @param {URL} url - URL() object
   * @returns {boolean}
   */
  isMediaWikiUrl (url) {
    this.isURLObject()
    return Boolean(url?.pathname?.endsWith('api.php'))
  }
}

module.exports = Hilichurl
