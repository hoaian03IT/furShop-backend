const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete')

const CategorySchema = new Schema({
   name:{type:String}
},{timestamps:true})

CategorySchema.plugin(mongooseDelete,{deletedAt:true,deletedBy:true})

module.exports = mongoose.model('Category',CategorySchema)