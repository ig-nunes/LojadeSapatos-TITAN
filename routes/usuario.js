const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const flash = require('connect-flash')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
require('../models/Produto')
const Produto = mongoose.model('produtos')
require('../models/Cupom')
const Cupom = mongoose.model('cupons')
const Carrinho = require('../models/Carrinho')
const Favorito = require('../models/Favorito')
const { eAdmin } = require("../helpers/eAdmin")
const { eUsuario } = require("../helpers/eUsuario")
const bcrypt = require("bcryptjs")
const passport = require("passport")
require('../models/Faleconosco')
const Faleconosco = mongoose.model("faleConosco")






// INDEX:
// http://localhost:8088/usuarios
router.get('/', async (req, res) => {
  const produtos = await Produto.find()

  // console.log(req.session);

  if (req.query) {
    const { busca } = req.query

    Produto.findOne({ nome: busca })
      .then((produto) => {
        // console.log(produto)
        if (produto) {
          // console.log(produto)
          return res.redirect(`http://localhost:8088/usuarios/produtos/buscar/${produto._id}`)
        } else {
          console.log("produto não encontrado")
          req.flash("error_msg", "Produto não encontrado")
        }

      })
      .catch((err) => {
        console.log(err)
        req.flash("error_msg", "Ocorreu algum erro interno")
        res.redirect('http://localhost:8088/usuarios')
      })
  }

  res.render('index/index', { produtos })
})


// CADASTRO

router.get("/registro", (req, res) => {
  res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
  var erros = []

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({ texto: "Nome invalido" })
  }
  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    erros.push({ texto: "Email invalido" })
  }
  if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
    erros.push({ texto: "Senha invalido" })
  }

  if (req.body.senha.length < 4) {
    erros.push({ texto: "Senha muito curta" })
  }

  if (req.body.senha != req.body.senha2) {
    erros.push({ texto: "Senhas diferentes" })
  }

  if (erros.length > 0) {
    res.render("usuarios/registro", { erros: erros })
  } else {
    Usuario.findOne({ email: req.body.email }).then((usuario) => {
      if (usuario) {
        req.flash("error_msg", "Ja existe uma conta com esse email no sistema")
        res.redirect("/usuarios/registro")
      } else {
        const novoUsuario = new Usuario({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha,
          //eAdmin: 1 
        })

        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
            if (erro) {
              req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
              res.redirect("/")
            }

            novoUsuario.senha = hash

            novoUsuario.save().then(() => {
              req.flash("success_msg", "Usuario criado com sucesso")
              res.redirect("/")
            }).catch((err) => {
              req.flash("error_msg", "Houve um erro ao criar o usuario, tente novamente")
              res.redirect("/usuarios/registro")
            })

          })
        })


      }
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno")
      res.redirect("/")
    })
  }
})


// LOGIN

router.get("/login", (req, res) => {
  res.render("usuarios/login")
})


router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuarios/login",
    failureFlash: true,
  })(req, res, next)
})


router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err) }
    req.flash("success_msg", "Deslogado com sucesso!")
    res.redirect("/")
  })
})

router.get("/confirmarrecuperacaosenha", (req, res) => {
  res.render("usuarios/confirmarrecuperacaodesenha")
})

// CUPONS
router.get('/cupons', eUsuario, (req, res) => {
  Cupom.find({}).then((cupons) => {
    res.render('cupons/cupons', { cupons })
  })
})

router.get("/recuperar", (req, res) => {
  res.render("usuarios/recuperarsenha")
})


// SOBRE NÓS
router.get("/sobrenos", (req, res) => {
  res.render("sobrenos/about")
})



//  PRODUTOS:

//http://localhost:8088/usuarios/produtos
router.get('/produtos', eUsuario, (req, res) => {
  Produto.find({}).then((produtos) => {
    // produtos.forEach(p => {
    //   p.preco = p.preco.toLocaleString('pt-br', {minimumFractionDigits: 2});
    // })
    res.render('produtos/produtos', { produtos })
  }).catch((err) => {
    req.flash('error_msg', 'Houve um error ao listar os produtos')
    res.redirect('/usuarios')
  })
})

