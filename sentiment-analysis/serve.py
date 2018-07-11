# external imports
from flask import Flask,request,Response
from flask import jsonify
import json
import os
import service


sentiment = service.Prediction()
#print(sentiment.get_text_sentiment("its a good day"))
#create instance of flask app
app = Flask(__name__)

SERVE_PORT = os.environ['SERVE_PORT']

# POST / 
@app.route("/api/predict", methods = ['POST'])
def predict_sentiment():
	req_body = request.get_json()
	if(not bool(req_body["text"])):
		response = Response(response="text not found.",status=400)
	else:
		text = req_body["text"];
		result = sentiment.predict_text_sentiment(text)
		response = Response(response=json.dumps({
        	"polarity": result["polarity"],
        	"subjectivity":result["subjectivity"],
        	"sentiment": result["sentiment"]
        }),
        status=200,
        mimetype='application/json'
    	)
	return response


if __name__ == '__main__':
	app.run(host='0.0.0.0', port=SERVE_PORT,debug=False)
	print("sentiment-analysis serve at :%s" %(SERVE_PORT))