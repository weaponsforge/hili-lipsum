require('dotenv').config({ quiet: true })
const fs = require('fs')
const { Hilichurl } = require('../src/lib/classes/hilichurl')

const hilichurl = new Hilichurl()

// Number of columns in the HTML table. Default value is 4 (as of 20241018).
const EXPECTED_TABLE_COLUMNS = 4

/* eslint-disable no-undef */
// Fetch and scrape the latest data from HILICHURLIAN_TEXT_URL
beforeAll(async () => {
  await hilichurl.fetchrecords()
})

describe('Hilichurlian Wiki Web Scraper', () => {
  it('should generate ipsum from downloaded Hilichurl data', () => {
    const ipsum = hilichurl.lipsum()
    console.log(ipsum)

    expect(typeof ipsum).toBe('string')
    expect(ipsum.length).toBeGreaterThan(0)
  })

  it('should write Hilichurl data dictionary to JSON file', () => {
    const pathToFile = hilichurl.writerecords()
    const jsonFile = fs.readFileSync(pathToFile, { encoding: 'utf8' })

    console.log('Reading JSON file', pathToFile)
    expect(jsonFile).toBeDefined()
  })

  it(`should read from ${EXPECTED_TABLE_COLUMNS} HTML table columns`, () => {
    expect(hilichurl.COLUMN_LENGTH).toBe(EXPECTED_TABLE_COLUMNS)
  })
})

describe('Hilichurl Data Dictionary', () => {
  it('should be an non-empty object[] array', () => {
    expect(hilichurl.hilichurlianDB).toBeDefined()
    expect(Array.isArray(hilichurl.hilichurlianDB)).toBe(true)
    expect(hilichurl.hilichurlianDB.length).toBeGreaterThan(0)
  })

  it('should have valid keys and values per item', () => {
    hilichurl.hilichurlianDB.forEach(item => {
      expect(typeof item).toBe('object')
      expect(item).not.toBeNull()

      // Key-values should be strings
      expect(typeof item.word).toBe('string')

      // Items should be null or string
      const isValidEn = typeof item.eng === 'string' || item.eng === null
      const isValidCn = typeof item.cn === 'string' || item.cn === null
      const isValidNotes = typeof item.notes === 'string' || item.notes === null

      expect(isValidEn).toBe(true)
      expect(isValidCn).toBe(true)
      expect(isValidNotes).toBe(true)

      // Hilichurlian word should have a value
      expect(item.word.length).toBeGreaterThan(0)
    })
  })
})
