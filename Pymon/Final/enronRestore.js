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

> db.albums.find({images:1}).count()
1
> db.albums.find({images:2}).count()
1
> db.albums.find({images:2}).count()
1
> db.albums.find({images:3}).count()
1
> db.albums.find({images:325}).count()
1
> db.albums.find({images:325})
{ "_id" : 595, "images" : [ 284, 325, 1198, 2018, 2678, 2790, 2832, 2956, 3214,
4032, 5258, 5602, 7891, 9328, 9401, 9732, 10433, 11815, 12234, 13842, 15160, 154
21, 16136, 16744, 16980, 17109, 18331, 20592, 21778, 24701, 25257, 27230, 27396,
 28369, 28404, 28640, 29479, 30545, 32037, 35038, 35089, 36920, 37558, 37824, 38
405, 39339, 41933, 42007, 43274, 46227, 47957, 50786, 51990, 54953, 55059, 55811
, 56371, 58877, 59151, 59472, 59630, 62835, 63100, 63613, 67184, 67772, 69951, 7
1203, 72070, 72427, 72827, 74025, 75993, 76606, 80006, 80209, 81070, 81682, 8168
7, 81743, 82821, 83878, 84045, 84763, 85816, 86634, 86981, 87095, 87308, 87342,
87986, 88620, 89246, 90784, 91476, 92367, 92975, 93506, 93521, 95848, 96245, 966
46, 97155, 99899 ] }
> db.albums.find({_id:681})
{ "_id" : 681, "images" : [ 4, 191, 2726, 3872, 4226, 4365, 6124, 6190, 10253, 1
0669, 11009, 12259, 14139, 14441, 16481, 17538, 23817, 24500, 26137, 32404, 3541
9, 35897, 36375, 38730, 39703, 40672, 40833, 42232, 44902, 46290, 46341, 46599,
48038, 48733, 48783, 49269, 50318, 50347, 51331, 52694, 53483, 55146, 57348, 575
43, 59231, 60551, 62988, 63119, 63569, 63640, 69257, 71005, 71898, 73879, 75343,
 78261, 84668, 87072, 87495, 87639, 88013, 89207, 89899, 91459, 91905, 93545, 93
549, 94963, 95843, 97583, 99906 ] }
> db.albums.find({_id:69})
{ "_id" : 69, "images" : [ 0, 1604, 2202, 6153, 6594, 7250, 7623, 7926, 8044, 12
293, 12439, 12610, 13743, 13863, 17257, 18200, 19271, 20054, 20121, 21103, 21260
, 21645, 22813, 25645, 26522, 26752, 27189, 28657, 30066, 31211, 31531, 31667, 3
2167, 32888, 33421, 33496, 33517, 35612, 36223, 37376, 41894, 42835, 43368, 4350
4, 44017, 44194, 46114, 47549, 50075, 52741, 53206, 56082, 56383, 56719, 60644,
61265, 61898, 63036, 63379, 63973, 64025, 68174, 69287, 69988, 71710, 73167, 742
21, 75506, 75767, 78688, 82584, 82822, 83017, 84391, 84605, 87058, 90547, 92945,
 93106, 94158, 95762, 97997, 98244, 99929 ] }
> db.albums.find({images:27})
> db.albums.find({images:33})
> db.albums.find({images:39})
> db.images.count()
89737
> db.images.find({"tags":{$in:["kittens"]}}).count()
44822




// See final7.py file for the python code using pymongo to eliminate orphaned records

// The question as laid out in the Final Exam:
// 
// Download Handouts:
// final7__f7_m101_52e000fde2d423744501d031.zip
// You have been tasked to cleanup a photo-sharing database. The database consists of two collections, albums, and images. Every image is supposed to be in an album, but there are orphan images that appear in no album. Here are some example documents (not from the collections you will be downloading).
// > db.albums.findOne()
// {
//     "_id" : 67
//     "images" : [
//         4745,
//         7651,
//         15247,
//         17517,
//         17853,
//         20529,
//         22640,
//         27299,
//         27997,
//         32930,
//         35591,
//         48969,
//         52901,
//         57320,
//         96342,
//         99705
//     ]
// }

