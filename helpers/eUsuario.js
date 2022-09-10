module.exports = {
    eUsuario: function (req, res, next) { 
        if (req.isAuthenticated()) { 
            return next()
        }
        req.flash("error_msg", "Faça login para acessar essa parte!")
        res.redirect("http://localhost:8088/usuarios/login")
    }
}