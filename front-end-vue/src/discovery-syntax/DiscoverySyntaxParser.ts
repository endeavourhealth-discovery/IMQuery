// Generated from ./src/discovery-syntax/DiscoverySyntax.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { DiscoverySyntaxListener } from "./DiscoverySyntaxListener";

export class DiscoverySyntaxParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly WS = 9;
	public static readonly EQ = 10;
	public static readonly MEMBERS = 11;
	public static readonly NOTMEMBERS = 12;
	public static readonly STATUS = 13;
	public static readonly VERSION = 14;
	public static readonly PROPERTIES = 15;
	public static readonly TYPE = 16;
	public static readonly MIN = 17;
	public static readonly MAX = 18;
	public static readonly SOME = 19;
	public static readonly ONLY = 20;
	public static readonly MININCLUSIVE = 21;
	public static readonly MAXINCLUSIVE = 22;
	public static readonly MINEXCLUSIVE = 23;
	public static readonly MAXEXCLUSIVE = 24;
	public static readonly SUBCLASS = 25;
	public static readonly EQUIVALENTTO = 26;
	public static readonly DISJOINT = 27;
	public static readonly SUBPROPERTY = 28;
	public static readonly INVERSE = 29;
	public static readonly DOMAIN = 30;
	public static readonly RANGE = 31;
	public static readonly TARGETCLASS = 32;
	public static readonly EXACTLY = 33;
	public static readonly AND = 34;
	public static readonly INTEGER = 35;
	public static readonly DOUBLE = 36;
	public static readonly DIGIT = 37;
	public static readonly OR = 38;
	public static readonly NOT = 39;
	public static readonly NAME = 40;
	public static readonly DESCRIPTION = 41;
	public static readonly CODE = 42;
	public static readonly SCHEME = 43;
	public static readonly PNAME_NS = 44;
	public static readonly PN_PREFIX = 45;
	public static readonly PN_CHARS_BASE = 46;
	public static readonly PN_CHARS_U = 47;
	public static readonly PN_CHARS = 48;
	public static readonly IRIREF = 49;
	public static readonly UCHAR = 50;
	public static readonly PNAME_LN = 51;
	public static readonly PN_LOCAL = 52;
	public static readonly PLX = 53;
	public static readonly PERCENT = 54;
	public static readonly ECHAR = 55;
	public static readonly QUOTED_STRING = 56;
	public static readonly STRING_LITERAL_QUOTE = 57;
	public static readonly STRING_LITERAL_SINGLE_QUOTE = 58;
	public static readonly PIPED_STRING = 59;
	public static readonly PN_LOCAL_ESC = 60;
	public static readonly HEX = 61;
	public static readonly RULE_concept = 0;
	public static readonly RULE_directive = 1;
	public static readonly RULE_prefixID = 2;
	public static readonly RULE_conceptPredicateObjectList = 3;
	public static readonly RULE_annotation = 4;
	public static readonly RULE_predicateIri = 5;
	public static readonly RULE_scheme = 6;
	public static readonly RULE_type = 7;
	public static readonly RULE_version = 8;
	public static readonly RULE_axiom = 9;
	public static readonly RULE_properties = 10;
	public static readonly RULE_membership = 11;
	public static readonly RULE_members = 12;
	public static readonly RULE_notmembers = 13;
	public static readonly RULE_target = 14;
	public static readonly RULE_predicateList = 15;
	public static readonly RULE_minInclusive = 16;
	public static readonly RULE_maxInclusive = 17;
	public static readonly RULE_minExclusive = 18;
	public static readonly RULE_maxExclusive = 19;
	public static readonly RULE_status = 20;
	public static readonly RULE_subclassOf = 21;
	public static readonly RULE_equivalentTo = 22;
	public static readonly RULE_subpropertyOf = 23;
	public static readonly RULE_inverseOf = 24;
	public static readonly RULE_domain = 25;
	public static readonly RULE_range = 26;
	public static readonly RULE_classExpression = 27;
	public static readonly RULE_intersection = 28;
	public static readonly RULE_subExpression = 29;
	public static readonly RULE_union = 30;
	public static readonly RULE_complement = 31;
	public static readonly RULE_iri = 32;
	public static readonly RULE_literal = 33;
	public static readonly RULE_propertyRestriction = 34;
	public static readonly RULE_some = 35;
	public static readonly RULE_only = 36;
	public static readonly RULE_propertyIri = 37;
	public static readonly RULE_exactCardinality = 38;
	public static readonly RULE_rangeCardinality = 39;
	public static readonly RULE_minCardinality = 40;
	public static readonly RULE_maxCardinality = 41;
	public static readonly RULE_classOrDataType = 42;
	public static readonly RULE_name = 43;
	public static readonly RULE_description = 44;
	public static readonly RULE_code = 45;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"concept", "directive", "prefixID", "conceptPredicateObjectList", "annotation", 
		"predicateIri", "scheme", "type", "version", "axiom", "properties", "membership", 
		"members", "notmembers", "target", "predicateList", "minInclusive", "maxInclusive", 
		"minExclusive", "maxExclusive", "status", "subclassOf", "equivalentTo", 
		"subpropertyOf", "inverseOf", "domain", "range", "classExpression", "intersection", 
		"subExpression", "union", "complement", "iri", "literal", "propertyRestriction", 
		"some", "only", "propertyIri", "exactCardinality", "rangeCardinality", 
		"minCardinality", "maxCardinality", "classOrDataType", "name", "description", 
		"code",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'.'", "'@prefix'", "';'", "'['", "']'", "','", "'('", "')'", 
		undefined, "'='",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, "WS", "EQ", "MEMBERS", "NOTMEMBERS", "STATUS", "VERSION", 
		"PROPERTIES", "TYPE", "MIN", "MAX", "SOME", "ONLY", "MININCLUSIVE", "MAXINCLUSIVE", 
		"MINEXCLUSIVE", "MAXEXCLUSIVE", "SUBCLASS", "EQUIVALENTTO", "DISJOINT", 
		"SUBPROPERTY", "INVERSE", "DOMAIN", "RANGE", "TARGETCLASS", "EXACTLY", 
		"AND", "INTEGER", "DOUBLE", "DIGIT", "OR", "NOT", "NAME", "DESCRIPTION", 
		"CODE", "SCHEME", "PNAME_NS", "PN_PREFIX", "PN_CHARS_BASE", "PN_CHARS_U", 
		"PN_CHARS", "IRIREF", "UCHAR", "PNAME_LN", "PN_LOCAL", "PLX", "PERCENT", 
		"ECHAR", "QUOTED_STRING", "STRING_LITERAL_QUOTE", "STRING_LITERAL_SINGLE_QUOTE", 
		"PIPED_STRING", "PN_LOCAL_ESC", "HEX",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(DiscoverySyntaxParser._LITERAL_NAMES, DiscoverySyntaxParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return DiscoverySyntaxParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "DiscoverySyntax.g4"; }

	// @Override
	public get ruleNames(): string[] { return DiscoverySyntaxParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return DiscoverySyntaxParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(DiscoverySyntaxParser._ATN, this);
	}
	// @RuleVersion(0)
	public concept(): ConceptContext {
		let _localctx: ConceptContext = new ConceptContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, DiscoverySyntaxParser.RULE_concept);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 95;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 92;
					this.directive();
					}
					}
				}
				this.state = 97;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
			}
			this.state = 98;
			this.iri();
			this.state = 99;
			this.conceptPredicateObjectList();
			this.state = 100;
			this.match(DiscoverySyntaxParser.T__0);
			this.state = 101;
			this.match(DiscoverySyntaxParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public directive(): DirectiveContext {
		let _localctx: DirectiveContext = new DirectiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, DiscoverySyntaxParser.RULE_directive);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 103;
			this.prefixID();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public prefixID(): PrefixIDContext {
		let _localctx: PrefixIDContext = new PrefixIDContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, DiscoverySyntaxParser.RULE_prefixID);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 105;
			this.match(DiscoverySyntaxParser.T__1);
			this.state = 106;
			this.match(DiscoverySyntaxParser.PNAME_NS);
			this.state = 107;
			this.match(DiscoverySyntaxParser.IRIREF);
			this.state = 108;
			this.match(DiscoverySyntaxParser.T__0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public conceptPredicateObjectList(): ConceptPredicateObjectListContext {
		let _localctx: ConceptPredicateObjectListContext = new ConceptPredicateObjectListContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, DiscoverySyntaxParser.RULE_conceptPredicateObjectList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 116;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
			case 1:
				{
				this.state = 110;
				this.annotation();
				}
				break;

			case 2:
				{
				this.state = 111;
				this.predicateIri();
				}
				break;

			case 3:
				{
				this.state = 112;
				this.axiom();
				}
				break;

			case 4:
				{
				this.state = 113;
				this.properties();
				}
				break;

			case 5:
				{
				this.state = 114;
				this.membership();
				}
				break;

			case 6:
				{
				this.state = 115;
				this.predicateList();
				}
				break;
			}
			this.state = 129;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === DiscoverySyntaxParser.T__2) {
				{
				{
				this.state = 118;
				this.match(DiscoverySyntaxParser.T__2);
				this.state = 125;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
				case 1:
					{
					this.state = 119;
					this.annotation();
					}
					break;

				case 2:
					{
					this.state = 120;
					this.predicateIri();
					}
					break;

				case 3:
					{
					this.state = 121;
					this.axiom();
					}
					break;

				case 4:
					{
					this.state = 122;
					this.properties();
					}
					break;

				case 5:
					{
					this.state = 123;
					this.membership();
					}
					break;

				case 6:
					{
					this.state = 124;
					this.predicateList();
					}
					break;
				}
				}
				}
				this.state = 131;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public annotation(): AnnotationContext {
		let _localctx: AnnotationContext = new AnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, DiscoverySyntaxParser.RULE_annotation);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 137;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.NAME:
				{
				this.state = 132;
				this.name();
				}
				break;
			case DiscoverySyntaxParser.DESCRIPTION:
				{
				this.state = 133;
				this.description();
				}
				break;
			case DiscoverySyntaxParser.CODE:
				{
				this.state = 134;
				this.code();
				}
				break;
			case DiscoverySyntaxParser.VERSION:
				{
				this.state = 135;
				this.version();
				}
				break;
			case DiscoverySyntaxParser.IRIREF:
			case DiscoverySyntaxParser.PNAME_LN:
				{
				this.state = 136;
				this.propertyIri();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 139;
			this.match(DiscoverySyntaxParser.QUOTED_STRING);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public predicateIri(): PredicateIriContext {
		let _localctx: PredicateIriContext = new PredicateIriContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, DiscoverySyntaxParser.RULE_predicateIri);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 145;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.SCHEME:
				{
				this.state = 141;
				this.scheme();
				}
				break;
			case DiscoverySyntaxParser.TYPE:
				{
				this.state = 142;
				this.type();
				}
				break;
			case DiscoverySyntaxParser.STATUS:
				{
				this.state = 143;
				this.status();
				}
				break;
			case DiscoverySyntaxParser.TARGETCLASS:
				{
				this.state = 144;
				this.target();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 147;
			this.iri();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public scheme(): SchemeContext {
		let _localctx: SchemeContext = new SchemeContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, DiscoverySyntaxParser.RULE_scheme);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 149;
			this.match(DiscoverySyntaxParser.SCHEME);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public type(): TypeContext {
		let _localctx: TypeContext = new TypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, DiscoverySyntaxParser.RULE_type);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 151;
			this.match(DiscoverySyntaxParser.TYPE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public version(): VersionContext {
		let _localctx: VersionContext = new VersionContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, DiscoverySyntaxParser.RULE_version);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 153;
			this.match(DiscoverySyntaxParser.VERSION);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public axiom(): AxiomContext {
		let _localctx: AxiomContext = new AxiomContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, DiscoverySyntaxParser.RULE_axiom);
		try {
			this.state = 161;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.SUBCLASS:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 155;
				this.subclassOf();
				}
				break;
			case DiscoverySyntaxParser.EQUIVALENTTO:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 156;
				this.equivalentTo();
				}
				break;
			case DiscoverySyntaxParser.SUBPROPERTY:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 157;
				this.subpropertyOf();
				}
				break;
			case DiscoverySyntaxParser.INVERSE:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 158;
				this.inverseOf();
				}
				break;
			case DiscoverySyntaxParser.DOMAIN:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 159;
				this.domain();
				}
				break;
			case DiscoverySyntaxParser.RANGE:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 160;
				this.range();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public properties(): PropertiesContext {
		let _localctx: PropertiesContext = new PropertiesContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, DiscoverySyntaxParser.RULE_properties);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 163;
			this.match(DiscoverySyntaxParser.PROPERTIES);
			this.state = 164;
			this.match(DiscoverySyntaxParser.T__3);
			this.state = 166;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === DiscoverySyntaxParser.IRIREF || _la === DiscoverySyntaxParser.PNAME_LN) {
				{
				this.state = 165;
				this.propertyRestriction();
				}
			}

			this.state = 172;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 168;
					this.match(DiscoverySyntaxParser.T__2);
					this.state = 169;
					this.propertyRestriction();
					}
					}
				}
				this.state = 174;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
			}
			this.state = 175;
			this.match(DiscoverySyntaxParser.T__4);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public membership(): MembershipContext {
		let _localctx: MembershipContext = new MembershipContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, DiscoverySyntaxParser.RULE_membership);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 177;
			this.members();
			this.state = 182;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 178;
					this.match(DiscoverySyntaxParser.T__2);
					this.state = 179;
					this.notmembers();
					}
					}
				}
				this.state = 184;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public members(): MembersContext {
		let _localctx: MembersContext = new MembersContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, DiscoverySyntaxParser.RULE_members);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 185;
			this.match(DiscoverySyntaxParser.MEMBERS);
			this.state = 186;
			this.match(DiscoverySyntaxParser.T__3);
			this.state = 188;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === DiscoverySyntaxParser.IRIREF || _la === DiscoverySyntaxParser.PNAME_LN) {
				{
				this.state = 187;
				this.classExpression();
				}
			}

			this.state = 194;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 11, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 190;
					this.match(DiscoverySyntaxParser.T__5);
					this.state = 191;
					this.classExpression();
					}
					}
				}
				this.state = 196;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 11, this._ctx);
			}
			this.state = 197;
			this.match(DiscoverySyntaxParser.T__4);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public notmembers(): NotmembersContext {
		let _localctx: NotmembersContext = new NotmembersContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, DiscoverySyntaxParser.RULE_notmembers);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 199;
			this.match(DiscoverySyntaxParser.NOTMEMBERS);
			this.state = 200;
			this.match(DiscoverySyntaxParser.T__3);
			this.state = 201;
			this.iri();
			this.state = 206;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 202;
					this.match(DiscoverySyntaxParser.T__5);
					this.state = 203;
					this.iri();
					}
					}
				}
				this.state = 208;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
			}
			this.state = 209;
			this.match(DiscoverySyntaxParser.T__4);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public target(): TargetContext {
		let _localctx: TargetContext = new TargetContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, DiscoverySyntaxParser.RULE_target);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 211;
			this.match(DiscoverySyntaxParser.TARGETCLASS);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public predicateList(): PredicateListContext {
		let _localctx: PredicateListContext = new PredicateListContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, DiscoverySyntaxParser.RULE_predicateList);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 213;
			this.propertyIri();
			this.state = 214;
			this.match(DiscoverySyntaxParser.T__3);
			this.state = 215;
			this.propertyRestriction();
			this.state = 220;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 13, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 216;
					this.match(DiscoverySyntaxParser.T__2);
					this.state = 217;
					this.propertyRestriction();
					}
					}
				}
				this.state = 222;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 13, this._ctx);
			}
			this.state = 223;
			this.match(DiscoverySyntaxParser.T__4);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public minInclusive(): MinInclusiveContext {
		let _localctx: MinInclusiveContext = new MinInclusiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, DiscoverySyntaxParser.RULE_minInclusive);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 225;
			this.match(DiscoverySyntaxParser.MININCLUSIVE);
			this.state = 226;
			this.match(DiscoverySyntaxParser.DOUBLE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public maxInclusive(): MaxInclusiveContext {
		let _localctx: MaxInclusiveContext = new MaxInclusiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, DiscoverySyntaxParser.RULE_maxInclusive);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 228;
			this.match(DiscoverySyntaxParser.MAXINCLUSIVE);
			this.state = 229;
			this.match(DiscoverySyntaxParser.DOUBLE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public minExclusive(): MinExclusiveContext {
		let _localctx: MinExclusiveContext = new MinExclusiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, DiscoverySyntaxParser.RULE_minExclusive);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 231;
			this.match(DiscoverySyntaxParser.MINEXCLUSIVE);
			this.state = 232;
			this.match(DiscoverySyntaxParser.DOUBLE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public maxExclusive(): MaxExclusiveContext {
		let _localctx: MaxExclusiveContext = new MaxExclusiveContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, DiscoverySyntaxParser.RULE_maxExclusive);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 234;
			this.match(DiscoverySyntaxParser.MAXEXCLUSIVE);
			this.state = 235;
			this.match(DiscoverySyntaxParser.DOUBLE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public status(): StatusContext {
		let _localctx: StatusContext = new StatusContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, DiscoverySyntaxParser.RULE_status);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 237;
			this.match(DiscoverySyntaxParser.STATUS);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public subclassOf(): SubclassOfContext {
		let _localctx: SubclassOfContext = new SubclassOfContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, DiscoverySyntaxParser.RULE_subclassOf);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 239;
			this.match(DiscoverySyntaxParser.SUBCLASS);
			this.state = 240;
			this.classExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public equivalentTo(): EquivalentToContext {
		let _localctx: EquivalentToContext = new EquivalentToContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, DiscoverySyntaxParser.RULE_equivalentTo);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 242;
			this.match(DiscoverySyntaxParser.EQUIVALENTTO);
			this.state = 243;
			this.classExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public subpropertyOf(): SubpropertyOfContext {
		let _localctx: SubpropertyOfContext = new SubpropertyOfContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, DiscoverySyntaxParser.RULE_subpropertyOf);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 245;
			this.match(DiscoverySyntaxParser.SUBPROPERTY);
			this.state = 246;
			this.iri();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public inverseOf(): InverseOfContext {
		let _localctx: InverseOfContext = new InverseOfContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, DiscoverySyntaxParser.RULE_inverseOf);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 248;
			this.match(DiscoverySyntaxParser.INVERSE);
			this.state = 249;
			this.iri();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public domain(): DomainContext {
		let _localctx: DomainContext = new DomainContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, DiscoverySyntaxParser.RULE_domain);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 251;
			this.match(DiscoverySyntaxParser.DOMAIN);
			this.state = 252;
			this.classExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public range(): RangeContext {
		let _localctx: RangeContext = new RangeContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, DiscoverySyntaxParser.RULE_range);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 254;
			this.match(DiscoverySyntaxParser.RANGE);
			this.state = 255;
			this.classExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classExpression(): ClassExpressionContext {
		let _localctx: ClassExpressionContext = new ClassExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, DiscoverySyntaxParser.RULE_classExpression);
		try {
			this.state = 260;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 14, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 257;
				this.iri();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				{
				this.state = 258;
				this.intersection();
				}
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				{
				this.state = 259;
				this.union();
				}
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public intersection(): IntersectionContext {
		let _localctx: IntersectionContext = new IntersectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, DiscoverySyntaxParser.RULE_intersection);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 262;
			this.iri();
			this.state = 271;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 263;
					this.match(DiscoverySyntaxParser.AND);
					this.state = 269;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
					case 1:
						{
						this.state = 264;
						this.iri();
						}
						break;

					case 2:
						{
						this.state = 265;
						this.propertyRestriction();
						}
						break;

					case 3:
						{
						this.state = 266;
						this.union();
						}
						break;

					case 4:
						{
						this.state = 267;
						this.complement();
						}
						break;

					case 5:
						{
						this.state = 268;
						this.subExpression();
						}
						break;
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 273;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 16, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public subExpression(): SubExpressionContext {
		let _localctx: SubExpressionContext = new SubExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, DiscoverySyntaxParser.RULE_subExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 275;
			this.match(DiscoverySyntaxParser.T__6);
			this.state = 280;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 17, this._ctx) ) {
			case 1:
				{
				this.state = 276;
				this.union();
				}
				break;

			case 2:
				{
				this.state = 277;
				this.intersection();
				}
				break;

			case 3:
				{
				this.state = 278;
				this.complement();
				}
				break;

			case 4:
				{
				this.state = 279;
				this.propertyRestriction();
				}
				break;
			}
			this.state = 282;
			this.match(DiscoverySyntaxParser.T__7);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public union(): UnionContext {
		let _localctx: UnionContext = new UnionContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, DiscoverySyntaxParser.RULE_union);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 284;
			this.iri();
			this.state = 290;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 285;
				this.match(DiscoverySyntaxParser.OR);
				this.state = 288;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 18, this._ctx) ) {
				case 1:
					{
					this.state = 286;
					this.iri();
					}
					break;

				case 2:
					{
					this.state = 287;
					this.propertyRestriction();
					}
					break;
				}
				}
				}
				this.state = 292;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === DiscoverySyntaxParser.OR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public complement(): ComplementContext {
		let _localctx: ComplementContext = new ComplementContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, DiscoverySyntaxParser.RULE_complement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 294;
			this.match(DiscoverySyntaxParser.NOT);
			this.state = 298;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 20, this._ctx) ) {
			case 1:
				{
				this.state = 295;
				this.iri();
				}
				break;

			case 2:
				{
				this.state = 296;
				this.intersection();
				}
				break;

			case 3:
				{
				this.state = 297;
				this.union();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public iri(): IriContext {
		let _localctx: IriContext = new IriContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, DiscoverySyntaxParser.RULE_iri);
		let _la: number;
		try {
			this.state = 305;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case DiscoverySyntaxParser.IRIREF:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 300;
				this.match(DiscoverySyntaxParser.IRIREF);
				}
				break;
			case DiscoverySyntaxParser.PNAME_LN:
				this.enterOuterAlt(_localctx, 2);
				{
				{
				this.state = 301;
				this.match(DiscoverySyntaxParser.PNAME_LN);
				this.state = 303;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === DiscoverySyntaxParser.PIPED_STRING) {
					{
					this.state = 302;
					this.match(DiscoverySyntaxParser.PIPED_STRING);
					}
				}

				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public literal(): LiteralContext {
		let _localctx: LiteralContext = new LiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, DiscoverySyntaxParser.RULE_literal);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 307;
			this.match(DiscoverySyntaxParser.QUOTED_STRING);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public propertyRestriction(): PropertyRestrictionContext {
		let _localctx: PropertyRestrictionContext = new PropertyRestrictionContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, DiscoverySyntaxParser.RULE_propertyRestriction);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 309;
			this.propertyIri();
			this.state = 316;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 23, this._ctx) ) {
			case 1:
				{
				this.state = 310;
				this.exactCardinality();
				}
				break;

			case 2:
				{
				this.state = 311;
				this.rangeCardinality();
				}
				break;

			case 3:
				{
				this.state = 312;
				this.minCardinality();
				}
				break;

			case 4:
				{
				this.state = 313;
				this.maxCardinality();
				}
				break;

			case 5:
				{
				this.state = 314;
				this.some();
				}
				break;

			case 6:
				{
				this.state = 315;
				this.only();
				}
				break;
			}
			this.state = 318;
			this.classOrDataType();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public some(): SomeContext {
		let _localctx: SomeContext = new SomeContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, DiscoverySyntaxParser.RULE_some);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 320;
			this.match(DiscoverySyntaxParser.SOME);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public only(): OnlyContext {
		let _localctx: OnlyContext = new OnlyContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, DiscoverySyntaxParser.RULE_only);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 322;
			this.match(DiscoverySyntaxParser.ONLY);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public propertyIri(): PropertyIriContext {
		let _localctx: PropertyIriContext = new PropertyIriContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, DiscoverySyntaxParser.RULE_propertyIri);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 324;
			this.iri();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public exactCardinality(): ExactCardinalityContext {
		let _localctx: ExactCardinalityContext = new ExactCardinalityContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, DiscoverySyntaxParser.RULE_exactCardinality);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 326;
			this.match(DiscoverySyntaxParser.EXACTLY);
			this.state = 327;
			this.match(DiscoverySyntaxParser.INTEGER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public rangeCardinality(): RangeCardinalityContext {
		let _localctx: RangeCardinalityContext = new RangeCardinalityContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, DiscoverySyntaxParser.RULE_rangeCardinality);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 329;
			this.minCardinality();
			this.state = 330;
			this.maxCardinality();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public minCardinality(): MinCardinalityContext {
		let _localctx: MinCardinalityContext = new MinCardinalityContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, DiscoverySyntaxParser.RULE_minCardinality);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 332;
			this.match(DiscoverySyntaxParser.MIN);
			this.state = 333;
			this.match(DiscoverySyntaxParser.INTEGER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public maxCardinality(): MaxCardinalityContext {
		let _localctx: MaxCardinalityContext = new MaxCardinalityContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, DiscoverySyntaxParser.RULE_maxCardinality);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 335;
			this.match(DiscoverySyntaxParser.MAX);
			this.state = 336;
			this.match(DiscoverySyntaxParser.INTEGER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public classOrDataType(): ClassOrDataTypeContext {
		let _localctx: ClassOrDataTypeContext = new ClassOrDataTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, DiscoverySyntaxParser.RULE_classOrDataType);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 338;
			this.iri();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public name(): NameContext {
		let _localctx: NameContext = new NameContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, DiscoverySyntaxParser.RULE_name);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 340;
			this.match(DiscoverySyntaxParser.NAME);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public description(): DescriptionContext {
		let _localctx: DescriptionContext = new DescriptionContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, DiscoverySyntaxParser.RULE_description);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 342;
			this.match(DiscoverySyntaxParser.DESCRIPTION);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public code(): CodeContext {
		let _localctx: CodeContext = new CodeContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, DiscoverySyntaxParser.RULE_code);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 344;
			this.match(DiscoverySyntaxParser.CODE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03?\u015D\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t+" +
		"\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x03\x02\x07\x02`\n\x02\f\x02\x0E\x02" +
		"c\v\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05" +
		"\x03\x05\x05\x05w\n\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05" +
		"\x03\x05\x05\x05\x80\n\x05\x07\x05\x82\n\x05\f\x05\x0E\x05\x85\v\x05\x03" +
		"\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06\x8C\n\x06\x03\x06\x03\x06" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x05\x07\x94\n\x07\x03\x07\x03\x07\x03" +
		"\b\x03\b\x03\t\x03\t\x03\n\x03\n\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x05" +
		"\v\xA4\n\v\x03\f\x03\f\x03\f\x05\f\xA9\n\f\x03\f\x03\f\x07\f\xAD\n\f\f" +
		"\f\x0E\f\xB0\v\f\x03\f\x03\f\x03\r\x03\r\x03\r\x07\r\xB7\n\r\f\r\x0E\r" +
		"\xBA\v\r\x03\x0E\x03\x0E\x03\x0E\x05\x0E\xBF\n\x0E\x03\x0E\x03\x0E\x07" +
		"\x0E\xC3\n\x0E\f\x0E\x0E\x0E\xC6\v\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F" +
		"\x03\x0F\x03\x0F\x03\x0F\x07\x0F\xCF\n\x0F\f\x0F\x0E\x0F\xD2\v\x0F\x03" +
		"\x0F\x03\x0F\x03\x10\x03\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x07" +
		"\x11\xDD\n\x11\f\x11\x0E\x11\xE0\v\x11\x03\x11\x03\x11\x03\x12\x03\x12" +
		"\x03\x12\x03\x13\x03\x13\x03\x13\x03\x14\x03\x14\x03\x14\x03\x15\x03\x15" +
		"\x03\x15\x03\x16\x03\x16\x03\x17\x03\x17\x03\x17\x03\x18\x03\x18\x03\x18" +
		"\x03\x19\x03\x19\x03\x19\x03\x1A\x03\x1A\x03\x1A\x03\x1B\x03\x1B\x03\x1B" +
		"\x03\x1C\x03\x1C\x03\x1C\x03\x1D\x03\x1D\x03\x1D\x05\x1D\u0107\n\x1D\x03" +
		"\x1E\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x05\x1E\u0110\n\x1E" +
		"\x06\x1E\u0112\n\x1E\r\x1E\x0E\x1E\u0113\x03\x1F\x03\x1F\x03\x1F\x03\x1F" +
		"\x03\x1F\x05\x1F\u011B\n\x1F\x03\x1F\x03\x1F\x03 \x03 \x03 \x03 \x05 " +
		"\u0123\n \x06 \u0125\n \r \x0E \u0126\x03!\x03!\x03!\x03!\x05!\u012D\n" +
		"!\x03\"\x03\"\x03\"\x05\"\u0132\n\"\x05\"\u0134\n\"\x03#\x03#\x03$\x03" +
		"$\x03$\x03$\x03$\x03$\x03$\x05$\u013F\n$\x03$\x03$\x03%\x03%\x03&\x03" +
		"&\x03\'\x03\'\x03(\x03(\x03(\x03)\x03)\x03)\x03*\x03*\x03*\x03+\x03+\x03" +
		"+\x03,\x03,\x03-\x03-\x03.\x03.\x03/\x03/\x03/\ba\xAE\xB8\xC4\xD0\xDE" +
		"\x02\x020\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12" +
		"\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&" +
		"\x02(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02:\x02<\x02>\x02@\x02" +
		"B\x02D\x02F\x02H\x02J\x02L\x02N\x02P\x02R\x02T\x02V\x02X\x02Z\x02\\\x02" +
		"\x02\x02\x02\u0164\x02a\x03\x02\x02\x02\x04i\x03\x02\x02\x02\x06k\x03" +
		"\x02\x02\x02\bv\x03\x02\x02\x02\n\x8B\x03\x02\x02\x02\f\x93\x03\x02\x02" +
		"\x02\x0E\x97\x03\x02\x02\x02\x10\x99\x03\x02\x02\x02\x12\x9B\x03\x02\x02" +
		"\x02\x14\xA3\x03\x02\x02\x02\x16\xA5\x03\x02\x02\x02\x18\xB3\x03\x02\x02" +
		"\x02\x1A\xBB\x03\x02\x02\x02\x1C\xC9\x03\x02\x02\x02\x1E\xD5\x03\x02\x02" +
		"\x02 \xD7\x03\x02\x02\x02\"\xE3\x03\x02\x02\x02$\xE6\x03\x02\x02\x02&" +
		"\xE9\x03\x02\x02\x02(\xEC\x03\x02\x02\x02*\xEF\x03\x02\x02\x02,\xF1\x03" +
		"\x02\x02\x02.\xF4\x03\x02\x02\x020\xF7\x03\x02\x02\x022\xFA\x03\x02\x02" +
		"\x024\xFD\x03\x02\x02\x026\u0100\x03\x02\x02\x028\u0106\x03\x02\x02\x02" +
		":\u0108\x03\x02\x02\x02<\u0115\x03\x02\x02\x02>\u011E\x03\x02\x02\x02" +
		"@\u0128\x03\x02\x02\x02B\u0133\x03\x02\x02\x02D\u0135\x03\x02\x02\x02" +
		"F\u0137\x03\x02\x02\x02H\u0142\x03\x02\x02\x02J\u0144\x03\x02\x02\x02" +
		"L\u0146\x03\x02\x02\x02N\u0148\x03\x02\x02\x02P\u014B\x03\x02\x02\x02" +
		"R\u014E\x03\x02\x02\x02T\u0151\x03\x02\x02\x02V\u0154\x03\x02\x02\x02" +
		"X\u0156\x03\x02\x02\x02Z\u0158\x03\x02\x02\x02\\\u015A\x03\x02\x02\x02" +
		"^`\x05\x04\x03\x02_^\x03\x02\x02\x02`c\x03\x02\x02\x02ab\x03\x02\x02\x02" +
		"a_\x03\x02\x02\x02bd\x03\x02\x02\x02ca\x03\x02\x02\x02de\x05B\"\x02ef" +
		"\x05\b\x05\x02fg\x07\x03\x02\x02gh\x07\x02\x02\x03h\x03\x03\x02\x02\x02" +
		"ij\x05\x06\x04\x02j\x05\x03\x02\x02\x02kl\x07\x04\x02\x02lm\x07.\x02\x02" +
		"mn\x073\x02\x02no\x07\x03\x02\x02o\x07\x03\x02\x02\x02pw\x05\n\x06\x02" +
		"qw\x05\f\x07\x02rw\x05\x14\v\x02sw\x05\x16\f\x02tw\x05\x18\r\x02uw\x05" +
		" \x11\x02vp\x03\x02\x02\x02vq\x03\x02\x02\x02vr\x03\x02\x02\x02vs\x03" +
		"\x02\x02\x02vt\x03\x02\x02\x02vu\x03\x02\x02\x02w\x83\x03\x02\x02\x02" +
		"x\x7F\x07\x05\x02\x02y\x80\x05\n\x06\x02z\x80\x05\f\x07\x02{\x80\x05\x14" +
		"\v\x02|\x80\x05\x16\f\x02}\x80\x05\x18\r\x02~\x80\x05 \x11\x02\x7Fy\x03" +
		"\x02\x02\x02\x7Fz\x03\x02\x02\x02\x7F{\x03\x02\x02\x02\x7F|\x03\x02\x02" +
		"\x02\x7F}\x03\x02\x02\x02\x7F~\x03\x02\x02\x02\x7F\x80\x03\x02\x02\x02" +
		"\x80\x82\x03\x02\x02\x02\x81x\x03\x02\x02\x02\x82\x85\x03\x02\x02\x02" +
		"\x83\x81\x03\x02\x02\x02\x83\x84\x03\x02\x02\x02\x84\t\x03\x02\x02\x02" +
		"\x85\x83\x03\x02\x02\x02\x86\x8C\x05X-\x02\x87\x8C\x05Z.\x02\x88\x8C\x05" +
		"\\/\x02\x89\x8C\x05\x12\n\x02\x8A\x8C\x05L\'\x02\x8B\x86\x03\x02\x02\x02" +
		"\x8B\x87\x03\x02\x02\x02\x8B\x88\x03\x02\x02\x02\x8B\x89\x03\x02\x02\x02" +
		"\x8B\x8A\x03\x02\x02\x02\x8C\x8D\x03\x02\x02\x02\x8D\x8E\x07:\x02\x02" +
		"\x8E\v\x03\x02\x02\x02\x8F\x94\x05\x0E\b\x02\x90\x94\x05\x10\t\x02\x91" +
		"\x94\x05*\x16\x02\x92\x94\x05\x1E\x10\x02\x93\x8F\x03\x02\x02\x02\x93" +
		"\x90\x03\x02\x02\x02\x93\x91\x03\x02\x02\x02\x93\x92\x03\x02\x02\x02\x94" +
		"\x95\x03\x02\x02\x02\x95\x96\x05B\"\x02\x96\r\x03\x02\x02\x02\x97\x98" +
		"\x07-\x02\x02\x98\x0F\x03\x02\x02\x02\x99\x9A\x07\x12\x02\x02\x9A\x11" +
		"\x03\x02\x02\x02\x9B\x9C\x07\x10\x02\x02\x9C\x13\x03\x02\x02\x02\x9D\xA4" +
		"\x05,\x17\x02\x9E\xA4\x05.\x18\x02\x9F\xA4\x050\x19\x02\xA0\xA4\x052\x1A" +
		"\x02\xA1\xA4\x054\x1B\x02\xA2\xA4\x056\x1C\x02\xA3\x9D\x03\x02\x02\x02" +
		"\xA3\x9E\x03\x02\x02\x02\xA3\x9F\x03\x02\x02\x02\xA3\xA0\x03\x02\x02\x02" +
		"\xA3\xA1\x03\x02\x02\x02\xA3\xA2\x03\x02\x02\x02\xA4\x15\x03\x02\x02\x02" +
		"\xA5\xA6\x07\x11\x02\x02\xA6\xA8\x07\x06\x02\x02\xA7\xA9\x05F$\x02\xA8" +
		"\xA7\x03\x02\x02\x02\xA8\xA9\x03\x02\x02\x02\xA9\xAE\x03\x02\x02\x02\xAA" +
		"\xAB\x07\x05\x02\x02\xAB\xAD\x05F$\x02\xAC\xAA\x03\x02\x02\x02\xAD\xB0" +
		"\x03\x02\x02\x02\xAE\xAF\x03\x02\x02\x02\xAE\xAC\x03\x02\x02\x02\xAF\xB1" +
		"\x03\x02\x02\x02\xB0\xAE\x03\x02\x02\x02\xB1\xB2\x07\x07\x02\x02\xB2\x17" +
		"\x03\x02\x02\x02\xB3\xB8\x05\x1A\x0E\x02\xB4\xB5\x07\x05\x02\x02\xB5\xB7" +
		"\x05\x1C\x0F\x02\xB6\xB4\x03\x02\x02\x02\xB7\xBA\x03\x02\x02\x02\xB8\xB9" +
		"\x03\x02\x02\x02\xB8\xB6\x03\x02\x02\x02\xB9\x19\x03\x02\x02\x02\xBA\xB8" +
		"\x03\x02\x02\x02\xBB\xBC\x07\r\x02\x02\xBC\xBE\x07\x06\x02\x02\xBD\xBF" +
		"\x058\x1D\x02\xBE\xBD\x03\x02\x02\x02\xBE\xBF\x03\x02\x02\x02\xBF\xC4" +
		"\x03\x02\x02\x02\xC0\xC1\x07\b\x02\x02\xC1\xC3\x058\x1D\x02\xC2\xC0\x03" +
		"\x02\x02\x02\xC3\xC6\x03\x02\x02\x02\xC4\xC5\x03\x02\x02\x02\xC4\xC2\x03" +
		"\x02\x02\x02\xC5\xC7\x03\x02\x02\x02\xC6\xC4\x03\x02\x02\x02\xC7\xC8\x07" +
		"\x07\x02\x02\xC8\x1B\x03\x02\x02\x02\xC9\xCA\x07\x0E\x02\x02\xCA\xCB\x07" +
		"\x06\x02\x02\xCB\xD0\x05B\"\x02\xCC\xCD\x07\b\x02\x02\xCD\xCF\x05B\"\x02" +
		"\xCE\xCC\x03\x02\x02\x02\xCF\xD2\x03\x02\x02\x02\xD0\xD1\x03\x02\x02\x02" +
		"\xD0\xCE\x03\x02\x02\x02\xD1\xD3\x03\x02\x02\x02\xD2\xD0\x03\x02\x02\x02" +
		"\xD3\xD4\x07\x07\x02\x02\xD4\x1D\x03\x02\x02\x02\xD5\xD6\x07\"\x02\x02" +
		"\xD6\x1F\x03\x02\x02\x02\xD7\xD8\x05L\'\x02\xD8\xD9\x07\x06\x02\x02\xD9" +
		"\xDE\x05F$\x02\xDA\xDB\x07\x05\x02\x02\xDB\xDD\x05F$\x02\xDC\xDA\x03\x02" +
		"\x02\x02\xDD\xE0\x03\x02\x02\x02\xDE\xDF\x03\x02\x02\x02\xDE\xDC\x03\x02" +
		"\x02\x02\xDF\xE1\x03\x02\x02\x02\xE0\xDE\x03\x02\x02\x02\xE1\xE2\x07\x07" +
		"\x02\x02\xE2!\x03\x02\x02\x02\xE3\xE4\x07\x17\x02\x02\xE4\xE5\x07&\x02" +
		"\x02\xE5#\x03\x02\x02\x02\xE6\xE7\x07\x18\x02\x02\xE7\xE8\x07&\x02\x02" +
		"\xE8%\x03\x02\x02\x02\xE9\xEA\x07\x19\x02\x02\xEA\xEB\x07&\x02\x02\xEB" +
		"\'\x03\x02\x02\x02\xEC\xED\x07\x1A\x02\x02\xED\xEE\x07&\x02\x02\xEE)\x03" +
		"\x02\x02\x02\xEF\xF0\x07\x0F\x02\x02\xF0+\x03\x02\x02\x02\xF1\xF2\x07" +
		"\x1B\x02\x02\xF2\xF3\x058\x1D\x02\xF3-\x03\x02\x02\x02\xF4\xF5\x07\x1C" +
		"\x02\x02\xF5\xF6\x058\x1D\x02\xF6/\x03\x02\x02\x02\xF7\xF8\x07\x1E\x02" +
		"\x02\xF8\xF9\x05B\"\x02\xF91\x03\x02\x02\x02\xFA\xFB\x07\x1F\x02\x02\xFB" +
		"\xFC\x05B\"\x02\xFC3\x03\x02\x02\x02\xFD\xFE\x07 \x02\x02\xFE\xFF\x05" +
		"8\x1D\x02\xFF5\x03\x02\x02\x02\u0100\u0101\x07!\x02\x02\u0101\u0102\x05" +
		"8\x1D\x02\u01027\x03\x02\x02\x02\u0103\u0107\x05B\"\x02\u0104\u0107\x05" +
		":\x1E\x02\u0105\u0107\x05> \x02\u0106\u0103\x03\x02\x02\x02\u0106\u0104" +
		"\x03\x02\x02\x02\u0106\u0105\x03\x02\x02\x02\u01079\x03\x02\x02\x02\u0108" +
		"\u0111\x05B\"\x02\u0109\u010F\x07$\x02\x02\u010A\u0110\x05B\"\x02\u010B" +
		"\u0110\x05F$\x02\u010C\u0110\x05> \x02\u010D\u0110\x05@!\x02\u010E\u0110" +
		"\x05<\x1F\x02\u010F\u010A\x03\x02\x02\x02\u010F\u010B\x03\x02\x02\x02" +
		"\u010F\u010C\x03\x02\x02\x02\u010F\u010D\x03\x02\x02\x02\u010F\u010E\x03" +
		"\x02\x02\x02\u0110\u0112\x03\x02\x02\x02\u0111\u0109\x03\x02\x02\x02\u0112" +
		"\u0113\x03\x02\x02\x02\u0113\u0111\x03\x02\x02\x02\u0113\u0114\x03\x02" +
		"\x02\x02\u0114;\x03\x02\x02\x02\u0115\u011A\x07\t\x02\x02\u0116\u011B" +
		"\x05> \x02\u0117\u011B\x05:\x1E\x02\u0118\u011B\x05@!\x02\u0119\u011B" +
		"\x05F$\x02\u011A\u0116\x03\x02\x02\x02\u011A\u0117\x03\x02\x02\x02\u011A" +
		"\u0118\x03\x02\x02\x02\u011A\u0119\x03\x02\x02\x02\u011B\u011C\x03\x02" +
		"\x02\x02\u011C\u011D\x07\n\x02\x02\u011D=\x03\x02\x02\x02\u011E\u0124" +
		"\x05B\"\x02\u011F\u0122\x07(\x02\x02\u0120\u0123\x05B\"\x02\u0121\u0123" +
		"\x05F$\x02\u0122\u0120\x03\x02\x02\x02\u0122\u0121\x03\x02\x02\x02\u0123" +
		"\u0125\x03\x02\x02\x02\u0124\u011F\x03\x02\x02\x02\u0125\u0126\x03\x02" +
		"\x02\x02\u0126\u0124\x03\x02\x02\x02\u0126\u0127\x03\x02\x02\x02\u0127" +
		"?\x03\x02\x02\x02\u0128\u012C\x07)\x02\x02\u0129\u012D\x05B\"\x02\u012A" +
		"\u012D\x05:\x1E\x02\u012B\u012D\x05> \x02\u012C\u0129\x03\x02\x02\x02" +
		"\u012C\u012A\x03\x02\x02\x02\u012C\u012B\x03\x02\x02\x02\u012DA\x03\x02" +
		"\x02\x02\u012E\u0134\x073\x02\x02\u012F\u0131\x075\x02\x02\u0130\u0132" +
		"\x07=\x02\x02\u0131\u0130\x03\x02\x02\x02\u0131\u0132\x03\x02\x02\x02" +
		"\u0132\u0134\x03\x02\x02\x02\u0133\u012E\x03\x02\x02\x02\u0133\u012F\x03" +
		"\x02\x02\x02\u0134C\x03\x02\x02\x02\u0135\u0136\x07:\x02\x02\u0136E\x03" +
		"\x02\x02\x02\u0137\u013E\x05L\'\x02\u0138\u013F\x05N(\x02\u0139\u013F" +
		"\x05P)\x02\u013A\u013F\x05R*\x02\u013B\u013F\x05T+\x02\u013C\u013F\x05" +
		"H%\x02\u013D\u013F\x05J&\x02\u013E\u0138\x03\x02\x02\x02\u013E\u0139\x03" +
		"\x02\x02\x02\u013E\u013A\x03\x02\x02\x02\u013E\u013B\x03\x02\x02\x02\u013E" +
		"\u013C\x03\x02\x02\x02\u013E\u013D\x03\x02\x02\x02\u013E\u013F\x03\x02" +
		"\x02\x02\u013F\u0140\x03\x02\x02\x02\u0140\u0141\x05V,\x02\u0141G\x03" +
		"\x02\x02\x02\u0142\u0143\x07\x15\x02\x02\u0143I\x03\x02\x02\x02\u0144" +
		"\u0145\x07\x16\x02\x02\u0145K\x03\x02\x02\x02\u0146\u0147\x05B\"\x02\u0147" +
		"M\x03\x02\x02\x02\u0148\u0149\x07#\x02\x02\u0149\u014A\x07%\x02\x02\u014A" +
		"O\x03\x02\x02\x02\u014B\u014C\x05R*\x02\u014C\u014D\x05T+\x02\u014DQ\x03" +
		"\x02\x02\x02\u014E\u014F\x07\x13\x02\x02\u014F\u0150\x07%\x02\x02\u0150" +
		"S\x03\x02\x02\x02\u0151\u0152\x07\x14\x02\x02\u0152\u0153\x07%\x02\x02" +
		"\u0153U\x03\x02\x02\x02\u0154\u0155\x05B\"\x02\u0155W\x03\x02\x02\x02" +
		"\u0156\u0157\x07*\x02\x02\u0157Y\x03\x02\x02\x02\u0158\u0159\x07+\x02" +
		"\x02\u0159[\x03\x02\x02\x02\u015A\u015B\x07,\x02\x02\u015B]\x03\x02\x02" +
		"\x02\x1Aav\x7F\x83\x8B\x93\xA3\xA8\xAE\xB8\xBE\xC4\xD0\xDE\u0106\u010F" +
		"\u0113\u011A\u0122\u0126\u012C\u0131\u0133\u013E";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!DiscoverySyntaxParser.__ATN) {
			DiscoverySyntaxParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(DiscoverySyntaxParser._serializedATN));
		}

		return DiscoverySyntaxParser.__ATN;
	}

}

export class ConceptContext extends ParserRuleContext {
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	public conceptPredicateObjectList(): ConceptPredicateObjectListContext {
		return this.getRuleContext(0, ConceptPredicateObjectListContext);
	}
	public EOF(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EOF, 0); }
	public directive(): DirectiveContext[];
	public directive(i: number): DirectiveContext;
	public directive(i?: number): DirectiveContext | DirectiveContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DirectiveContext);
		} else {
			return this.getRuleContext(i, DirectiveContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_concept; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterConcept) {
			listener.enterConcept(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitConcept) {
			listener.exitConcept(this);
		}
	}
}


