const Cart = require('../model/cart')

class CartComtroller{
    async upload(req,res,next){
        try {
            const {amount,customerId,productId} = req.data;
            if(amount<=0) return res.status(401).json({
                title:"Lỗi",
                message:"Số lượng sản phẩm phải lớn hơn 0"
            })
            const newCart = new Cart({amount,customerId,productId})
            const data = await newCart.save()
            if(data) return res.status(200).json({
                title:"Thành công",
                message:'Thêm sản phẩm thành công',
                data
            })
            return res.status(error.status).json({
                title:'Lỗi',
                message: "Cập nhật thất bại"
            })
        } catch (error) {
            return res.status(error.status).json({
                title:'Lỗi',
                message: error.message
            })
        }
    }
    async get(req, res) {
        try {
            const {customerId,pageNumber = 1,limit} = req.query;
            const start = (pageNumber - 1) * limit;
            const data = await Cart.find({customerId}).skip(start).limit(limit)
            return res.status(200).json({
                title:"Thành công",
                message: "Xem giỏ hàng",
                data: data
            })
        } catch (error) {
            return res.status(error.status).json({
                title:"Lỗi",
                message: error.message
            })
        }
    }
    async destroy(req, res) {
        try {
            const {cartId} = req.data;
            const data = await Cart.deleteOne({_id:cartId})
            return res.status(200).json({
                title:"Thành công",
                message:"Xóa sản phẩm thành công",
                data
            })

        } catch (error) {
            return res.status(error.status).json({
                title:"Lỗi",
                message: error.message
            })
        }
    }
}

module.exports = new CartComtroller()