// > db.images.findOne()
// { "_id" : 99705, "height" : 480, "width" : 640, "tags" : [ "dogs", "kittens", "work" ] }
// From the above, you can conclude that the image with _id = 99705 is in album 67. It is not an orphan.
// Your task is to write a program to remove every image from the images collection that appears in no album. Or put another way, if an image does not appear in at least one album, it's an orphan and should be removed from the images collection.
// Download final7.zip from Download Handout link and use mongoimport to import the collections in albums.json and images.json.
// When you are done removing the orphan images from the collection, there should be 89,737 documents in the images collection. To prove you did it correctly, what are the total number of images with the tag 'kittens" after the removal of orphans? As as a sanity check, there are 49,932 images that are tagged 'kittens' before you remove the images.
// Hint: you might consider creating an index or two or your program will take a long time to run.
// Choose the best answer:
// 49,932
// 47,678
// 38,934
// 45,911
// 44,822
// Submit
// Your submission has been saved, and will be graded when the problem closes.

// My answer was 44,822






// Final Question #8:
// The question as laid out on the final exam:

// Suppose you have a three node replica set. Node 1 is the primary. Node 2 is a secondary, and node 3 is a secondary running with a delay of two hours. All writes to the database are issued with w=majority and j=1 (by which we mean that the getLastError call has those values set).

// A write operation (which could be insert or update) is initiated from your application using the pymongo driver at time t=0. At time t=5 seconds, the primary (Node 1), goes down for an hour and Node 2 is elected primary. Note that your write operation has not yet returned at the time of the failure. Note also that although you have not received a response from the write, it has been processed and written by Node 1 before the failure. Node 3, since it has a slave delay option set, is lagging.

// Will there be a rollback of data on Node 1 when it comes back up? Choose the best answer.

// Choose the best answer:
// Yes, always
// No, never
// Maybe, it depends on whether Node 3 has processed the write.
// Maybe, it depends on whether Node 2 has processed the write.
// Submit
// Your submission has been saved, and will be graded when the problem closes.



// My answer: Maybe, it depends on whether Node 2 has processed the write







// Final Question #9:
// The question as laid out on the final exam:

// Imagine an electronic medical record database designed to hold the medical records of every individual in the United States. Because each person has more than 16MB of medical history and records, it's not feasible to have a single document for every patient. Instead, there is a patient collection that contains basic information on each person and maps the person to a patient_id, and a record collection that contains one document for each test or procedure. One patient may have dozens or even hundreds of documents in the record collection.

// We need to decide on a shard key to shard the record collection. What's the best shard key for the record collection, provided that we are willing to run inefficient scatter-gather operations to do infrequent research and run studies on various diseases and cohorts? That is, think mostly about the operational aspects of such a system. And by operational, we mean, think about what the most common operations that this systems needs to perform day in and day out.

// Choose the best answer:
// patient_id
// _id
// Primary care physician (your principal doctor that handles everyday problems)
// Date and time when medical record was created
// Patient first name
// Patient last name
// Submit
// Your submission has been saved, and will be graded when the problem closes.

// My answer: patient_id




// Final Question #10: 
// The question as laid out on the final exam:

// Understanding the output of explain

// We perform the following query on the enron dataset:

// var exp = db.messages.explain('executionStats')

// exp.find( { 'headers.Date' : { '$gt' : new Date(2001,3,1) } }, { 'headers.From' : 1, '_id' : 0 } ).sort( { 'headers.From' : 1 } )
// and get the following explain output.

