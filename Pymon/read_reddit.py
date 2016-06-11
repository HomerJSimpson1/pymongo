# -*- coding: utf-8 -*-
"""
Created on Sun Jun  5 23:17:50 2016

@author: petersj
"""

import json
import urllib3
import pymongo

# Connect to Mongo
connection = pymongo.MongoClient("mongodb://localhost")

# Get a handle to the reddit database
db = connection.reddit
stories = db.stories

# Drop existing collection
stories.drop()

# Get the reddit home page
reddit_page = urllib3.PoolManager().request("GET", "http://www.reddit.com/r/technology/.json", preload_content=False)

#print(reddit_page.data)

# Parse the json into python objects
#parsed = json.loads(reddit_page.read())
parsed = json.loads(reddit_page.data)

# Iterate through every news item on the page
for item in parsed['data']['children']:
    # put it into Mongo
    stories.insert_one(item['data'])