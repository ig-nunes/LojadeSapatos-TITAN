const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Cupom = new Schema({
    nome: {
        type: String,
        required: true,
        uppercase: true,
        trim: true      
    },
    desconto: {
        // pode ser de 0 a 100, significando a porcentagem de desconto, ou de 0 a qualquer valor, sendo o valor do desconto literal
        type: Number,
        required: true,
        min: 0
    }
})


mongoose.model("cupons", Cupom)


// Outra forma de fazer:

// const cupomSchema = new mongoose.Schema({
//     nome: {
//         type: String,
//         required: true
//     }
// })

// const Cupom = new mongoose.model('Cupom', cupomSchema)

// module.exports = Cupom
// mongoose.model("produtos", Produto)