//http://localhost:8088/usuarios/produtos/buscar/:id
router.get('/produtos/buscar/:id', eUsuario, async (req, res) => {
  let baixoEstoque = false
  let conteudo = false
  const { id } = req.params
  const produto = await Produto.findById(id);

  if (produto == null) {
    req.flash('error_msg', 'Produto não encontrado')
    return res.redirect('/usuarios/produtos')
  }

  if (produto.quantEstoque < 10) {
    baixoEstoque = true
  }

  const produtos = await Produto.find({ categoria: produto.categoria })
  // console.log(produtos)

  if (produtos.length != 0) {
    conteudo = true
  }

  // console.log(baixoEstoque)
  // console.log(conteudo)
  res.render('produtos/detalhes-produto', { produto, produtos, conteudo, baixoEstoque })
})


// CUPONS
//http://localhost:8088/usuarios/cupons/buscar/:id
// router.get('/cupons/buscar/:id', (req, res) => {
//   const { id } = req.params
//   Cupom.findById(id).then((cupom) => {
//     if (cupom === null) {
//       req.flash('error_msg', 'Cupom não encontrado')
//       res.redirect('/usuarios/cupons')
//     } else {
//       res.render('admin/buscarcupom', { cupom })
//     }
//   })
//     .catch((err) => {
//       req.flash('error_msg', 'Produto não encontrado')
//       res.redirect('/usuarios/produtos')
//     })
// })





// Carrinho

// http://localhosto:8088/usuarios/carrinho/add-carrinho/:id            adicionar ao carrinho nos produtos
router.post('/carrinho/add-carrinho/:id', eUsuario, async (req, res, next) => {
  const produtoId = req.params.id;
  var cart = new Carrinho(req.session.cart ? req.session.cart : {});
  const produto = await Produto.findById(produtoId);
  cart.add(produto, produto._id);
  req.session.cart = cart;

  req.session.cart.items[produtoId].price = produto.preco * req.session.cart.items[produtoId].quantity;
  req.flash("success_msg", "Adicionado ao carrinho com sucesso!")
  res.redirect('http://localhost:8088/usuarios/produtos')
});


// http://localhosto:8088/usuarios/carrinho/add-mais-carrinho/:id           Adicionar mais no próprio carrinho
router.post('/carrinho/add-mais-carrinho/:id', eUsuario, async (req, res, next) => {
  const produtoId = req.params.id;
  var cart = new Carrinho(req.session.cart ? req.session.cart : {});
  const produto = await Produto.findById(produtoId);
  cart.add(produto, produto._id);
  req.session.cart = cart;

  req.session.cart.items[produtoId].price = produto.preco * req.session.cart.items[produtoId].quantity;
  req.flash("success_msg", `${produto.nome} incrementado ao carrinho com sucesso!`)
  res.redirect('http://localhost:8088/usuarios/carrinho')
});


// http://localhosto:8088/usuarios/carrinho
router.get('/carrinho', eUsuario, async (req, res, next) => {
  let desconto = 0;
  let array = [];
  let totalDesconto = 0;
  let precoTotal = 0;
  req.session.precoTotal = 0;


  if (req.session.totalDesconto == undefined) {
    req.session.totalDesconto = 0
  };


  if (!req.session.cart) {
    if (req.query.cupom || req.query.cupom == "" || req.query.cupom != undefined || req.query.cupom != null) {
      req.flash("error_msg", "Não é possível adicionar cupons com o carrinho vazio")
    }
    return res.render('carrinho/carrinho');
  }

  if (req.query.cupom == undefined || req.query.cupom == null || !req.query.cupom) {
    console.log('Nenhum cupom adicionado');
  } else {
    const cupom = req.query.cupom.toUpperCase();
    const cupomEncontrado = await Cupom.findOne({ nome: cupom });

    if (cupomEncontrado) {
      desconto = cupomEncontrado.desconto;
      req.session.totalDesconto += desconto
    }
  }

  var cart = new Carrinho(req.session.cart);

  if (cart.totalPrice >= desconto) {
    cart.totalPrice = cart.totalPrice - desconto;
    req.session.cart.totalPrice = cart.totalPrice;
    // precoTotal = cart.totalPrice
  } else {
    req.flash("error_msg", "O cupom só pode ser adicionado se o valor total a ser pago for pelo menos igual ao valor do cupom")
  }

  for (var item in cart.items) {
    if (!cart.items.hasOwnProperty(item)) continue;
    var obj = cart.items[item];
    req.session.precoTotal += obj.price

    for (var prop in obj) {
      if (!obj.hasOwnProperty(prop)) {
        continue
      };

      if (prop == "quantity") {
        array.push([item, obj[prop]]);
      }
    }
  }

  if (Object.keys(cart.items).length == 0) {
    req.session.totalDesconto = 0
  }
  precoTotal = req.session.precoTotal

  if (req.session.totalDesconto < req.session.precoTotal) {
    totalDesconto = req.session.totalDesconto
  }
  else {
    req.session.totalDesconto = req.session.precoTotal - cart.totalPrice
    totalDesconto = req.session.totalDesconto
  }


  res.render('carrinho/carrinho', { produtos: cart.getItems(), array, cart, totalDesconto, precoTotal });

});

