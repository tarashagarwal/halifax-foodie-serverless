import boto3
import json

def lambda_handler(event, context):
    
    dynamodb = boto3.resource('dynamodb', 'us-east-1')
    table = dynamodb.Table('UserDetails')
    
    body = json.loads(event['body']) 
    email = body.get('email')
    
    #Author(s) name: Boto3 Docs
    #Date: 28 November 2022
    #Title of program/source code: 1.26.22 Documentations
    #Code version: v1
    #Type: Code
    #Web address: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Table.get_item 
    response = table.get_item(
        Key={
            'email': email
        }
    )
    rep=""
    result = {}
    if 'Item' in response:
        rep = "true"
        return {
        'statusCode': 200,
        'body': json.dumps(rep)
        
    }
    else:
        rep = "false"
        return {
        'statusCode': 200,
        'body': json.dumps(rep)
        
    }
