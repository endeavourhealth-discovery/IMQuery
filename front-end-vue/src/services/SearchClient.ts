const { MeiliSearch } = require('meilisearch')
const { v4 } = require('uuid');
import axios from "axios";


export default class SearchClient {

    //#todo: make env variables work instead of hardcoded public API Key
    //alternative to env variable
    static meili_api = "http://167.99.194.138"
    static meili_api_key_public = "68942f3e956f95db5b18963e1be76a78eb620dff0e6f56f4239be1b76c3e93af";
    static aws_lambda_prod_api = "https://e7lumrd1m5.execute-api.eu-west-2.amazonaws.com/prod";

    //#todo: create a proxy for autocomplete so you dont need to disclose the public key (this discloses all your documents potentially)
    static client = new MeiliSearch({
        host: SearchClient.meili_api,
        apiKey: SearchClient.meili_api_key_public,
    });


    public static async fetchAutocompleteSearch(searchString: string): Promise<any> {

        const _index = SearchClient.client.index('AutocompleteSearch');
        // #todo: change search from auto-relevancy to literal matching e.g. use `"${searchString}"`
        const _search = await _index
            .search(
                searchString,
                { attributesToHighlight: ['searchString'] }
            );
        return _search;
    }


    public static async fetchModulesData(): Promise<any> {

        const _index = SearchClient.client.index('Modules');
        // #todo: change search from auto-relevancy to literal matching e.g. use `"${searchString}"`
        const _search = await _index
            .search("");
        return _search;
    }


    public static async searchMeili(index: string, searchString: string): Promise<any> {
        const _index = SearchClient.client.index(index);
        // #todo: change search from auto-relevancy to literal matching e.g. use `"${searchString}"`
        const _search = await _index
            .search(
                searchString
            );
        return _search;
    }
    public static async searchMeiliFiltered(index: string, searchString: string): Promise<any> {
        const _index = SearchClient.client.index(index);
        // #todo: change search from auto-relevancy to literal matching e.g. use `"${searchString}"`
        const _search = await _index
            .search(
                searchString,
                {
                    'filter': "rdfsLabel = 'htn' OR synonyms='htn'"
                }
            );
        return _search;
    }



    public static async search(searchString: string): Promise<any> {

        // gives cors errors even though API returns correct header  Access-Control-Allow-Origin":"*"
        return axios.post(this.aws_lambda_prod_api + "/search",
            {
                q: searchString,
                showMetaData: true
            });

    }
}