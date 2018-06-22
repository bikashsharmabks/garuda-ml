# external imports
from flask import Flask,request,Response
from flask import jsonify
import json
import os
import service


pred = service.Prediction();
print(pred.predict_gender("name"))
#create instance of flask app
app = Flask(__name__)

SERVE_PORT = os.environ['SERVE_PORT']

# POST / 
@app.route("/api/predictions/gender", methods = ['POST'])
def predict_gender():
	req_body = request.get_json()
	name = req_body["name"];
	result = pred.predict_gender(name)
	response = Response(
        response=json.dumps({
        	"name": name,
        	"gender":result[0],
        	"probability": str(round(result[1]*100,2)) + " %"
        }),
        status=200,
        mimetype='application/json'
    )
	return response


if __name__ == '__main__':
	app.run(host='0.0.0.0', port=SERVE_PORT,debug=True)
	print("gender-classification serve at :%s" %(SERVE_PORT))