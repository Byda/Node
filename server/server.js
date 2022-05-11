require('dotenv').config()
const { OPCUAClient, makeBrowsePath, DataType, AttributeIds, resolveNodeId, TimestampsToReturn, computeSignature} = require("node-opcua");
const async = require("async");

//const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";
const endpoint = "opc.tcp://20.205.122.62:3000/"
const endpoint2 = "opc.tcp://20.123.60.198:12345/"

const connectionStrategy = {
  initialDelay: 1000,
  maxRetry: 1
};
const client = OPCUAClient.create({
  applicationName: "NodeOPCUA-Client",
  connectionStrategy: connectionStrategy,
  endpointMustExist: false
});

const client2 = OPCUAClient.create({
  applicationName: "NodeOPCUA-Client",
  connectionStrategy: connectionStrategy,
  endpointMustExist: false
});

client.on("backoff", (retry, delay) =>
      console.log(
        "still trying to connect to ",
        ": retry =",
        retry,
        "next attempt in ",
        delay / 1000,
        "seconds"
      )
);
client2.on("backoff", (retry, delay) =>
      console.log(
        "still trying to connect to ",
        ": retry =",
        retry,
        "next attempt in ",
        delay / 1000,
        "seconds"
      )
);

let the_session, the_subscription;

const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const hbs_sections = require("express-handlebars-sections")
const bodyParser = require("body-parser")
const session = require("express-session")


const app = express();
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
const routeLogin = require('./routes/login')

const ConnectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Connect to Mongo")
    } catch (error) {
        console.log(error)
    }
}

ConnectDB()

app.use(express.json())

app.engine('hbs', exphbs.engine({layoutsDir: './views/_layouts', defaultLayout: 'main.hbs', partialsDir: './views/_partials', extname: '.hbs', helpers: { section: hbs_sections()} }));
app.set('view engine', 'hbs')
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json())

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

app.use('/home', require("./routes/home"))
app.use('/login', routeLogin)

app.use(async(req, res, next)=>{
  if(req.session.isAuthenticated === null){
    req.session.isAuthenticated = false;
  }
  res.locals.lcIsAuthenticated = req.session.isAuthenticated;
  res.locals.lcUser = req.session.userAuth;
  next();
})

app.get('/trend', (req, res) =>{
    res.render('trend');
})

const nodesRouter = require('./routes/nodes');
app.use('/nodes', nodesRouter)

server.listen(3000, () => console.log(`Server strated`))

