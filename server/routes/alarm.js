const express = require("express")
const { constructEventFilter } = require("node-opcua")
const alarmModel = require("../models/alarm")
const ackuserModel = require("../models/ack")


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

// alarmRouter.get("ack/:val/:ackuser", async (req, res)=>{
//     console.log("newACKUseradsfhjsaksdkjhfsdjkhfskdjhfksdjfh2384234a")
//     var alarmID = req.params.val
//     var ackuser = req.params.ackuser.toString()
//     var info = await alarmModel.findOne({_id: alarmID})
//     const newACKUser = new ackuserModel({OS_ID: info.OS_ID, indicator: info.indicator, content: info.content, ACK: ackuser})
//     await newACKUser.save()
//     res.json("ACK success")
// })

module.exports = alarmRouter