# Using official python runtime base image
FROM dbmobilelife/docker-python-opencv-tesseract

#set application directory
WORKDIR /app

#Install requirements.txt
ADD requirements.txt /app/requirements.txt

#copy code from current folder to /app folder
ADD . /app

RUN pip install -r requirements.txt

#Make expose port 10002
EXPOSE 10002

#run app.py on launch of docker
CMD ["python", "feature-extraction.py"] #temporary