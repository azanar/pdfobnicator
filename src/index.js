import { UrlFileHandle } from './pdf/pdf.js';
import { attach, DocumentWells } from './ui/render.jsx'

const root = document.getElementById('wells')

const url = new URL(document.URL)
console.log(url)
let handles = []
if (url.searchParams.get("test")) {
    console.log("test mode active!")
    handles = [new UrlFileHandle("sample.pdf"), new UrlFileHandle("sample.pdf")]
}
const wells = <DocumentWells handles={handles}/>

attach(root,wells);
 