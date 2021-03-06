
# coding: utf-8

# In[ ]:


import tensorflow as tf
import pandas as pd
import os

tf.enable_eager_execution()


# In[136]:


from sklearn import preprocessing, cross_validation
import numpy as np

data_path = '/data/users-csv.csv'
print("TensorFlow version: {}".format(tf.VERSION))
print("Eager execution: {}".format(tf.executing_eagerly()))

COLUMN_NAMES = ['screen_name','name','description', 'class']

# CLASSES = ['sports','technology','entertainment', 'politics',
#            'music','legal','medical','education','journalism']

CLASSES = ['sports', 'politics', 'education','journalism']

NUM_CLASSES = len(CLASSES)
MAX_VOCABULARY_SIZE = 1000
BATCH_SIZE = 100
EPOCHS = 5

def raw_data_fn(y_name='class'):
    data = pd.read_csv(data_path, header=0)
    
    #drop all df with value NaN
    data = data.dropna(subset=['name', 'description', 'class'])
    
    #count total data
    print("Count for data: %s" % len(data))
    
    #append name and description
    name_description = data['name'].astype(str) + ' ' + data['description']   
    #print(name_description)
    
    #get labels 
    classes = data['class']

    # define Tokenizer with Vocab Size
    tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=MAX_VOCABULARY_SIZE)
    tokenizer.fit_on_texts(name_description)
    
    # define encoder and make labels
    encoder = preprocessing.LabelBinarizer()
    encoder.fit(CLASSES)
    
    #make features and labels
    labels = encoder.transform(classes)
    features = tokenizer.texts_to_matrix(name_description, mode='tfidf')
       
    return (features, labels, tokenizer)

def load_data_fn(features, labels, test_size=0.3):
    return cross_validation.train_test_split(features, labels, test_size=test_size, random_state=42)

def train_input_fn(features, labels, batch_size):
    dataset = tf.data.Dataset.from_tensor_slices((features,labels))
    
    # Shuffle, repeat, and batch the examples.
    dataset = dataset.shuffle(1000).repeat().batch(batch_size)
    
    return dataset

def model_fn():
    model = tf.keras.Sequential()
    model.add(tf.keras.layers.Dense(512, activation=tf.nn.relu, input_shape=(MAX_VOCABULARY_SIZE,)))
    model.add(tf.keras.layers.Dense(NUM_CLASSES, activation=tf.nn.softmax))

    # Create a TensorFlow optimizer, rather than using the Keras version
    # This is currently necessary when working in eager mode
    optimizer = tf.train.RMSPropOptimizer(learning_rate=0.001)

    # We will now compile and print out a summary of our model
    model.compile(loss='categorical_crossentropy',
                  optimizer=optimizer,
                  metrics=['accuracy'])

    model.summary()
    return model

def predict_fn(model, labels, tokenizer, name, description):
    name_description = name + ' ' + description

    feature = tokenizer.texts_to_matrix(np.array([name_description]), mode='tfidf')
    prediction = model.predict(feature)
    
    predicted_label = CLASSES[np.argmax(prediction[0])]
    return predicted_label
    

    
features, labels, tokenizer = raw_data_fn()
#print(features[0])
#print(labels[0])

train_features, test_features, train_labels, test_labels = load_data_fn(features, labels)
print("Train count {features/labels}: %s/%s" % (len(train_features), len(train_labels)))
print("Test count {features/labels}: %s/%s" % (len(test_features), len(test_labels)))

# #train_dataset = train_input_fn(train_features, train_labels, BATCH_SIZE)
# #print(train_dataset)

#create a model for training
model = model_fn()

#train the training set with model
model.fit(train_features, train_labels, epochs=EPOCHS)

#evaluate the model on test set
loss, accuracy = model.evaluate(test_features, test_labels)
print("Loss : %s   Accuracy: %s" % (loss, accuracy))

name = "Garrett Mitchell"
description = "Professional hockey player. Married to an amazing wife, Father of two amazing girls. Born and raised in Saskatchewan."

predicted_label = predict_fn(model, labels, tokenizer, name, description)
print("\nname: %s \ndescription: %s \npredicted class: %s" % (name, description, predicted_label))