export class DirectiveContext extends ParserRuleContext {
	public prefixID(): PrefixIDContext {
		return this.getRuleContext(0, PrefixIDContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_directive; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDirective) {
			listener.enterDirective(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDirective) {
			listener.exitDirective(this);
		}
	}
}


export class PrefixIDContext extends ParserRuleContext {
	public PNAME_NS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.PNAME_NS, 0); }
	public IRIREF(): TerminalNode { return this.getToken(DiscoverySyntaxParser.IRIREF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_prefixID; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterPrefixID) {
			listener.enterPrefixID(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitPrefixID) {
			listener.exitPrefixID(this);
		}
	}
}


export class ConceptPredicateObjectListContext extends ParserRuleContext {
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	public predicateIri(): PredicateIriContext[];
	public predicateIri(i: number): PredicateIriContext;
	public predicateIri(i?: number): PredicateIriContext | PredicateIriContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PredicateIriContext);
		} else {
			return this.getRuleContext(i, PredicateIriContext);
		}
	}
	public axiom(): AxiomContext[];
	public axiom(i: number): AxiomContext;
	public axiom(i?: number): AxiomContext | AxiomContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AxiomContext);
		} else {
			return this.getRuleContext(i, AxiomContext);
		}
	}
	public properties(): PropertiesContext[];
	public properties(i: number): PropertiesContext;
	public properties(i?: number): PropertiesContext | PropertiesContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertiesContext);
		} else {
			return this.getRuleContext(i, PropertiesContext);
		}
	}
	public membership(): MembershipContext[];
	public membership(i: number): MembershipContext;
	public membership(i?: number): MembershipContext | MembershipContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MembershipContext);
		} else {
			return this.getRuleContext(i, MembershipContext);
		}
	}
	public predicateList(): PredicateListContext[];
	public predicateList(i: number): PredicateListContext;
	public predicateList(i?: number): PredicateListContext | PredicateListContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PredicateListContext);
		} else {
			return this.getRuleContext(i, PredicateListContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_conceptPredicateObjectList; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterConceptPredicateObjectList) {
			listener.enterConceptPredicateObjectList(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitConceptPredicateObjectList) {
			listener.exitConceptPredicateObjectList(this);
		}
	}
}


