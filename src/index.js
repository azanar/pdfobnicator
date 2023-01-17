import { collectPageDocuments } from './pdf/pdf.js'
import { attach } from './ui/render.jsx'

document.getElementById('file-selector-go').addEventListener('click', (e) => {
  const file = document.getElementById('file-selector').files[0]
  const collectionPromise = file.arrayBuffer().then((arrBuf) =>
    collectPageDocuments(arrBuf)
  )

  collectionPromise.then((collection) => {
    const root = document.getElementById('canvases')
    attach(root, collection)
  })
})
