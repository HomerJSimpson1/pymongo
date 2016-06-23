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




