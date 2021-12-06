## AWS Lambda Function

Bundle.zip contains the all the contents of this folder.
Upload it to AWS Lambda in the Console. Then make it available via API Gateway.



## Upload to AWS Lambda Programmatically

Compile javascript as typescript

```
cd aws_lambda
npm install

```

compile typescript
zip entire folder's contents (NOT THE FOLDER ITSELF) as "bundle.zip"
upload to AWS lambda

e.g. in powershell 

Compile TS + Bundle into zip file + Upload zipfile to AWS 
```
npm run compile
$path = "./"
$exclude = @("*.zip", "src", "snippets")
$files = Get-ChildItem -Path $path -Exclude $exclude
Compress-Archive -Force -Path $files bundle.zip
aws lambda update-function-code --function-name search --zip-file fileb://bundle.zip

```


## Invoke AWS Function Locally

Put your search term in event.json

```
sam local invoke "Search" -e event.json
```

## Setup AWS CLI

Install Amazon CLI 

```
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi              

```

Check if AWS CLI is correctly installed
```
aws --version
```

If "aws" is not recognised: add aws as an environment variable. See: https://docs.aws.amazon.com/cli/latest/userguide/install-windows.html#awscli-install-windows-path

install packages
''' 
npm install typescript --save-dev
''' 

configure AWS with access KEY ID + KEY
```
aws configure
```



## Usage

See Postman Collection 

https://go.postman.co/workspace/My-Workspace~9c2dfe5e-14e3-47e0-8c06-064f7e4f217a/collection/11955466-e7b455b6-c776-4c0d-8867-7a1d57db9b5e
