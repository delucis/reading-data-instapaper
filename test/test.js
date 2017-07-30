'use strict'

const DESCRIBE = require('mocha').describe
const BEFORE_EACH = require('mocha').beforeEach
const IT = require('mocha').it
const EXPECT = require('chai').expect
const READING_DATA = require('@delucis/reading-data')
const RDInstapaper = require('../index')

BEFORE_EACH(function () {
  READING_DATA.uninstall()
})

DESCRIBE('ReadingDataInstapaper', function () {
  IT('should be an object', function () {
    EXPECT(RDInstapaper).to.be.an('object')
  })

  IT('should have a fetch method', function () {
    EXPECT(RDInstapaper).to.have.property('fetch')
    EXPECT(RDInstapaper.fetch).to.be.a('function')
  })

  IT('should throw an error if used without API tokens', async function () {
    READING_DATA.use(RDInstapaper)
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })

  IT('should throw an error if used without user credentials', async function () {
    READING_DATA.use(RDInstapaper, {
      apiKey: 'bogus-key',
      apiSecret: 'bogus-secret'
    })
    try {
      await READING_DATA.run()
    } catch (e) {
      EXPECT(e).to.be.an('error')
    }
  })
})
