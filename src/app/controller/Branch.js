const BranchModel = require("../model/branch");

class Branch {
    async createBranch(req, res) {
        try {
            const { newBranch, description } = req.body;
            const hasExistBranch = await BranchModel.exists({ name: newBranch });
            if (hasExistBranch) {
                return res.status(400).json({
                    title: "Lỗi",
                    message: "Branch đã tồn tại",
                });
            }
            await BranchModel.create({
                name: newBranch,
                description,
            });
            return res.status(200).json({
                title: "Thành công",
                message: "Thêm mới thành công",
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new Branch();
