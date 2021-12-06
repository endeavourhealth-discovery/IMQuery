const { MeiliSearch } = require('meilisearch')
const { v4 } = require('uuid');


//initialise Meilisearch Instance
const _meili_api = process.env.meili_api;
const _meili_api_key_public = process.env.meili_api_key_public;
const _client = new MeiliSearch({
  host: _meili_api,
  apiKey: _meili_api_key_public,
});


//information that is fetched only once
let _modulesData: any;
let _dataModelData: any;
let _tasksData: any;


/**
 * Search Function 
 * @name search
 * @param {any} request_body The body of the Request accepts a JSON document with keys such as "q" = Search String. 
 * @returns {any} Returns search results in ranked order ready for consumption / iteration in the UI.
 **/
exports.handler = async (event: any): Promise<any> => {


  //Response Templates  
  let _responseHeaders = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  };

  let _errorResponse = {
    statusCode: 400,
    headers: _responseHeaders,
    body: `No search string was entered. Please use this JSON document in your request body {"q"="Your question"}`
  };
  let _response = {
    statusCode: 200,
    headers: _responseHeaders,
    body: ""
  };



  //fetches modules (tasks included) for Meilisearch once (e.g. modules, tasks, icons)
  if (!_modulesData) {
    _modulesData = await _client.index('Modules').search("");
  }

  //fetches datamodel once
  if (!_dataModelData) {
    _dataModelData = await _client.index('DataModel').search("");
  }

  //fetches tasks once
  if (!_tasksData) {
    _tasksData = await _client.index('Tasks').search("");
  }


  //get the search string or else return error response 
  let _searchString;
  if (event.body && event.body != "") { //optional: && JSON.parse(event.body) && JSON.parse(event.body) != ""
    _searchString = JSON.parse(event.body).q;
    if (!_searchString || _searchString == "") {
      return _errorResponse;
    }
  } else {
    return _errorResponse;
  }



  const _searchTerms = findSearchTerms(_searchString);   //transform searchstring into array of phrases consisting of 1,2 or 3 words e.g. blood vs blood pressure vs systolic blood pressure
  const _matchedEntities: any[] = []; //searchwords matched against IM entity (e.g. concept / DM concept / Concept Set)
  let _allEntities: any[] = [];
  let _uniqueEntities: any[] = [];
  let _uniqueEntitiesCounted: any[] = [];
  let _entityIris: any[] = [];
  let _dataModelIris: any[] = [];
  let _rdfTypeIris: any[] = [];


  // search result templates based on _matchedResultTemplates and _imEntityData
  const _interpolatedResultTemplates: any[] = [];


  //matches each word against an IM entity using Meilisearchindexes/IMSearch
  //#todo: instead of iterating over every word - perform 1 search for the entire searchString. This is more eficient and stop words become effective (so you don't get silly matches e.g. "a" = "asthma" / "atrial fibrilliation")
  await Promise.all(_searchTerms.map(async (subString: any) => {
    await _client.index('IMSearch')
      .search(
        "",
        {
          'filter': `rdfsLabel = '${subString}' OR synonyms='${subString}'`
      }
      ).then((res: any) => {
        // _matchedEntities.push(res);
        _matchedEntities.push({ searchSubString: subString, entities: res.hits, entitiesCount: res.nbHits });
      })
      .catch((err: any) => {
        _errorResponse.statusCode = 503;
        _errorResponse.body = JSON.stringify("aws_lambda -> Could not fetch data from Meilisearch IMSearch index" + err)
        return _errorResponse;
      })
  }));



  //extract all IRIs, datamodel IRIs and rdf:types to match against search patterns (aka result templates) 
  if (_matchedEntities && _matchedEntities.length > 0) {
    _matchedEntities.forEach((matchedEntity: any) => {
      matchedEntity.entities.forEach((entity: any) => {

        //extract Iris into array 
        _allEntities.push({ iri: entity.iri, rdfsLabel: entity["rdfsLabel"], matchedDataModelIris: entity["matchedDataModelIris"] });
        _entityIris.push(entity.iri);

        //extract datamodel IRis  into array
        entity.matchedDataModelIris.forEach((iri: any) => {
          _allEntities.push({ iri: iri, rdfsLabel: entity["rdfsLabel"] });
          _dataModelIris.push(iri);
        });

        //extract rdf:types into array
        entity["rdf:type"].forEach((type: any) => {
          _allEntities.push({ iri: type, rdfsLabel: entity["rdfsLabel"] });
          _rdfTypeIris.push(type);
        });


      });
    });
  }

  //remove duplicate Iris in each category (in preparation for Meilisearch)
  _entityIris = _entityIris.filter(onlyUnique);
  _dataModelIris = _dataModelIris.filter(onlyUnique);
  _rdfTypeIris = _rdfTypeIris.filter(onlyUnique);



  // filter out objects that have duplicate keys into _uniqueEntities array
  _uniqueEntities = _allEntities;
  for (let i = 0; i < _uniqueEntities.length; i++) {
    for (let j = 0; j < _uniqueEntities.length; j++) {
      if (i != j && areObjectsEqual(_uniqueEntities[i], _uniqueEntities[j])) {
        _uniqueEntities.splice(i, 1);
      }
    }
  }


  //count instances of each Iri in the search string prepare for string interpolation (label x count = natural language)
  _uniqueEntitiesCounted = _uniqueEntities.map((uniqueEntity: any) => {
    return {
      iri: uniqueEntity.iri,
      rdfsLabel: uniqueEntity.rdfsLabel,
      matchedDataModelIris:  uniqueEntity.matchedDataModelIris,
      count: countOccurrences(_allEntities, uniqueEntity),
      naturalLanguageText: ""
    }
  });




  //find only relevant ResultTemplates (not all). Find a balance between pre-filter and validation
  let _allEntitiesUniqueIris = _allEntities.map((entity: any) => entity.iri).filter(onlyUnique);
  let _filterString = _dataModelIris.map((iri: any) => `requiredDataModelIris = '${iri}'`).join(" OR ")
  const _resultTemplates = await _client.index("ResultTemplates")
    .search("",
    {
      'filter': _filterString
  });
  //#todo: filter  search by Module/Task (Data.createDataset) after you add ResultTemplates for other modules to the same index
  //#todo: expand _filterString for iri and rdftype




  //template validation using doesArrayContainAllItemsFrom
  //the first  ResultTemplate that is valid is usually also the most relevant (and hence appeared first in the array)
  let _validTemplates: any[] = [];
  if (_resultTemplates && _resultTemplates.nbHits > 0) {
    _validTemplates = _resultTemplates.hits.filter((resultTemplate: any) => {
      // console.log("checking items", SearchClient.checkRequiredEntityIris(resultTemplate.requiredEntityIris, _imEntityDataModelIris));
      return doesArrayContainAllItemsFrom(_dataModelIris, resultTemplate.requiredDataModelIris)
    });
  } else {
    _errorResponse.body = JSON.stringify("No matching new datasets could be generated");
    return _errorResponse;
  }
  // _validTemplates.splice(0, 1); //select only the one most relevant result

  //interpolate eligible templates with natural language (rdf label and count)
  // for each word -> interpolate 
  const _interpolatedTemplates: any[] = _validTemplates.slice();
  _interpolatedTemplates.map((template: any) => {
    template.label = template.labelTemplate;
    template.labelDataModelIris.forEach((labelDataModelIri: any) => {

      
      template.label = template.label.replace(`{${labelDataModelIri}}`, createPhrase(labelDataModelIri, _uniqueEntitiesCounted));
      // console.log("{${labelIri}}: ", `{${labelIri}}`);
      // console.log(" template.label", template.label);
      // console.log("{${labelIri}}: ", `{${labelIri}}`);
    })
  });
  //return search results as array of  template + module + task
  const _searchResults: any[] = [];
  _interpolatedTemplates.forEach((template: any) => {
    _searchResults.push({
      module: {
        id: "Data",
        label: "Data",
      },
      task: {
        id: "createDataset",
        label: "Create New Dataset",
        shortLabel: "Create",
      },
      icon: {
        collection: "hero",
        name: "table",
      },
      title: template.label,
      description: "Extract Data from Health Records into your custom dataset", //description for _modulesData.hits. array [moduleid][task][rdfs:comment]
      url: `https://im.endeavourhealth.net/#/search?module=${template.moduleId}&?task=${template.taskId}`
    });
  });

  //module [moduleId, rdfsLabel], [task -> taskId, rdfsLabel, shortLabel], logoId [table_default], title, description,    
  //




  //preparing response
  const _uuid = v4().replace(/-/g, ""); //uuid without hyphens

  //check if metadata is requested
  let isMetaDataRequested = false;
  //if metadata is desired, add it to the response
  if (event.body && event.body != "") {
    isMetaDataRequested = (JSON.parse(event.body).showMetaData ? true : false);

  }


  //metadata to debug the algoritm (it is returned in the response if the request body contains "showMetaData": true)
  let _metaData = {
    searchString: _searchString,
    input: event,
    modulesData: _modulesData,
    dataModelData: _dataModelData,
    tasksData: _tasksData,
    matchedEntities: _matchedEntities,
    allEntities: _allEntities,
    entityIris: _entityIris,
    dataModelIris: _dataModelIris,
    rdfTypeIris: _rdfTypeIris,
    uniqueEntitiesCounted: _uniqueEntitiesCounted,
    resultTemplates: _resultTemplates,
    validTemplates: _validTemplates,
    allIris: _allEntitiesUniqueIris,
    interpolatedTemplates: _interpolatedTemplates
  };


  const _responseBody = {
    id: _uuid,
    resourceType: "im:SearchResult",
    searchString: _searchString,
    searchResults: _searchResults ? _searchResults : "",
    metaData: isMetaDataRequested ? _metaData : ""
  }
  _response.body = JSON.stringify(_responseBody);
  return _response;
};




