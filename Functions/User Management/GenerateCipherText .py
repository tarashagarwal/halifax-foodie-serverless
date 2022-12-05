import json

def lambda_handler(event, context):
    body = json.loads(event['body']) 
    key = body.get('key')
    plaintext = body.get('plaintext')
    email = body.get('email')
    print(key)
    print(plaintext)
    print(email)
    
    key1 = (int(key))
    print(key1)
    result=""
    
    #Author(s) name: GeeksForGeeks
    #Date: 28 November 2022
    #Title of program/source code: Caesar Cipher in Cryptography
    #Code version: v1
    #Type: Code
    #Web address: https://www.geeksforgeeks.org/caesar-cipher-in-cryptography/
    
    # traverse text
    for i in range(len(plaintext)):
        char = plaintext[i]
 
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
