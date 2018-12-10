---
title: "LA vs SF: Which city has the most diverse restaurant scene?"
date: "2018-12-10"
hero-image: "LA.jpg"
---


# Pero why? 

Los Angeles versus San Francisco. Just google the two cities and you’ll find countless articles comparing the two. I would know since I just did. Having grown up in Southern California (or SoCal as us locals like to say) and going to school in LA, I have a greater affinity to the city. However, after meeting and making friends with a bunch of NorCal kids in college, I started to think, “Huh, maybe NorCal is cool too.” I even contemplated moving there, but alas, the expensive rent and cold weather was enough to stick to my beautiful, less expensive LA. 

A point of contention between my NorCal friends and I is our opinions on the two cities’ foods. I am and have always been of the mindset that because LA spans such a large area and there are so many pockets of cultural hubs, we would have the more diverse restaurant scene. My SF friends argue that the scene up there is just better (not a great argument, but so be it), and therefore, not only would the food itself be better, but the diversity of the cuisines would also be better. With this in mind, I decided to back my argument up with some data to truly see if LA or SF has the most diverse cuisine. 


# Methodology

To perform this analysis, I pulled the data from Yelp, scrubbed the data, then performed an analysis based on the USA Today Diversity Index. The USA TODAY Diversity Index, created by Phil Meyer of the University of North Carolina and Shawn McIntosh of USA Today, is a probability-based index with a range from 0 to 1 that represents the chance that two people chosen randomly from an area will be different by race and ethnicity. A higher number means more diversity, a lower number, mean less. A value of zero would apply to a population in which everyone was the same on every ethnic dimension. If every person was different from every other person on at least one dimension, the index value would be one. 

Because the calculation was probability based and normalizes for population amount, I used this definition and calculation to determine the food diversity index for both LA and SF. 

**Note**: The index performed by USA Today used the races defined in the Census review performed every ten years (i.e. Black, White, Asian/Pacific Islander). As the data I extracted from Yelp includes multiple countries, I treated each country as the basis of every “race” that was used in the USA Today calculation. 

# Procedures

First, I pulled and scrubbed the data from Yelp’s API. I chose Yelp, as opposed to other platforms such as Google Businesses and Foursquare, simply because Yelp is free and had all the information I needed for my analysis, such as categories and the ability to filter by location. The only downside to using Yelp was that I can only get 1,000 businesses per endpoint. To minimize the possibility of missing any businesses, I exported the businesses by zip code. Using zip codes, especially in LA, made it easier to ensure there would be no overlaps. In addition, it allowed me to also select the area which I consider to be LA but are technically listed as their own cities, such as Santa Monica, Culver City, Venice Beach, Marina Del Rey, and Beverly Hills. 

## Getting the Data
I used the following script to export the data. As mentioned earlier, only 1,000 businesses can be exported per endpoint. 

```python
    import os
    import csv
    import itertools
    import collections
    from yelpapi import YelpAPI
    
    #LA Zip codes
    la_zip = ['90004','90005','90006','90007','90008','90010','90012','90013','90014','90015','90016','90017','90018','90019','90020','90021','90023','90024','90025','90026','90027','90028','90033','90034','90035','90036','90039','90042','90043','90046','90048','90049','90056','90057','90064','90065','90066','90067','90068','90069','90071','90077','90079','90094','90210','90211','90212','90230','90232','90291','90292','90401','90401','90402','90403','90405']
    
    #SF zip codes 
    sf_zip = []
    
    #Flatten
```


## Scrubbing the Data

Using the categories section exported from Yelp, I created a master cuisine list to categorize all of the restaurants. For analysis purposes, only the categories that were location/ethnicity specific were used. See below:

```python
    cuisines = ['Latin','Afghan','American','Arabian','Armenian','Asian Fusion','Austrian','Basque','Belgian','Brazilian','British','Burmese','Cajun/Creole','Cantonese',
    'Caribbean','Chinese','Colombian','Cuban','Czech','Ethiopian','Egyptian','Filipino',
    'French','German','Greek','Guamanian','Hawaiian','Halal','Haitian',
    'Himalayan/Nepalese','Honduran','Hungarian','Indian','Indonesian','Italian','Irish',
    'Japanese','Korean','Lebanese','Laotian','Malaysian','Mediterranean','Mexican',
    'Middle Eastern','Modern European','Mongolian','Moroccan','Nicaraguan','Pakistani',
    'Persian/Iranian','Peruvian','Polish','Puerto Rican','Russian','Sardinian',
    'Scandinavian','Shanghainese','Singaporean','Spanish','Syrian','Szechuan','Taiwanese','Thai','Turkish','Venezuelan','Vietnamese','Argentine','Australian','African',
    'Bangladeshi','Salvadoran']
```

