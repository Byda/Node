const express = require("express")
const user =  require("../models/user")
const routeHome = express.Router()

routeHome.get('/', (req, res) =>{
    res.render('home');
})

routeHome.get('/user', (req, res) =>{
    res.send('User Route');
})

module.exports = routeHome