module.exports = function Favorito(lista) {
    this.items = lista.items || {};

    this.add = function (item, id) {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = { item: item };
        }

    };

    this.remove = function (id) {
        delete this.items[id];
    };

    this.getItems = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

};