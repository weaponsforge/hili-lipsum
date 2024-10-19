require('dotenv').config()
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
  it('should be an non-empty array', () => {
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
      expect(typeof item.eng).toBe('string')
      expect(typeof item.cn).toBe('string')
      expect(typeof item.notes).toBe('string')

      // Hilichurlian word should have a value
      expect(item.word.length).toBeGreaterThan(0)

      // At least the English or Chinese definition should have a value
      const isEngNonEmpty = item.eng.length > 0
      const isCnNonEmpty = item.cn.length > 0

      expect(isEngNonEmpty || isCnNonEmpty).toBe(true)
    })
  })
})
