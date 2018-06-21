
# coding: utf-8

# In[ ]:

import cv2
import numpy as np
import pytesseract
from PIL import Image
import glob
import unicodecsv as csv
import os
import shutil

def get_image_info(img_path):
    
    info = {}
    gImg = cv2.imread(img_path)
    gImg = cv2.cvtColor(gImg, cv2.COLOR_BGR2GRAY)

    # Apply dilation and erosion to remove some noise
    kernel = np.ones((1, 1), np.uint8)
    gImg = cv2.dilate(gImg, kernel, iterations=1)
    gImg = cv2.erode(gImg, kernel, iterations=1)

    cv2.imwrite(temp_path + "removed_noise.png", gImg)

    # Recognize text with tesseract
    data = pytesseract.image_to_string(Image.open(temp_path + "removed_noise.png"))
    
    haar_face_cascade = cv2.CascadeClassifier('classifier/haarcascade_frontalface_alt.xml')

    #multiscale (some images may be closer to camera than others)
    faces = haar_face_cascade.detectMultiScale(gImg, scaleFactor=1.1, minNeighbors=1, minSize=(1,1))
    
    if len(faces) > 0:
        hasFace = True
    else:
        hasFace = False
    info = {
        'data': data.replace('\n', ' '),
        'hasFace': hasFace
    }
    return info


def get_image_contour(img_path):
    split_path = img_path.split('/')
    image_contour_path = split_path[0] + '/contours/contours_' + split_path[1]
    gImg = cv2.imread(img_path)
    gImg = cv2.cvtColor(gImg, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gImg,100,200)
    cv2.imwrite(image_contour_path, edges)
    return image_contour_path


if not os.path.exists('images'):
    os.makedirs('images')
    
if not os.path.exists('images/temp'):
    os.makedirs('images/temp')
    
if not os.path.exists('images/contours'):
    os.makedirs('images/contours')
    
src_path = "images/*.png"
temp_path = "images/temp/"

result = []

#test for single file
# info = get_image_info('images/DL_4.png')
# image_contour = get_image_contour('images/DL_4.png')
# info['image_contour'] = image_contour
# result.append(info)
# print(result)
    
files=glob.glob(src_path)   
for file in files:
    info = get_image_info(file)
    image_contour = get_image_contour(file)
    info['image_contour'] = image_contour
    result.append(info)
    
keys = result[0].keys()
with open('images/csv/dl_info.csv', 'wb') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(result)

# Remove temporary folder
shutil.rmtree("images/temp", ignore_errors=True)

print("File saved succesfully")

    



