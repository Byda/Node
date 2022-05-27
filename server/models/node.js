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
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('node', nodeSchema);