---
title: "Yippee Ki-Yay: Is Die Hard really a Christmas movie? The End."
date: "2019-01-17"
hero-image: "nycw.jpg"
---

# Welcome to the End, Friends! 

That sounds a little grim, but we have finally reached the conclusion of my project! Now that I’ve shown you how to [extract tweets from Twitter](/blog/diehard-pt1), [parse through the words and tokenize them](/blog/diehard-pt2), and [perform simple sentiment analysis techniques](/blog/diehard-pt3), let’s summarize our results and make some conclusions. 

# Results

## Pointwise Mutual Information Results

With the Pointwise Mutual Information (PMI) technique, we found the semantic orientation and assigned a negative or positive association to the words found in our tweets. Using this, we found the orientation of our three query words, “Die”, “Hard”, and “Christmas”, as follows: 

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 13px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 13px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg .tg-5itv{font-style:italic;background-color:#c2d5db;color:#333333;text-align:center;vertical-align:top}
.tg .tg-11wo{font-weight:bold;font-family:Arial, Helvetica, sans-serif !important;;background-color:#89a9b4;color:#ffffff;border-color:inherit;text-align:center;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-dvpl{border-color:inherit;text-align:right;vertical-align:top}
.tg .tg-crfj{font-style:italic;background-color:#c2d5db;color:#333333;text-align:left;vertical-align:top}
</style>
<table class="center tg">
  <tr>
    <th class="tg-11wo">Word</th>
    <th class="tg-11wo">Semantic Orientation</th>
  </tr>
  <tr>
    <td class="tg-0pky">Die</td>
    <td class="tg-dvpl">-0.019899</td>
  </tr>
  <tr>
    <td class="tg-0pky">Hard</td>
    <td class="tg-dvpl">0.976432</td>
  </tr>
  <tr>
    <td class="tg-0pky">Christmas</td>
    <td class="tg-dvpl">1.060167</td>
  </tr>
  <tr>
    <td class="tg-crfj">Average</td>
    <td class="tg-5itv">0.672233333333333</td>
  </tr>
</table>

As we can see, the only word with a negative association is “Die”. It is worth noting, however, that the word itself has a negative connotation to it as well. The same could be said with “Christmas” with it being a holiday that it would have a positive connotation as well. However, remember, we only extracted tweets that contained all three words. With that being said, the average semantic orientation of these three words is **0.67223** which is a fairly high positive number. From this, we can conclude that most of our tweets are positive and therefore, most people think that Die Hard is a Christmas movie.. *Right?*


## TextBlob

We next used the TextBlob library to perform our second technique of sentiment analysis and found the following: 

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 13px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 13px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg .tg-11wo{font-weight:bold;font-family:Arial, Helvetica, sans-serif !important;;background-color:#89a9b4;color:#ffffff;border-color:inherit;text-align:center;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-dvpl{border-color:inherit;text-align:right;vertical-align:top}
</style>
<table class="center tg">
  <tr>
    <th class="tg-11wo">Word</th>
    <th class="tg-11wo">Semantic Orientation</th>
  </tr>
  <tr>
    <td class="tg-0pky">Positive</td>
    <td class="tg-dvpl">36.020992366412216%</td>
  </tr>
  <tr>
    <td class="tg-0pky">Neutral</td>
    <td class="tg-dvpl">3.435114503816794%</td>
  </tr>
  <tr>
    <td class="tg-0pky">Negative</td>
    <td class="tg-dvpl">60.54389312977099%</td>
  </tr>
</table>

Using the Naive Bayes Classifier, I trained the classifier to identify positive and negative tweets based on some excerpts I took from our data. However, even though I did this, when looking at the sentiments of some of the tweets, the sentiments were inaccurate. For example, “I guess Die Hard is a Christmas movie” was labeled as negative, when it should be positive. So does that mean Die Hard isn’t a Christmas movie? 

# Conclusion

## *Die Hard is a Christmas movie.*

Yes, I said it, and I know it’s controversial, but based on all of our analyses, that’s what the data supports. Based on our two sentiment analysis techniques, yes, we got two different answers. However, as I mentioned in my part 3 of this project/tutorial, there are limitations to both of these techniques, which is why we did some of those data visualizations and counts of the most common words, hashtags, and co-occurrence terms. 

One of the biggest indications that Die Hard is a Christmas movie is our count of hashtags. 

<div class="mw7 center ph3-ns">
  <div class="cf ph2-ns">
    <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_FF71F1817FD0467B91E1AB01E2167FB4EDE73E37736388AA82F394904A59955A_1547232399191_image.png" alt="Most Common Hashtags Bar Chart"/>
    </div>
</div>

As we can see from the bar chart, the fourth common hashtag is “#diehardisachristmasmovie”. Alternatively, none of the negative hashtags related to our tweets made it to the top 20 most common hashtags, which would indicate that more people think Die Hard is a Christmas movie rather than not. 

To further support this viewpoint, let’s take a look at Google searches over the past 3 years.

<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/1709_RC01/embed_loader.js"></script> <script type="text/javascript"> trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"die hard","geo":"US","time":"2016-01-01 2019-01-16"}],"category":0,"property":""}, {"exploreQuery":"date=2016-01-01%202019-01-16&geo=US&q=die%20hard","guestPath":"https://trends.google.com:443/trends/embed/"}); </script> 

From the above, right around Christmas time, the Google searches related to Die Hard increases. This past Christmas, especially, there was a significant increase in Google searches for Die Hard. Even if we take a look at the YouTube searches, we’ll see a significant increase right around the holidays.

<script type="text/javascript" src="https://ssl.gstatic.com/trends_nrtr/1709_RC01/embed_loader.js"></script> <script type="text/javascript"> trends.embed.renderExploreWidget("TIMESERIES", {"comparisonItem":[{"keyword":"die hard","geo":"US","time":"2016-01-01 2019-01-16"}],"category":0,"property":"youtube"}, {"exploreQuery":"date=2016-01-01%202019-01-16&geo=US&gprop=youtube&q=die%20hard","guestPath":"https://trends.google.com:443/trends/embed/"}); </script> 

We can see that in both cases, the searches for Die Hard increase right around the holidays, which is a good indication that most people do enjoy, search, and, or watch Die Hard during Christmas. 

So there you have it, we can finally settle this debate once and for all, 

<header class="tc ph4">
  <h1 class="f3 f2-m f1-l fw6 black-90 mv3">
    Die Hard is a Christmas movie.
  </h1>
</header>



<div class="pa4">
  <blockquote class="ml0 mt0 pl4 black-90 bl bw2 b--washed-green">
    <p class="f5 f4-m f3-l lh-copy measure mt0">
A Few Notes

- Tweets were pulled on the evening of Christmas (December 25, 2018) and the Twitter API pull was stopped once I had gotten 2,111 tweets. 
- As mentioned, there are some limitations to both the PMI technique and the TextBlob technique as evidenced in my tutorial in [Part 3](/blog/diehard-pt3). 
- [Google trends](https://trends.google.com/trends/?geo=US) were pulled for the period between January 1, 2016 to January 16, 2019. 
    </p>
</blockquote>
</div>

<header class="tc ph4">
    <h1 class="f3 f2-m f1-l fw2 black-90 mv3">
    Thank you for reading and....
  </h1>
</header>

<div class="db center mw5">
  <div class="center">
    <img src="https://media1.tenor.com/images/bc7cc0686c4f6f5ac70aea8d130e460b/tenor.gif" alt="Die Hard Yippe Ki Yay Motherfucker GIF from Tenor"/><script type="text/javascript" async src="https://tenor.com/embed.js"></script> 
    </div>
</div>

