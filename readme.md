# Add your trades to your bitfinex chart 

This is a simple prototype idea script you can run on an empty screen somewhere that will help log all your trades onto your bitfinex chart.

![Image of script running](https://i.imgur.com/rsLvpZy.png)

### To Run   

- Enter your api key/secret into run.js
- run, `node run.js`   

As you make trades, the script will add them to your tradingview chart on bitfinex  


### Features  
  
- Plot different sized 'dots' on the chart where larger/smaller orders took place
- On WS connect, historical trades are loaded

### Issues  
  
- The plotting of the 'y' value of the dot on the chart cannot be controlled, and therefore the 'dot' placement is not accurate. 
  
### Todo 

- Pass argment to specify just a specific pair, ie, `node run.js BTCUSD`  
- If bitfinex would allow the 'updating' of existing markers, they could grow as more of a trade is executed at a price, ie,  0.1 btc is sold at price X, market is 1 pixel, then 1 btc is sold at the same price from the same order, so the dot pixel 'grows' in size  
- 'dot' size could be caculated from a percentile of all the other trades in memory, so, is this a large amount of small amount relative to the last trade memory/cache etc

### Credits  
  
[twitter.com/instabot42](https://twitter.com/instabot42)  - Did all the work   
[twitter.com/flibbr](https://twitter.com/flibbr) - reuqested help to get it working from instabot42  
  
Check out [whalepool.io](https://whalepool.io/) 
