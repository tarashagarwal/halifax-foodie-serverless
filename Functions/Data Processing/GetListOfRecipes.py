import boto3
import json

from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    # TODO implement
    
    dynamodb = boto3.resource('dynamodb', 'us-east-1')
    table = dynamodb.Table('Recipe')
    body = json.loads(event['body']) 
    email = body.get('email')
    
    #Author(s) name: Fernandomc
    #Date: 28 November 2022
    #Title of program/source code: Ten Examples of Getting Data from DynamoDB with Python and Boto3
    #Code version: v1
    #Type: Code
    #Web address: https://www.fernandomc.com/posts/ten-examples-of-getting-data-from-dynamodb-with-python-and-boto3/
    response = table.scan(
        FilterExpression=Attr('restaurantName').eq(email)
    )

    items = response['Items']
    
    recipeName = []
    for i in items:
        recipeName.append(i)
    print(recipeName)
    
    
    return {
        'statusCode': 200,
        'body': json.dumps(recipeName)
    }
