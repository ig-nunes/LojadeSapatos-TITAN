module.exports = function Carrinho(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add = function (item, id) {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = { item: item, quantity: 0, price: 0 };
        }
        cartItem.quantity++;
        cartItem.price = cartItem.item.preco * cartItem.quantEstoque;
        this.totalItems++;
        this.totalPrice += cartItem.item.preco;
    };

    this.remove = function (id) {
        var cartItem = this.items[id]
        if (cartItem){
            if (cartItem.quantity == 1) {
                // this.totalItems -= this.items[id].quantity;
                // this.totalPrice -= this.items[id].price;
                this.items[id].quantity -= 1;
                this.totalItems -= 1;
                this.totalPrice -= this.items[id].item.preco;
                delete this.items[id];
            } else {
                this.items[id].quantity -= 1;
                this.totalItems -= 1;
                this.totalPrice -= this.items[id].item.preco;
            }
        }
    };

    this.getItems = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

};