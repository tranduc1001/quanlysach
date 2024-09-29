const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    created:{
        type: String,
        required: true,
        default: Date.now,
    },
});
module.exports = mongoose.model('Book',userSchema);