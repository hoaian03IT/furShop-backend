const Account = require('../model/account')

class Account{
    register(req,res,next){
        const userName = req.body?.userName
        const password = req.body?.password
        if(!isEmail(userName)) return res.status(403).json({
            title:"Lỗi cú pháp",
            message:"Tên đăng nhập không hợp lệ"
        })
        
    }
}

module.exports = new Account()