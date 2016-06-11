# -*- coding: utf-8 -*-
"""
Created on Sat Jun 11 11:46:13 2016

@author: petersj
"""

#import pymongo

from pymongo import MongoClient

## Connect to database
connection = MongoClient('localhost', 27017)

#db = connection.test
db = connection.pcat

#names = db.names
prods = db.products

#item = names.find_one()
item = prods.find_one()

print(item['name'])

connection.close()