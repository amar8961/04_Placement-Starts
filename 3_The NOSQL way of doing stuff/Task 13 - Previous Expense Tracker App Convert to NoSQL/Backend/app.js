const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express();

const mongoose=require('mongoose');

const expensesRoutes=require('./routes/expenses');
const authRoutes=require('./routes/users');

app.use(cors())

app.use(bodyParser.json({extended:false}))
app.use(bodyParser.urlencoded({extended:false}))

app.use(expensesRoutes)
app.use(authRoutes)

var DB_Name = 'expense'
const connectionString = `mongodb+srv://amar:amar4456@cluster0.qwphzua.mongodb.net/${DB_Name}?retryWrites=true&w=majority`

mongoose.connect(connectionString)
.then(result=>{
    app.listen(4000, ()=>{
        console.log("Server started running on Port: 4000")
    })
})