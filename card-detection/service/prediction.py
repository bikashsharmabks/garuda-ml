import keras as keras
from keras.models import load_model
from keras.preprocessing.image import load_img, img_to_array
import numpy as numpy
import tensorflow as tf

graph = tf.get_default_graph()

CLASSES = ['driving license', 'financial card', 'text']
CARD_DETECTION_MODEL_PATH = "/data/models/card_detection_model_v1"

card_detection_model = load_model(CARD_DETECTION_MODEL_PATH)   

   
class Prediction:

  def card_detection(self, image_path):
    features_predict= []
    image = load_img(image_path, target_size=(256, 256))
    image = img_to_array(image)
    image /= 255
    features_predict.append(image)
    features_predict = numpy.array(features_predict)
    with graph.as_default():
        prediction = card_detection_model.predict(features_predict)
        predicted_label = CLASSES[numpy.argmax(prediction[0])]
        predicted_proba = numpy.amax(prediction[0]) *100
        return (predicted_label, predicted_proba)

    return predicted_label


#pred = Prediction();

#print(pred.card_detection('/data/features/test_9.png'))    