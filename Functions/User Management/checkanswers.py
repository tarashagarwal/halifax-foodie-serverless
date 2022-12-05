def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    
    if request_json and 'email' in request_json:    
        email = request_json['email']
        answers1 = request_json['answer1']
        answers2 = request_json['answer2']
        answers3 = request_json['answer3']
    else:
        return 'No email found', 400

    db = firestore.Client()
    doc_ref = db.collection(u'answers').document(email)
    doc = doc_ref.get()
    if doc.exists:
        docanswer1 = doc.to_dict().get('answer1')
        docanswer2 = doc.to_dict().get('answer2')
        docanswer3 = doc.to_dict().get('answer3')

        if docanswer1 == answers1 and docanswer2 == answers2 and docanswer3 == answers3:
            return 'Correct'
        else:
            return 'Incorrect'
    else:
        return 'Incorrect'
