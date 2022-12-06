const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps: true });

module.exports = mongoose.model('Admin',adminSchema)