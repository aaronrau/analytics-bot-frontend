# Bot Analytics Metric UI JS Framework
Here's the live version: <br/>
http://analytics-bot.m00.co.s3-website-us-west-1.amazonaws.com/

This is built off of Aaron's M00 framework found here <br/>
https://github.com/aaronrau/interactive-mockup/blob/master/README.md

Running the UI 
---------------
### 1. Clone Repo.
### 2. Open the index.html with Chrome. It should look something like this:
![alt text](https://s3-us-west-1.amazonaws.com/analytics-bot.m00.co/readme-1.png)
### 3. Updating the endpoint in index.html.
Change the "rest" value to point to the backend service.

```javascript
    app.Paths({
      host:".",
      rest:"http://localhost:8000/"
    });
    
    
```


Configuring the UI 
---------------
Edit the **/scripts/modules/metrics.js** <br/>
https://github.com/aaronrau/analytics-bot-frontend/blob/master/scripts/sections/metrics.js

You will find several hardcoded configuration values that can be adjusted. These are meant to be placeholders for now that will eventually be dynamically loaded based on a user's account and settings.

```javascript
//For Panels
[
    {
        "id":"1",
        "title":"Total Messages",
        "components":[
            {"type":"Kpi","config":{"type":"total","value":"NumMessages","label":"msgs"}},
            {"type":"Pie","config":{"property":"Category","value":"NumMessages"}}
        ]
    },
    {
        "id":"2",
        "title":"Unique User Segments",
        "components":[
            {"type":"Graph","config":{"plot":"stacked","property":"BotChannel","value":"NumUniqUsers","title":"By Channel","label":"Unique Users"}},
            {"type":"Graph","config":{"plot":"stacked","property":"Category","value":"NumUniqUsers","title":"By Intents","label":"Unique Users"}}
        ]
    }
]
```


```javascript
//For Filters
[
{
    "layout" : "overview",
    "name" : "Metrics",
    "default" : "intents",
    "data":{
            "selected":"intents",
            "values" : [ 
                "intents", 
                "longest_intents"
            ],
            "valueDescriptions" : {
                "intents":"All Intents",
                "longest_intents":"Longest respone times"
            }}
},
{
    "layout" : "overview",
    "name" : "Timeframe",
    "default" : "today",
    "data":{
            "selected":"today",
            "values" : [ 
                "today", 
                "this_month", 
                "last_60_days"
            ],
            "valueDescriptions" : {
                "today":"Today",
                "this_month":"This Month",
                "last_60_days":"Last 60 Days"
            }}
}			            	
]
```

Files & Directories 
---------------
The following files & directories are associated with the m00 framework.
### /index.html 
Index.html contains the endpoint to the production or local backend service. You will find the follow declarion in index.html.

```javascript


    app.Paths({
      host:".",
      //socket:"http://localhost:8000/",
      //auth:"http://localhost:8000/auth/"
      rest:"http://localhost:8000/"
    });
    
    
```


### /scripts/sections/*
*.js files in this folder are treated as views. Depending on how the system is configured, URL parameters and/or paths can execute the corresponding .js file. For example "/metrics " can load the /scripts/sections/metrics.js file or defaults can be specified. For example:

```javascript
    //load /scripts/sections/metric.js view & /scripts/modules/metric.js controller "
    app.Start({
        sections:{
          metrics:{css:"./css/metrics.css",mods:['metrics']}
        }
    },function(){
      ....
      return true;
    });
    
    
```

### /scripts/modules/* 
*.js file here acts as controllers, DALs and ui components. 

```javascript
/scripts/modules/metrics.js // metrics controller
/scripts/modules/metrics.DAL.js //metrics data access layer
/scripts/modules/metrics.panel.js //a panel ui component

/scripts/modules/visualizations.js // visualizations controller
/scripts/modules/visualization.pie.js //PIE chart ui component

```
