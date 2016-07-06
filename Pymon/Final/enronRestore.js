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
