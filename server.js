require('dotenv').config()
const express=require('express')
const app=express()
const ejs=require('ejs')
const expressLayout=require('express-ejs-layouts')
const path=require('path')
const mongoose=require('mongoose')
const session=require('express-session')
const flash=require('express-flash')
const MongoDbStore=require('connect-mongo')
const PORT= process.env.PORT || 5000

//database connection
const url='mongodb://localhost/pizza';
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('Database connected...');
}).on('error',function(err){
    console.log('Database disconnected...')
});

//session store
// let mongoStore=new MongoDbStore({
//     mongooseConnection:connection,
//     collection:'sessions'
// })

//session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:MongoDbStore.create({
        mongoUrl:url
    }),
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} //24 hours
}))

app.use(flash())

//assets
app.use(express.static('public'))
app.use(express.json())

//global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session
    next()
})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})