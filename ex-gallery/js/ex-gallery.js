/*
 * @author paper
 */
function ExGallery(para){
	var that=this;
	if(that._type(para)!='Object'){ return;}
	
	var wrapId=typeof para.wrapId=='string' ? document.getElementById(para.wrapId) : para.wrapId;
	var navId=typeof para.wrapId=='string' ? document.getElementById(para.navId) : para.navId;
	
	var	height=para.height;
	var	width=para.width;
	var	parts=typeof para.parts!='number'?4:para.parts;

	var	imagesWrap=wrapId.getElementsByTagName('li');
	var	images=wrapId.getElementsByTagName('img');
	var	imagesNumber=images.length;
	var galleryUl=wrapId.getElementsByTagName('ul')[0];
	
	var	speed=typeof para.speed!='number'?10:para.speed;
	var time=para.time>3000? para.time : 3000;
	
	that.data={
		wrapId:wrapId,
		navId:navId,
		
		height:height,
		width:width,
		parts:parts,
		
		imagesWrap:imagesWrap,
		imagesNumber:imagesNumber,
		images:images,
		galleryUl:galleryUl,
		
		speed:speed,
		zIndexMax:100,
		
		//初始化
		//当前显示的图片下标
		curShow:imagesNumber-1,		
		//下一个要显示的图片下标
		nextShow:imagesNumber-1,
		
		time:time,
		
		row_li:null,
		vertical_li:null,
		//temp_li:null,
		autoRunKey:true,
		navClickKey:true
	}
	
	//for f*ck IE6
	try {
         document.execCommand("BackgroundImageCache", false, true);
    } catch (e) {}
	
	that.init();
};

ExGallery.prototype.init=function(){
	//this.randomAnimate();
	
	var galleryNav=this.galleryNav();
	if(galleryNav){
		galleryNav.checkNavClass();
		galleryNav.bindNavClick();
	}
};

ExGallery.prototype._stopDefault = function(e){
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        window.event.returnValue = false;
    }
    return false;
};

ExGallery.prototype._bind=function(elem,type,fn){
	try{
		elem.addEventListener(type,fn,false);
	}catch(e){
		try{
			elem.attachEvent('on'+type,fn);
		}catch(e){
			elem['on'+type]=fn;
		}
	}
};

ExGallery.prototype._type=function(o){
    return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
};

//@level 0-100
ExGallery.prototype._setOpacity=function(elem,level){     
      elem.style.filter = elem.filters ? elem.style.filter = 'alpha(opacity=' + level + ')' : elem.style.opacity = level / 100;
};

ExGallery.prototype._setStyle=function(elem,obj){
	for (var i in obj) {
		elem.style[i]=obj[i];
	}
};

ExGallery.prototype.galleryNav=function(){
	if (!this.data.navId) return ;
	
	var that=this;	
	var navId=that.data.navId;
	var navLinks=navId.getElementsByTagName('a');
	var navLinks_length=navLinks.length;
	
	return {
		//要根据nextShow的下标来确定下面导航的下标
		checkNavClass:function(classname){
			var classname=classname || 'cur';
			for(var i=0;i<navLinks_length;i++){
				navLinks[i].className='';
			}
		
			navLinks[that.data.imagesNumber-that.data.nextShow-1].className=classname;
		},
		
		bindNavClick:function(){
			for(var i=0;i<navLinks_length;i++){
				(function(i){
					var navLinkNode = navLinks[i];
					
					that._bind(navLinkNode, 'click', function(e){
						if (!that.data.navClickKey) return;
						
						that._stopDefault(e);
						//先停止自动播放
						//that.data.autoRunKey = false;
						
						if(i==that.data.imagesNumber-that.data.nextShow-1) return;
						
						//点击导航，是为了看到nextShow的图片，隐藏curShow图片
						that.data.curShow = that.data.nextShow;
						that.data.nextShow = that.data.imagesNumber-i-1;
						
						that.galleryNav().checkNavClass(); 
						that.randomAnimate();
					});
				})(i)
			}
		}
	}
};

//动画结束之后
ExGallery.prototype._resetCover=function(li,key,value){
	//cover隐藏
	li.style.zIndex=0;
	
	//如果有导航的话
	if(this.galleryNav()){
		this.data.navClickKey=true;
	}
	
	//动画之后的cover里面每个小块div复位
	var divs=li.getElementsByTagName('div');
	for(var i=0,len=divs.length;i<len;i++){
		divs[i].style[key]=value;
	}
};

