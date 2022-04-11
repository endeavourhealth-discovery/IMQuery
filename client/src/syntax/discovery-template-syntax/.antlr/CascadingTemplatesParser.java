// Generated from c:\Users\ahmed\OneDrive\Discovery\IMQuery\front-end-vue\src\discovery-template-syntax\CascadingTemplates.g4 by ANTLR 4.8
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class CascadingTemplatesParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.8", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		INCLUDE=1, EXCLUDE=2, INDEFINITE_ARTICLE=3, PRONOUN=4, HAVE_VERB=5, WITH=6, 
		THAT=7, IS=8, IS_NOT=9, PERSON=10, ORGANISATION=11, PROPERTY=12, HEALTHRECORD=13, 
		CLINICAL_CODE=14, VALUE=15, DATE=16, OR=17, AND=18, NUMBER=19, DECIMAL_NUMBER=20, 
		WORD=21, ALPHANUMERIC_WORD=22, WHITEPSPACE=23;
	public static final int
		RULE_operator = 0, RULE_main_entity = 1, RULE_linked_entity = 2, RULE_linked_entity_property = 3;
	private static String[] makeRuleNames() {
		return new String[] {
			"operator", "main_entity", "linked_entity", "linked_entity_property"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "INCLUDE", "EXCLUDE", "INDEFINITE_ARTICLE", "PRONOUN", "HAVE_VERB", 
			"WITH", "THAT", "IS", "IS_NOT", "PERSON", "ORGANISATION", "PROPERTY", 
			"HEALTHRECORD", "CLINICAL_CODE", "VALUE", "DATE", "OR", "AND", "NUMBER", 
			"DECIMAL_NUMBER", "WORD", "ALPHANUMERIC_WORD", "WHITEPSPACE"
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
	public String getGrammarFileName() { return "CascadingTemplates.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public CascadingTemplatesParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class OperatorContext extends ParserRuleContext {
		public TerminalNode OR() { return getToken(CascadingTemplatesParser.OR, 0); }
		public TerminalNode AND() { return getToken(CascadingTemplatesParser.AND, 0); }
		public OperatorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_operator; }
	}

	public final OperatorContext operator() throws RecognitionException {
		OperatorContext _localctx = new OperatorContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_operator);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(8);
			_la = _input.LA(1);
			if ( !(_la==OR || _la==AND) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
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

	public static class Main_entityContext extends ParserRuleContext {
		public TerminalNode PERSON() { return getToken(CascadingTemplatesParser.PERSON, 0); }
		public TerminalNode ORGANISATION() { return getToken(CascadingTemplatesParser.ORGANISATION, 0); }
		public TerminalNode PROPERTY() { return getToken(CascadingTemplatesParser.PROPERTY, 0); }
		public Main_entityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_main_entity; }
	}

	public final Main_entityContext main_entity() throws RecognitionException {
		Main_entityContext _localctx = new Main_entityContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_main_entity);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(10);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << PERSON) | (1L << ORGANISATION) | (1L << PROPERTY))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
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

	public static class Linked_entityContext extends ParserRuleContext {
		public TerminalNode HEALTHRECORD() { return getToken(CascadingTemplatesParser.HEALTHRECORD, 0); }
		public TerminalNode ALPHANUMERIC_WORD() { return getToken(CascadingTemplatesParser.ALPHANUMERIC_WORD, 0); }
		public Linked_entityContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_linked_entity; }
	}

	public final Linked_entityContext linked_entity() throws RecognitionException {
		Linked_entityContext _localctx = new Linked_entityContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_linked_entity);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(12);
			_la = _input.LA(1);
			if ( !(_la==HEALTHRECORD || _la==ALPHANUMERIC_WORD) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
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

	public static class Linked_entity_propertyContext extends ParserRuleContext {
		public TerminalNode CLINICAL_CODE() { return getToken(CascadingTemplatesParser.CLINICAL_CODE, 0); }
		public TerminalNode VALUE() { return getToken(CascadingTemplatesParser.VALUE, 0); }
		public TerminalNode DATE() { return getToken(CascadingTemplatesParser.DATE, 0); }
		public Linked_entity_propertyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_linked_entity_property; }
	}

	public final Linked_entity_propertyContext linked_entity_property() throws RecognitionException {
		Linked_entity_propertyContext _localctx = new Linked_entity_propertyContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_linked_entity_property);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(14);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << CLINICAL_CODE) | (1L << VALUE) | (1L << DATE))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
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

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\31\23\4\2\t\2\4\3"+
		"\t\3\4\4\t\4\4\5\t\5\3\2\3\2\3\3\3\3\3\4\3\4\3\5\3\5\3\5\2\2\6\2\4\6\b"+
		"\2\6\3\2\23\24\3\2\f\16\4\2\17\17\30\30\3\2\20\22\2\16\2\n\3\2\2\2\4\f"+
		"\3\2\2\2\6\16\3\2\2\2\b\20\3\2\2\2\n\13\t\2\2\2\13\3\3\2\2\2\f\r\t\3\2"+
		"\2\r\5\3\2\2\2\16\17\t\4\2\2\17\7\3\2\2\2\20\21\t\5\2\2\21\t\3\2\2\2\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}