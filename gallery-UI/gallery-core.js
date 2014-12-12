/*
 * @author paper
 */
//var Gallery=(function(){
//	return function(para){
//		var obj={},
//			para=para || {},
//			init=para.init,
//			callback=para.callback;
//		
//		if(init) init.call(obj);
//		if(callback) callback.call(obj);
//	};
//})();

//=====================================
//First Style
//blockA
//=====================================
(function($){
	var $points=$('blockA_nav').find('li'),
		$panel=$('blockA_main').find('li');
	
	//绑定触发事件
	$points.bind('click',function(){
		var i=this.getI;
		
		$points.removeClass('active');
		Fuee(this).addClass('active');
		
		$panel.hide();
		$panel.get(i).show();
	});
})(Fuee);

//=====================================
//Second Style
//blockB
//=====================================
(function($){
	var $points=$('blockB_nav').find('li'),
		$panel=$('blockB_main').find('li');
	
	//绑定触发事件
	$points.bind('click',function(){
		var i=this.getI;
		
		$points.removeClass('active');
		Fuee(this).addClass('active');
		
		$panel.hide();
		$panel.get(i).show();
	});
})(Fuee);

//=====================================
//Third Style
//blockC
//=====================================
(function($){
	var $points=Fuee('blockC_nav').find('li'),
		panel=Fuee('blockC_main').getElem(),
		
		animate=(function(){
			var fn = function(obj){
		        var elem = obj.elem, 
		        	begin=obj.begin,
					end=obj.end,
		        	callback = obj.callback, 
					endCallback=obj.endCallback,
				 	speed = obj.speed || 10; 
				 
		        (function(){
					if (begin === end){
						if(endCallback) endCallback();
						return;
					} 

					var step;
					if (begin < end) {
						step = Math.ceil((end - begin) / 10);
						begin += step;
					}
					else {
						step = Math.ceil((begin - end) / 10);
						begin -= step;
					}
					callback.call(elem, begin);
					
					setTimeout(arguments.callee, speed);
				})();
		    };
		    
		  return fn;
		})(),
		
		rkey=true,
		lkey=false,
		min=0,
		max=-360*3,
		checkLeftRight=function(){
			var curLeft=parseInt(panel.style.marginLeft);
			if (curLeft === min) {
				lkey = false;
				rkey=true;
				$points.get(0).addClass('nowork');
				$points.get(1).removeClass('nowork');
			}else if(curLeft === max){
				lkey = true;
				rkey=false;
				$points.get(0).removeClass('nowork');
				$points.get(1).addClass('nowork');
			}else{
				lkey = true;
				rkey=true;
				$points.get(0).removeClass('nowork');
				$points.get(1).removeClass('nowork');
			}
		};
		
	//绑定触发事件
	$points.bind('click',function(){
		var i=this.getI;
		//向左
		if(i==0){
			if(!lkey) return;
			
			animate({
				'elem': panel, 
			    'begin': parseInt(panel.style.marginLeft), 
			    'end': parseInt(panel.style.marginLeft)+360, 
			    'callback': function(x){ 
					rkey=false,
					lkey=false,
					
			        this.style.marginLeft = x + 'px';
			    },
				'endCallback':function(){
					checkLeftRight();
				}
			});
		}
		//向右
		else{
			if(!rkey) return;
			
			animate({
				'elem': panel, 
			    'begin': parseInt(panel.style.marginLeft), 
			    'end': parseInt(panel.style.marginLeft)-360, 
			    'callback': function(x){ 
					rkey=false,
					lkey=false,
					
			        this.style.marginLeft = x + 'px';
			    },
				'endCallback':function(){
					checkLeftRight();
				}
			});
		}
	});
})(Fuee);