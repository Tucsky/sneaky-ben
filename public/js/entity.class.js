// Classe mère 
var entity = Class.create({ 
	this.attribut = attribut1;
	methodeA : function() {
		// code
	}
 
	methodeB : function() {
		// code
	}	
});

var entity = function(step, position) {
	this.html = $(#game).append("<div></div>");
    this.step = step;
    this.position = position;
	this.html.width(step);
	this.html.height(step);
	this.html.css("background-color", "red");
}

entity.prototype = {
    move: function(direction) {
    	switch(direction) {
    		case 37:
    			this.html.animate({left: this.step}, 200);
    			break;
    		case 38:
    			this.html.animate({up: this.step}, 200);
    			break;
    		case 39:
    			this.html.animate({right: this.step}, 200);
    			break;
    		case 40:
    			this.html.animate({down: this.step}, 200);
    			break;
		    default:
		      	return;
    	}

    	$(document).keydown(function(e){
  })
    }
}