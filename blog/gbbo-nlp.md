---
title: "The Great NLP Bake Off"
date: "2019-07-28"
hero-image: "nlp_badge.jpg"
---


# Ready, Set, BAKE

One of my not-so-secret obsessions is the British television show, the Great British Bake Off or as I like to call it, GBBO. Being an avid baker myself, it’s so entertaining and mesmerizing to see all of these amazing home bakers make these amazing creations from scratch. The show is such a stark contrast to American competition shows because of how pleasant and supportive all of the contestants are to one another. There are never any insults or shit talking, just a lot of encouragement and, sometimes, consoling when a contestant is feeling down. Their relationships and the relationships between the contestants and the hosts and judges are some of my favorite parts of the show. It’s also a great show to wind down to after a stressful day.

With this in mind, I wanted to see what insights and trends I could get from the dialogue throughout the seasons, including what topics recurred over the seasons/episodes, if there was a way to determine what flavors tended to relate to one another, and if I could use sentiment analysis as well as topic modeling to see if these would corroborate my thoughts on the show and to uncover some trends over the seasons.

# Technical Challenge

To do my analysis, I decided to use the subtitles for the first four seasons of GBBO that are available on Netflix which ended up being 40 episodes in total. I chose the first four seasons, seasons 1 through 4, to keep some consistency but also because I have a bias towards the original judges and hosts of the show, Mary Berry, Mel and Sue. Seasons 5 and 6 have a new judge who joined Paul Hollywood, one of the original judges and two new hosts hosts.

Using Netflix, I downloaded the subtitles for all of the episodes from these seasons in VTT files. Luckily for me, there was a python VTT library that I allowed me to read in the VTT files and format. Once they were read in, I parsed each file and created a list of dictionaries organized by episode and text. Using the list of dictionaries, I, then, created a DataFrame.

```python
    for e in episodes:
        episode = {}
        episode['episode_num'] = e
        episode['season'] = e[:2]
        episode['episode'] = e[2:]
        vtt = webvtt.read('gbbo_{}.vtt'.format(e))
        episode['text'] = " ".join([ele.text for ele in vtt])
        data.append(episode)
```

To achieve what I want to do with all of the subtitles, I had to separate each episode into individual dialogue by speaker using RegEx. Once I had speaker and dialogue separated, I used the SpaCy library to lemmatize words, to remove stop words and to tokenize the dialogue. I then used scikit-learn’s TF-IDF implementation to create a matrix of each dialogue’s word frequency vector. I chose TF-IDF over other vectorizers because it took into account the word count disparities as the dialogue for certain people and in certain episodes were shorter or longer than others. For more information on how I pre-processed, check out my [Github](https://github.com/amyksu/great-nlp-bake-off).


## Topic Modeling

With the subtitles, I decided to use Non-Negative Matrix Factorization, or NMF, for topic modeling. Unlike its probabilistic counterpart, Latent Dirichlet Allocation, or LDA, NMF uses linear algebra to factor high-dimensional vectors into a low-dimensionality representation. Both methods take a bag of words matrix (documents * words) as input. The bag of words matrix represents documents as rows and words as columns and in both methods, the goal is to produce 2 smaller matrices: a document to topic matrix and a word to topic matrix. When these two matrices are multiplied together, they would reproduce the bag of words matrix with the lowest error.

Using NMF, I created a function that would take in the model name, feature names, number of top words to show, and topic names. 

```python
    def display_topics(model, feature_names, no_top_words, topic_names=None):
        for ix, topic in enumerate(model.components_):
            if not topic_names or not topic_names[ix]:
                print("\nTopic ", ix)
            else:
                print("\nTopic: '",topic_names[ix],"'")
            print(", ".join([feature_names[i]
                            for i in topic.argsort()[:-no_top_words - 1:-1]]))
```

Eventually, I landed on 8 topics: 

![GBBO Topics](https://paper-attachments.dropbox.com/s_E83A0991D16F85D0F734E8C332A054CEC6C641F278616755C508C0D3F557D050_1566785621406_image.png)

## Word2Vec

I then used gensim’s Word2Vec to create word vectors to find word clusters that are most similar to one another. I did this to see which words were most similar to each other in hopes of seeing whether certain flavors appeared with certain baked goods.

To show the results of my pre-trained Word2Vec embedding, I used TSNE to plot a subset of similar words. I applied TSNE to the matrix to project each word to perform dimensionality reduction to present the words in a 2D space. The subset of words I chose were:

- Cake
- Pie
- Pastry
- Eggs
- Bread
- Winner
- Raspberry
- Technical
- Chocolate


![TSNE Plot](https://paper-attachments.dropbox.com/s_E83A0991D16F85D0F734E8C332A054CEC6C641F278616755C508C0D3F557D050_1566786001311_image.png)

Based on the above, the main takeaways were:

- The word “winner” is most similar to “bread” and “technical” which, as a devoted fan of the show, is true as most winners are good at technicals and usually win bread week.
- The word cake is most similar to the flavors “chocolate” and “raspberry”.
- The words “pie”, “pastry”, and “egg” are most similar and closest to each other which makes sense because a lot of the pie crusts made by the bakers are pastry crusts. In addition, it makes sense that eggs are close to both words as eggs are used for pastry and pie crusts to give them the shiny brown crispy look.

## Sentiment Analysis 

To gain further insights, I used Vader for sentiment analysis over all of the seasons. I used this to compare the sentiment over each of the contestants over the seasons as well as the judges to see whether there were any trends in whether either judge was more negative or positive than the other.

From my sentiment analysis, I plotted the overall sentiment by episode between the male and female judges and contestants. When looking at the average, it’s hard to see an overall trend, but when you single out each sentiment, it’s a little easier to see overall trends. When looking at the individual sentiments, in the second and fourth seasons, the males were more negative than the females. In the first and third seasons, it was the opposite. This is further supported when looking at the individual positive sentiment. When it comes to the judges, Mary was more positive than Paul in most of the seasons up until the fourth season.

I created a Tableau dashboard showing the topic makeup and sentiment trends over the episodes/seasons.

<div class='tableauPlaceholder' id='viz1566789740825' style='position: relative'><noscript><a href='http:&#47;&#47;www.amyksu.com'><img alt='Great British Bake Off Episode and Season Trends' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Gr&#47;GreatBritishBakeOffNLPAnalysis&#47;FinalDashboard&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='GreatBritishBakeOffNLPAnalysis&#47;FinalDashboard' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;Gr&#47;GreatBritishBakeOffNLPAnalysis&#47;FinalDashboard&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1566789740825');                    var vizElement = divElement.getElementsByTagName('object')[0];                    if ( divElement.offsetWidth > 800 ) { vizElement.style.width='800px';vizElement.style.height='827px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='800px';vizElement.style.height='827px';} else { vizElement.style.width='100%';vizElement.style.height='1427px';}                     var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>

## TLDR 

If you just want to skip ahead, here's a presentation I made on my project.

<iframe src="https://www.icloud.com/keynote/0R7Z6hh2V2uy1JHJrMUJIjXqg?embed=true" width="640" height="500" frameborder="0" allowfullscreen="1" referrer="no-referrer"></iframe>

# Until Next Time

In the future, I would love to delve deeper into seeing if there was a way to predict which flavors tend to yield more positive judging from the judges and whether I can predict what flavors will win. Overall, I would like to focus more on the actual baking on the show and get more information on the ingredients and the baking on the show.

Thanks for reading 🙂 and I hope my project didn’t make you too hungry the way it did to me. 
