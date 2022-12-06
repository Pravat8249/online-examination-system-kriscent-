const mongoose = require('mongoose');

const quesSchema = new mongoose.Schema({
   question: {
        type: String,
        trim:true,
        required: true
    },
    op1: {
        type: String,
        required: true,
        trim:true,
    },
    op2: {
        type: String,
        required: true,
        trim:true,
    },
    op3: {
        type: String,
        required: true,
        trim:true,
    },
    op4: {
        type: String,
        required: true,
        trim:true,
    },
    answer:{
        type:String,
        required:true,
        trim:true
    },
    quesImage:{
        type:String,
        trim:true
    }
},{timestamps: true });

module.exports = mongoose.model('ques',quesSchema)