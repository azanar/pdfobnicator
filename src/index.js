import { UrlFileHandle } from './pdf/handle/url';
import { attach } from './ui/render'

import { DocumentWells } from './ui/wells' 

const root = document.getElementById('wells')

const url = new URL(document.URL)
console.log(url)
let collections = []
if (url.searchParams.get("test")) {
    console.log("test mode active!")
    const handles = [new UrlFileHandle("sample.pdf"), new UrlFileHandle("sample.pdf")]
    const documents = handles.map((h) => h.document)
    collections = documents.map((dp) => dp.then((d) => d.extract()))
}
const wells = <DocumentWells collections={collections}/>

attach(root,wells);
 