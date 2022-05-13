export default class Infor {
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