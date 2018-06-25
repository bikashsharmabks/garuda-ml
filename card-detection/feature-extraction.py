
# coding: utf-8

# In[2]:


import cv2
import numpy as np
import pytesseract
from PIL import Image
import glob
import csv
import os
import shutil
import re

PATH = "/data/features/"

src_path = PATH + '*.png'
temp_path = PATH + 'temp/'
contour_path = PATH + 'contours/'

if not os.path.exists(PATH):
    os.makedirs(PATH)
    
if not os.path.exists(temp_path):
    os.makedirs(temp_path)
    
if not os.path.exists(contour_path):
    os.makedirs(contour_path)


# In[15]:


def resize_image(gImg):
    resized_gImg = cv2.resize(gImg, (1050, 600)) 
    return resized_gImg

def get_image_info(img_path):
    gImg = cv2.imread(img_path)
    gImg = resize_image(gImg) #resize image
    
    gImg = cv2.cvtColor(gImg, cv2.COLOR_BGR2GRAY)

    # Apply dilation and erosion to remove some noise
    kernel = np.ones((1, 1), np.uint8)
    gImg = cv2.dilate(gImg, kernel, iterations=1)
    gImg = cv2.erode(gImg, kernel, iterations=1)

    cv2.imwrite(temp_path + "removed_noise_temp.png", gImg)

    # Recognize text with tesseract
    data = pytesseract.image_to_string(Image.open(temp_path + "removed_noise_temp.png"))
    
    haar_face_cascade = cv2.CascadeClassifier('../classifier/haarcascade_frontalface_alt.xml')

    #multiscale (some images may be closer to camera than others)
    faces = haar_face_cascade.detectMultiScale(gImg, scaleFactor=1.1, minNeighbors=1, minSize=(1,1))
    
    if len(faces) > 0:
        hasFace = True
    else:
        hasFace = False
    
    #clean data
    data = data.replace('\n', ' ')
    data = re.sub('\W+',' ', data ) 
    
    info = {}
    info = {
        'data': data,
        'hasFace': hasFace
    }
    return info

def get_image_contour(img_path):
    split_path = img_path.split('/')
    image_contour_path = contour_path + 'contours_'+ split_path[len(split_path)-1]
    gImg = cv2.imread(img_path)
    gImg = resize_image(gImg) 
    gImg = cv2.cvtColor(gImg, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gImg,100,200)
    cv2.imwrite(image_contour_path, edges)
    return image_contour_path


def process_image(img_path):
    info = get_image_info(img_path)
    image_contour = get_image_contour(img_path) #edge image
    info['image_contour'] = image_contour
    return info
    
    


# In[17]:


result = []

#test for single file
# info = process_image(PATH+'DL_4.png')
# result.append(info)
# print(result)
    
files=glob.glob(src_path)   
for file in files:
    info = process_image(file)
    result.append(info)

#create csv and save 
keys = result[0].keys()
with open(PATH+ 'features.csv', 'w') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(result)

# Remove temporary folder
shutil.rmtree(temp_path, ignore_errors=True)

print("File saved succesfully")

