import json
import boto3



def lambda_handler(event,context):

    body = json.loads(event['body']) 
    firstName = body.get('firstName')
    lastName = body.get('lastName')
    email = body.get('email')
    password = body.get('password')
    phonenumber = body.get('phoneNumber')
    address = body.get('address')
    key = body.get('key')
    plaintext = body.get('plaintext')
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('UserDetails')
    
    #Author(s) name: Boto3 Docs
    #Date: 28 November 2022
    #Title of program/source code: 1.26.22 Documentations
    #Code version: v1
    #Type: Code
    #Web address: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Table.put_item
    table.put_item(
		Item = {
			'firstname': firstName,
			'lastname': lastName,
			'email': email,
			'password': password,
			'phonenumber': phonenumber,
			'address': address,
			'key' : key,
			'plaintext' : plaintext
		}
	)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
	}