export class AnnotationContext extends ParserRuleContext {
	public QUOTED_STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
	public name(): NameContext | undefined {
		return this.tryGetRuleContext(0, NameContext);
	}
	public description(): DescriptionContext | undefined {
		return this.tryGetRuleContext(0, DescriptionContext);
	}
	public code(): CodeContext | undefined {
		return this.tryGetRuleContext(0, CodeContext);
	}
	public version(): VersionContext | undefined {
		return this.tryGetRuleContext(0, VersionContext);
	}
	public propertyIri(): PropertyIriContext | undefined {
		return this.tryGetRuleContext(0, PropertyIriContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_annotation; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterAnnotation) {
			listener.enterAnnotation(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitAnnotation) {
			listener.exitAnnotation(this);
		}
	}
}


export class PredicateIriContext extends ParserRuleContext {
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	public scheme(): SchemeContext | undefined {
		return this.tryGetRuleContext(0, SchemeContext);
	}
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public status(): StatusContext | undefined {
		return this.tryGetRuleContext(0, StatusContext);
	}
	public target(): TargetContext | undefined {
		return this.tryGetRuleContext(0, TargetContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_predicateIri; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterPredicateIri) {
			listener.enterPredicateIri(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitPredicateIri) {
			listener.exitPredicateIri(this);
		}
	}
}


export class SchemeContext extends ParserRuleContext {
	public SCHEME(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SCHEME, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_scheme; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterScheme) {
			listener.enterScheme(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitScheme) {
			listener.exitScheme(this);
		}
	}
}


export class TypeContext extends ParserRuleContext {
	public TYPE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.TYPE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_type; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterType) {
			listener.enterType(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitType) {
			listener.exitType(this);
		}
	}
}


export class VersionContext extends ParserRuleContext {
	public VERSION(): TerminalNode { return this.getToken(DiscoverySyntaxParser.VERSION, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_version; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterVersion) {
			listener.enterVersion(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitVersion) {
			listener.exitVersion(this);
		}
	}
}


export class AxiomContext extends ParserRuleContext {
	public subclassOf(): SubclassOfContext | undefined {
		return this.tryGetRuleContext(0, SubclassOfContext);
	}
	public equivalentTo(): EquivalentToContext | undefined {
		return this.tryGetRuleContext(0, EquivalentToContext);
	}
	public subpropertyOf(): SubpropertyOfContext | undefined {
		return this.tryGetRuleContext(0, SubpropertyOfContext);
	}
	public inverseOf(): InverseOfContext | undefined {
		return this.tryGetRuleContext(0, InverseOfContext);
	}
	public domain(): DomainContext | undefined {
		return this.tryGetRuleContext(0, DomainContext);
	}
	public range(): RangeContext | undefined {
		return this.tryGetRuleContext(0, RangeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_axiom; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterAxiom) {
			listener.enterAxiom(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitAxiom) {
			listener.exitAxiom(this);
		}
	}
}


export class PropertiesContext extends ParserRuleContext {
	public PROPERTIES(): TerminalNode { return this.getToken(DiscoverySyntaxParser.PROPERTIES, 0); }
	public propertyRestriction(): PropertyRestrictionContext[];
	public propertyRestriction(i: number): PropertyRestrictionContext;
	public propertyRestriction(i?: number): PropertyRestrictionContext | PropertyRestrictionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyRestrictionContext);
		} else {
			return this.getRuleContext(i, PropertyRestrictionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_properties; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterProperties) {
			listener.enterProperties(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitProperties) {
			listener.exitProperties(this);
		}
	}
}


export class MembershipContext extends ParserRuleContext {
	public members(): MembersContext {
		return this.getRuleContext(0, MembersContext);
	}
	public notmembers(): NotmembersContext[];
	public notmembers(i: number): NotmembersContext;
	public notmembers(i?: number): NotmembersContext | NotmembersContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NotmembersContext);
		} else {
			return this.getRuleContext(i, NotmembersContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_membership; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMembership) {
			listener.enterMembership(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMembership) {
			listener.exitMembership(this);
		}
	}
}


export class MembersContext extends ParserRuleContext {
	public MEMBERS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MEMBERS, 0); }
	public classExpression(): ClassExpressionContext[];
	public classExpression(i: number): ClassExpressionContext;
	public classExpression(i?: number): ClassExpressionContext | ClassExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassExpressionContext);
		} else {
			return this.getRuleContext(i, ClassExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_members; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMembers) {
			listener.enterMembers(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMembers) {
			listener.exitMembers(this);
		}
	}
}


