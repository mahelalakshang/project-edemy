import express from "express";
import cors from "cors"
const morgan=require("morgan")
import fs from 'fs'
import mongoose from 'mongoose'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'


require("dotenv").config()

const csrfProtection=csrf({cookie:true})

const app=express()

//db

mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

//routes
fs.readdirSync('./routes').map((r)=>app.use('/api',require(`./routes/${r}`)))

app.use(csrfProtection)

app.get("/api/csrf-token",(req,res)=>{
  res.json({csrfToken:req.csrfToken()})
})

const port=process.env.PORT || 8000

app.listen(port,()=>console.log(`Server is running port :- ${port}`))