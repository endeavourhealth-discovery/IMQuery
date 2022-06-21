export class RDFS {
  public static NAMESPACE = "http://www.w3.org/2000/01/rdf-schema#";
  public static PREFIX = "rdfs";
  public static LABEL = RDFS.NAMESPACE + "label";
  public static COMMENT = RDFS.NAMESPACE + "comment";
  public static SUBCLASS = RDFS.NAMESPACE + "subClassOf";


  public static PREFIXED = new class {

    constructor(public superThis: any) {
      Object.keys(superThis).forEach(key => this[key] =  superThis[key].replace(superThis.NAMESPACE, superThis.PREFIX + ":"));
      return this;
    }

  }(this);
}