export class NotmembersContext extends ParserRuleContext {
	public NOTMEMBERS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.NOTMEMBERS, 0); }
	public iri(): IriContext[];
	public iri(i: number): IriContext;
	public iri(i?: number): IriContext | IriContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IriContext);
		} else {
			return this.getRuleContext(i, IriContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_notmembers; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterNotmembers) {
			listener.enterNotmembers(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitNotmembers) {
			listener.exitNotmembers(this);
		}
	}
}


export class TargetContext extends ParserRuleContext {
	public TARGETCLASS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.TARGETCLASS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_target; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterTarget) {
			listener.enterTarget(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitTarget) {
			listener.exitTarget(this);
		}
	}
}


export class PredicateListContext extends ParserRuleContext {
	public propertyIri(): PropertyIriContext {
		return this.getRuleContext(0, PropertyIriContext);
	}
	public propertyRestriction(): PropertyRestrictionContext[];
	public propertyRestriction(i: number): PropertyRestrictionContext;
	public propertyRestriction(i?: number): PropertyRestrictionContext | PropertyRestrictionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyRestrictionContext);
		} else {
			return this.getRuleContext(i, PropertyRestrictionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_predicateList; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterPredicateList) {
			listener.enterPredicateList(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitPredicateList) {
			listener.exitPredicateList(this);
		}
	}
}


