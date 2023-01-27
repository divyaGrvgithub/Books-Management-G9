const mongoose = require("mongoose")
const booksModel = require("../Models/booksModel")
const reviewModel = require("../Models/reviewModel")
const valid = require('../validators/validator')

// <<<<<<<<<<<----------------------------Create Review(Post api)----------------------------->>>>>>>>>>
// <<<<<<<++++++++++++++++++++++++This Api is used to Review a Book+++++++++++++++++++++++++++>>>>>>>>>>>>

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

// <<<<<<<<<<<---------------------------------Update Review(Put Api)----------------------------------->>>>>>>>>>
// <<<<<<<++++++++++++++++++++++++++++This Api is used to Update A Review +++++++++++++++++++++++++++>>>>>>>>>>>>

const reviewUpdate = async function (req, res) {
    try {
        let data = req.body;
        const  { rating } = data
        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, message: "please provide some data" })
        }
        let bookId = req.params.bookId;

        if (!bookId)
        return res.status(400).send({ status: false, message: " please enter bookId" })

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message:  "enter valid book id"})
        }

        let book = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ status: false, message: "Book  not found" })
        }

        let reviewId = req.params.reviewId;

        if (!reviewId)
        return res.status(400).send({ status: false, message: " please enter rewiewId" })

        if (!isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "enter valid review id" })
        }

        let reviewExit = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewExit) {
            return res.status(404).send({ status: false, message: "review  not exists" })
        }
       
        if (rating < 1 || rating > 5) return res.status(400).send({ status: false, message: "rating should be inbetween 1 and 5" })
      
        let savedData = await reviewModel.findOneAndUpdate({ _id: reviewId },
            data, { updatedAt: new Date(), new: true })
        return res.status(200).send({ status: true, message: savedData });
    }catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
      }
  }

// <<<<<<<<<<<---------------------------------Delete Review(Delete Api)----------------------------------->>>>>>>>>>
// <<<<<<<++++++++++++++++++++++++++++++This Api is used to Delete a Review ++++++++++++++++++++++++++>>>>>>>>>>>>

const deleteBookReview = async function (req, res) {
    let { bookId, reviewId } = req.params
            if (!mongoose.Types.ObjectId.isValid(reviewId)) {
                return res.status(400).send({ status: false, message: "Incorrect reviewId request " });
            }
            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                return res.status(400).send({ status: false, message: "Incorrect bookId request" });
            }
            const findBook = await booksModel.findOne({ _id: bookId, isDeleted: false });
            if (findBook) {
                const review = await reviewModel.findOne({ _id: reviewId, bookId, isDeleted: false });
                if (review) {
                    await reviewModel.findByIdAndUpdate({ _id: reviewId }, { $set: { isDeleted: true, deletedAt: new Date() } });
                    await booksModel.findByIdAndUpdate({ _id: bookId }, { reviews: findBook.reviews - 1 });
                    return res.status(200).send({ status: true, message: "success" });
                }
                else {
                    return res.status(404).send({ status: false, message: "No review for the Book" });
                }
            }
            else {
                return res.status(404).send({ status: false, message: "Book not found" });
            }
        }

module.exports.createReview = createReview
module.exports.reviewUpdate=reviewUpdate
module.exports.deleteBookReview=deleteBookReview