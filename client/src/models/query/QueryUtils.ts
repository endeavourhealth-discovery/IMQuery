import jsonpath from "jsonpath";
import prettier from "prettier/standalone";
import prettierBabylon from "prettier/parser-babylon";

export default class QueryUtils {

    // https://stackoverflow.com/questions/15502629/regex-for-mustache-style-double-braces
    public static findPlaceholders(text: string): any {

        // eslint-disable-next-line
        const _regExPlaceholders = /{{\s*[\S\.]+\s*}}/g;
        // eslint-disable-next-line
        const _regExPlaceholderIri = /[\w+\:\w]+/;


        return text.match(_regExPlaceholders)
            .map(function (x) { return x.match(_regExPlaceholderIri)[0]; });
    }


    public static toIri(url: string) {

        const _arr = url.split("/")
        const _iri = _arr[_arr.length - 1].replace("#", ":");
        return _iri;


    }

    public static toUrl(iri: string) {

        const _context = {
            rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            im: "http://endhealth.info/im#",
            imq: "http://endhealth.info/imq#",
            bc: "http://endhealth.info/bc#",
            rdfs: "http://www.w3.org/2000/01/rdf-schema#",
            emis: "http://endhealth.info/emis#",
            sn: "http://snomed.info/sct#",
            ods: "http://endhealth.info/ods#",
            owl: "http://www.w3.org/2002/07/owl#",
            prov: "http://www.w3.org/ns/prov#",
            tpp: "http://endhealth.info/tpp#",
            xml: "http://www.w3.org/XML/1998/namespace#",
            sh: "http://www.w3.org/ns/shacl#",
            opcs4: "http://endhealth.info/opcs4#",
            vis: "http://endhealth.info/vision#",
            orole: "https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#",
            xsd: "http://www.w3.org/2001/XMLSchema#"
        }

        const _iri = iri.replace(":", "#");
        const _contextKey = _iri.split("#")[0];
        const _iriKey = _iri.split("#")[1];
        const _url = _context[_contextKey] + _iriKey;

        return _url;

    }






    // prettify JSON
    public static prettifyJSON(value: string): string {
        const _json = prettier.format(value, {
            parser: "json",
            plugins: [prettierBabylon],
        }) as string;
        return _json;

    }

    //replaces all ":"" and "@" with __ and ___ respectively to enable JMESPath and JsonPath tools
    public static replaceKeys(object: any): any {

        // deep nested replacement of keys if they are string
        const replaceKeysDeep = (o: any) => {
            return _.transform(o, function (result: any, value: any, key: any) {
                const _currentKey = typeof (key) == "string" ? QueryUtils.replaceChars(key) : key;
                result[_currentKey] = _.isObject(value) ? replaceKeysDeep(value) : value; // if the key is an object run it through the inner function - replaceKeys
            });
        }
        return replaceKeysDeep(object);
    }


    //characters and their replacements
    private static _characterMap: any = {
        ':': "__c__",
        '@': "__a__",
    };


    //replaces all keys in an object using  key-value pairs in character map
    public static replaceChars = (text: string) => {
        let _text = text;
        Object.keys(QueryUtils._characterMap).forEach((key: string) => {
            _text = _text.replaceAll(key, QueryUtils._characterMap[key])
        });
        return _text;
    };

    // adds random uuid only used in frontend to provide a :key for v-for iterators in UI components  
    private addUUID(array: any): any {
        return array.map((item: any) => {
            return {
                'temp_id': `urn:uuid${v4()}`,
                'item': item
            }
        })
    }



    //flattens a JS object to its constituent paths (lodash compatible)
    public static flattenObject(object: any): any {

        const result = {} as any;
        function recurse(cur: any, prop: any) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                // for (var i = 0, l = cur.length; i < l; i++)
                for (let i = 0; i < cur.length; i++)
                    recurse(cur[i], prop + "[" + i + "]");
                // if (l == 0)
                if (cur.length == 0)
                    result[prop] = [];
            } else {
                let isEmpty = true;
                for (const p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop + "." + p : p);
                }
                if (isEmpty && prop)
                    result[prop] = {};
            }
        }
        recurse(object, "");
        console.log("flattened result", result)
        return result;
    }

    //unflattens JS object
    // public static unflattenObject(object: any): any {
    //     if (Object(object) !== object || Array.isArray(object))
    //         return object;
    //     var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    //         resultholder = {} as any;
    //     for (var p in object) {
    //         var cur = resultholder as any,
    //             prop = "",
    //             m;
    //         while (m = regex.exec(p)) {
    //             cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
    //             prop = m[2] || m[1];
    //         }
    //         cur[prop] = object[p];
    //     }
    //     return resultholder[""] || resultholder;
    // }


}

