import json
import os
import glob
import pprint
import http.client
import meilisearch
import mysql.connector


def updateDocumentsHTTP(index, filename, body):
    # client
    conn = http.client.HTTPSConnection('endpoint url here')
    headers = {
        'Authorization': 'Basic ' + os.environ.get("oss_auth_basictoken"),
        'Content-Type': 'application/json'
    }

    # Make request
    conn.request("POST", "/" + index + "/_bulk",
                 body, headers)

    # Output the response
    res = conn.getresponse()
    data = res.read()
    # writeFile("oss response " + filename, body)
    # print("HTTP Response:" + data.decode("utf-8"))
    print("doc indexed on Meilisearch server: " + filename)


# uploads all JSON documents in a folder.
def updateMeiliHTTPFromFolder(folderpath=None):
    # only process .JSON files in folder.
    for filename in glob.glob(os.path.join(folderpath, '*.json')):
        file = open(filename, encoding='utf-8', mode='r')
        documents = file.read()
        print("Updating file: " + filename)
        updateDocumentsHTTP(documents)
        file.close()
        print("Updated complete: " + filename)

# uploads indidivdual files


def updateMeiliHTTPFromFile(filepath=None):
    file = open(filepath, encoding='utf-8', mode='r')
    documents = file.read()
    print("Updating file: " + filepath)
    updateDocumentsHTTP(documents)
    file.close()
    print("Updated complete: " + filepath)


# Using Meilisearch module. Doesn't work for some reason due to error:
def updateMeiliUsingClientFromFolder(filepath=None):

    client = meilisearch.Client(
        '', '')

    # index name you want to update
    index = client.index('IM')

    # only process .JSON files in folder.
    for filename in glob.glob(os.path.join(filepath, '*.json')):
        file = open(filename, encoding='utf-8', mode='r')
        # documents = file.read()
        documents = [
            {'id': 1, 'title': 'Carol', 'genres': ['Romance', 'Drama']},
            {'id': 2, 'title': 'Wonder Woman',
                'genres': ['Action', 'Adventure']},
            {'id': 3, 'title': 'Life of Pi', 'genres': ['Adventure', 'Drama']},
            {'id': 4, 'title': 'Mad Max: Fury Road',
                'genres': ['Adventure', 'Science Fiction']},
            {'id': 5, 'title': 'Moana', 'genres': ['Fantasy', 'Action']},
            {'id': 6, 'title': 'Philadelphia', 'genres': ['Drama']},
        ]
        print("Updating file: " + filename)
        # print("Document content: " + filename)
        index.add_documents(documents)
        file.close()
        print("File updated: " + filename)


def updateMeiliUsingClientFromFile(filepath=None):

    client = meilisearch.Client(
        '', 'O')
    index = client.index('IM')

    file = open(filepath, encoding='utf-8', mode='r')
    documents = file.read()
    print("Updating file: " + filepath)
    index.add_documents(documents)
    file.close()
    print("File updated: " + filepath)


def updateOSSFromFolder(folderpath=None):
    # only process .JSON files in folder.
    for filename in glob.glob(os.path.join(folderpath, '*.json')):
        file = open(filename, encoding='utf-8', mode='r')
        documents_file = file.read()
        print("Updating file: " + filename)
        documents = json.loads(documents_file)
        request_body = ""
        for i in range(1000):
            request_body = request_body + \
                '{ "index": { "_index": "im-old", "_id": "' + \
                str(documents[i]["id"]) + '" } }' + '\n'
            documents[i].pop("id")
            request_body = request_body + json.dumps(documents[i]) + "\n"
        # print("Update initiated - request body: ", request_body)
        updateDocumentsHTTP(request_body)
        file.close()
        print("Updated complete: " + filename)


def writeFile(filename, content):
    with open("output/" + filename, "w", encoding="utf-8") as f:
        f.write(content)
        print("doc saved as file: " + filename)


if __name__ == '__main__':
    print('updating meilisearch has started')
    # updateOSSFromFolder("C:\\Users\\ahmed\\OneDrive\\Discovery\\Search\\Meilisearch\\information model files")

    print('update complete')
