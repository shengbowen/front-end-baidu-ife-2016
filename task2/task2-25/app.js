/*用来渲染列表的数据*/
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
				list:[
					{text:'武昌区',value:"wuchang", list:[]},
					{text:'江夏区',value:"jiangxia", list:[]},
				]
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
				list:[
					{text:'荔湾区',value:"liwan", list:[]},
					{text:'天河区',value:"tianhe", list:[]},

				]
			},
			{
				text: '东莞',
				value: 'dongguan',
				list:[]
			}
		]
	}

]







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
	/*初始化函数， 用来为列表添加样式 和 新增删除按钮*/
	init: function(traversal){
		var btns = this.btns;
		function addClass(node){
			if(hasUlLevel(node)){
				node.classList.add("arrow");//<li>元素添加箭头
				node.children[0].classList.add("expand");//<a>元素添加可展开样式
			}
			if(node.tagName === "LI"){
				var first = node.children[0]; //a元素
				var btnGroup = document.createElement("span");
				btnGroup.innerHTML = btns;
				if(first){
					first.appendChild(btnGroup);
				}
			}
		}

		traversal.call(this, addClass);

		this._root.addEventListener("click", this.showHandler);
		this._root.addEventListener("click", this.removeHandler);
		this._root.addEventListener("click", this.addHandler);
	},

	/*展开和收缩列表处理函数*/
	showHandler:function(event){
		var target = event.target;
		if(target.tagName === "A"){
			var ul = target.nextElementSibling; //获取a元素后的ul元素
			var li = getClosest(target, "LI");
			if(ul){
				ul.classList.toggle("show");
				li.classList.toggle("down_arrow");
			}
		}		
	},

	/*删除节点*/
	removeHandler:function(event){
		var target = event.target;
		 //如果是删除标签触发事件
		if(target.className.indexOf("remove")>=0){
			var ul = getClosest(target, "UL");
			var li = getClosest(target, "LI");
			ul.removeChild(li);
		}
	},

	/*新增节点的时间处理函数*/
	addHandler:function(event){
		var target = event.target;
		if(target.className.indexOf("add")>=0){//点击的是add元素
			var content = prompt("请输入添加的内容","新节点");
			var li = getClosest(target, "LI");
			if(content!="" && content!=null){
				var ul = getUlElement(li);  //获取新节点要插入的父节点
				var node = document.createElement("li");
				node.innerHTML = '<a>'+content+'<span><i class="add">+</i> <i class="remove">-</i></span></a>';
				ul.appendChild(node);
				li.classList.add("arrow"); //对能展开的li（即包含ul子元素）标签添加箭头
				li.children[0].classList.add("expand"); //对li标签文字添加效果
			}
		}
	},
    
    /*按关键字搜索相应节点，通过回调函数给符合节点进行相应操作*/
	search: function(key, traversal){

		function callback(node){
			var text = getLiContent(node);
			if(text === key){//当前节点的文本与关键字相同
				node.firstElementChild.classList.add("highlight");//相应li标签的a标签高亮
				expandParents(node);
			}
		}
		traversal.call(this, callback);
	}


}

//逐级搜索父元素，遇到没有展开的ul元素进行展开
function expandParents(node){
	var ul = getClosest(node, "UL");
	while(ul){
		ul.classList.add("show");
		var li = getClosest(ul, "LI");
		if(li){
			li.classList.add("down_arrow");
		}
		ul = getClosest(ul, "UL");
	}
}

/*获取li 节点下a元素的 文字内容*/
function getLiContent(node){
	if(node.tagName==="LI"){
		return node.getElementsByTagName("a")[0].childNodes[0].textContent;
	}
}

/*查看看子元素是否含有ul*/
function hasUlLevel(node){
	var childs = node.children;
	for(var i=0, len=childs.length; i<len; i++){
		if(childs[i].tagName === "UL"){
			return true;
		}
	}
	return false;
}

/*向上搜索，获取离当前节点最近的相应tagname的父节点*/
function getClosest(node, tagName){ 
	var parent = node.parentElement;
	while(parent){
		if(parent.tagName === tagName){
			return parent;
		}
		parent = parent.parentElement;
	}
}

/*新增节点是，获取要添加到的ul元素*/
function getUlElement(node){
	var childs = node.children;
	for(var i=0,len=childs.length; i<len; i++){
		if(childs[i].tagName === "UL"){  //已经存在ul元素
			return childs[i];
		}
	}
	var ul = document.createElement("ul");//没有ul元素，即叶子节点li时，为li新建ul元素
	node.appendChild(ul);
	return ul;
}


/*将搜索高亮的元素效果清除*/
function clearHighlight(root){
	var nodes = root.getElementsByTagName("a");
	[].forEach.call(nodes, function(node){
		node.classList.remove("highlight");
	});
}




/*根据json数据渲染列表， 列表以<ul>开头，</ul>结束，因此在插入html时要去除最开始和末尾的ul*/
function renderList(data){
	var str = "<ul>";
	for(var i=0, len=data.length; i<len; i++){
		str += "<li><a>"+data[i].text+"</a>";
		if(data[i].list && data[i].list.length>0){
			str += renderList(data[i].list);
		}
		str += "</li>";
	}
	str += "</ul>";
	return str;
}

/* 执行部分*/
var ul = document.getElementById("first");
var input = document.getElementById("keys");
var search = document.getElementById("search");
var first = document.getElementById("first");

var html = renderList(data);
first.innerHTML = html.substring(4, html.lastIndexOf('</ul>')); //去除头和尾的ul

//创建组件
var tree  = new TreeView(first);

search.addEventListener("click", function(event){
	var keys = input.value.trim();
	if(keys === ""){alert("请输入关键字");}
	clearHighlight(first);
	tree.search(keys, tree.breadFirst);
});