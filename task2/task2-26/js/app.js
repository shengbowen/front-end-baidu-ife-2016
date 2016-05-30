(function($){

	var SPEED = 1 / 60 / 5, //飞船旋转的速度，即每秒旋转的度数
	    CONSUME_RATE =  1/60/10,
	    CHARGE_RATE = 1/60/10;


	var SpaceShip = function(id, el, speed, consumeRate, chargeRate){
		this.energy = 1;
		this.id = id;
		this.speed = speed || SPEED;
		this.chargeRate = chargeRate || CHARGE_RATE;
		// this.state = "stop";
		this.consumeRate = consumeRate || CONSUME_RATE;
		this.el = el || {};
		this.engineSys = this.EngineSys();
		this.energySys = this.EnergySys();
		this.signalSys = this.SignalSys();
		this.destorySys = this.DestorySys();
		this.animation = animationUtil(el, this);
	};

	SpaceShip.prototype = {
		constructor: SpaceShip,
		//能源系统	
		EngineSys: function(){
			var curState = "stop";
			// var animation = animationUtil(this.el, this);
			var that = this;
			var states = {
				fly: function(){
					if (curState === "fly"){
						console.log("already fly");
						return;
					}else{
						if(that.energy > 0){
							that.animation.rotate(1);
							that.animation.discharge();
							curState = "fly";
						}else{
							that.animation.stop();
							curState = "stop";
						}
						
					}
				},
				stop: function(){
					if(curState === "stop"){
						console.log("already stop");
						return
					}else{
						that.animation.stop();
						curState = "stop";
					}
				}
			};
			
			var changeState = function(state){
				states[state] && states[state]();
			}

			return {
				changeState: changeState
			}
		},

		EnergySys: function(){
			var that = this;
			var charge = function(){
				if(that.energy<1){
					that.energy += that.chargeRate;
				}else{
					that.energy = 1;
				}
			};

			var discharge = function(){
				if(that.energy>0){
					that.energy -= that.consumeRate;
				}else{
					that.energy = 0;
				}
			};

			return {
				charge: charge,
				discharge: discharge
			}
		},

		SignalSys: function(){
			var that = this;
			var accept = function(signal){
				if(! $.isEmptyObject(signal)){
					if(signal.id === that.id){
						that.engineSys.changeState(signal.command);
					}
				}
			};

			return {
				accept:accept
			}
		},

		DestorySys: function(){
			var that = this;
			var destroy = function(){
				/*初始化飞船状态和样式*/
				$(that.el.ship).addClass('hide');
				$(that.el.progress).html("100%");
				$(that.el.progress).css({"background-color":"#0DE728", "width":"100%"});
				$(that.el.ship).css({"transform":"rotate(0)"});
				that.animation.clearAll();
			};

			return {
				destroy: destroy
			}
		}

	};

	var animationUtil = function(element, ship){
		var el = element;
		var frameid = null;
		var dischargeid = null;
		var chargeid = null;
		var deg = 0;
		var rotate = function(speed){
			frameid = requestAnimationFrame(function step(){
				deg += speed;
				if(deg>360){
					deg = 0;
				}
				$(el.ship).css({"transform":"rotate("+deg+"deg)"});//jquery对象
				frameid = requestAnimationFrame(step);
			});
			
		};

		var getColor = function(energy){
			if(energy>0.7){ 
				return "#0FF04E";
			}else if(energy>0.5){
				return "#E2F00F";
			}else{
				return "#F00F29";
			}
		};

		var getPercent = function(energy){
			return Math.floor(energy*100) +　"%";
		};

		var discharge = function(){
			dischargeid = requestAnimationFrame(function step(){
				if(ship.energy > 0){
					ship.energySys.discharge();
					$(el.progress).html(getPercent(ship.energy));
					$(el.progress).css({"width": getPercent(ship.energy), "background-color": getColor(ship.energy)});
					dischargeid = requestAnimationFrame(step);
				}else{
					stop();
					ship.engineSys.changeState("stop");
				}
			});
		};

		var charge = function(){
			chargeid = requestAnimationFrame(function step(){
				if(ship.energy < 1){
					ship.energySys.charge();
					$(el.progress).html(getPercent(ship.energy));
					$(el.progress).css({"width": getPercent(ship.energy), "background-color": getColor(ship.energy)});
					chargeid = requestAnimationFrame(step);
				}else{
					cancelAnimationFrame(chargeid);
				}
			});
		};

		var stop = function(){
			cancelAnimationFrame(frameid);
			cancelAnimationFrame(dischargeid);
			charge();
		};

		var clearAll = function(){
			cancelAnimationFrame(frameid);
			cancelAnimationFrame(dischargeid);
			cancelAnimationFrame(chargeid);
			ship = null;//引用置空，销毁spaceship对象
		}
		// rotate(1);
		return {
			stop: stop,
			rotate:rotate,
			discharge:discharge,
			charge:charge,
			clearAll:clearAll
		}
	};

	var consoleUtil = {
		ele: $(".console"),

		log: function(message){
			var date = new Date().toLocaleString();
			html = '<li>'+date+'  '+message+'</li>';
			this.ele.append(html);
		}
	};

	/*mediator 单例对象用来 传递消息*/
	var mediator = {
		orbits : {0: new SpaceShip(0,{ship:".orbit1 .diameter",progress: ".orbit1 .progress"})},

		element:{
			"0":{ship: ".orbit1 .diameter", progress: ".orbit1 .progress"},
			"1":{ship: ".orbit2 .diameter",progress: ".orbit2 .progress"},
			"2":{ship: ".orbit3 .diameter",progress: ".orbit3 .progress"},
			"3":{ship: ".orbit4 .diameter",progress: ".orbit4 .progress"},
		},

		isMiss:function(){
			var miss = Math.random() > 0.3 ? false : true;
			if(miss){
				consoleUtil.log("命令丢失");
			}
			return miss;
		},

		add: function(){
			var self = this;
			setTimeout(function(){
				var len = Object.keys(self.orbits).length; //获得行星数
				if(len < 4){
					for(var i=0; i<4; i++){
						if(!self.orbits[i]){
							self.orbits[i] = new SpaceShip(i, self.element[i]);
							$(self.element[i].ship).removeClass('hide');
							break;
						} 
					}
				}else{ 
					console.log("is full");
				}
				consoleUtil.log("新增命令成功！")
			},1000);	
		},

		remove: function(id){
			var self = this;
			setTimeout(function(){
				if(self.isMiss()){return;}
				self.orbits[id].destorySys.destroy();
				delete self.orbits[id];
				consoleUtil.log("销毁命令成功!");
			},1000);
		},

		send: function(message){
			var self = this;
			setTimeout(function(){
				if(self.isMiss()){return;}
				
				for(var i in self.orbits){
					self.orbits[i].signalSys.accept(message);
				}
				console.log("run");
				consoleUtil.log(message.command+"命令成功!");
			},1000);
		}
	};


	/*commander 单例对象，用来接收命令*/
	var commander = {
		mediator: mediator,
		send: function(id, cmd){
			var command = {id:id, command: cmd};
			consoleUtil.log(cmd+"命令已发送！");
			this.mediator.send(command);
		},

		add: function(){
			this.mediator.add();
			consoleUtil.log("新增命令已发送")
		},

		remove: function(id){
			this.mediator.remove(id);
			consoleUtil.log("销毁命令已发送");
		}

	}

	$(".command").on('click', function(event){
		var target = $(event.target);
		var type = target.attr('name');
		var id = target.parent().index();//获取control的索引
		console.log(id);
			switch(type){
			case "fly":
				commander.send(id, "fly");
				break;
			case "stop":
				commander.send(id, "stop"); 
				break;
			case "del":
				target.parent().addClass("hide");//隐藏该控制节点
				commander.remove(id);
				break;
			case "add":
				var controls = target.parent().find(".control"); 
				var isFull = true; //最多放置4个飞船，初始为true表示已满
				for(var i=0, len=controls.length; i<len; i++){ //按顺序遍历contorl，将隐藏的第一个control显示
					var control = $(controls[i]);
					if(control.hasClass("hide")){
						control.removeClass("hide");
						commander.add(i);
						isFull = false;//有隐藏的control表示有空余空间放置飞船
						break;
					}
				}
				if(isFull){alert("最多添加4个飞船！");}
				break;
			default:
				console.log("wrong command!");

		}
	});

})(jQuery);