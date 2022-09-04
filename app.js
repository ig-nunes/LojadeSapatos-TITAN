//Carregando modulos
const express = require('express')
const session = require('express-session')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const path = require('path')
const app = express()
const mongoose = require("mongoose")
const flash = require('connect-flash')
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)

//Configuracoes

// Sessao *app.use serve para criacao e configuracao de middleware*
      app.use(session({
        secret: 'TITAN',
        resave: true,
        saveUninitialized: true
      }))
      app.use(flash())
      app.use(passport.session())
      app.use(flash())
//Middleware  
app.use((req, res, next) => {
      res.locals.success_msg = req.flash("sucess_msg") //*criando variaveis globais atraves do locals para serem acessadas em qualquer pasta*
      res.locals.error_msg = req.flash("error_msg")
      res.locals.error = req.flash("error")
      res.locals.user = req.user || null
      next()
})
//Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.engine('handlebars', handlebars.engine({
  defaultLayoult: 'main', runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}))
app.set('view engine', 'handlebars')

//Mongoose
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/teste").then(() => {
  console.log("Conectado ao Mongo")
}).catch((err) => {
  console.log("ERRO AO SE CONECTAR!")
})

//Public
app.use(express.static(path.join(__dirname, "public")))
app.use((req, res, next) => {
  console.log("EU sou um middleware, apareco sempre que vc faz uma req")
  next()
})


//Rotas
//rotas independentes da pasta "routes"
app.get('/', (req, res) => {
  //   Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens) => {
  //     res.render("index", {postagens: postagens})
  // }).catch((err) => {
  //   req.flash("error_msg","Houve um erro interno")
  //   res.redirect("/404")
  // })
  // app.get("/404", (req,res) => {
  //   res.render(admin/404)
  // })


  res.render('index/index') //acessando a pasta para abrir o arquivo index
})

app.use('/admin', admin)
app.use("/usuarios", usuarios)


//Outros
const PORT = 8088
app.listen(PORT, () => console.log(`Servidor Principal (App) Rodando na porta localhost:${PORT} ...`))