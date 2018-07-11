import tensorflow as tf

WORD_DICT = 'abcdefghijklmnopqrstuvwxyz';
char_to_ix = { ch:i for i,ch in enumerate(WORD_DICT)}
CLASSES = ['female','male']
max_feature_length = 30
GENDER_PRED_MODEL_PATH = "/data/models/gender_prediction_model_v1"

gender_pred_model = tf.keras.models.load_model(GENDER_PRED_MODEL_PATH);
optimizer = tf.train.RMSPropOptimizer(learning_rate=0.001, name='RMS')
gender_pred_model.compile(loss='binary_crossentropy', optimizer=optimizer, metrics=['binary_accuracy'])
   
class Prediction:

    def predict_gender(self,name):
        name_vec = []
        for s in list(name):
            if(s.lower() in WORD_DICT):
                    name_vec.append(char_to_ix[s.lower()])
            else:
                 name_vec.append(0)

        name_vec = tf.keras.preprocessing.sequence.pad_sequences([name_vec], maxlen=max_feature_length)    
        proba = gender_pred_model.predict_proba(name_vec)
        predicted_label = gender_pred_model.predict_classes(name_vec)
        return (CLASSES[predicted_label[0][0]] , proba[0][0])


# pred = Prediction()

# print(pred.predict_gender("Aashish"))    