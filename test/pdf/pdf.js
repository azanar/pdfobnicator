import { collectPageDocuments, PageDocCollection } from '../../src/pdf/pdf.js'
import * as fs from 'node:fs/promises'

const assert = require('assert')

describe('pdf', function () {
  describe('.collectPageDocuments()', function () {
    it('should return -1 when the value is not present', function (done) {
      fs.open('test/pdf/fixtures/two-page.pdf').then((fh) => {
        return fh.readFile()
      }).then((buffer) =>
        collectPageDocuments(buffer)
      ).then((thing) => {
        assert(thing)
        assert(typeof thing === 'object')
        assert(thing.constructor === PageDocCollection.prototype.constructor)
        assert(thing.pageDocs.length === 2)
      }).then(
        done, done
      )
    })
  })
})
