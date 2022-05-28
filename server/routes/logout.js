const express = require("express")
const LogoutRoute = express.Router()

function restrict(req, res, next){
    if(!req.session.isAuthenticated)
        return res.redirect('/')
    next();
}

LogoutRoute.post('/', restrict, (req, res)=>{
    req.session.isAuthenticated = false;
    req.session.userAuth = null
    res.redirect('/home')
})

module.exports = LogoutRoute