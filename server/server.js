require('dotenv').config()
const { OPCUAClient, BrowseDirection, makeBrowsePath, DataType, AttributeIds, resolveNodeId, TimestampsToReturn, computeSignature, NodeId, NodeClass, NodeCrawler} = require("node-opcua");
const async = require("async");

class Infor {
  constructor (id, endpoint, OS_Type, OS_Number, OS_Location){
      this.id = id
      this.endpoint = endpoint;
      this.OS_Location = OS_Location;
      this.OS_Number = OS_Number;
      this.OS_Type = OS_Type;
  }

  set  setEndpoint(endpoint) {
      this.endpoint = endpoint;
  }
  get  getEndpoint() {
      return this.endpoint;
  }

  set  setOS_Type(OS_Type) {
      this.OS_Type= OS_Type;
  }
  get  getOS_Type() {
      return this.OS_Type;
  }

  set  setOS_Number(OS_Number) {
      this.OS_Number = OS_Number;
  }
  get  getOS_Number() {
      return this.OS_Number;
  }

  set  setOS_Location(OS_Location) {
      this.OS_Location = OS_Location;
  }
  get  getOS_Location() {
      return this.OS_Location;
  }
         
}
class Data {
  severity = 0;


  constructor(indicator, value,  unit,  LOWLOW,  LOW,  HIGH,  HIGHHIGH,  DEAD_BAND) {
      this.indicator = indicator;
      this.value = value;
      this.unit = unit;
      this.severity = 0;
      this.startTime = 0;
      this.duration = 0;
      this.content = "";
      this.ACK = false;
      this.ackUser = "";
      this.ACKTime = 0;
      this.LOWLOW = this.c_LOWLOW =  LOWLOW;
      this.LOW = this.c_LOW = LOW;
      this.HIGH = this.c_HIGH = HIGH;
      this.HIGHHIGH = this.c_HIGHHIGH = HIGHHIGH;
      this.DEAD_BAND = DEAD_BAND;
      this.pre_severity = 0;
      this.pre_duration = 0;
      this.pre_content = "";
  }

  get  calculateAlarm() {
      this.calculateStartTime(); // included calculateSeverity()
      this.calculateDeadBand();
      this.calculateContent();
      this.calculateDuration();
  }

    calculateSeverity() {
      if(this.value <= this.c_LOWLOW || this.value >= this.c_HIGHHIGH) {
        this.severity = 2;
      } else if(this.value > this.c_LOWLOW && this.value <= this.c_LOW || this.value >= this.c_HIGH && this.value < this.c_HIGHHIGH) {
        this.severity = 1;
      } else this.severity = 0;
  }

    calculateContent() {

      if(this.value <= this.c_LOWLOW) {
        this.content = this.indicator + " is out of LOWLOW limit";
      } else if (this.value >= this.c_HIGHHIGH) {
        this.content = this.indicator + " is out of HIGHHIGH limit";
      } else if(this.value > this.c_LOWLOW && this.value <= this.c_LOW) {
        this.content = this.indicator + " is out of LOW limit";
      } else if (this.value >= this.c_HIGH && this.value < this.c_HIGHHIGH) {
        this.content = this.indicator + " is out of HIGH limit";
      } else
      this.content = this.indicator;
  }

    calculateStartTime() {
      this.pre_content = this.content;
      this.pre_severity = this.severity;
      this.calculateSeverity();
      if(this.severity != this.pre_severity) {
	  this.pre_duration = this.duration
          this.startTime = Date.now()
	  this.ACK = false
	  this.ackUser = ""
	  this.ACKTime = 0
      }
  }

	
get  catchNonAckAlarm() {
	if(this.pre_severity != this.severity && (this.pre_severity == 1 || this.pre_severity == 2)) {
		return true
	} else
	    return false
    }


    calculateDuration() {
      if(this.severity == 1 || this.severity == 2) {
        this.duration = Date.now() - this.startTime;
      } else this.duration = 0;
  }

