const mongoose = require('mongoose')
const Schema =  mongoose.Schema

const alarmSchema = new Schema({
    OS_ID: {
        type: Number,
        required: true,
    },
    indicator: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    ACK: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('alarm', alarmSchema)