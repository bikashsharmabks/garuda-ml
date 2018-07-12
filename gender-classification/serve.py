# external imports
from flask import Flask,request,Response
from flask import jsonify
import json
import os
import service


pred = service.Prediction()
#create instance of flask app
app = Flask(__name__)

SERVE_PORT = os.environ['SERVE_PORT']

# POST / 
@app.route("/api/predict", methods = ['POST'])
def predict_gender():
	req_body = request.get_json()
	if(not bool(req_body["name"])):
		response = Response(response="name not found.",status=400)
	else:
		name = req_body["name"];
		result = pred.predict_gender(name);
		if(result[0] == 'female'):
			result[1] = 100 - result[1];
		response = Response(response=json.dumps({
        	"name": name,
        	"gender":result[0],
        	"probability": str(round(result[1]*100,2)) + " %"
        }),
        status=200,
        mimetype='application/json'
    	)
	return response


if __name__ == '__main__':
	app.run(host='0.0.0.0', port=SERVE_PORT,debug=False)
	print("gender-classification serve at :%s" %(SERVE_PORT))