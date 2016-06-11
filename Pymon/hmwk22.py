# -*- coding: utf-8 -*-
"""
Created on Tue Jun  7 00:32:43 2016

@author: petersj
"""
import pymongo
from pymongo import MongoClient 

client = MongoClient('localhost', 27017)

db = client.students 

grades = db.grades
#grades = db.grades.find({'type':'homework'})
print(grades.count())

query = {'type':'homework'}
# Filter and sort the data. Need to sort to ensure the data is grouped by student
docs = grades.find(query).sort('student_id',pymongo.ASCENDING)
#print(grades.find().limit(10))

print(docs.count())

#j = 0
#for i in docs:
#    if j < 10:
#        print(i)
#    j = j + 1

prev_stud = -1
curr_stud = 0
minval = -1

#for i in range(0,grades.count()):
#for i in grades:
for i in docs:
#    print(i['student_id'])
    curr_stud = i['student_id']
    #curr_rec_id = i['_id']
    
#    if j < 10:
#        print("The current student is " + str(curr_stud) + " and the previous student is " + str(prev_stud))

    if prev_stud == curr_stud:
        #Then compare minval with currentval
        if i['score'] < minval:
            minval = i['score']
#            if j < 10:
#                print("The lowest score = " + str(minval))
        #else:
#            if j < 10:
#                print("The lowest score didn't change and is " + str(minval))
#                print("The higher score for student" + str(i['student_id']) + " is " + str(i['score']))

        # Then remove this record
        #findresult = grades.find({'student_id':i['student_id'], 'score':minval})
#        if j < 10:
#            print('Number of results = ' + str(findresult.count()))
        result = grades.delete_one({'student_id':i['student_id'], 'score':minval})
#        if j < 10:
#            print(result.deleted_count)
        if result.deleted_count == 0:
            print("No record deleted for student_id = " + str(i['student_id']))
        #j += 1
    else:
        # New Student - Then set minval = currentval
        minval = i['score']
#        if j < 10:
#            print('The current low score = ' + str(minval))
    prev_stud = curr_stud
    #prev_rec_id = i['_id']

print(docs.count())
#print(db.grades.count())

#db = client.test

#

#name = db.names.find_one()

#

#print(name.item['name'])