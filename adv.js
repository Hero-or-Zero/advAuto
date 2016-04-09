/*封装$*/
window.$=HTMLElement.prototype.$=function(selector){
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    return elems==null?null:
	   elems.length==1?elems[0]:
		               elems;
}
/*广告图片数组*/
var imgs=[
	{"i":0,"img":"Images/banner_01.jpg"},
	{"i":1,"img":"Images/banner_02.jpg"},
	{"i":2,"img":"Images/banner_03.jpg"},
	{"i":3,"img":"Images/banner_04.jpg"},
	{"i":4,"img":"Images/banner_05.jpg"}
];
var adv={
	LIWIDTH:670,//每个li的宽度
	DURATION:500,//动画播放总时长
	STEPS:150,//动画移动的总步数
	WAIT:2000,//动画播放间隔2s
	timer:null,//存储定时器的序号
	canAuto:true,//开始就启动自动轮播

	init:function(){
	  var self=this;
	  self.updateView();
	  //设置鼠标移入/移出事件是否进行自动播放
	  $("#slider").addEventListener("mouseover",function(){
	    self.canAuto=false;
	  },false);
	  $("#slider").addEventListener("mouseout",function(){
	    self.canAuto=true;//canAuto判断是否能自动轮播
	  },false);
	  
	  self.automove();//页面一加载就启动自动轮播

	  //找到id为indexs的ul，绑定鼠标进入事件
	  $("#indexs").addEventListener("mouseover",function(){
	    var e=window.enent||arguments[0];
		var target=e.srcElement||e.target;
		if(target.nodeName=="LI"&&target.innerHTML-1!=imgs[0].i){
		  $("#indexs>.hover").className="";
		  target.className="hover";
		  //获得移动li的个数n
		  var n=target.innerHTML-1-imgs[0].i;
		  //调用move函数手动移动li
		  self.move(n);
		}
	  },false);

	},
	//移动li的方法move，传入参数n----手动轮播
	move:function(n){
	  //停止当前正在运行的timer动画，将timer设置为null
	  clearTimeout(this.timer);
	  this.timer=null;
	  //默认左移为正
	  //如果右移
	  if(n<0){
	    //	将imgs数组结尾的-n个元素删除后，拼接到imgs数组开头，再保存回imgs中
		imgs=imgs.splice(imgs.length+n,-n).concat(imgs);
		//	调用updateView方法刷新界面
		this.updateView();
		//	设置id为imgs的ul的left为n*LIWIDTH
		$("#imgs").style.left=n*this.LIWIDTH+"px";
	  }
	  //调用moveStep方法，传入n
	  this.moveStep(n);
	},
	//在移动前后，将imgs数组的内容刷新到页面
	updateView:function(){
	  $("#imgs").style.width=this.LIWIDTH*imgs.length+"px";
	  for(var i=0,lis=[],idx=[];i<imgs.length;i++){
	    lis[i]='<li data-i="'+imgs[i].i+'"><img src="'+imgs[i].img+'"></li>';
		idx[i]="<li>"+(i+1)+"</li>";
	  }

	  $("#imgs").innerHTML=lis.join("");
	  $("#indexs").innerHTML=idx.join("");

      $("#indexs>.hover").className="";
	  $("#indexs>li")[imgs[0].i].className="hover";
	},
	automove:function(){
	  var self=this;
	  //启动一次性定时器，传入匿名函数封装的moveStep方法调用，在moveStep方法中写死参数1，设置时间间隔为WAIT
	  self.timer=setTimeout(function(){
	    //如果启动自动轮播就移动一步，否则就反复等待
		if(self.canAuto){
		  self.moveStep(1);//移动一步
		}else{
		  self.automove();//反复等待
		}
	  },self.WAIT);
	},
	//将ul移动一步
	moveStep:function(n){//n表示要移动li的个数，向左为正
	  var self=this;
	  var step=n*self.LIWIDTH/self.STEPS;
	  var style=getComputedStyle($("#imgs"));
	  var left=parseFloat(style.left)-step;
	  $("#imgs").style.left=left+"px";
	  if(n>0&&left>-n*self.LIWIDTH||n<0&&left<0){
	    self.timer=setTimeout(function(){
		  self.moveStep(n);
		},self.DURATION/self.STEPS);
	  }else{
	    $("#imgs").style.left="0px";
		self.automove();
		if(n>0){
		  imgs=imgs.concat(imgs.splice(0,n));
		  self.updateView();
		}
	  }
	},
  
}
window.addEventListener("load",function(){
  adv.init();
},false);