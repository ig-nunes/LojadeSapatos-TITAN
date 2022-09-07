const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Produto = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required:true
    },
    quantEstoque: {
        type: Number,
        required: true
    },
    categoria: {
        type: 'String',
        enum: ['categoria 1', 'categoria 2', 'categoria 3','categoria 4']
    }
    ,
    marca: {
        type: String,
        lowercase: true,
        enum: ['marca 1', 'marca 2', 'marca 3']
    }
})

mongoose.model("produtos", Produto)