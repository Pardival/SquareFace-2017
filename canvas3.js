
var canvas = document.getElementById('lol');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c = canvas.getContext('2d');

function game(){
	name = document.getElementById('pseudo').value;
	console.log(name);
	chronometer = document.getElementById('time_show');
	chronometer.style.display = 'block';
	menu = document.getElementById('content_info');
	menu.style.display = "none";
	var ob = [];
	var nb_obs = 0;
	var time = 0;

	function seconde(){
		time++;
		chronometer.innerHTML = time;
	}
	setInterval(seconde,1000);

	function snake(){
		var nb_move_x = 5;
		var nb_move_y = 0;
		var x = 10;
		var y = 10;
		var x_const ;
		var y_const ;
		this.draw_snake = function(){
			c.beginPath();
			c.rect(x,y,15,15);
			c.fillStyle = '#00ffea';
			c.fill();
		}

			addEventListener('keydown',function(event){
				if(x !== x_const){
					if(event.key === "ArrowUp"){
					 nb_move_y = -5;
					 nb_move_x = 0;
					 x_const = x;
					}

					if(event.key === "ArrowDown"){
					 nb_move_y = 5;
					 nb_move_x = 0;
					 x_const = x ;
					}
				}

				if(y !== y_const){
					if(event.key === "ArrowLeft"){
						 nb_move_x = -5;
						 nb_move_y = 0;
						 y_const = y ;
					}

					if(event.key === "ArrowRight"){
						 nb_move_x = 5;
						 nb_move_y = 0;
						 y_const = y ;
					}
				}
			});

			this.moving = function(){
				 x = x + nb_move_x;
				 y = y + nb_move_y;
				this.nb_move_x = nb_move_x;
				this.nb_move_y = nb_move_y;
				this.x = x;
				this.y = y;
				this.draw_snake();
			}

			this.gameover = function(){
				if(x < 0 || y <0 || x+15 > window.innerWidth ||y+15 > window.innerHeight){
					x = 10;
					y = 0;
					nb_move_x = 5;
					nb_move_y = 0;
				}
			}

			this.reset = function(){
				x = 0;
				y = 0;
				nb_move_x = 5;
				nb_move_y = 0;
			}
	}

	function obstacle(x,y){
		this.x = x;
		this.y = y;

		this.obs = function(){
			c.beginPath();
			c.rect(this.x,this.y,15,15);
			c.fillStyle = '#ffc619';
			c.fill();
		}

	}

	function creat_obs(){
		var rand_x = Math.floor(Math.random()*window.innerWidth-1);
		var rand_y = Math.floor(Math.random()*window.innerHeight-1);
		nb_obs ++;
		ob.push(new obstacle(rand_x,rand_y));
	}

	s = new snake();
	setInterval(creat_obs,500);

	var gate = [];
	var nb_gate = 0;
	function make_gate(x,y){
		this.x = x;
		this.y = y;

		this.gate = function(){
			c.beginPath();
			c.rect(x,y,15,15);
			c.fillStyle = '#e62739';
			c.fill();
		}
	}

	function creat_gate(){
		var rd_nb = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
		if(rd_nb == 1){
			var rdm_x = Math.floor(Math.random()*window.innerWidth-1);
			var y = 0;
			nb_gate++;
			gate.push(new make_gate(rdm_x,y));
		}

		if(rd_nb == 1){
			var rdm_x = Math.floor(Math.random()*window.innerWidth-1);
			var y = window.innerHeight -15;
			nb_gate++;
			gate.push(new make_gate(rdm_x,y));
		}

		if(rd_nb == 3){
			var rdm_y = Math.floor(Math.random()*window.innerHeight-1);
			var x = 0;
			nb_gate++;
			gate.push(new make_gate(x,rdm_y));
		}

		if(rd_nb == 4){
			var rdm_y = Math.floor(Math.random()*window.innerHeight-1);
			var x = window.innerWidth -15;
			nb_gate++;
			gate.push(new make_gate(x,rdm_y));
		}
	}

	setInterval(creat_gate,80000);

	function move(){
		window.requestAnimationFrame(move);
		c.clearRect(0,0,window.innerWidth,window.innerWidth);
		s.moving();
		s.gameover();
		for(var i = 0; i<nb_obs; i++){
			ob[i].obs();
		}

		for(var e =0; e<nb_obs; e++){
			var soustract_x = s.x ;
			var soustract_y = s.y ;
			var obx = ob[e].x + 15;
			var oby = ob[e].y + 15;
			if((soustract_x +15 > ob[e].x && soustract_x < obx )&& (soustract_y+15 > ob[e].y && soustract_y < oby)){
				var time_save = time;
				$(document).ready(function(){
					$.post("function.php", {name: name, time: time_save},function(data){console.log(data);});
				});
				ob = [];
				gate = [];
				nb_obs = 0;
				nb_gate = 0;
				time = 0;	
			}
		}

		for(var a=0; a<nb_gate; a++){
			gate[a].gate();
		}

		for(var a =0; a<nb_gate; a++){
			var soustract_x = s.x ;
			var soustract_y = s.y ;
			var gatex = gate[a].x + 15;
			var gatey = gate[a].y + 15;
			if((soustract_x +15 > gate[a].x && soustract_x < gatex )&& (soustract_y+15 > gate[a].y && soustract_y < gatey)){
				gate = [];
				ob = [];
				nb_obs = 0;
				nb_gate = 0;
				s.reset();
			}
		}

		if(s.x < 0 || s.y <0 || s.x+15 > window.innerWidth ||s.y+15 > window.innerHeight){
			var time_save = time;
			$(document).ready(function(){
				$.post("function.php", {name: name, time: time_save},function(data){console.log(data);});
			});
			ob = [];
			gate = [];
			nb_obs = 0;
			nb_gate = 0;
			time = 0;
			
		}
	}
	move();
	
}

