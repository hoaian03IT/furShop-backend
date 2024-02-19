const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete')
const serverName = require('os').hostname()
const serverPort = process.env.PORT || 8080

const AccountSchema  = new Schema({
    userName:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    role:{type:String, default:'customer',enums:['customer','provider','admin']},
    email:{type:String, default:null},
    phone:{type:String, default:null},
    gender:{type:Number, default:null,enums:[0,1]}, // 0 la con gai, 1 la con trai
    address:{type:String, default:null},
    location:{type:String, default:null},
    image:{type:String, default:`http://${serverName}:${serverPort}/hinh-anh?image=avatar-dafault.jpg`},
    token:{type:Array, default:null}
},{timestamps:true})

Account.plugin(mongooseDelete,{deletedAt:true,deletedBy:true})

module.exports = mongoose.model('Account',AccountSchema)

