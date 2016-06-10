# -*- coding: utf-8 -*-
"""
Created on Fri Jun  3 12:08:53 2016

@author: petersj
"""

#### Fourth and Final Iteration
#### This is just the Third Iteration cleaned up.  :-)

import pymongo
from pymongo import MongoClient

client = MongoClient('localhost', 27017)

db = client.school

query = db.students.find().sort('_id', pymongo.ASCENDING)

for i in query:
    hmwks = [x for x in i['scores'] if x['type'] == 'homework']

    if hmwks[0]['score'] < hmwks[1]['score']:
        minval = hmwks[0]['score']
    else:
        minval = hmwks[1]['score']
        
    ## The only problem with the following is if the two homework scores are equal.
    ## I need to handle that case! - I never did actually resolve this one, but I still got the correct homework answer. ;-)
    result = [x for x in i['scores'] if x['type'] != 'homework' or (x['type'] == 'homework' and x['score'] != minval)]
    db.students.update_one({'_id':i['_id']}, {'$set':{'scores':result}})








# #### Third iteration
# #### This one works!
# import pymongo
# from pymongo import MongoClient

# client = MongoClient('localhost', 27017)

# db = client.school

# #query = db.students.find({'type':'homework'}, {'_id':1})
# #query = db.students.find({}, {'$sort':{'_id':1}})
# query = db.students.find().sort('_id', pymongo.ASCENDING)
# #query = db.students.find({'scores.type':'homework'}).sort('_id', pymongo.ASCENDING)
# #query = db.students.find({'scores.type':'homework'}, {'scores.$':1}).sort('_id', pymongo.ASCENDING)
# #query = db.students.find({'scores.type':'homework'}, {'scores':1}).sort('_id', pymongo.ASCENDING)

# print(query.count())
# #print(db.students.find({}, {'$limit':10}))

# #for i in range(0,query.count()):
# j = 0
# for i in query:
#     hmwks = [x for x in i['scores'] if x['type'] == 'homework']
# #    if j < 10:
# #        #print(i['scores.type'])
# #        #print(i['scores'] if )
# #        #print(i['scores'])
# #        #print(i)
# #        print(hmwks)

#     if hmwks[0]['score'] < hmwks[1]['score']:
#         minval = hmwks[0]['score']
#     else:
#         minval = hmwks[1]['score']

#     if j < 10:        
#         print(str(i['_id']) + ' has the lowest score of ' + str(minval))
        
#     ## The only problem with the following is if the two homework scores are equal.
#     ## I need to handle that case!
#     result = [x for x in i['scores'] if x['type'] != 'homework' or (x['type'] == 'homework' and x['score'] != minval)]

#     if j < 10:        
#         print(result)
#         print(db.students.find_one({'_id':i['_id']}))
        
#     db.students.update_one({'_id':i['_id']}, {'$set':{'scores':result}})
#     #print(db.students.find_one({'_id':i['_id']}))

#     j += 1









# ##### Second Iteration

# import pymongo
# from pymongo import MongoClient

# client = MongoClient('localhost', 27017)

# db = client.school

# #query = db.students.find({'type':'homework'}, {'_id':1})
# #query = db.students.find({}, {'$sort':{'_id':1}})
# query = db.students.find().sort('_id', pymongo.ASCENDING)
# #query = db.students.find({'scores.type':'homework'}).sort('_id', pymongo.ASCENDING)
# #query = db.students.find({'scores.type':'homework'}, {'scores.$':1}).sort('_id', pymongo.ASCENDING)
# #query = db.students.find({'scores.type':'homework'}, {'scores':1}).sort('_id', pymongo.ASCENDING)

# print(query.count())
# #print(db.students.find({}, {'$limit':10}))

# #for i in range(0,query.count()):
# j = 0
# for i in query:
#     hmwks = [x for x in i['scores'] if x['type'] == 'homework']
#     if j < 10:
#         #print(i['scores.type'])
#         #print(i['scores'] if )
#         #print(i['scores'])
#         #print(i)
#         print(hmwks)

#     if hmwks[0]['score'] < hmwks[1]['score']:
#         minval = hmwks[0]['score']
#     else:
#         minval = hmwks[1]['score']

#     if j < 10:        
#         print(minval)

#     j += 1












### First iteration



# from pymongo import MongoClient

# client = MongoClient('localhost', 27017)

# db = client.school

# query = db.students.find({'type':'homework'}, {'_id':1})



# print(query.count())


# print(db.students.find({}, {'limit':10})
#print(grades.count())

# prev_stud = -1
# curr_stud = 0
# minval = -1
# for i in range(0,grades.count()):
#     curr_stud = i['student_id']
#     if prev_stud == curr_stud:
#         #Then compare minval with currentval
#         if i['score'] < minval:
#             minval = i['score']
#             # Then remove this record
#         grades.delete_one({'student_id':i['student_id'], 'score':minval})
#     else:
#         # New Student - Then set minval = currentval
#         minval = i['score']
#     prev_stud = curr_stud

# #db = client.test
# #
# #name = db.names.find_one()
# #
# #print(name.item['name'])
