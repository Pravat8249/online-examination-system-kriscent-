const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const {isValidObjectId} = require('../validation/validator')

const authrize = async function(req,res,next){
    try{
        let header = req.headers
        let token = header['token'];
        let decodeToken = jwt.decode(token)

        let adminId = req.params.adminId
        if(!isValidObjectId(adminId)) return res.status(400).send({status:false , message:"Please Enter Valid Admin Id"})
        if(decodeToken.hasOwnProperty('adminId') && adminId != decodeToken.adminId ) return res.status(403).send({status:false , message:"only admin can do this"})
        next()
    }
    catch(e)
    {
        res.status(500).send({status:false , message:e.message});
    }
}

module.exports = {authrize}