ExGallery.prototype._getImageOrder=function(v){
	var cur,next;
	
	cur = this.data.curShow;
	
	if (v == 'auto') {
		next = this.data.nextShow = this.data.curShow - 1;
		
		this.data.curShow--;
		
		if (cur == 0) {
			next = this.data.curShow = this.data.imagesNumber - 1;
			
			this.data.curShow = next;
		}
	}else{
		next=this.data.nextShow;
	}
	
	return {
		curShowLi:this.data.imagesWrap[cur],
		nextShowLi:this.data.imagesWrap[next]
	}
};

//生成临时gallery div，覆盖图片表面
ExGallery.prototype.createCover=function(type,callback){
	if(!this.data.row_li || !this.data.vertical_li){
		var tempLi=document.createElement('li');
		var height=this.data.height;
		var width=this.data.width;
		var partHeight=height/this.data.parts;
		var partWidth=width/this.data.parts;
		var src=this.data.images[this.data.curShow].src;
		var tempDiv;
		
		//生成横向
		if (type == 'row' && !this.data.row_li) {
			for (var i = 0; i < this.data.parts; i++) {
				tempDiv = document.createElement('div');
				
				this._setStyle(tempDiv, {
					height: partHeight + 'px',
					width: width + 'px',
					position: 'absolute',
					left: 0,
					top: partHeight * i + 'px'
				})

				tempLi.appendChild(tempDiv);
			}
			
			this.data.row_li = tempLi;
			this.data.galleryUl.appendChild(tempLi);
		} 
		
		//生成纵向
		else if (type == 'vertical' && !this.data.vertical_li) {
			for (var i = 0; i < this.data.parts; i++) {
				tempDiv = document.createElement('div');
				
				this._setStyle(tempDiv, {
					height: height + 'px',
					width: partWidth + 'px',
					position: 'absolute',
					left: partWidth * i + 'px',
					top:0
				})
				
				tempLi.appendChild(tempDiv);
			}
			
			this.data.vertical_li = tempLi;
			this.data.galleryUl.appendChild(tempLi);
		}
	}

	if(typeof callback=='function'){
		callback(this.data[type+'_li']);
	}
};

//动画之前！！
//确定显示的排列顺序
//把needShowImage的图片地址，放到当前显示的最上面的cover，然后设置下一个的图片是nextShowLi
ExGallery.prototype._showOrder=function(cover,style){	
	var getImageOrder = this._getImageOrder();
	var curShowLi=getImageOrder.curShowLi;
	var nextShowLi=getImageOrder.nextShowLi;

	curShowLi.style.zIndex=0;
	var curShowLiImage=curShowLi.getElementsByTagName('img')[0];
	var src=curShowLiImage.src;
	
	cover.style.zIndex=this.data.zIndexMax;
	nextShowLi.style.zIndex=this.data.zIndexMax-1;
	
	var tempDivArray=cover.getElementsByTagName('div');
	var h=this.data.height/this.data.parts;
	var w=this.data.width/this.data.parts;
	
	var style=style || 'row';
	if (style == 'row') {
		for (var i = 0, len = tempDivArray.length; i < len; i++) {
			this._setStyle(tempDivArray[i], {
				background: 'url(' + src + ') no-repeat 0 ' + (-h) * i + 'px'
			})
		}
	} else if (style == 'vertical') {
		for (var i = 0, len = tempDivArray.length; i < len; i++) {
			this._setStyle(tempDivArray[i], {
				background: 'url(' + src + ') no-repeat ' + (-w) * i + 'px 0'
			})
		}
	}else{
		throw new Error('_showOrder:style is wrong.');
	}
};

/*======================================================================
 * 动画
 =======================================================================*/
ExGallery.prototype._fOut=function(elem,callback){
	var opacity=100;
	var step=4;
	var that=this;
	
	(function(){
		if (opacity <= 0) {
			if (typeof callback == 'function') {
				callback(elem);
			}
			return;
		}
		
		opacity -= step;
		that._setOpacity(elem, opacity);
		
		setTimeout(arguments.callee, 20);
	})()
};

