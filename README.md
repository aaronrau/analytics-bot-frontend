# Bot Analytics Metric UI JS Framework
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
