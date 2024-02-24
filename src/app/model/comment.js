const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete')

const CommentSchema = new Schema({
    customerId:{type:mongoose.Schema.Types.ObjectId,ref:"Account"},
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
    comment:{type:String},
    star:{type:Number,require:true}
},{timestamps:true})

CommentSchema.plugin(mongooseDelete,{deletedAt:true,deletedBy:true,overrideMethods:true})

module.exports = mongoose.model('Comment',CommentSchema)