    calculateDeadBand() {
      if(this.severity > this.pre_severity && this.severity == 1) {
          this.c_LOW = this.LOW + this.DEAD_BAND;
          this.c_HIGH = this.HIGH - this.DEAD_BAND;
      } else if(this.severity > this.pre_severity && this.severity == 2) {
          this.c_LOWLOW = this.LOWLOW + this.DEAD_BAND;
          this.c_HIGHHIGH = this.HIGHHIGH - this.DEAD_BAND;
      } if(this.severity < this.pre_severity && this.severity == 1) {
          this.c_LOWLOW = this.LOWLOW;
          this.c_HIGHHIGH = this.HIGHHIGH;
      } if(this.severity < this.pre_severity && this.severity == 0) {
          this.c_LOW = this.LOW;
          this.c_HIGH = this.HIGH;
      }
  }

  get  getIndicator() {
      return this.indicator;
  }

  set  setIndicator( indicator) {
      this.indicator = indicator;
  }

  get  getValue() {
      return value;
  }

  set  setValue( value) {
      this.value = value;
  }

  get  getUnit() {
      return unit;
  }

  set  setUnit( unit) {
      this.unit = unit;
  }

  get  getLOWLOW() {
      return LOWLOW;
  }

  set  setLOWLOW( LOWLOW) {
      this.LOWLOW = LOWLOW;
  }

  get  getLOW() {
      return LOW;
  }

  set  setLOW( LOW) {
      this.LOW = LOW;
  }

  get  getHIGH() {
      return HIGH;
  }

  set  setHIGH( HIGH) {
      this.HIGH = HIGH;
  }

  get  getHIGHHIGH() {
      return HIGHHIGH;
  }

  set  setHIGHHIGH( HIGHHIGH) {
      this.HIGHHIGH = HIGHHIGH;
  }

  get  getSeverity() {
      return severity;
  }

  set  setSeverity( severity) {
      this.severity = severity;
  }

  get  getStartTime() {
      return startTime;
  }

  set  setStartTime( startTime) {
      this.startTime = startTime;
  }

  get  getDuration() {
      return duration;
  }

  set  setDuration( duration) {
      this.duration = duration;
  }

  get  getContent() {
      return content;
  }

  set  setContent( content) {
      this.content = content;
  }

  get getACK() {
      return ACK;
  }

  set  setACK( ACK) {
      this.ACK = ACK;
  }

  get  getAckUser() {
      return ackUser;
  }

  set  setAckUser( ackUser) {
      this.ackUser = ackUser;
  }

  get  getACKTime() {
      return ACKTime;
  }

  set  setACKTime( ACKTime) {
      this.ACKTime = ACKTime;
  }

  get  getDEAD_BAND() {
      return DEAD_BAND;
  }

  set setDEAD_BAND(DEAD_BAND) {
      this.DEAD_BAND = DEAD_BAND;
  }
}



const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const hbs_sections = require("express-handlebars-sections")
const bodyParser = require("body-parser")
const session = require("express-session")
const Alarm = require("./models/alarm")
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

app.engine('hbs', exphbs.engine(
  {layoutsDir: './views/_layouts', defaultLayout: 'main.hbs', partialsDir: './views/_partials', extname: '.hbs', 
  helpers: { 
    section: hbs_sections(),
    switch: function(value, options) {
      this.switch_value = value;
      return options.fn(this);
    },
    case: function(value, options) {
      if (value == this.switch_value) {
        return options.fn(this);
      }
    }
  } 
  }));
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

app.use(async(req, res, next)=>{
  var types = [{id: 0, name: "Khi thai"},{id: 1, name: "Khong khi"},{id: 2, name: "Nuoc thai"},{id: 3, name: "Nuoc mat"},]
  var stations = InforList
  res.locals.lcStations = stations,
  res.locals.lcTypes = types
  next();
})

app.use(async(req, res, next)=>{
  if(req.session.isAuthenticated === null){
    req.session.isAuthenticated = false;
  }
  res.locals.lcIsAuthenticated = req.session.isAuthenticated;
  res.locals.lcUser = req.session.userAuth;
  next();
})
app.use('/', routeLogin)
app.use('/home', require("./routes/home"))
app.use('/account', routeLogin)