////////////////////////// helper functions //////////////////////////


function findSearchTerms(searchString: string): any {
  return searchString.split(" ");
  // let _words = searchString.split(" ");
}


//
/**
* A callback function for Array.filter(). Checks to see if sourceArray contains every item of comparatorArray to validate result templates (i.e. see if the required Iris are present are part of the query) 
* @name doesArrayContainAllItemsFrom 
* @returns {boolean} Returns true if every item in comparatorArray exists in sourceArray
**/
function doesArrayContainAllItemsFrom(sourceArray: any, comparatorArray: any): boolean {
  return comparatorArray.every((item: any) => sourceArray.includes(item));
}


/**
* A callback function for Array.filter() that filters out duplicate items in an array e.g. use as Array.filter(onlyUnique);
* @name onlyUnique
**/
function onlyUnique(element: any, index: any, array: any): boolean {
  return array.indexOf(element) === index;
}


/**
* Count the number of occurences of an item in an array. 
* @name countOccurrences
* @param {any} array The array to count items from
* @param {any} value  The value of the item to count
* @returns {number} Returns the total count (sum) as an integer.
**/
function countOccurrences(array: any, value: any): number {
  return array.reduce((a: any, v: any) => (v === value ? a + 1 : a), 0);
}



/**
 * Performs a shallow comparison of two JS objects to determine if they're equal (i.e. have the same name / number of keys)
 * @name areObjectsEqual
 * @param {any} object1 The first object to compare against the second object.
 * @param {any} object2 The second object to compare against the first object.
 * @returns {boolean} Returns true if Object 1 and Object 2 are equal
 **/
