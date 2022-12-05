import os
import json
import boto3
import urllib3
from random import randint, randrange


intent_name="order_ratings" 
dbclient = boto3.client('dynamodb')


def lambda_handler(event, context):
    print(event)
    print(event['transcriptions'][0]['resolvedContext']['intent'])
    userid = event['requestAttributes']["userId"]
    print("********" + userid)
    response = build_response("Failed",event['transcriptions'][0]['resolvedContext']['intent'])
    
    if(userid == "empty"):
        response =  build_response("Fulfilled",'user_not_logged_in')
    else:
        #validate user first
        if(user_present_in_dyanmo_db(userid)):
            print("user is present in dyanmo db.... proceeding")
            
            if(event['transcriptions'][0]['resolvedContext']['intent'] == 'customer_complaints'):
                http = urllib3.PoolManager()
                r = http.request('GET', 'https://us-central1-serverless-365223.cloudfunctions.net/submit_customer_complain?msg=customer_complaints&userid=' + userid)
                print(r.data.decode("utf-8"))
                #m = http.request('GET', 'https://us-central1-serverless-365223.cloudfunctions.net/get_message_from_chatroom_queue')
                response = build_response("Fulfilled",event['transcriptions'][0]['resolvedContext']['intent'])
            elif(event['transcriptions'][0]['resolvedContext']['intent'] == 'order_ratings'):
                order_number = event["interpretations"][0]["intent"]["slots"]["number_order"]["value"]["interpretedValue"]
                ratings      = event["interpretations"][0]["intent"]["slots"]["ratings_order"]["value"]["interpretedValue"]
                response     = ""
                if verify_order_in_database_and_add_ratings(order_number,ratings):
                    response = build_response("Fulfilled",intent_name)
                else:
                    response = build_response("Failed",intent_name)
            elif(event['transcriptions'][0]['resolvedContext']['intent'] == 'customer_feedback'):
                order_number = event["interpretations"][0]["intent"]["slots"]["fb_on"]["value"]["interpretedValue"]
                feedback      = event["interpretations"][0]["intent"]["slots"]["fb_comm"]["value"]["interpretedValue"]
                response     = ""
                if verify_order_in_database_and_add_feedback(order_number,feedback):
                    response = build_response("Fulfilled",'customer_feedback')
                else:
                    response = build_response("Failed",intent_name)
            elif(event['transcriptions'][0]['resolvedContext']['intent'] == 'add_recipe'):
                resturant_name = event["interpretations"][0]["intent"]["slots"]["resturant_name"]["value"]["interpretedValue"]
                recipe_name    = event["interpretations"][0]["intent"]["slots"]["recipe_name"]["value"]["interpretedValue"]
                recipe_text    = event["interpretations"][0]["intent"]["slots"]["recipe_text"]["value"]["interpretedValue"]
                if(add_recipe_to_database(resturant_name,recipe_name,recipe_text)):
                    response = build_response("Fulfilled",'add_recipe')
                else:
                    response = build_response("Failed",'add_recipe')
            else:
                response = build_response("Fulfilled",event['transcriptions'][0]['resolvedContext']['intent'])
        else:
            print("Intent we Hit:" + event['transcriptions'][0]['resolvedContext']['intent'])
            response = build_response("Fulfilled",'invalid_user')
            
    return response

def add_recipe_to_database(resturant_name,recipe_name,recipe_text):
    table = boto3.resource('dynamodb').Table('recipe')
    random_number = randint(100000000,999999999) 
    response = table.update_item(
        Key={
            'recipeid': random_number,
        },
        UpdateExpression="SET resturantName = :resturant_name, recipename = :recipe_name, recipe = :recipe_text",
        ExpressionAttributeValues={
            ':resturant_name': resturant_name,
            ':recipe_name': recipe_name,
            ':recipe_text': recipe_text
        }
    )
    print("Adding Recepie")
    print(response)
    return True
    
def user_present_in_dyanmo_db(userid):
    data = dbclient.get_item(
        TableName='UserDetails',
        Key={
            'email': {'S':userid}
        }
    )
    print("!!!!!!!!!!!")
    print(data)
    if('Item' in data):
        return True
    return False

def verify_order_in_database_and_add_feedback(order_number,feedback):
    
    if order_number == '' or feedback == '':
        return False
    
    data = dbclient.get_item(
        TableName='order_details',
        Key={
            'order_number': {'S':order_number}
        }
    )
    
    print(data)
    table = boto3.resource('dynamodb').Table('order_details')
    if 'Item' in data:
        response = table.update_item(
            Key={
                'order_number': order_number,
            },
            UpdateExpression="set feedback = :r",
            ExpressionAttributeValues={
                ':r': feedback,
            }
        )
        
        return True
    
    print("Order Number Does Not Exists") 
    return False
    
def verify_order_in_database_and_add_ratings(order_number,ratings):
    
    if order_number == '' or ratings == '' or int(ratings) < 1 or int(ratings) > 5:
        return False
    
    data = dbclient.get_item(
        TableName='order_details',
        Key={
            'order_number': {'S':order_number}
        }
    )
    
    print(data)
    table = boto3.resource('dynamodb').Table('order_details')
    if 'Item' in data:
        response = table.update_item(
            Key={
                'order_number': order_number,
            },
            UpdateExpression="set ratings = :r",
            ExpressionAttributeValues={
                ':r': ratings,
            }
        )
        
        return True
    
    print("Order Number Does Not Exists") 
    return False

def build_response(state,intent_name):
    return {
        "sessionState": {
          "sessionAttributes": {
          },
          "dialogAction": {
              "type": "Delegate"
          },
          "intent": {
              "name": intent_name,
              "state": state
          }
        },
        "messages": [
           {
              "contentType": "PlainText",
              "content": "string"
           }
        ],
        "requestAttributes": {
          "string": "string"
        }
    }
