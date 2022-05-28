const express = require("express")
const { constructEventFilter } = require("node-opcua")
const alarmModel = require("../models/alarm")
const ackuserModel = require("../models/ack")
const excel = require("excel4node")
var alarm = require("../models/alarm")
var path = require("path")



const alarmRouter = express.Router()

alarmRouter.get("/:OS_id", async (req, res)=>{
    for (const c of res.locals.lcTypes) {
        if(c.id === +req.params.OS_id)
            c.isActive = true;
        else c.isActive = false
    }
    const OS = req.params.OS_id
    const listAlarm = await alarmModel.find({OS_ID: OS}).lean()
    res.render('alarm',{
        alarms: listAlarm,
        empty: listAlarm === null
    })
})


module.exports = alarmRouter