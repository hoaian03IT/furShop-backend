const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongooseDelete = require('mongoose-delete')

const ProductSchema = new Schema({
    productName:{type:String, default:'Chưa cập nhật tên'},
    price:{type:Number, required:true},
    image:{type:String, default:`http://${serverName}:${serverPort}/hinh-anh?image=product-dafault.jpg`},
    rate:{type:Array,default:[0]},
    description:{type:String},
    size:{type:mongoose.Schema.Types.ObjectId},
    branch:{type:mongoose.Schema.Types.ObjectId,ref:'Brand'},
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:'Category'}
},{timestamps:true})

ProductSchema.plugin(mongooseDelete,{deletedAt:true,deletedBy:true})
const ProductModel = mongoose.model('Product',ProductSchema)
ProductSchema.methods.quantity = function(cb){
    
}

module.exports = ProductModel