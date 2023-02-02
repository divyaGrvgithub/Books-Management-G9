const mongoose = require("mongoose")
const booksModel = require("../Models/booksModel")
const userModel = require("../Models/userModel")
const reviewModel = require("../Models/reviewModel")
const Validation = require("../validators/validator")
const { isValidObjectId } = require("mongoose")

// <<<<<<<<<<<----------------------------Create User(Post api)----------------------------->>>>>>>>>>
const createBook = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "please give some data" })

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, ...rest } = data


        if (!title) {
            return res.status(400).send({ status: false, msg: "title is required" })
        }
        if (!Validation.isValid(title)) {
            return res.status(400).send({ status: false, msg: "Please give title in a string" })
        }
        title = data.title = title.trim()

        // if (!Validation.isValidName(title)) {
        //     return res.status(400).send({ status: false, msg: "Please Enter Valid title" })
        // }

        let uniqueTitle = await booksModel.findOne({ title: title, isDeleted: false })
        if (uniqueTitle) return res.status(409).send({ status: false, message: " title already exists" })



        if (!excerpt) {
            return res.status(400).send({ status: false, msg: "excerpt is required" })
        }
        if (!Validation.isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please give excerpt in a string" })
        }

        excerpt = data.excerpt = excerpt.trim()

        if (!Validation.isValidName(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please Enter Valid excerpt" })
        }



        if (!userId) {
            return res.status(400).send({ status: false, msg: "userId is required" })
        }
        if (!Validation.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "Please give title in a userId" })
        }
        userId = data.userId = userId.trim()

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please enter valid user id" })
        }

        let checkUserId = await userModel.findOne({ userId: userId, isDeleted: false })
        if (!checkUserId) {
            return res.status(404).send({ status: false, msg: "User is not found" })
        }

        if (!ISBN) {
            return res.status(400).send({ status: false, msg: "ISBN is required" })
        }

        if (!Validation.isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please give ISBN in a string" })
        }

        ISBN = data.ISBN = ISBN.trim()

        if (!Validation.isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, msg: "Invalid ISBN" });
        }

        let uniqueISBN = await booksModel.findOne({ ISBN: ISBN, isDeleted: false })
        if (uniqueISBN) return res.status(409).send({ status: false, message: " ISBN already exists" })

        if (!category) {
            return res.status(400).send({ status: false, msg: "category is required" })
        }
        if (!Validation.isValid(category)) {
            return res.status(400).send({ status: false, msg: "Please give category in a string" })
        }

        category = data.category = category.trim()

        if (!Validation.isValidName(category)) {
            return res.status(400).send({ status: false, msg: "Please Enter Valid category" })
        }

        if (!subcategory) {
            return res.status(400).send({ status: false, msg: "subcategory is required" })
        }
        if (!Validation.isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please give subcategory in a string" })
        }

        subcategory = data.subcategory = subcategory.trim()

        if (!Validation.isValidName(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please Enter Valid subcategory" })
        }


        if (!releasedAt) {
            return res.status(400).send({ status: false, msg: "releasedAt is required" })
        }
        if (!Validation.isValid(releasedAt)) {
            return res.status(400).send({ status: false, msg: "Please give date in a string" })
        }
        releasedAt = data.releasedAt = releasedAt.trim()

        if (!Validation.isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, msg: "Please Enter Valid date" })
        }

        if (Object.keys(rest).length !== 0) {
            return res.status(400).send({ status: false, msg: "you can send only title,excerpt,userId,ISBN,category,subcategory" })
        }

        let savedData = await booksModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: savedData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// <<<<<<<<<<<---------------------------------Get Book(Get Api)------------------------------------>>>>>>>>>>


