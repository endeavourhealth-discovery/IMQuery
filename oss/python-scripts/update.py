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
                 body.encode('utf-8'), headers)

    # print("doc indexed on OpenSearch server: file " + filename)

    # Output the response
    res = conn.getresponse()
    data = res.read()
    try:
        data = json.loads(res.read())
        if data['errors']:
            writeFile(index, "error-response: " + filename + ".txt" , data)
            return False
        else:
            print("doc indexed on OpenSearch server: file " + filename)
            return True
    except:
        # updateDocumentsHTTP(index, filename, body)
        # return
        print("error in JSON parsing")
        writeFile(index, "error-response " + filename + ".txt", str(data)) 
        return False

    # print("HTTP Response:" + data.decode("utf-8"))


def updateOSSFromFolder(index, folderpath=None):
    # only process .JSON files in folder.
    for filename in glob.glob(os.path.join(folderpath, '*.txt')):
        file = open(filename, encoding='utf-8', mode='r')
        documents_file = file.read()
        print("Updating file: " + filename)
        # print(documents_file)
        # documents = json.loads(documents_file)
        # request_body = ""
        # for i in range(1000):
        #     request_body = request_body + \
        #         '{ "index": { "_index": "' + index + '", "_id": "' + \
        #         str(documents[i]["id"]) + '" } }' + '\n'
        #     documents[i].pop("id")
        #     request_body = request_body + json.dumps(documents[i]) + "\n"
        # print("Update initiated - request body: ", request_body)
        updateDocumentsHTTP(index, 'test', documents_file)
        file.close()
        print("Updated complete")


def updateOSSFromFile(index, filename):
    # upload single file 
    file = open(filename, encoding='utf-8', mode='r')
    documents_file = file.read()
    while updateDocumentsHTTP(index, "test", documents_file) == False:
        updateDocumentsHTTP(index, "test", documents_file)

def writeFile(outputFolderName, filename, content):

    # Check whether the specified path exists or not
    outputFolderPath = 'output-bulk/' + outputFolderName
    if not os.path.exists(outputFolderPath):
        # Create a new directory because it does not exist
        os.makedirs(outputFolderPath)

    with open(outputFolderPath + '/' + filename, "w", encoding="utf-8") as f:
        f.write(content)
        f.close()
        print("doc saved as: " + filename)


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
    processed_dbids = []

    while current_dbid <= total_rows:

        statement = """SELECT e.dbid, e.iri, e.name, e.description, e.code, et.type, typ.name, e.scheme, n.name, e.status, stt.name 
                    FROM entity e 
                    LEFT JOIN entity_type et ON et.entity = e.dbid 
                    LEFT JOIN entity typ ON typ.iri = et.type 
                    LEFT JOIN namespace n ON n.iri = e.scheme 
                    LEFT JOIN entity stt ON stt.iri = e.status 
                    WHERE e.dbid > """ + str(prev_dbid) + """ 
                    AND e.dbid < """ + str(current_dbid + 1)

        mycursor.execute(statement)
        results = mycursor.fetchall()  # fetches all the rows in a result set

        # convert results to .txt document containing JSON objects (for opensearch BULK api)
        documents = ""
        dbids_skip = []

        total_loop_count = 0

        for i in range(0, len(results)):

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

            # print(len(results))
            # print(current_index)
            # print(results[current_index + 1][0])
            # print(dbids_skip)

            # add multiple entityType objects to the same array 
            entityTypes = [{
                "@id": entityType,
                "name": entityTypeName
            }]
            current_index = i
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
            documents = str(documents) + str(searchDocJSON) + "\n"

            total_uploads += 1
            total_loop_count +=1
        
        # debugging any missing dbids
        # print(total_loop_count)
        # if total_loop_count < 1000:
            # print(total_loop_count)
            # print("total loop count less than 1000: " + str(prev_dbid + 1) + "-" + str(current_dbid))

        # write document to file
        filename = str(prev_dbid + 1) + "-" + str(current_dbid) + ".txt"
        if saveFile:
            writeFile(outputFolderName, "file " + filename, documents)

        # post document to server
        if updateServer:
            updateDocumentsHTTP(index, filename, documents)

        # increment current_dbid
        if current_dbid == max_dbid:
            print('update complete - total docs processed: ' + str(total_uploads))
            print('update complete - processed_dbids count : ' + str(len(processed_dbids)))
            break
        elif (current_dbid + increment > total_rows):
            prev_dbid = current_dbid
            current_dbid = max_dbid
        else:
            prev_dbid = current_dbid
            current_dbid += increment

    mysqldb.close()



if __name__ == '__main__':
    print('updating opensearch has started')
    index = "dev-im2"
    generateDocsFromMySQL(
        databaseName="im3",
        index=index,
        outputFolderName=index,
        total_rows=2659160,
        saveFile=False,
        updateServer=True)
    
    updateOSSFromFolder(index, "C:\\Users\\ahmed\\OneDrive\\Discovery\\IMQuery\\oss\\python-scripts\\output-bulk\\im")
    
    print('updating opensearch has finished')
    # updateOSSFromFile("dev-im2", "C:\\Users\\ahmed\\OneDrive\\Discovery\\IMQuery\\oss\\python-scripts\\output-bulk\\im\\file 1248001-1249000.txt")


 
