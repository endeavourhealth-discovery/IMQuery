grammar CascadingTemplates;



// lexer // 


// fragments to enable case insensitivity

fragment A:('a'|'A');
fragment B:('b'|'B');
fragment C:('c'|'C');
fragment D:('d'|'D');
fragment E:('e'|'E');
fragment F:('f'|'F');
fragment G:('g'|'G');
fragment H:('h'|'H');
fragment I:('i'|'I');
fragment J:('j'|'J');
fragment K:('k'|'K');
fragment L:('l'|'L');
fragment M:('m'|'M');
fragment N:('n'|'N');
fragment O:('o'|'O');
fragment P:('p'|'P');
fragment Q:('q'|'Q');
fragment R:('r'|'R');
fragment S:('s'|'S');
fragment T:('t'|'T');
fragment U:('u'|'U');
fragment V:('v'|'V');
fragment W:('w'|'W');
fragment X:('x'|'X');
fragment Y:('y'|'Y');
fragment Z:('z'|'Z');


// fragments for: number, decimal number


fragment DIGIT : [0-9];



// templates //


// action

INCLUDE : I N C L U D E
    ;

EXCLUDE : E X C L U D E
    ;


//  

INDEFINITE_ARTICLE : A N?
    ;

// DEFINITE_ARTICLE : T H E?
//     ;



PRONOUN : (I T | T H E Y | S? H E)
    ;

HAVE_VERB : (H A D | H A S | H A V E)
    ;

WITH : W I T H
    ;

// WHERE : W H E R E
//     ;

// WHERE_WITH : (WHERE | WITH)
//     ;

THAT : T H A T
    ;

IS : I S
    ;

IS_NOT : (I S ' ' N O T | I S N '\'' T | I S N T)
    ;


// ? todo: exists, doesn't exist

// main entity

PERSON : P E R S O N
    ;

ORGANISATION : O R G A N I S A T I O N
    ;

PROPERTY : P R O P E R T Y
    ;




// linked entity -> todo: support wilccards?

HEALTHRECORD : H E A L T H ' ' R E C O R D
    ;




CLINICAL_CODE : C L I N I C A L ' ' C O D E
    ;

VALUE : V A L U E
    ;

DATE : (D A T E | S T A R T ' ' D A T E)
    ;




// // specialised token 

// BLOOD_PRESSURE : [1-400] '\\' [1-400]
//     ;


// basic tokens

OR : O R
    ;

AND : A N D
    ;

operator: (OR | AND)
    ;

NUMBER : DIGIT+
    ;
DECIMAL_NUMBER : DIGIT+ ('.' DIGIT+)?
    ;

WORD: [a-zA-Z]+
    ;

ALPHANUMERIC_WORD: [a-zA-Z0-9]+
    ;

WHITEPSPACE
   : ([\t\r\n\u000C] | ' ')+ -> skip
   ;



// parser //


// article : (INDEFINITE_ARTICLE | DEFINITE_ARTICLE)
//     ;


main_entity : (PERSON | ORGANISATION | PROPERTY)
    ;

linked_entity : (HEALTHRECORD | ALPHANUMERIC_WORD)
    ;

linked_entity_property : (CLINICAL_CODE | VALUE | DATE)
    ;



