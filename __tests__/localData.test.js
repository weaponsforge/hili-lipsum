require('dotenv').config()
const path = require('path')
const { Hilichurl } = require('../src/lib/classes/hilichurl')

let hilichurl

/* eslint-disable no-undef */
beforeAll(() => {
  const pathToDefaultFile = path.join(__dirname, '..', 'data', 'hilichurlianDB.json')
  hilichurl = new Hilichurl(pathToDefaultFile)
})

describe('Iinitialization from local JSON file', () => {
  it('should generate ipsum from local data file', () => {
    const ipsum = hilichurl.lipsum()
    console.log(ipsum)

    expect(typeof ipsum).toBe('string')
    expect(ipsum.length).toBeGreaterThan(0)
  })
})
