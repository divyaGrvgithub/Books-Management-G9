const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const reviewController = require("../controllers/reviewController")
const middleware = require("../middleware/auth.js")

// <<<<<<<<<<++++++++++++Dummy Api+++++++++++++++++++>>>>>>>>>>>>>>>>>>>.

router.get("/test-me",(req,res)=>{
    res.send("My First ever Api")
})

// <<<<<<<<<<<<<++++++++User Create and Login Api++++++++++++++++>>>>>>>>>>>>>>

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

// <<<<<<<<<<<<<++++++++Book api with Authentication and authorisation++++++++++++>>>>>>>>>>>

router.post("/books",middleware.authenticate,middleware.authorisation,bookController.createBook)
router.get("/books",middleware.authenticate,bookController.getBookDetails)
router.get("/books/:bookId",middleware.authenticate,bookController.getbookById)
router.put("/books/:bookId",middleware.authenticate,middleware.authorisation,bookController.updateBooksbyId)

// <<<<<<<<<<<<<+++++++Review api with Authentication and authorisation++++++++++++>>>>>>>>>>>

router.post("/books/:bookId/review",middleware.authenticate,reviewController.createReview)
router.put("//books/:bookId/review/:reviewId",middleware.authenticate,middleware.authorisation,reviewController.reviewUpdate)

router.all("/*",(req,res)=>{
    res.status(400).send("Invalid Http Request")  
})

module.exports=router
