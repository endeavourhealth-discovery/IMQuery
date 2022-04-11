export class IM {
  public static NAMESPACE = "http://endhealth.info/im#";
  public static PREFIX = "im";
  public static IRI = "@id";
  public static CODE = IM.NAMESPACE + "code";
  public static SCHEME = IM.NAMESPACE + "scheme";
  public static STATUS = IM.NAMESPACE + "status";
  public static IS_A = IM.NAMESPACE + "isA";
  public static ROLE_GROUP = IM.NAMESPACE + "roleGroup";
  public static IS_CONTAINED_IN = IM.NAMESPACE + "isContainedIn";
  public static PROPERTY_GROUP = IM.NAMESPACE + "propertyGroup";
  public static INHERITED_FROM = IM.NAMESPACE + "inheritedFrom";

  // mapping
  public static HAS_MAP = IM.NAMESPACE + "hasMap";
  public static ONE_OF = IM.NAMESPACE + "oneOf";
  public static MAP_ADVICE = IM.NAMESPACE + "mapAdvice";
  public static MATCHED_TO = IM.NAMESPACE + "matchedTo";
  public static MAP_PRIORITY = IM.NAMESPACE + "mapPriority";
  public static ASSURANCE_LEVEL = IM.NAMESPACE + "assuranceLevel";
  public static COMBINATION_OF = IM.NAMESPACE + "combinationOf";
  public static SOME_OF = IM.NAMESPACE + "someOf";
  //maps assurance levels
  public static NATIONALLY_ASSURED_UK = IM.NAMESPACE + "NationallyAssuredUK";

  public static QUERY_SET = IM.NAMESPACE + "QuerySet";
  public static QUERY_TEMPLATE = IM.NAMESPACE + "QueryTemplate";
  public static CONCEPT_SET = IM.NAMESPACE + "ConceptSet";
  public static VALUE_SET = IM.NAMESPACE + "ValueSet";
  public static HAS_MEMBERS = IM.NAMESPACE + "hasMembers";
  public static SET = IM.NAMESPACE + "Set";
  public static RECORD_TYPE = IM.NAMESPACE + "RecordType";
  public static FOLDER = IM.NAMESPACE + "Folder";
  public static DATA_PROPERTY = IM.NAMESPACE + "DataProperty";

  // code schemes
  public static CODE_SCHEME = IM.NAMESPACE + "CodeScheme";
  public static CODE_SCHEME_SNOMED = IM.NAMESPACE + "SnomedCodeScheme";
  public static CODE_SCHEME_READ = IM.NAMESPACE + "Read2CodeScheme";
  public static CODE_SCHEME_ICD10 = IM.NAMESPACE + "ICD10CodeScheme";
  public static CODE_SCHEME_OPCS4 = IM.NAMESPACE + "OPSC49CodeScheme";
  public static CODE_SCHEME_EMIS = IM.NAMESPACE + "EMISCodeScheme";
  public static CODE_SCHEME_BARTS = IM.NAMESPACE + "BartsCernerCodeScheme";
  public static CODE_SCHEME_VISION = IM.NAMESPACE + "VisionCodeScheme";
  public static CODE_SCHEME_CTV3 = IM.NAMESPACE + "CTV3TPPCodeScheme";
  public static CODE_SCHEME_TERMS = IM.NAMESPACE + "TermOnlyCodeScheme";
  public static CODE_SCHEME_ODS = IM.NAMESPACE + "ODSCodeScheme";
  public static DISCOVERY_CODE = IM.NAMESPACE + "DiscoveryCodeScheme";

  public static STATS_REPORT_ENTRY = IM.NAMESPACE + "hasStatsReportEntry";
}
