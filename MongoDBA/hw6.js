// Mongo 102 Class Homework Week 6

// Download Handouts:
// week6__hw6.1_m102_52b491d5e2d4237593ca1d3a.js

// For this week's homework we will start with a standalone MongoDB database, turn it into a sharded cluster with two shards, and shard one of the collections. 
// We will create a "dev" environment on our local box: no replica sets, and only one config server. In production you would almost always use three config servers
//  and replica sets as part of a sharded cluster. In the final of the course we'll set up a larger cluster with replica sets and three config servers.

// Download the handout.

// Start an initially empty mongod database instance.

// Connect to it with the shell and week6.js loaded:

mongo --shell localhost/week6 week6.js
// Run homework.init(). It will take some time to run as it inserts quite a few documents. When it is done run
homework.init()

use week6

db.trades.stats()
// to check the status of the collection.
// At this point we have a single mongod and would like to transform it into a sharded cluster with one shard. (We'll use this node's existing week6.trades data in the cluster.)

// Stop the mongod process. Now, restart the mongod process adding the option --shardsvr. If you started mongod with a --dbpath option, specify that as well.

mongod --shardsvr
// Note that with --shardsvr specified the default port for mongod becomes 27018.

// Start a mongo config server:

mongod --configsvr
// (Note with --configsvr specified the default port for listening becomes 27019 and the default data directory /data/configdb. 
// Wherever your data directory is, it is suggested that you verify that the directory is empty before you begin.)

// Start a mongos:

// mongos --configdb your_host_name:27019
mongos --configdb "NCI-01940306.local:27019"

// Connect to mongos with the shell:

mongo --shell localhost/week6 week6.js

// Add the first shard ("your_host_name:27018").
sh.addShard("NCI-01940306.local:27018")

// Verify that the week6.trades data is visible via mongos. 
// Note at this point the week6 database isn't "sharding enabled" but its data is still visible via mongos:

db.trades.find().pretty()
db.trades.count()
db.trades.stats()

// Run homework.a() and enter the result below. This method will simply verify that this simple cluster is up and running and return a result key.
// result = 1000001



// Homework 6.2
// Now enable sharding for the week6 database. (See sh.help() for details.)
// sh.enableSharding("week6")
sh.enableSharding("week6")

// Then shard the trades collection on the compound shard key ticker plus time. Note to shard a collection, you must have an index on the shard key, so you will need to create the index first:
// db.trades.createIndex( { ticker : 1, time : 1 } )
db.trades.createIndex({"ticker":1, "time":1})

sh.shardCollection("week6.trades", {"ticker":1, "time":1}, false)


// can now shard the trades collection on the shard key  { ticker:1, time:1 }
// After sharding the collection, look at the chunks which exist:

use config
db.chunks.find()
// or:
db.chunks.find({}, {min:1,max:1,shard:1,_id:0,ns:1})
// Run homework.b() to verify the above and enter the return value below.
// result = 3




// Homework 6.3

// Let's now add a new shard. Run another mongod as the new shard on a new port number. Use --shardsvr.
// BIG NOTE TO SELF: must run the new mongod process WITH A NEW DBPATH!!!
// e.g. mongod --shardsvr --port 27030 --dbpath C:/data1
mongod --shardsvr --port 27030 --dbpath "C:\data1"

// Then add the shard to the cluster (see sh.help()).
sh.addShard("NCI-01940306.local:27030")


// You can confirm the above worked by running:

homework.check1()
// Now wait for the balancer to move data among the two shards more evenly. Periodically run:

use config
db.chunks.find( { ns:"week6.trades" }, {min:1,max:1,shard:1,_id:0} ).sort({min:1})
// and/or:

db.chunks.aggregate( [
 { $match : { ns : "week6.trades" } } ,
 { $group : { _id : "$shard", n : { $sum : 1 } } }
] )
// When done, run homework.c() and enter the result value.
// result = 2

// That completes this week's homework. However if you want to explore more, something to try would be to try some queries and/or write 
// operations with a single process down to see how the system behaves in such a situation.












// Sample stuff from the mongos process

