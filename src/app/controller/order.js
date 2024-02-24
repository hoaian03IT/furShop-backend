const Order = require('../model/order')

class OrderController{
    async create(req, res, next){
        try {
            const {name,productId,userId,amount,address,phoneNumber,paymentType= 0} = req.body
            if (!name || !productId || !userId || !amount || !address || !phoneNumber) {
                return res.status(400).json({ message: 'Invalid input data' });
            }
            const order = new Order({name,paymentType,productId,userId,amount,address,phoneNumber})
            order.save((err,data)=>{
                if(err){
                    return res.status(403).json({message:err.message})
                }
                return res.status(200).json({
                    title:'Thanh Cong',
                    message:"Mua hang thanh cong",
                    data:data,
                    success:true
                })
            })
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
    async getOrders(req, res) {
        try{
            const {userId,limit,currentPage} = req.query
            const start = (currentPage - 1)*limit
            if(!userId) {
                return res.status(400).json({
                    message:'user id khong hop le'
                })
            }
            const data  = await Order.find({userId}).skip(start).limit(limit)
            return res.status(200).json({
                success:true,
                message:"Lay du lieu thanh cong",
                data
            })
        }
        catch{
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
            const data = await Order.findById(orderId)
            return res.status(200).json({
                success:true,
                message:"Lay du lieu thanh cong",
                data
            })
        }
        catch{
            return res.status(500).json({message: error.message})
        }
    }

    async cancelOrder(req, res) {
        
    }
}

module.exports = new OrderController()
