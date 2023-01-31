const express = require("express")
var bodyParser = require('body-parser');
const routes = require("./routes/route.js")
const mongoose = require("mongoose")
const app = express()

const multer= require("multer");
const { AppConfig } = require('aws-sdk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())

mongoose.set("strictQuery",true)
mongoose.connect("mongodb+srv://divyamala_:Dt25042000knp@divyamala.0cofsch.mongodb.net/group9Database",{
})

.then(()=>console.log("MongoDb is Connected"))
.catch((err=>console.log(err)))

app.use("/",routes)

app.listen(process.env.Port||3000,()=>{
    console.log("Express App Running on Port",+(process.env.Port||3000))
})

