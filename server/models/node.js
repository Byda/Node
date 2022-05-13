const mongoose = require('mongoose')

const nodeSchema = new mongoose.Schema({
    id: {
        type: String, 
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
    },
    LOWLOW: {
        type: Number
    },
    LOW: {
        type: Number
    },
    HIGH: {
        type: Number
    },
    HIGHHIGH: {
        type: Number
    },
    DEADBAND: {
        type: Number
    },
    severity:{
        type: Number
    },
    startTime: {
        type: Number
    },
    duration: {
        type: Number
    },
    content: {
        type: String
    },
    ACK: {
        type: Boolean
    },
    ACKUser: {
        type: String
    },
    ACKTime: {
        type: Number
    },
    c_LOWLOW: {
        type: Number
    },
    c_LOW: {
        type: Number
    },
    c_HIGH: {
        type: Number
    },
    c_HIGHHIGH: {
        type: Number
    },
    pre_severity:{
        type: Number
    },
})

module.exports = mongoose.model('node', nodeSchema);