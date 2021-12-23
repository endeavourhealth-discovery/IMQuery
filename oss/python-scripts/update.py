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
    print("doc indexed on OpenSearch server: " + filename)


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
    outputFolderPath = 'output-bulk/' + outputFolderName
    if not os.path.exists(outputFolderPath):
        # Create a new directory because it does not exist
        os.makedirs(outputFolderPath)

    with open(outputFolderPath + '/' + filename, "w", encoding="utf-8") as f:
        f.write(content)
        print("doc saved as file: " + filename)


def generateDocsFromMySQL(total_rows, saveFile, updateServer, databaseName, index, outputFolderName):
    # established connection between your database
    mysqldb = mysql.connector.connect(
        host=os.environ.get("mysql_url"),
        port=int(os.environ.get("mysql_port")),
        user=os.environ.get("mysql_username"),
        password=os.environ.get("mysql_password"),
        database=databaseName)

    mycursor = mysqldb.cursor()

    # try:
    max_dbid = total_rows
    increment = 1000
    prev_dbid = 0
    current_dbid = increment
    total_uploads = 0

    while current_dbid <= total_rows:

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

        # convert results to .txt document containing JSON objects (for opensearch BULK api)
        documents = ""
        dbids_skip = []

        for i in range(0, len(results) - 1):

            dbid = results[i][0]
            iri = results[i][1]
            name = results[i][2]
            description = results[i][3]
            code = results[i][4]
            entityType = results[i][5]
            entityTypeName = results[i][6]
            scheme = results[i][7]
            schemeName = results[i][8]
            status = results[i][9]
            statusName = results[i][10]

            # skips for loop if dbid is to be skipped (e.g. for multiple joins)
            if (dbid in dbids_skip):
                continue

            entityTypes = [{
                "@id": entityType,
                "name": entityTypeName
            }]

            current_index = i
            # print(len(results))
            # print(current_index)
            # print(results[current_index + 1][0])
            # print(dbids_skip)
            while current_index < len(results) -1:
                if results[current_index][0] == results[current_index + 1][0]:
                    entityTypes.append(
                        {
                            "@id": results[current_index + 1][5],
                            "name": results[current_index + 1][6]
                        }
                    )
                    dbids_skip.append(results[current_index + 1][0])
                    current_index += 1
                else:
                    break
                    # dbids_skip.append(current_index + 1)


            searchDoc = {
                "iri": iri,
                "name": name,
                "description": description,
                "code": code,
                "entityType": entityTypes,
                "scheme": {
                    "@id": scheme,
                    "name": schemeName
                },
                "status": {
                    "@id": status,
                    "name": statusName
                },
            }
            searchDocJSON = json.dumps(searchDoc)

            # opensearch operation
            documents = documents + \
                '{ "index": { "_index": "' + index + '", "_id": "' + \
                str(dbid) + '" } }' + '\n'
            # docuemnt
            documents = str(documents) + str(searchDoc) + "\n"

            total_uploads += 1

        # write document to file
        filename = str(prev_dbid + 1) + "-" + str(current_dbid) + ".txt"

        if saveFile:
            writeFile(outputFolderName, "file " + filename, documents)

        # post document to server
        if updateServer:
            updateDocumentsHTTP(index, filename, documents)

        # increment current_dbid
        if current_dbid == max_dbid:
            break
            print('update complete - total docs added: ' + total_uploads)
        elif (current_dbid + increment > total_rows):
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
    generateDocsFromMySQL(
        databaseName="im3",
        index="im-test2",
        outputFolderName="im-test2",
        total_rows=2659160,
        saveFile=True,
        updateServer=True)
