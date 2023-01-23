const userModel = require("../Models/userModel")
const jwt = require("jsonwebtoken")

// <----------------------------Create User----------------------------->

const createUser = async () => {
    try {
        let data = req.body
        const savedData = await userModel.create(data)
        res.status(201).send({ status: true, msg: savedData })
    } catch (error) {
        res.status(500).send({ status: false, error:error.message })
    }
}

module.exports.createUser=createUser