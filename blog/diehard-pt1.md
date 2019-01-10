---
title: "#Yesitis or #Noitsnot: Is Die Hard really a Christmas movie?"
date: "2019-01-10"
hero-image: "DH.jpg"
---

# #DieHardChristmas ? 

One of the great debates trending Twitter every holiday season is whether or not Die Hard is in fact a Christmas movie. This year, we seemed to get even more confirmation that Die Hard is a Christmas classic from [Fox](https://www.youtube.com/watch?v=4Wi28Vsi_ZU), the [NYPD](https://twitter.com/NYPDnews/status/1077236447848075264) and the [LAPD](https://twitter.com/LAPDHQ/status/1077250973926535169). I mean what’s more Christmas than Bruce Willis as NYPD detective John McClane saving his estranged wife and her coworkers from Hans Gruber and his team of terrorists when they attack their holiday party at Nakatomi Plaza. *(Fun Fact: Nakatomi Plaza is actually Fox’s main corporate building, Fox Plaza, soon to be Disney Plaza.)* Like Santa, Bruce has to shimmy through small spaces, his being the ventilation system, so what more do you need to convince you? 

*On the other hand*, just because a movie takes place during Christmas, doesn’t necessarily mean it’s a Christmas movie. Many argue, in fact, that technically, the movie could take place on any other day than Christmas and still work. I mean, Lethal Weapon is set during Christmas and even includes a Jingle Bell Rock opening, but you don’t hear *as many* people debating whether that’s a Christmas movie or not. Also, do hand guns and semi-automatic weapons really have a place in a true Christmas movie? 

So, is Die Hard ***really*** a Christmas movie?

For my first soiree into sentiment analysis, I decided to use Twitter’s API to determine whether the public truly thinks Die Hard is a Christmas movie or not. In my project, I will be showing how I: 

  1. Extracted twitter data using the TwitterAPI library
  2. Do some basic statistics and visualizations using numpy, matplotlib, seaborn, and WordCloud.
  3. Do sentiment analysis of extracted tweets (2,100 tweets from Christmas Day) using Peter Turney ‘s technique mentioned in his paper [Thumbs Up or Thumbs Down? Semantic Orientation Applied to Unsupervised Classification of Reviews](https://arxiv.org/abs/cs/0212032) as well as TextBlob. 

I split all three segments into three separate code repo’s and they can all be found on my [Github repository](https://github.com/amyksu/).

# Extracting Twitter data

The first step in my project was to extract and scrape Twitter’s API to get tweets relating to Die Hard and Christmas. 


## Step 1: Import Libraries

To do this, I first loaded all of the libraries to facilitate this task. 

```python
    # code to scrape Twitter API
    import re # To match or find strings or set of strings
    import os # To use operating system dependent functionality
    import csv # To read to CSV
    import itertools # To create iterators for efficient looping
    import collections # To store elements 
    from TwitterAPI import TwitterAPI, TwitterPager # To extract from Twitter's API
```

## Step 2: Write to File

Using the csv library, I created a file that would store all of the tweets that will be extracted from Twitter.

```python
    # File to write
    file = csv.writer(open("die-hard-tweets-no-retweets.csv", "w+", 
      encoding="utf-8"))
```

## Step 3: Initialize Twitter API

In order to extract tweets from Twitter, we need to have a Developer account and to create an app. To do this, you’ll use this link which will then provide you with:

  - Consumer Key
  - Consumer Secret
  - Access Token
  - Access Token Secret 

All of these keys/tokens will be entered into the script to access and extract from Twitter

```python
    # Initialize Twitter API
    api = TwitterAPI(<consumer key>,
                    <consumer secret>,
                    <access token key>,
                    <access token secret>)
```

## Step 4: Query Tweets and write into file 

With the API initialized and authenticated, the next step is to query the tweets by keywords and extract and write them into our file. I will query the tweets using the words, “Die Hard Christmas” and will filter out any retweets as to avoid duplicate tweets. 

```python
    # Query tweets
    r = TwitterPager(api, 'search/tweets', {'q': 'Die Hard Christmas-filter:retweets', 
      'tweet_mode': 'extended'})
    
    # Write tweets into file
    for item in r.get_iterator():
            row = item['full_text'] if 'full_text' in item else ''
            row = row.replace("\n", " ")
            print(row)
            file.writerow([row])
```

Now, we have our tweets! I stopped the query once I got to around 2,100 tweets for ease of working with the data, and I'll stop here for now also. 

In the next post, I'll be cleaning our tweets and analyzing word patterns. Thanks for reading! 
