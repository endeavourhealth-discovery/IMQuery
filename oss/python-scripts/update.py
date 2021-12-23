import json
import os
import glob
import http.client
import mysql.connector


def updateDocumentsHTTP(index, filename, body):
    # client
    conn = http.client.HTTPSConnection(os.environ.get("oss_url"))
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
    print("doc indexed on  OpenSearch server: " + filename)


def updateOSSFromFolder(folderpath=None, index="im-test1"):
    # only process .JSON files in folder.
    for filename in glob.glob(os.path.join(folderpath, '*.json')):
        file = open(filename, encoding='utf-8', mode='r')
        documents_file = file.read()
        print("Updating file: " + filename)
        documents = json.loads(documents_file)
        request_body = ""
        for i in range(1000):
            request_body = request_body + \
                '{ "index": { "_index": "' + index + '", "_id": "' + \
                str(documents[i]["id"]) + '" } }' + '\n'
            documents[i].pop("id")
            request_body = request_body + json.dumps(documents[i]) + "\n"
        # print("Update initiated - request body: ", request_body)
        updateDocumentsHTTP(request_body)
        file.close()
        print("Updated complete: " + filename)


def writeFile(outputFolderName, filename, content):


    # Check whether the specified path exists or not
    outputFolderPath = 'output-json/' + outputFolderName
    if not os.path.exists(outputFolderPath):
        # Create a new directory because it does not exist 
        os.makedirs(outputFolderPath)

    with open(outputFolderPath + '/' + filename, "w", encoding="utf-8") as f:
        f.write(content)
        print("doc saved as file: " + filename)


def generateDocsFromMySQL(total_rows, saveFile, updateServer, databaseName, index, outputFolderName):
    # established connection between your database
    mysqldb = mysql.connector.connect(
        host=os.environ.get("mysql_url"), port=int(os.environ.get("mysql_port")), user=os.environ.get("mysql_username"), password=os.environ.get("mysql_password"), database=databaseName)

    mycursor = mysqldb.cursor()

    #try:

    max_dbid = total_rows
    increment = 1000
    prev_dbid = 0
    current_dbid = increment

    while current_dbid <= total_rows:

        if current_dbid == max_dbid:
            break

        statement = """SELECT e.dbid, e.iri, e.name, e.description, e.code, et.type, typ.name, e.scheme, n.name, e.status, stt.name 
                    FROM entity e 
                    JOIN entity_type et ON et.entity = e.dbid 
                    LEFT JOIN entity typ ON typ.iri = et.type 
                    JOIN namespace n ON n.iri = e.scheme 
                    LEFT JOIN entity stt ON stt.iri = e.status 
                    WHERE e.dbid <= """ + str(current_dbid) + """
                    AND e.dbid > """ + str(prev_dbid)

        mycursor.execute(statement)
        results = mycursor.fetchall()  # fetches all the rows in a result set

        # print(results)
        # print(len(results))

        # convert results to .txt document containing JSON objects (for opensearch BULK api)
        documents = ""
        dbids = []

        for i in results:
            dbid = i[0]
            iri = i[1]
            name = i[2]
            description = i[3]
            code = i[4]
            entityType = i[5]
            entityTypeName = i[6]
            scheme = i[7]
            schemeName = i[8]
            status = i[9]
            statusName = i[10]

            # avoids duplicates
            if (dbid not in dbids):
                dbids.append(dbid)

                searchDoc = json.dumps({
                    "iri": iri,
                    "name": name,
                    "description": description,
                    "code": code,
                    "entityType": entityType,
                    "entityTypeName": entityTypeName,
                    "scheme": scheme,
                    "schemeName": schemeName,
                    "status": status,
                    "statusName": statusName
                })

                # opensearch operation
                documents = documents + \
                    '{ "index": { "_index": "' + index + '", "_id": "' + \
                    str(dbid) + '" } }' + '\n'
                # docuemnt
                documents = str(documents) + str(searchDoc) + "\n"

        # write document to file
        filename = str(prev_dbid) + "-" + str(current_dbid) + ".txt"

        if saveFile:
            writeFile(outputFolderName, "file " + filename, documents)

        # post document to server
        if updateServer:
            updateDocumentsHTTP(index, filename, documents)

        # increment current_dbid
        if (current_dbid + increment > total_rows):
            prev_dbid = current_dbid
            current_dbid = max_dbid
        else:
            prev_dbid = current_dbid
            current_dbid += increment
    
    mysqldb.close()

    # except:
    #     print('Error: Unable to fetch data.')
    # finally:
    #     mysqldb.close()


if __name__ == '__main__':
    print('updating opensearch has started')
    generateDocsFromMySQL(databaseName="im3", index="im-test1", outputFolderName="im-test1", total_rows=2659160, saveFile=True, updateServer=True)
    print('update complete')


    # update OSS from folder
    # updateOSSFromFolder("C:\\Users\\ahmed\\OneDrive\\Discovery\\Search\\information model files", "im-test1")

    # update Meili
    # updateMeiliHTTPFromFile("C:\\Users\\ahmed\\OneDrive\\Discovery\\Search\\Meilisearch\\information model files\OrgDat1.json")
