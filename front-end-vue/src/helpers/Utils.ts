import{ v4 } from "uuid";

export default class Utils {


  public static tokeniseStatement(statement: string): any {
    //remove fullstop and turn string into words 
    const _tokens = statement.substring(0, statement.length - 1).split(" ");
    const _formattedTokens: any[] = [];


    // _tokens.forEach((token: string) => {
    //   _formattedTokens.push({
    //     ...Utils.getTokenType(token)
    //   });
    // });


    for (let i = 0; i < _tokens.length; i++) {

          _formattedTokens.push(Utils.getTokenMeta(_tokens[i]));
    }


    //add the fullstop as a token
    _formattedTokens.push({
      id: "c118a1fa-915b-43f9-ba0d-9c2e36ade37c",
      value: ".",
      tokenType: "keyword",
      tokenSubtype: "terminator"
    });

    console.log(_formattedTokens);
    return _formattedTokens;


  }


  private static getTokenMeta(token: string): any {


    //assign/generate UUId, get type, get subtype of token
    switch (token) {
      case "Include":
        return {
          id: "1d078edb-c2c1-4621-9790-4bbe0002154b",
          value: token,
          tokenType: "keyword",
          tokenSubType: "primary"
        };
      case "Get":
        return {
          id: "eb4ddfe7-8479-4662-853b-b57914866e1c",
          value: token,
          tokenType: "keyword",
          tokenSubType: "primary"
        };
      case "from":
        return {
          id: "4efd47a1-0b07-4075-86e4-d6da101800b7",
          value: token,
          tokenType: "keyword",
          tokenSubType: "secondary"
        };
        case "for":
        return {
          id: "34e54435-1a4a-4739-b991-e1384d56af9b",
          value: token,
          tokenType: "keyword",
          tokenSubType: "secondary"
        };
      case "all":
        return {
          id: "1348a477-27a9-4133-9f49-cf40933ee76e",
          value: token,
          tokenType: "keyword",
          tokenSubType: "quantityModifier"
        };
      default:
        return {
          id: v4(),
          value: token,
          tokenType: "userString",
          tokenSubType: ""
        };
    };
  }

}



    // _tokens.forEach((token: string) => {
    //   _formattedTokens.push({
    //     ...Utils.getTokenType(token)
    //   });
    // });


       // for (let i = 0; i < _tokens.length; i++) {



      
    //   const _tokenMeta = Utils.getTokenType(_tokens[i]);
     
      
    //   if (_tokenMeta.tokenType == "userString" &&  i < _tokens.length -1) {
    //     let j = i;

    //     const _tokenMetaNextWord = Utils.getTokenType(_tokens[i + 1]);
          
    //   )

    //   _formattedTokens.push(_tokenMeta);
    // }



// formattedCode(): string {
//     let initialCode = this.code;

//     let _primaryPhraseIndices = {
//       for: this.getIndicesOf("for", initialCode, false),
//       include: this.getIndicesOf("include", initialCode, false),
//       exclude: this.getIndicesOf("exclude", initialCode, false),
//       use: this.getIndicesOf("use", initialCode, false),
//       define: this.getIndicesOf("define", initialCode, false),
//     };

//     console.log("primary_phrase is:", _primaryPhraseIndices);

//     return initialCode;
//   },
//   getIndicesOf(
//     targetStr: string,
//     str: string,
//     caseSensitive: boolean,
//     startIndex = 0
//   ) {
//     var targetStrLen = targetStr.length;
//     if (targetStrLen == 0) {
//       return [];
//     }
//     var _startIndex = startIndex,
//       index,
//       indices = [];
//     if (!caseSensitive) {
//       str = str.toLowerCase();
//       targetStr = targetStr.toLowerCase();
//     }
//     while ((index = str.indexOf(targetStr, _startIndex)) > -1) {
//       indices.push(index);
//       _startIndex = index + targetStrLen;
//     }
//     return indices;
//   },