export class MinInclusiveContext extends ParserRuleContext {
	public MININCLUSIVE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MININCLUSIVE, 0); }
	public DOUBLE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DOUBLE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_minInclusive; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMinInclusive) {
			listener.enterMinInclusive(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMinInclusive) {
			listener.exitMinInclusive(this);
		}
	}
}


export class MaxInclusiveContext extends ParserRuleContext {
	public MAXINCLUSIVE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MAXINCLUSIVE, 0); }
	public DOUBLE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DOUBLE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_maxInclusive; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMaxInclusive) {
			listener.enterMaxInclusive(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMaxInclusive) {
			listener.exitMaxInclusive(this);
		}
	}
}


export class MinExclusiveContext extends ParserRuleContext {
	public MINEXCLUSIVE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MINEXCLUSIVE, 0); }
	public DOUBLE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DOUBLE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_minExclusive; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMinExclusive) {
			listener.enterMinExclusive(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMinExclusive) {
			listener.exitMinExclusive(this);
		}
	}
}


export class MaxExclusiveContext extends ParserRuleContext {
	public MAXEXCLUSIVE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MAXEXCLUSIVE, 0); }
	public DOUBLE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DOUBLE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_maxExclusive; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMaxExclusive) {
			listener.enterMaxExclusive(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMaxExclusive) {
			listener.exitMaxExclusive(this);
		}
	}
}


