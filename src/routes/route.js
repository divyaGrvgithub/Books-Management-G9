const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const middleware = require("../middleware/auth.js")

// <<<<<<<<<<++++++++++++Dummy Api+++++++++++++++++++>>>>>>>>>>>>>>>>>>>.
router.get("/test-me",(req,res)=>{
    res.send("My First ever Api")
})

// <<<<<<<<<<<<<++++++++User Create and Login Api++++++++++++++++>>>>>>>>>>>>>>
router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

// <<<<<<<<<<<<<++++++++Book api with Authentication and authorisation++++++++++++>>>>>>>>>>>

router.post("/books",middleware.authenticate,bookController.createBook)
router.get("/books",middleware.authenticate,bookController.getBookDetails)

// <<<<<<<<<<<<<<
router.all("/*",(req,res)=>{
    res.status(400).send("Invalid Http Request")  
})

module.exports=router
