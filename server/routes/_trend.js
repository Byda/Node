const express = require("express")

const testRoute = express.Router()

testRoute.get("/:OS_id", async (req, res)=>{
    for (const c of res.locals.lcStations) {
        if(c.id === +req.params.OS_id)
            c.isActive = true;
        else c.isActive = false
    }
    const OS = req.params.OS_id
    const types = res.locals.lcStations
    const type = types[OS].OS_Type
    const name = types[OS].OS_Location
    res.render('_trend',{
        name: name,
        types: type  })
})


module.exports = testRoute