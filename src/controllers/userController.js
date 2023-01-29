const userModel = require("../Models/userModel")
const jwt = require("jsonwebtoken")
const Validation = require("../validators/validator")

// <<<<<<<<<<<----------------------------Create User----------------------------->>>>>>>>>>

const createUser = async (req, res) => { 
  try {
    let data = req.body
    if (Object.keys(data).length == 0) 
      return res.status(400).send({ status: false, msg: "please give some data" })

    let { title, name, phone, email, password, address, ...rest } = data

    if (Object.keys(rest).length > 0)
      return res.status(400).send({ status: false, message: "Please pass proper data to create " })

    title = data.title = title.trim()
    if (!title) {
      return res.status(400).send({ status: false, message: "Please provide title " })  
    }
    if (!Validation.isValid(title)) {
      return res.status(400).send({ status: false, msg: "title should be string" })
    }
    if (title != "Mr" && title != "Miss" && title != "Mrs") {
      return res.status(400).send({ msg: "Please write title like Mr, Mrs, Miss" });
    }
    name = data.name = name.trim()
    if (!name) {
      return res.status(400).send({ status: false, message: "Please provide name " }) 
    }
    if (!Validation.isValid(name)) {
      return res.status(400).send({ status: false, msg: "name should be string" })
    }
    if (!Validation.isValidName(name)) {
      return res.status(400).send({ status: false, msg: "Please Enter Valid Name" })
    }
    phone = data.phone = phone.trim()
    if (!phone) {
      return res.status(400).send({ status: false, message: "Please provide phone " })
    }
    if (!Validation.isValid(phone)) {
      return res.status(400).send({ status: false, msg: "phone should be string" })
    }
    if (!Validation.isValidNumber(phone)) {
      return res.status(400).send({ status: false, msg: "Please Enter Valid Phone Number" })
    }
    const checkPhone = await userModel.findOne({ phone: phone, isDeleted: false })
    if (checkPhone) {
      return res.status(400).send({ status: false, msg: "Phone already exists" });
    }
    email = data.email = email.trim()
    if (!email) {
      return res.status(400).send({ status: false, message: "Please provide Email " }) 
    }
    if (!Validation.isValid(email)) {
      return res.status(400).send({ status: false, msg: "email should be string" })
    }
    if (!Validation.isValidEmail(email)) {
      return res.status(400).send({ status: false, msg: "Please Enter Valid email ID" })
    }
    const checkemail = await userModel.findOne({ email: email })
    if (checkemail) {
      return res.status(400).send({ status: false, msg: "email already exists" });
    }
    password = data.password = password.trim()
    if (!password) {
      return res.status(400).send({ status: false, message: "Please provide password " })
    }
    if (!Validation.isValid(password)) {
      return res.status(400).send({ status: false, msg: "password should be string" })
    }
    if (!Validation.isValidPassword(password)) {
      return res.status(400).send({ status: false, msg: " Incorrect Password, It should be of 6-10 digits with atlest one special character, alphabet and number" });
    }

    if (address) {
      let { street, city, pincode, ...rest } = address
      if (Object.keys(rest).length > 0)
        return res.status(400).send({ status: false, message: "Please pass proper data in address. " })

      if (street) {
        if (!Validation.isValid(street)) {
          return res.status(400).send({ status: false, msg: "street should be string" })
        }
        street = data.street = street.trim()
        if (!street) {
          return res.status(400).send({ status: false, message: "Please provide street if you want" })
        }
      }

      if (city) {
        if (!Validation.isValid(city)) {
          return res.status(400).send({ status: false, msg: "city should be string" })
        }
        city = data.city = city.trim()
        if (!city) {
          return res.status(400).send({ status: false, message: "Please provide city if you want " })
        }
      }

      if (pincode) {
        if (!Validation.isValid(pincode)) {
          return res.status(400).send({ status: false, msg: "Please give pincode in a string" })
        }
        if (!Validation.isValidPinCode(pincode)) {
          return res.status(400).send({ status: false, msg: "Length of the pin code should be 6" })
        }
        pincode = data.pincode = pincode.trim()
        if (!pincode) {
          return res.status(400).send({ status: false, message: "Please provide pincode if you want " })
        }
      }
    }

    const user = await userModel.create(data);
    return res.status(201).send({ status: true, msg: "Success", data: user })
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}

// <<<<<<<<<<<----------------------------Login User----------------------------->>>>>>>>>>



const loginUser = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password

    if (Object.keys(req.body).length == 0) {
      return res.
        status(400).send({ status: false, message: "please provide details" });
    }
    if (!(email && password)) {
      return res.status(400).send({ status: false, message: "Email-Id and Password must be provided!" });
    }

    let user = await userModel.findOne({ email: email.toLowerCase(), password: password });//findone---> it return first document when query matching otherwise it returns null.
    if (!user) {
      return res.status(404).send({ status: false, message: " Email or Password wrong" });
    }

    let token = jwt.sign({ 
      userId: user._id.toString()
    }, 
      "Books-Management-Group-9",
      { expiresIn: "30m" })
    res.status(200).setHeader("x-api-key", token);
    return res.status(200).send({ status: true, message: "token will be valid for 30 minutes", data: { token: token } });
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })//500- server side problem
  }
}

module.exports.createUser = createUser
module.exports.loginUser = loginUser