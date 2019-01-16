---
title: "Ho Ho Ho: Is Die Hard really a Christmas movie? Part 3"
date: "2019-01-15"
hero-image: "dhla.jpg"
---

# Hello Again! 

In the third part of my project tutorial, I’ll finally be moving into some basic sentiment analysis using the tokenized tweets and co-occurrence terms we created in part 2. To perform the sentiment analysis, I will be using two techniques:

  - Peter Turney’s Thumbs Up or Thumbs Down Semantic Orientation
  - TextBlob library

As always, for the full code I used to create this project visit [my Github page](https://github.com/amyksu/die-hard-christmas/blob/master/Part%203%20Sentiment%20Analysis.ipynb). For my previous posts, visit [Part 1](blog/diehard-pt1) and [Part 2](blog/diehard-pt2). 

# Sentiment Analysis

Now that we have vectorized our tweets, performed our counts, and created our co-occurrence matrices, let's start on sentiment analysis.

## Part 1: Semantic Orientation

As mentioned above, I will first be doing Peter Turney’s technique to perform sentiment analysis (I encourage you to read his [paper](https://arxiv.org/abs/cs/0212032) for more information. 

The basis of this technique classifies phrases based on its association with positive and negative words. This classification is defined as Semantic Orientation. To do this, we must first calculate how close a word is with positive and negative words such as “good” and “bad”. This measure of closeness is called the Pointwise Mutual Information (PMI), which is calculated as: 

->PMI(t1, t2) = log((P(t1 ^ t2))/P(t1) - P(t2))<-

where t1 and t2 are terms. 

In order to computer P(t), the probability of observing the term t, and P(t1 ^ t2), the probability of observing terms t1 and t2 together), we can re-use the code used to calculate the term frequencies and term co-occurrences that we did above.

To calculate the probabilities, we will use the following equation:

->P(t) = DF(t) / abs(D)<-

->P(t1 ^ t2) = DF(t1 ^ t2) / abs(D)<-

where DF is Document Frequency of a term which is the number of time the term occurs in the document or tweets, in our case, and D is the set of documents/tweets.
 
```python
# Import defaultdict
from collections import defaultdict

# from our shape argument, we see our total amount of tweets is 2,096
p_t = {}
p_t_com = defaultdict(lambda : defaultdict(int))

for term, n in count_all.items():
    p_t[term] = n/2096
    for t2 in com[term]:
        p_t_com[term][t2] = com[term][t2]/2096
```

Next, I will define words that will help determine whether a tweet has a positive vs negative opinion. 

```python
positive_vocab = ['good', 'great', 'favorite', 'yes', 'right', 'great', 'terrific', ':)', ':-)', 'endorse', 'is', 'agree', 'awesome', 'fantastic', 'best', 'better', 'correct', 'like', 'love', 'outstanding']

negative_vocab = ['isnt', 'terrible', 'isn\'t', 'not', 'bad', 'no', 'wrong', 'disagree', 'dont', 'don\'t', 'worse', 'worst','hate',':(', ':-(']
```

Now, I will perform the calculation for PMI that we defined above.  Using the PMI calculation, I will also define the Semantic Orientation (SO) with the positive and negative vocabulary defined above.

```python
import math

pmi = defaultdict(lambda : defaultdict(int))
for t1 in p_t:
    for t2 in com[t1]:
        denom = p_t[t1] * p_t[t2]
        pmi[t1][t2] = math.log2(p_t_com[t1][t2]/denom)

semantic_orientation = {}
for term, n in p_t.items():
    positive_assoc = sum(pmi[term][tx] for tx in positive_vocab)
    negative_assoc = sum(pmi[term][tx] for tx in negative_vocab)
    semantic_orientation[term] = positive_assoc - negative_assoc
```

Now that we have determined the negative and positive orientations, we can use this to determine whether specific words have a positive or negative orientation. In our case, let’s look specifically at the words in our query, ‘Die’, ‘Hard’, and ‘Christmas’ to see whether they have a positive or negative orientation. 

```python
print('Orientation for Die: %f' % semantic_orientation['die'])
print('Orientation for Hard: %f' % semantic_orientation['hard'])
print('Orientation for Christmas: %f' % semantic_orientation['christmas'])

# Results
Orientation for Die: -0.019899
Orientation for Hard: 0.976432
Orientation for Christmas: 1.060167
```

As we can see, two of the three terms have strong positive orientations and the one with the negative orientation, “Die”, is fairly low, with less than 1%. We can also attribute the negative orientation to the fact that “Die” as a word itself has a negative connotation. 

Therefore, based on this information, we can conclude that most of the words related to these terms are mostly positive and therefore, have a positive opinion with regards to whether Die Hard is a Christmas movie.

### *Limitations*

The PMI-based approach to sentiment analysis is meant to be a simple and intuitive introduction. However, because it is a simple algorithm, there are some limitations. According to Peter Turney’s paper, the algorithm achieves an average accuracy of 74% in his evaluation of 410 reviews. In addition, he states that the accuracy ranges from 84% to 66%. Furthermore, the semantic scores are calculated based on terms, or words, meaning that there is no notion of “concept” and other aspects of natural language, such as phrases such as not good or very bad. 

## Step 2: TextBlob

Now that we’ve tried one technique, let’s try and confirm our conclusion by using the TextBlob library. The TextBlob library is used for sentiment analysis by classifying the polarity of a tweet. TextBlob is already trained and therefore easy to use. However, because the wording between positive and negative tweets are so similar, I will train the classifier by using the *textblob.classifiers* module to create custom classifiers. To do this, I will enter in some training data that I’ve extracted from my Twitter pull that I will mark as positive or negative. 

Once this is done, we will import the TextBlob classifier module and training the Classifier. By using the NaiveBayesClassifier, we are overriding the default PatternAnalyzer that is typically used for sentiment analysis within TextBlob.

```python
from textblob.classifiers import NaiveBayesClassifier
cl = NaiveBayesClassifier(train)
```

Then, we will create a function to analyze the sentiment of our tweets based on our classifier.

```python
from textblob import TextBlob

def analyze_sentiment(tweet):
    analysis = TextBlob(tweet, classifier=cl)
    if analysis.sentiment.polarity > 0:
        return 1
    elif analysis.sentiment.polarity == 0:
        return 0
    else:
        return -1
```

Now, that we have created the function, we can assign a sentiment to each of the tweets: 1 for positive, 0 for neutral, and -1 for negative. 

```python
df['SA'] = np.array([analyze_sentiment(tweet) for tweet in df['clean_tweet']])

# Labelling tweets
pos_tweets = [ tweet for index, tweet in enumerate(df['clean_tweet']) if df['SA'][index] > 0]
neu_tweets = [ tweet for index, tweet in enumerate(df['clean_tweet']) if df['SA'][index] == 0]
neg_tweets = [ tweet for index, tweet in enumerate(df['clean_tweet']) if df['SA'][index] < 0]
```
Using the labels, we can see how many of our tweets are positive, negative, and neutral: 

```python
Percentage of positive tweets: 36.020992366412216%
Percentage of neutral tweets: 3.435114503816794%
Percentage of negative tweets: 60.54389312977099%
```

### *Limitations*

When looking at our tweets and the sentiment labels, there are some inaccuracies with the way some of the tweets are labelled. For example, “I guess Die Hard is a Christmas movie” was labelled as a negative tweet when it should be positive, while “Forget 'Die Hard,' 'Go' Is the Ultimate Anti-Christmas Movie” is labeled as negative as well, but should be neutral. 

## Summary

That concludes the tutorial portion of my project. We have walked through, step by step, how to:

1. [Extract Tweets from Twitter using TwitterAPI](blog/diehard-pt1)
2. [Vectorize Tweets and analyze words, hashtags, and co-occurrence terms](blog/diehard-pt2)
3. Analyze the sentiment of the tweets using Pointwise Mutual Information and TextBlob. 

In my next and last post of this series, I will be drawing up conclusions from our work. 

Thanks for reading! 
