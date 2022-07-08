import * as render from "./render.js"
import "./src/fs.js"

const Zepto = self.Zepto

const canvas = Zepto('#canvases').get(0)

Zepto('#file-selector-go').on('click', (e) => {
    const picker = Zepto('#file-selector').get(0)
    const data = picker.files[0].arrayBuffer().then((value) => { render.render(value, canvas) });
});