Next, I created the following function to assign one of the above cuisines to each restaurant exported from Yelp. The categories column of the data is listed as a dictionary. As such, I extracted the ‘title’ or the index data from the categories section to compare to the cuisine list to obtain the finalized cuisine. This was then appended to the row: 

```python
    #assigning cuisines using categories column
    def find_cuisine(categories):
        for category in categories:
            # check if `title` matches any item in `cuisines`
            # if so, then we append matching cuisine to `row`
            for cuisine in cuisines:
                if cuisine in category['title']:
                # get the cuisine and append it.
                    return cuisine
        return 'NA'
```

Using this information, I created a new column with the final categorized cuisine using the code below. Unfortunately, the information exported from Yelp’s API also included businesses other than restaurants as well as additional headers that resulted from combining all of the individual zip code lists. In order to capture those cases, I used an if statement to capture these unique cases: 

```python
    #to drop additional header rows that resulted from combining multiple files
    #removed the headers
    la = la[la.id != 'id']
    sf = sf[sf.id != 'id']
    
    #use above to assign create a new column with a list of cuisines
    for i, row in la.iterrows():
        if row[0] == "n's" in row[7]:
            continue
        categories = json.loads(row[7].replace("\'", "\""))
        cuisine = find_cuisine(categories)
        la.at[i, 'cuisines'] = cuisine
    
    for i, row in sf.iterrows():
        if row[0] == "n's" in row[7]:
            continue
        categories = json.loads(row[7].replace("\'", "\""))
        cuisine = find_cuisine(categories)
        sf.at[i, 'cuisines'] = cuisine
    
    #To remove businesses other than restaurants, removed NAs from cuisines column 
    la = la[la.cuisines != 'NA']
    sf = sf[sf.cuisines != 'NA']
```

Using the cleaned data, I used my own version of USA Today’s Diversity Index calculation to perform my analysis. The basis of the USA Today Diversity Index is calculated as such:

  1. For each race, calculate its frequency as a proportion of the whole population. The result is equal to the probability that one person, or in my case, restaurant at random will be of that race/country. 
  2. Square the proportion. The probability that two people (or restaurants) chosen at random will be of that particular race is the single probability multiplied by itself (squared). 
  3. Sum the squared probabilities for the separate races. This is the probability that two people are of the same race. 

