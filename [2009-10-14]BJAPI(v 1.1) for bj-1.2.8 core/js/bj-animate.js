/*
 * 基于bj-1.2.8以上版本
 * 基本动画库
 */

/*	
	t: current time（当前时间）；
	b: beginning value（初始值）；
	c: change in value（变化量）；
	d: duration（持续时间）
	
	Linear：无缓动效果；
	Quadratic：二次方的缓动（t^2）；
	Cubic：三次方的缓动（t^3）；
	Quartic：四次方的缓动（t^4）；
	Quintic：五次方的缓动（t^5）；
	Sinusoidal：正弦曲线的缓动（sin(t)）；
	Exponential：指数曲线的缓动（2^t）；
	Circular：圆形曲线的缓动（sqrt(1-t^2)）；
	Elastic：指数衰减的正弦曲线缓动；
	Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；
	Bounce：指数衰减的反弹缓动。
	
	每个效果都分三个缓动方式（方法），分别是：
	easeIn：从0开始加速的缓动；
	easeOut：减速到0的缓动；
	easeInOut：前半段从0开始加速，后半段减速到0的缓动。
	其中Linear是无缓动效果，没有以上效果。
 */

var Tween = {
    Linear: {
		noease:function(t,b,c,d){ return c*t/d + b; }
	},
	
    Quad: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        }
    },
	
    Cubic: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    },
	
    Quart: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        }
    },
	
    Quint: {
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOut: function(t,b,c,d){
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        }
    },
	
    Sine: {
        easeIn: function(t,b,c,d){
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t,b,c,d){
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        }
    },
	
    Expo: {
        easeIn: function(t,b,c,d){
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t,b,c,d){
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
	
    Circ: {
        easeIn: function(t,b,c,d){
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOut: function(t,b,c,d){
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        }
    },
	
    Elastic: {
        easeIn: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
        },
        easeInOut: function(t,b,c,d,a,p){
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        }
    },
	
    Back: {
        easeIn: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOut: function(t,b,c,d,s){
            if (s == undefined) s = 1.70158; 
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        }
    },
	
    Bounce: {
        easeIn: function(t,b,c,d){
            return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
        },
        easeOut: function(t,b,c,d){
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOut: function(t,b,c,d){
            if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
            else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    }
};

(function($){
	/*
	 * author : zhang binjue
	 * 扩展的基本移动函数
	 *  t: current time（当前时间）；
		b: beginning value（初始值）；
		c: change in value（变化量）；
		d: duration（持续时间）
		@obj
		obj={
			type:"position"或者"margin" 		//默认是"position",position表示node是属于绝对定位，margin是依靠变化margin来移动	(不是必须)
			from:{left:100,top:100},		//从什么位置开始(必须)
			to:{left:700,top:100},			//到什么位置结束(必须)
			speed:800,						//默认是400，越小速度就越快(不是必须)
			animateType:"Cubic.easeOut"		//默认是"Cubic.easeOut",动画的类型，名字结合上面的Tween类(不是必须)
		}
	 */
	$.extend("animate_start",function(obj){
		var node=this.elem,
			speed=obj.speed || 400,
			animateType=obj.animateType || "Cubic.easeOut",
			para=obj.type || "position";	//position就是通过left或者top来改变 ，“margin”就是通过margin-left或者margin-top来改变
		if(animateType=="Linear"){
			animateType="Linear.noease"
		}
		var animateTypeDiv=[];
			animateTypeDiv[0]=animateType.split(".")[0];
			animateTypeDiv[1]=animateType.split(".")[1];
			
		
		node.animate_stop=true;			//stop函数的锁定key		true表示可以使用
		node.animate_continue=false;	//continue函数的锁定key	true表示可以使用
		
		if(para=="position"){
			var paraOne="left",paraTwo="top";
		}else{
			var paraOne="marginLeft",paraTwo="marginTop";
		}
		
		var t=0,
			b=parseInt(obj.from.left,10),
			c=parseInt(obj.to.left,10)-parseInt(obj.from.left,10),
			d=speed,
			
			t2=0,
			b2=parseInt(obj.from.top,10),
			c2=parseInt(obj.to.top,10)-parseInt(obj.from.top,10),
			d2=speed;
		
		if(node.animateTime)
			clearTimeout(node.animateTime);
		
		node.tween=function(t,b,c,d,t2,b2,c2,d2){
			node.style[paraOne] = Math.ceil(Tween[animateTypeDiv[0]][animateTypeDiv[1]](t, b, c, d)) + "px";
			node.style[paraTwo] = Math.ceil(Tween[animateTypeDiv[0]][animateTypeDiv[1]](t2, b2, c2, d2)) + "px";
			
	        if (t < d || t2<d2) {
	            t=t+1;
				t2=t2+1;
	            node.animateTime=setTimeout(function(){
					//把改变后的数据记录下来
					//记录当前时间[如果暂停了，当前时间就为0]
					node.t=0;	node.t2=0;
					
					//记录初始值
					node.b=parseInt(node.style[paraOne],10);		node.b2=parseInt(node.style[paraTwo],10);
					
					//记录变化量
					node.c=parseInt(obj.to.left,10)-node.b;		node.c2=parseInt(obj.to.top,10)-node.b2;
					
					//记录持续时间
					node.d=d;		node.d2=d2;
					
	                node.tween(t,b,c,d,t2,b2,c2,d2);
	            }, 1);
	        }else{
				//动画结束的时候，调用回调函数
				if(obj.callback)
					obj.callback(node);
			}
		};
		
		node.tween(t,b,c,d,t2,b2,c2,d2);
	});
	
	//停止continue，停止stop
	$.extend("animate_stop",function(callback){
		var node=this.elem;
			
		if(node.animate_stop){
			node.animate_stop=false;
			node.animate_continue=true;
			
			clearTimeout(node.animateTime);
			
			//动画暂停的时候，调用回调函数
			if(callback) callback(node);
		}
	});
	
	//释放stop，停止continue
	$.extend("animate_continue",function(callback){
		var node=this.elem;
			
		if(node.animate_continue){
			node.animate_stop=true;
			node.animate_continue=false;
			
			//一开始继续的时候，调用回调函数
			if(callback) callback(node);
			
			//alert("node.t="+node.t+"   node.b="+node.b+"   node.c="+node.c+"   node.d="+node.d);
			node.tween(node.t,node.b,node.c,node.d,node.t2,node.b2,node.c2,node.d2);
		}
	});
})(BJ);
