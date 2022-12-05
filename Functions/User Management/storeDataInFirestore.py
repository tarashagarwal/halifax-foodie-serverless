import json

def hello_world(request):
    request_json = request.get_json(silent=True)
    print(request)
    request_args = request.args
#get answers from request and store in firestore
    if request_json and 'email' in request_json:
        answers1 = request_json['answer1']
        answers2 = request_json['answer2']
        answers3 = request_json['answer3']
    
    #store answers in firestore with email as key
        db.collection('answers').document(request_json['email']).set({
            'answer1': answers1,
            'answer2': answers2,
            'answer3': answers3
        })
        return 'Success'
    else:
        return 'Error'
    