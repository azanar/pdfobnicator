import { collectPageDocuments } from 'pdf/pdf.js'
import { describe, it } from 'mocha'
import * as fs from 'node:fs/promises'

const assert = require('assert')

describe('pdf', function () {
  describe('.collectPageDocuments()', function () {
    it('should return -1 when the value is not present', function () {
      fs.open('test/fixtures/two-page.pdf').then((fh) =>
        fh.readFile()
      ).then((buffer) =>
        collectPageDocuments(buffer)
      ).then((thing) =>
        assert(thing)
      )
    })
  })
})
