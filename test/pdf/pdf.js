import { PageDocument, collectPageDocuments, PageDocCollection } from '../../src/pdf/pdf.js'
import * as nodefs from 'node:fs/promises'
import fs from 'fs'
import { PDFDocument as pdflibDoc } from 'pdf-lib'
import assert from 'node:assert'

describe('pdf', function () {
  describe('.collectPageDocuments()', function () {
    it('should return -1 when the value is not present', function (done) {
      nodefs.open('test/pdf/fixtures/two-page.pdf').then((fh) => {
        return fh.readFile()
      }).then((buffer) =>
        collectPageDocuments(buffer)
      ).then((thing) => {
        assert.ok(thing)
        assert.ok(typeof thing === 'object')
        assert.ok(thing.constructor === PageDocCollection.prototype.constructor)
        assert.ok(thing.pageDocs.length === 2)
      }).then(
        done, done
      )
    })
  })

  describe("PageDocument", function () {
    context("there is a loaded document", function () {
      const data = fs.readFileSync('test/pdf/fixtures/two-page.pdf')
      const docPromise = pdflibDoc.load(data);
      const obj = new PageDocument(docPromise)

      describe('.rotate()', function () {
        it('should rotate with a sane input', function (done) {
          obj.rotate(90).then(
            () => {
              return docPromise.then((doc) => {
                return doc.getPage(0)
              }).then((page) => {
                assert(page.getRotation().angle === 90)
                done()
              })
            },
            done
          )
        })
      })
    })
  })
})