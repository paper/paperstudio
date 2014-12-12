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
	
	var speed=200;
	
	var $A1=$("#block-A .block-1"),
		$A1_img=$("#block-A .block-1 img"),
		
		$A2=$("#block-A .block-2"),
		$A2_img=$("#block-A .block-2 img"),
		
		$C1=$("#block-C .block-1"),
		$C1_img=$("#block-C .block-1 img"),
		
		$C2=$("#block-C .block-2"),
		$C2_img=$("#block-C .block-2 img"),
		
		$D1=$("#block-D .block-1"),
		$D1_m=$("#block-D .block-1 .m"),
		
		$D2=$("#block-D .block-2"),
		$D2_m=$("#block-D .block-2 .m"),
		
		$E1=$("#block-E .block-1"),
		$E1_m=$("#block-E .block-1 .m"),
		
		$E2=$("#block-E .block-2"),
		$E2_img=$("#block-E .block-2 img");
		
		$F1=$("#block-F .block-1"),
		$F1_img=$("#block-F .block-1 img");
	
	//========= block-A =========
	hold($A1,speed,function(){
		$A1_img.stop(true, true).fadeIn();
	},function(){
		$A1_img.stop(true, true).fadeOut();
	});
	
	hold($A2,speed,function(){
		$A2_img.stop(true, true).fadeIn();
	},function(){
		$A2_img.stop(true, true).fadeOut();
	});
	
	//========= block-C =========
	hold($C1,speed,function(){
		$C1_img.stop(true, true).fadeIn();
	},function(){
		$C1_img.stop(true, true).fadeOut();
	});
	
	hold($C2,speed,function(){
		$C2_img.stop(true, true).fadeIn();
	},function(){
		$C2_img.stop(true, true).fadeOut();
	});
	
	//========= block-D =========
	hold($D1,speed,function(){
		$D1_m.stop(true, true).slideDown(speed);
	},function(){
		$D1_m.stop(true, true).slideUp(speed);
	});
	
	hold($D2,speed,function(){
		$D2_m.stop(true, true).fadeIn();
	},function(){
		$D2_m.stop(true, true).fadeOut();
	});
	
	//========= block-E =========
	hold($E1,speed,function(){
		$E1_m.stop(true, true).slideDown(speed);
	},function(){
		$E1_m.stop(true, true).slideUp(speed);
	});
	
	hold($E2,speed,function(){
		$E2_img.stop(true, true).fadeIn();
	},function(){
		$E2_img.stop(true, true).fadeOut();
	});
	
	//========= block-F =========
	hold($F1,speed,function(){
		$F1_img.stop(true, true).fadeIn();
	},function(){
		$F1_img.stop(true, true).fadeOut();
	});
	
	//当浏览器最大宽度不够的时候，出现dot nav导航
	var $dotNav=$("#J-dot-nav");
	var $dotNavA=$("#J-dot-nav a");
	
	var $body=$("body");
	var $win8=$("#J-win8");
	
	//浏览器最小宽度为1600，小于这个宽度，就需要出现两个点
	var minWidth=1600;
	//最佳显示宽度
	var bestWidth=1900;
	
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
	
	//初始化
	init();
	
	
});//end ready