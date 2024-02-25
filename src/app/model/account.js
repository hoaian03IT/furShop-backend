const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");
const serverName = require("os").hostname();
const serverPort = process.env.PORT || 8080;

const AccountSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "customer" },
        email: { type: String, default: null, unique: true },
        phone: { type: String, default: null },
        gender: { type: Number, default: null },
        image: { type: String, default: `http://${serverName}:${serverPort}/hinh-anh?image=avatar-dafault.jpg` },
        token: [{ type: String }],
    },
    { timestamps: true }
);

AccountSchema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true,overrideMethods:true });

module.exports = mongoose.model("Account", AccountSchema);