export class StatusContext extends ParserRuleContext {
	public STATUS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.STATUS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_status; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterStatus) {
			listener.enterStatus(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitStatus) {
			listener.exitStatus(this);
		}
	}
}


export class SubclassOfContext extends ParserRuleContext {
	public SUBCLASS(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SUBCLASS, 0); }
	public classExpression(): ClassExpressionContext {
		return this.getRuleContext(0, ClassExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_subclassOf; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterSubclassOf) {
			listener.enterSubclassOf(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitSubclassOf) {
			listener.exitSubclassOf(this);
		}
	}
}


export class EquivalentToContext extends ParserRuleContext {
	public EQUIVALENTTO(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EQUIVALENTTO, 0); }
	public classExpression(): ClassExpressionContext {
		return this.getRuleContext(0, ClassExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_equivalentTo; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterEquivalentTo) {
			listener.enterEquivalentTo(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitEquivalentTo) {
			listener.exitEquivalentTo(this);
		}
	}
}


export class SubpropertyOfContext extends ParserRuleContext {
	public SUBPROPERTY(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SUBPROPERTY, 0); }
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_subpropertyOf; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterSubpropertyOf) {
			listener.enterSubpropertyOf(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitSubpropertyOf) {
			listener.exitSubpropertyOf(this);
		}
	}
}


