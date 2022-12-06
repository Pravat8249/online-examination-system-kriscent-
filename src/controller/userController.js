const userModel = require('../model/userModel')
const quesModel = require('../model/quesModel')
const jwt = require('jsonwebtoken')
const {isValid,isValidBody,isValidObjectId} = require('../validation/validator')

const createUser = async function (req, res)
{
    try{
            let data =req.body
            if(!isValid(data)) return res.status(400).send({ status: false, message: "No Data Found" });

            let {name,email,phone,password,address} = data

            if(!isValid(name)) return res.status(400).send({ status: false, message: "Please Enter Name" });

            if(!isValid(email)) return res.status(400).send({ status: false, message: "Please Enter Email" });
            const checkEmail = await userModel.findOne({ email: email });
            if (checkEmail) return res.status(400).send({ status: false, message: "Email is already register" });
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) return res.status(400).send({ status: false, message: "Email should be valid" });
            
            if(!isValid(phone)) return res.status(400).send({ status: false, message: "Please Enter Phone Number" });
            if (!/^(\+91)?0?[6-9]\d{9}$/.test(phone.trim())) return res.status(400).send({ status: false, message: "Mobile no should be valid" });
            const checkPhone = await userModel.findOne({ phone: phone });
            if (checkPhone) return res.status(400).send({status: false,message: "Mobile number is already registered",});
            
            if(!isValid(password)) return res.status(400).send({ status: false, message: "Please Enter Password" });
            if (password.length < 8 || password.length > 15) return res.status(400).send({status: false,message: "password length should be in the range of 8 to 15 only",});

            if(!isValid(address)) return res.status(400).send({ status: false, message: "Please Enter address" });

            let userCreated = await userModel.create(data)
            return res.status(201).send({status:true ,message:"User created successfully", data:userCreated})
    }
    catch(err)
    {
        res.status(500).send({status:false , message:err.message})
    }
}

const loginUser = async function (req, res) {
    try {
      const data = req.body;
      if(!isValidBody(data)) return res.status(400).send({status: false,message: "Please Enter Login Credentials",});
      
      const { email, password } = data;
      if (!isValid(email)) return res.status(400).send({ status: false, message: "Please Enter Email" });
      if (!isValid(password)) return res.status(400).send({ status: false, message: "Please Enter Password" });
      
      let findUser = await userModel.findOne({email: email});
      if (!findUser) return res.status(400).send({ status: false, message: "Email is not correct" });
      if (password != findUser.password) return res.status(400).send({ status: false, message: "Password is not correct" });
  
      let token = jwt.sign(
        {
          userId: findUser._id.toString()
        },
        "kriscent"
      );

      return res.status(200).send({ status: true, message: "User login successfull",token : token, data: findUser });
    
    } catch (err) {
        res.status(500).send({status:false , message:err.message});
    }
  };

  const viewExam = async function (req, res)
{
    try{
            let questions = await quesModel.aggregate( [ { $sample: {size: 10}}])

            let ques = []
            for(let i=0; i<questions.length; i++){
              ques.push({
                question:questions[i].question,
                option1:questions[i].op1,
                option2:questions[i].op2,
                option3:questions[i].op3,
                option4:questions[i].op4
              })
            }

            return res.status(201).send({status:true ,message:"question list", data:ques})
    }
    catch(e)
    {
        res.status(500).send({status:false , message:e.message})
    }
}

const ansQues = async function (req, res)
{
    try{

            let quesId = req.params.quesId
            if(!isValidObjectId(quesId)) return res.status(400).send({status:false , message:"Please Enter Valid question Id"})

            let findQues = await quesModel.findOne({ _id: quesId })
            if (!findQues) return res.status(404).send({ status: false, message: "question not found" });

            let answer = req.query.answer
            if(!answer) return res.status(400).send({status:false , message:"Please Enter Your Answer"})

            let result = await quesModel.findOne({id:quesId})
            
            if(result.answer != answer) return res.status(200).send({status:true ,message:"your answer is not correct",yourAnswer:answer , correctAnswer:result.answer})
            return res.status(200).send({status:true ,message:"your answer is correct", yourAnswer:answer , correctAnswer:result.answer})
    }
    catch(err)
    {
        res.status(500).send({status:false , message:err.message})
    }
}


  module.exports = { createUser , loginUser ,viewExam , ansQues}