async function broadcastData() {
	async.series([
    
        // step 1 : connect to
        function(callback)  {
            client.connect(endpoint, function(err) {
              if (err) {
                console.log(" cannot connect to endpoint :", endpoint);
              } else {
                console.log("connected !");
              }
              callback(err);
            });
},
    
        // step 2 : createSession
        function(callback) {
            client.createSession(function(err, session) {
              if (err) {
                return callback(err);
              }
              the_session = session;
              callback();
            });
        },

	// step 5: install a subscription and install a monitored item for 10 seconds
        function(callback) {
           const subscriptionOptions = {
             maxNotificationsPerPublish: 1000,
             publishingEnabled: true,
             requestedLifetimeCount: 10000,
             requestedMaxKeepAliveCount: 10,
             requestedPublishingInterval: 500
           };
           the_session.createSubscription2(subscriptionOptions, (err, subscription) => {
             if (err) {
               return callback(err);
             }
           
             the_subscription = subscription;

	     process.on('SIGINT', function() {
		console.log("Ctrl+C interrupt signal");
		console.log("Client disconnecting...");

		the_subscription.terminate();
		the_session.close();
		client.disconnect();
		process.exit();
	     });
           
             the_subscription
               .on("started", () => {
                 console.log(
                   "subscription started for 2 seconds - subscriptionId=",
                   the_subscription.subscriptionId
                 );
               })
               .on("keepalive", function() {
                 console.log("subscription keepalive");
               })
               .on("terminated", function() {
                 console.log("terminated");
               });
             callback();
           });
        },
        function(callback) {
           // install monitored item
           const itemsToMonitor = [
	    {
            nodeId: resolveNodeId("ns=2;i=11101"),
            attributeId: AttributeIds.Value
        },
	    {
	        nodeId: resolveNodeId("ns=2;i=11102"),
            attributeId: AttributeIds.Value
	    },
        {
            nodeId: resolveNodeId("ns=2;i=11103"),
            attributeId: AttributeIds.Value
        },
      {
          nodeId: resolveNodeId("ns=2;i=11114"),
          attributeId: AttributeIds.Value
      }
	    ];
           const monitoringParamaters = {
             samplingInterval: 500,
             discardOldest: true,
             queueSize: 10
        };

           the_subscription.monitorItems(
             itemsToMonitor,
             monitoringParamaters,
             TimestampsToReturn.Both,
             (err, monitoredItems) => {
               monitoredItems.on("changed", function(err, dataValue, index) {
                function alarm(value){
                  var threshold = 0.000002;
                  if (value>pre_value){
                    var pre_value = value;
                    return true;
                }else{
                  var pre_value = value;
                  return false;
                }

              };
        if (index==2){
          console.log(alarm(dataValue.value.value))
        }
        io.emit('exchange-data', {
					index: index,
          value: parseFloat(dataValue.value.value.toFixed(2)),
					//serverTimestamp: dataValue.serverTimestamp.toISOString(),
					status: dataValue.statusCode._name,
          alarm: alarm(parseFloat(dataValue.value.value.toFixed(2)))
        })
               });
               callback();
             }
           );
           console.log("-------------------------------------");
        },

        //Write a variable
        function(callback){
          var nodesToWrite = {
            nodeId: resolveNodeId("ns=2;i=11114"),
            attributeId: AttributeIds.Value,
            value: { 
              value: { 
                  dataType: DataType.Float,
                  value: 34.345
              }
            }
          };
          the_session.write(nodesToWrite, function(err,data) {
            if (err) {
                console.log("Fail to write" );
                console.log(data);
                return callback(err)
            }
            else {
              console.log(data);
              return data;
            }
          });
          let val = the_session.read({nodeId: resolveNodeId("ns=2;i=11114")})  
          console.log(val.value);

        },

        function(callback) {
            // wait a little bit : 10 seconds
            setTimeout(()=>callback(), 50*1000);
        },
        // terminate session
        function(callback) {
            the_subscription.terminate(callback);;
        },
        // close session
        function(callback) {
            the_session.close(function(err) {
              if (err) {
                console.log("closing session failed ?");
              }
              callback();
            });
        }
    
    ],
    function(err) {
        if (err) {
            console.log(" failure ",err);
        } else {
            console.log("done!");
        }
        client.disconnect(function(){});
    });
}
async function broadcastData2() {
	async.series([
    
        // step 1 : connect to
        function(callback)  {
            client2.connect(endpoint, function(err) {
              if (err) {
                console.log(" cannot connect to endpoint :", endpoint2);
              } else {
                console.log("connected !");
              }
              callback(err);
            });
},
    
        // step 2 : createSession
        function(callback) {
            client2.createSession(function(err, session2) {
              if (err) {
                return callback(err);
              }
              the_session2 = session2;
              callback();
            });
            
        },

	// step 5: install a subscription and install a monitored item for 10 seconds
        function(callback) {
           const subscriptionOptions = {
             maxNotificationsPerPublish: 1000,
             publishingEnabled: true,
             requestedLifetimeCount: 10000,
             requestedMaxKeepAliveCount: 10,
             requestedPublishingInterval: 500
           };
           the_session2.createSubscription2(subscriptionOptions, (err, subscription) => {
             if (err) {
               return callback(err);
             }
           
             the_subscription2 = subscription;

	     process.on('SIGINT', function() {
		console.log("Ctrl+C interrupt signal");
		console.log("Client disconnecting...");

		the_subscription2.terminate();
		the_session2.close();
		client2.disconnect();
		process.exit();
	     });
           
             the_subscription2
               .on("started", () => {
                 console.log(
                   "subscription started for 2 seconds - subscriptionId=",
                   the_subscription2.subscriptionId
                 );
               })
               .on("keepalive", function() {
                 console.log("subscription keepalive");
               })
               .on("terminated", function() {
                 console.log("terminated");
               });
             callback();
           });
        },
        function(callback) {
           // install monitored item
           const itemsToMonitor = [
	    {
            nodeId: resolveNodeId("ns=2;i=11104"),
            attributeId: AttributeIds.Value
        },
	    {
	        nodeId: resolveNodeId("ns=2;i=11105"),
            attributeId: AttributeIds.Value
	    },
        {
            nodeId: resolveNodeId("ns=2;i=11106"),
            attributeId: AttributeIds.Value
        },
      {
          nodeId: resolveNodeId("ns=2;i=11114"),
          attributeId: AttributeIds.Value
      }
	    ];
           const monitoringParamaters = {
             samplingInterval: 500,
             discardOldest: true,
             queueSize: 10
        };

           the_subscription2.monitorItems(
             itemsToMonitor,
             monitoringParamaters,
             TimestampsToReturn.Both,
             (err, monitoredItems) => {
               monitoredItems.on("changed", function(err, dataValue, index) {
		 
        if (index==2){
          console.log(dataValue.value.value)
        }
        io.emit('exchange-data2', {
					index: index,
          value: parseFloat(dataValue.value.value.toFixed(2)),
					//serverTimestamp: dataValue.serverTimestamp.toISOString(),
					status: dataValue.statusCode._name
        })
               });
               callback();
             }
           );
           console.log("-------------------------------------");
        },

        //Write a variable
        // function(callback){
        //   var nodesToWrite = {
        //     nodeId: resolveNodeId("ns=2;i=11114"),
        //     attributeId: AttributeIds.Value,
        //     value: { 
        //       value: { 
        //           dataType: DataType.Float,
        //           value: 34.345
        //       }
        //     }
        //   };
        //   the_session2.write(nodesToWrite, function(err,data) {
        //     if (err) {
        //         console.log("Fail to write" );
        //         console.log(data);
        //         return callback(err)
        //     }
        //     else {
        //       console.log(data);
        //       return data;
        //     }
        //   });
        //   let val = the_session.read({nodeId: resolveNodeId("ns=2;i=11114")})  
        //   console.log(val.value);
        // },
    
    ])
}		

broadcastData();
broadcastData2()



