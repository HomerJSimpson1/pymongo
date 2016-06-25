import pymongo

connection = pymongo.MongoClient()

db = connection.usPop

result = db.popByZip.aggregate([{"$group": {"_id":"$state", "population":{"$sum":"$pop"}}}])
## Optionally, can allow disk use by setting the appropriate document.  However, in python, we don't
## set the option in a document (i.e. no enclosing braces {} around the options, unlike in the shell)
# result = db.popByZip.aggregate([{"$group": {"_id":"$state", "population":{"$sum":"$pop"}}}], allowDiskUse=True)

####################################################################################
# The following line is only needed to get a cursor if using Mongo > 2.6 and < 3.0:
# As of Mongo 3.0, the cursor is returned by default, instead of one big document.
####################################################################################
# result = db.popByZip.aggregate([{"$group": {"_id":"$state", "population":{"$sum":"$pop"}}}], cursor = {})


# When one big document is returned, you can just print the document
# print(result)


# When a cursor is returned, need to iterate and print each document
for res in result:
    print(res)
