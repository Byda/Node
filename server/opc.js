const { OPCUAClient, makeBrowsePath, DataType, AttributeIds, resolveNodeId, TimestampsToReturn, computeSignature, NodeId} = require("node-opcua");
const async = require("async");


class Infor {
    constructor (endpoint, OS_Type, OS_Number, OS_Location){
        this.endpoint = endpoint;
        this.OS_Location = OS_Location;
        this.OS_Number = OS_Number;
        this.OS_Type = OS_Type
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
  
  
    constructor(indicator, value,  unit,  LOWLOW,  LOW,  HIGH,  HIGHHIGH,  DEAD_BAND, ) {
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
        this.pre_severity = this.severity;
        this.calculateSeverity();
        if(this.severity != this.pre_severity) {
            this.startTime = Date.now()
        }
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
  
  const URL1 = new Infor("opc.tcp://20.205.122.62:3000/", 0, "Tram 1", "KCN Long Thanh")
  const URL2 = new Infor("opc.tcp://20.213.60.198:3000/", 0, "Tram 2", "KCN Bien Hoa")
  
// var Total = [];
var InforList = []
var DataList = []

InforList[0] = URL1;
InforList[1] = URL2;  

module.exports = function(io){

for(i=0; i<InforList.length; i++) {
    var _Data = []

    if(InforList[i].OS_Type == 0) { //Khi thai
      _Data[0] = new Data("Temperature", 0, "°C", 60, 70, 90, 100, 3)
      _Data[1] = new Data("Pressure", 0, "mbar", 800, 900, 1100, 1200, 20)
      _Data[2] = new Data("NO", 0, "mg/m3", 100, 110, 130, 140, 3)
      _Data[3] = new Data("NO2", 0, "mg/m3", 70, 80, 100, 110, 3)
      _Data[4] = new Data("CO", 0, "mg/m3", 590, 610, 670, 690, 20)
      _Data[5] = new Data("SO2", 0, "mg/m3", 150, 165, 195, 210, 5)
      _Data[6] = new Data("O2", 0, "%V", 55, 60, 85, 95, 3)
      _Data[7] = new Data("H2S", 0, "mg/m3", 70, 80, 100, 110, 3)
      _Data[8] = new Data("NH3", 0, "mg/m3", 680, 700, 760, 790, 20)
      _Data[9] = new Data("Hg", 0, "mg/m3", 160, 180, 220,240, 5)
      _Data[10] = new Data("PM", 0, "mg/m3", 130, 140, 160, 170, 3)

    // }else if(InforList[i].OS_Type == 1) { //Nuoc thai
    //   DataList[0] = new Data("Flow In", 0, "m3/h", 60, 70, 90, 100, 3)
    //   DataList[1] = new Data("Flow Out", 0, "m3/h", 800, 900, 1100, 1200, 20)
    //   DataList[2] = new Data("Temperature", 0, "°C", 100, 110, 130, 140, 3)
    //   DataList[3] = new Data("Color", 0, "Pt-Co", 70, 80, 100, 110, 3)
    //   DataList[4] = new Data("pH", 0, "", 590, 610, 670, 690, 20)
    //   DataList[5] = new Data("TSS", 0, "mg/L", 150, 165, 195, 210, 5)
    //   DataList[6] = new Data("COD", 0, "mg/L", 55, 60, 85, 95, 3)
    //   DataList[7] = new Data("NH4+", 0, "mg/L", 70, 80, 100, 110, 3)
    //   DataList[8] = new Data("Photpho+", 0, "mg/L", 680, 700, 760, 790, 20)
    //   DataList[9] = new Data("Nito", 0, "mg/L", 160, 180, 220,240, 5)
    //   DataList[10] = new Data("TOC", 0, "mg/L", 130, 140, 160, 170, 3)
    //   DataList[10] = new Data("Clo", 0, "mg/L", 130, 140, 160, 170, 3)
    
    // }else if(InforList[i].OS_Type == 2) { //Khong khi
    //   DataList[0] = new Data("Temperature", 0, "°C", 60, 70, 90, 100, 3)
    //   DataList[1] = new Data("NO2", 0, "ppb", 800, 900, 1100, 1200, 20)
    //   DataList[2] = new Data("CO", 0, "ppb", 100, 110, 130, 140, 3)
    //   DataList[3] = new Data("SO2", 0, "ppb", 70, 80, 100, 110, 3)
    //   DataList[4] = new Data("O3", 0, "ppb", 590, 610, 670, 690, 20)
    //   DataList[5] = new Data("PM10", 0, "ug/Nm3", 150, 165, 195, 210, 5)
    //   DataList[6] = new Data("PM2.5", 0, "ug/Nm3", 55, 60, 85, 95, 3)
    
    // }else if(InforList[i].OS_Type == 3) { //Nuoc mat
    //   DataList[0] = new Data("Temperature", 0, "°C", 60, 70, 90, 100, 3)
    //   DataList[1] = new Data("pH", 0, "", 800, 900, 1100, 1200, 20)
    //   DataList[2] = new Data("TSS", 0, "mg/L", 100, 110, 130, 140, 3)
    //   DataList[3] = new Data("COD", 0, "mg/L", 70, 80, 100, 110, 3)
    //   DataList[4] = new Data("DO", 0, "mg/L", 590, 610, 670, 690, 20)
    //   DataList[5] = new Data("NO3-", 0, "mg/L", 150, 165, 195, 210, 5)
    //   DataList[6] = new Data("PO4+", 0, "mg/L", 55, 60, 85, 95, 3)
    //   DataList[7] = new Data("NH4+", 0, "mg/L", 70, 80, 100, 110, 3)
    //   DataList[8] = new Data("Total P", 0, "mg/L", 680, 700, 760, 790, 20)
    //   DataList[9] = new Data("Total N", 0, "mg/L", 160, 180, 220,240, 5)
    //   DataList[10] = new Data("TOC", 0, "mg/L", 130, 140, 160, 170, 3)
    // }

    DataList[i] = _Data

  }
}

let the_session = [], the_subscription=[]

const connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
  };
  var client = [];

  for(i=0; i<InforList.length; i++) {
    client[i] = OPCUAClient.create();
    client[i].on("backoff", (retry, delay) =>
      console.log(
        "still trying to connect to ",
        ": retry =",
        retry,
        "next attempt in ",
        delay / 1000,
        "seconds"
      )
  );
  }

  async function broadcastData(OS_index, URL) {
  
	async.series([
    
        // step 1 : connect to
        function(callback)  {
            client[OS_index].connect(URL, function(err) {
              if (err) {
                console.log(" cannot connect to endpoint :",URl);
              } else {
                console.log("connected !");
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
           const lenght = 11;
           var itemsToMonitor=[]

          for (i=0; i<lenght; i++){
            var temp = 11101+i
          itemsToMonitor[i] =   {
            nodeId: "ns=2;i=" + (temp),
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

        DataList[OS_index][index].value = dataValue.value.value.toFixed(2)
        DataList[OS_index][index].calculateAlarm
                if(index==0)
        // console.log(DataList[1][0].value +"-----"+ URL)
        // console.log(Date_List[])
        io.emit('exchange-data', {
          infor: InforList,
					data: DataList
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
        //   the_session.write(nodesToWrite, function(err,data) {
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


for(i=0; i<InforList.length; i++) {
    broadcastData(i, InforList[i].endpoint);
  }
}

  