export class InverseOfContext extends ParserRuleContext {
	public INVERSE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.INVERSE, 0); }
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_inverseOf; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterInverseOf) {
			listener.enterInverseOf(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitInverseOf) {
			listener.exitInverseOf(this);
		}
	}
}


export class DomainContext extends ParserRuleContext {
	public DOMAIN(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DOMAIN, 0); }
	public classExpression(): ClassExpressionContext {
		return this.getRuleContext(0, ClassExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_domain; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDomain) {
			listener.enterDomain(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDomain) {
			listener.exitDomain(this);
		}
	}
}


export class RangeContext extends ParserRuleContext {
	public RANGE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.RANGE, 0); }
	public classExpression(): ClassExpressionContext {
		return this.getRuleContext(0, ClassExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_range; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterRange) {
			listener.enterRange(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitRange) {
			listener.exitRange(this);
		}
	}
}


export class ClassExpressionContext extends ParserRuleContext {
	public iri(): IriContext | undefined {
		return this.tryGetRuleContext(0, IriContext);
	}
	public intersection(): IntersectionContext | undefined {
		return this.tryGetRuleContext(0, IntersectionContext);
	}
	public union(): UnionContext | undefined {
		return this.tryGetRuleContext(0, UnionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_classExpression; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterClassExpression) {
			listener.enterClassExpression(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitClassExpression) {
			listener.exitClassExpression(this);
		}
	}
}


export class IntersectionContext extends ParserRuleContext {
	public iri(): IriContext[];
	public iri(i: number): IriContext;
	public iri(i?: number): IriContext | IriContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IriContext);
		} else {
			return this.getRuleContext(i, IriContext);
		}
	}
	public AND(): TerminalNode[];
	public AND(i: number): TerminalNode;
	public AND(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(DiscoverySyntaxParser.AND);
		} else {
			return this.getToken(DiscoverySyntaxParser.AND, i);
		}
	}
	public propertyRestriction(): PropertyRestrictionContext[];
	public propertyRestriction(i: number): PropertyRestrictionContext;
	public propertyRestriction(i?: number): PropertyRestrictionContext | PropertyRestrictionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyRestrictionContext);
		} else {
			return this.getRuleContext(i, PropertyRestrictionContext);
		}
	}
	public union(): UnionContext[];
	public union(i: number): UnionContext;
	public union(i?: number): UnionContext | UnionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UnionContext);
		} else {
			return this.getRuleContext(i, UnionContext);
		}
	}
	public complement(): ComplementContext[];
	public complement(i: number): ComplementContext;
	public complement(i?: number): ComplementContext | ComplementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ComplementContext);
		} else {
			return this.getRuleContext(i, ComplementContext);
		}
	}
	public subExpression(): SubExpressionContext[];
	public subExpression(i: number): SubExpressionContext;
	public subExpression(i?: number): SubExpressionContext | SubExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SubExpressionContext);
		} else {
			return this.getRuleContext(i, SubExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_intersection; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterIntersection) {
			listener.enterIntersection(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitIntersection) {
			listener.exitIntersection(this);
		}
	}
}


