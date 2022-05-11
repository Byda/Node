const mongoose = require('mongoose')

const nodeSchema = new mongoose.Schema({
    id: {
        type: String, 
        required: true
    },

    value: {
        type: String,
        required: true
    },

    status: {
        type: Boolean,
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Node', nodeSchema);