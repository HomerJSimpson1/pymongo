// Get total population of each state and sort by state abbreviation
db.popByZip.aggregate([{"$group": {"_id":"$state", "population":{"$sum":"$pop"} }}, {$sort: {"_id":1}}])


// Get total population of each state and sort by population
db.popByZip.aggregate([{"$group": {"_id":"$state", "population":{"$sum":"$pop"} }}, {$sort: {"population":1}}])


// Get average population by zip code for each state, sorted by average population (ascending)
db.popByZip.aggregate([{"$group": {"_id":"$state", "average_pop":{"$avg":"$pop"} }}, {$sort: {"average_pop":1}}])


// Get average population by zip code for each state, sorted by average population (descending)
db.popByZip.aggregate([{"$group": {"_id":"$state", "average_pop":{"$avg":"$pop"} }}, {$sort: {"average_pop":-1}}])


// Get all zip codes for each city (ignoring that some cities in different states have the same name, at least for now)
db.popByZip.aggregate([{"$group": {"_id":"$city", "postal_codes":{"$addToSet":"$_id"}}}])


// Since the zip codes are unique in this data set and this is what we're pushing to the array, the following will produce the same data (possibly different ordering):
db.popByZip.aggregate([{"$group": {"_id":"$city", "postal_codes":{"$push":"$_id"}}}])


// Get all zip codes for each city (ignoring that some cities in different states have the same name, at least for now), ordered by city name
db.popByZip.aggregate([{"$group": {"_id":"$city", "postal_codes":{"$addToSet":"$_id"}}}, {$sort: {"_id":1}}])



// Get the zip code with the largest population in each state
db.popByZip.aggregate([{"$group": {"_id":"$state", "max_population":{"$max":"$pop"}}}])
//or, since in the quiz he used a different name for max_population
db.popByZip.aggregate([{"$group": {"_id":"$state", "pop":{"$max":"$pop"}}}])



// Use the $project stage of the aggregation framework pipeline
db.popByZip.aggregate([{$project: { "_id":0, "city":1, "pop":1, "state":1, "zip": "$_id" }}])
// Same as previous, but sorted by city
db.popByZip.aggregate([{$project: { "_id":0, "city": 1, "pop":1, "state":1, "zip": "$_id" }}, {$sort: {"city":1}}])
// Same example, but filtering using $match to specify one particular city
db.popByZip.aggregate([{$project: { "_id":0, "city": 1, "pop":1, "state":1, "zip": "$_id" }}, {$match: {"city":"ACMAR"}}, {$sort: {"city":1}}])
// Same example, but filtering using $match AT THE BEGINNING OF THE PIPELINE.  This is important because MongoDB only uses the indexes here if 
// the $match and $sort stages occur at the beginning of the pipeline.
db.popByZip.aggregate([{$match: {"city":"ACMAR"}}, {$sort: {"city":1}}, {$project: { "_id":0, "city": 1, "pop":1, "state":1, "zip": "$_id" }}])

// Make the city all lowercase letters
db.popByZip.aggregate([{$project: { "_id":0, "city": {$toLower:"$city"}, "pop":1, "state":1, "zip": "$_id" }}])
db.popByZip.aggregate([{$project: { "_id":0, "city": {$toLower:"$city"}, "pop":1, "state":1, "zip": "$_id" }}, {$sort:{"city":1}}])


// More examples
db.popByZip.aggregate([{$match: {'state':'CA'}}, {$group:{_id:"$city", population:{$sum:"$pop"}, zip_codes:{$addToSet:"$_id"}}}, {$project: {_id:0, "city":"$_id", "population":1, "zip_codes":1}}, {$sort:{"city":1}}])
db.popByZip.aggregate([{$match: {'pop': {$gt:100000}}}])

// Sort by state then city
 db.popByZip.aggregate([{$sort:{'state':1, 'city':1}}])

// Using skip and limit
db.popByZip.aggregate([{$match:{'state':'NY'}}, {$group:{ _id:"$city", population:{$sum:"$pop"}}}, {$project: {_id:0, "city":"$_id", "population":1}}, {$sort: {population:-1}}, {$skip:10}, {$limit:5}])


