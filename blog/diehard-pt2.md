---
title: "Welcome to the Party Pal: Is Die Hard really a Christmas movie? Part 2"
date: "2019-01-11"
hero-image: "ny.jpg"
---

# Welcome Back! 

In part two of my project, I will be doing some basic cleaning of the tweets we extracted in the last post. Then, we will do create some visualizations using Numpy, Matplotlib, Seaborn, and WordCloud. In this portion of my project, I will be trying to gain insight on these tweets by exploring the following:

  - What are the most common words in the dataset?
  - What are the most common hashtags in the dataset?
  - What are the most commonly associated words/co-occurrences (or words that occur together) in the dataset?

*Note*: This will be a cut down version of all the work I did. For the full code, please see my [Github](https://github.com/amyksu/die-hard-christmas). For my previous post, [click here](blog/diehard-pt1).

# Cleaning the Tweets

In part 1 of my project, I extracted tweets from Twitter using the TwitterAPI library. Now that we have all the tweets we want, we now have to initialize the information and clean the tweets. 


## Step 1: Creating pandas DataFrame

Lucky for us, the way I extracted the tweets from Twitter solely gave us the tweets for the query we specified. Therefore, using pandas, we can initialize the data into a DataFrame while also specifying the column name. 

```python
df = pd.read_csv('die-hard-tweets-no-retweets.csv')
df.columns = ['Tweet']
```


## Step 2: Cleaning tweets

From what we’ve initialized, we can see that some tweets have user handles, punctuations, retweets, urls, and a bunch of other information we don’t need for our analysis. To remove these, I created a function that will clean our tweets to remove:

  - all URLs
  - Retweets and CC’s 
  - Mentions
  - Symbols
  - Blank Spaces

```python
# First, create function to remove Twitter Handles
def clean_tweet(tweet):
    tweet = re.sub('http\S+\s*', '', tweet) #removes all urls
    tweet = re.sub('RT|cc', '', tweet) #removes RT and CC's 
    tweet = re.sub('@\S+', '', tweet) #removes mentions
    tweet = re.sub('[%s]' % re.escape("""!"$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), '', tweet) #removes any special characters except hashtags
    tweet = re.sub('\s+',' ', tweet) #removes blank spaces
    return tweet.lower()

# Remove twitter handles
df['clean_tweet'] = np.vectorize(clean_tweet)(df['Tweet'])
```

Now that we’ve cleaned the tweets, we can see now that some of the tweets are empty. Let’s replace these tweets with NA’s and drop them from our DataFrame and re-index them. (The re-indexing will be helpful for our analyses later on).

```python
# Drop NA's
df['clean_tweet'].replace(' ', np.nan, inplace=True)
df = df.dropna()

# Reset indeces
df.index = range(2096) # There are 2096 tweets remaining after dropping NA's
```

While we’re at it, let’s also remove single letters, such as “a” and “I”, from our tweets.

```python
df['clean_tweet'] = df['clean_tweet'].apply(lambda x: ' '.join([w for w in x.split() if len(w)>1]))
```


## Step 3: Tokenizing tweets

Next, we will tokenize all the cleaned tweets in our dataset. Tokens are individual terms or words, and tokenization is the process of splitting a string of text into tokens. Tokenizing the tweets will make it easier to count the most common words, hashtags, and co-terms to answer our questions. 

```python
tokenized_tweet = df['clean_tweet'].apply(lambda x: x.split())
```


## Step 4: Counting the most common words 

Using the tokenized tweets, we can now count the words that are the most common in our collection of tweets. Using the Counter function from the collections library, we can use the most_common() function to count the most common words in our tweets. 

Also, at this point, it would be common to remove stopwords using NLTK. However, based on the list of stopwords listed, for the purposes of what I am trying to find, a lot of the words that I would be using to determine whether people agree or disagree with Die Hard being a Christmas movie would be removed. 

```python
import operator
from collections import Counter

count_all = Counter()
for line in tokenized_tweet:
    count_all.update(line)

print(count_all.most_common(5))
```

As expected, the most common words were “Christmas”, “Die” and “Hard” (these were the words used to query the tweets), but also in the top 5 common words were “is” and “a”, which makes a lot of sense. Here are the top 15 terms:

```python
[('christmas', 2546), ('hard', 2032), ('die', 2018), ('is', 1537), ('movie', 1478), ('the', 1326), ('and', 698), ('to', 614), ('of', 478), ('it', 450), ('that', 356), ('not', 330), ('on', 325), ('in', 320), ('you', 298)]
```

As we can see, the most frequency words are the keywords we used to query my API request (**Christmas** and **Die Hard**), but what is more interesting is that the word '*is*' is mentioned 1537 times, '*not*' is mentioned 330 times. 


## Step 5: WordCloud

To get a better visualization of the most common words and whether we deem them positive or negative, we will us the WordCloud visualization tool to plot the most common words in our cleaned tweets. 

<div class="mw7 center ph3-ns">
  <div class="cf ph2-ns">
    <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_FF71F1817FD0467B91E1AB01E2167FB4EDE73E37736388AA82F394904A59955A_1547174101240_image.png" alt="Most Common Terms WordCloud"/>
	</div>
</div>

When creating the WordCloud, I labeled the positive words in green and the negative words in red. Based on that, we can see that most of the words are pretty positive. 


## Step 6: Bar Graph

To have a more quantitative count of whether most of the words are positive or negative, let's create a bar graph to plot the most common words for comparison.


<div class="mw7 center ph3-ns">
  <div class="cf ph2-ns">
    <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_FF71F1817FD0467B91E1AB01E2167FB4EDE73E37736388AA82F394904A59955A_1547174202145_image.png" alt="Most Common Terms Bar Chart"/>
	</div>
</div>


As we can see from above, "not" is one of the top 20 words used in all of the tweets. When compared to the amount of times "is" was used in the tweets, the difference between the times "is" was used and "not" was used is around 1200 times, meaning that most of the times is was used are for positive reasons as opposed to negative.


## Step 4a: Counting the most common hashtags

Now that we have the most common terms, let’s see what the most common hashtags are. We’ll use the same for loop we used for the most common terms. 

```python
# Count hastags only
terms_hash = [word for line in tokenized_tweet 
for word in line if word.startswith('#')]
count_hashtags = Counter()
count_hashtags.update(terms_hash)
print(count_hashtags.most_common(15))

# Results
[('#christmas', 41), ('#diehard', 37), ('#diehardchristmas', 26), ('#diehardisachristmasmovie', 19), ('#yippeekiyay', 7), ('#1', 6), ('#merrychristmas', 6), ('#christmasmovies', 5), ('#die', 5), ('#2', 4), ('#3', 4), ('#lapd', 4), ('#nypd', 4), ('#movies', 4), ('#boxing', 4)]
```

We can see that most of the hashtags used are either positive or neutral, but none of the top 15 hashtags are negative. 


## Step 5a: WordCloud

Now let’s visualize the hashtags to see if there are any negative hashtags in our data. 

<div class="mw7 center ph3-ns">
  <div class="cf ph2-ns">
    <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_FF71F1817FD0467B91E1AB01E2167FB4EDE73E37736388AA82F394904A59955A_1547232234511_image.png" alt="Most Common Hashtags WordCloud"/>
	</div>
</div>

As we can see, there’s only one negative hashtag that we can see from our data. 


## Step 6a: Bar Chart

Let’s see what our bar graph shows us. 

<div class="mw7 center ph3-ns">
  <div class="cf ph2-ns">
    <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_FF71F1817FD0467B91E1AB01E2167FB4EDE73E37736388AA82F394904A59955A_1547232399191_image.png" alt="Most Common Hashtags Bar Chart"/>
	</div>
</div>

As we can see, the negative hashtag is not even in our top 20 hashtags in all of our tweets. 


## Step 4b and 6b: Counting the most common term co-occurrences 

They say context is key, and with the most common words, we don’t really know the context of how they were used positively or negatively, especially the word “is”.  To get some clarity on that, I will find the co-occurrences to find out the context of some of these terms. I will build a co-occurrence matrix such that com[x][y] contains the number of times the term x has been seen in the same tweet as term y. 

Using the defaultdict function from the collections library we will build a co-occurrence matrix. The defaultdict function takes a function object as an argument and will return a value, in our case an integer. This will help facilitate our calculation of the probability of observing the terms individually and occurring together.

```python
# co-occurences matrix 
from collections import defaultdict
 
com = defaultdict(lambda : defaultdict(int))
 
for line in tokenized_tweet: 
    terms_only = [term for term in line 
                  if not term.startswith(('#', '@'))]

    # Build co-occurrence matrix
    for i in range(len(terms_only)-1):            
        for j in range(i+1, len(terms_only)):
            w1, w2 = sorted([terms_only[i], terms_only[j]])                
            if w1 != w2:
                com[w1][w2] += 1
                
com_max = []
# For each term, look for the most common co-occurrent terms
for t1 in com:
    t1_max_terms = sorted(com[t1].items(), key=operator.itemgetter(1), reverse=True)[:5]
    for t2, t2_count in t1_max_terms:
        com_max.append(((t1, t2), t2_count))

# Get the most frequent co-occurrences
coterms_max = sorted(com_max, key=operator.itemgetter(1), reverse=True)
print(coterms_max[:20])
```

Let’s see the distribution via a bar graph. 

<div class="mw7 center ph3-ns">
  <div class="cf ph2-ns">
  <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_FF71F1817FD0467B91E1AB01E2167FB4EDE73E37736388AA82F394904A59955A_1547233943586_image.png" alt="Most Common Co-Occurrences Bar Chart"/>
	</div>
</div>

We can see that the top three are the words that we queried being used together, which makes sense. However, what is interesting is negative words, such as "no" or "not", are not in the most common co-terms. We could infer from this that most of the opinions are positive rather than negative. 


## Step 7: Co-Occurrences Search

Using our co-occurrence matrix, we can also look for a specific term and extract its most frequency co-occurrences. To do this, we simply modify the main loop. Let’s try this with the word “is”:

```python
search_word = 'is'
count_search = Counter()
for line in tokenized_tweet: 
    terms_only = [term for term in line 
                  if not term.startswith(('#', '@'))]
    if search_word in terms_only:
        count_search.update(terms_only)
print('Co-occurence for %s:' % search_word)
print(count_search.most_common(20))

# Result
Co-occurence for is:
[('is', 1537), ('christmas', 1496), ('hard', 1188), ('die', 1172), ('movie', 1122), ('the', 781), ('and', 350), ('to', 335), ('it', 287), ('of', 270), ('that', 250), ('not', 233), ('in', 179), ('you', 175), ('on', 174), ('for', 145), ('this', 142), ('if', 141), ('my', 128), ('but', 120)]
```

Based on our original count of most common words and from the above, we know that “is” was used 1,537 times and out of those times, it was only used with “not” 233 times. This would suggest that most of the times that “is” was used was for positive reasons, and would, therefore, mean that most people do think that Die Hard is a Christmas movie. 

In my next post, I’ll be delving into sentiment analysis using Peter Turney’s technique and the TextBlob library. 

Thanks for reading! 