As noted above, the original USA Today diversity index calculation, only 5 races (White, Black, American Indian, Asian as well a Hispanic and non-Hispanic category were used to calculate the diversity index. In my calculation, I treated each cuisine found as a different race.

Knowing this, I created the following function which would take the distribution table of each city and spit out the diversity index:

```python
    def diversity_index(list_of_count):
      diversity_idx = 0
      total_probability = 0 
      total = list_of_count.sum()
      for count in list_of_count:
        probability = (count/total) ** 2 
        total_probability += probability 
      diversity_idx = 1 - total_probability 
      return diversity_idx
```

# Results

The diversity index for the two cities were as follows: 

| City               | Diversity Index |
| :----------------- | --------------: |
| Los Angeles, CA    | 0.90461041      |
| San Francisco, CA  | 0.91032866      |
| Difference         | 0.0057182       |

As you can see from the above, SF barely edges out LA by .0057, meaning SF is more diverse than LA. To get a better understanding of the meaning behind this, let’s see how the distribution differs. 

<img class="db w-100 mt3 mt4-ns" src="https://d2mxuefqeaa7sj.cloudfront.net/s_3051722221C3CC2A85369C9ABA888BEA7A9D43682B1D92775107EE03091A4CBC_1541143363557_lad.png" alt="Los Angeles Cuisine Frequency Distribution" />

![](https://d2mxuefqeaa7sj.cloudfront.net/s_3051722221C3CC2A85369C9ABA888BEA7A9D43682B1D92775107EE03091A4CBC_1541143148987_lad.png)


Based on the above, there are 59 unique cuisines in LA and 60 unique cuisines in SF with a number of overlaps, which could explain why SF has a slightly larger diversity index. 

Here are the cuisines unique to each city:

| LA Unique Cuisines | Restaurant Count |
| ------------------ | ---------------- |
| Armenian           | 25               |
| Venezuelan         | 16               |
| Lebanese           | 15               |
| Honduran           | 13               |
| Bangladeshi        | 12               |
| Arabian            | 3                |

| SF Unique Cuisines | Restaurant Count |
| ------------------ | ---------------- |
| Afghan             | 14               |
| Basque             | 14               |
| Czech              | 10               |
| Hungarian          | 8                |
| Malaysian          | 8                |
| Guamanian          | 6                |
| Sardinian          | 5                |

When we look at the charts above, you can see that the distribution of cuisines in SF are not as evenly distributed as LA. There are much more American restaurants than there are any other cuisine. Whereas in LA, the top 3 cuisines are fairly well distributed. 

To further understand this relationship, I created a pie chart to represent the total percentage of each cuisine in each of the cities. I created a new “Other” category for any cuisines under 1%:

![](https://d2mxuefqeaa7sj.cloudfront.net/s_3051722221C3CC2A85369C9ABA888BEA7A9D43682B1D92775107EE03091A4CBC_1541188230322_LApie.png)
![](https://d2mxuefqeaa7sj.cloudfront.net/s_3051722221C3CC2A85369C9ABA888BEA7A9D43682B1D92775107EE03091A4CBC_1541188225521_SFpie.png)


As we see above, almost a quarter of the restaurants in SF are American, while in LA the top three cuisines, Mexican, American, and Korean, make up a little less than half of the restaurant scene. In addition, with the creation of the “Other” category, the combination of all the cuisines that made up less than 1% of the distribution accumulated to a fairly large amount of the complete food scene. Also, worth noting, in comparing the categories after the combination, LA had greater diversity of cuisines, 17 including “Other”, than SF, 16 including “Other”. This supports my idea that though SF technically has more types of cuisines, LA has a more evenly distributed food scene that is not overly saturated by just one cuisine. 

Conclusion

From the data and my calculations, I found the following: 

  - Based on the USA Today Diversity Index, SF’s food scene is more diverse than LA’s food scene. 
    - This slight difference can be attributed to the fact that SF has 60 unique ethnic cuisines as opposed to LA which has 59.
  - Almost a quarter of SF’s food scene (20.9%) is made up of American restaurants. 
  - The top 3 cuisines in LA, Mexican, American, and Korean, make up a little less than half of LA’s restaurant scene at 17.7%, 16.2%, and 12.8%, respectively. 
  - After combining cuisines that made up less than 1% of the distribution, LA had a greater diversity of cuisines, 17 include ‘Other’, while SF had 16 including “Other”. 

This brings to question, what really is diversity? Is it having the most amount of different and unique cuisines? Or is it having a more evenly distributed food scene that is made up of multiple unique ethnic cuisines. Though LA is made up mostly of 3 cuisines, LA also has a greater percentage of diverse cuisines that make up more than 1% of the food scene, which in my opinion, means that LA has a slightly more diverse restaurant scene, but that could also be my bias talking. 

As with everything in life, what I have found is up to interpretation, but, based on my original method of determination, the Diversity Index, SF is more diverse. 

Full Disclosure(s)

Because my project was limited in scope and information, this is just a sample of a full population that could be studied between SF and LA. With more information, it would be interesting to see how the distribution of each cuisine across a map of LA and SF and how that reflects the neighborhoods within each city. I would have also liked to have used Census data to compare the diversity of both LA and SF to see if the food diversity is an accurate reflection of the actual cities’ population diversity as well. 

Other interesting things I wish I could have done: 

  - An analysis of the food scene over time. Has SF/LA gotten more or less diverse over time?
  - An analysis on food price. What is the distribution of restaurants at different price points and what does that say about the people who frequent those places? What is the difference of these distributions in both SF and LA and what does this mean about the two cities? 
  - Was the Diversity Index really the best method? Sure I did my research, but I would maybe have tried a different approach to determining my question such as a chi-squared test. 

 


- maybe can compare this diversity to Census data of those cities? would be interesting to see if there was a big diff or not.
- maybe expand SF to the entire bay area? SF is getting priced out by white tech bros. would be interesting to compare metropolitan SF vs. metropolitan LA.
- trends over time. has SF gotten more or less diverse over time? has LA gotten more or less diverse? would be cool to look at that, and then to explore why. both cities have grown in population X% year over year for the past 30+ years i’m guessing. where are those people coming from?
- would be interesting to see like. diversity of food, but what about diversity of food prices. the distribution of restaurants at the $, $$, $$$, and $$$$. and what does that say about the people who frequent those places, or the people who are keeping those places alive by patroning them? what do the differences in SF vs. LA mean about those cities?
- what are the limitations  of the diversity index? sure SF eked out higher diversity index by 0.005, but is it really more diverse if 25% of the food is “white”? maybe you can explain the limitations of the diversity index and propose a different approach next time that compared how different the distribution is to a uniform distribution (chi-squared test: https://stats.stackexchange.com/questions/363121/social-inequality-measure-based-on-chi-square)