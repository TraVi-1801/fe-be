const { json } = require('express')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
require("dotenv").config()
const authRouter = require('./router/auth')
const postRouter = require('./router/post')

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)




const connection_string = process.env.DATA_MONGODB

mongoose.connect(connection_string,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
})
.then(()=>console.log("MongoDB connection established ...."))
.catch((error) => console.error("MongoDB connection failed:",error.message))

app.listen(PORT, ()=>(
    console.log(`server running port ${PORT}`)
))