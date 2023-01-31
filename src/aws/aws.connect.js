const aws = require("aws-sdk")

aws.config.update({
      accessKeyId: "AKIAY3L35MCRZNIRGT6N",//AKIAY3L35MCRZNIRGT6N
      secretAccessKey: "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",
      region: "ap-south-1"
})

let uploadFile = async (file) => {
      return new Promise((resolve, reject) => {
            let s3 = new aws.S3({ apiVersion: '2006-03-01' })

            var uploadParams = {
                  ACL: "public-read", //
                  Bucket: "classroom-training-bucket",  //HERE
                  Key: "abc/" + file.originalname, //HERE 
                  Body: file.buffer
            }
            s3.upload(uploadParams, (err, data) => {
                  if (err) {
                        return reject({ "error": err })
                  }
                  return resolve(data.Location)
            })
      })
}
//uploadFiles on aws

const uploadedFile = async (req, res) => {
      try {
            let files = req.files
            console.log(files);
            if (files && files.length > 0) {
                  let uploadFileUrl = await uploadFile(files[0])
                   res.status(201).send({ status: true, message: "file uploaded successfully", url: uploadFileUrl })
            }
            else {
                   res.status(400).send({ status: false, message: "No file found" })
            }

      }
      catch (error) {
            res.status(500).send({ status: false, message: error.message });
      }
}
module.exports.uploadedFile = uploadedFile