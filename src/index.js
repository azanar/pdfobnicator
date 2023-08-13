import { UrlFileHandle } from './pdf/pdf.js';
import { attach, Wells } from './ui/render.jsx'

const root = document.getElementById('wells')

const handle = new UrlFileHandle("/test/pdf/fixtures/two-page.pdf")

const wells = <Wells handles={[handle]}/>

attach(root,wells);
