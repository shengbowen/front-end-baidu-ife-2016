function BinaryTree(node){
	this._root = node;
	this.timer = null;
	this.queue = [];
	this.last = [];
	this.spread = 300;
	this.search = [];
}

BinaryTree.prototype = {
	constructor: BinaryTree,

	deepFirst: function(current, callback){
		if(current){
			this.queue.push(current);
			if(typeof callback === "function"){
			    	callback.call(this,current);
			}
			var childs = current.children;
			for(var i=0, len=childs.length;i<len;i++){
				this.deepFirst(childs[i], callback);
			}
		}
	},

	breadFirst: function(current, callback){
		if(current){
			var q = [];
			q.push(current);
			var temp, childs;
			while(temp = q.shift()){
				this.queue.push(temp);
				if(typeof callback === "function"){
			    	callback.call(this,temp);
				}
				childs = temp.children;
				for(var i=0, len=childs.length; i<len;i++){
					q.push(childs[i]);
				}
			}
		}
	},

	changeColor: function(){
		var i = 0,
			queue = this.queue,
			spread = this.spread,
			timer = this.timer,
			search = this.search;
		clearInterval(timer);
		this.last.forEach(function(node){node.classList.remove('bg');});
		this.queue = [];
		this.search = [];
		if(queue.length>0){
			queue[0].classList.add("bg");
			timer = setInterval(function(){
				if(i == queue.length-1){
					if(search.indexOf(queue[i])<0){
						queue[i].classList.remove("bg"); //不在搜索列表中才删除背景色
					}
					clearInterval(timer);
				}else{
					i++;
					if(search.indexOf(queue[i-1])<0){
						queue[i-1].classList.remove("bg");
					}
					queue[i].classList.add("bg");
				}
			},spread);
			this.timer = timer;
		}
	}

}

var root = document.getElementsByClassName("root")[0];
var binary = new BinaryTree(root);

var spread = document.getElementById("spread");
var bfsearch = document.getElementById("bf-search");
var dfsearch = document.getElementById("df-search");
var key = document.getElementById("key");
var df = document.getElementById("df");
var bf = document.getElementById("bf");


//闭包返回查询特定关键字的函数
function check(key){
	function wrap(node){
		var childs = node.childNodes;
		for(var i=0,len=childs.length;i<len;i++){
			if(childs[i].nodeType===3){
				if(childs[i].textContent.trim() === key){
					this.search.push(node);
				}
				
			}
		}
	}
	return wrap;
}

//清除当前选中的
function reset(timer, list){

}

df.addEventListener("click", function(){
	binary.deepFirst(root);
	binary.changeColor();
});

bf.addEventListener("click", function(){
	binary.breadFirst(root);
	binary.changeColor();
});

spread.addEventListener("change", function(event){
	var sp = parseInt(event.target.value);
	binary.spread = sp;
});

dfsearch.addEventListener("click", function(){
	var k = key.value.trim();
	if(k===""){alert("请输入查询关键字");return;}
	binary.last = binary.queue;
	binary.deepFirst(root, check(k));
	binary.changeColor();
});

bfsearch.addEventListener("click", function(){
	var k = key.value.trim();
	if(k===""){ alert("请输入查询关键字");return;}
	binary.last = binary.queue;
	binary.breadFirst(root, check(k));
	binary.changeColor();
	if(binary.search.length==0){alert("the key is not found!");}
});