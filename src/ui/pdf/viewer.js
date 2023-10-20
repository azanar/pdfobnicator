import PdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import {
  getDocument as getPdfJsDocument,
  GlobalWorkerOptions,
} from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = PdfjsWorker;

export class ScaledPageViewer {
  constructor(pageViewer, scale) {
    if (undefined === scale) {
      throw "Scale must be defined";
    }
    if (!(scale > 0)) {
      throw "Scale must positive";
    }
    this.pageViewer = pageViewer;
    this.scale = scale;
  }

  get dimensions() {
    return this.pageViewer.viewportAtScale(this.scale).then((vp) => {
      if (!vp.height || !vp.width) throw Error("WTF");
      return {
        height: vp.height,
        width: vp.width,
      };
    });
  }

  rotate(degrees) {
    this.pageViewer.rotate(degrees);
  }

  render(params) {
    this.pageViewer.render({
      ...params,
      scale: this.scale,
    });
  }
}

export class ConstrainedPageViewer {
  constructor(pageViewer, maxDim) {
    if (undefined === maxDim) {
      throw "maxDim must be defined";
    }
    this.pageViewer = pageViewer;
    this.maxDim = maxDim;
  }

  get scale() {
    const maxDim = this.maxDim
    return this.pageViewer.viewportAtScale(1).then(function (vp) {
      if (!vp.height || !vp.width) throw Error("WTF");
      const scale = Math.max(
        1,
        Math.min(maxDim / vp.width, maxDim / vp.height)
      );
      if (undefined === scale) {
        throw "Scale must be defined";
      }
      if (!(scale > 0)) {
        throw "Scale must positive";
      }
      return scale;
    });
  }

  get scaledPageViewer() {
    return this.scale.then(
      (scale) => new ScaledPageViewer(this.pageViewer, scale)
    );
  }

  rotate(degrees) {
    this.pageViewer.rotate(degrees);
  }

  get dimensions() {
    return this.scaledPageViewer.then(
      (scaledViewer) => scaledViewer.dimensions
    );
  }

  render(params) {
    this.scaledPageViewer.then((viewer) => viewer.render(params));
  }
}

export class PageViewer {
  constructor(pageDoc) {
    //if (!pageDoc) throw "Must provide a pagedoc!"
    this.pageDoc = pageDoc;
  }

  viewportAtScale(scale) {
    return this.pageDoc.data
      .then((data) => getPdfJsDocument({ data }).promise)
      .then((viewerdoc) => viewerdoc.getPage(1))
      .then((page) => {
        return page.getViewport({ scale: scale });
      });
  }

  rotate(degrees) {
    this.pageDoc.rotate(degrees);
  }

  render(params) {
    if (!this.pageDoc) throw "Must have a pagedoc!";
    if (params.scale) {
      if (typeof params.scale !== "number") {
        throw "scale must be a number";
      }
      if (!Number.isFinite(params.scale) || params.scale <= 0) {
        throw "scale must be sane";
      }
    }

    this.pageDoc.data
      .then((data) => getPdfJsDocument({ data }).promise)
      .then((viewerdoc) => viewerdoc.getPage(1))
      .then((page) => {
        const vp = page.getViewport({ scale: params.scale || 1.0 });

        var canvasContext = params.canvas.getContext("2d");

        var context = {
          canvasContext: canvasContext,
          viewport: vp,
        };

        page.render(context);
      });
  }
}
