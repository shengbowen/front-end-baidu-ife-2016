var data = [
	{
		text:'河南',
		value:'henan',
		list:[
			{
				text: '信阳',
				value: 'xinyang',
				list:[]
			},
			{
				text: '郑州',
				value: 'zhengzhou',
				list:[]
			}
		]
	},

	{
		text:'湖北',
		value:'hubei',
		list:[
			{
				text: '武汉',
				value: 'wuhan',
				list:[]
			},
			{
				text: '红安',
				value: 'hongan',
				list:[]
			}
		]
	},

	{
		text:'广东',
		value:'guangzhou',
		list:[
			{
				text: '广州',
				value: 'guangzhou',
				list:[]
			},
			{
				text: '东莞',
				value: 'dongguan',
				list:[]
			}
		]
	}

]


var ul = document.getElementById("first");

// ul.addEventListener("click", function(event){
// 	var target = event.target;
// 	var childs = target.children;
// 	for(var i=0; i<childs.length;i++){
// 		if(childs[i].tagName === "UL"){
// 			childs[i].classList.toggle("show");
// 		}
// 	}
// });

function TreeView(root, options){
	this._root = root;
	this.options = options;
	this.btns = '<i class="add">+</i> <i class="remove">-</i>';

	this.init(this.breadFirst);
}

TreeView.prototype = {

	constructor: TreeView,

	breadFirst: function(callback){
		(function(root){
			if(root){
				var q = [];
				q.push(root);
				var temp, childs;
				while(temp = q.shift()){
					// this.queue.push(temp);
					if(typeof callback === "function"){
				    	callback(temp);
					}
					childs = temp.children;
					for(var i=0, len=childs.length; i<len;i++){
						q.push(childs[i]);
					}
				}
			}
		})(this._root);
		
	},

	init: function(traversal){
		var btns = this.btns;
		function addClass(node){
			if(hasUlLevel(node)){
				node.classList.add("arrow");
			}
			if(node.tagName === "LI"){
				var first = node.children[0];
				var next = first.nextElementSibling;
				var btnGroup = document.createElement("span");
				btnGroup.innerHTML = btns;
				if(next){
					node.insertBefore(btnGroup, next);
				}else{
					node.appendChild(btnGroup);
				}
			}
		}

		traversal.call(this, addClass);

		this._root.addEventListener("click", this.showHandler);
		this._root.addEventListener("click", this.removeHandler);
		this._root.addEventListener("click", this.addHandler);
	},

	showHandler:function(event){
		var target = event.target;
		if(target.tagName === "A"){
			var parent = target.parentElement;
			var childs = parent.children;
			for(var i=0; i<childs.length;i++){
				if(childs[i].tagName === "LI"){
					if(hasUlLevel(childs[i])){
						var ul = childs[i].getElementsByTagName("ul")[0]
						ul.classList.toggle("show");
					}
					// childs[i].classList.toggle("show");
				}
			}
		}
		// var childs = target.children;
		
	},

	removeHandler:function(event){
		var target = event.target;
		 //如果是删除标签触发事件
		if(target.className.indexOf("remove")>=0){
			var ul = getClosest(target, "UL");
			var li = getClosest(target, "LI");
			ul.removeChild(li);
		}
	},

	addHandler:function(event){
		var target = event.target;
		if(target.className.indexOf("add")>=0){
			var content = prompt("请输入添加的内容","新节点");
			var li = getClosest(target, "LI");
			if(content!="" && content!=null){
				var ul = getUlElement(li);
				var node = document.createElement("li");
				node.innerHTML = '<a>'+content+'</a>'+'<i class="add">+</i> <i class="remove">-</i>';
				ul.appendChild(node);
			}
		}
	}


}

function hasUlLevel(node){
	var childs = node.children;
	for(var i=0, len=childs.length; i<len; i++){
		if(childs[i].tagName === "UL"){
			return true;
		}
	}
	return false;
}

function getClosest(node, tagName){ //获取离当前节点最近的相应tagname的父节点
	var parent = node.parentElement;
	while(parent){
		if(parent.tagName === tagName){
			return parent;
		}
		parent = parent.parentElement;
	}
}

function getUlElement(node){
	var childs = node.children;
	for(var i=0,len=childs.length; i<len; i++){
		if(childs[i].tagName === "UL"){
			return childs[i];
		}
	}
	var ul = document.createElement("ul");
	node.appendChild(ul);
	return ul;
}

var first = document.getElementById("first");
var tree  = new TreeView(first);