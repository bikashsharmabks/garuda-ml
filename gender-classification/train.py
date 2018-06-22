import tensorflow as tf
import pandas as pd
import os

tf.enable_eager_execution()


# from sklearn import preprocessing, cross_validation
from sklearn import preprocessing, cross_validation
import numpy as np

print("TensorFlow version: {}".format(tf.VERSION))
print("Eager execution: {}".format(tf.executing_eagerly()))

COLUMN_NAMES = ['name','gender']
CLASSES = ['female', 'male']
DATA_PATH = '../data/features/gender_data.csv'

WORD_DICT = 'abcdefghijklmnopqrstuvwxyz';
MAX_VOCABULARY_SIZE = len(WORD_DICT);

NUM_CLASSES = len(CLASSES)
BATCH_SIZE = 100
EPOCHS = 5
max_feature_length = 30

MODEL_SAVE_PATH = "../data/models/gender_prediction_model_v1"
    
char_to_ix = { ch:i for i,ch in enumerate(WORD_DICT)}
ix_to_char = { i:ch for i, ch in enumerate(WORD_DICT)}


def raw_data_fn():
    features = [];
    labels = [];
    
    data = pd.read_csv(DATA_PATH, header=0)
    
    #drop all df with value NaN
    data = data.dropna(subset=['name', 'gender'])
    
    #count total data
    print("Count for data: %s" % len(data))
    
    #get name 
    names = data['name'].astype(str);  
    #print(name_description)
    
    #get labels 
    classes = data['gender']
    ng_data = {};
    for index, row in data.iterrows():
        fullName = str(row['name']).split(" ");
        if(len(fullName)==3):
            ng_data[fullName[2]] = row['gender'] 
        else:
            ng_data[fullName[0]] = row['gender']     

    non_eng_names = [] 
    for k,v in ng_data.items():

        vector_for_char = [] 
    
        for s in list(k):
            if(s.lower() in WORD_DICT):
                vector_for_char.append(char_to_ix[s.lower()])
    
        if(len(k) == len(vector_for_char)):  
            features.append(vector_for_char); 
        
            if(v.lower() == 'm'):
                labels.append(1)
            else:
                labels.append(0)   
        else:  
            non_eng_names.append(k) 
     
    features = tf.keras.preprocessing.sequence.pad_sequences(features, maxlen=max_feature_length)        
    
    print(len(labels),len(features),char_to_ix,len(non_eng_names))  

       
    return (features, labels)

def load_data_fn(features, labels, test_size=0.1):
    return cross_validation.train_test_split(features, labels, test_size=test_size, random_state=42)

def train_input_fn(features, labels, batch_size):
    dataset = tf.data.Dataset.from_tensor_slices((features,labels))
    
    # Shuffle, repeat, and batch the examples.
    dataset = dataset.shuffle(1000).repeat().batch(batch_size)
    
    return dataset

def model_fn():
    # create the model
    embedding_vecor_length = 30
    model = tf.keras.Sequential()
    model.add(tf.keras.layers.Embedding(100, embedding_vecor_length, input_length=max_feature_length))
    model.add(tf.keras.layers.LSTM(100))
    model.add(tf.keras.layers.Dense(1, activation='sigmoid'))
    optimizer = tf.train.RMSPropOptimizer(learning_rate=0.001,name='RMS')

    # We will now compile and print out a summary of our model
    model.compile(loss='binary_crossentropy',
                  optimizer=optimizer,
                  metrics=['accuracy'])

    model.summary()
    return model

def predict_fn(model, name):
    name_vec = []
    for s in list(name):
        if(s.lower() in WORD_DICT):
            name_vec.append(char_to_ix[s.lower()]);
        else:
            name_vec.append(0);
    name_vec = tf.keras.preprocessing.sequence.pad_sequences([name_vec], maxlen=max_feature_length)    
    proba = model.predict_proba(name_vec);
    predicted_label = model.predict_classes(name_vec)
    return (CLASSES[predicted_label[0][0]] , proba[0][0] );
    

    
features, labels = raw_data_fn()
#print(features[0])
#print(labels[0])

train_features, test_features, train_labels, test_labels = load_data_fn(features, labels)
print("Train count {features/labels}: %s/%s" % (len(train_features), len(train_labels)))
print("Test count {features/labels}: %s/%s" % (len(test_features), len(test_labels)))

train_dataset = train_input_fn(train_features, train_labels, BATCH_SIZE)
print(train_dataset)

# #create a model for training
model = model_fn()

# #train the training set with model
model.fit(train_features, train_labels, epochs=EPOCHS)

# #evaluate the model on test set
loss, accuracy = model.evaluate(test_features, test_labels)
print("Loss : %s   Accuracy: %s" % (loss, accuracy))

name = "Garrett Mitchell"

predicted_label = predict_fn(model, name)
print("\nname: %s \npredicted class: %s" % (name , predicted_label))



tf.keras.models.save_model(
    model,
    MODEL_SAVE_PATH,
    overwrite=True,
    include_optimizer=True
)

gender_pred_model = tf.keras.models.load_model(
    MODEL_SAVE_PATH
)
optimizer = tf.train.RMSPropOptimizer(learning_rate=0.001,name='RMS')
gender_pred_model.compile(loss='binary_crossentropy', optimizer=optimizer, metrics=['binary_accuracy'])


name = "Aashish"
predicted_label,prob = predict_fn(gender_pred_model, name)
print("\nname: %s  \npredicted class: %s \nproba : %s" % (name, predicted_label,prob))

