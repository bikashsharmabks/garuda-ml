from textblob import TextBlob
import re

def clean_text(text):
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", text).split())

class Prediction:

    def predict_text_sentiment(self, text):
        text = clean_text(text)
        analysis = TextBlob(text)
        output = {}
        output["polarity"] = analysis.sentiment.polarity
        output["subjectivity"] = analysis.sentiment.subjectivity
        if output["polarity"] > 0:
            output["sentiment"] = 'positive'
        elif output["polarity"] == 0:
            output["sentiment"] = 'neutral'
        else:
            output["sentiment"] ='negative'
        return output


    
    
# sentiment = Prediction()

# print(sentiment.predict_text_sentiment('Its a good day!'))