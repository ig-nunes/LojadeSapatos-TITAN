const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Produto = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    quantEstoque: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    imageFileName: {
        type: String,
        required: true
    }
    ,
    categoria: {
        type: String,
        enum: ['casual', 'esportivo', 'infantil']
    },
    marca: {
        type: String,
        enum: ['adidas', 'puma', 'nike']
    }
})

mongoose.model("produtos", Produto)