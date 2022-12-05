import json
import boto3
import random
import re
import csv
import io

def lambda_handler(event, context):
    if (event):
        print(event)
        r1 = random.randint(10, 100000)
        data= event['multiValueQueryStringParameters']
        review = data['feedback'][0]
        username=data['order_id'][0]
        stop_words = s3.get_object(Bucket="restaurantfeedbackwords", Key="stop_words.txt")
        ratingTable = db.Table("orders")
             resposne = ratingTable.put_item(
                Item={
                  'order_id':r1,
                  'Feedback':review
        s3 = boto3.client('s3')
        feedbackfile = s3.get_object(Bucket="restaurantfeedbackwords", Key="feedback.csv")
        words = feedbackfile['Body'].read().decode('utf-8')
        reviews_list = [r for r in reviews if not r in stop_words]
        for I in reviews_list:
            I = I + "\n"+ word
        s3.put_object(Bucket = 'restaurantfeedbackwords', Key = "feedback.csv" , Body = i)
        return {
            'statusCode': 200
        }

def lambda_handler(event, context):
    s3=boto3.client("s3")
    bucket = "restaurantfeedbackwords"
    key = "feedback.csv"
    text = s3.get_object(Bucket = bucket, Key = key)
    review=str(text['Body'].read())
    comprehend=boto3.client("comprehend")
    response= comprehend.detect_sentiment(Text= review , LanguageCode = "en")
    print(response)
    data = response['SentimentScore']
    print(data.items())
    positive = data['Positive']
    negative = data['Negative']
    neutral = data['Neutral']
    mixed = data['Mixed']

    ret = io.StringIO()
    cw = csv.writer(ret)
    for key, value in data.items():
        cw.writerow([key, str(value)])
    print(ret.read())


    client = boto3.client("s3")
    file_name = "testing_file.csv"

    stream = create_csv_for_download(data, "testing_file.csv")
    print(stream)

    body = stream.read()
    if isinstance(body, str):
        body = body.encode("utf-8")
    print ("this is from the stream")
    print (body)

    client.put_object(
     Bucket="restaurantfeedbackwords",
     Key="testing_file.csv",
     Body=body
    )

    return 'Hello from Lambda-2'

def create_csv_for_download(logs, filename):
    ret = io.StringIO()
    cw = csv.writer(ret)
    for key, value in logs.items():
        cw.writerow([key, str(value)])
    print ("this is from the create csv")
    print (ret)
    return ret

