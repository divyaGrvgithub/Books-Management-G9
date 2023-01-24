const jwt = require("jsonwebtoken")

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
         return res.status(400).send({ status: false, message: err.message })
            }
            else {
                req.loginUserId = data.userId                  
                        next();                    
                }})
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// <<<<<<<<<----------------------Authorisation------------------------------->>>>>>>>>>>>>
const authorisation =  async function(req,res,next){
    try{
    let data= req.body
    let checkAuth= await bookModel.findOne(data)
    if(checkAuth.userId!==req.loginUserId){
     return res.status(403).send({status:false, msg: "You are not autherised"})
    }
     next()
}
catch(err){
    res.status(500).send({status:false,error:err.message})
}
}

module.exports.authenticate = authenticate
module.exports.authorisation= authorisation