app.get('/trend', (req, res) =>{
    res.render('trend');
})
// app.get('/tram1', (req, res) =>{
//   res.render('tram1');
// })
// app.get('/tram2', (req, res) =>{
//   res.render('tram2');
// })
// app.get('/tram3', (req, res) =>{
//   res.render('tram3');
// })
// app.get('/write', (req, res) =>{
//   res.render('write');
// })
app.use('/_trend', require("./routes/_trend"))

app.use('/report', require('./routes/report'))
app.use('/alarm', require('./routes/alarm'))


//const nodesRouter = require('./routes/nodes');
//app.use('/nodes', nodesRouter)

server.listen(3000, () => console.log(`Server strated`))

// var Total = [];
var InforList = []
var DataList = []

InforList[0] = new Infor(0, "opc.tcp://VPS:4840/", 0, "Tram 1", "KCN Long Thanh")
InforList[1] = new Infor(1, "opc.tcp://VPS:4841/", 1, "Tram 2", "KCN Bien Hoa")
InforList[2] = new Infor(2, "opc.tcp://VPS:4842/", 2, "Tram 5", "KCN VSIP")
InforList[3] = new Infor(3, "opc.tcp://VPS:4843/", 3, "Tram 1", "Song Dong Nai")
InforList[4] = new Infor(4, "opc.tcp://10.66.66.5:4840/", 4, "Tram 1", "Bach Khoa CS1")
InforList[5] = new Infor(5, "opc.tcp://VPS:4843/", 3, "Tram 3", "Ho Dau Tieng")
InforList[6] = new Infor(6, "opc.tcp://VPS:4841/", 1, "Tram 2", "KCN Duc Hoa")
InforList[7] = new Infor(7, "opc.tcp://VPS:4840/", 0, "Tram 1", "KCN Binh Duong")
InforList[8] = new Infor(8, "opc.tcp://VPS:4842/", 2, "Tram 7", "KCNC Thu Duc")
InforList[9] = new Infor(9, "opc.tcp://VPS:4840/", 0, "Tram 3", "KCN Long Thanh")
InforList[10] = new Infor(10, "opc.tcp://VPS:4841/", 1, "Tram 4", "KCN Bien Hoa")
InforList[11] = new Infor(11, "opc.tcp://VPS:4842/", 2, "Tram 2", "KCN VSIP")
InforList[12] = new Infor(12, "opc.tcp://VPS:4843/", 3, "Tram 4", "Song Dong Nai")
InforList[13] = new Infor(13, "opc.tcp://VPS:4843/", 3, "Tram 1", "Ho Dau Tieng")
InforList[14] = new Infor(14, "opc.tcp://VPS:4841/", 1, "Tram 7", "KCN Duc Hoa")
InforList[15] = new Infor(15, "opc.tcp://VPS:4840/", 0, "Tram 4", "KCN Binh Duong")
InforList[16] = new Infor(16, "opc.tcp://VPS:4842/", 2, "Tram 3", "KCN VSIP")


