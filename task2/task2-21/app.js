(function(){
	var $ = function(id){
		return document.getElementById(id);
	}

	var tag =$('tag');
	var inputs = $('inputs');
	var hobby = $('hobby');

	var reg =/[^0-9a-zA-Z\u4e00-\u9fa5]+/;


  	function UniqueQueue(){
  		this.queue = [];
  	}

  	UniqueQueue.prototype.push = function(item){
  			if(this.queue.length<10 && this.queue.indexOf(item)<0){
  				this.queue.push(item);
  			}else if(this.queue.indexOf(item)<0){
  				this.queue.shift();
  				this.queue.push(item);
  			}
  		};

  	var tagQueue = new UniqueQueue();
  	var tUL = $('t_ul');
  	tag.addEventListener('keyup', function(event){
  		var target = event.target;
  		if(/[ ,，　]/.test(target.value) || event.keyCode==13){
  			var arr = target.value.split(/[ ,，　]+/).filter(function(e){return e!==""});
  			arr.forEach(function(item){
  				tagQueue.push(item);
  			});
  			render(t_ul, tagQueue.queue);
  			target.value = "";
  		}
  	});

  	tUL.addEventListener("mouseover", function(event){
  		if(event.target.tagName == "LI"){
  			event.target.innerHTML = "删除"+event.target.innerHTML;
  			event.target.className += ' blue';
  		}
  	});

  	tUL.addEventListener("mouseout", function(event){
  		if(event.target.tagName == "LI"){
  			event.target.innerHTML = event.target.innerHTML.replace("删除","");
  			event.target.className = event.target.className.replace("blue", "").trim();
  		}
  	});

  	tUL.addEventListener("click", function(event){
  		if(event.target.tagName == "LI"){
  			event.target.parentNode.removeChild(event.target);
  		}
  	});

  	var hobbyQueue = new UniqueQueue();
  	var hUL = $('h_ul');

  	hobby.addEventListener('click', function(event){
  		var values = inputs.value;
  		var arr = values.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/);
  		arr.forEach(function(item){
  			hobbyQueue.push(item);
  		});
  		render(hUL, hobbyQueue.queue);
  	});

  	function render(ele, queue){
  		var inner = "";
  		for(var i=0, len=queue.length; i<len;i++){
  			inner += '<li>'+queue[i]+'</li>';
  		}
  		ele.innerHTML=inner;
  	}

})()