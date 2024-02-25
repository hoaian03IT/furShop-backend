const Order = require('../model/order');
const ProductAttribute = require('../model/productAttribute');

class OrderController{
    async create(req, res, next){
        try {
            const {name,product,userId,address,phoneNumber,paymentType= 0} = req.body
            console.log(req.body);
            let PromiseSave = []
            let PromiseUpdate = []
            for(let i = 0; i <product.length; i++){
                const {productId = null,amount = 0,productAttributeId=null} = product[i]
                const {quantity = 0} = await ProductAttribute.findById(productAttributeId)
                if(quantity <=0) return res.status(400).json({message:`San pham da co id: ${productId} het hang`})
                if (!name || !productId || !userId || !amount || !address || !phoneNumber || !productAttributeId) {
                    return res.status(400).json({ message: 'Invalid input data' });
                }
                const order = new Order({name,paymentType,productId,userId,amount,address,phoneNumber,productAttribute:productAttributeId})
                const saveOrder = order.save()
                const updateProduct = ProductAttribute.updateOne({_id:productAttributeId},{$inc:{quantity:-amount}},{new:true})
                PromiseSave.push(saveOrder)
                PromiseUpdate.push(updateProduct)
            }
            const [data,updateNumber] = await Promise.all([...PromiseSave,...PromiseUpdate])
            console.log(data);
            console.log(updateNumber);
            return res.status(200).json({ 
                message:'thanh cong',
                success:true,

            })
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
    async getOrders(req, res) {
        try{
            const {userId,limit = 5,currentPage = 1} = req.query
            if(currentPage <1 || limit <=0){
                return res.status(400).json({message:"current page and limit number invalid"})
            }
            const start = (currentPage - 1)*limit
            if(!userId) {
                return res.status(400).json({
                    message:'user id khong hop le'
                })
            }
            const data  = await Order.find({userId}).skip(start).limit(limit).populate("productId productAttribute")
            return res.status(200).json({
                success:true,
                message:"Lay du lieu thanh cong",
                data
            })
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
    async getOrder(req, res) {
        try{
            const {orderId} = req.query
            if(!orderId) {
                return res.status(400).json({
                    message:'order id khong hop le'
                })
            }
            const data = await Order.findById(orderId).populate("productId productAttribute")
            return res.status(200).json({
                success:true,
                message:"Lay du lieu thanh cong",
                data
            })
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }

    async cancelOrder(req, res) {
        try{
            const {orderId,productAttributeId} = req.body;
            if(!orderId || !productAttributeId){
                return res.status(400).json({message:"thong tin khong hop le"})
            }
            const deleteOrder =  Order.deleteById(orderId)
            const {amount} = await Order.findById(orderId)
            const updateProductAttribute = ProductAttribute.updateOne({_id:productAttributeId},{$inc:{quantity:amount}},{new:true})
            const [data,update] = await Promise.all([deleteOrder, updateProductAttribute])
            if(data.modifiedCount && update.modifiedCount)return res.status(200).json({
                success:true,
                message:"Xu ly thanh cong",
                data,
                update
            })
            return res.status(500).json({success:'xu ly that bai'})
        }
        catch(err){
            return res.status(500).json({message: err.message})
        }
    }
}

module.exports = new OrderController()