// http://localhosto:8088/usuarios/carrinho/remover/:id
router.post('/carrinho/remover/:id', eUsuario, async (req, res) => {
  const { id } = req.params;
  const produto = await Produto.findById(id);
  var cart = new Carrinho(req.session.cart ? req.session.cart : {});

  cart.remove(id);
  req.session.cart = cart;
  if (produto) {
    if (req.session.cart.items[id]) {
      req.session.cart.items[id].price = req.session.cart.items[id].price - produto.preco;
    }
  }

  // Impedir que o valor total fique menor do que 0
  if (req.session.cart.totalPrice < 0) {
    req.session.cart.totalPrice = 0;
  }

  res.redirect('http://localhost:8088/usuarios/carrinho');
});

// http://localhosto:8088/usuarios/carrinho/finalizar-compra
router.post('/carrinho/finalizar-compra', eUsuario, async (req, res, next) => {
  if (!req.body.array) {
    res.send('não há produtos no carrinho');
  } else {
    let items = req.body.array;
    const listaItens = items.split(",")
    const pedacoLista = 2;

    for (let i = 0; i < listaItens.length; i += pedacoLista) {
      const produto = listaItens.slice(i, i + pedacoLista);
      const item = await Produto.findById(produto[0]);
      const estoque = item.quantEstoque

      try {
        await Produto.findByIdAndUpdate(produto[0], { quantEstoque: estoque - Number(produto[1]) }, { runValidators: true })
        req.session.cart = {}
        // console.log(req.session.cart)
      } catch (err) {
        // throw new Error(`Quantidade em estoque do produto ${item.nome} menor que a quantidade pedida!`)
        req.flash("error_msg", `Estoque insuficiente para o pedido sobre o item "${item.nome}". 
          Quantidade Pedida: ${Number(produto[1])}; 
          Quantidade em Estoque: ${estoque}.
          `)
      }
    }

    res.redirect('http://localhost:8088/usuarios/produtos');
  }
})






// FAVORITOS:


// http://localhosto:8088/usuarios/favoritos
router.post('/favoritos/add-favoritos/:id', eUsuario, async (req, res, next) => {
  const produtoId = req.params.id;

  var favorito = new Favorito(req.session.favorito ? req.session.favorito : {});

  const produto = await Produto.findById(produtoId);

  favorito.add(produto, produtoId);

  req.session.favorito = favorito;
  req.flash("success_msg", `${produto.nome} adicionado a lista de desejos com sucesso!`)
  res.redirect('http://localhost:8088/usuarios/produtos')
});


// http://localhosto:8088/usuarios/favoritos
router.get('/favoritos', eUsuario, async (req, res, next) => {
  if (!req.session.favorito) {
    return res.render('favoritos/favoritos');
  }
  // console.log(req.session.favorito)
  var favorito = new Favorito(req.session.favorito);
  // console.log(req.session.favorito)

  res.render('favoritos/favoritos', { produtos: favorito.getItems() });

});


// http://localhosto:8088/usuarios/favoritos/remover/:id
router.post('/favoritos/remover/:id', eUsuario, (req, res) => {
  const { id } = req.params;
  var favorito = new Favorito(req.session.favorito ? req.session.favorito : {});

  favorito.remove(id);
  // console.log(favorito)
  // console.log(req.session.favorito)
  req.session.favorito = favorito;
  res.redirect('http://localhost:8088/usuarios/favoritos');
});


// FALE CONOSCO
router.get("/faleconosco",eUsuario, (req, res) => {
  res.render("faleconosco/faleconosco")
})

router.post("/faleconosco/enviar", (req, res) => {

  const dadosFaleconosco = {
    name: req.body.name,
    email: req.body.email,
    text: req.body.text,
  }

  new Faleconosco(dadosFaleconosco).save().then(() => {
    req.flash("success_msg", "Formulario enviado e salvo no banco de dados com sucesso")
    res.redirect("/usuarios/faleconosco")
  }).catch((err) => {
    req.flash("error_msg", "Erro ao enviar o formulario")
    res.redirect("/usuarios/faleconosco")
  })

})



module.exports = router