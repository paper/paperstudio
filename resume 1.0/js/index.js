/*
 * @author paper
 */

//动画函数
var animate=(function(){
	var f=function(obj){
		var elem=obj.elem,				//元素
			//obj.begin,			//起始位置
			//obj.end,				//结束位置
			callback=obj.callback,				//调用的函数
			timeStep=obj.step || 10,	//时间间隔
			time=obj.time;				//与外界联系的setTimeout的时间参数
		
		if (obj.begin == obj.end) {
			clearTimeout(time);
			return;
		}else {
			time = setTimeout(function(){
				var step;

				if (obj.begin < obj.end) {
					step = Math.ceil((obj.end - obj.begin) / 10);
					obj.begin += step;
				}
				
				if (obj.begin > obj.end) {
					step = Math.ceil((obj.begin - obj.end) / 10);
					obj.begin -= step;
				}
				
				callback.call(elem,obj.begin);
				
				f(obj);
			}, timeStep);
		}
	};
	
	return f;
})();

//项目导航函数
var project=(function(){
	var navs = BJ("project_innerNav_ul").children(), 
		content = BJ("#project_innerM_ul"), 
		removeNavsClass = function(){
			navs.removeClass();
		}, 
		project_time = null, 
		li_height=184,
	
	/*
	 * 只所以这里用hold不用bind({"mouseover":function(){}})
	 * 是为了防止按钮太敏感，导致用户体验变差。
	 * 你可以删除下面的注释(然后把hold注释了)，自己测试下，就清楚了。
	 * 
	 * navs.bind({
		"mouseover":function(){
			var _this=this,
				index=+_this.getAttribute("tabindex");
			
			//改变nav样式
			removeNavsClass();
			_this.className="select";
			
			//动画
			clearInterval(time);
			animate(content,-parseInt(content.style.marginTop),li_height*index);
		}
	 */
	
	run=function(){
		navs.hold({
			"timeOn": 200,
			"on": function(){
				var index = +this.getAttribute("tabindex");
				
				//改变nav样式
				removeNavsClass();
				this.className = "select";
				
				//动画
				clearInterval(project_time);
				animate({
					"elem": content,
					"begin": parseInt(content.style.marginTop),
					"end": -li_height * index,
					"time": project_time,
					"callback": function(begin){
						this.style.marginTop = begin + "px";
					}
				});
			}
		});
	};
	
	return run;
	
})();
project();

//图片走廊
var gallery=(function(){
	var pic=BJ("#pic"),		//图片容器
		picLis=BJ("pic").children(),
		time=null,			//控制下面字移动出来的时间参数
		imgTime=null,		//每次控制图片移动的间隔时间参数
		imgStepTime=4000,	//图片移动的间隔时间是多少
		imgMoveTime=null,	//控制图片正在移动的时间参数
		h=30,				//下面半透明黑色背景的高度
		w=584,				//图片移动的宽度
		i=1,				//开始位置	
		no=4,				//图片个数
	
		//图片停止移动
		imgStopMove=function(){
			clearInterval(imgTime);
		},
	
		//图片开始移动
		imgStartMove=function(){
			clearInterval(imgMoveTime);
			imgTime=setInterval(function(){
				animate({
					"elem": pic,
					"begin": parseInt(pic.style.marginLeft),
					"end": -i * w,
					"time": imgMoveTime,
					"callback": function(begin){
						this.style.marginLeft = begin + "px";
					}
				});
				
				i==(no-1)?i=0:i++;

			},imgStepTime);
		},
		
		run=function(){
			imgStartMove();
	
			picLis.find(".cover").bind({
				"mouseover":function(){
					var _this=this,
						b=BJ(_this).parent().find(".b").getElem()[0];
					
					//图片停止移动
					imgStopMove();
					
					clearInterval(time);
					animate({
						"elem":b,
						"begin":parseInt(BJ(b).css("bottom")),
						"end":0,
						"time":time,
						"callback":function(begin){
							this.style.bottom = begin + "px";
						}
					});
				},
				
				"mouseout":function(){
					var _this=this,
						b=BJ(_this).parent().find(".b").getElem()[0];
					
					//图片又开始移动
					imgStartMove();
						
					clearInterval(time);
					animate({
						"elem":b,
						"begin":parseInt(BJ(b).css("bottom")),
						"end":-30,
						"time":time,
						"callback":function(begin){
							this.style.bottom = begin + "px";
						}
					});
				}
			});
		};
	
	return run;
	
})();
gallery();
