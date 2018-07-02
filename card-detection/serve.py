from flask import Flask, request, Response
import json
import os
import service

pred = service.Prediction();
#print(pred.card_detection('/data/features/test_3.png'))

UPLOAD_FOLDER_PATH = '/data/features/temp/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

if not os.path.exists(UPLOAD_FOLDER_PATH):
    os.makedirs(UPLOAD_FOLDER_PATH)

app = Flask(__name__)
#app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

SERVE_PORT = os.environ['SERVE_PORT']

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/predictions/card-detection", methods = ['POST'])
def card_detection():
    if 'file' not in request.files:
        response = Response(response="No file found in request",status=400)

    file = request.files['file']

    if file.filename == '':
        response = Response(response="No file found in request",status=400)

    if file and allowed_file(file.filename):

        file.save(os.path.join(UPLOAD_FOLDER_PATH, file.filename))
        file_path = os.path.join(UPLOAD_FOLDER_PATH, file.filename)
        result = pred.card_detection(file_path)
        response = Response(response=json.dumps({
        	"predicted_card_type": result[0],
        	"probability" : str(round(result[1], 2)) + "%"
        }),
        status=200,
        mimetype='application/json'
    	)
    	os.remove(file_path)

    return response

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=SERVE_PORT,debug=True)
	print("card-detection serve at :%s" %(SERVE_PORT))


