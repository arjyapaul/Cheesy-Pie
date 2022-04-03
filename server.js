const express=require('express')
const app=express()
const ejs=require('ejs')
const expressLayout=require('express-ejs-layouts')
const path=require('path')
const mongoose=require('mongoose')
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
//assets
app.use(express.static('public'))

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})