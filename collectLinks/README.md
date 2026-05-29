#Goal: Download all workouts linked to yor specific livelox accound. This is the basis for all further scraping.

How to use this folder:
1: In chrome dev tools go to Sources -> Snippets
2: Here make one snippet with the SessionIntercept.js code and run it.
3: Then make one snippet with the AutoNewPage.js code. Run it and let it download all the needed data. This can take a while.
4: Take all the json files and store it in a "rawLinksData" folder in LiveloxData.
5: Build links to eatch event using the "generateLinks.js" job.