for(i=0; i<InforList.length; i++) {
    var _Data = []

    if(InforList[i].OS_Type == 0) { //Khi thai
      _Data[0] = new Data("Temperature", 0, "°C", 60, 70, 90, 100, 3)
      _Data[1] = new Data("Pressure", 0, "mbar", 800, 900, 1100, 1200, 20)
      _Data[2] = new Data("NO", 0, "mg/m3", 20, 25, 45, 50, 3)
      _Data[3] = new Data("NO2", 0, "mg/m3", 25, 30, 50, 55, 3)
      _Data[4] = new Data("CO", 0, "mg/m3", 590, 610, 670, 690, 20)
      _Data[5] = new Data("SO2", 0, "mg/m3", 150, 165, 195, 210, 5)
      _Data[6] = new Data("O2", 0, "%V", 55, 60, 85, 95, 3)
      _Data[7] = new Data("H2S", 0, "mg/m3", 70, 80, 100, 110, 3)
      _Data[8] = new Data("NH3", 0, "mg/m3", 5, 10, 20, 25, 2)
      _Data[9] = new Data("Hg", 0, "mg/m3", 10, 15, 25,30, 2)
      _Data[10] = new Data("PM", 0, "mg/m3", 130, 140, 160, 170, 3)

    }else if(InforList[i].OS_Type == 1) { //Nuoc thai
      _Data[0] = new Data("Flow In", 0, "m3/h", 800, 900, 1100, 1200, 20)
      _Data[1] = new Data("Flow Out", 0, "m3/h", 800, 900, 1100, 1200, 20)
      _Data[2] = new Data("Temperature", 0, "°C", 20, 25, 35, 40, 3)
      _Data[3] = new Data("Color", 0, "Pt-Co", 5, 7, 13, 15, 1)
      _Data[4] = new Data("pH", 0, "", 5, 6, 8, 9, 0.5)
      _Data[5] = new Data("TSS", 0, "mg/L", 160, 170, 190, 200, 3)
      _Data[6] = new Data("COD", 0, "mg/L", 55, 65, 85, 95, 3)
      _Data[7] = new Data("NH4+", 0, "mg/L", 70, 80, 100, 110, 3)
      _Data[8] = new Data("Photpho+", 0, "mg/L", 5, 10, 20, 25, 2)
      _Data[9] = new Data("Nito", 0, "mg/L", 15, 20, 30,35, 2)
      _Data[10]  = new Data("TOC", 0, "mg/L", 130, 140, 160, 170, 3)
      _Data[11]  = new Data("Clo", 0, "mg/L", 270, 280, 300, 310, 10)
    
    }else if(InforList[i].OS_Type == 2) { //Khong khi
      _Data[0] = new Data("Temperature", 0, "°C", 10, 15, 25, 30, 3)
      _Data[1] = new Data("NO2", 0, "ppb", 800, 900, 1100, 1200, 20)
      _Data[2] = new Data("CO", 0, "ppb", 25, 30, 40, 45, 3)
      _Data[3] = new Data("SO2", 0, "ppb", 30, 35, 45, 50, 3)
      _Data[4] = new Data("O3", 0, "ppb", 590, 610, 670, 690, 20)
      _Data[5] = new Data("PM10", 0, "ug/Nm3", 150, 165, 195, 210, 5)
      _Data[6] = new Data("PM2.5", 0, "ug/Nm3", 55, 60, 85, 95, 3)
    
    }else if(InforList[i].OS_Type == 3) { //Nuoc mat
      _Data[0] = new Data("Temperature", 0, "°C", 10, 15, 25, 30, 3)
      _Data[1] = new Data("pH", 0, "", 5,6, 8, 9, 0.5)
      _Data[2] = new Data("TSS", 0, "mg/L", 25, 30, 40, 45, 3)
      _Data[3] = new Data("COD", 0, "mg/L", 30, 35, 45, 50, 3)
      _Data[4] = new Data("DO", 0, "mg/L", 590, 610, 670, 690, 20)
      _Data[5] = new Data("NO3-", 0, "mg/L", 150, 165, 195, 210, 5)
      _Data[6] = new Data("PO4+", 0, "mg/L", 55, 60, 85, 95, 3)
      _Data[7] = new Data("NH4+", 0, "mg/L", 70, 80, 100, 110, 3)
      _Data[8] = new Data("Total P", 0, "mg/L", 8, 10, 20, 22, 1)
      _Data[9] = new Data("Total N", 0, "mg/L", 15, 20, 30,35, 2)
      _Data[10] = new Data("TOC", 0, "mg/L", 130, 140, 160, 170, 3)
    }else if(InforList[i].OS_Type == 4) { //Bach khoa
      _Data[0] = new Data("Button ON", 0, "", 0, 0, 0, 0, 3)
      _Data[1] = new Data("Button OFF", 0, "", 0, 0, 0, 0, 3)
    }

    DataList[i] = _Data

}


// console.log(DataList[0][0])

let the_session = [], the_subscription=[]
  
const connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
};

var client = [];

for(i=0; i<5; i++) {
	client[i] = OPCUAClient.create();
}

