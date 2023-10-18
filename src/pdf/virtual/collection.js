export class Collection {
    constructor (vdocs) {
        this.arr = vdocs
    }
    
    add (page, idx) {
        this.arr.splice(idx, 0, page)
    }

    remove(page) {
        var idx = this.arr.indexOf(page)
        if (idx == -1) {
            throw new Error("Page not found!")
        }
        this.arr.splice(idx, 1)
    }
    
    extend (pages) {
        this.arr = this.arr.concat(pages)
    }

    collect() {
        return
    }
}