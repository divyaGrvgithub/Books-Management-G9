const mongoose = require("mongoose")
const booksModel = require("../Models/booksModel")
const reviewModel = require("../Models/reviewModel")
const valid = require('../validators/validator')

const createReview = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid bookId in param" })

        let isExistBook = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!isExistBook) return res.status(404).send({ status: false, message: "Book not found" })

        let data = req.body
        if (Object.keys(data).length < 1) return res.status(400).send({ status: false, message: "Please enter data in Body" })

        let { review, rating, reviewedBy, ...rest } = data
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "You can enter only review, rating , reviewedBy" })

        //?Exp
        if (!review) return res.status(400).send({ status: false, message: "Please provide review" })
        if (!valid.isValid(review)) return res.status(400).send({ status: false, message: "Review should be String" })
        review = data.review = review.trim()

        if (!rating) return res.status(400).send({ status: false, message: "Please provide rating" })
        if (!valid.isValidRating(rating)) return res.status(400).send({ status: false, message: "Rating should be Number" })

        //!doubt
        if (reviewedBy) {
            if (!valid.isValid(reviewedBy)) return res.status(400).send({ status: false, message: "ReviewBy should be String" })
            reviewedBy = data.reviewedBy = reviewedBy.trim()
        }

        await booksModel.findByIdAndUpdate(bookId, { $inc: { reviews: 1 } }) //

        data.reviewedAt = Date.now()
        data.bookId = bookId

        //
        let savedData = await reviewModel.create(data)

        let response = {
            _id: savedData._id,
            bookId: savedData.bookId,
            reviewedBy: savedData.reviewedBy,
            reviewedAt: savedData.reviewedAt,
            rating: savedData.rating,
            review: savedData.review
        }

        res.status(201).send({ status: true, message: "success", data: response })
    } catch (err) { res.status(500).send({ status: false, message: err.message }) }

}

const updateReview = async(req,res)=>{
    try{
        let bookId = req.params.bookId//Getting Book Id from params
        let reviewId = req.params.reviewId//Getting Book review Id from params

        if(!mongoose.isValidObjectId(bookId)){
            return res.status(400).send({status:false, message:"bookId is invalid"})}//Checking if valid Book Id.
        if(!mongoose.isValidObjectId(reviewId)){
            return res.status(400).send({status:false, message:"reviewId is invalid"})}//Checking if valid review Id.
        
        let data = req.body//Getting data from request body
        let {reviewdBy, rating, review}=data//Destructuring body data
        
        if(Object.keys(data).length==0){
            return res.status(400).send({status:false, messgae:"data is required"})}//If body is empty
        
        if (!(valid.isEmpty(reviewdBy))) {
            return res.status(400).send({ status: false, message: "reviewedBy is empty" })}//if reviewedBy is empty or not
        



    }catch(err){
        res.status(500).send({status:false, err:err.message})
    }
}

module.exports.createReview = createReview
module.exports.updateReview= updateReview