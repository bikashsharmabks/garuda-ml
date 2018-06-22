# Using official python runtime base image
FROM tensorflow/tensorflow

#set application directory
WORKDIR /app

#Install requirements.txt
ADD requirements.txt /app/requirements.txt

#copy code from current folder to /app folder
ADD . /app

RUN pip install pathlib && \
	pip install -r requirements.txt

#Make expose port 10001
EXPOSE 10001

#run app.py on launch of docker
CMD ["python", "serve.py"]