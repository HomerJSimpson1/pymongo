#!/usr/bin/env python
# File: final7.py

import pymongo

orphanlist = []

client = pymongo.MongoClient('localhost', 27017)

db = client.photos

images = db.images.find()
num_images = images.count()
print num_images

albums = db.albums.find()
print albums.count()


def find_orphans():
    myorphans = []
    for i in range(images.count()):
        result = db.albums.find({"images":i})
        result_count = db.albums.find({"images":i}).count()
        # if i < 10:
        #     print result_count
        #     for record in result:
        #         print record
        if result_count == 0:
            myorphans.append(i)


    return myorphans


orphanlist = find_orphans()

# print orphanlist

print len(orphanlist)


def remove_orphans(orphans):
    for orphan in orphans:
        delresult = db.images.delete_one({"_id":orphan})

    return 0

# Should have a function that calls both find_orphans and remove_orphans and get rid of global variables
# For this question, however, I'm just going to leave it as is
# def remove_image_orphans():


res = remove_orphans(orphanlist)
print db.images.count()
        

