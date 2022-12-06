const adminModel = require('../model/adminModel')
const quesModel = require('../model/quesModel')
const aws= require("aws-sdk")
const jwt = require('jsonwebtoken')
const {isValid,isValidBody,isValidObjectId} = require('../validation/validator')

aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async (file) =>{
    return new Promise( function(resolve, reject) {
     let s3 = new aws.S3({apiVersion: '2006-03-01'});

     var uploadParams= {
         ACL: "public-read",
         Bucket: "classroom-training-bucket",
         Key: file.originalname,
         Body: file.buffer
     }
    
     s3.upload( uploadParams, function (err, data ){
         if(err) return reject({"error": err})
         return resolve(data.Location)
     })
    })
 }

const createAdmin = async function (req, res)
{
    try{
            let data =req.body
            if(!isValid(data)) return res.status(400).send({ status: false, message: "No Data Found" });

            let {name,email,password} = data

            if(!isValid(name)) return res.status(400).send({ status: false, message: "Please Enter Name" });

            if(!isValid(email)) return res.status(400).send({ status: false, message: "Please Enter Email" });
            const checkEmail = await adminModel.findOne({ email: email });
            if (checkEmail) return res.status(400).send({ status: false, message: "Email is already register" });
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) return res.status(400).send({ status: false, message: "Email should be valid" });
            
            if(!isValid(password)) return res.status(400).send({ status: false, message: "Please Enter Password" });
            if (password.length < 8 || password.length > 15) return res.status(400).send({status: false,message: "password length should be in the range of 8 to 15 only",});

            let adminCreated = await adminModel.create(data)
            return res.status(201).send({status:true ,message:"User created successfully", data:adminCreated})
    }
    catch(err)
    {
        res.status(500).send({status:false , message:err.message})
    }
}

const loginAdmin = async function (req, res) {
    try {
      const data = req.body;
      if(!isValidBody(data)) return res.status(400).send({status: false,message: "Please Enter Login Credentials",});
      
      const { email, password } = data;
      if (!isValid(email)) return res.status(400).send({ status: false, message: "Please Enter Email" });
      if (!isValid(password)) return res.status(400).send({ status: false, message: "Please Enter Password" });
      
      let findAdmin = await adminModel.findOne({email: email});
      if (!findAdmin) return res.status(400).send({ status: false, message: "Email is not correct" });
      if (password != findAdmin.password) return res.status(400).send({ status: false, message: "Password is not correct" });
  
      let token = jwt.sign(
        {
          adminId: findAdmin._id.toString()
        },
        "kriscent"
      );

    //   req.headers['authorization'] = token

      return res.status(200).send({ status: true, message: "Admin login successfull",token:token, data: findAdmin });
    
    } catch (err) {
        res.status(500).send({status:false , message:err.message});
    }
  };


  const createQues = async function (req, res)
  {
      try{

            let files = req.files
            let quesImage = files[0]
            
              let data =req.body
              if(!isValid(data)) return res.status(400).send({ status: false, message: "No Data Found" });
  
              let {question , op1 , op2 , op3 , op4, answer} = data
  
              if(!isValid(question)) return res.status(400).send({ status: false, message: "Please Enter question" });
              if(!isValid(answer)) return res.status(400).send({ status: false, message: "Please Enter answer" });
              if(!isValid(op1)) return res.status(400).send({ status: false, message: "Please Enter option1" });
              if(!isValid(op2)) return res.status(400).send({ status: false, message: "Please Enter option2" });
              if(!isValid(op3)) return res.status(400).send({ status: false, message: "Please Enter option3" });
              if(!isValid(op4)) return res.status(400).send({ status: false, message: "Please Enter option4" });
              
              if(quesImage){
                let imageUrl = await uploadFile(quesImage)
                data.quesImage = imageUrl
              }
              
               
              let quesCreated = await quesModel.create(data)
              return res.status(201).send({status:true ,message:"question created successfully", data:quesCreated})
      }
      catch(err)
      {
          res.status(500).send({status:false , message:err.message})
      }
  } 


  const updateQues = async function (req, res) {
    try {

        let quesId = req.params.quesId
        if(!isValidObjectId(quesId)) return res.status(400).send({status:false , message:"Please Enter Valid question Id"})

        let findQues = await quesModel.findOne({ _id: quesId })
        if (!findQues) return res.status(404).send({ status: false, message: "question not found" });

        let files = req.files
            let quesImage = files[0]
            
              let data =req.body
              if(!isValid(data)) return res.status(400).send({ status: false, message: "No Data Found" });
    
              if(quesImage){
                let imageUrl = await uploadFile(quesImage)
                data.quesImage = imageUrl
              }

        let updateQue = await quesModel.findOneAndUpdate(
          {_id:quesId},
          data,
          {new:true}
          )

        return res.status(200).send({ status: true, message: "Question updated", data: updateQue });

    } catch (err) {
        res.status(500).send({status:false , message:err.message});
    }
  };

module.exports = { createAdmin , loginAdmin , createQues , updateQues }