const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Produto')
const Produto = mongoose.model('produtos')
require('../models/Cupom')
const Cupom = mongoose.model('cupons')
const {eAdmin} = require("../helpers/eAdmin")



const categorias = ['categoria 1', 'categoria 2', 'categoria 3' ]
const marcas = ['marca 1', 'marca 2', 'marca 3']


//http://localhost:8088/admin
// pegando o view/admim/index
router.get('/',eAdmin,(req,res) => {
  res.render('admin/index')
})



//   CUPONS:

// http://localhost:8088/admin/cupons
router.get('/cupons',eAdmin,(req, res) => {
  Cupom.find({}).then((cupons) => {
    res.render('admin/cupons', { cupons })
  })
  .catch((err) => {
    req.flash('error_msg', 'Houve um error ao listar os cupons')
    res.redirect('/admin')
  })
})

//http://localhost:8088/admin/cupons/buscar/:id
router.get('/cupons/buscar/:id',eAdmin,(req, res) => {
  const { id } = req.params
  Cupom.findById(id).then((cupom) => {
    if (cupom === null) {
      req.flash('error_msg','Cupom não encontrado')
      res.redirect('/admin/cupons')
    } else {
      res.render('admin/buscarcupom', { cupom })
    }
  })
  .catch((err) => {
    req.flash('error_msg','Produto não encontrado')
    res.redirect('/admin/produtos')
  })
})


// http://localhost:8088/admin/cupons/add
router.get('/cupons/add',eAdmin,(req,res) => {
  res.render('admin/addcupom')
})

//http://localhost:8088/admin/cupons/novo
router.post('/cupons/novo',eAdmin, (req, res) => {
  var erros = [] // validacao para evitar erros do usuario

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({texto:'Nome invalido'})  
  }
  
  if (!req.body.desconto || typeof req.body.desconto == undefined || req.body.desconto == null) {
    erros.push({texto:'Desconto invalido'})  
  }

  if (req.body.nome.length < 2) {
    erros.push({texto:'nome muito pequeno'})
  }

  if (req.body.desconto < 0) {
    erros.push({texto:'O desconto precisa ser maior que zero'})
  }
  
  if (erros.length > 0) {
    res.render('admin/addcupom', { erros: erros })
  } else { 
    const novoCupom = {
      nome: req.body.nome,
      desconto: req.body.desconto         
    }
  
    new Cupom(novoCupom).save().then(() => {
      req.flash('sucess_msg','Cupom criado com sucesso!')
      res.redirect('/admin/cupons')
      console.log('Cupom salvo com sucesso')
    }).catch((err) => {
      req.flash('error_msg','Houve um erro ao salvar o cupom, tente novamente!')
      res.redirect('/admin/produtos')
      console.log('ERRO AO SALVAR CUPOM!')
    })
  }
})

//http://localhost:8088/admin/cupons/edit/:id
router.get('/cupons/edit/:id',eAdmin,(req, res) => {
  const { id } = req.params 
  Cupom.findById(id).then(( cupom ) => { 
    res.render('admin/editcupons', { cupom: cupom })
  }).catch((err) => {
    req.flash('error_msg', 'Este cupom nao existe')
    res.redirect('/admin/produtos')
  })
})



//http://localhost:8088/admin/cupons/deletar
router.post("/cupons/deletar",eAdmin,(req, res) => {
  Produto.findByIdAndDelete({ _id: req.body.id }).then(() => {
    req.flash('sucess_msg', 'Cupom deletado com sucesso!')
    res.redirect('/admin/cupons')
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao deletar o cupom')
    res.redirect('/admin/cupons')
})
})




//  PRODUTOS:

//http://localhost:8088/admin/produtos
router.get('/produtos',eAdmin,(req, res) => {
  Produto.find({}).then((produtos) => {
    res.render('admin/produtos', { produtos })
  }).catch((err) => { 
    req.flash('error_msg', 'Houve um error ao listar os produtos')
    res.redirect('/admin')
  })
})

