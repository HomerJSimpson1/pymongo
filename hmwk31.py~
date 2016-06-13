# -*- coding: utf-8 -*-
"""
Created on Fri Jun  3 12:08:53 2016

@author: petersj
"""

from pymongo import MongoClient

client = MongoClient('localhost', 27017)

db = client.students

grades = db.grades.find({'type':'homework'})
print(grades.count())

prev_stud = -1
curr_stud = 0
minval = -1
for i in range(0,grades.count()):
    curr_stud = i['student_id']
    if prev_stud == curr_stud:
        #Then compare minval with currentval
        if i['score'] < minval:
            minval = i['score']
            # Then remove this record
        grades.delete_one({'student_id':i['student_id'], 'score':minval})
    else:
        # New Student - Then set minval = currentval
        minval = i['score']
    prev_stud = curr_stud

#db = client.test
#
#name = db.names.find_one()
#
#print(name.item['name'])
