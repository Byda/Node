const express = require("express")
const { constructEventFilter } = require("node-opcua")
const alarmModel = require("../models/alarm")

const alarmRouter = express.Router()

alarmRouter.get("/:OS_id", async (req, res)=>{

    for (const c of res.locals.lcLocations) {
        if(c.id === +req.params.OS_id)
            c.isActive = true;
        else c.isActive = false
    }
    const OS = req.params.OS_id
    const listAlarm = await alarmModel.find({OS_ID: OS.toString()}).lean()
    console.log(listAlarm)
    res.render('alarm',{
        alarms: listAlarm,
        empty: listAlarm === null
    })
})

module.exports = alarmRouter