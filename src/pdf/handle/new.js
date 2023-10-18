import { Collection } from "../virtual/collection";

export class NewFileHandle {
    get path() {
      return "new.pdf";
    }
  
    get document() {
      return new Promise((resolve) => resolve(new Document()))
    }
  }