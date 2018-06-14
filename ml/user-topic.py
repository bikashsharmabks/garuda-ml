
# coding: utf-8

# In[1]:


import tensorflow as tf
import pandas as pd
import os

tf.enable_eager_execution()


# In[87]:


from sklearn import preprocessing, cross_validation

data_path = '/data/users-csv.csv'
print("TensorFlow version: {}".format(tf.VERSION))
print("Eager execution: {}".format(tf.executing_eagerly()))

COLUMN_NAMES = ['screen_name','name','description', 'class']

CLASSES = ['sports','technology','entertainment', 'politics',
           'music','legal','medical','education','journalism']

num_labels = len(CLASSES)
VOCAB_SIZE = 1000
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
   
    #get labels 
    classes = data['class']

    # define Tokenizer with Vocab Size
    tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=VOCAB_SIZE)
    tokenizer.fit_on_texts(name_description)
    
    # define encoder and make labels
    encoder = preprocessing.LabelBinarizer()
    encoder.fit(classes)
    
    #make features and labels
    labels = encoder.transform(classes)
    features = tokenizer.texts_to_matrix(name_description, mode='tfidf')
       
    return (features, labels)

def load_data_fn(features, labels, test_size=0.2):
    return cross_validation.train_test_split(features, labels, test_size=test_size, random_state=42)
   

def train_input_fn(features, labels, batch_size):
    dataset = tf.data.Dataset.from_tensor_slices((features,labels))
    
    # Shuffle, repeat, and batch the examples.
    dataset = dataset.shuffle(1000).repeat().batch(batch_size)
    
    return dataset
    
features, labels = raw_data_fn()
#print(features[0])
#print(labels[0])

train_features, test_features, train_labels, test_labels = load_data_fn(features, labels)
print("Train count {features/labels}: %s/%s" % (len(train_features), len(train_labels)))
print("Test count {features/labels}: %s/%s" % (len(test_features), len(test_labels)))

train_dataset = train_input_fn(train_features, train_labels, BATCH_SIZE)
print(train_dataset)

