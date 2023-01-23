const userModel = require("../Models/userModel")
const jwt = require("jsonwebtoken")
const emailValidator = require('email-validator')

let regexValidation = new RegExp(/^[a-zA-Z]+([\s][a-zA-Z]+)*$/);
let regexValidNumber = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
const passwordFormat = /^[a-zA-Z0-9@]{8,15}$/

// <----------------------------Create User----------------------------->

const createUser = async function (req, res){
    try {
        let data = req.body
        if (Object.keys(data).length == 0) 
        return res.status(400).send({ status: false, msg: "plzz give some data" })
    
        const { title, name, phone, email, password} = data
    
        if(!title ){
          return res.status(400).send({status:false, message:"Please provide title "})     }
    
        if (title != "Mr" && title != "Miss" && title != "Mrs"){
            return res.status(400).send({ msg: "Please write title like Mr, Mrs, Miss" });//------
        }
        if(!name ){
          return res.status(400).send({status:false, message:"Please provide name "})     
        }
        if(!phone ){
          return res.status(400).send({status:false, message:"Please provide phone "})    
         }
        if(!password ){
          return res.status(400).send({status:false, message:"Please provide password "})     
        }
      
        if (!regexValidation.test(name)) 
        return res.status(400).send({ status: false, msg: "Please Enter Valid Name" })

        if (!regexValidNumber.test(phone)) 
        return res.status(400).send({ status: false, msg: "Please Enter Valid Phone Number" })

        if (!emailValidator.validate(email))
        return res.status(400).send({ status: false, msg: "Please Enter Valid email ID" })

        const validPassword = passwordFormat.test(password)//-

        if (!validPassword){
            return res.status(400).send({ status: false, msg: " Incorrect Password, It should be of 6-10 digits with atlest one special character, alphabet and number" });}
    
        const chkPhone= await userModel.findOne({phone:phone,isDeleted: false })
        if (chkPhone)
        return res.status(400).send({ status: false, msg: "Phone already exists" });

        const chkemail= await userModel.findOne({email:email})
        if (chkemail)
        return res.status(400).send({ status: false, msg: "email already exists" });
      
        const user= await userModel.create(data);
        return res.status(201).send({ status: true,msg:"Succes", data: user })
      } catch (error) {
        res.status(500).send({ status: false, msg: error.message })}
    }

    module.exports.createUser = createUser