ExGallery.prototype._animate = function(elem, from, to, doingCallback,endCallback){
	//动画过程，锁定导航按钮
	this.data.navClickKey=false;
	
	var speed=this.data.speed;
	var ceil=Math.ceil;
	var step;
	
	(function(){
		if (from == to){
			if (typeof endCallback == 'function') {
				endCallback.call(elem, from);
			}
			return;
		} 

		if (from < to) {
			step = ceil((to - from) / speed);
			from += step;
		} else {
			step = ceil((from - to) / speed);
			from -= step;
		}
		
		if (typeof doingCallback == 'function') {
			doingCallback.call(elem, from);
		}
		
		setTimeout(arguments.callee, 20);
	})();
};

//第1个向左，第2向右，第3个向左，第4向右,....
ExGallery.prototype.animate_rowStyle1=function(li,divs,callback){
	var that=this;
	var w=that.data.width;
	var len;
	
	that._fOut(li);
	
	for(var i=0,l=divs.length;i<l;i++){
		(function(i){
			len=i%2==0?-w:w;
			
			that._animate(divs[i], 0, len, function(v){
				this.style.left=v+'px';
			},function(){
				//这里回调只能做一次！！
				if(i==l-1){
					that._resetCover(li,'left',0);
				
					if(typeof callback=='function'){
						callback(li,divs);
					}
				}
			})
		})(i)
	}
};

//全部向上消失
ExGallery.prototype.animate_rowStyle2=function(li,divs,callback){
	var that=this;
	var h=parseInt(divs[0].style.height);
	
	that._fOut(li);
	
	for(var i=0,l=divs.length;i<l;i++){
		(function(i){
			that._animate(divs[i], h, 0, function(v){
				this.style.height=v+'px';
			},function(){
				//这里回调只能做一次！！
				if(i==l-1){
					that._resetCover(li,'height',h+'px');
				
					if(typeof callback=='function'){
						callback(li,divs);
					}
				}		
			})
		})(i)
	}
};

//竖的
//第1个向上，第2个向下，。。。。
ExGallery.prototype.animate_verticalStyle1=function(li,divs,callback){
	var that=this;
	var len;
	var h=that.data.height;
	
	that._fOut(li);

	for(var i=0,l=divs.length;i<l;i++){
		(function(i){
			len=i%2==0?-h:h;
			
			that._animate(divs[i], 0, len, function(v){
				this.style.top=v+'px';
			},function(){
				//这里回调只能做一次！！
				if(i==l-1){
					that._resetCover(li,'top',0);
				
					if(typeof callback=='function'){
						callback(li,divs);
					}
				}				
			})
		})(i)
	}
};

//竖的
//全部向左消失
ExGallery.prototype.animate_verticalStyle2=function(li,divs,callback){
	var that=this;
	var w=parseInt(divs[0].style.width);
	
	that._fOut(li);
	
	for(var i=0,l=divs.length;i<l;i++){
		(function(i){
			that._animate(divs[i], w, 0, function(v){
				this.style.width=v+'px';
			},function(){
				//这里回调只能做一次！！
				if(i==l-1){
					that._resetCover(li,'width',w+'px');
				
					if(typeof callback=='function'){
						callback(li,divs);
					}
				}				
			})
		})(i)
	}
};

ExGallery.prototype.autoRandomAnimate=function(callback){
	var that=this;
		
	setTimeout(function(){
		that.randomAnimate(callback);
	},that.data.time);
};

ExGallery.prototype.randomAnimate=function(callback){
	//if(!this.data.autoRunKey) return;
	
	var n=parseInt(Math.random()*4);
	var that=this;

	switch(n){
		case 0:that.createCover('row', function(li){
			
			var divs=li.getElementsByTagName('div');
			that._showOrder(li);
			
			that.animate_rowStyle1(li,divs,function(){
				//autoRun();
				if(typeof callback=='function') callback();
			});
		});
		break;
		
		case 1:that.createCover('row', function(li){
			var divs=li.getElementsByTagName('div');
			that._showOrder(li);
			
			that.animate_rowStyle2(li,divs,function(){
				//autoRun();
				if(typeof callback=='function') callback();
			});
		});
		break;
		
		case 2:that.createCover('vertical', function(li){
			var divs=li.getElementsByTagName('div');
			that._showOrder(li,'vertical');
		
			
			that.animate_verticalStyle1(li,divs,function(){
				if(typeof callback=='function') callback();
			});
		});
		break;
		
		case 3:that.createCover('vertical', function(li){
			var divs=li.getElementsByTagName('div');
			that._showOrder(li,'vertical');
			
			that.animate_verticalStyle2(li,divs,function(){
				
				if(typeof callback=='function') callback();
			});
		});
		break;
	}
};