import { UrlFileHandle } from './pdf/pdf.js';
import { attach, DocumentWells } from './ui/render.jsx'

const root = document.getElementById('wells')

const handles = []

const wells = <DocumentWells handles={handles}/>

attach(root,wells);
