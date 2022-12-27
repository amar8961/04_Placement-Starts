const express=require('express')
const app=express();

const cors=require('cors')
app.use(cors())

const bodyParser=require('body-parser')
const sequelize=require('./util/database')
const expensesRoutes=require('./routes/expenses');
const authRoutes=require('./routes/users');

app.use(bodyParser.json({extended:false}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(expensesRoutes)
app.use(authRoutes)

const Users=require('./model/users')
const Expenses=require('./model/expenses')

Users.hasMany(Expenses)
Expenses.belongsTo(Users)

sequelize
// .sync({ force: true })
.sync()
.then(response=>{
    console.log(response)
    app.listen(4000, ()=>console.log("Server started running on Port: 4000"))
}).catch(err=>console.log(err))
