const mongoose = require("mongoose")
const booksModel = require("../Models/booksModel")
const userModel = require("../Models/userModel")

// <<<<<<<<<<<----------------------------Create User----------------------------->>>>>>>>>>
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

// <<<<<<<<<<<----------------------------Get Book----------------------------->>>>>>>>>>
// <<<<<<<++++++++++This Api for get Book by userID  Category Subcategory ++++++++++>>>>>>>>>>>>

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

module.exports.createBook = createBook
module.exports.getBookDetails = getBookDetails
