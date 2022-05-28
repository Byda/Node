const express = require("express")
const { constructEventFilter } = require("node-opcua")
const alarmModel = require("../models/alarm")

const alarmRouter = express.Router()

alarmRouter.get("/", async (req, res)=>{

    var alarmID = req.params._id.toString()
    var ackuser = req.params.ackuser.toString()

})

module.exports = alarmRouter