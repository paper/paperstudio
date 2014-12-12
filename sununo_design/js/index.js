$(document).ready(function(){
	
	var isIE = (function(){
	    var v = 3,
	        div = document.createElement('div'),
	        all = div.getElementsByTagName('i');
	 
	    while (
	        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	        all[0]
	    );
	 
	    return v > 4 ? v : undefined;
	}());
	
	//鼠标停留time，才触发fn1
	//鼠标离开time，才触发fn2
	function hold($elem,time,fn1,fn2){
		var t1=null,
			t2=null;
		
		$elem.mouseover(function(){
			clearTimeout(t2);
			
			t1=setTimeout(function(){
				fn1();
			},time);
		});
		
		$elem.mouseout(function(){
			clearTimeout(t1);
			
			t2=setTimeout(function(){
				fn2();
			},time);
		});
		
	};
	
	var speed=250;
	
	var $c1=$(".block-C .block-1"),
		$c1m=$(".block-C .block-1 .m"),
		
		$c2=$(".block-C .block-2"),
		$c2m=$(".block-C .block-2 .m"),
		
		$f1=$(".block-F .block-1"),
		$f1m=$(".block-F .block-1 .m"),
		
		$f2=$(".block-F .block-2"),
		$f2m=$(".block-F .block-2 .m"),
		
		$g3=$(".block-G .block-3"),
		$g3c=$(".block-G .block-3 .c");
	
	hold($c1,150,function(){
		$c1m.stop(true, true).slideDown(speed);
	},function(){
		$c1m.stop(true, true).slideUp(speed);
	});
	
	hold($c2,150,function(){
		$c2m.stop(true, true).slideDown(speed);
	},function(){
		$c2m.stop(true, true).slideUp(speed);
	});
	
	hold($f1,150,function(){
		$f1m.stop(true, true).slideDown(speed);
	},function(){
		$f1m.stop(true, true).slideUp(speed);
	});
	
	hold($f2,150,function(){
		$f2m.stop(true, true).fadeIn();
	},function(){
		$f2m.stop(true, true).fadeOut();
	});
	
	hold($g3,150,function(){
		$g3c.stop(true, true).fadeOut();
	},function(){
		$g3c.stop(true, true).fadeIn();
	});	
	
	//当浏览器最大宽度不够的时候，出现dot nav导航
	var $dotNav=$("#J-dot-nav");
	var $dotNavA=$("#J-dot-nav a");
	
	var $body=$("body");
	var $win8=$("#J-win8");
	
	//浏览器最小宽度为1600，小于这个宽度，就需要出现两个点
	var minWidth=1600;
	//最佳显示宽度
	var bestWidth=1680;
	
	//初始化减少的宽度
	var initReduceWidth=200;
	
	var bodyWidth=$body.width();
	var resizeTime=null;
	
	//根据调整浏览器的大小，来改变内容的展示
	function checkBodyWidth(){
		bodyWidth=$body.width();
			
		if(bodyWidth<minWidth){
			//如果导航一开始是隐藏的话
			if($dotNav.css("display")=="none"){
				$dotNavA.removeClass("cur");
				$dotNavA.eq(0).addClass("cur");
			}
		
			if(parseInt( $win8.css("margin-left") )!=0){
				var step=bestWidth-bodyWidth;
				
				$win8.animate({
					'margin-left':-1*step
				});
			}
			
			$dotNav.show();
		}else{
			
			$win8.animate({
				"margin-left":0
			});
			
			$dotNav.hide();
			
		}
	};

	
	//绑定那个dot按钮事件
	function bindDotNav(){
		
		 $dotNavA.click(function(){
			if(this.className=="cur") return;
			
			var i=$dotNavA.index(this);
			
			$dotNavA.removeClass();
			this.className="cur";
			
			if(i==0){
				$win8.animate({
					'margin-left':0
				});
			}else{
				var step=bestWidth-bodyWidth;
				$win8.animate({
					'margin-left':-1*step
				});
			}
		});
	};
	
	$(window).resize(function(){
		clearTimeout(resizeTime);
		
		resizeTime=setTimeout(function(){
			checkBodyWidth();
		},150);
	});
	
	
	
	function init(){
		checkBodyWidth();
		bindDotNav();
	};
	
	
	init();
	
	
	
});//end ready