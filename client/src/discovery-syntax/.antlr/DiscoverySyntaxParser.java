// Generated from c:\Users\ahmed\OneDrive\Discovery\IMQuery\front-end-vue\src\discovery-syntax\DiscoverySyntax.g4 by ANTLR 4.8
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class DiscoverySyntaxParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.8", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, WS=9, 
		EQ=10, MEMBERS=11, NOTMEMBERS=12, STATUS=13, VERSION=14, PROPERTIES=15, 
		TYPE=16, MIN=17, MAX=18, SOME=19, ONLY=20, MININCLUSIVE=21, MAXINCLUSIVE=22, 
		MINEXCLUSIVE=23, MAXEXCLUSIVE=24, SUBCLASS=25, EQUIVALENTTO=26, DISJOINT=27, 
		SUBPROPERTY=28, INVERSE=29, DOMAIN=30, RANGE=31, TARGETCLASS=32, EXACTLY=33, 
		AND=34, INTEGER=35, DOUBLE=36, DIGIT=37, OR=38, NOT=39, NAME=40, DESCRIPTION=41, 
		CODE=42, SCHEME=43, PNAME_NS=44, PN_PREFIX=45, PN_CHARS_BASE=46, PN_CHARS_U=47, 
		PN_CHARS=48, IRIREF=49, UCHAR=50, PNAME_LN=51, PN_LOCAL=52, PLX=53, PERCENT=54, 
		ECHAR=55, QUOTED_STRING=56, STRING_LITERAL_QUOTE=57, STRING_LITERAL_SINGLE_QUOTE=58, 
		PIPED_STRING=59, PN_LOCAL_ESC=60, HEX=61;
	public static final int
		RULE_concept = 0, RULE_directive = 1, RULE_prefixID = 2, RULE_conceptPredicateObjectList = 3, 
		RULE_annotation = 4, RULE_predicateIri = 5, RULE_scheme = 6, RULE_type = 7, 
		RULE_version = 8, RULE_axiom = 9, RULE_properties = 10, RULE_membership = 11, 
		RULE_members = 12, RULE_notmembers = 13, RULE_target = 14, RULE_predicateList = 15, 
		RULE_minInclusive = 16, RULE_maxInclusive = 17, RULE_minExclusive = 18, 
		RULE_maxExclusive = 19, RULE_status = 20, RULE_subclassOf = 21, RULE_equivalentTo = 22, 
		RULE_subpropertyOf = 23, RULE_inverseOf = 24, RULE_domain = 25, RULE_range = 26, 
		RULE_classExpression = 27, RULE_intersection = 28, RULE_subExpression = 29, 
		RULE_union = 30, RULE_complement = 31, RULE_iri = 32, RULE_literal = 33, 
		RULE_propertyRestriction = 34, RULE_some = 35, RULE_only = 36, RULE_propertyIri = 37, 
		RULE_exactCardinality = 38, RULE_rangeCardinality = 39, RULE_minCardinality = 40, 
		RULE_maxCardinality = 41, RULE_classOrDataType = 42, RULE_name = 43, RULE_description = 44, 
		RULE_code = 45;
	private static String[] makeRuleNames() {
		return new String[] {
			"concept", "directive", "prefixID", "conceptPredicateObjectList", "annotation", 
			"predicateIri", "scheme", "type", "version", "axiom", "properties", "membership", 
			"members", "notmembers", "target", "predicateList", "minInclusive", "maxInclusive", 
			"minExclusive", "maxExclusive", "status", "subclassOf", "equivalentTo", 
			"subpropertyOf", "inverseOf", "domain", "range", "classExpression", "intersection", 
			"subExpression", "union", "complement", "iri", "literal", "propertyRestriction", 
			"some", "only", "propertyIri", "exactCardinality", "rangeCardinality", 
			"minCardinality", "maxCardinality", "classOrDataType", "name", "description", 
			"code"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'.'", "'@prefix'", "';'", "'['", "']'", "','", "'('", "')'", null, 
			"'='"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, "WS", "EQ", "MEMBERS", 
			"NOTMEMBERS", "STATUS", "VERSION", "PROPERTIES", "TYPE", "MIN", "MAX", 
			"SOME", "ONLY", "MININCLUSIVE", "MAXINCLUSIVE", "MINEXCLUSIVE", "MAXEXCLUSIVE", 
			"SUBCLASS", "EQUIVALENTTO", "DISJOINT", "SUBPROPERTY", "INVERSE", "DOMAIN", 
			"RANGE", "TARGETCLASS", "EXACTLY", "AND", "INTEGER", "DOUBLE", "DIGIT", 
			"OR", "NOT", "NAME", "DESCRIPTION", "CODE", "SCHEME", "PNAME_NS", "PN_PREFIX", 
			"PN_CHARS_BASE", "PN_CHARS_U", "PN_CHARS", "IRIREF", "UCHAR", "PNAME_LN", 
			"PN_LOCAL", "PLX", "PERCENT", "ECHAR", "QUOTED_STRING", "STRING_LITERAL_QUOTE", 
			"STRING_LITERAL_SINGLE_QUOTE", "PIPED_STRING", "PN_LOCAL_ESC", "HEX"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "DiscoverySyntax.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public DiscoverySyntaxParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class ConceptContext extends ParserRuleContext {
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public ConceptPredicateObjectListContext conceptPredicateObjectList() {
			return getRuleContext(ConceptPredicateObjectListContext.class,0);
		}
		public TerminalNode EOF() { return getToken(DiscoverySyntaxParser.EOF, 0); }
		public List<DirectiveContext> directive() {
			return getRuleContexts(DirectiveContext.class);
		}
		public DirectiveContext directive(int i) {
			return getRuleContext(DirectiveContext.class,i);
		}
		public ConceptContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_concept; }
	}

	public final ConceptContext concept() throws RecognitionException {
		ConceptContext _localctx = new ConceptContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_concept);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(95);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1+1 ) {
					{
					{
					setState(92);
					directive();
					}
					} 
				}
				setState(97);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			}
			setState(98);
			iri();
			setState(99);
			conceptPredicateObjectList();
			setState(100);
			match(T__0);
			setState(101);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DirectiveContext extends ParserRuleContext {
		public PrefixIDContext prefixID() {
			return getRuleContext(PrefixIDContext.class,0);
		}
		public DirectiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_directive; }
	}

	public final DirectiveContext directive() throws RecognitionException {
		DirectiveContext _localctx = new DirectiveContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_directive);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(103);
			prefixID();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PrefixIDContext extends ParserRuleContext {
		public TerminalNode PNAME_NS() { return getToken(DiscoverySyntaxParser.PNAME_NS, 0); }
		public TerminalNode IRIREF() { return getToken(DiscoverySyntaxParser.IRIREF, 0); }
		public PrefixIDContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_prefixID; }
	}

	public final PrefixIDContext prefixID() throws RecognitionException {
		PrefixIDContext _localctx = new PrefixIDContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_prefixID);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(105);
			match(T__1);
			setState(106);
			match(PNAME_NS);
			setState(107);
			match(IRIREF);
			setState(108);
			match(T__0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ConceptPredicateObjectListContext extends ParserRuleContext {
		public List<AnnotationContext> annotation() {
			return getRuleContexts(AnnotationContext.class);
		}
		public AnnotationContext annotation(int i) {
			return getRuleContext(AnnotationContext.class,i);
		}
		public List<PredicateIriContext> predicateIri() {
			return getRuleContexts(PredicateIriContext.class);
		}
		public PredicateIriContext predicateIri(int i) {
			return getRuleContext(PredicateIriContext.class,i);
		}
		public List<AxiomContext> axiom() {
			return getRuleContexts(AxiomContext.class);
		}
		public AxiomContext axiom(int i) {
			return getRuleContext(AxiomContext.class,i);
		}
		public List<PropertiesContext> properties() {
			return getRuleContexts(PropertiesContext.class);
		}
		public PropertiesContext properties(int i) {
			return getRuleContext(PropertiesContext.class,i);
		}
		public List<MembershipContext> membership() {
			return getRuleContexts(MembershipContext.class);
		}
		public MembershipContext membership(int i) {
			return getRuleContext(MembershipContext.class,i);
		}
		public List<PredicateListContext> predicateList() {
			return getRuleContexts(PredicateListContext.class);
		}
		public PredicateListContext predicateList(int i) {
			return getRuleContext(PredicateListContext.class,i);
		}
		public ConceptPredicateObjectListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_conceptPredicateObjectList; }
	}

	public final ConceptPredicateObjectListContext conceptPredicateObjectList() throws RecognitionException {
		ConceptPredicateObjectListContext _localctx = new ConceptPredicateObjectListContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_conceptPredicateObjectList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(116);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,1,_ctx) ) {
			case 1:
				{
				setState(110);
				annotation();
				}
				break;
			case 2:
				{
				setState(111);
				predicateIri();
				}
				break;
			case 3:
				{
				setState(112);
				axiom();
				}
				break;
			case 4:
				{
				setState(113);
				properties();
				}
				break;
			case 5:
				{
				setState(114);
				membership();
				}
				break;
			case 6:
				{
				setState(115);
				predicateList();
				}
				break;
			}
			setState(129);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__2) {
				{
				{
				setState(118);
				match(T__2);
				setState(125);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,2,_ctx) ) {
				case 1:
					{
					setState(119);
					annotation();
					}
					break;
				case 2:
					{
					setState(120);
					predicateIri();
					}
					break;
				case 3:
					{
					setState(121);
					axiom();
					}
					break;
				case 4:
					{
					setState(122);
					properties();
					}
					break;
				case 5:
					{
					setState(123);
					membership();
					}
					break;
				case 6:
					{
					setState(124);
					predicateList();
					}
					break;
				}
				}
				}
				setState(131);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AnnotationContext extends ParserRuleContext {
		public TerminalNode QUOTED_STRING() { return getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
		public NameContext name() {
			return getRuleContext(NameContext.class,0);
		}
		public DescriptionContext description() {
			return getRuleContext(DescriptionContext.class,0);
		}
		public CodeContext code() {
			return getRuleContext(CodeContext.class,0);
		}
		public VersionContext version() {
			return getRuleContext(VersionContext.class,0);
		}
		public PropertyIriContext propertyIri() {
			return getRuleContext(PropertyIriContext.class,0);
		}
		public AnnotationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_annotation; }
	}

	public final AnnotationContext annotation() throws RecognitionException {
		AnnotationContext _localctx = new AnnotationContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_annotation);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(137);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NAME:
				{
				setState(132);
				name();
				}
				break;
			case DESCRIPTION:
				{
				setState(133);
				description();
				}
				break;
			case CODE:
				{
				setState(134);
				code();
				}
				break;
			case VERSION:
				{
				setState(135);
				version();
				}
				break;
			case IRIREF:
			case PNAME_LN:
				{
				setState(136);
				propertyIri();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(139);
			match(QUOTED_STRING);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PredicateIriContext extends ParserRuleContext {
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public SchemeContext scheme() {
			return getRuleContext(SchemeContext.class,0);
		}
		public TypeContext type() {
			return getRuleContext(TypeContext.class,0);
		}
		public StatusContext status() {
			return getRuleContext(StatusContext.class,0);
		}
		public TargetContext target() {
			return getRuleContext(TargetContext.class,0);
		}
		public PredicateIriContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_predicateIri; }
	}

	public final PredicateIriContext predicateIri() throws RecognitionException {
		PredicateIriContext _localctx = new PredicateIriContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_predicateIri);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(145);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SCHEME:
				{
				setState(141);
				scheme();
				}
				break;
			case TYPE:
				{
				setState(142);
				type();
				}
				break;
			case STATUS:
				{
				setState(143);
				status();
				}
				break;
			case TARGETCLASS:
				{
				setState(144);
				target();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(147);
			iri();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SchemeContext extends ParserRuleContext {
		public TerminalNode SCHEME() { return getToken(DiscoverySyntaxParser.SCHEME, 0); }
		public SchemeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_scheme; }
	}

	public final SchemeContext scheme() throws RecognitionException {
		SchemeContext _localctx = new SchemeContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_scheme);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(149);
			match(SCHEME);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TypeContext extends ParserRuleContext {
		public TerminalNode TYPE() { return getToken(DiscoverySyntaxParser.TYPE, 0); }
		public TypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_type; }
	}

	public final TypeContext type() throws RecognitionException {
		TypeContext _localctx = new TypeContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_type);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(151);
			match(TYPE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class VersionContext extends ParserRuleContext {
		public TerminalNode VERSION() { return getToken(DiscoverySyntaxParser.VERSION, 0); }
		public VersionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_version; }
	}

	public final VersionContext version() throws RecognitionException {
		VersionContext _localctx = new VersionContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_version);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(153);
			match(VERSION);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AxiomContext extends ParserRuleContext {
		public SubclassOfContext subclassOf() {
			return getRuleContext(SubclassOfContext.class,0);
		}
		public EquivalentToContext equivalentTo() {
			return getRuleContext(EquivalentToContext.class,0);
		}
		public SubpropertyOfContext subpropertyOf() {
			return getRuleContext(SubpropertyOfContext.class,0);
		}
		public InverseOfContext inverseOf() {
			return getRuleContext(InverseOfContext.class,0);
		}
		public DomainContext domain() {
			return getRuleContext(DomainContext.class,0);
		}
		public RangeContext range() {
			return getRuleContext(RangeContext.class,0);
		}
		public AxiomContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_axiom; }
	}

	public final AxiomContext axiom() throws RecognitionException {
		AxiomContext _localctx = new AxiomContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_axiom);
		try {
			setState(161);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SUBCLASS:
				enterOuterAlt(_localctx, 1);
				{
				setState(155);
				subclassOf();
				}
				break;
			case EQUIVALENTTO:
				enterOuterAlt(_localctx, 2);
				{
				setState(156);
				equivalentTo();
				}
				break;
			case SUBPROPERTY:
				enterOuterAlt(_localctx, 3);
				{
				setState(157);
				subpropertyOf();
				}
				break;
			case INVERSE:
				enterOuterAlt(_localctx, 4);
				{
				setState(158);
				inverseOf();
				}
				break;
			case DOMAIN:
				enterOuterAlt(_localctx, 5);
				{
				setState(159);
				domain();
				}
				break;
			case RANGE:
				enterOuterAlt(_localctx, 6);
				{
				setState(160);
				range();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertiesContext extends ParserRuleContext {
		public TerminalNode PROPERTIES() { return getToken(DiscoverySyntaxParser.PROPERTIES, 0); }
		public List<PropertyRestrictionContext> propertyRestriction() {
			return getRuleContexts(PropertyRestrictionContext.class);
		}
		public PropertyRestrictionContext propertyRestriction(int i) {
			return getRuleContext(PropertyRestrictionContext.class,i);
		}
		public PropertiesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_properties; }
	}

	public final PropertiesContext properties() throws RecognitionException {
		PropertiesContext _localctx = new PropertiesContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_properties);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(163);
			match(PROPERTIES);
			setState(164);
			match(T__3);
			setState(166);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IRIREF || _la==PNAME_LN) {
				{
				setState(165);
				propertyRestriction();
				}
			}

			setState(172);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
			while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1+1 ) {
					{
					{
					setState(168);
					match(T__2);
					setState(169);
					propertyRestriction();
					}
					} 
				}
				setState(174);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
			}
			setState(175);
			match(T__4);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MembershipContext extends ParserRuleContext {
		public MembersContext members() {
			return getRuleContext(MembersContext.class,0);
		}
		public List<NotmembersContext> notmembers() {
			return getRuleContexts(NotmembersContext.class);
		}
		public NotmembersContext notmembers(int i) {
			return getRuleContext(NotmembersContext.class,i);
		}
		public MembershipContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_membership; }
	}

	public final MembershipContext membership() throws RecognitionException {
		MembershipContext _localctx = new MembershipContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_membership);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(177);
			members();
			setState(182);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,9,_ctx);
			while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1+1 ) {
					{
					{
					setState(178);
					match(T__2);
					setState(179);
					notmembers();
					}
					} 
				}
				setState(184);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,9,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MembersContext extends ParserRuleContext {
		public TerminalNode MEMBERS() { return getToken(DiscoverySyntaxParser.MEMBERS, 0); }
		public List<ClassExpressionContext> classExpression() {
			return getRuleContexts(ClassExpressionContext.class);
		}
		public ClassExpressionContext classExpression(int i) {
			return getRuleContext(ClassExpressionContext.class,i);
		}
		public MembersContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_members; }
	}

	public final MembersContext members() throws RecognitionException {
		MembersContext _localctx = new MembersContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_members);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(185);
			match(MEMBERS);
			setState(186);
			match(T__3);
			setState(188);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==IRIREF || _la==PNAME_LN) {
				{
				setState(187);
				classExpression();
				}
			}

			setState(194);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,11,_ctx);
			while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1+1 ) {
					{
					{
					setState(190);
					match(T__5);
					setState(191);
					classExpression();
					}
					} 
				}
				setState(196);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,11,_ctx);
			}
			setState(197);
			match(T__4);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NotmembersContext extends ParserRuleContext {
		public TerminalNode NOTMEMBERS() { return getToken(DiscoverySyntaxParser.NOTMEMBERS, 0); }
		public List<IriContext> iri() {
			return getRuleContexts(IriContext.class);
		}
		public IriContext iri(int i) {
			return getRuleContext(IriContext.class,i);
		}
		public NotmembersContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_notmembers; }
	}

	public final NotmembersContext notmembers() throws RecognitionException {
		NotmembersContext _localctx = new NotmembersContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_notmembers);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(199);
			match(NOTMEMBERS);
			setState(200);
			match(T__3);
			setState(201);
			iri();
			setState(206);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,12,_ctx);
			while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1+1 ) {
					{
					{
					setState(202);
					match(T__5);
					setState(203);
					iri();
					}
					} 
				}
				setState(208);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,12,_ctx);
			}
			setState(209);
			match(T__4);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TargetContext extends ParserRuleContext {
		public TerminalNode TARGETCLASS() { return getToken(DiscoverySyntaxParser.TARGETCLASS, 0); }
		public TargetContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_target; }
	}

	public final TargetContext target() throws RecognitionException {
		TargetContext _localctx = new TargetContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_target);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(211);
			match(TARGETCLASS);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PredicateListContext extends ParserRuleContext {
		public PropertyIriContext propertyIri() {
			return getRuleContext(PropertyIriContext.class,0);
		}
		public List<PropertyRestrictionContext> propertyRestriction() {
			return getRuleContexts(PropertyRestrictionContext.class);
		}
		public PropertyRestrictionContext propertyRestriction(int i) {
			return getRuleContext(PropertyRestrictionContext.class,i);
		}
		public PredicateListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_predicateList; }
	}

	public final PredicateListContext predicateList() throws RecognitionException {
		PredicateListContext _localctx = new PredicateListContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_predicateList);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(213);
			propertyIri();
			setState(214);
			match(T__3);
			setState(215);
			propertyRestriction();
			setState(220);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,13,_ctx);
			while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1+1 ) {
					{
					{
					setState(216);
					match(T__2);
					setState(217);
					propertyRestriction();
					}
					} 
				}
				setState(222);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,13,_ctx);
			}
			setState(223);
			match(T__4);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MinInclusiveContext extends ParserRuleContext {
		public TerminalNode MININCLUSIVE() { return getToken(DiscoverySyntaxParser.MININCLUSIVE, 0); }
		public TerminalNode DOUBLE() { return getToken(DiscoverySyntaxParser.DOUBLE, 0); }
		public MinInclusiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_minInclusive; }
	}

	public final MinInclusiveContext minInclusive() throws RecognitionException {
		MinInclusiveContext _localctx = new MinInclusiveContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_minInclusive);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(225);
			match(MININCLUSIVE);
			setState(226);
			match(DOUBLE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MaxInclusiveContext extends ParserRuleContext {
		public TerminalNode MAXINCLUSIVE() { return getToken(DiscoverySyntaxParser.MAXINCLUSIVE, 0); }
		public TerminalNode DOUBLE() { return getToken(DiscoverySyntaxParser.DOUBLE, 0); }
		public MaxInclusiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_maxInclusive; }
	}

	public final MaxInclusiveContext maxInclusive() throws RecognitionException {
		MaxInclusiveContext _localctx = new MaxInclusiveContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_maxInclusive);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(228);
			match(MAXINCLUSIVE);
			setState(229);
			match(DOUBLE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MinExclusiveContext extends ParserRuleContext {
		public TerminalNode MINEXCLUSIVE() { return getToken(DiscoverySyntaxParser.MINEXCLUSIVE, 0); }
		public TerminalNode DOUBLE() { return getToken(DiscoverySyntaxParser.DOUBLE, 0); }
		public MinExclusiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_minExclusive; }
	}

	public final MinExclusiveContext minExclusive() throws RecognitionException {
		MinExclusiveContext _localctx = new MinExclusiveContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_minExclusive);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(231);
			match(MINEXCLUSIVE);
			setState(232);
			match(DOUBLE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MaxExclusiveContext extends ParserRuleContext {
		public TerminalNode MAXEXCLUSIVE() { return getToken(DiscoverySyntaxParser.MAXEXCLUSIVE, 0); }
		public TerminalNode DOUBLE() { return getToken(DiscoverySyntaxParser.DOUBLE, 0); }
		public MaxExclusiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_maxExclusive; }
	}

	public final MaxExclusiveContext maxExclusive() throws RecognitionException {
		MaxExclusiveContext _localctx = new MaxExclusiveContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_maxExclusive);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(234);
			match(MAXEXCLUSIVE);
			setState(235);
			match(DOUBLE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class StatusContext extends ParserRuleContext {
		public TerminalNode STATUS() { return getToken(DiscoverySyntaxParser.STATUS, 0); }
		public StatusContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_status; }
	}

	public final StatusContext status() throws RecognitionException {
		StatusContext _localctx = new StatusContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_status);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(237);
			match(STATUS);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SubclassOfContext extends ParserRuleContext {
		public TerminalNode SUBCLASS() { return getToken(DiscoverySyntaxParser.SUBCLASS, 0); }
		public ClassExpressionContext classExpression() {
			return getRuleContext(ClassExpressionContext.class,0);
		}
		public SubclassOfContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_subclassOf; }
	}

	public final SubclassOfContext subclassOf() throws RecognitionException {
		SubclassOfContext _localctx = new SubclassOfContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_subclassOf);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(239);
			match(SUBCLASS);
			setState(240);
			classExpression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EquivalentToContext extends ParserRuleContext {
		public TerminalNode EQUIVALENTTO() { return getToken(DiscoverySyntaxParser.EQUIVALENTTO, 0); }
		public ClassExpressionContext classExpression() {
			return getRuleContext(ClassExpressionContext.class,0);
		}
		public EquivalentToContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_equivalentTo; }
	}

	public final EquivalentToContext equivalentTo() throws RecognitionException {
		EquivalentToContext _localctx = new EquivalentToContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_equivalentTo);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(242);
			match(EQUIVALENTTO);
			setState(243);
			classExpression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SubpropertyOfContext extends ParserRuleContext {
		public TerminalNode SUBPROPERTY() { return getToken(DiscoverySyntaxParser.SUBPROPERTY, 0); }
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public SubpropertyOfContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_subpropertyOf; }
	}

	public final SubpropertyOfContext subpropertyOf() throws RecognitionException {
		SubpropertyOfContext _localctx = new SubpropertyOfContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_subpropertyOf);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(245);
			match(SUBPROPERTY);
			setState(246);
			iri();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class InverseOfContext extends ParserRuleContext {
		public TerminalNode INVERSE() { return getToken(DiscoverySyntaxParser.INVERSE, 0); }
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public InverseOfContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_inverseOf; }
	}

	public final InverseOfContext inverseOf() throws RecognitionException {
		InverseOfContext _localctx = new InverseOfContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_inverseOf);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(248);
			match(INVERSE);
			setState(249);
			iri();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DomainContext extends ParserRuleContext {
		public TerminalNode DOMAIN() { return getToken(DiscoverySyntaxParser.DOMAIN, 0); }
		public ClassExpressionContext classExpression() {
			return getRuleContext(ClassExpressionContext.class,0);
		}
		public DomainContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_domain; }
	}

	public final DomainContext domain() throws RecognitionException {
		DomainContext _localctx = new DomainContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_domain);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(251);
			match(DOMAIN);
			setState(252);
			classExpression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RangeContext extends ParserRuleContext {
		public TerminalNode RANGE() { return getToken(DiscoverySyntaxParser.RANGE, 0); }
		public ClassExpressionContext classExpression() {
			return getRuleContext(ClassExpressionContext.class,0);
		}
		public RangeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_range; }
	}

	public final RangeContext range() throws RecognitionException {
		RangeContext _localctx = new RangeContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_range);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(254);
			match(RANGE);
			setState(255);
			classExpression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ClassExpressionContext extends ParserRuleContext {
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public IntersectionContext intersection() {
			return getRuleContext(IntersectionContext.class,0);
		}
		public UnionContext union() {
			return getRuleContext(UnionContext.class,0);
		}
		public ClassExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classExpression; }
	}

	public final ClassExpressionContext classExpression() throws RecognitionException {
		ClassExpressionContext _localctx = new ClassExpressionContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_classExpression);
		try {
			setState(260);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,14,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(257);
				iri();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				{
				setState(258);
				intersection();
				}
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				{
				setState(259);
				union();
				}
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IntersectionContext extends ParserRuleContext {
		public List<IriContext> iri() {
			return getRuleContexts(IriContext.class);
		}
		public IriContext iri(int i) {
			return getRuleContext(IriContext.class,i);
		}
		public List<TerminalNode> AND() { return getTokens(DiscoverySyntaxParser.AND); }
		public TerminalNode AND(int i) {
			return getToken(DiscoverySyntaxParser.AND, i);
		}
		public List<PropertyRestrictionContext> propertyRestriction() {
			return getRuleContexts(PropertyRestrictionContext.class);
		}
		public PropertyRestrictionContext propertyRestriction(int i) {
			return getRuleContext(PropertyRestrictionContext.class,i);
		}
		public List<UnionContext> union() {
			return getRuleContexts(UnionContext.class);
		}
		public UnionContext union(int i) {
			return getRuleContext(UnionContext.class,i);
		}
		public List<ComplementContext> complement() {
			return getRuleContexts(ComplementContext.class);
		}
		public ComplementContext complement(int i) {
			return getRuleContext(ComplementContext.class,i);
		}
		public List<SubExpressionContext> subExpression() {
			return getRuleContexts(SubExpressionContext.class);
		}
		public SubExpressionContext subExpression(int i) {
			return getRuleContext(SubExpressionContext.class,i);
		}
		public IntersectionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_intersection; }
	}

	public final IntersectionContext intersection() throws RecognitionException {
		IntersectionContext _localctx = new IntersectionContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_intersection);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(262);
			iri();
			setState(271); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(263);
					match(AND);
					setState(269);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,15,_ctx) ) {
					case 1:
						{
						setState(264);
						iri();
						}
						break;
					case 2:
						{
						setState(265);
						propertyRestriction();
						}
						break;
					case 3:
						{
						setState(266);
						union();
						}
						break;
					case 4:
						{
						setState(267);
						complement();
						}
						break;
					case 5:
						{
						setState(268);
						subExpression();
						}
						break;
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(273); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,16,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SubExpressionContext extends ParserRuleContext {
		public UnionContext union() {
			return getRuleContext(UnionContext.class,0);
		}
		public IntersectionContext intersection() {
			return getRuleContext(IntersectionContext.class,0);
		}
		public ComplementContext complement() {
			return getRuleContext(ComplementContext.class,0);
		}
		public PropertyRestrictionContext propertyRestriction() {
			return getRuleContext(PropertyRestrictionContext.class,0);
		}
		public SubExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_subExpression; }
	}

	public final SubExpressionContext subExpression() throws RecognitionException {
		SubExpressionContext _localctx = new SubExpressionContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_subExpression);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(275);
			match(T__6);
			setState(280);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,17,_ctx) ) {
			case 1:
				{
				setState(276);
				union();
				}
				break;
			case 2:
				{
				setState(277);
				intersection();
				}
				break;
			case 3:
				{
				setState(278);
				complement();
				}
				break;
			case 4:
				{
				setState(279);
				propertyRestriction();
				}
				break;
			}
			setState(282);
			match(T__7);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class UnionContext extends ParserRuleContext {
		public List<IriContext> iri() {
			return getRuleContexts(IriContext.class);
		}
		public IriContext iri(int i) {
			return getRuleContext(IriContext.class,i);
		}
		public List<TerminalNode> OR() { return getTokens(DiscoverySyntaxParser.OR); }
		public TerminalNode OR(int i) {
			return getToken(DiscoverySyntaxParser.OR, i);
		}
		public List<PropertyRestrictionContext> propertyRestriction() {
			return getRuleContexts(PropertyRestrictionContext.class);
		}
		public PropertyRestrictionContext propertyRestriction(int i) {
			return getRuleContext(PropertyRestrictionContext.class,i);
		}
		public UnionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_union; }
	}

	public final UnionContext union() throws RecognitionException {
		UnionContext _localctx = new UnionContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_union);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(284);
			iri();
			setState(290); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(285);
				match(OR);
				setState(288);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,18,_ctx) ) {
				case 1:
					{
					setState(286);
					iri();
					}
					break;
				case 2:
					{
					setState(287);
					propertyRestriction();
					}
					break;
				}
				}
				}
				setState(292); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==OR );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ComplementContext extends ParserRuleContext {
		public TerminalNode NOT() { return getToken(DiscoverySyntaxParser.NOT, 0); }
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public IntersectionContext intersection() {
			return getRuleContext(IntersectionContext.class,0);
		}
		public UnionContext union() {
			return getRuleContext(UnionContext.class,0);
		}
		public ComplementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_complement; }
	}

	public final ComplementContext complement() throws RecognitionException {
		ComplementContext _localctx = new ComplementContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_complement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(294);
			match(NOT);
			setState(298);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,20,_ctx) ) {
			case 1:
				{
				setState(295);
				iri();
				}
				break;
			case 2:
				{
				setState(296);
				intersection();
				}
				break;
			case 3:
				{
				setState(297);
				union();
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IriContext extends ParserRuleContext {
		public TerminalNode IRIREF() { return getToken(DiscoverySyntaxParser.IRIREF, 0); }
		public TerminalNode PNAME_LN() { return getToken(DiscoverySyntaxParser.PNAME_LN, 0); }
		public TerminalNode PIPED_STRING() { return getToken(DiscoverySyntaxParser.PIPED_STRING, 0); }
		public IriContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_iri; }
	}

	public final IriContext iri() throws RecognitionException {
		IriContext _localctx = new IriContext(_ctx, getState());
		enterRule(_localctx, 64, RULE_iri);
		int _la;
		try {
			setState(305);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IRIREF:
				enterOuterAlt(_localctx, 1);
				{
				setState(300);
				match(IRIREF);
				}
				break;
			case PNAME_LN:
				enterOuterAlt(_localctx, 2);
				{
				{
				setState(301);
				match(PNAME_LN);
				setState(303);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==PIPED_STRING) {
					{
					setState(302);
					match(PIPED_STRING);
					}
				}

				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LiteralContext extends ParserRuleContext {
		public TerminalNode QUOTED_STRING() { return getToken(DiscoverySyntaxParser.QUOTED_STRING, 0); }
		public LiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_literal; }
	}

	public final LiteralContext literal() throws RecognitionException {
		LiteralContext _localctx = new LiteralContext(_ctx, getState());
		enterRule(_localctx, 66, RULE_literal);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(307);
			match(QUOTED_STRING);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyRestrictionContext extends ParserRuleContext {
		public PropertyIriContext propertyIri() {
			return getRuleContext(PropertyIriContext.class,0);
		}
		public ClassOrDataTypeContext classOrDataType() {
			return getRuleContext(ClassOrDataTypeContext.class,0);
		}
		public ExactCardinalityContext exactCardinality() {
			return getRuleContext(ExactCardinalityContext.class,0);
		}
		public RangeCardinalityContext rangeCardinality() {
			return getRuleContext(RangeCardinalityContext.class,0);
		}
		public MinCardinalityContext minCardinality() {
			return getRuleContext(MinCardinalityContext.class,0);
		}
		public MaxCardinalityContext maxCardinality() {
			return getRuleContext(MaxCardinalityContext.class,0);
		}
		public SomeContext some() {
			return getRuleContext(SomeContext.class,0);
		}
		public OnlyContext only() {
			return getRuleContext(OnlyContext.class,0);
		}
		public PropertyRestrictionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyRestriction; }
	}

	public final PropertyRestrictionContext propertyRestriction() throws RecognitionException {
		PropertyRestrictionContext _localctx = new PropertyRestrictionContext(_ctx, getState());
		enterRule(_localctx, 68, RULE_propertyRestriction);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(309);
			propertyIri();
			setState(316);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,23,_ctx) ) {
			case 1:
				{
				setState(310);
				exactCardinality();
				}
				break;
			case 2:
				{
				setState(311);
				rangeCardinality();
				}
				break;
			case 3:
				{
				setState(312);
				minCardinality();
				}
				break;
			case 4:
				{
				setState(313);
				maxCardinality();
				}
				break;
			case 5:
				{
				setState(314);
				some();
				}
				break;
			case 6:
				{
				setState(315);
				only();
				}
				break;
			}
			setState(318);
			classOrDataType();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SomeContext extends ParserRuleContext {
		public TerminalNode SOME() { return getToken(DiscoverySyntaxParser.SOME, 0); }
		public SomeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_some; }
	}

	public final SomeContext some() throws RecognitionException {
		SomeContext _localctx = new SomeContext(_ctx, getState());
		enterRule(_localctx, 70, RULE_some);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(320);
			match(SOME);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class OnlyContext extends ParserRuleContext {
		public TerminalNode ONLY() { return getToken(DiscoverySyntaxParser.ONLY, 0); }
		public OnlyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_only; }
	}

	public final OnlyContext only() throws RecognitionException {
		OnlyContext _localctx = new OnlyContext(_ctx, getState());
		enterRule(_localctx, 72, RULE_only);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(322);
			match(ONLY);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyIriContext extends ParserRuleContext {
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public PropertyIriContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyIri; }
	}

	public final PropertyIriContext propertyIri() throws RecognitionException {
		PropertyIriContext _localctx = new PropertyIriContext(_ctx, getState());
		enterRule(_localctx, 74, RULE_propertyIri);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(324);
			iri();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExactCardinalityContext extends ParserRuleContext {
		public TerminalNode EXACTLY() { return getToken(DiscoverySyntaxParser.EXACTLY, 0); }
		public TerminalNode INTEGER() { return getToken(DiscoverySyntaxParser.INTEGER, 0); }
		public ExactCardinalityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_exactCardinality; }
	}

	public final ExactCardinalityContext exactCardinality() throws RecognitionException {
		ExactCardinalityContext _localctx = new ExactCardinalityContext(_ctx, getState());
		enterRule(_localctx, 76, RULE_exactCardinality);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(326);
			match(EXACTLY);
			setState(327);
			match(INTEGER);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RangeCardinalityContext extends ParserRuleContext {
		public MinCardinalityContext minCardinality() {
			return getRuleContext(MinCardinalityContext.class,0);
		}
		public MaxCardinalityContext maxCardinality() {
			return getRuleContext(MaxCardinalityContext.class,0);
		}
		public RangeCardinalityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_rangeCardinality; }
	}

	public final RangeCardinalityContext rangeCardinality() throws RecognitionException {
		RangeCardinalityContext _localctx = new RangeCardinalityContext(_ctx, getState());
		enterRule(_localctx, 78, RULE_rangeCardinality);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(329);
			minCardinality();
			setState(330);
			maxCardinality();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MinCardinalityContext extends ParserRuleContext {
		public TerminalNode MIN() { return getToken(DiscoverySyntaxParser.MIN, 0); }
		public TerminalNode INTEGER() { return getToken(DiscoverySyntaxParser.INTEGER, 0); }
		public MinCardinalityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_minCardinality; }
	}

	public final MinCardinalityContext minCardinality() throws RecognitionException {
		MinCardinalityContext _localctx = new MinCardinalityContext(_ctx, getState());
		enterRule(_localctx, 80, RULE_minCardinality);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(332);
			match(MIN);
			setState(333);
			match(INTEGER);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MaxCardinalityContext extends ParserRuleContext {
		public TerminalNode MAX() { return getToken(DiscoverySyntaxParser.MAX, 0); }
		public TerminalNode INTEGER() { return getToken(DiscoverySyntaxParser.INTEGER, 0); }
		public MaxCardinalityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_maxCardinality; }
	}

	public final MaxCardinalityContext maxCardinality() throws RecognitionException {
		MaxCardinalityContext _localctx = new MaxCardinalityContext(_ctx, getState());
		enterRule(_localctx, 82, RULE_maxCardinality);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(335);
			match(MAX);
			setState(336);
			match(INTEGER);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ClassOrDataTypeContext extends ParserRuleContext {
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public ClassOrDataTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classOrDataType; }
	}

	public final ClassOrDataTypeContext classOrDataType() throws RecognitionException {
		ClassOrDataTypeContext _localctx = new ClassOrDataTypeContext(_ctx, getState());
		enterRule(_localctx, 84, RULE_classOrDataType);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(338);
			iri();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NameContext extends ParserRuleContext {
		public TerminalNode NAME() { return getToken(DiscoverySyntaxParser.NAME, 0); }
		public NameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_name; }
	}

	public final NameContext name() throws RecognitionException {
		NameContext _localctx = new NameContext(_ctx, getState());
		enterRule(_localctx, 86, RULE_name);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(340);
			match(NAME);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DescriptionContext extends ParserRuleContext {
		public TerminalNode DESCRIPTION() { return getToken(DiscoverySyntaxParser.DESCRIPTION, 0); }
		public DescriptionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_description; }
	}

	public final DescriptionContext description() throws RecognitionException {
		DescriptionContext _localctx = new DescriptionContext(_ctx, getState());
		enterRule(_localctx, 88, RULE_description);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(342);
			match(DESCRIPTION);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CodeContext extends ParserRuleContext {
		public TerminalNode CODE() { return getToken(DiscoverySyntaxParser.CODE, 0); }
		public CodeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_code; }
	}

	public final CodeContext code() throws RecognitionException {
		CodeContext _localctx = new CodeContext(_ctx, getState());
		enterRule(_localctx, 90, RULE_code);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(344);
			match(CODE);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3?\u015d\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31\t\31"+
		"\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t \4!"+
		"\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t(\4)\t)\4*\t*\4+\t+\4"+
		",\t,\4-\t-\4.\t.\4/\t/\3\2\7\2`\n\2\f\2\16\2c\13\2\3\2\3\2\3\2\3\2\3\2"+
		"\3\3\3\3\3\4\3\4\3\4\3\4\3\4\3\5\3\5\3\5\3\5\3\5\3\5\5\5w\n\5\3\5\3\5"+
		"\3\5\3\5\3\5\3\5\3\5\5\5\u0080\n\5\7\5\u0082\n\5\f\5\16\5\u0085\13\5\3"+
		"\6\3\6\3\6\3\6\3\6\5\6\u008c\n\6\3\6\3\6\3\7\3\7\3\7\3\7\5\7\u0094\n\7"+
		"\3\7\3\7\3\b\3\b\3\t\3\t\3\n\3\n\3\13\3\13\3\13\3\13\3\13\3\13\5\13\u00a4"+
		"\n\13\3\f\3\f\3\f\5\f\u00a9\n\f\3\f\3\f\7\f\u00ad\n\f\f\f\16\f\u00b0\13"+
		"\f\3\f\3\f\3\r\3\r\3\r\7\r\u00b7\n\r\f\r\16\r\u00ba\13\r\3\16\3\16\3\16"+
		"\5\16\u00bf\n\16\3\16\3\16\7\16\u00c3\n\16\f\16\16\16\u00c6\13\16\3\16"+
		"\3\16\3\17\3\17\3\17\3\17\3\17\7\17\u00cf\n\17\f\17\16\17\u00d2\13\17"+
		"\3\17\3\17\3\20\3\20\3\21\3\21\3\21\3\21\3\21\7\21\u00dd\n\21\f\21\16"+
		"\21\u00e0\13\21\3\21\3\21\3\22\3\22\3\22\3\23\3\23\3\23\3\24\3\24\3\24"+
		"\3\25\3\25\3\25\3\26\3\26\3\27\3\27\3\27\3\30\3\30\3\30\3\31\3\31\3\31"+
		"\3\32\3\32\3\32\3\33\3\33\3\33\3\34\3\34\3\34\3\35\3\35\3\35\5\35\u0107"+
		"\n\35\3\36\3\36\3\36\3\36\3\36\3\36\3\36\5\36\u0110\n\36\6\36\u0112\n"+
		"\36\r\36\16\36\u0113\3\37\3\37\3\37\3\37\3\37\5\37\u011b\n\37\3\37\3\37"+
		"\3 \3 \3 \3 \5 \u0123\n \6 \u0125\n \r \16 \u0126\3!\3!\3!\3!\5!\u012d"+
		"\n!\3\"\3\"\3\"\5\"\u0132\n\"\5\"\u0134\n\"\3#\3#\3$\3$\3$\3$\3$\3$\3"+
		"$\5$\u013f\n$\3$\3$\3%\3%\3&\3&\3\'\3\'\3(\3(\3(\3)\3)\3)\3*\3*\3*\3+"+
		"\3+\3+\3,\3,\3-\3-\3.\3.\3/\3/\3/\ba\u00ae\u00b8\u00c4\u00d0\u00de\2\60"+
		"\2\4\6\b\n\f\16\20\22\24\26\30\32\34\36 \"$&(*,.\60\62\64\668:<>@BDFH"+
		"JLNPRTVXZ\\\2\2\2\u0164\2a\3\2\2\2\4i\3\2\2\2\6k\3\2\2\2\bv\3\2\2\2\n"+
		"\u008b\3\2\2\2\f\u0093\3\2\2\2\16\u0097\3\2\2\2\20\u0099\3\2\2\2\22\u009b"+
		"\3\2\2\2\24\u00a3\3\2\2\2\26\u00a5\3\2\2\2\30\u00b3\3\2\2\2\32\u00bb\3"+
		"\2\2\2\34\u00c9\3\2\2\2\36\u00d5\3\2\2\2 \u00d7\3\2\2\2\"\u00e3\3\2\2"+
		"\2$\u00e6\3\2\2\2&\u00e9\3\2\2\2(\u00ec\3\2\2\2*\u00ef\3\2\2\2,\u00f1"+
		"\3\2\2\2.\u00f4\3\2\2\2\60\u00f7\3\2\2\2\62\u00fa\3\2\2\2\64\u00fd\3\2"+
		"\2\2\66\u0100\3\2\2\28\u0106\3\2\2\2:\u0108\3\2\2\2<\u0115\3\2\2\2>\u011e"+
		"\3\2\2\2@\u0128\3\2\2\2B\u0133\3\2\2\2D\u0135\3\2\2\2F\u0137\3\2\2\2H"+
		"\u0142\3\2\2\2J\u0144\3\2\2\2L\u0146\3\2\2\2N\u0148\3\2\2\2P\u014b\3\2"+
		"\2\2R\u014e\3\2\2\2T\u0151\3\2\2\2V\u0154\3\2\2\2X\u0156\3\2\2\2Z\u0158"+
		"\3\2\2\2\\\u015a\3\2\2\2^`\5\4\3\2_^\3\2\2\2`c\3\2\2\2ab\3\2\2\2a_\3\2"+
		"\2\2bd\3\2\2\2ca\3\2\2\2de\5B\"\2ef\5\b\5\2fg\7\3\2\2gh\7\2\2\3h\3\3\2"+
		"\2\2ij\5\6\4\2j\5\3\2\2\2kl\7\4\2\2lm\7.\2\2mn\7\63\2\2no\7\3\2\2o\7\3"+
		"\2\2\2pw\5\n\6\2qw\5\f\7\2rw\5\24\13\2sw\5\26\f\2tw\5\30\r\2uw\5 \21\2"+
		"vp\3\2\2\2vq\3\2\2\2vr\3\2\2\2vs\3\2\2\2vt\3\2\2\2vu\3\2\2\2w\u0083\3"+
		"\2\2\2x\177\7\5\2\2y\u0080\5\n\6\2z\u0080\5\f\7\2{\u0080\5\24\13\2|\u0080"+
		"\5\26\f\2}\u0080\5\30\r\2~\u0080\5 \21\2\177y\3\2\2\2\177z\3\2\2\2\177"+
		"{\3\2\2\2\177|\3\2\2\2\177}\3\2\2\2\177~\3\2\2\2\177\u0080\3\2\2\2\u0080"+
		"\u0082\3\2\2\2\u0081x\3\2\2\2\u0082\u0085\3\2\2\2\u0083\u0081\3\2\2\2"+
		"\u0083\u0084\3\2\2\2\u0084\t\3\2\2\2\u0085\u0083\3\2\2\2\u0086\u008c\5"+
		"X-\2\u0087\u008c\5Z.\2\u0088\u008c\5\\/\2\u0089\u008c\5\22\n\2\u008a\u008c"+
		"\5L\'\2\u008b\u0086\3\2\2\2\u008b\u0087\3\2\2\2\u008b\u0088\3\2\2\2\u008b"+
		"\u0089\3\2\2\2\u008b\u008a\3\2\2\2\u008c\u008d\3\2\2\2\u008d\u008e\7:"+
		"\2\2\u008e\13\3\2\2\2\u008f\u0094\5\16\b\2\u0090\u0094\5\20\t\2\u0091"+
		"\u0094\5*\26\2\u0092\u0094\5\36\20\2\u0093\u008f\3\2\2\2\u0093\u0090\3"+
		"\2\2\2\u0093\u0091\3\2\2\2\u0093\u0092\3\2\2\2\u0094\u0095\3\2\2\2\u0095"+
		"\u0096\5B\"\2\u0096\r\3\2\2\2\u0097\u0098\7-\2\2\u0098\17\3\2\2\2\u0099"+
		"\u009a\7\22\2\2\u009a\21\3\2\2\2\u009b\u009c\7\20\2\2\u009c\23\3\2\2\2"+
		"\u009d\u00a4\5,\27\2\u009e\u00a4\5.\30\2\u009f\u00a4\5\60\31\2\u00a0\u00a4"+
		"\5\62\32\2\u00a1\u00a4\5\64\33\2\u00a2\u00a4\5\66\34\2\u00a3\u009d\3\2"+
		"\2\2\u00a3\u009e\3\2\2\2\u00a3\u009f\3\2\2\2\u00a3\u00a0\3\2\2\2\u00a3"+
		"\u00a1\3\2\2\2\u00a3\u00a2\3\2\2\2\u00a4\25\3\2\2\2\u00a5\u00a6\7\21\2"+
		"\2\u00a6\u00a8\7\6\2\2\u00a7\u00a9\5F$\2\u00a8\u00a7\3\2\2\2\u00a8\u00a9"+
		"\3\2\2\2\u00a9\u00ae\3\2\2\2\u00aa\u00ab\7\5\2\2\u00ab\u00ad\5F$\2\u00ac"+
		"\u00aa\3\2\2\2\u00ad\u00b0\3\2\2\2\u00ae\u00af\3\2\2\2\u00ae\u00ac\3\2"+
		"\2\2\u00af\u00b1\3\2\2\2\u00b0\u00ae\3\2\2\2\u00b1\u00b2\7\7\2\2\u00b2"+
		"\27\3\2\2\2\u00b3\u00b8\5\32\16\2\u00b4\u00b5\7\5\2\2\u00b5\u00b7\5\34"+
		"\17\2\u00b6\u00b4\3\2\2\2\u00b7\u00ba\3\2\2\2\u00b8\u00b9\3\2\2\2\u00b8"+
		"\u00b6\3\2\2\2\u00b9\31\3\2\2\2\u00ba\u00b8\3\2\2\2\u00bb\u00bc\7\r\2"+
		"\2\u00bc\u00be\7\6\2\2\u00bd\u00bf\58\35\2\u00be\u00bd\3\2\2\2\u00be\u00bf"+
		"\3\2\2\2\u00bf\u00c4\3\2\2\2\u00c0\u00c1\7\b\2\2\u00c1\u00c3\58\35\2\u00c2"+
		"\u00c0\3\2\2\2\u00c3\u00c6\3\2\2\2\u00c4\u00c5\3\2\2\2\u00c4\u00c2\3\2"+
		"\2\2\u00c5\u00c7\3\2\2\2\u00c6\u00c4\3\2\2\2\u00c7\u00c8\7\7\2\2\u00c8"+
		"\33\3\2\2\2\u00c9\u00ca\7\16\2\2\u00ca\u00cb\7\6\2\2\u00cb\u00d0\5B\""+
		"\2\u00cc\u00cd\7\b\2\2\u00cd\u00cf\5B\"\2\u00ce\u00cc\3\2\2\2\u00cf\u00d2"+
		"\3\2\2\2\u00d0\u00d1\3\2\2\2\u00d0\u00ce\3\2\2\2\u00d1\u00d3\3\2\2\2\u00d2"+
		"\u00d0\3\2\2\2\u00d3\u00d4\7\7\2\2\u00d4\35\3\2\2\2\u00d5\u00d6\7\"\2"+
		"\2\u00d6\37\3\2\2\2\u00d7\u00d8\5L\'\2\u00d8\u00d9\7\6\2\2\u00d9\u00de"+
		"\5F$\2\u00da\u00db\7\5\2\2\u00db\u00dd\5F$\2\u00dc\u00da\3\2\2\2\u00dd"+
		"\u00e0\3\2\2\2\u00de\u00df\3\2\2\2\u00de\u00dc\3\2\2\2\u00df\u00e1\3\2"+
		"\2\2\u00e0\u00de\3\2\2\2\u00e1\u00e2\7\7\2\2\u00e2!\3\2\2\2\u00e3\u00e4"+
		"\7\27\2\2\u00e4\u00e5\7&\2\2\u00e5#\3\2\2\2\u00e6\u00e7\7\30\2\2\u00e7"+
		"\u00e8\7&\2\2\u00e8%\3\2\2\2\u00e9\u00ea\7\31\2\2\u00ea\u00eb\7&\2\2\u00eb"+
		"\'\3\2\2\2\u00ec\u00ed\7\32\2\2\u00ed\u00ee\7&\2\2\u00ee)\3\2\2\2\u00ef"+
		"\u00f0\7\17\2\2\u00f0+\3\2\2\2\u00f1\u00f2\7\33\2\2\u00f2\u00f3\58\35"+
		"\2\u00f3-\3\2\2\2\u00f4\u00f5\7\34\2\2\u00f5\u00f6\58\35\2\u00f6/\3\2"+
		"\2\2\u00f7\u00f8\7\36\2\2\u00f8\u00f9\5B\"\2\u00f9\61\3\2\2\2\u00fa\u00fb"+
		"\7\37\2\2\u00fb\u00fc\5B\"\2\u00fc\63\3\2\2\2\u00fd\u00fe\7 \2\2\u00fe"+
		"\u00ff\58\35\2\u00ff\65\3\2\2\2\u0100\u0101\7!\2\2\u0101\u0102\58\35\2"+
		"\u0102\67\3\2\2\2\u0103\u0107\5B\"\2\u0104\u0107\5:\36\2\u0105\u0107\5"+
		"> \2\u0106\u0103\3\2\2\2\u0106\u0104\3\2\2\2\u0106\u0105\3\2\2\2\u0107"+
		"9\3\2\2\2\u0108\u0111\5B\"\2\u0109\u010f\7$\2\2\u010a\u0110\5B\"\2\u010b"+
		"\u0110\5F$\2\u010c\u0110\5> \2\u010d\u0110\5@!\2\u010e\u0110\5<\37\2\u010f"+
		"\u010a\3\2\2\2\u010f\u010b\3\2\2\2\u010f\u010c\3\2\2\2\u010f\u010d\3\2"+
		"\2\2\u010f\u010e\3\2\2\2\u0110\u0112\3\2\2\2\u0111\u0109\3\2\2\2\u0112"+
		"\u0113\3\2\2\2\u0113\u0111\3\2\2\2\u0113\u0114\3\2\2\2\u0114;\3\2\2\2"+
		"\u0115\u011a\7\t\2\2\u0116\u011b\5> \2\u0117\u011b\5:\36\2\u0118\u011b"+
		"\5@!\2\u0119\u011b\5F$\2\u011a\u0116\3\2\2\2\u011a\u0117\3\2\2\2\u011a"+
		"\u0118\3\2\2\2\u011a\u0119\3\2\2\2\u011b\u011c\3\2\2\2\u011c\u011d\7\n"+
		"\2\2\u011d=\3\2\2\2\u011e\u0124\5B\"\2\u011f\u0122\7(\2\2\u0120\u0123"+
		"\5B\"\2\u0121\u0123\5F$\2\u0122\u0120\3\2\2\2\u0122\u0121\3\2\2\2\u0123"+
		"\u0125\3\2\2\2\u0124\u011f\3\2\2\2\u0125\u0126\3\2\2\2\u0126\u0124\3\2"+
		"\2\2\u0126\u0127\3\2\2\2\u0127?\3\2\2\2\u0128\u012c\7)\2\2\u0129\u012d"+
		"\5B\"\2\u012a\u012d\5:\36\2\u012b\u012d\5> \2\u012c\u0129\3\2\2\2\u012c"+
		"\u012a\3\2\2\2\u012c\u012b\3\2\2\2\u012dA\3\2\2\2\u012e\u0134\7\63\2\2"+
		"\u012f\u0131\7\65\2\2\u0130\u0132\7=\2\2\u0131\u0130\3\2\2\2\u0131\u0132"+
		"\3\2\2\2\u0132\u0134\3\2\2\2\u0133\u012e\3\2\2\2\u0133\u012f\3\2\2\2\u0134"+
		"C\3\2\2\2\u0135\u0136\7:\2\2\u0136E\3\2\2\2\u0137\u013e\5L\'\2\u0138\u013f"+
		"\5N(\2\u0139\u013f\5P)\2\u013a\u013f\5R*\2\u013b\u013f\5T+\2\u013c\u013f"+
		"\5H%\2\u013d\u013f\5J&\2\u013e\u0138\3\2\2\2\u013e\u0139\3\2\2\2\u013e"+
		"\u013a\3\2\2\2\u013e\u013b\3\2\2\2\u013e\u013c\3\2\2\2\u013e\u013d\3\2"+
		"\2\2\u013e\u013f\3\2\2\2\u013f\u0140\3\2\2\2\u0140\u0141\5V,\2\u0141G"+
		"\3\2\2\2\u0142\u0143\7\25\2\2\u0143I\3\2\2\2\u0144\u0145\7\26\2\2\u0145"+
		"K\3\2\2\2\u0146\u0147\5B\"\2\u0147M\3\2\2\2\u0148\u0149\7#\2\2\u0149\u014a"+
		"\7%\2\2\u014aO\3\2\2\2\u014b\u014c\5R*\2\u014c\u014d\5T+\2\u014dQ\3\2"+
		"\2\2\u014e\u014f\7\23\2\2\u014f\u0150\7%\2\2\u0150S\3\2\2\2\u0151\u0152"+
		"\7\24\2\2\u0152\u0153\7%\2\2\u0153U\3\2\2\2\u0154\u0155\5B\"\2\u0155W"+
		"\3\2\2\2\u0156\u0157\7*\2\2\u0157Y\3\2\2\2\u0158\u0159\7+\2\2\u0159[\3"+
		"\2\2\2\u015a\u015b\7,\2\2\u015b]\3\2\2\2\32av\177\u0083\u008b\u0093\u00a3"+
		"\u00a8\u00ae\u00b8\u00be\u00c4\u00d0\u00de\u0106\u010f\u0113\u011a\u0122"+
		"\u0126\u012c\u0131\u0133\u013e";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}