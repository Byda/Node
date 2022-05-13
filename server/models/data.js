 class Data {


    constructor( indicator,  value,  unit,  LOWLOW,  LOW,  HIGH,  HIGHHIGH,  DEAD_BAND) {
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

      calculateAlarm() {
        calculateStartTime(); // included calculateSeverity()
        calculateDeadBand();
        calculateContent();
        calculateDuration();
    }

      calculateSeverity() {
        if(value <= c_LOWLOW || value >= c_HIGHHIGH) {
            severity = 2;
        } else if(value > c_LOWLOW && value <= c_LOW || value >= c_HIGH && value < c_HIGHHIGH) {
            severity = 1;
        } else severity = 0;
    }

      calculateContent() {

        if(value <= c_LOWLOW) {
            content = indicator + " is out of LOWLOW limit";
        } else if (value >= c_HIGHHIGH) {
            content = indicator + " is out of HIGHHIGH limit";
        } else if(value > c_LOWLOW && value <= c_LOW) {
            content = indicator + " is out of LOW limit";
        } else if (value >= c_HIGH && value < c_HIGHHIGH) {
            content = indicator + " is out of HIGH limit";
        } else
            content = indicator;
    }

      calculateStartTime() {
        this.pre_severity = severity;
        calculateSeverity();
        if(severity != pre_severity) {
            startTime = System.currentTimeMillis();
        }
    }

      calculateDuration() {
        if(severity == 1 || severity == 2) {
            duration = System.currentTimeMillis() - startTime;
        } else duration = 0;
    }

      calculateDeadBand() {
        if(severity > pre_severity && severity == 1) {
            this.c_LOW = this.LOW + this.DEAD_BAND;
            this.c_HIGH = this.HIGH - this.DEAD_BAND;
        } else if(severity > pre_severity && severity == 2) {
            this.c_LOWLOW = this.LOWLOW + this.DEAD_BAND;
            this.c_HIGHHIGH = this.HIGHHIGH - this.DEAD_BAND;
        } if(severity < pre_severity && severity == 1) {
            this.c_LOWLOW = this.LOWLOW;
            this.c_HIGHHIGH = this.HIGHHIGH;
        } if(severity < pre_severity && severity == 0) {
            this.c_LOW = this.LOW;
            this.c_HIGH = this.HIGH;
        }
    }

    get  getIndicator() {
        return indicator;
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
