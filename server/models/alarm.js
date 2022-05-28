const mongoose = require('mongoose')
const Schema =  mongoose.Schema

const alarmSchema = new Schema({
    OS_ID: {
        type: Number,
        required: true
    },
    OS_Type: {
        type: Number,
        required: true
    },
    OS_Location: {
        type: String,
        required: true
    },
    OS_Number: {
        type: String,
        required: true
    },
    indicator: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    unit:{
        type: String,
    },
    severity: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    startTime: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    ACK: {
        type: Boolean,
    },
    ACKUser: {
        type: String,
    },
    ACKTime: {
        type: Number,
    },
    LOWLOW: {
        type: Number,
        required: true
    },
    HIGHHIGH: {
        type: Number,
        required: true
    },
    LOW: {
        type: Number,
        required: true
    },
    HIGH: {
        type: Number,
        required: true
    },
    DEADBAND: {
        type: Number,
        required: true
    },
    
 
})

module.exports = mongoose.model('alarm', alarmSchema)