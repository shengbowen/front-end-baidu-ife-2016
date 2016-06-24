(function(){
	var $ = function(id){
		return document.getElementById(id);
	}

	var controls = $("control");
	var ul = $("wrap");
	var searchstr = $("searchstr");
	var inputs = $("inputs");

	var regx = /[\t,\s，、\r　]+/; //正则表达式匹配分隔符
	var data = [];

	/*事件处理程序，根据每个事件不同的operation属性，执行不同的函数*/
	var clickHandler = function(event){
		var event = event || window.event;
		var target = event.target;
		switch(target.dataset.operation){
			case "insert": insert();break;
			case "search": search(); break;
			case "leftOut": leftOut(); break;
			case "rightOut":rightOut();break;
		}
	}
   	
   	function insert(){
   		data = inputs.value.trim().split(regx);
   		var inner = "";
   		for(var i=0; i<data.length; i++){
   			inner += "<li>"+ data[i]+"</li>";
   		}
   		ul.innerHTML=inner;
   	}
 	
 	function search(){
 		var str = searchstr.value;
 		var nodes = ul.children;
 		for(var i=0; i<data.length;i++){
 			if(data[i].indexOf(str)!==-1){
 				nodes[i].classList.add("highlight");
 			}
 		}
 	}

	controls.addEventListener('click', function(event){
		clickHandler(event);
	});


})()