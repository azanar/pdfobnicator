import * as pdfLib from "pdf-lib";

export class Page {
  constructor(docPromise) {
    this.docPromise = docPromise;
  }

  rotate(degrees) {
    return this.docPromise
      .then((doc) => doc.getPage(0))
      .then((page) => {
        const rot = page.getRotation().angle;

        const newRot = (rot + degrees) % 360;

        const normalizedRot = newRot >= 0 ? newRot : newRot + 360;

        console.log(`rotating ${degrees}`);

        page.setRotation(pdfLib.degrees(normalizedRot));
      });
  }
}
