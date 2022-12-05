import os
import json
from concurrent import futures
from google.cloud import pubsub_v1
def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    print("*************")
    print(request)
    publisher = pubsub_v1.PublisherClient()
    topic_name = 'projects/{project_id}/topics/{topic}'.format(
        project_id='serverless-365223',
        topic='customer_complaints',
    )
    #publisher.create_topic(name=topic_name)
    if request.args and 'msg' in request.args:
        future = publisher.publish(topic_name, bytes(request.args.get('userid'), 'utf-8'))
        print(future.result())

    if request.args and 'msg' in request.args:
        return request.args.get('msg')
    elif request_json and 'msg' in request_json:
        return request_json['msg']
    else:
        return f'Hello World!'