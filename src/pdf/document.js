import { Collection } from "./virtual/collection"
import { Document as VDoc } from "./virtual/document"

export class Document {
    constructor (docPromise) {
       this.promise = docPromise 
    }

    get data() {
        return this.docPromise
        .then((doc) => {
            if (!doc) throw Error("wtf");
            return doc.saveAsBase64();
        })
        .then((data) => atob(data));
    }


    extract() {
        return this.promise.then((doc) =>
            new Collection(
                doc.getPageIndices().map((idx) => {
                    console.log(idx)
                    const copier = (d) => d.copyPages(doc, [idx]).then((p) => p[0])
                    return new VDoc(copier)
                })
            )
        )
    }
}