const getBookDetails = async (req, res) => {
    try {
        let data = req.query
        let { userId, category, subcategory, ...rest } = data
        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).send({ status: false, msg: "Please enter valid userId" })
            }
        }
        if (Object.keys(rest).length !== 0) {
            return res.status(400).send({ status: false, msg: "You can filter books by userId,category,subcategory" })
        }

        data.isDeleted = false
        let savedData = await booksModel.find(data).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (savedData.length == 0) {
            return res.status(404).send({ status: false, message: "No Book found" })
        }

        res.status(200).send({ status: true, message: "Book list", data: savedData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// <<<<<<<<<<<---------------------------------Get Book By Id(Get Api)------------------------------------>>>>>>>>>>


const getbookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "Please enter valid id in path param" })

        let bookData = await booksModel.findOne({ _id: bookId, isDeleted: false }).lean()
        if (!bookData) return res.status(404).send({ status: false, msg: "Book not found" })

        let reviewData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ bookId: 1, reviewedBy: 1, reviewAt: 1, rating: 1, review: 1 })
        bookData.reviewsData = reviewData
        return res.status(200).send({ status: true, message: "Books list", data: bookData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// <<<<<<<<<<<---------------------------------Update Book(Put Api)----------------------------------->>>>>>>>>>

const updateBooksbyId = async (req, res) => {
    try {
        let id = req.params.bookId;

        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "bookId is invalid" })
        }

        const data = req.body;
        let { title, excerpt, releasedAt, ISBN } = data

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, message: "Please pass proper data to update. " })

        if (!(Validation.isEmpty(title))) {
            return res.status(400).send({ status: false, message: "title is empty" })
        }
        if (!(Validation.isEmpty(excerpt))) {
            return res.status(400).send({ status: false, message: "excerpt is empty" })
        }
        if (!(Validation.isEmpty(releasedAt))) {
            return res.status(400).send({ status: false, message: "releasedAt is empty" })
        }
        if (!(Validation.isEmpty(ISBN))) {
            return res.status(400).send({ status: false, message: "ISBN is empty" })
        }

        if (ISBN) {
            if (!(Validation.isValidISBN(ISBN))) {
                return res.status(400).send({ status: false, message: "ISBN is invalid" })
            }
        }

        if (releasedAt) {
            if (!(Validation.isValidDate(releasedAt))) {
                return res.status(400).send({ status: false, message: "Date is invalid." })
            }
        }

        const findinDB = await booksModel.findById(id);
        if (!findinDB)
            return res.status(404).send({ status: false, message: "No book exist with this bookId." })//Checking if book is present in DB

        if (findinDB.isDeleted == true)
            return res.status(404).send({ status: false, message: "This book is already deleted" })//CHECKING IF DELETED OR NOT

        const duplicateTitle = await booksModel.findOne({ title: data.title })
        if (duplicateTitle)
            return res.status(400).send({ status: false, message: "Title is already registered" })//CHECKING TITLE IS ALREADY REGISTERED OR NOT-

        const duplicateISBN = await booksModel.findOne({ ISBN: data.ISBN })
        if (duplicateISBN)
            return res.status(400).send({ status: false, message: "ISBN is already registered" })//CHECKING ISBN IS ALREADY REGISTERED OR NOT

        const updatedBooks = await booksModel.findOneAndUpdate({ _id: id },
            {
                $set: {
                    title: data.title,
                    excerpt: data.excerpt,
                    releasedAt: data.releasedAt,
                    ISBN: data.ISBN
                }
            },
            { new: true })
        return res.status(200).send({ status: true, message: "Success", data: updatedBooks })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// <<<<<<<<<<<---------------------------------Delete Book(Delete Api)----------------------------------->>>>>>>>>>

const deleteBooks = async function (req, res) {
        try {
            let bookId = req.params.bookId;
            if (!bookId) {
                return res.status(400).send({ status: false, message: "please provide a bookId in params" });
            }
            if (!isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, message: "bookId is not matched" });
            }
            let checkBookId = await booksModel.findOne({ _id: bookId, isDeleted: false })
    
            if (!checkBookId) {
                return res.status(404).send({ status: false, message: "no book found" });
            }
            //Authorization
            if (req.loginUserId !== checkBookId.userId.toString()) { 
                return res.status(403).send({ status: false, message: "unathorised user" })
            }
    
            let deletedBook = await booksModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt:Date.now() } },
                { new: true });
            return res.status(200).send({ status: true, message: "book sucessfully deleted", deletedBook });
        }
        catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    };

module.exports.createBook = createBook
module.exports.getBookDetails = getBookDetails
module.exports.updateBooksbyId = updateBooksbyId
module.exports.getbookById = getbookById
module.exports.deleteBooks = deleteBooks