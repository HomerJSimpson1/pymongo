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
