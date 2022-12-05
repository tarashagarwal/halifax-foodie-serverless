import json
import boto3

client = boto3.client('sns')

def lambda_handler(event, context):
    # TODO implement
    extra_instruction  = event["Records"][0]["body"]
    message_attributes = event["Records"][0]["messageAttributes"]
    print(message_attributes)
    meal_instructions = ""
    for key in message_attributes:
        meal_instructions = meal_instructions + message_attributes[key]["stringValue"] + "\n"
    meal_instructions = meal_instructions + "\n" + extra_instruction
    
    print("Customer Order Details" + "\n" + meal_instructions)
    
    response = client.publish(
        TargetArn="arn:aws:sns:us-east-1:449518585940:send_message_to_resturants_owner_email",
        Message=json.dumps({'default': json.dumps(meal_instructions)}),
        MessageStructure='json',
        Subject='Order has been placed',
    )

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
