import {collectPageDocuments } from './pdf/pdf.js'
import {attach} from './ui/render.jsx'

document.getElementById('file-selector-go').addEventListener("click", (e) => {
    var file = document.getElementById('file-selector').files[0]
    var collectionPromise = file.arrayBuffer().then((arrBuf) => 
        collectPageDocuments(arrBuf)
    )

    collectionPromise.then((collection) => {
        var root = document.getElementById('canvases')
        attach(root, collection)
    })
})