// ... missing the first part of this....

        {  "_id" : "blogwk4",  "primary" : "shard0000",  "partitioned" : false }

        {  "_id" : "m101",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "pcat",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "performance",  "primary" : "shard0000",  "partitioned" : fal
se }
        {  "_id" : "school",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "store",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "studentsCh2",  "primary" : "shard0000",  "partitioned" : fal
se }
        {  "_id" : "test",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "usPop",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "week6",  "primary" : "shard0000",  "partitioned" : true }
                week6.trades
                        shard key: { "ticker" : 1, "time" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                shard0000       8
                        { "ticker" : { "$minKey" : 1 }, "time" : { "$minKey" : 1
 } } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:19.035Z") } on
 : shard0000 Timestamp(1, 0)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:
19.035Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:38.072Z
") } on : shard0000 Timestamp(1, 1)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:
38.072Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:57.119Z
") } on : shard0000 Timestamp(1, 2)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:
57.119Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:16.159Z
") } on : shard0000 Timestamp(1, 3)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:
16.159Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:35.197Z
") } on : shard0000 Timestamp(1, 4)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:
35.197Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:54.250Z
") } on : shard0000 Timestamp(1, 5)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:
54.250Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:14.023Z
") } on : shard0000 Timestamp(1, 6)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:
14.023Z") } -->> { "ticker" : { "$maxKey" : 1 }, "time" : { "$maxKey" : 1 } } on
 : shard0000 Timestamp(1, 7)

mongos> use config
switched to db config
mongos> db.chunks.find()
{ "_id" : "week6.trades-ticker_MinKeytime_MinKey", "ns" : "week6.trades", "min"
: { "ticker" : { "$minKey" : 1 }, "time" : { "$minKey" : 1 } }, "max" : { "ticke
r" : "abcd", "time" : ISODate("2012-03-03T14:08:19.035Z") }, "shard" : "shard000
0", "lastmod" : Timestamp(1, 0), "lastmodEpoch" : ObjectId("5776f00e118415f291af
8305") }
{ "_id" : "week6.trades-ticker_\"abcd\"time_new Date(1330783699035)", "ns" : "we
ek6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:19.
035Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:38.072
Z") }, "shard" : "shard0000", "lastmod" : Timestamp(1, 1), "lastmodEpoch" : Obje
ctId("5776f00e118415f291af8305") }
{ "_id" : "week6.trades-ticker_\"abcd\"time_new Date(1330784198072)", "ns" : "we
ek6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:38.
072Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:57.119
Z") }, "shard" : "shard0000", "lastmod" : Timestamp(1, 2), "lastmodEpoch" : Obje
ctId("5776f00e118415f291af8305") }
{ "_id" : "week6.trades-ticker_\"abcd\"time_new Date(1330784697119)", "ns" : "we
ek6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:57.
119Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:16.159
Z") }, "shard" : "shard0000", "lastmod" : Timestamp(1, 3), "lastmodEpoch" : Obje
ctId("5776f00e118415f291af8305") }
{ "_id" : "week6.trades-ticker_\"abcd\"time_new Date(1330785196159)", "ns" : "we
ek6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:16.
159Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:35.197
Z") }, "shard" : "shard0000", "lastmod" : Timestamp(1, 4), "lastmodEpoch" : Obje
ctId("5776f00e118415f291af8305") }
{ "_id" : "week6.trades-ticker_\"abcd\"time_new Date(1330785695197)", "ns" : "we
ek6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:35.
197Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:54.250
Z") }, "shard" : "shard0000", "lastmod" : Timestamp(1, 5), "lastmodEpoch" : Obje
ctId("5776f00e118415f291af8305") }
{ "_id" : "week6.trades-ticker_\"abcd\"time_new Date(1330786194250)", "ns" : "we
ek6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:54.
250Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:14.023
Z") }, "shard" : "shard0000", "lastmod" : Timestamp(1, 6), "lastmodEpoch" : Obje
ctId("5776f00e118415f291af8305") }
{ "_id" : "week6.trades-ticker_\"abcd\"time_new Date(1330786694023)", "ns" : "we
ek6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:14.
023Z") }, "max" : { "ticker" : { "$maxKey" : 1 }, "time" : { "$maxKey" : 1 } },
"shard" : "shard0000", "lastmod" : Timestamp(1, 7), "lastmodEpoch" : ObjectId("5
776f00e118415f291af8305") }
mongos> db.chunks.find({}, {min:1, max:1, shard:1, _id:0, ns:1})
{ "ns" : "week6.trades", "min" : { "ticker" : { "$minKey" : 1 }, "time" : { "$mi
nKey" : 1 } }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:1
9.035Z") }, "shard" : "shard0000" }
{ "ns" : "week6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-
03T14:08:19.035Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T
14:16:38.072Z") }, "shard" : "shard0000" }
{ "ns" : "week6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-
03T14:16:38.072Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T
14:24:57.119Z") }, "shard" : "shard0000" }
{ "ns" : "week6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-
03T14:24:57.119Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T
14:33:16.159Z") }, "shard" : "shard0000" }
{ "ns" : "week6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-
03T14:33:16.159Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T
14:41:35.197Z") }, "shard" : "shard0000" }
{ "ns" : "week6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-
03T14:41:35.197Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T
14:49:54.250Z") }, "shard" : "shard0000" }
{ "ns" : "week6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-
03T14:49:54.250Z") }, "max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T
14:58:14.023Z") }, "shard" : "shard0000" }
{ "ns" : "week6.trades", "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-
03T14:58:14.023Z") }, "max" : { "ticker" : { "$maxKey" : 1 }, "time" : { "$maxKe
y" : 1 } }, "shard" : "shard0000" }
mongos> homework.b()
3
mongos> sh.status()
2016-07-01T18:49:40.312-0400 I NETWORK  [thread1] Socket say send() errno:10054
An existing connection was forcibly closed by the remote host. 127.0.0.1:27017
2016-07-01T18:49:40.314-0400 E QUERY    [thread1] Error: socket exception [SEND_
ERROR] for 127.0.0.1:27017 :
DB.prototype._runCommandImpl@src/mongo/shell/db.js:117:16
DB.prototype.runCommand@src/mongo/shell/db.js:128:19
DB.prototype.runReadCommand@src/mongo/shell/db.js:112:16
DBQuery.prototype._exec@src/mongo/shell/query.js:117:26
DBQuery.prototype.hasNext@src/mongo/shell/query.js:276:5
DBCollection.prototype.findOne@src/mongo/shell/collection.js:289:10
printShardingStatus@src/mongo/shell/utils_sh.js:540:19
sh.status@src/mongo/shell/utils_sh.js:78:5
@(shell):1:1

2016-07-01T18:49:40.317-0400 I NETWORK  [thread1] trying reconnect to localhost:
27017 (127.0.0.1) failed
2016-07-01T18:49:40.321-0400 I NETWORK  [thread1] reconnect localhost:27017 (127
.0.0.1) ok
mongos> sh.status()
--- Sharding Status ---
  sharding version: {
        "_id" : 1,
        "minCompatibleVersion" : 5,
        "currentVersion" : 6,
        "clusterId" : ObjectId("5776ed7a118415f291af82bd")
}
  shards:
        {  "_id" : "shard0000",  "host" : "NCI-01940306.local:27018" }
  most recently active mongoses:
        "3.2.6" : 1
  balancer:
        Currently enabled:  yes
        Currently running:  no
        Failed balancer rounds in last 5 attempts:  1
        Last reported error:  No connection could be made because the target mac
hine actively refused it.
        Time of Reported error:  Fri Jul 01 2016 18:40:29 GMT-0400 (Eastern Stan
dard Time)
        Migration Results for the last 24 hours:
                No recent migrations
  databases:
        {  "_id" : "blog",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "blogwk3",  "primary" : "shard0000",  "partitioned" : false }

        {  "_id" : "blogwk4",  "primary" : "shard0000",  "partitioned" : false }

        {  "_id" : "m101",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "pcat",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "performance",  "primary" : "shard0000",  "partitioned" : fal
se }
        {  "_id" : "school",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "store",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "studentsCh2",  "primary" : "shard0000",  "partitioned" : fal
se }
        {  "_id" : "test",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "usPop",  "primary" : "shard0000",  "partitioned" : false }
        {  "_id" : "week6",  "primary" : "shard0000",  "partitioned" : true }
                week6.trades
                        shard key: { "ticker" : 1, "time" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                shard0000       8
                        { "ticker" : { "$minKey" : 1 }, "time" : { "$minKey" : 1
 } } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:19.035Z") } on
 : shard0000 Timestamp(1, 0)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:
19.035Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:38.072Z
") } on : shard0000 Timestamp(1, 1)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:
38.072Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:57.119Z
") } on : shard0000 Timestamp(1, 2)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:
57.119Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:16.159Z
") } on : shard0000 Timestamp(1, 3)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:
16.159Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:35.197Z
") } on : shard0000 Timestamp(1, 4)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:
35.197Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:54.250Z
") } on : shard0000 Timestamp(1, 5)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:
54.250Z") } -->> { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:14.023Z
") } on : shard0000 Timestamp(1, 6)
                        { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:
14.023Z") } -->> { "ticker" : { "$maxKey" : 1 }, "time" : { "$maxKey" : 1 } } on
 : shard0000 Timestamp(1, 7)

mongos> sh.help()
        sh.addShard( host )                       server:port OR setname/server:
port
        sh.enableSharding(dbname)                 enables sharding on the databa
se dbname
        sh.shardCollection(fullName,key,unique)   shards the collection
        sh.splitFind(fullName,find)               splits the chunk that find is
in at the median
        sh.splitAt(fullName,middle)               splits the chunk that middle i
s in at middle
        sh.moveChunk(fullName,find,to)            move the chunk where 'find' is
 to 'to' (name of shard)
        sh.setBalancerState( <bool on or not> )   turns the balancer on or off t
rue=on, false=off
        sh.getBalancerState()                     return true if enabled
        sh.isBalancerRunning()                    return true if the balancer ha
s work in progress on any mongos
        sh.disableBalancing(coll)                 disable balancing on one colle
ction
        sh.enableBalancing(coll)                  re-enable balancing on one col
lection
        sh.addShardTag(shard,tag)                 adds the tag to the shard
        sh.removeShardTag(shard,tag)              removes the tag from the shard

        sh.addTagRange(fullName,min,max,tag)      tags the specified range of th
e given collection
        sh.removeTagRange(fullName,min,max,tag)   removes the tagged range of th
e given collection
        sh.status()                               prints a general overview of t
he cluster
mongos> sh.addShard("NCI-01940306.local:27030")
{ "shardAdded" : "shard0001", "ok" : 1 }
mongos> use config
switched to db config
mongos> db.chunks.find({ns:"week6.trades"}, {min:1, max:1, shard:1, _id:0}).sort
({min:1})
{ "min" : { "ticker" : { "$minKey" : 1 }, "time" : { "$minKey" : 1 } }, "max" :
{ "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:19.035Z") }, "shard" : "
shard0001" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:19.035Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:38.072Z") }, "sha
rd" : "shard0001" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:38.072Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:57.119Z") }, "sha
rd" : "shard0001" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:57.119Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:16.159Z") }, "sha
rd" : "shard0001" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:16.159Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:35.197Z") }, "sha
rd" : "shard0000" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:35.197Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:54.250Z") }, "sha
rd" : "shard0000" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:54.250Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:14.023Z") }, "sha
rd" : "shard0000" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:14.023Z") }, "
max" : { "ticker" : { "$maxKey" : 1 }, "time" : { "$maxKey" : 1 } }, "shard" : "
shard0000" }
mongos> db.chunks.aggregate([{$match:{ns:"week6.trades"}}, {$group: { _id:"$shar
d", n:{$sum:1}}}])
{ "_id" : "shard0000", "n" : 4 }
{ "_id" : "shard0001", "n" : 4 }
mongos> db.chunks.find({ns:"week6.trades"}, {min:1, max:1, shard:1, _id:0}).sort
({min:1})
{ "min" : { "ticker" : { "$minKey" : 1 }, "time" : { "$minKey" : 1 } }, "max" :
{ "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:19.035Z") }, "shard" : "
shard0001" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:08:19.035Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:38.072Z") }, "sha
rd" : "shard0001" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:16:38.072Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:57.119Z") }, "sha
rd" : "shard0001" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:24:57.119Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:16.159Z") }, "sha
rd" : "shard0001" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:33:16.159Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:35.197Z") }, "sha
rd" : "shard0000" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:41:35.197Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:54.250Z") }, "sha
rd" : "shard0000" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:49:54.250Z") }, "
max" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:14.023Z") }, "sha
rd" : "shard0000" }
{ "min" : { "ticker" : "abcd", "time" : ISODate("2012-03-03T14:58:14.023Z") }, "
max" : { "ticker" : { "$maxKey" : 1 }, "time" : { "$maxKey" : 1 } }, "shard" : "
shard0000" }
mongos> db.chunks.aggregate([{$match:{ns:"week6.trades"}}, {$group: { _id:"$shar
d", n:{$sum:1}}}])
{ "_id" : "shard0000", "n" : 4 }
{ "_id" : "shard0001", "n" : 4 }
mongos> homework.c()
2
mongos>
