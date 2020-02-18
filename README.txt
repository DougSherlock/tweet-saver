Purpose:	Submission for Global Relay technical assignment
Author:		Douglas Sherlock - dougthefiddler@hotmail.com - 604-649-3289
Date:		Feb 17, 2020
Remarks:	I opted to build this web app using the NPM "create-react-app" utility.
Set up:		To run this web app, NodeJS must be installed.

To run the debug build:
- Open the "tweet-saver" folder in the command line.
- Run the command:  npm start
- A browser window should open with the web app in it.

To run the release build:
- Open the "tweet-saver" folder in the command line.
- Run the command:  serve -s build.
- The command line will display the HTTP address to open in a browser.

COMMENTS

This was a fun project.  The one thing I admit I got stuck on was overcoming the "cross-origin" error when getting data from the URL.  There is a file called "cors test.html" which shows a number of options I tried, but these were just the tip of the iceberg.

Eventually I settled on using a JQuery Ajax call with the "dataType" attribute set to "jsonp". 



