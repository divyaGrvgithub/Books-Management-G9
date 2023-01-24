const userModel = require("../Models/userModel")
const jwt = require("jsonwebtoken")
const Validation = require("../validators/validator")

// <<<<<<<<<<<----------------------------Create User----------------------------->>>>>>>>>>
// <<<<<<<++++++++++++++++++++++++This Api for Create a User+++++++++++++++++++++++++++>>>>>>>>>>>>

const createUser = async (req, res) => { //=>-- it allows you to create a code in a cleaner way compared to other function.
  try {
    let data = req.body
    if (Object.keys(data).length == 0) // return all the keys of objevt as array 
      return res.
        status(400).
        send({ status: false, msg: "please give some data" })//400-Bad request

    let { title, name, phone, email, password } = data
    if(!Validation.isValid(title)){
      return res.
        status(400).send({ status: false, msg: "title should be string" })//validation for string
    }
    title = data.title = title.trim()
    if (!title) {
      return res.
        status(400).send({ status: false, message: "Please provide title " })//title is mandatory   
    }

    if (title != "Mr" && title != "Miss" && title != "Mrs") {
      return res.
        status(400).send({ msg: "Please write title like Mr, Mrs, Miss" });//------
    }
    if(!Validation.isValid(name)){
      return res.
        status(400).send({ status: false, msg: "name should be string" })
    }
    name = data.name = name.trim()
    if (!name) {
      return res.
        status(400).send({ status: false, message: "Please provide name " })//Name is Mandatory     
    }
    if (!Validation.isValidName(name)) {
      return res.
        status(400).send({ status: false, msg: "Please Enter Valid Name" })//validation for Name
    }
    if(!Validation.isValid(phone)){
      return res.
        status(400).send({ status: false, msg: "phone should be string" })
    }
    phone = data.phone = phone.trim()
    if (!phone) {
      return res.
        status(400).send({ status: false, message: "Please provide phone " })//Phone Number is mandatory
    }
    if (!Validation.isValidNumber(phone)) {
      return res.
        status(400).send({ status: false, msg: "Please Enter Valid Phone Number" })//Validation for Phone Number
    }
    const checkPhone = await userModel.findOne({ phone: phone, isDeleted: false })//This db call for check that the phone number is already present in our database or not
    if (checkPhone) {
      return res.
        status(400).send({ status: false, msg: "Phone already exists" });
    }
    if(!Validation.isValid(email)){
      return res.
        status(400).send({ status: false, msg: "email should be string" })
    }
    email = data.email = email.trim()
    if (!email) {
      return res.
        status(400).send({ status: false, message: "Please provide Email " })//Email is Mandatory    
    }
    if (!Validation.isValidEmail(email)) {
      return res.
        status(400).send({ status: false, msg: "Please Enter Valid email ID" })//validation for email
    }
    const checkemail = await userModel.findOne({ email: email })////This db call for check that the Email is already present in our database or not
    if (checkemail) {
      return res.
        status(400).send({ status: false, msg: "email already exists" });
    }
    if(!Validation.isValid(password)){
      return res.
        status(400).send({ status: false, msg: "password should be string" })
    }
    password = data.password = password.trim()
    if (!password) {
      return res.
        status(400).send({ status: false, message: "Please provide password " })//password is mandatory
    }
    if (!Validation.isValidPassword(password)) {//validation for password
      return res.
        status(400).send({ status: false, msg: " Incorrect Password, It should be of 6-10 digits with atlest one special character, alphabet and number" });
    }

    const user = await userModel.create(data);//final step
    return res.
      status(201).
      send({ status: true, msg: "Successfully created", data: user })//201-- created Successfully
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}

// <<<<<<<<<<<----------------------------Login User----------------------------->>>>>>>>>>
// <<<<<<<++++++++++++++++++++++++This Api for Login a User+++++++++++++++++++++++++++>>>>>>>>>>>>


const loginUser = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password

    if (Object.keys(req.body).length == 0) {//object.keys-->return all the keys of object as array
      return res.
        status(400).//400-->Bad request
        send({ status: false, message: "please provide details" });
    }
    if (!(email && password)) {
      return res.
        status(400).
        send({ status: false, message: "Email-Id and Password must be provided!" });
    }

    let user = await userModel.findOne({ email: email.toLowerCase(), password: password });//findone---> it return first document when query matching otherwise it returns null.
    if (!user) {
      return res.
        status(404).//404--->not found
        send({ status: false, message: " Email or Password wrong" });
    }

    let token = jwt.sign({ //jwt.sign-->it used to create a token
      userId: user._id.toString()
    }, //.to string---> it used to allow a object as a string 
      "Books-Management-Group-9",// secret-key
      { expiresIn: "30m" })
    res.status(200).//200-->successfully
      setHeader("x-api-key", token);
    return res.
      status(200).
      send({ status: true, message: "token will be valid for 24 hrs", data: { token: token } });
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })//500- server side problem
  }
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser