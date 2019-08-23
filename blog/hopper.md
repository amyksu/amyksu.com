---
title: "Follow the Clues: Hopper Puzzle"
date: "2019-08-01"
hero-image: "hopper.jpg"
---

# Challenge Accepted

While browsing jobs yesterday, I came across a Data Scientist opening at Hopper. Being an active user of the app, I got excited and was even more excited when I saw a puzzle link in the job description. 

For those of you who don’t know, Hopper is a flight-booking app that predicts flight prices with 95% accuracy up to 1 year in advance telling users when they should buy or wait for a better price. To get this kind of accuracy, Hopper not only gathers historical data for their predictions, but also aggregates the results of current fares across multiple search engines and uses this information to determine the best deals being booked at any given moment. 


## Following the Clues

In the job description, the line goes, “At Hopper, every dataset tells a story. Do you have what it takes to decipher the clues?” When you click on the link, a google document loads and you just see two columns on numbers. My first thought was, “These are for sure longitude and latitude pairs”. The thing was that the numbers seemed a little low. Not to be deterred, I continued on and started my analysis. For all of my code, please check out [my github](). 

To confirm or deny my hypothesis, I decided to do some exploratory data analysis (EDA) and plotted the data in a scatterplot using Seaborn (shown below): 


![](https://paper-attachments.dropbox.com/s_7703D9EE56AB2E38D4B7340FB7A67D8094BF790511E8E93F9B55CE9D70624D91_1564611732548_image.png)


Looking at the right side of the plot, it was pretty clear to me that we were looking at the United States. Now that I knew that the data was latitude and longitude values in radians, I decided to plot the data using Basemap and Tableau (see below):

<div class='tableauPlaceholder' id='viz1566596573503' style='position: relative'><noscript><a href='http:&#47;&#47;www.amyksu.com'><img alt=' ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;ho&#47;hopper_graphs&#47;HopperPuzzle&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='hopper_graphs&#47;HopperPuzzle' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;ho&#47;hopper_graphs&#47;HopperPuzzle&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1566596573503');                    var vizElement = divElement.getElementsByTagName('object')[0];                    vizElement.style.width='100%';vizElement.style.height=(divElement.offsetWidth*0.75)+'px';                    var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>


Looking at the map and having previously worked with the Bureau of Transportation Statistics flight delays dataset, it appears to me that based on the United States portion, this dataset lists the latitude and longitude pairs of airports. 

With this hypothesis in mind, I found a dataset (from openflights.org) of all of the latitude and longitude pairs of airports globally. Using this, I matched the dataset found on the Hopper job description to the airport dataset to see if the pairs match, and they did! Now that I knew that they were airports, I did some more EDA and found that there was over 100 flights from Taitung Airport in Taiwan while everywhere else had one or two flights. I guessed that this meant that the data was probably listing out flight paths, and here’s what I ended up with: 


<div class='tableauPlaceholder' id='viz1566596602371' style='position: relative'><noscript><a href='http:&#47;&#47;www.amyksu.com'><img alt=' ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;ho&#47;hopper_graphs&#47;Final&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='path' value='views&#47;hopper_graphs&#47;Final?:embed=y&amp;:display_count=y&amp;publish=yes' /> <param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;ho&#47;hopper_graphs&#47;Final&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1566596602371');                    var vizElement = divElement.getElementsByTagName('object')[0];                    if ( divElement.offsetWidth > 800 ) { vizElement.style.width='1000px';vizElement.style.height='827px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='1000px';vizElement.style.height='827px';} else { vizElement.style.width='100%';vizElement.style.height='877px';}                     var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>

In my plot above, the larger blue bubbles and lines indicates more flights going in and, or out of that airport. The smaller coral bubbles and lines indicates less flights.

Like I mentioned, I believe this dataset shows flight paths. Contrary to my initial hypothesis that the dataset is solely of flights going in and out of Taitung airport, the dataset includes flights going in and out of other airports as well. 

Thanks for reading and I hope the clues I follower helped me end up in the right place! 


 
