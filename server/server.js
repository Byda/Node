require('dotenv').config()





const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const hbs_sections = require("express-handlebars-sections")
const bodyParser = require("body-parser")
const session = require("express-session")


const app = express();
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
const routeLogin = require('./routes/login')

const ConnectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Connect to Mongo")
    } catch (error) {
        console.log(error)
    }
}

ConnectDB()

app.use(express.json())

app.engine('hbs', exphbs.engine({layoutsDir: './views/_layouts', defaultLayout: 'main.hbs', partialsDir: './views/_partials', extname: '.hbs', helpers: { section: hbs_sections()} }));
app.set('view engine', 'hbs')
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json())

require('./opc')(io)

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

app.use('/home', require("./routes/home"))
app.use('/login', routeLogin)

// app.use((req, res)=>{
//   res.send("Wrong Path")
// })
 
app.use(async function(req, res, next){
  if(req.session.isAuthenticated === null){
    req.session.isAuthenticated = false;
  }
  res.locals.lcIsAuthenticated = req.session.isAuthenticated;
  res.locals.lcUser = req.session.userAuth;
  next();
})

app.get('/trend', (req, res) =>{
    res.render('trend');
})
app.get('/tram1', (req, res) =>{
  res.render('tram1');
})
app.get('/notifications', (req, res)=>{
  res.render('notifications')
})


server.listen(3000, () => console.log(`Server strated`))




  




