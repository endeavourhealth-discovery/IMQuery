// Generated from ./src/discovery-syntax/DiscoverySyntax.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ConceptContext } from "./DiscoverySyntaxParser";
import { DirectiveContext } from "./DiscoverySyntaxParser";
import { PrefixIDContext } from "./DiscoverySyntaxParser";
import { ConceptPredicateObjectListContext } from "./DiscoverySyntaxParser";
import { AnnotationContext } from "./DiscoverySyntaxParser";
import { PredicateIriContext } from "./DiscoverySyntaxParser";
import { SchemeContext } from "./DiscoverySyntaxParser";
import { TypeContext } from "./DiscoverySyntaxParser";
import { VersionContext } from "./DiscoverySyntaxParser";
import { AxiomContext } from "./DiscoverySyntaxParser";
import { PropertiesContext } from "./DiscoverySyntaxParser";
import { MembershipContext } from "./DiscoverySyntaxParser";
import { MembersContext } from "./DiscoverySyntaxParser";
import { NotmembersContext } from "./DiscoverySyntaxParser";
import { TargetContext } from "./DiscoverySyntaxParser";
import { PredicateListContext } from "./DiscoverySyntaxParser";
import { MinInclusiveContext } from "./DiscoverySyntaxParser";
import { MaxInclusiveContext } from "./DiscoverySyntaxParser";
import { MinExclusiveContext } from "./DiscoverySyntaxParser";
import { MaxExclusiveContext } from "./DiscoverySyntaxParser";
import { StatusContext } from "./DiscoverySyntaxParser";
import { SubclassOfContext } from "./DiscoverySyntaxParser";
import { EquivalentToContext } from "./DiscoverySyntaxParser";
import { SubpropertyOfContext } from "./DiscoverySyntaxParser";
import { InverseOfContext } from "./DiscoverySyntaxParser";
import { DomainContext } from "./DiscoverySyntaxParser";
import { RangeContext } from "./DiscoverySyntaxParser";
import { ClassExpressionContext } from "./DiscoverySyntaxParser";
import { IntersectionContext } from "./DiscoverySyntaxParser";
import { SubExpressionContext } from "./DiscoverySyntaxParser";
import { UnionContext } from "./DiscoverySyntaxParser";
import { ComplementContext } from "./DiscoverySyntaxParser";
import { IriContext } from "./DiscoverySyntaxParser";
import { LiteralContext } from "./DiscoverySyntaxParser";
import { PropertyRestrictionContext } from "./DiscoverySyntaxParser";
import { SomeContext } from "./DiscoverySyntaxParser";
import { OnlyContext } from "./DiscoverySyntaxParser";
import { PropertyIriContext } from "./DiscoverySyntaxParser";
import { ExactCardinalityContext } from "./DiscoverySyntaxParser";
import { RangeCardinalityContext } from "./DiscoverySyntaxParser";
import { MinCardinalityContext } from "./DiscoverySyntaxParser";
import { MaxCardinalityContext } from "./DiscoverySyntaxParser";
import { ClassOrDataTypeContext } from "./DiscoverySyntaxParser";
import { NameContext } from "./DiscoverySyntaxParser";
import { DescriptionContext } from "./DiscoverySyntaxParser";
import { CodeContext } from "./DiscoverySyntaxParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `DiscoverySyntaxParser`.
 */