// Get the total US Population - i.e. sum over all zip codes
// Equivalent to SELECT sum(pop) AS total FROM popByZip in SQL language
db.popByZip.aggregate([{$group: {_id:null, 'total': {$sum:"$pop"}}}])



// Homework 5.1:
// In order for the import of the blogs.json file, I had to add "--batchSize 100" to the mongoimport command
// i.e. mongoimport -d blog -c posts --batchSize 100 --drop posts.json
// Apparently the default batch size is 10000 and I had to decrease it in order for the import to succeed, due
// to the size of the documents in the file
db.posts.aggregate([ {"$unwind": "$comments" }, {$group: {"_id":"$comments.author", "count":{$sum:1} } }, {$project: {"comauthor":"$_id", "count":1} }, {"$sort":{"count":-1}} ], {allowDiskUse:true})



// Homework 5.2:
// Import statement used: mongoimport -d test -c zips --drop small_zips.json

// db.zips.aggregate([{$match:{$in:['CA', 'NY']}}, {$group: {"_id": {"state":"$state", "city":"$city"}, avgPop:{$avg:"$pop"} }, {$}  ])


// db.zips.aggregate([{$match:{'state': {$in:['CA', 'NY']}, 'pop': {$gt:25000}  }  } , {$group:{"_id": {"state":"$state", "city":"$city"}, avgpop:{$avg:"$pop"}}}, {$sort: {"avgpop":1} }])

// db.zips.aggregate([
//     {$match: 
//              {'state': { $in: ['CA', 'NY'] } }
//      },

//     {$group:
//              {"_id": { "state":"$state", "city": "$city"}, totpop: {$sum:"$pop"}}
//      },

//     {$match:
//              {"totpop": {$gt:25000}}
//      },
//     {$group:
//              {"_id": "$_id.state", avgpop:{$avg:"$totpop"}}
//      }

// ])

// Final answer
db.zips.aggregate([{$match: {'state': { $in: ['CA', 'NY'] } }}, {$group:{"_id": { "state":"$state", "city": "$city"}, totpop: {$sum:"$pop"}}}, {$match: {"totpop": {$gt:25000}}}, {$group: {"_id": "$_id.state", avgpop:{$avg:"$totpop"}} }])

// Actually, need to add a num_cities variable that counts the number of cities in each state. Then you can
// weight each states contribution by the number of cities in that state.  Alternatively, sum the population
// of the two states together and sum the number of cities in the two states together, and then divide the two
// quantities.


// Homework 5.3:
// db.grades.aggregate([{$match:{"scores.type":{$in:["exam", "homework"]}}}, {$project:{"_id":0, "scoretype":"$scores.type"}}])
// db.grades.aggregate([{$unwind: "$scores"}, {$match:{"scores.type":{$in:["exam", "homework"]}}}, {$project:{"_id":0, "scoretype":"$scores.type"}}, {$sort:{"scoretype":-1}}])
db.grades.aggregate([{$unwind: "$scores"}, {$match:{"scores.type":{$in:["exam", "homework"]}}}, {$group: {"_id":{"class_id":"$class_id", "student_id":"$student_id"}, "studavg":{$avg:"$scores.score"}}}, {$group:{"_id":"$_id.class_id", "classavg":{$avg:"$studavg"}}}, {$sort:{"classavg":-1}}])





// Homework 5.4:
// Import statement
mongoimport -d test -c zips --drop zips.json

// Aggregation statement
// db.zips.aggregate([{$project: {first_char: {$substr:["$city", 0, 1]}, "city":1 }}  ])
// db.zips.aggregate([{$project: {first_char: {$substr:["$city", 0, 1]}, "city":1, "_id":1, "state":1, "pop":1 }}  , {$match: {"first_char":{$regex: /^[0-9]/}}} ])
db.zips.aggregate([{$project: {first_char: {$substr:["$city", 0, 1]}, "city":1, "_id":1, "state":1, "pop":1 }}  , {$match: {"first_char":{$regex: /^[0-9]/}}} , {$group: {"_id":null, "totalpop":{$sum:"$pop"}} } ])