export class SubExpressionContext extends ParserRuleContext {
	public union(): UnionContext | undefined {
		return this.tryGetRuleContext(0, UnionContext);
	}
	public intersection(): IntersectionContext | undefined {
		return this.tryGetRuleContext(0, IntersectionContext);
	}
	public complement(): ComplementContext | undefined {
		return this.tryGetRuleContext(0, ComplementContext);
	}
	public propertyRestriction(): PropertyRestrictionContext | undefined {
		return this.tryGetRuleContext(0, PropertyRestrictionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_subExpression; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterSubExpression) {
			listener.enterSubExpression(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitSubExpression) {
			listener.exitSubExpression(this);
		}
	}
}


export class UnionContext extends ParserRuleContext {
	public iri(): IriContext[];
	public iri(i: number): IriContext;
	public iri(i?: number): IriContext | IriContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IriContext);
		} else {
			return this.getRuleContext(i, IriContext);
		}
	}
	public OR(): TerminalNode[];
	public OR(i: number): TerminalNode;
	public OR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(DiscoverySyntaxParser.OR);
		} else {
			return this.getToken(DiscoverySyntaxParser.OR, i);
		}
	}
	public propertyRestriction(): PropertyRestrictionContext[];
	public propertyRestriction(i: number): PropertyRestrictionContext;
	public propertyRestriction(i?: number): PropertyRestrictionContext | PropertyRestrictionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyRestrictionContext);
		} else {
			return this.getRuleContext(i, PropertyRestrictionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_union; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterUnion) {
			listener.enterUnion(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitUnion) {
			listener.exitUnion(this);
		}
	}
}


export class ComplementContext extends ParserRuleContext {
	public NOT(): TerminalNode { return this.getToken(DiscoverySyntaxParser.NOT, 0); }
	public iri(): IriContext | undefined {
		return this.tryGetRuleContext(0, IriContext);
	}
	public intersection(): IntersectionContext | undefined {
		return this.tryGetRuleContext(0, IntersectionContext);
	}
	public union(): UnionContext | undefined {
		return this.tryGetRuleContext(0, UnionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_complement; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterComplement) {
			listener.enterComplement(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitComplement) {
			listener.exitComplement(this);
		}
	}
}


export class IriContext extends ParserRuleContext {
	public IRIREF(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.IRIREF, 0); }
	public PNAME_LN(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.PNAME_LN, 0); }
	public PIPED_STRING(): TerminalNode | undefined { return this.tryGetToken(DiscoverySyntaxParser.PIPED_STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_iri; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterIri) {
			listener.enterIri(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitIri) {
			listener.exitIri(this);
		}
	}
}


export class LiteralContext extends ParserRuleContext {
	public QUOTED_STRING(): TerminalNode { return this.getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_literal; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterLiteral) {
			listener.enterLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitLiteral) {
			listener.exitLiteral(this);
		}
	}
}


export class PropertyRestrictionContext extends ParserRuleContext {
	public propertyIri(): PropertyIriContext {
		return this.getRuleContext(0, PropertyIriContext);
	}
	public classOrDataType(): ClassOrDataTypeContext {
		return this.getRuleContext(0, ClassOrDataTypeContext);
	}
	public exactCardinality(): ExactCardinalityContext | undefined {
		return this.tryGetRuleContext(0, ExactCardinalityContext);
	}
	public rangeCardinality(): RangeCardinalityContext | undefined {
		return this.tryGetRuleContext(0, RangeCardinalityContext);
	}
	public minCardinality(): MinCardinalityContext | undefined {
		return this.tryGetRuleContext(0, MinCardinalityContext);
	}
	public maxCardinality(): MaxCardinalityContext | undefined {
		return this.tryGetRuleContext(0, MaxCardinalityContext);
	}
	public some(): SomeContext | undefined {
		return this.tryGetRuleContext(0, SomeContext);
	}
	public only(): OnlyContext | undefined {
		return this.tryGetRuleContext(0, OnlyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_propertyRestriction; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterPropertyRestriction) {
			listener.enterPropertyRestriction(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitPropertyRestriction) {
			listener.exitPropertyRestriction(this);
		}
	}
}


export class SomeContext extends ParserRuleContext {
	public SOME(): TerminalNode { return this.getToken(DiscoverySyntaxParser.SOME, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_some; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterSome) {
			listener.enterSome(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitSome) {
			listener.exitSome(this);
		}
	}
}


export class OnlyContext extends ParserRuleContext {
	public ONLY(): TerminalNode { return this.getToken(DiscoverySyntaxParser.ONLY, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_only; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterOnly) {
			listener.enterOnly(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitOnly) {
			listener.exitOnly(this);
		}
	}
}


export class PropertyIriContext extends ParserRuleContext {
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_propertyIri; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterPropertyIri) {
			listener.enterPropertyIri(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitPropertyIri) {
			listener.exitPropertyIri(this);
		}
	}
}


export class ExactCardinalityContext extends ParserRuleContext {
	public EXACTLY(): TerminalNode { return this.getToken(DiscoverySyntaxParser.EXACTLY, 0); }
	public INTEGER(): TerminalNode { return this.getToken(DiscoverySyntaxParser.INTEGER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_exactCardinality; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterExactCardinality) {
			listener.enterExactCardinality(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitExactCardinality) {
			listener.exitExactCardinality(this);
		}
	}
}


export class RangeCardinalityContext extends ParserRuleContext {
	public minCardinality(): MinCardinalityContext {
		return this.getRuleContext(0, MinCardinalityContext);
	}
	public maxCardinality(): MaxCardinalityContext {
		return this.getRuleContext(0, MaxCardinalityContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_rangeCardinality; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterRangeCardinality) {
			listener.enterRangeCardinality(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitRangeCardinality) {
			listener.exitRangeCardinality(this);
		}
	}
}


export class MinCardinalityContext extends ParserRuleContext {
	public MIN(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MIN, 0); }
	public INTEGER(): TerminalNode { return this.getToken(DiscoverySyntaxParser.INTEGER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_minCardinality; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMinCardinality) {
			listener.enterMinCardinality(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMinCardinality) {
			listener.exitMinCardinality(this);
		}
	}
}


export class MaxCardinalityContext extends ParserRuleContext {
	public MAX(): TerminalNode { return this.getToken(DiscoverySyntaxParser.MAX, 0); }
	public INTEGER(): TerminalNode { return this.getToken(DiscoverySyntaxParser.INTEGER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_maxCardinality; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterMaxCardinality) {
			listener.enterMaxCardinality(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitMaxCardinality) {
			listener.exitMaxCardinality(this);
		}
	}
}


export class ClassOrDataTypeContext extends ParserRuleContext {
	public iri(): IriContext {
		return this.getRuleContext(0, IriContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_classOrDataType; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterClassOrDataType) {
			listener.enterClassOrDataType(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitClassOrDataType) {
			listener.exitClassOrDataType(this);
		}
	}
}


export class NameContext extends ParserRuleContext {
	public NAME(): TerminalNode { return this.getToken(DiscoverySyntaxParser.NAME, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_name; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterName) {
			listener.enterName(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitName) {
			listener.exitName(this);
		}
	}
}


export class DescriptionContext extends ParserRuleContext {
	public DESCRIPTION(): TerminalNode { return this.getToken(DiscoverySyntaxParser.DESCRIPTION, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_description; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterDescription) {
			listener.enterDescription(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitDescription) {
			listener.exitDescription(this);
		}
	}
}


export class CodeContext extends ParserRuleContext {
	public CODE(): TerminalNode { return this.getToken(DiscoverySyntaxParser.CODE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return DiscoverySyntaxParser.RULE_code; }
	// @Override
	public enterRule(listener: DiscoverySyntaxListener): void {
		if (listener.enterCode) {
			listener.enterCode(this);
		}
	}
	// @Override
	public exitRule(listener: DiscoverySyntaxListener): void {
		if (listener.exitCode) {
			listener.exitCode(this);
		}
	}
}


