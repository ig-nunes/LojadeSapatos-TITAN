const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Faleconosco = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required:true,
    },
})




mongoose.model("faleConosco", Faleconosco)