async function broadcastData(OS_index, OS_Type, URL, numIndicator) {
	var nodeIdList = []

	async.series([
    
        // step 1 : connect to
        function(callback)  {
	    client[OS_index].connect(URL, function(err) {
              if (err) {
                console.log(" cannot connect to endpoint :",URl);
              } else {
                console.log("connected !");

		/*client[OS_index].on("after_reconnection", () => {
			if(isConnect[OS_index] != true) {
				isConnect[OS_index] = true;
			}
		});*/

		client[OS_index].on("backoff", (retry, delay) => {
        		console.log(
                		"still trying to connect to ",
                		": retry =",
                		retry,
                		"next attempt in ",
                		delay / 1000,
                		"seconds"
        		)
    	    	});
              }
              callback(err);
            });
},
    
        // step 2 : createSession
        function(callback) {
            client[OS_index].createSession(function(err, session) {
              if (err) {
                return callback(err);
              }
              the_session[OS_index] = session;
              callback();
            });
        },

	// step 3 : browse
        /*function(callback) {
		var browseOption =
            	{
                	nodeId: "ObjectsFolder",
//                	referenceTypeId: "Organizes",
//                	browseDirection: BrowseDirection.Inverse,
                	includeSubtypes: true,
                	nodeClassMask: NodeClass.Variable,
                	resultMask: 63
            	}

		var crawler = new NodeCrawler(the_session[OS_index]);

		crawler.on("browsed",function(element){
			if(element.nodeClass == NodeClass.Variable && !(element.nodeId.toString().includes("ns=0"))) {
 	   			if(!element.browseName.toString().includes("OS_Type") && !element.browseName.toString().includes("OS_Location") && !element.browseName.toString().includes("OS_Num")) {
					nodeIdList[nodeIdList.length] = element.nodeId.toString();
				}
				console.log(nodeIdList)
			}
		});
		
		the_session[OS_index].browse(browseOption, function(err, browseResult) {
             		if (!err) {
               			console.log("Browsing rootfolder: ");
               			for (let reference of browseResult.references) {
                			crawler.read(reference.nodeId, function (err, obj) {})
				}
			}
			return callback(err);
         	});

       },*/

	// step 5: install a subscription and install a monitored item for 10 seconds
        function(callback) {
           const subscriptionOptions = {
             maxNotificationsPerPublish: 1000,
             publishingEnabled: true,
             requestedLifetimeCount: 10000,
             requestedMaxKeepAliveCount: 10,
             requestedPublishingInterval: 500
           };


           the_session[OS_index].createSubscription2(subscriptionOptions, (err, subscription) => {
             if (err) {
               return callback(err);
             }
           
             the_subscription[OS_index] = subscription;

	     process.on('SIGINT', function() {
		console.log("Ctrl+C interrupt signal");
		console.log("Client disconnecting...");

		the_subscription[OS_index].terminate();
		the_session[OS_index].close();
		client[OS_index].disconnect();
		process.exit();
	     });
           
             the_subscription[OS_index]
               .on("started", () => {
                 console.log(
                   "subscription started for 2 seconds - subscriptionId=",
                   the_subscription[OS_index].subscriptionId
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
	   var length = numIndicator;
           
           var itemsToMonitor=[]

          for (i=0; i<length; i++){
		  var temp = 11101 + i;
          itemsToMonitor[i] =   {
            nodeId: "ns=2;i=" + temp,
            attributeId: AttributeIds.Value
          }
          }

           const monitoringParamaters = {
             samplingInterval: 500,
             discardOldest: true,
             queueSize: 10
        };

           the_subscription[OS_index].monitorItems(
             itemsToMonitor,
             monitoringParamaters,
             TimestampsToReturn.Both,
             (err, monitoredItems) => {
               	monitoredItems.on("changed", function(err, dataValue, index) {
			if(OS_Type == 4) {
				var i = dataValue.value.value ? 1 : 0
				console.log(i)
				DataList[OS_index][index].value = i
			} else {
        			DataList[OS_index][index].value = dataValue.value.value.toFixed(2)
        			DataList[OS_index][index].calculateAlarm
				if(DataList[OS_index][index].catchNonAckAlarm){
              console.log(DataList[OS_index][index].pre_severity + "  "+ DataList[OS_index][index].severity)
              const newAlarm = new Alarm({
                OS_ID: InforList[OS_index].id,
		OS_Type: InforList[OS_index].OS_Type,
                OS_Location: InforList[OS_index].OS_Location,
                OS_Number: InforList[OS_index].OS_Number,
                indicator: DataList[OS_index][index].indicator, 
                value: DataList[OS_index][index].value,
                unit: DataList[OS_index][index].unit,
                severity: DataList[OS_index][index].pre_severity,
                content: DataList[OS_index][index].pre_content,
                LOWLOW: DataList[OS_index][index].LOWLOW,
                HIGHHIGH: DataList[OS_index][index].HIGHHIGH,
                LOW: DataList[OS_index][index].LOW,
                HIGH: DataList[OS_index][index].HIGH,
                DEADBAND: DataList[OS_index][index].DEAD_BAND,
                startTime: DataList[OS_index][index].startTime,
                duration: DataList[OS_index][index].pre_duration,
                ACK: DataList[OS_index][index].ACK,
                ACKUser: DataList[OS_index][index].ackUser,
                ACKTime: DataList[OS_index][index].ACKTime
              })
              //console.time('start')
              update(newAlarm)
              //console.timeEnd('start')

            	
				}
			}
		});

                callback();
             }
           );
           console.log("-------------------------------------");
        },

	])
}

for(i=0; i<5; i++) {
  broadcastData(i, InforList[i].OS_Type, InforList[i].endpoint, DataList[i].length);
}


io.on('connection', (socket) => {
	console.log("Client with ID " + socket.id + " is connected!")

	io.to(`${socket.id}`).emit('vps-send-clientID', {
                clientID: socket.id.toString()
        })

	io.to(`${socket.id}`).emit('vps-send-inforlist', {
		infor: InforList
	})

	socket.on('client-send-runLED1', (rn) => {
                //console.log(dt)
                run = rn
                var nodesToWrite = {
                                nodeId: resolveNodeId("ns=2;i=11116"),
                                attributeId: AttributeIds.Value,
                                value: {
                                        value: {
                                                dataType: DataType.Boolean,
                                                value: run
                                        }
                                }
                        };
                        the_session[2].write(nodesToWrite, function(err,data) {
                                if (err) {
                                        console.log("Fail to write" );
                                        console.log(data);
                                        return callback(err)
                                }else {
                                        console.log(data);
                                        return data;
                                }
                        });
        })

	socket.on('client-send-duty', (dt) => {
		//console.log(dt)
		duty = dt
		var nodesToWrite = {
                                nodeId: resolveNodeId("ns=2;i=11115"),
                                attributeId: AttributeIds.Value,
                                value: {
                                        value: {
                                                dataType: DataType.UInt16,
                                                value: duty
                                        }
                                }
                        };
                        the_session[2].write(nodesToWrite, function(err,data) {
                                if (err) {
                                        console.log("Fail to write" );
                                        console.log(data);
                                        return callback(err)
                                }else {
                                        console.log(data);
                                        return data;
                                }
                        });
	})

	socket.on('alarmLog', (OS_index, data) => {
		console.log(OS_index)
		console.log(data)
		DataList[InforList[OS_index].OS_Type][data.id].ACK = data.ACK
		DataList[InforList[OS_index].OS_Type][data.id].ackUser = data.ackUser
		DataList[InforList[OS_index].OS_Type][data.id].ACKTime = data.ACKTime
		
		const newAlarm = new Alarm({
      OS_Type: InforList[OS_index].OS_Type,
      OS_Location: InforList[OS_index].OS_Location,
      OS_Number: InforList[OS_index].OS_Number,
      indicator: data.indicator, 
      value: data.value,
      unit: data.unit,
      severity: data.pre_severity,
      content: data.pre_content,
      LOWLOW: data.LOWLOW,
      HIGHHIGH: data.HIGHHIGH,
      LOW: data.LOW,
      HIGH: data.HIGH,
      DEADBAND: data.DEAD_BAND,
      startTime: data.startTime,
      duration: data.pre_duration,
      ACK: data.ACK,
      ACKUser: data.ackUser,
      ACKTime: data.ACKTime
    })
    update(newAlarm)
			})

	socket.on('client-send-OS_index', (clientID, OS_index_client) => {

		setInterval(function(){
			io.to(`${clientID}`).emit('vps-send-data', {
          data: DataList[OS_index_client]
			})
		}, 500);
		
	})
})
async function update (alarm){
  await alarm.save()
}
