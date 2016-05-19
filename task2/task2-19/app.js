
var queue = {
	data: [15,16,31,20,58,22,90,80,70,50,44,88,33],

	check: function(num){
		if(num<10 || num>100){
			alert("number must be in 10-100!");
			return false;
		}else if(this.data.length>=60){
			alert("the queue is overflow!")
			return flase;
		}else{
			return true;
		}
	},

	leftIn: function(num){

		if(this.check(num)){
			this.data.unshift(num);
			this.render();
		}	
	},

	leftOut: function(){
		if(this.data.length<1){
			alert("the queue is empty!");
			return;
		}else{
			alert(this.data.shift());
			this.render();
		}
	},

	rightIn: function(num){
		if(this.check(num)){
			this.data.push(num);
			this.render()
		}
	},

	rightOut: function(){
		if(this.data.length<1){
			alert("the queue is empty!");
			return;
		}else{
			alert(this.data.pop());
			this.render();
		}
	},

	render:function(){
		var inner = "";
		var ul = document.getElementById("wrap");
		for(var i=0,len=this.data.length; i<len; i++){
			inner += '<li style="height:'+this.data[i]+'px"></li>';
		}
		ul.innerHTML= inner;
	},

	bubbleSort: function(){
		var len=this.data.length;
		var timer;
        var that = this; //保存执行环境
		timer = setInterval(function(){
			if(len>0){
				for(var j=1; j<len; j++){
					if(that.data[j-1]>that.data[j]){

						var tmp = that.data[j-1];
						that.data[j-1] = that.data[j];
						that.data[j] = tmp;
						that.render();
					}
				}
			}else{
				clearInterval(timer);
			}
			len--;
		},1000);

		// for(; len>0; len--){
		// 	for(var j=1; j<len; j++){
		// 		if(this.data[j-1]>this.data[j]){

		// 			var tmp = this.data[j-1];
		// 			this.data[j-1] = this.data[j];
		// 			this.data[j] = tmp;
		// 			this.render();
					
		// 		}
		// 	}
		// }
	}

};

function addEvent(ele,type,handler){
	if(ele.addEventListener){
		ele.addEventListener(type, handler);
	}else if(ele.attachEvent){
		ele.attachEvent('on'+type, handler);
	}else{
		ele["on"+type] = handler;
	}
}

/*事件处理程序，根据每个事件不同的operation属性，执行不同的函数*/
	var clickHandler = function(event, num){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		switch(target.dataset.operation){
			case "leftIn": 
				if(num===""||(! /^\d+$/.test(num))){
					alert("invalid input");
					return;
				}
				queue.leftIn(parseInt(num));
				break;
			case "rightIn": 
			    if(num===""||(! /^\d+$/.test(num))){
					alert("invalid input");
					return;
				}
			    queue.rightIn(parseInt(num)); 
			    break;
			case "leftOut": queue.leftOut(); break;
			case "rightOut": queue.rightOut();break;
			case "bubbleSort":
				queue.bubbleSort();
				break;
		}
	};

window.onload = function(){
	queue.render();
	var controls = document.getElementById("control");
	addEvent(controls, 'click', function(event){
		var num = document.getElementById("number").value.trim();
		clickHandler(event, num);
	});
};
