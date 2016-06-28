// var cfg = {
//     "_id":"hw51", 
//     "members":[
// 	{"_id":0, "host":"NCI-01940306.local:27001"}, 
// 	{"_id":1, "host":"NCI-01940306.local:27002"}, 
// 	{"_id":2, "host":"NCI-01940306.local:27003", arbiterOnly:true}
//     ]
// }

var cfg = {"_id":"hw51", "members":[ {"_id":0, "host":"NCI-01940306.local:27001"}, {"_id":1, "host":"NCI-01940306.local:27002"}, {"_id":2, "host":"NCI-01940306.local:27003", arbiterOnly:true}]}

// mkdir 1 2 3
// mongod --port 27001 --replSet hw51 --dbpath C:/Users/petersj/Downloads/hw5/1 --oplogSize 50 --smallfiles
// mongod --port 27002 --replSet hw51 --dbpath C:/Users/petersj/Downloads/hw5/2 --oplogSize 50 --smallfiles
// mongod --port 27003 --replSet hw51 --dbpath C:/Users/petersj/Downloads/hw5/3 --oplogSize 50 --smallfiles

// Go to a command window and change the working directory to "C:/Users/petersj/Downloads/hw5
// Create the 3 directories (1, 2, and 3)
// Then start 3 new mongod processes in each of 3 different command windows
mongod --port 27001 --replSet hw51 --dbpath 1 --oplogSize 50 --smallfiles
mongod --port 27002 --replSet hw51 --dbpath 2 --oplogSize 50 --smallfiles
mongod --port 27003 --replSet hw51 --dbpath 3 --oplogSize 50 --smallfiles


// Then go to a new command window and enter the following to connect to the server running on port 27001
mongo --port 27001

// Then create the config variable (cfg) as above
// var cfg = ... (see above)
// Then enter rs.initiate(cfg)
rs.initiate(cfg)

// This initates the replica set.

// To check on the status, use rs.status()



