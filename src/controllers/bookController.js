const mongoose = require("mongoose")
const booksModel = require("../Models/booksModel")
const userModel = require("../Models/userModel")
const Validation = require("../validators/validator")
const { isValidObjectId } = require("mongoose")

// <<<<<<<<<<<----------------------------Create User(Post api)----------------------------->>>>>>>>>>
// <<<<<<<++++++++++++++++++++++++This Api for Create a Book+++++++++++++++++++++++++++>>>>>>>>>>>>

const createBook = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) // return all the keys of objevt as array 
            return res.
                status(400).
                send({ status: false, msg: "please give some data" })//400-Bad request

        let { title, excerpt, userId, ISBN, category, subcategory, ...rest } = data

        title = data.title = title.trim()
        if (!title) {
            return res.
                status(400).
                send({ status: false, msg: "title is required" })
        }

        excerpt = data.excerpt = excerpt.trim()
        if (!excerpt) {
            return res.
                status(400).
                send({ status: false, msg: "excerpt is required" })
        }

        userId = data.userId = userId.trim()
        if (!userId) {
            return res.
                status(400).
                send({ status: false, msg: "userId is required" })
        }

        if (!mongoose.isValidObjectId(userId)) {
            return res.
                status(400).
                send({ status: false, msg: "Please enter valid user id" })
        }

        let checkUserId = await userModel.findOne({ userId: userId, isDeleted: false })
        if (!checkUserId) {
            return res.
                status(404).
                send({ status: false, msg: "User is not found" })
        }

        ISBN = data.ISBN = ISBN.trim()
        if (!ISBN) {
            return res.
                status(400).
                send({ status: false, msg: "ISBN is required" })
        }

        let isUnique = await booksModel.find({ $or: [{ title: title }, { ISBN: ISBN }] })
        if (isUnique.length !== 0) {
            return res.
                status(400).
                send({ status: false, msg: "title and ISBN should be unique" })
        }

        category = data.category = category.trim()
        if (!category) {
            return res.
                status(400).
                send({ status: false, msg: "category is required" })
        }

        subcategory = data.subcategory = subcategory.trim()
        if (!subcategory) {
            return res.
                status(400).
                send({ status: false, msg: "subcategory is required" })
        }

        if (Object.keys(rest).length !== 0) {
            return res.
                status(400).
                send({ status: false, msg: "you can send only title,excerpt,userId,ISBN,category,subcategory" })
        }

        data.releasedAt = Date.now()

        let savedData = await booksModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: savedData })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// <<<<<<<<<<<---------------------------------Get Book(Get Api)------------------------------------>>>>>>>>>>
// <<<<<<<+++++++++++++++++This Api for get Book by userID  Category Subcategory ++++++++++++++++++++>>>>>>>>>>>>

const getBookDetails = async (req, res) => {
    try {
        let data = req.query
        let { userId, category, subcategory, ...rest } = data
        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.
                    status(400).
                    send({ status: false, msg: "Please enter valid userId" })
            }
        }
        if (Object.keys(rest).length !== 0) {
            return res.
                status(400).
                send({ status: false, msg: "You can filter books by userId,category,subcategory" })
        }

        data.isDeleted = false
        let savedData = await booksModel.find(data).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })

        if (savedData.length === 0) {
            return res.
                status(404).
                send({ status: false, message: "No Book found" })
        }

        res.status(200).send({ status: true, message: "Book list", data: savedData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// <<<<<<<<<<<---------------------------------Update Book(Put Api)----------------------------------->>>>>>>>>>
// <<<<<<<++++++++++This Api for Update a book by changing title, excerpt, release date, ISBN++++++++++>>>>>>>>>>>>

const updateBooksbyId = async(req,res)=>{
    try {
        const id = req.params.bookId;

        //CHECKING IF BOOK ID VALID OR NOT.---------------------------------------------------------------------
        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "bookId is invalid" })}

        //CHECKING IF BODY IS EMPTY OR CONTAINING MORE THAN 4 ATTRIBUTES.----------------
        const data = req.body;
        let { title, excerpt, releasedAt, ISBN } = data

        if (Object.keys(data).length == 0 || Object.keys(data).length > 4)
            return res.
            status(400).send({ status: false, message: "Please pass proper data to update. " })
        
        /*-----------------Checking fileds values are empty or not-----------------------*/
        if (!(Validation.isEmpty(title))) { 
            return res.
            status(400).send({ status: false, message: "title is empty" }) }
        if (!(Validation.isEmpty(excerpt))) { 
            return res.
            status(400).send({ status: false, message: "excerpt is empty" }) }
        if (!(Validation.isEmpty(releasedAt))) { 
            return res.
            status(400).send({ status: false, message: "releasedAt is empty" }) }
        if (!(Validation.isEmpty(ISBN))) { 
            return res.
            status(400).send({ status: false, message: "ISBN is empty" }) }

        /*------------------------------- Validation(Regex)  -----------------------------------*/
        if(ISBN){
            if (!(Validation.isValidISBN(ISBN))) {
                return res.status(400).
                send({ status: false, message: "ISBN is invalid, please provide ISBN with 13 digits or one hyphen symbol do not include 0 in first three digits for ex: 129-0879087670 or 1290879087670." })}
        }
        
        if(releasedAt){
            if (!(Validation.isValidDate(releasedAt))) {
                return res.status(400).
                send({ status: false, message: "Date is invalid. Please provide date in yyyy-mm-dd format for ex: 2014-04-14." })}
        }

        const findinDB = await booksModel.findById(id);

        /*----------------------Checking if book is present in DB-----------------------*/
        if (!findinDB)
            return res.status(404).send({ status: false, message: "No book exist with this bookId." })

        //CHECKING IF DELETED OR NOT------------------------------------------------------------------
        if (findinDB.isDeleted == true)
            return res.status(404).send({ status: false, message: "This book is already deleted" })
        
        //CHECKING TITLE IS ALREADY REGISTERED OR NOT--------------------------------------------------
        const duplicateTitle = await booksModel.findOne({ title: data.title })
        if (duplicateTitle)
            return res.status(400).send({ status: false, message: "Title is registered already so please put another title" })

        //CHECKING ISBN IS ALREADY REGISTERED OR NOT--------------------------------------------------
        const duplicateISBN = await booksModel.findOne({ ISBN: data.ISBN })
        if (duplicateISBN)
            return res.status(400).send({ status: false, message: "ISBN is registered already so please put another ISBN" })

        //UPDATING BOOKS HERE -------------------------------------------------------------------------
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

module.exports.createBook = createBook
module.exports.getBookDetails = getBookDetails
module.exports.updateBooksbyId=updateBooksbyId
