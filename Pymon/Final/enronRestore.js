// Final Exam Question 1

// Directions:
// Please download the Enron email dataset (link here), unzip it and then restore it using mongorestore. 
// Note that this is an abbreviated version of the full corpus. There should be 120,477 documents after restore.

// The command for mongorestore is:
// mongorestore --port <port number> -d enron -c messages <path to BSON file>

// Inspect a few of the documents to get a basic understanding of the structure. Enron was an American corporation 
// that engaged in a widespread accounting fraud and subsequently failed.

// In this dataset, each document is an email message. Like all Email messages, there is one sender but there can 
// be multiple recipients.

// Construct a query to calculate the number of messages sent by Andrew Fastow, CFO, to Jeff Skilling, the president. 
// Andrew Fastow's email addess was andrew.fastow@enron.com. Jeff Skilling's email was jeff.skilling@enron.com.

For reference, the number of email messages from Andrew Fastow to John Lavorato (john.lavorato@enron.com) was 1.

// Restore the enron databbase with the messages collection
mongorestore --port 27017 -d enron -c messages dump\enron\messages.bson


// Query for all message from andrew.fastow@enron.com to anyone:
// Result = 7
db.messages.find({"headers.From":"andrew.fastow@enron.com"}).count()


// Query for all messages from andrew.fastow@enron.com, but show fields, not just the count.
db.messages.find({"headers.From":"andrew.fastow@enron.com"}, {_id:0, "headers.From":1, "headers.To":1}, {$sort:"headers.To"}).pretty()