//http://localhost:8088/admin/produtos/buscar/:id
router.get('/produtos/buscar/:id',eAdmin,(req, res) => {
  const { id } = req.params
  Produto.findById(id).then((produto) => {
    if (produto === null) {
      req.flash('error_msg','Produto não encontrado')
      res.redirect('/admin/produtos')
    } else {
      res.render('admin/buscarproduto', { produto })
    }
  })
  .catch((err) => {
    req.flash('error_msg','Produto não encontrado')
    res.redirect('/admin/produtos')
  })
})


//http://localhost:8088/admin/produtos/add
router.get('/produtos/add',eAdmin,(req,res) => {
  res.render('admin/addprodutos', { categorias, marcas })
})


//http://localhost:8088/admin/teste
// router.get('/teste',(req,res) => {
//   res.send('Pagina de teste')
// })


//http://localhost:8088/admin/produtos/novo
router.post('/produtos/novo',eAdmin,(req, res) => {
  var erros = [] //validacao para evitar erros do usuario

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({texto:'Nome invalido'})  
  }
  
  if (!req.body.preco || typeof req.body.preco == undefined || req.body.preco == null) {
    erros.push({texto:'Preço invalido'})  
  }

  if (req.body.nome.length < 2) {
    erros.push({texto:'nome muito pequeno'})
  }
  
  if (erros.length > 0) {
    res.render('admin/addprodutos', { erros: erros })
  } else { 
    const novoProduto = {
      nome: req.body.nome,
      preco: req.body.preco,         
      quantEstoque: req.body.quantEstoque,
      categoria: req.body.categoria,
      marca: req.body.marca          
    }
  
    new Produto(novoProduto).save().then(() => {
      req.flash('sucess_msg','Produto criado com sucesso!')
      res.redirect('/admin/produtos')
      console.log('Produto salvo com sucesso')
    }).catch((err) => {
      req.flash('error_msg','Houve um erro ao salvar o produto, tente novamente!')
      res.redirect('/admin/produtos')
      console.log('ERRO AO SALVAR PRODUTO!')
    })
  }
})

//http://localhost:8088/admin/produtos/edit/:id
router.get('/produtos/edit/:id',eAdmin,(req, res) => {
  const { id } = req.params 
  Produto.findById(id).then(( produto ) => { 
    res.render('admin/editprodutos', { produto: produto, categorias, marcas })
  }).catch((err) => {
    req.flash('error_msg', 'Este produto nao existe')
    res.redirect('/admin/produtos')
  })
})

//http://localhost:8088/admin/produtos/edit
router.post('/produtos/edit',eAdmin,(req, res) => { 
  Produto.findOne({_id: req.body.id }).then((produto) => { 

    produto.nome = req.body.nome
    produto.preco = req.body.preco
    produto.quantEstoque = req.body.quantEstoque
    produto.categoria = req.body.categoria
    produto.marca = req.body.marca

    produto.save().then(() => { 
      req.flash('success_msg', 'Produto editado com sucesso!')
      res.redirect('/admin/produtos')
    }).catch((err) => { 
      req.flash('error_msg', 'Houve um erro interno ao salvar a edicao do produto')
      res.redirect('/admin/produtos')
    })

  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao editar o produto')
    res.redirect('/admin/produtos')
  })
})
  

router.post("/produtos/deletar",eAdmin,(req, res) => {
  Produto.findByIdAndDelete({ _id: req.body.id }).then(() => {
    req.flash('sucess_msg', 'Produto deletado com sucesso!')
    res.redirect('/admin/produtos')
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao deletar o produto')
    res.redirect('/admin/produtos')
})
})

//http://localhost:8088/admin/produtos/edit
router.post('/cupons/edit',eAdmin,(req, res) => { 
  Cupom.findOne({ _id: req.body.id }).then((cupom) => { 

    cupom.nome = req.body.nome
    cupom.desconto = req.body.desconto

    cupom.save().then(() => { 
      req.flash('success_msg', 'Cupom editado com sucesso!')
      res.redirect('/admin/cupons')
    }).catch((err) => { 
      req.flash('error_msg', 'Houve um erro interno ao salvar a edicao do cupom')
      res.redirect('/admin/cupons')
    })

  }).catch((err) => { 
    req.flash('error_msg', 'Houve um erro ao editar o cupom')
    res.redirect('/admin/cupons')
  })
})











module.exports = router

