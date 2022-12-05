import json
import boto3
from boto3.dynamodb.conditions import Attr


def lambda_handler(event, context):
    print(event)
    body = json.loads(event['body']) 
    recipeid = body.get('recipeid')
    dynamodb = boto3.resource('dynamodb', 'us-east-1')
    table = dynamodb.Table('Recipe')
    
    #Author(s) name: Fernandomc
    #Date: 28 November 2022
    #Title of program/source code: Ten Examples of Getting Data from DynamoDB with Python and Boto3
    #Code version: v1
    #Type: Code
    #Web address: https://www.fernandomc.com/posts/ten-examples-of-getting-data-from-dynamodb-with-python-and-boto3/
   
    response = table.scan(
        FilterExpression=Attr('recipeid').eq(recipeid)
    )
    
    recipe = response['Items'][0]['recipe']
    
    text = recipe
    comprehend = boto3.client(service_name='comprehend', region_name='us-east-1')
    ingredients = comprehend.detect_entities(Text=text, LanguageCode='en')
    
    
    ingredient_list = []
    for item in ingredients.get("Entities"):
        ingredient_list.append(item.get("Text"))
    
    
    #Author(s) name: Boto3 Docs
    #Date: 28 November 2022
    #Title of program/source code: 1.26.22 Documentation
    #Code version: v1
    #Type: Code
    #Web address: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Table.update_item
    table.update_item(
        Key={ "recipeid": recipeid },
        UpdateExpression='SET ingredients=:ingr_list',
        ExpressionAttributeValues={
            ':ingr_list': ingredient_list
        }
    )
    
    print(ingredient_list)
    
    return {
        'statusCode': 200,
        'body': json.dumps(ingredient_list)
        
    }
    