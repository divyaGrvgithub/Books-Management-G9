const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookController")
const userController = require("../controllers/userController")
const reviewController = require("../controllers/reviewController")
const middleware = require("../middleware/auth.js")
const { uploadedFile } = require("../aws/aws.connect.js")

router.get("/test-me",(req,res)=>{
    res.send("My First ever Api")
})

// <<<<<<<<<<<<<++++++++User Create and Login Api++++++++++++++++>>>>>>>>>>>>>>

router.post("/register",userController.createUser)
router.post("/login",userController.loginUser)

// <<<<<<<<<<<<<++++++++Book api with Authentication and authorization++++++++++++>>>>>>>>>>>

router.post("/books",middleware.authenticate,middleware.authorization,bookController.createBook)
router.get("/books",middleware.authenticate,bookController.getBookDetails)
router.get("/books/:bookId",middleware.authenticate,bookController.getbookById)
router.put("/books/:bookId",middleware.authenticate,middleware.authorization,bookController.updateBooksbyId)
router.delete("/books/:bookId",middleware.authenticate,middleware.authorization,bookController.deleteBooks)

// <<<<<<<<<<<<<+++++++Review api ++++++++++++>>>>>>>>>>>

router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId", reviewController.reviewUpdate)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteBookReview)

//<<<<<<<<<<<<<+++++++AWS++++++++++++>>>>>>>>>>>

router.post("/upload-file-aws", uploadedFile)

router.all("/*",(req,res)=>{
    res.status(400).send("Invalid Http Request")  
})

module.exports=router
