import json
import random
import boto3

def lambda_handler(event, context):
    # TODO implement
    print(event)
    print("******" + event["queryStringParameters"]["msg"])
    print("#######" + event["queryStringParameters"]["userid"])
    userid = event["queryStringParameters"]["userid"]
    if (len(userid) == 0):
        userid = "empty"
    session = boto3.Session()
    client = boto3.client('lexv2-runtime')
    response = client.recognize_text(
    botId='FIJJXVOFZC',
    botAliasId='VXAHSUFN2O',
    localeId='en_US',
    sessionId=userid.split("@")[0],
    requestAttributes={"userId":userid},
    text=event["queryStringParameters"]["msg"])
    finalReponse = ''
    statusCode = 200
    print(response)
    if 'messages' in response:
        finalReponse = response['messages'][0]['content']
    else:
        finalReponse = 'Could not Fulfill Request'
    
    return {
        'statusCode': statusCode,
        'body': json.dumps(finalReponse)
    }
