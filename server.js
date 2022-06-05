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
const passport=require('passport')
const Emitter=require('events')
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

//passport config



//session store
// let mongoStore=new MongoDbStore({
//     mongooseConnection:connection,
//     collection:'sessions'
// })

//event emitter
const eventEmitter=new Emitter()
app.set('eventEmitter',eventEmitter)

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
const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//assets
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//global middleware
app.use((req,res,next)=>{
    res.locals.session=req.session
    res.locals.user=req.user
    next()
})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)

const server=app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

//socket
const io=require('socket.io')(server)
io.on('connection',(socket)=>{
    socket.on('join',(orderId)=>{
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})