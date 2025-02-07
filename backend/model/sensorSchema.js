const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    sensorData: [{
        sensorClientId: {
            type: String, required: [true, "sensorClientId is required for unique identification"]
        },
        sensorData: {
            voltage: {
                type: Number, required: [true, "voltage is required"],
            },
            current: {
                type: Number, required: [true, "current is required"],
            }
        },
    }],
    timeStamp: {
        type: Date, default: Date.now,
    }
   
})

module.exports = mongoose.model('data', sensorSchema);