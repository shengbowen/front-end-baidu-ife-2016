(function(){
	var $ = function(id){
		return document.getElementById(id);
	}

	var controls = $("control");
	var ul = $("wrap");

	/*事件处理程序，根据每个事件不同的operation属性，执行不同的函数*/
	var clickHandler = function(event){
		var event = event || window.event;
		var target = event.target;
		switch(target.dataset.operation){
			case "leftIn": leftIn();break;
			case "rightIn": rightIn(); break;
			case "leftOut": leftOut(); break;
			case "rightOut":rightOut();break;
		}
	}
    /*左侧入*/
	var leftIn = function(){
		var first = ul.children[0];
		var li = document.createElement("li");
		var num = $("number").value.trim();
		if(num===""||(! /^\d+$/.test(num))){
			alert("invalid input");
			return;
		}
		li.innerText = num;
		if(typeof first == "undefined"){
			ul.appendChild(li);
		}else{
			ul.insertBefore(li, first);
		}
	}
	/*右侧入函数*/
	var rightIn = function(){
		var li = document.createElement("li");
		var num = $("number").value.trim();
		if(num===""||(! /^\d+$/.test(num))){
			alert("invalid input");
			return;
		}
		li.innerText = num;
		ul.appendChild(li);
	}
	/*右侧出函数*/
	var rightOut = function(){
		if(ul.children.length > 0){
			ul.removeChild(ul.lastChild);
		}else{
			alert("no more to delete.");
			return;
		}
	}
	/*左侧出函数*/
	var leftOut = function(){
		if(ul.children.length > 0){
			ul.removeChild(ul.firstChild);
		}else{
			alert("no more to delete.");
			return;
		}
	}

	controls.addEventListener('click', function(event){
		clickHandler(event);
	});


})()