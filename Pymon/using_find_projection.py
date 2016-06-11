# -*- coding: utf-8 -*-
"""
Created on Sun Jun  5 23:03:07 2016

@author: petersj
"""

import pymongo
import sys

# establish a connection to the database
connection = pymongo.MongoClient("mongodb://localhost")

# get a handle to the school database
db = connection.school
scores = db.scores

def find():
    print("find, reporting for duty")
    query = {'type':'exam'}
    projection = {'student_id':1, '_id':0}
    
    try:
        cursor = scores.find(query,projection)
        
    except Exception as e:
        print("Unexpected error:", type(e), e)
        
    sanity = 0
    for doc in cursor:
        print(doc)
        sanity += 1
        if (sanity > 10):
            break
        
        
def find_one():
    print("find one, reporting for duty")
    query = {'student_id':10}
    
    try:
        doc = scores.find_one(query)
        
    except Exception as e:
        print("Unexpected error:", type(e), e)
        
    print(doc)