export interface DiscoverySyntaxListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.concept`.
	 * @param ctx the parse tree
	 */
	enterConcept?: (ctx: ConceptContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.concept`.
	 * @param ctx the parse tree
	 */
	exitConcept?: (ctx: ConceptContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.directive`.
	 * @param ctx the parse tree
	 */
	enterDirective?: (ctx: DirectiveContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.directive`.
	 * @param ctx the parse tree
	 */
	exitDirective?: (ctx: DirectiveContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.prefixID`.
	 * @param ctx the parse tree
	 */
	enterPrefixID?: (ctx: PrefixIDContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.prefixID`.
	 * @param ctx the parse tree
	 */
	exitPrefixID?: (ctx: PrefixIDContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.conceptPredicateObjectList`.
	 * @param ctx the parse tree
	 */
	enterConceptPredicateObjectList?: (ctx: ConceptPredicateObjectListContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.conceptPredicateObjectList`.
	 * @param ctx the parse tree
	 */
	exitConceptPredicateObjectList?: (ctx: ConceptPredicateObjectListContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.annotation`.
	 * @param ctx the parse tree
	 */
	enterAnnotation?: (ctx: AnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.annotation`.
	 * @param ctx the parse tree
	 */
	exitAnnotation?: (ctx: AnnotationContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.predicateIri`.
	 * @param ctx the parse tree
	 */
	enterPredicateIri?: (ctx: PredicateIriContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.predicateIri`.
	 * @param ctx the parse tree
	 */
	exitPredicateIri?: (ctx: PredicateIriContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.scheme`.
	 * @param ctx the parse tree
	 */
	enterScheme?: (ctx: SchemeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.scheme`.
	 * @param ctx the parse tree
	 */
	exitScheme?: (ctx: SchemeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.type`.
	 * @param ctx the parse tree
	 */
	enterType?: (ctx: TypeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.type`.
	 * @param ctx the parse tree
	 */
	exitType?: (ctx: TypeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.version`.
	 * @param ctx the parse tree
	 */
	enterVersion?: (ctx: VersionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.version`.
	 * @param ctx the parse tree
	 */
	exitVersion?: (ctx: VersionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.axiom`.
	 * @param ctx the parse tree
	 */
	enterAxiom?: (ctx: AxiomContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.axiom`.
	 * @param ctx the parse tree
	 */
	exitAxiom?: (ctx: AxiomContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.properties`.
	 * @param ctx the parse tree
	 */
	enterProperties?: (ctx: PropertiesContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.properties`.
	 * @param ctx the parse tree
	 */
	exitProperties?: (ctx: PropertiesContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.membership`.
	 * @param ctx the parse tree
	 */
	enterMembership?: (ctx: MembershipContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.membership`.
	 * @param ctx the parse tree
	 */
	exitMembership?: (ctx: MembershipContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.members`.
	 * @param ctx the parse tree
	 */
	enterMembers?: (ctx: MembersContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.members`.
	 * @param ctx the parse tree
	 */
	exitMembers?: (ctx: MembersContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.notmembers`.
	 * @param ctx the parse tree
	 */
	enterNotmembers?: (ctx: NotmembersContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.notmembers`.
	 * @param ctx the parse tree
	 */
	exitNotmembers?: (ctx: NotmembersContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.target`.
	 * @param ctx the parse tree
	 */
	enterTarget?: (ctx: TargetContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.target`.
	 * @param ctx the parse tree
	 */
	exitTarget?: (ctx: TargetContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.predicateList`.
	 * @param ctx the parse tree
	 */
	enterPredicateList?: (ctx: PredicateListContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.predicateList`.
	 * @param ctx the parse tree
	 */
	exitPredicateList?: (ctx: PredicateListContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.minInclusive`.
	 * @param ctx the parse tree
	 */
	enterMinInclusive?: (ctx: MinInclusiveContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.minInclusive`.
	 * @param ctx the parse tree
	 */
	exitMinInclusive?: (ctx: MinInclusiveContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.maxInclusive`.
	 * @param ctx the parse tree
	 */
	enterMaxInclusive?: (ctx: MaxInclusiveContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.maxInclusive`.
	 * @param ctx the parse tree
	 */
	exitMaxInclusive?: (ctx: MaxInclusiveContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.minExclusive`.
	 * @param ctx the parse tree
	 */
	enterMinExclusive?: (ctx: MinExclusiveContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.minExclusive`.
	 * @param ctx the parse tree
	 */
	exitMinExclusive?: (ctx: MinExclusiveContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.maxExclusive`.
	 * @param ctx the parse tree
	 */
	enterMaxExclusive?: (ctx: MaxExclusiveContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.maxExclusive`.
	 * @param ctx the parse tree
	 */
	exitMaxExclusive?: (ctx: MaxExclusiveContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.status`.
	 * @param ctx the parse tree
	 */
	enterStatus?: (ctx: StatusContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.status`.
	 * @param ctx the parse tree
	 */
	exitStatus?: (ctx: StatusContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.subclassOf`.
	 * @param ctx the parse tree
	 */
	enterSubclassOf?: (ctx: SubclassOfContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.subclassOf`.
	 * @param ctx the parse tree
	 */
	exitSubclassOf?: (ctx: SubclassOfContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.equivalentTo`.
	 * @param ctx the parse tree
	 */
	enterEquivalentTo?: (ctx: EquivalentToContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.equivalentTo`.
	 * @param ctx the parse tree
	 */
	exitEquivalentTo?: (ctx: EquivalentToContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.subpropertyOf`.
	 * @param ctx the parse tree
	 */
	enterSubpropertyOf?: (ctx: SubpropertyOfContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.subpropertyOf`.
	 * @param ctx the parse tree
	 */
	exitSubpropertyOf?: (ctx: SubpropertyOfContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.inverseOf`.
	 * @param ctx the parse tree
	 */
	enterInverseOf?: (ctx: InverseOfContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.inverseOf`.
	 * @param ctx the parse tree
	 */
	exitInverseOf?: (ctx: InverseOfContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.domain`.
	 * @param ctx the parse tree
	 */
	enterDomain?: (ctx: DomainContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.domain`.
	 * @param ctx the parse tree
	 */
	exitDomain?: (ctx: DomainContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.range`.
	 * @param ctx the parse tree
	 */
	enterRange?: (ctx: RangeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.range`.
	 * @param ctx the parse tree
	 */
	exitRange?: (ctx: RangeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.classExpression`.
	 * @param ctx the parse tree
	 */
	enterClassExpression?: (ctx: ClassExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.classExpression`.
	 * @param ctx the parse tree
	 */
	exitClassExpression?: (ctx: ClassExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.intersection`.
	 * @param ctx the parse tree
	 */
	enterIntersection?: (ctx: IntersectionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.intersection`.
	 * @param ctx the parse tree
	 */
	exitIntersection?: (ctx: IntersectionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.subExpression`.
	 * @param ctx the parse tree
	 */
	enterSubExpression?: (ctx: SubExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.subExpression`.
	 * @param ctx the parse tree
	 */
	exitSubExpression?: (ctx: SubExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.union`.
	 * @param ctx the parse tree
	 */
	enterUnion?: (ctx: UnionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.union`.
	 * @param ctx the parse tree
	 */
	exitUnion?: (ctx: UnionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.complement`.
	 * @param ctx the parse tree
	 */
	enterComplement?: (ctx: ComplementContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.complement`.
	 * @param ctx the parse tree
	 */
	exitComplement?: (ctx: ComplementContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.iri`.
	 * @param ctx the parse tree
	 */
	enterIri?: (ctx: IriContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.iri`.
	 * @param ctx the parse tree
	 */
	exitIri?: (ctx: IriContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.literal`.
	 * @param ctx the parse tree
	 */
	enterLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.literal`.
	 * @param ctx the parse tree
	 */
	exitLiteral?: (ctx: LiteralContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.propertyRestriction`.
	 * @param ctx the parse tree
	 */
	enterPropertyRestriction?: (ctx: PropertyRestrictionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.propertyRestriction`.
	 * @param ctx the parse tree
	 */
	exitPropertyRestriction?: (ctx: PropertyRestrictionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.some`.
	 * @param ctx the parse tree
	 */
	enterSome?: (ctx: SomeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.some`.
	 * @param ctx the parse tree
	 */
	exitSome?: (ctx: SomeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.only`.
	 * @param ctx the parse tree
	 */
	enterOnly?: (ctx: OnlyContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.only`.
	 * @param ctx the parse tree
	 */
	exitOnly?: (ctx: OnlyContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.propertyIri`.
	 * @param ctx the parse tree
	 */
	enterPropertyIri?: (ctx: PropertyIriContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.propertyIri`.
	 * @param ctx the parse tree
	 */
	exitPropertyIri?: (ctx: PropertyIriContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.exactCardinality`.
	 * @param ctx the parse tree
	 */
	enterExactCardinality?: (ctx: ExactCardinalityContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.exactCardinality`.
	 * @param ctx the parse tree
	 */
	exitExactCardinality?: (ctx: ExactCardinalityContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.rangeCardinality`.
	 * @param ctx the parse tree
	 */
	enterRangeCardinality?: (ctx: RangeCardinalityContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.rangeCardinality`.
	 * @param ctx the parse tree
	 */
	exitRangeCardinality?: (ctx: RangeCardinalityContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.minCardinality`.
	 * @param ctx the parse tree
	 */
	enterMinCardinality?: (ctx: MinCardinalityContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.minCardinality`.
	 * @param ctx the parse tree
	 */
	exitMinCardinality?: (ctx: MinCardinalityContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.maxCardinality`.
	 * @param ctx the parse tree
	 */
	enterMaxCardinality?: (ctx: MaxCardinalityContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.maxCardinality`.
	 * @param ctx the parse tree
	 */
	exitMaxCardinality?: (ctx: MaxCardinalityContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.classOrDataType`.
	 * @param ctx the parse tree
	 */
	enterClassOrDataType?: (ctx: ClassOrDataTypeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.classOrDataType`.
	 * @param ctx the parse tree
	 */
	exitClassOrDataType?: (ctx: ClassOrDataTypeContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.name`.
	 * @param ctx the parse tree
	 */
	enterName?: (ctx: NameContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.name`.
	 * @param ctx the parse tree
	 */
	exitName?: (ctx: NameContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.description`.
	 * @param ctx the parse tree
	 */
	enterDescription?: (ctx: DescriptionContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.description`.
	 * @param ctx the parse tree
	 */
	exitDescription?: (ctx: DescriptionContext) => void;

	/**
	 * Enter a parse tree produced by `DiscoverySyntaxParser.code`.
	 * @param ctx the parse tree
	 */
	enterCode?: (ctx: CodeContext) => void;
	/**
	 * Exit a parse tree produced by `DiscoverySyntaxParser.code`.
	 * @param ctx the parse tree
	 */
	exitCode?: (ctx: CodeContext) => void;
}

