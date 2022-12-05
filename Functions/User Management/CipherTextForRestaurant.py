import json
import boto3


def lambda_handler(event, context):
    # TODO implement
    dynamodb = boto3.resource('dynamodb', 'us-east-1')
    table = dynamodb.Table('RestaurantDetails')
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
    key = (response['Item']['key'])
    plaintext = (response['Item']['plaintext'])
    
    key1 = (int(key))
    
    result=""
    
    # traverse text
    for i in range(len(plaintext)):
        char = plaintext[i]
 
 
    #Author(s) name: GeeksForGeeks
    #Date: 28 November 2022
    #Title of program/source code: Caesar Cipher in Cryptography
    #Code version: v1
    #Type: Code
    #Web address: https://www.geeksforgeeks.org/caesar-cipher-in-cryptography/
        # Encrypt uppercase characters
        if (char.isupper()):
            result += chr((ord(char) + key1-65) % 26 + 65)
 
        # Encrypt lowercase characters
        else:
            result += chr((ord(char) + key1 - 97) % 26 + 97)
    
    print(result)
    
    return {
        'statusCode': 200,
        'body': json.dumps(result)
        
    }