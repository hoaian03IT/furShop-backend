const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete')

const SizeProductSchema = new Schema({
    key:{type:String,require:true},
    idColor:{type:mongoose.Schema.Types.ObjectId,ref:'ColorProduct'}
},{timestamps:true})

SizeProductSchema.plugin(mongooseDelete,{deletedAt:true,deletedBy:true})

module.exports = mongoose.model('SizeProduct',SizeProductSchema)