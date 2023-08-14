import { UrlFileHandle } from './pdf/pdf.js';
import { attach, DocumentWells } from './ui/render.jsx'

const root = document.getElementById('wells')

const handles = [new UrlFileHandle("/test/pdf/fixtures/two-page.pdf"), new UrlFileHandle("/test/pdf/fixtures/two-page.pdf"),]

const wells = <DocumentWells handles={handles}/>

attach(root,wells);