// {
//   "queryPlanner" : {
//     "plannerVersion" : 1,
//     "namespace" : "enron.messages",
//     "indexFilterSet" : false,
//     "parsedQuery" : {
//       "headers.Date" : {
//         "$gt" : ISODate("2001-04-01T05:00:00Z")
//       }
//     },
//     "winningPlan" : {
//       "stage" : "PROJECTION",
//       "transformBy" : {
//         "headers.From" : 1,
//         "_id" : 0
//       },
//       "inputStage" : {
//         "stage" : "FETCH",
//         "filter" : {
//           "headers.Date" : {
//             "$gt" : ISODate("2001-04-01T05:00:00Z")
//           }
//         },
//         "inputStage" : {
//           "stage" : "IXSCAN",
//           "keyPattern" : {
//             "headers.From" : 1
//           },
//           "indexName" : "headers.From_1",
//           "isMultiKey" : false,
//           "direction" : "forward",
//           "indexBounds" : {
//             "headers.From" : [
//               "[MinKey, MaxKey]"
//             ]
//           }
//         }
//       }
//     },
//     "rejectedPlans" : [ ]
//   },
//   "executionStats" : {
//     "executionSuccess" : true,
//     "nReturned" : 83057,
//     "executionTimeMillis" : 726,
//     "totalKeysExamined" : 120477,
//     "totalDocsExamined" : 120477,
//     "executionStages" : {
//       "stage" : "PROJECTION",
//       "nReturned" : 83057,
//       "executionTimeMillisEstimate" : 690,
//       "works" : 120478,
//       "advanced" : 83057,
//       "needTime" : 37420,
//       "needFetch" : 0,
//       "saveState" : 941,
//       "restoreState" : 941,
//       "isEOF" : 1,
//       "invalidates" : 0,
//       "transformBy" : {
//         "headers.From" : 1,
//         "_id" : 0
//       },
//       "inputStage" : {
//         "stage" : "FETCH",
//         "filter" : {
//           "headers.Date" : {
//             "$gt" : ISODate("2001-04-01T05:00:00Z")
//           }
//         },
//         "nReturned" : 83057,
//         "executionTimeMillisEstimate" : 350,
//         "works" : 120478,
//         "advanced" : 83057,
//         "needTime" : 37420,
//         "needFetch" : 0,
//         "saveState" : 941,
//         "restoreState" : 941,
//         "isEOF" : 1,
//         "invalidates" : 0,
//         "docsExamined" : 120477,
//         "alreadyHasObj" : 0,
//         "inputStage" : {
//           "stage" : "IXSCAN",
//           "nReturned" : 120477,
//           "executionTimeMillisEstimate" : 60,
//           "works" : 120477,
//           "advanced" : 120477,
//           "needTime" : 0,
//           "needFetch" : 0,
//           "saveState" : 941,
//           "restoreState" : 941,
//           "isEOF" : 1,
//           "invalidates" : 0,
//           "keyPattern" : {
//             "headers.From" : 1
//           },
//           "indexName" : "headers.From_1",
//           "isMultiKey" : false,
//           "direction" : "forward",
//           "indexBounds" : {
//             "headers.From" : [
//               "[MinKey, MaxKey]"
//             ]
//           },
//           "keysExamined" : 120477,
//           "dupsTested" : 0,
//           "dupsDropped" : 0,
//           "seenInvalidated" : 0,
//           "matchTested" : 0
//         }
//       }
//     }
//   },
//   "serverInfo" : {
//     "host" : "dpercy-mac-air.local",
//     "port" : 27017,
//     "version" : "3.0.1",
//     "gitVersion" : "534b5a3f9d10f00cd27737fbcd951032248b5952"
//   },
//   "ok" : 1
// }
// Check below all the statements that are true about the way MongoDB handled this query.

// Check all that apply:
// The query used an index to figure out which documents match the find criteria.
// The query avoided sorting the documents because it was able to use an index's ordering.
// The query returned 120,477 documents.
// The query scanned every document in the collection.
// Submit
// Your submission has been saved, and will be graded when the problem closes.


// My answer: The query avoided sorting the documents because it was able to use an index's ordering 
// AND
// The query scanned every document in the collection.
