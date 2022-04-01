"use strict";
const { MeiliSearch } = require('meilisearch');
import { v4 } from "uuid";
const _meili_api = process.env.meili_api;
const _meili_api_key_public = process.env.meili_api_key_public;
const _client = new MeiliSearch({
    host: _meili_api,
    apiKey: _meili_api_key_public,
});
let _modulesData;
let _dataModelData;
let _tasksData;
exports.handler = async (event) => {
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
    if (!_modulesData) {
        _modulesData = await _client.index('Modules').search("");
    }
    if (!_dataModelData) {
        _dataModelData = await _client.index('DataModel').search("");
    }
    if (!_tasksData) {
        _tasksData = await _client.index('Tasks').search("");
    }
    let _searchString;
    if (event.body && event.body != "") {
        _searchString = JSON.parse(event.body).q;
        if (!_searchString || _searchString == "") {
            return _errorResponse;
        }
    }
    else {
        return _errorResponse;
    }
    const _searchTerms = findSearchTerms(_searchString);
    const _matchedEntities = [];
    let _allEntities = [];
    let _uniqueEntities = [];
    let _uniqueEntitiesCounted = [];
    let _entityIris = [];
    let _dataModelIris = [];
    let _rdfTypeIris = [];
    const _interpolatedResultTemplates = [];
    await Promise.all(_searchTerms.map(async (subString) => {
        await _client.index('IMSearch')
            .search("", {
            'filter': `rdfsLabel = '${subString}' OR synonyms='${subString}'`
        }).then((res) => {
            _matchedEntities.push({ searchSubString: subString, entities: res.hits, entitiesCount: res.nbHits });
        })
            .catch((err) => {
            _errorResponse.statusCode = 503;
            _errorResponse.body = JSON.stringify("aws_lambda -> Could not fetch data from Meilisearch IMSearch index" + err);
            return _errorResponse;
        });
    }));
    if (_matchedEntities && _matchedEntities.length > 0) {
        _matchedEntities.forEach((matchedEntity) => {
            matchedEntity.entities.forEach((entity) => {
                _allEntities.push({ iri: entity.iri, rdfsLabel: entity["rdfsLabel"], matchedDataModelIris: entity["matchedDataModelIris"] });
                _entityIris.push(entity.iri);
                entity.matchedDataModelIris.forEach((iri) => {
                    _allEntities.push({ iri: iri, rdfsLabel: entity["rdfsLabel"] });
                    _dataModelIris.push(iri);
                });
                entity["rdf:type"].forEach((type) => {
                    _allEntities.push({ iri: type, rdfsLabel: entity["rdfsLabel"] });
                    _rdfTypeIris.push(type);
                });
            });
        });
    }
    _entityIris = _entityIris.filter(onlyUnique);
    _dataModelIris = _dataModelIris.filter(onlyUnique);
    _rdfTypeIris = _rdfTypeIris.filter(onlyUnique);
    _uniqueEntities = _allEntities;
    for (let i = 0; i < _uniqueEntities.length; i++) {
        for (let j = 0; j < _uniqueEntities.length; j++) {
            if (i != j && areObjectsEqual(_uniqueEntities[i], _uniqueEntities[j])) {
                _uniqueEntities.splice(i, 1);
            }
        }
    }
    _uniqueEntitiesCounted = _uniqueEntities.map((uniqueEntity) => {
        return {
            iri: uniqueEntity.iri,
            rdfsLabel: uniqueEntity.rdfsLabel,
            matchedDataModelIris: uniqueEntity.matchedDataModelIris,
            count: countOccurrences(_allEntities, uniqueEntity),
            naturalLanguageText: ""
        };
    });
    let _allEntitiesUniqueIris = _allEntities.map((entity) => entity.iri).filter(onlyUnique);
    let _filterString = _dataModelIris.map((iri) => `requiredDataModelIris = '${iri}'`).join(" OR ");
    const _resultTemplates = await _client.index("ResultTemplates")
        .search("", {
        'filter': _filterString
    });
    let _validTemplates = [];
    if (_resultTemplates && _resultTemplates.nbHits > 0) {
        _validTemplates = _resultTemplates.hits.filter((resultTemplate) => {
            return doesArrayContainAllItemsFrom(_dataModelIris, resultTemplate.requiredDataModelIris);
        });
    }
    else {
        _errorResponse.body = JSON.stringify("No matching new datasets could be generated");
        return _errorResponse;
    }
    const _interpolatedTemplates = _validTemplates.slice();
    _interpolatedTemplates.map((template) => {
        template.label = template.labelTemplate;
        template.labelDataModelIris.forEach((labelDataModelIri) => {
            template.label = template.label.replace(`{${labelDataModelIri}}`, createPhrase(labelDataModelIri, _uniqueEntitiesCounted));
        });
    });
    const _searchResults = [];
    _interpolatedTemplates.forEach((template) => {
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
            description: "Extract Data from Health Records into your custom dataset",
            url: `https://im.endeavourhealth.net/#/search?module=${template.moduleId}&?task=${template.taskId}`
        });
    });
    const _uuid = v4().replace(/-/g, "");
    let isMetaDataRequested = false;
    if (event.body && event.body != "") {
        isMetaDataRequested = (JSON.parse(event.body).showMetaData ? true : false);
    }
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
    };
    _response.body = JSON.stringify(_responseBody);
    return _response;
};
function findSearchTerms(searchString) {
    return searchString.split(" ");
}
function doesArrayContainAllItemsFrom(sourceArray, comparatorArray) {
    return comparatorArray.every((item) => sourceArray.includes(item));
}
function onlyUnique(element, index, array) {
    return array.indexOf(element) === index;
}
function countOccurrences(array, value) {
    return array.reduce((a, v) => (v === value ? a + 1 : a), 0);
}
function areObjectsEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }
    return true;
}
function interpolate(templateString, values) {
    return function interpolate(values) {
        return templateString.replace(/{([^{}]*)}/g, (a, b) => {
            const r = values[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    };
}
function createPhrase(dataModelIri, metaData) {
    let _matchingEntities = metaData.filter((item) => item.matchedDataModelIris && item.matchedDataModelIris.includes(dataModelIri));
    let _count = _matchingEntities.length;
    if (_count == 1) {
        return _matchingEntities[0].rdfsLabel;
    }
    else if (_count == 2) {
        return `${_matchingEntities[0].rdfsLabel} and ${_matchingEntities[1].rdfsLabel}`;
    }
    else if (_count > 2) {
        let _phraseArray = [];
        for (let i = 0; i < _count - 1; i++) {
            _phraseArray.push(_matchingEntities[i].rdfsLabel);
        }
        return `${_phraseArray.join(", ")} and ${_matchingEntities[_count - 1].rdfsLabel}`;
    }
    else {
        return "";
    }
}
//# sourceMappingURL=index.js.map