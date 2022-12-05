import boto3
import json
import string
import random

def lambda_handler(event, context):
    body = json.loads(event['body']) 
    recipename = body.get('recipename')
    recipe = body.get('recipe')
    restaurantName = body.get('restaurantName')
    ingredients = body.get('ingredients')
    recipeid = body.get('recipeid')
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Recipe')
    print(body)
    
    #Author(s) name: Boto3 Docs
    #Date: 28 November 2022
    #Title of program/source code: 1.26.22 Documentations
    #Code version: v1
    #Type: Code
    #Web address: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Table.put_item

    table.put_item(
		Item = {
			'recipeid': recipeid,
			'restaurantName': restaurantName,
			'title': recipename,
			'recipe': recipe,
			'ingredients': ingredients
		}
	)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
