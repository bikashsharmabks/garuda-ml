
# coding: utf-8

# In[ ]:

import cv2
import numpy as np
import pytesseract
from PIL import Image
import glob
import csv
import os
import shutil
import re

PATH = "../data/card-detection/features/"

src_path = PATH + '*.png'
temp_path = PATH + 'temp/'
contour_path = PATH + 'contours/'

if not os.path.exists(PATH):
    os.makedirs(PATH)
    
if not os.path.exists(temp_path):
    os.makedirs(temp_path)
    
if not os.path.exists(contour_path):
    os.makedirs(contour_path)

result = []

def get_image_info(img_path):
    info = {}
    gImg = cv2.imread(img_path)
    gImg = cv2.cvtColor(gImg, cv2.COLOR_BGR2GRAY)

    # Apply dilation and erosion to remove some noise
    kernel = np.ones((1, 1), np.uint8)
    gImg = cv2.dilate(gImg, kernel, iterations=1)
    gImg = cv2.erode(gImg, kernel, iterations=1)

    cv2.imwrite(temp_path + "removed_noise_temp.png", gImg)

    # Recognize text with tesseract
    data = pytesseract.image_to_string(Image.open(temp_path + "removed_noise_temp.png"))
    
    haar_face_cascade = cv2.CascadeClassifier('classifier/haarcascade_frontalface_alt.xml')

    #multiscale (some images may be closer to camera than others)
    faces = haar_face_cascade.detectMultiScale(gImg, scaleFactor=1.1, minNeighbors=1, minSize=(1,1))
    
    if len(faces) > 0:
        hasFace = True
    else:
        hasFace = False

    data = data.replace('\n', ' ')
    data = re.sub('\W+',' ', data )

    info = {
        'data': data.replace('\n', ' '),
        'hasFace': hasFace
    }
    return info


def get_image_contour(img_path):
    split_path = img_path.split('/')
    image_contour_path = contour_path + 'contours_'+ split_path[5]
    gImg = cv2.imread(img_path)
    gImg = cv2.cvtColor(gImg, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gImg,100,200)
    cv2.imwrite(image_contour_path, edges)
    return image_contour_path


# test for single file
# info = get_image_info(PATH+'DL_4.png')
# image_contour = get_image_contour(PATH+'DL_4.png')
# info['image_contour'] = image_contour
# result.append(info)
# print(result)
    
files=glob.glob(src_path)   
for file in files:
    info = get_image_info(file)
    image_contour = get_image_contour(file)
    info['image_contour'] = image_contour
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

    