// Result:
{
        "headers" : {
                "From" : "andrew.fastow@enron.com",
                "To" : [
                        "louise.kitchen@enron.com"
                ]
        }
}
{
        "headers" : {
                "From" : "andrew.fastow@enron.com",
                "To" : [
                        "louise.kitchen@enron.com"
                ]
        }
}
{
        "headers" : {
                "From" : "andrew.fastow@enron.com",
                "To" : [
                        "louise.kitchen@enron.com"
                ]
        }
}
{
        "headers" : {
                "From" : "andrew.fastow@enron.com",
                "To" : [
                        "john.lavorato@enron.com"
                ]
        }
}
{
        "headers" : {
                "From" : "andrew.fastow@enron.com",
                "To" : [
                        "jeff.skilling@enron.com"
                ]
        }
}
{
        "headers" : {
                "From" : "andrew.fastow@enron.com",
                "To" : [
                        "jeff.skilling@enron.com"
                ]
        }
}
{
        "headers" : {
                "From" : "andrew.fastow@enron.com",
                "To" : [
                        "jeff.skilling@enron.com"
                ]
        }



// Query for (the number of) all messages from andrew.fastow@enron.com to john.lavorato@enron.com:
// Result = 1
db.messages.find({"headers.From":"andrew.fastow@enron.com", "headers.To":"john.lavorato@enron.com"}).count()


// Query for (the number of) all messages from andrew.fastow@enron.com to jeff.skilling@enron.com:
// This is what the question actually asks for, so this is the answer (i.e. answer = 3)
// Result = 3
db.messages.find({"headers.From":"andrew.fastow@enron.com", "headers.To":"jeff.skilling@enron.com"}).count()





// Final Exam Question #2:

// Directions:
// Please use the Enron dataset you imported for the previous problem. For this question you will use the 
// aggregation framework to figure out pairs of people that tend to communicate a lot. 
// To do this, you will need to unwind the To list for each message.

// This problem is a little tricky because a recipient may appear more than once in the To list for a message. 
// You will need to fix that in a stage of the aggregation before doing your grouping and counting of (sender, recipient) pairs.

// Which pair of people have the greatest number of messages in the dataset?


// db.messages.aggregate([{$unwind:"$headers.To" }, {$project: {"From":"$headers.From", "To":"$headers.To", "_id":0} } ])


// db.messages.aggregate([ {"$unwind": "$headers.To" }, {"$group": {"_id":"$headers.From"}}, {"$project":{"_id":1}} ])

// Counts the number of messages a person has sent
// db.messages.aggregate([ {"$unwind": "$headers.To" }, {"$group": {"_id":"$headers.From", "numFrom": {"$sum":1}  }}, {"$project":{"_id":1, "numFrom":1}} ])

// db.messages.aggregate([ {"$unwind": "$headers.To" }, {$project: {"compId":{"headers.From":1, "headers.To":1} } }, {"$group": {"_id":"$compId", "numFrom": {"$sum":1}  }}, {"$project":{"_id":1, "numFrom":1}} ])

// db.messages.aggregate([ {"$unwind": "$headers.To" }, {"$group": {"_id": {"$headers.From":1, {"$addToSet":"$headers.To"} } }}, {"$project":{"_id":1}} ])
// db.messages.aggregate([ {"$unwind": "$headers.To" }, {"$group": {"_id": {"$headers.From":1, "to":{"$addToSet":"$headers.To"}} }}, {"$project":{"_id":1}} ])


// db.messages.aggregate([ {"$unwind":"$headers.To"}, {"$group": {"_id":"$headers.From", "To":{"$addToSet": "$headers.To" } } }, {"$project": { "From": "$_id", "To":1, "_id":0 }} ])

// db.messages.aggregate([ {"$unwind":"$headers.To"}, {"$group": {"_id":"$headers.From", "To":{"$addToSet": "$headers.To" } } }, {"$unwind":"$To"}, {"$project": { "From": "$_id", "To":1, "_id":0 }} ])


// db.messages.aggregate([ {"$unwind":"$headers.To"}, {"$group": {"_id":"$headers.From", "To":{"$addToSet": "$headers.To" } } }, {"$unwind":"$To"}, {"$group": {"_id": {"From":"$From", "To": "$To" }, "pairCount":{"$sum":1} }}, {"$sort": {  "pairCount":-1 } }  ])


// Doesn't work - every pair is only counted one time.  :-(
// db.messages.aggregate([ {"$unwind":"$headers.To"}, {"$group": {"_id":"$headers.From", "To":{"$addToSet": "$headers.To" } } }, {"$unwind":"$To"}, {"$group": {"_id": {"From":"$_id", "To": "$To" }, "pairCount":{"$sum":1} }}, {"$sort": {  "pairCount":-1 } }  ])



// db.messages.aggregate([ {"$unwind":"$headers.To"}, {"$group": {"_id":"$_id", "From":"$headers.From", "To":{"$addToSet": "$headers.To" } } }, {"$unwind":"$To"}, {"$group": {"_id": {"From":"$_id", "To": "$To" }, "pairCount":{"$sum":1} }}, {"$sort": {  "pairCount":-1 } }  ])



// db.messages.aggregate([ {"$unwind":"$headers.To"}, {"$group": {"_id":"$_id", "List":{"$addToSet": {"From":"$headers.From", "To":"$headers.To" } } } }, {$unwind:"$List"}  ], {allowDiskUse:true})

db.messages.aggregate([ {"$unwind":"$headers.To"}, {"$group": {"_id":"$_id", "List":{"$addToSet": {"From":"$headers.From", "To":"$headers.To" } } } }, {"$unwind":"$List"}, {"$group": {"_id":"$List", "pairCount":{$sum:1}} }, {"$sort": {"pairCount":-1}} ], {allowDiskUse:true})






// Final Question #3

// db.messages.find({"headers.Message-ID": {$regex:".*8147308.*"}})

// db.messages.find({"headers.Message-ID":"<8147308.1075851042335.JavaMail.evans@thyme>"})

// db.messages.find({"headers.Message-ID":"<8147308.1075851042335.JavaMail.evans@thyme>"}, {"headers.Message-ID":1, "headers.From":1, "headers.To":1})

// The following statement:
// var x = db.messages.findOne({"headers.Message-ID":"<8147308.1075851042335.JavaMail.evans@thyme>"}, {"headers.Message-ID":1, "headers.From":1, "headers.To":1})
// print(x.headers.To)
// Produces the following output:
// steven.kean@enron.com,richard.shapiro@enron.com,james.steffes@enron.com,christi.
// nicolay@enron.com,sarah.novosel@enron.com,ray.alvarez@enron.com,sscott3@enron.co
// m,joe.connor@enron.com,dan.staines@enron.com,steve.montovano@enron.com,kevin.pre
// sto@enron.com,rogers.herndon@enron.com,mike.carson@enron.com,john.forney@enron.c
// om,laura.podurgiel@enron.com,gretchen.lotz@enron.com,juan.hernandez@enron.com,mi
// guel.garcia@enron.com,rudy.acevedo@enron.com,heather.kroll@enron.com,david.fairl
// ey@enron.com,elizabeth.johnston@enron.com,bill.rust@enron.com,edward.baughman@en
// ron.com,terri.clynes@enron.com,oscar.dalton@enron.com,doug.sewell@enron.com,larr
// y.valderrama@enron.com,nick.politis@enron.com,fletcher.sturm@enron.com,chris.dor
// land@enron.com,jeff.king@enron.com,john.kinser@enron.com,matt.lorenz@enron.com,p
// atrick.hansen@enron.com,lloyd.will@enron.com,dduaran@enron.com,john.lavorato@enr
// on.com,louise.kitchen@enron.com,greg.whalley@enron.com

// And the following statement:
// print(x.headers.To.length)

// Produces the following output:
// 40


// db.messages.update({"headers.Message-ID":"<8147308.1075851042335.JavaMail.evans@thyme>"}, {$set:{"headers.To":{$push: "mrpotatohead@mongodb.com" }}})
db.messages.update({"headers.Message-ID":"<8147308.1075851042335.JavaMail.evans@thyme>"}, {$push:{"headers.To": "mrpotatohead@mongodb.com" }})

// With the following result:
// > db.messages.update({"headers.Message-ID":"<8147308.1075851042335.JavaMail.evan
// s@thyme>"}, {$push:{"headers.To": "mrpotatohead@mongodb.com" }})
// WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
// > var x1 = db.messages.findOne({"headers.Message-ID":"<8147308.1075851042335.Jav
// aMail.evans@thyme>"}, {"headers.Message-ID":1, "headers.From":1, "headers.To":1}
// )
// > print(x1.headers.To.length)
// 41
// > print(x1.headers.To)
// steven.kean@enron.com,richard.shapiro@enron.com,james.steffes@enron.com,christi.
// nicolay@enron.com,sarah.novosel@enron.com,ray.alvarez@enron.com,sscott3@enron.co
// m,joe.connor@enron.com,dan.staines@enron.com,steve.montovano@enron.com,kevin.pre
// sto@enron.com,rogers.herndon@enron.com,mike.carson@enron.com,john.forney@enron.c
// om,laura.podurgiel@enron.com,gretchen.lotz@enron.com,juan.hernandez@enron.com,mi
// guel.garcia@enron.com,rudy.acevedo@enron.com,heather.kroll@enron.com,david.fairl
// ey@enron.com,elizabeth.johnston@enron.com,bill.rust@enron.com,edward.baughman@en
// ron.com,terri.clynes@enron.com,oscar.dalton@enron.com,doug.sewell@enron.com,larr
// y.valderrama@enron.com,nick.politis@enron.com,fletcher.sturm@enron.com,chris.dor
// land@enron.com,jeff.king@enron.com,john.kinser@enron.com,matt.lorenz@enron.com,p
// atrick.hansen@enron.com,lloyd.will@enron.com,dduaran@enron.com,john.lavorato@enr
// on.com,louise.kitchen@enron.com,greg.whalley@enron.com,mrpotatohead@mongodb.com



// // Validation of Answer:
// C:\Users\petersj\Desktop>mongo final3-validate-mongo-shell.js
// 2016-07-07T10:09:33.546-0400 I CONTROL  [main] Hotfix KB2731284 or later update
// is not installed, will zero-out data files
// MongoDB shell version: 3.2.6
// connecting to: test
// Welcome to the Final Exam Q3 Checker. My job is to make sure you correctly updat
// ed the document
// Final Exam Q3 Validated successfully!
// Your validation code is: vOnRg05kwcqyEFSve96R




// Final Question #4:

// Import the posts.json file into the blog database. Use batchSize option set to a value smaller than the default
// (which I think is 1000?), here I used 100.  If you don't, import fails and you get an error message saying it
// lost connection or something like that.
mongoimport -d blog -c posts --batchSize 100 posts.json


// Examples of retrieving using the $slice operator
// Select a specific post (filter using permalink) and display only the comments' author field (for each comment):
db.posts.findOne({"permalink":"mxwnnnqaflufnqwlekfd"}, {_id:0, permalink:1, title:1, "comments.author":1 }) 
// Result of above statement:
{
        "comments" : [
                {
                        "author" : "Tonia Surace"
                },
                {
                        "author" : "Jonie Raby"
                },
                {
                        "author" : "Whitley Fears"
                },
                {
                        "author" : "Denisha Cast"
                },
                {
                        "author" : "Gwyneth Garling"
                },
                {
                        "author" : "Ty Barbieri"
                },
                {
                        "author" : "Marcus Blohm"
                },
                {
                        "author" : "Linnie Weigel"
                },
                {
                        "author" : "Sadie Jernigan"
                },
                {
                        "author" : "Fletcher Mcconnell"
                },
                {
                        "author" : "Joel Rueter"
                },
                {
                        "author" : "Demarcus Audette"
                },
                {
                        "author" : "Cassi Heal"
                },
                {
                        "author" : "Tressa Schwing"
                },
                {
                        "author" : "Kayce Kenyon"
                },
                {
                        "author" : "Rosana Vales"
                },
                {
                        "author" : "Timothy Harrod"
                },
                {
                        "author" : "Wilburn Spiess"
                },
                {
                        "author" : "Mariela Sherer"
                },
                {
                        "author" : "Dusti Lemmond"
                },
                {
                        "author" : "Osvaldo Hirt"
                },
                {
                        "author" : "Jonie Raby"
                },
                {
                        "author" : "Omar Bowdoin"
                },
                {
                        "author" : "Daphne Zheng"
                },
                {
                        "author" : "Maren Scheider"
                },
                {
                        "author" : "Ernestine Macfarland"
                },
                {
                        "author" : "Darby Wass"
                },
                {
                        "author" : "Denisha Cast"
                },
                {
                        "author" : "Eugene Magdaleno"
                },
                {
                        "author" : "Echo Pippins"
                },
                {
                        "author" : "Cassi Heal"
                },
                {
                        "author" : "Bao Ziglar"
                },
                {
                        "author" : "Tawana Oberg"
                },
                {
                        "author" : "Danika Loeffler"
                },
                {
                        "author" : "Len Treiber"
                },
                {
                        "author" : "Marcus Blohm"
                },
                {
                        "author" : "Gwen Honig"
                },
                {
                        "author" : "Cassi Heal"
                },
                {
                        "author" : "Synthia Labelle"
                },
                {
                        "author" : "Shin Allbright"
                },
                {
                        "author" : "Grady Zemke"
                },
                {
                        "author" : "Jessika Dagenais"
                },
                {
                        "author" : "Santiago Dollins"
                },
                {
                        "author" : "Darby Wass"
                },
                {
                        "author" : "Marcus Blohm"
                },
                {
                        "author" : "Osvaldo Hirt"
                },
                {
                        "author" : "Richelle Siemers"
                },
                {
                        "author" : "Myrtle Wolfinger"
                },
                {
                        "author" : "Cassi Heal"
                },
                {
                        "author" : "Sadie Jernigan"
                }
        ],
        "permalink" : "mxwnnnqaflufnqwlekfd",
        "title" : "Gettysburg Address"
}
// Selects the post and the first comment only:
db.posts.findOne({"permalink":"mxwnnnqaflufnqwlekfd"}, {_id:0, permalink:1, title:1, "comments.author":1, "comments":{$slice:[0,1]} })

// Result of above statement:
{
        "comments" : [
                {
                        "author" : "Tonia Surace"
                }
        ],
        "permalink" : "mxwnnnqaflufnqwlekfd",
        "title" : "Gettysburg Address"
}



// See code (in final4 folder in blogPostDAO.py file) for code details.  I only modified (apart from print
// statements elsewhere (e.g. in the post_comment_like() function in the blog.py file)) the increment_likes() function.

// The final output after running the validate.py file to validate my work is:

// C:\Users\petersj\Desktop\final4>C:\Python27\python.exe validate.py
// Welcome to the M101 Final Exam, Question 4 Validation Checker
// Trying to grab the blog home page at url and find the first post. http://localho
// st:8082/
// Found a post url:  /post/mxwnnnqaflufnqwlekfd
// Trying to grab the number of likes for url  http://localhost:8082/post/mxwnnnqaf
// lufnqwlekfd
// Likes value  2
// Clicking on Like link for post:  /post/mxwnnnqaflufnqwlekfd
// Trying to grab the number of likes for url  http://localhost:8082/post/mxwnnnqaf
// lufnqwlekfd
// Likes value  3
// Tests Passed for Final 4. Your validation code is 3f837hhg673ghd93hgf8








// Final Question #5:

// Make a test database collection (called "stuff") and insert some records
// Statement:
db.stuff.insert({'a':1, 'b':40000, 'c':2})

// On screen input/output:
// > db.stuff.insert({'a':1, 'b':40000, 'c':2})
// WriteResult({ "nInserted" : 1 })


// Statement:
db.stuff.insert([ {'a':100, 'b':12000, 'c':10}, {'a':15000, 'b':3000, 'c':1},{'a':320, 'b':5001, 'c':5}, {'a':540, 'b':54001, 'c':6} ])

// // Output:
// > db.stuff.insert([ {'a':100, 'b':12000, 'c':10}, {'a':15000, 'b':3000, 'c':1},
// {'a':320, 'b':5001, 'c':5}, {'a':540, 'b':54001, 'c':6} ])
// BulkWriteResult({
//         "writeErrors" : [ ],
//         "writeConcernErrors" : [ ],
//         "nInserted" : 4,
//         "nUpserted" : 0,
//         "nMatched" : 0,
//         "nModified" : 0,
//         "nRemoved" : 0,
//         "upserted" : [ ]
// })
// >



// Query the stuff collection:
db.stuff.find({'a':{$lt:10000}, 'b':{$gt:5000}})

// // Result of query:
// > db.stuff.find({'a':{$lt:10000}, 'b':{$gt:5000}})
// { "_id" : ObjectId("577e664f58138d9a03fd8002"), "a" : 1, "b" : 40000, "c" : 2 }
// { "_id" : ObjectId("577e66fa58138d9a03fd8003"), "a" : 100, "b" : 12000, "c" : 10
//  }
// { "_id" : ObjectId("577e66fa58138d9a03fd8005"), "a" : 320, "b" : 5001, "c" : 5 }

// { "_id" : ObjectId("577e66fa58138d9a03fd8006"), "a" : 540, "b" : 54001, "c" : 6
// }
// >



// Query used in the exam question:
db.stuff.find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c':-1})

// // Result:
// > db.stuff.find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c
// ':-1})
// { "_id" : ObjectId("577e66fa58138d9a03fd8003"), "a" : 100, "c" : 10 }
// { "_id" : ObjectId("577e66fa58138d9a03fd8006"), "a" : 540, "c" : 6 }
// { "_id" : ObjectId("577e66fa58138d9a03fd8005"), "a" : 320, "c" : 5 }
// { "_id" : ObjectId("577e664f58138d9a03fd8002"), "a" : 1, "c" : 2 }
// >


// Now use an explain statement for the query;
db.stuff.explain().find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c':-1})
db.stuff.explain("executionStats").find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c':-1})

// _id index is not used, as confirmed by using explain()
db.stuff.getIndexes()
db.stuff.explain().find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c':-1})


// a_1_b_1 index is used, as confirmed by using explain()
db.stuff.createIndex({'a':1, 'b':1})
db.stuff.getIndexes()
db.stuff.explain().find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c':-1})
db.stuff.dropIndex("a_1_b_1")


// a_1_c_1 index is used, as confirmed by using explain()
db.stuff.getIndexes()
db.stuff.createIndex({'a':1, 'c':1})
db.stuff.getIndexes()
db.stuff.explain().find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c':-1})
db.stuff.dropIndex()
db.stuff.getIndexes()


// a_1_b_1_c_-1 index is used, as confirmed by using explain()
db.stuff.getIndexes()
db.stuff.createIndex({'a':1, 'b':1, 'c':-1})
db.stuff.getIndexes()
db.stuff.explain().find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c':-1})
db.stuff.dropIndex()
db.stuff.getIndexes()


// c_1 index is used, as confirmed by using explain()
db.stuff.getIndexes()
db.stuff.createIndex({'c':1})
db.stuff.getIndexes()
db.stuff.explain().find({'a':{'$lt':10000}, 'b':{'$gt': 5000}}, {'a':1, 'c':1}).sort({'c':-1})
db.stuff.dropIndex()
db.stuff.getIndexes()





// Final Question #7
// Import the data:
mongoimport -d photos -c albums albums.json
mongoimport -d photos -c images images.json


// Get an idea of the schema in the albums collection:
db.albums.findOne()
// Result:
> db.albums.findOne()
{
        "_id" : 0,
        "images" : [
                2433,
                2753,
                2983,
                6510,
                11375,
                12974,
                15344,
                16952,
                19722,
                23077,
                24772,
                31401,
                32579,
                32939,
                33434,
                36328,
                39247,
                39892,
                40597,
                45675,
                46147,
                46225,
                48406,
                49947,
                55361,
                57420,
                60101,
                62423,
                64640,
                65000,
                67203,
                68064,
                75918,
                80196,
                80642,
                82848,
                83837,
                84460,
                86419,
                87089,
                88595,
                88904,
                89308,
                91989,
                92411,
                98135,
                98548,
                99334
        ]
}



// Get an idea about the schema of the images collection
db.images.findOne()

// Result:
> db.images.findOne()
{
        "_id" : 1,
        "height" : 480,
        "width" : 640,
        "tags" : [
                "cats",
                "sunrises",
                "kittens",
                "travel",
                "vacation",
                "work"
        ]
}


// Get my bearings and see what's what:
> db.albums.count()
1000
> db.images.count()
100000
> db.images.findOne({"_id":99705})
{
        "_id" : 99705,
        "height" : 480,
        "width" : 640,
        "tags" : [
                "dogs",
                "cats",
                "kittens",
                "travel",
                "vacation",
                "work"
        ]
}
> db.albums.createIndex({images:1})
{
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 2,
        "ok" : 1
}
> db.albums.getIndexes()
[
        {
                "v" : 1,
                "key" : {
                        "_id" : 1
                },
                "name" : "_id_",
                "ns" : "photos.albums"
        },
        {
                "v" : 1,
                "key" : {
                        "images" : 1
                },
                "name" : "images_1",
                "ns" : "photos.albums"
        }
]
> db.images.getIndexes()
[
        {
                "v" : 1,
                "key" : {
                        "_id" : 1
                },
                "name" : "_id_",
                "ns" : "photos.images"
        }
]
> db.images.createIndex({tags:1})
{
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 2,
        "ok" : 1
}
> db.images.getIndexes()
[
        {
                "v" : 1,
                "key" : {
                        "_id" : 1
                },
                "name" : "_id_",
                "ns" : "photos.images"
        },
        {
                "v" : 1,
                "key" : {
                        "tags" : 1
                },
                "name" : "tags_1",
                "ns" : "photos.images"
        }
]


// Query to see how many images have a "kittens" tag associated with them:
> db.images.find({"tags":{$in:["kittens"]}}).count()
49932


// More play:
> db.images.find({_id:{$nin: db.albums.find().toArray()}})
{ "_id" : 0, "height" : 480, "width" : 640, "tags" : [ "dogs", "work" ] }
{ "_id" : 1, "height" : 480, "width" : 640, "tags" : [ "cats", "sunrises", "kitt
ens", "travel", "vacation", "work" ] }
{ "_id" : 2, "height" : 480, "width" : 640, "tags" : [ "dogs", "kittens", "work"
 ] }
{ "_id" : 3, "height" : 480, "width" : 640, "tags" : [ "kittens", "travel" ] }
{ "_id" : 4, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises", "kitt
ens", "travel" ] }
{ "_id" : 5, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "sunrises
", "kittens", "work" ] }
{ "_id" : 6, "height" : 480, "width" : 640, "tags" : [ "work" ] }
{ "_id" : 7, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises" ] }
{ "_id" : 8, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "sunrises
", "kittens", "travel" ] }
{ "_id" : 9, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises", "trav
el" ] }
{ "_id" : 10, "height" : 480, "width" : 640, "tags" : [ "cats", "kittens", "trav
el", "vacation", "work" ] }
{ "_id" : 11, "height" : 480, "width" : 640, "tags" : [ "cats", "travel" ] }
{ "_id" : 12, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "travel"
 ] }
{ "_id" : 13, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "sunrise
s", "kittens" ] }
{ "_id" : 14, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises", "vac
ation" ] }
{ "_id" : 15, "height" : 480, "width" : 640, "tags" : [ "dogs", "travel", "vacat
ion", "work" ] }
{ "_id" : 16, "height" : 480, "width" : 640, "tags" : [ "cats", "vacation" ] }
{ "_id" : 17, "height" : 480, "width" : 640, "tags" : [ "kittens", "vacation", "
work" ] }
{ "_id" : 18, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "sunrise
s", "kittens", "vacation", "work" ] }
{ "_id" : 19, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises", "kit
tens", "travel", "work" ] }
Type "it" for more
> db.images.find({_id:{$nin: db.albums.find({}, {_id:0, images:1}).toArray()}})
{ "_id" : 0, "height" : 480, "width" : 640, "tags" : [ "dogs", "work" ] }
{ "_id" : 1, "height" : 480, "width" : 640, "tags" : [ "cats", "sunrises", "kitt
ens", "travel", "vacation", "work" ] }
{ "_id" : 2, "height" : 480, "width" : 640, "tags" : [ "dogs", "kittens", "work"
 ] }
{ "_id" : 3, "height" : 480, "width" : 640, "tags" : [ "kittens", "travel" ] }
{ "_id" : 4, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises", "kitt
ens", "travel" ] }
{ "_id" : 5, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "sunrises
", "kittens", "work" ] }
{ "_id" : 6, "height" : 480, "width" : 640, "tags" : [ "work" ] }
{ "_id" : 7, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises" ] }
{ "_id" : 8, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "sunrises
", "kittens", "travel" ] }
{ "_id" : 9, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises", "trav
el" ] }
{ "_id" : 10, "height" : 480, "width" : 640, "tags" : [ "cats", "kittens", "trav
el", "vacation", "work" ] }
{ "_id" : 11, "height" : 480, "width" : 640, "tags" : [ "cats", "travel" ] }
{ "_id" : 12, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "travel"
 ] }
{ "_id" : 13, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "sunrise
s", "kittens" ] }
{ "_id" : 14, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises", "vac
ation" ] }
{ "_id" : 15, "height" : 480, "width" : 640, "tags" : [ "dogs", "travel", "vacat
ion", "work" ] }
{ "_id" : 16, "height" : 480, "width" : 640, "tags" : [ "cats", "vacation" ] }
{ "_id" : 17, "height" : 480, "width" : 640, "tags" : [ "kittens", "vacation", "
work" ] }
{ "_id" : 18, "height" : 480, "width" : 640, "tags" : [ "dogs", "cats", "sunrise
s", "kittens", "vacation", "work" ] }
{ "_id" : 19, "height" : 480, "width" : 640, "tags" : [ "dogs", "sunrises", "kit
tens", "travel", "work" ] }
Type "it" for more



// See final7.py file for the python code using pymongo to eliminate orphaned records
