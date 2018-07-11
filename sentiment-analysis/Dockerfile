FROM python:3.6-alpine

WORKDIR /app

ADD requirements.txt /app/requirements.txt

ADD . /app

RUN pip install -r requirements.txt 
RUN python -m textblob.download_corpora
    
#Expose port 10003
EXPOSE 10003

CMD ["python", "serve.py"]