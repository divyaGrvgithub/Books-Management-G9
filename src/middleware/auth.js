const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const bookModel = require('../Models/booksModel')
const userModel = require('../Models/userModel')


// <<<<<<<<<----------------------Authentication----------------------------->>>>>>>>>>>>

const authenticate = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        if (!token) {
            return res.status(400).send({ status: false, message: "token must be present" })
        }
        else {
            jwt.verify(token, "Books-Management-Group-9", function (err, data) {
                if (err) {
                    return res.status(401).send({ status: false, message: "token invalid" })
                }
                else {
                    req.loginUserId = data.userId
                    next();
                }
            })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// <<<<<<<<<----------------------Authorisation------------------------------->>>>>>>>>>>>>
const authorization = async function (req, res, next) {
    try {
        let data = req.body
        // if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Please enter some data" })
        let { userId } = data
        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, message: "Please enter valid userId" })
            }
            const findUser = await userModel.findById(userId.trim())
            if (!findUser) {
                return res.status(404).send({ status: false, message: "UserId not found" })
            }
            if (userId !== req.loginUserId) {
                return res.status(403).send({ status: false, msg: "You are not authorised" })
            }
        }
        else {
            let bookId = req.params.bookId
            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                return res.status(400).send({ status: false, message: "please provide valid bookId" })
            }
            let checkAuth = await bookModel.findOne({ _id: bookId })
            if (checkAuth === null) return res.status(400).send({ status: false, msg: "Not find any book" })
            if (checkAuth.userId != req.loginUserId) {
                return res.status(403).send({ status: false, msg: "You are not autherised" })
            }
        }
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


module.exports.authenticate = authenticate
module.exports.authorization = authorization
