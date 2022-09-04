const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Usuario = new Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required:true,
    },
    eAdmin: {
        type: Number,
        default: 0,
        //0 = comprador 1 = admin
    },
})




mongoose.model("usuarios",Usuario)