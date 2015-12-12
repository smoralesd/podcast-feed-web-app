# Podcast feed web app

This project is a web app to play podcast from the cnn rss podcast feed.
No mouse support added (on purpose).
In order to control the app, you need to use the up and down arrows (alternative, you can use the 'j' and 'k' keys, vim style) to select a podcast and the enter key to play/pause the podcast.

## Requirements

* node 0.10.26
* npm 1.4.3

It's very possible that node version 0.10.x will work (x >=26)

## Getting Started

Clone the project (or download the zip file) and run:
```
npm install
```

This command will install all the dependencies (that is: node and bower dependencies)

To start the server run:
```
npm start
```

To see the web app, open your browser (Chrome will do) and go to 
```
http://localhost:8000/app/
```

## Apache

Setup Apache, then copy the files on your web directory (~/Library/WebServer/Directories on Mac OS X for example)
Make sure Apache is running

```
sudo apachectl start
```

Access the app accordingly to your Apache setup and the path you setup for this web app.

