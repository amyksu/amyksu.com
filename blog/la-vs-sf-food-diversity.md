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

**Note**: The index performed by USA Today used the races defined in the Census review performed every ten years (i.e. Black, White, Asian/Pacific Islander). As the data I extracted from Yelp includes multiple countries in its "Categories" column, I treated each country as the basis of every “race” that was used in the USA Today calculation. 

# Procedures

First, I pulled and scrubbed the data from Yelp’s API. I chose Yelp, as opposed to other platforms such as Google Businesses and Foursquare, simply because Yelp is free and had all the information I needed for my analysis, such as categories and the ability to filter by location. The only downside to using Yelp was that I could only get 1,000 businesses per endpoint. To minimize the possibility of missing any businesses, I exported the businesses by zip code. Using zip codes, especially in LA, made it easier to ensure there would be no overlaps. In addition, it allowed me to also select the area which I consider to be LA but are technically listed as their own cities, such as Santa Monica, Culver City, Venice Beach, Marina Del Rey, and Beverly Hills. 

To see how I exported the data from Yelp, please see my [GitHub repository](https://github.com/amyksu/la-vs-sf-food-diversity/blob/master/Yelp%20Data%20Pull.py). 

## Scrubbing the Data

Using the categories section exported from Yelp, I created a master cuisine list to categorize all of the restaurants. For analysis purposes, only the categories that were location/ethnicity specific were used. 

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

Using this information, I created a new column with the final categorized cuisine using the code below. Unfortunately, the information exported from Yelp’s API also included businesses other than restaurants as well as additional headers that resulted from combining all of the individual zip code lists. In order to capture those cases, I used an if statement to capture these unique cases. 

_For full analysis of how I scrubbed the data, please see my [jupyter notebook](https://github.com/amyksu/la-vs-sf-food-diversity/blob/master/LA%20vs%20SF%20Food%20Diversity%20Analysis.ipynb) on my GitHub repository._

## Performing the Analysis
Using the data I cleaned, I used my own version of USA Today’s Diversity Index calculation to perform my analysis. The basis of the USA Today Diversity Index is calculated as such:

  1. For each race, calculate its frequency as a proportion of the whole population. The result is equal to the probability that one person, or in my case, restaurant at random will be of that race/country. 
  2. Square the proportion. The probability that two people (or restaurants) chosen at random will be of that particular race is the single probability multiplied by itself (squared). 
  3. Sum the squared probabilities for the separate races. This is the probability that two people are of the same race. 

As noted above, the original USA Today diversity index calculation, only 5 races (White, Black, American Indian, Asian as well a Hispanic and non-Hispanic category were used to calculate the diversity index. In my calculation, I treated each cuisine found as a different race.

Knowing this, I created the following function which would take the distribution table of each city and spit out the diversity index:

```python
#calculating diversity index
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

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;border-color:#999;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 11px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#999;color:#444;background-color:#F7FDFA;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 11px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#999;color:#fff;background-color:#26ADE4;}
.tg .tg-y999{font-weight:bold;background-color:#ffffff;border-color:#656565;text-align:left;vertical-align:top}
.tg .tg-v59u{background-color:#d7a4a2;border-color:#656565;text-align:right;vertical-align:top}
.tg .tg-dgyl{background-color:#d7a4a2;border-color:#656565;text-align:left;vertical-align:top}
.tg .tg-dsic{background-color:#ffffff;border-color:#656565;text-align:left;vertical-align:top}
.tg .tg-qynr{background-color:#ffffff;border-color:#656565;text-align:right;vertical-align:top}
.tg .tg-6big{font-weight:bold;background-color:#ffffff;border-color:#656565;text-align:right;vertical-align:top}
</style>
<table class="center tg">
  <tr>
    <th class="tg-dgyl">City</th>
    <th class="tg-v59u">Diversity Index</th>
  </tr>
  <tr>
    <td class="tg-dsic">Los Angeles, CA</td>
    <td class="tg-qynr">0.90461041</td>
  </tr>
  <tr>
    <td class="tg-dsic">San Francisco, CA</td>
    <td class="tg-qynr">0.91032866</td>
  </tr>
  <tr>
    <td class="tg-y999">Difference</td>
    <td class="tg-6big">0.0057182</td>
  </tr>
</table>

As you can see from the above, SF barely edges out LA by .0057, meaning SF is more diverse than LA. To get a better understanding of the meaning behind this, let’s see how the distribution differs. 

<div class="w-100 center ph3-ns">
  <div class="cf ph2-ns">
    <div class="fl w-100 w-50-ns pa2">
      <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_3051722221C3CC2A85369C9ABA888BEA7A9D43682B1D92775107EE03091A4CBC_1544486325962_la-dist.png" alt="Los Angeles Cuisine Frequency Distribution"/>
    </div>
    <div class="fl w-100 w-50-ns pa2">
      <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_3051722221C3CC2A85369C9ABA888BEA7A9D43682B1D92775107EE03091A4CBC_1544486336523_sf-dist.png" alt="San Francisco Cuisine Frequency Distribution"/>
    </div>
  </div>
</div>

Based on the above, there are 59 unique cuisines in LA and 60 unique cuisines in SF with a number of overlaps, which could explain why SF has a slightly larger diversity index. 

Here are the cuisines unique to each city:

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;border-color:#999;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 17px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#999;color:#444;background-color:#F7FDFA;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 17px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#999;color:#fff;background-color:#26ADE4;}
.tg .tg-24z0{background-color:#656565;border-color:#656565;text-align:right;vertical-align:top}
.tg .tg-v59u{background-color:#d7a4a2;border-color:#656565;text-align:right;vertical-align:top}
.tg .tg-b23t{background-color:#656565;border-color:#656565;text-align:left;vertical-align:top}
.tg .tg-dgyl{background-color:#d7a4a2;border-color:#656565;text-align:left;vertical-align:top}
.tg .tg-b8sj{background-color:#d7a4a2;text-align:left;vertical-align:top}
.tg .tg-dsic{background-color:#ffffff;border-color:#656565;text-align:left;vertical-align:top}
.tg .tg-qynr{background-color:#ffffff;border-color:#656565;text-align:right;vertical-align:top}
</style>
<table class="center tg">
  <tr>
    <th class="tg-dgyl">Cuisines Unique to LA</th>
    <th class="tg-v59u">Restaurant Count</th>
    <th class="tg-b8sj">Cuisines Unique to SF</th>
    <th class="tg-b8sj">Restaurant Count</th>
  </tr>
  <tr>
    <td class="tg-dsic">Armenian</td>
    <td class="tg-qynr">25</td>
    <td class="tg-dsic">Afghan</td>
    <td class="tg-qynr">14</td>
  </tr>
  <tr>
    <td class="tg-dsic">Venezuelan</td>
    <td class="tg-qynr">16</td>
    <td class="tg-dsic">Basque</td>
    <td class="tg-qynr">14</td>
  </tr>
  <tr>
    <td class="tg-dsic">Lebanese</td>
    <td class="tg-qynr">15</td>
    <td class="tg-dsic">Czech</td>
    <td class="tg-qynr">10</td>
  </tr>
  <tr>
    <td class="tg-dsic">Honduran</td>
    <td class="tg-qynr">13</td>
    <td class="tg-dsic">Hungarian</td>
    <td class="tg-qynr">8</td>
  </tr>
  <tr>
    <td class="tg-dsic">Bangladeshi</td>
    <td class="tg-qynr">12</td>
    <td class="tg-dsic">Malaysian</td>
    <td class="tg-qynr">8</td>
  </tr>
  <tr>
    <td class="tg-dsic">Arabian</td>
    <td class="tg-qynr">3</td>
    <td class="tg-dsic">Guamanian</td>
    <td class="tg-qynr">6</td>
  </tr>
  <tr>
    <td class="tg-b23t"></td>
    <td class="tg-24z0"></td>
    <td class="tg-dsic">Sardinian</td>
    <td class="tg-qynr">5</td>
  </tr>
</table>

When we look at the charts above, you can see that the distribution of cuisines in SF are not as evenly distributed as LA. There are much more American restaurants than there are any other cuisine. Whereas in LA, the top 3 cuisines are fairly well distributed. 

To further understand this relationship, I created a pie chart to represent the total percentage of each cuisine in each of the cities. I created a new “Other” category for any cuisines under 1%:

<div class="mw10 center ph3-ns">
  <div class="cf ph2-ns">
    <div class="fl w-100 w-50-ns pa2">
      <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_3051722221C3CC2A85369C9ABA888BEA7A9D43682B1D92775107EE03091A4CBC_1541188230322_LApie.png" alt="Percentage of Cuisines in Los Angeles"/>
    </div>
    <div class="fl w-100 w-50-ns pa2">
      <img src="https://d2mxuefqeaa7sj.cloudfront.net/s_3051722221C3CC2A85369C9ABA888BEA7A9D43682B1D92775107EE03091A4CBC_1541188225521_SFpie.png" alt="Percentage of Cuisines in San Francisco"/>
    </div>
  </div>
</div>

As we see above, almost a quarter of the restaurants in SF are American, while in LA the top three cuisines, Mexican, American, and Korean, make up a little less than half of the restaurant scene. In addition, with the creation of the “Other” category, the combination of all the cuisines that made up less than 1% of the distribution accumulated to a fairly large amount of the complete food scene. Also, worth noting, in comparing the categories after the combination, LA had greater diversity of cuisines, 17 including “Other”, than SF, 16 including “Other”. This supports my idea that though SF technically has more types of cuisines, LA has a more evenly distributed food scene that is not overly saturated by just one cuisine. 

# Conclusion

From the data and my calculations, I found the following: 

  - Based on the USA Today Diversity Index, SF’s food scene is more diverse than LA’s food scene. 
    - This slight difference can be attributed to the fact that SF has 60 unique ethnic cuisines as opposed to LA which has 59.
  - Almost a quarter of SF’s food scene (20.9%) is made up of American restaurants. 
  - The top 3 cuisines in LA, Mexican, American, and Korean, make up a little less than half of LA’s restaurant scene at 17.7%, 16.2%, and 12.8%, respectively. 
  - After combining cuisines that made up less than 1% of the distribution, LA had a greater diversity of cuisines, 17 include ‘Other’, while SF had 16 including “Other”. 

This brings to question, what really is diversity? Is it having the most amount of different and unique cuisines? Or is it having a more evenly distributed food scene that is made up of multiple unique ethnic cuisines. Though LA is made up mostly of 3 cuisines, LA also has a greater percentage of diverse cuisines that make up more than 1% of the food scene, which in my opinion, means that LA has a slightly more diverse restaurant scene, but that could also be my bias talking. 

As with everything in life, what I have found is up to interpretation, but, based on my original method of determination, the Diversity Index, SF is more diverse. 

## Full Disclosure(s)

Because my project was limited in scope and information, this is just a sample of a full population that could be studied between SF and LA. As mentioned before, Yelp's API allows a maximum of 1,000 businesses per endpoint. As such, if there were more than 1,000 businesses in any given zip code, those would have been missed. In addition, I only used the countries/ethnicities that were listed by Yelp in their "Categories" section. As such, any restaurant or business without a given country listed in their Categories section would also have been overlooked.

## Future Work

With more information, it would be interesting to see how the distribution of each cuisine across a map of LA and SF and how that reflects the neighborhoods within each city. I would have also liked to have used Census data to compare the diversity of both LA and SF to see if the food diversity is an accurate reflection of the actual cities’ population diversity as well. 

Other interesting things I wish I could have done: 

  - An analysis of the food scene over time. Has SF/LA gotten more or less diverse over time?
  - An analysis on food price. What is the distribution of restaurants at different price points and what does that say about the people who frequent those places? What is the difference of these distributions in both SF and LA and what does this mean about the two cities? 
  - Was the Diversity Index really the best method? Sure I did my research, but I would maybe have tried a different approach to determining my question such as a chi-squared test. 