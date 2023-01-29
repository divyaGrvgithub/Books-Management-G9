const express = require("express")
const routes = require("./routes/route.js")
const mongoose = require("mongoose")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.set("strictQuery",true)
mongoose.connect("mongodb+srv://sumit:sumit47@cluster0.8dflsuw.mongodb.net/group9Database",{
    useNewUrlParser:true
})

.then(()=>console.log("MongoDb is Connected"))
.catch((err=>console.log(err)))

app.use("/",routes)

app.listen(process.env.Port||3000,()=>{
    console.log("Express App Running on Port",+(process.env.Port||3000))
})