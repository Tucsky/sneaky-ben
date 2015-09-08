function random_num(min, max, i) {
	var nb = (Math.random() * (min - max) + max);
	return i ? parseInt(nb) : parseFloat(nb);
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

window.requestAnimFrame = function() {
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};


function random_str(l, c) {
    if (!c) { c = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
    var r = '';
    for (var i = l; i > 0; --i) r += c[Math.round(Math.random() * (c.length - 1))];
    return r;
}
