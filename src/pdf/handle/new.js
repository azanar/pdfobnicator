import { Collection } from "../virtual/collection";
import { Document } from "../virtual/document";

export class NewFileHandle {
    get path() {
      return "new.pdf";
    }
  
    get document() {
      return Document.empty()
    }
  }