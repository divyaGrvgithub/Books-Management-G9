const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")

router.get("/test-me",(req,res)=>{
    res.send("My First ever Api")
})

router.all("/*",(req,res)=>{
    res.status(400).send("Invalid Http Request")
})

router.post("/register",userController.createUser)

module.exports=router