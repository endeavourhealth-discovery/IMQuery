export class RDF {
  public static NAMESPACE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
  public static PREFIX = "rdf";
  public static TYPE = RDF.NAMESPACE + "type";
  public static PROPERTY = RDF.NAMESPACE + "Property";

  public static PREFIXED = new class {

    constructor(public superThis: any) {
      Object.keys(superThis).forEach(key => this[key] =  superThis[key].replace(superThis.NAMESPACE, superThis.PREFIX + ":"));
      return this;
    }

  }(this);
}
