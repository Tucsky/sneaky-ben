(function() {
	var that = this;

	that.music = document.getElementById('audio');

	that.muted = $.cookie('muted') ? true : false;
	that.nickname = $.cookie('nickname');
	that.frames++;
	that.started = false;
	that.overlay = false;
	that.startedAt = 0;

	that.cell = 20;
	that.width = 0;
	that.height = 0;

	that.$container = null;
	that.$entities = null;

	that.uid = null;

	that.scene = {
		length: 10,
		types: ['tree', 'stone']
	}

	that.directions = [
		{x: -1, y: 0, direction: 'left'},
		{x: 0, y: 1, direction: 'bottom'},
		{x: 1, y: 0, direction: 'right'},
		{x: 0, y: -1, direction: 'top'}
	];

	that.lastdirection = 3;
	that.direction = 3;

	that.anaconda = null;
	that.victim = null;

	that.init = function() {
		that.muted && $('#music').addClass('disabled');

		that.$container = $('#game');
		that.$entities = that.$container.find('#entities');

		that.prepare();

		that.controls();

		if (!$.cookie('unique'))
			$.cookie('unique', random_str(16), {path: '/', expires: 365 * 10});

		that.uid = $.cookie('unique')

		return that;
	}

	that.controls = function() {
		that.$container.on('click', function(e) {
			if (!that.started)
				that.startGame();
		});

		that.$container.find('.overlay').on('click', function(e) {
			e.stopPropagation();
		});

		$('.replay').on('click', function() {
			if (that.started) return;

			window.location.reload();
		});

		$('#music').on('click', function() {
			that.muted = !that.muted;
			if (that.muted)
				that.music.pause(),
				$(this).addClass('disabled');
			else {
				$(this).removeClass('disabled');
				if (that.started) that.music.play();
			}
			$.cookie('muted', that.muted ? 1 : 0, {path: '/', expires: 365 * 10});
		});

		// Share
		$("a.share-facebook").on("click",function(e){
			e.preventDefault();
			window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent('http://sneakyben.fr/'),"","status=0,toolbar=0,height=250,width=600");
		});
		$("a.share-twitter").on("click",function(e){
			e.preventDefault();
			var lose = 'I just got rekt, in approximately '+(that.score / 1000)+' seconds. Can you do better? #SneakyBen #iim bit.ly/1Dc7Mg9';
			var win = 'I did it in '+(that.score / 1000)+' seconds! Can you do better? #SneakyBen #iim bit.ly/1Dc7Mg9';
			var context = $(this).closest('.overlay').attr('id');
			window.open("https://twitter.com/home?status="+encodeURIComponent(context == 'win' ? win : lose),"","status=0,toolbar=0,height=250,width=600")
			console.log('test');
			return false;
		});
		$('a.share-google').on("click", function(e) {
			e.preventDefault();
			window.open("https://plus.google.com/share?url="+encodeURIComponent('http://sneakyben.fr/'),"","status=0,toolbar=0,height=500,width=520");
		});
		$('a.share-pinterest').on("click", function(e) {
			e.preventDefault();
			alert('do people actually use that thing ?');
		});

		that.dom = setInterval(function() {
			$('[data-ago]').each(function() {
				$(this).html(moment.utc($(this).data('ago')).fromNow());
			});
		}, 5000);

		$(window).keydown(function(e) {
			switch(e.which) {
				case 37:
					that.direction != 2 && (that.direction = 0);
					e.preventDefault();
				break;

				case 38:
					that.direction != 1 && (that.direction = 3);
					e.preventDefault();
				break;

				case 39:
					that.direction != 0 && (that.direction = 2);
					e.preventDefault();
				break;

				case 40:
					that.direction != 3 && (that.direction = 1);
					e.preventDefault();
				break;
			}

			if (!that.started && !that.overlay)
				that.startGame();
		});

		return that;
	}

	that.startGame = function() {
		that.$container.removeClass('waiting win lose intensify').addClass('started');

		that.frames = 0;
		that.started = true;
		that.startedAt = +new Date();
		requestAnimFrame(that.render);
		that.interval = setInterval(that.render, 60);
		!that.muted && that.music.play();

		$('html, body').animate({
			scrollTop: $("#game").offset().top - 15
		}, 500);
	}

	that.endGame = function() {
		that.started = false;
		clearInterval(that.interval);
		that.$container.removeClass('started');
		that.music.pause();
		that.music.currentTime = 0;
	}

	that.prepare = function() {
		if (that.started) return;

		that.builtContainer();

		that.anaconda = new that.Anaconda();

		that.generateScenery();

		that.victim = new that.Victim();
	}

	that.win = function() {
		if (!that.started) return;
		that.endGame();
		that.$container.addClass('win');
		that.score = +new Date() - that.startedAt;
		that.overlay = true;
		$('#win').show();
		$({v: 0}).animate({v: that.score/1000}, {
			duration: 2000,
			easing: 'easeOutExpo',
			step: function () {
				$('#win .score').text(this.v.toFixed(2));
			},
			complete: function() {
				$('#win .score').text((that.score/1000).toFixed(2));
			}
		});
		$('#win video').get(0).play();

		if (!that.nickname) {
			var nickname = prompt("Holy moley ! you just got an highscore... can you belive it?!", "Your nickname goes here");
			if (nickname != null) {
				$.cookie('nickname', nickname, {path: '/', expires: 365 * 10});
				that.nickname = $.cookie('nickname');
			} else {
				alert('No highscore for you sir')
			}
		}

		if (that.nickname)
			that.share(that.score);
	}

	that.lose = function() {
		if (!that.started) return;
		that.endGame();
		that.overlay = true;
		that.$container.addClass('intensify');
		setTimeout(function() {
			that.$container.addClass('lose');
			that.score = +new Date() - that.startedAt;
			$('#lose').show();
			$({v: 0}).animate({v: that.score/1000}, {
				duration: 2000,
				easing: 'easeOutExpo',
				step: function() {
					$('#lose .score').text(this.v.toFixed(2));
				},
				complete: function() {
					$('#lose .score').text((that.score/1000).toFixed(2));
				}
			});
			$('#lose video').get(0).play();
		}, 3000);
	}

	that.share = function(score) {
		$.ajax({
			data: {score: score, nickname: that.nickname},
			type: 'post',
			url: './score'
		}).done(function(data) {
			/*if (!data.success && data.error)
				alert(data.error);
			else if (!data.error)
				alert('Something\'s wrong');*/
		});
	}

	that.builtContainer = function() {
		that.$entities.html('');

		that.$container.css({width:'auto'});
		that.width = Math.floor(Math.max(320, that.$container.width()) / that.cell);
		that.height = Math.floor((Math.max(420, $(window).height()) - 15) / that.cell);

		that.$container.width(that.width * that.cell);
		that.$container.height(that.height * that.cell);

		that.entities = [];
		for (var x=0; x<that.width; x++) {
			that.entities[x] = [];
			for (var y=0; y<that.height; y++) {
				that.entities[x][y] = null;
			}
		}
	}

	that.generateScenery = function() {
		var surface = that.width * that.height;

		var trees = random_num(2, surface / 20, true);
		var walls = random_num(2, surface / 50, true);

		var sprites = ['tree1', 'tree2', 'bush1', 'bush2', 'cactus1', 'cactus2'];

		for (var i=0; i<trees; i++) {
			var coordinates = that.getEmpty();
			new that.Entity({
				x: coordinates.x,
				y: coordinates.y,
				style: {
					'zIndex': coordinates.y * 100 + coordinates.x
				},
				name: 'tree',
				class: sprites[Math.floor(Math.random()*sprites.length)]+(Math.random() > .5 ? ' flipped':'')
			});
		}

		for (var i=0; i<walls; i++) {
			var coordinates = that.getEmpty();
			new that.Entity({
				x: coordinates.x,
				y: coordinates.y,
				style: {
					'zIndex': coordinates.y * 100 + coordinates.x
				},
				name: 'stone',
				class: Math.random() > .5 ? 'flipped':null
			});
			for (var w=0; w<random_num(0, 30); w++) {
				var nearest = that.getNearest(coordinates.x, coordinates.y);
				if (!nearest) break;

				new that.Entity({
					x: nearest.x,
					y: nearest.y,
					style: {
						'zIndex': nearest.y * 100 + nearest.x
					},
					name: 'stone',
					class: Math.random() > .5 ? 'flipped':null
				});

				coordinates = nearest;
			}
		}
	}

	that.getValue = function(x, y) {
		return x >= 0 && y >= 0 && typeof that.entities[x] !== 'undefined' && typeof that.entities[x][y] !== 'undefined' && that.entities[x][y];
	}

	that.getEmpty = function() {
		var x = null,
			y = null,
			i = 0;
		
		while (x == null && y == null || that.entities[x][y] !== null) {
			if (++i === that.width * that.height) break;
			x = random_num(0, that.width - 1, true);
			y = random_num(0, that.height - 1, true);
		}

		return i === that.width * that.height ? null : {x: x, y: y};
	}

	that.getNearest = function(x, y, except, order, nope) {
		var nope = nope || [];
		var origin = {
				x: x,
				y: y
			},
			attempt = {};

		var directions = order ? order : shuffle(that.directions.slice());

		for (var i = 0; i<4; i++) {
			attempt.x = origin.x + directions[i].x;
			attempt.y = origin.y + directions[i].y;
			attempt.direction = directions[i].direction;

			if (except && attempt.direction === except) {
				continue;
			}
			if (that.getValue(attempt.x, attempt.y) !== false && that.entities[attempt.x][attempt.y] === null && !nope[attempt.x+'-'+attempt.y]) return attempt;
		}

		return false;
	}

	that.Entity = function(options) { 
		var entity = this;

		entity.x = options.x; 
		entity.y = options.y; 

		entity.name = options.name || null; 
		entity.container = options.container || null; 
		entity.$class = options.class || null; 
		entity.$cell = null; 
		entity.$sprite = options.sprite || null; 
		entity.style = options.style || null; 

		entity.init = function() {
			if (typeof options.x === 'undefined' || typeof options.y === 'undefined') {
				var coordinates = that.getEmpty();
				entity.x = coordinates.x;
				entity.y = coordinates.y;
			}

			if (entity.container && !that.$entities.find('.group.'+entity.container).length) {
				that.$entities.append($('<div/>', {class: 'group '+entity.container}));
			}

			entity.$cell = $('<div/>', {
				class: 'entity'+(entity.name ? ' '+entity.name : '')+(entity.$class ? ' '+entity.$class : '')
			}).html($('<div/>', {
				class: 'sprite'
			}).html(entity.$sprite ? entity.$sprite : '')).css({
				top: entity.y * that.cell,
				left: entity.x * that.cell,
				width: that.cell,
				height: that.cell
			});

			if (entity.style)
				entity.$cell.css(entity.style);

			entity.$sprite = entity.$cell.find('.sprite');
			that.entities[entity.x][entity.y] = entity;

			if (entity.container) 
				that.$entities.find('.group.'+entity.container).append(entity.$cell);
			else
				that.$entities.append(entity.$cell);

			return entity;
		}

		entity.move = function(x, y) {
			if (typeof x === 'undefined' || typeof y === 'undefined' || that.getValue(x, y) === false) return;

			that.entities[entity.x][entity.y] = null;

			entity.x = x; 
			entity.y = y; 

			that.entities[entity.x][entity.y] = entity;

			entity.$cell.css({
				top: entity.y * that.cell, 
				left: entity.x * that.cell,
				zIndex: (entity.y * 100 + 50) + entity.x
			});
			//entity.$cell.animate({top: entity.y * that.cell, left: entity.x * that.cell}, 50, 'linear');
		}

		entity.remove = function() {
			entity.$cell.remove();
			that.entities[entity.x][entity.y] = null;
			delete entity;
		}

		return entity.init();
	};

	that.Victim = function(options) {
		var victim = this;

		victim.entity = null;
		victim.nope = [];

		victim.init = function() {
			var coordinates = {
				x: random_num((that.width / 3)* 2, that.width, true),
				y: random_num(0, that.height, true)
			};

			victim.entity = new that.Entity({
				x: coordinates.x,
				y: coordinates.y,
				name: 'victim',
				class: 'stickman'
			});

			return victim;
		}

		victim.move = function() {
			var anaconda = that.anaconda.parts[0];

			var remaining = [0,1,2,3],
				order = [];

			var offset = {
				x: Math.abs(anaconda.x - victim.entity.x),
				y: Math.abs(anaconda.y - victim.entity.y)
			}

			var distance = Math.sqrt(Math.pow((anaconda.x-victim.entity.x), 2) + Math.pow((anaconda.y-victim.entity.y), 2));

			var distances = [];

			distances.push({
				direction: 0, 
				distance: Math.sqrt(Math.pow(anaconda.x-(victim.entity.x - 1), 2) + Math.pow(anaconda.y-victim.entity.y, 2))
			});
			distances.push({
				direction: 1, 
				distance: Math.sqrt(Math.pow(anaconda.x-victim.entity.x, 2) + Math.pow((anaconda.y-(victim.entity.y + 1)), 2))
			});
			distances.push({
				direction: 2, 
				distance: Math.sqrt(Math.pow(anaconda.x-(victim.entity.x + 1), 2) + Math.pow((anaconda.y-victim.entity.y), 2))
			});
			distances.push({
				direction: 3, 
				distance: Math.sqrt(Math.pow(anaconda.x-victim.entity.x, 2) + Math.pow((anaconda.y-(victim.entity.y - 1)), 2))
			});

			distances.sort(function(a, b) {
				return b.distance - a.distance;
			});

			var directions = [];
			distances.forEach(function(el) {
				directions.push(that.directions[el.direction]);
			});

			var coordinates = that.getNearest(victim.entity.x, victim.entity.y, null, directions, victim.nope);

			if (that.isCulDeSac(coordinates.x, coordinates.y, victim.nope, ['anaconda']))
				victim.nope[coordinates.x+'-'+coordinates.y] = true;

			victim.entity.move(coordinates.x, coordinates.y);
		}

		return victim.init();
	}

	that.isCulDeSac = function(x, y, nope, except) {
		var except = except || [];
		var nope = nope || [];
		var out = 4;
		var possibilities = [
			{x: x + 1, y: y},
			{x: x - 1, y: y},
			{x: x, y: y + 1},
			{x: x, y: y - 1}
		];

		for (var i = 0; i < possibilities.length; i++) {
			var value = that.getValue(possibilities[i].x, possibilities[i].y);
			if (nope[possibilities[i].x+'-'+possibilities[i].y] || value === false || (value !== null && typeof value === 'object' && except.indexOf(value.name) == -1)) out--;
		}

		return (out < 1);
	}

	that.Anaconda = function(options) {
		var anaconda = this;

		anaconda.parts = [];
		anaconda.length = 6;

		anaconda.init = function() {
			var coordinates = {
				x: random_num(0, that.width / 3, true),
				y: random_num((that.height / 3)* 2, that.height, true)
			};

			for (var i=0; i<anaconda.length; i++) {
				//coordinates = coordinates ? that.getNearest(coordinates.x, coordinates.y, 'top') : that.getEmpty();
				anaconda.parts.push(new that.Entity({
					name: 'anaconda',
					container: 'anaconda',
					class: 'stickman '+(i == 0 ? 'head' : (i == anaconda.length - 1 ? 'butt' : 'segment')),
					x: coordinates.x,
					y: coordinates.y
				}));
			}

			return anaconda;
		}

		anaconda.move = function() {
			var last = null;
			for (var i=0; i<anaconda.parts.length; i++) {
				var entity = anaconda.parts[i];

				if (i == 0) {
					last = {x: entity.x, y: entity.y};
					var x = entity.x + that.directions[that.direction].x;
					var y = entity.y + that.directions[that.direction].y;
					entity.direction = that.getDirection(last, {x: x, y: y});
					if (i == 0 && that.getValue(x, y) === null) {
						entity.$cell.attr('lookat', that.direction),
						entity.move(x, y);
						that.lastdirection = that.direction;
					}else {
						var v = that.getValue(x, y);

						if (typeof v === 'object' && v.name && v.name == 'victim') {
							that.win();
						} else {
							that.direction = that.lastdirection;
						}

						break;
					}
				} else {
					var temp = {x: last.x, y: last.y};
					last = {x: entity.x, y: entity.y};
					entity.direction = that.getDirection(last, temp);
					entity.move(temp.x, temp.y);
				}
			}

			for (var i=0; i<anaconda.parts.length; i++) {
				var entity = anaconda.parts[i];

				var direction = '';

				direction += entity.direction;
				if (anaconda.parts[i-1] && anaconda.parts[i-1].direction != entity.direction)
					direction += anaconda.parts[i-1].direction;

				if (i == anaconda.parts.length - 1 && anaconda.parts[i-1] && anaconda.parts[i-1].direction != entity.direction)
					direction = anaconda.parts[i-1].direction;

				entity.$cell.attr('lookat', direction);
			}

			if (that.isCulDeSac(anaconda.parts[0].x,anaconda.parts[0].y, null, ['victim']))
				that.lose();
		}

		return anaconda.init();
	}

	that.getDirection = function(from, to) {
		if (from.x > to.x) {
			return 'left';
		} else if (from.x < to.x) {
			return 'right';
		} else {
			if (from.y < to.y) {
				return 'bottom';
			} else if (from.y > to.y) {
				return 'top';
			}
		}
	}

	that.render = function(t) {
		if (!that.started) return;
		that.frames++;

		that.victim.move();
		that.anaconda.move();
	}

	return that.init();
})();