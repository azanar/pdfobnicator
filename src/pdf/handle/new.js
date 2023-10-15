import { Collection } from "../virtual/collection";

export class NewFileHandle {
    get path() {
      return "new.pdf";
    }
  
    get pageDocs() {
      return new Promise((resolve) => resolve(new Collection()))
    }
  }