function areObjectsEqual(object1: any, object2: any): boolean {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  //check if number of keys are equal
  if (keys1.length !== keys2.length) {
    return false;
  }

  //checks if each key from each object matches every key on the other object
  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
}




// Not currently used. Original Resource: https://stackoverflow.com/questions/1408289/how-can-i-do-string-interpolation-in-javascript
/**
 * Interpolates text inside templates enclosed by {{moustaches}} based on key-value pairs in the values paramter. E.g. use as interpolate("text example {condition}", {condition: "Diabetes", subject: "Patient"})
 * @name areObjectsEqual
 * @param {string} templateString The string to interpolate.
 * @param {any} values The values to interpolate the string with. 
 **/
function interpolate(templateString: string, values: any) {
  return function interpolate(values: any) {
    return templateString.replace(/{([^{}]*)}/g, (a: any, b: any) => {
      const r = values[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
  }
}



/**
 * hanges rdf Labels into phrases e.g. Patient with [Asthma] vs Patient with [Asthma and Diabetes] vs Patient with [Asthma, Diabetes and Heart Failure]
 * @name createPhrase
 * @param {string} iri The iri of the entity you want to convert to natural language
 * @param {any} entitiesCounted  The metadata to create natural language. Must be a JS object with "iri" and "rdfsLabel" as root keys.
 * @returns {string} Returns a phrase such as [x], [y] and [z] wit the the "," and "and" added depending on the frequency of their occurence.
 **/
function createPhrase(dataModelIri: string, metaData: any): string {
  let _matchingEntities = metaData.filter((item: any) =>  item.matchedDataModelIris && item.matchedDataModelIris.includes(dataModelIri));
  let _count = _matchingEntities.length;

  if (_count == 1) {
    return _matchingEntities[0].rdfsLabel;
  } else if (_count == 2) {
    return `${_matchingEntities[0].rdfsLabel} and ${_matchingEntities[1].rdfsLabel}`;
  } else if (_count > 2) {

    let _phraseArray: any[] = [];
    for (let i = 0; i < _count - 1; i++) {
      _phraseArray.push(_matchingEntities[i].rdfsLabel);
    }
    return `${_phraseArray.join(", ")} and ${_matchingEntities[_count - 1].rdfsLabel}`;
  } else {
    return "";
  }
}