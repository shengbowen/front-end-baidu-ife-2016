function BinaryTree(node){
	this._root = node;
	this.timer = null;
	this.queue = [];
	this.spread = 300;
}

BinaryTree.prototype = {
	constructor: BinaryTree,

	inOrder: function(current, callback){
		if(current){
				
				this.inOrder(current.firstElementChild);
				if(typeof callback === "function"){
			    	callback(current);
			    }
			    this.queue.push(current);
			    this.inOrder(current.lastElementChild);
			}
	},

	preOrder: function(current, callback){
		if(current){
			if(typeof callback === "function"){
		    	callback(current);
		    }
		    this.queue.push(current);
			this.preOrder(current.firstElementChild);
		    this.preOrder(current.lastElementChild);
		}
	},

	postOrder: function(current, callback){
		if(current){
				this.postOrder(current.firstElementChild);
			    this.postOrder(current.lastElementChild);
			    if(typeof callback === "function"){
			    	callback(current);
			    }
			    this.queue.push(current);
			}
	},

	deepFirst: function(current, callback){
		if(current){
			this.queue.push(current);
			if(typeof callback === "function"){
			    	callback(current);
			}
			this.deepFirst(current.firstElementChild);
			this.deepFirst(current.lastElementChild);
		}
	},

	breadFirst: function(current, callback){
		if(current){
			var q = [];
			q.push(current);
			var temp, childs;
			while(temp = q.shift()){
				this.queue.push(temp);
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
			timer = this.timer;
		clearInterval(timer);
		this.queue = [];
		if(queue.length>0){
			queue[0].classList.add("bg");
			timer = setInterval(function(){
				if(i == queue.length-1){
					queue[i].classList.remove("bg");
					clearInterval(timer);
				}else{
					i++;
					queue[i-1].classList.remove("bg");
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
var pre = document.getElementById("pre");
var mid = document.getElementById("in");
var post = document.getElementById("post");
var df = document.getElementById("df");
var bf = document.getElementById("bf");


pre.addEventListener("click", function(){
	binary.preOrder(root);
	binary.changeColor();
});

mid.addEventListener("click", function(){
	binary.inOrder(root);
	binary.changeColor();
});

post.addEventListener("click", function(){
	binary.postOrder(root);
	binary.changeColor();
});

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