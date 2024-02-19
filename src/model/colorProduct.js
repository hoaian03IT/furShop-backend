const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete')

const ColorProductSchema = new Schema({
    key:{type:String,require:true},
    quality:{type:Number,default:0}
},{timestamps:true})

ColorProductSchema.plugin(mongooseDelete,{deletedAt:true,deletedBy:true})

module.exports = mongoose.model('ColorProduct',ColorProductSchema)