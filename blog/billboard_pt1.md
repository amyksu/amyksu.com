---
title: "0 to 100: How to Rank on the Billboard Charts (Part 1)"
date: "2019-04-10"
hero-image: "a.jpg"
---

# What does it take for a song to become number 1 on Billboard’s Hot 100?

<iframe style="max-width:560px; height:315px; width:100%; display: block; margin: 0 auto;" src="https://www.youtube.com/embed/7ysFgElQtjI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

After being denied a spot on the Billboard top 100 Country charts, Old Town Road by Lil Nas X grabbed the number 1 spot on the Billboard Hot 100 chart over all genres. The song is odd but catchy meeting at the intersection of rap and country. Something that has not really been done before, in this fashion. Not only is the song different from its predecessors, it is also the shortest number 1 song on the Hot 100 since 1965. 

The story of Old Town Road and its journey to the top made me wonder, ***“What does it take for a song to become number 1 on Billboard’s Hot 100?”*** 

In my second week of Data Science bootcamp with Metis, my goal was to learn how to: 
  1. Scrape a website for information 
  2. Create a linear regression with this information and any other relevant information

I decided to figure out what aspects of a song are useful in predicting a song’s ranking on the top 100. To do that, I did the following: 
 
1. Scrape Billboard.com to grab the Billboard Hot 100 from April 2015 to April 2019
2. Utilize Spotify’s API to grab the Billboard Hot 100 songs’ audio features and feature engineering
3. Create a linear regression to predict a song’s ranking on the Billboard chart

As always, for all code, please see [my github](https://github.com/amyksu/predicting_billboard_charts_ranking).

# Scraping the Web

One of the benefits of using and learning Python is its ability to scrape information from the web in a fairly efficient way. Web scraping makes it possible to take unstructured information from a website and transform it into a readable and structured data(frame, if you so please). 

Before even scraping a website, it’s important to see if the website you want information from is capable of being scraped, meaning that the website allows you to scrape from its interface without being blocked. 

An easy way to do this is to use `robots.txt`. To use it, simply enter  `robots.txt` to the end of a url, such as https://www.billboard.com/robots.txt, into your browser and the output you get will list out what is allowed and not allowed. In most cases, in my experience at least, the website will show mostly what is not allowed. For example, this was the output for the Billboard website when I used `robots.txt` : 

<div class="mw7 center ph3-ns">
  <div class="cf ph2-ns">
    <img src="../photos/robots.png" alt="Robots.txt Preview"/>
    </div>
</div>
As you can see, it looks like a lot of information isn’t scrapable. BUT if you look closely, there is no mention of not being able to scrape the Top 100 or any of the other charts, so we’ll scrape from there.

## Scrape It

In class, we learned two methods of web scraping: BeautifulSoup and Selenium. There are positives and negatives to both methods. But, for my project purposes, I used BeautifulSoup as the Billboard website was a fairly simple, static HTML website to scrape from. Selenium, as we learned in class, is better for websites whose content is added via JavaScript as opposed to HTML and for webpages that require more interaction. Selenium will automate web browser interaction from Python and make JavaScript links no longer an issue. 

To scrape the Billboard Top 100, I created two functions. The first one was to calculate the week dates of each Billboard chart from a specific period of time to another. The function takes in two dates, in datetime format, and a time delta of your choosing and using a for loop, creates a list of dates to input into my second function which scrapes the actual website. Because the Billboard links are by a specific week date, this function creates a list of weeks in the Billboard url format. 

```python
def week_delta(start, end, delta):
    curr = start
    while curr < end:
        yield curr
        curr += delta
    
week_as_datetime = []
weeks = []
for result in week_delta(date(2012, 4, 14), date(2019, 4, 20), timedelta(days=7)):
    week_as_datetime.append(result)
    weeks.append(result.strftime('%Y-%m-%d'))
```

The second function I created scrapes the Billboard website. Like I mentioned before, because all of the Top 100 chart urls are the same with the addition of the week date, I could add the date strings created in the function above to insert into the url. The function then takes the url, scrapes the webpage, soupifies the text, meaning it takes in the html as text, parses the html, and grabs the specific div’s that contain the information that I need. 

```python
url = 'https://www.billboard.com/charts/hot-100/{}'
top_100 = []
    
def billboard_web_scrape(url):
    for week in weeks:
        file_url = url.format(week)
        response = requests.get(file_url)
        print(response.status_code)
            
            # Soupify the text 
        page = response.text
            
            # Parse HTML
        soup = BeautifulSoup(page, 'html.parser')
            
            # Grab information from top 100 charts 
        for minisoup in soup.find_all(class_='chart-list-item'):
            song = {}
            song['week_of'] = datetime.strptime(week, '%Y-%m-%d')
            song['rank'] = minisoup['data-rank']
            song['title'] = minisoup['data-title']
            song['artist'] = minisoup['data-artist']
            try: 
                song['last_week'] = minisoup.find('div', {'class':'chart-list-item__last-week'}).get_text(strip=True)
            except:
                song['last_week'] = np.nan
            try:     
                song['peak_position'] = minisoup.find('div', {'class':'chart-list-item__weeks-at-one'}).get_text(strip=True)
            except:
                song['peak_position'] = np.nan
    
            try: 
                song['week_on_chart'] = minisoup.find('div', {'class':'chart-list-item__weeks-on-chart'}).get_text(strip=True)
            except:
                song['week_on_chart'] = np.nan
            top_100.append(song)
```
 
To scrape the website of your choosing, in this case, Billboard, you enter the url into the function. Then, it will spit out a status code and scrape the website for the information you have chosen and store it in a list of dictionaries. In this case, I have scraped the website for the following information:

  - Week of - the week of the top 100 chart
  - Rank 
  - Title 
  - Artist
  - Last week: rank from the previous week
  - Peak Position: highest position on the chart 
  - Week on chart: How many weeks the song has been on the Top 100 

Now that I have all my information, all I have to do is store it as a csv, using the `.to_csv` function. 

That’s all there is to webscraping! Next I will go into how I utilized the Spotify API to get the audio features of the songs I scraped and feature engineering. 

Thanks for reading! 
