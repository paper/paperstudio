/*
 * @author paper
 */
var BoxChange = (function($){
    var f = function(obj){
		if(!obj.elem) return;
		
        var elem = obj.elem, //元素
        endCallback = obj.endCallback, //调用的函数
        doingCallback=obj.doingCallback,
		beginCallback=obj.beginCallback,
 		speed = obj.speed || 15; //时间频率
 		
		var p=obj.position===undefined ? false : obj.position,
			w=obj.width===undefined ? false : obj.width,
			h=obj.height===undefined ? false : obj.height,
			
			pfrom_left,pfrom_top,pto_left,pto_top,w_from,w_to,h_from,h_to,time,para={};
		
		if(p===false){
			pfrom_left=pto_left=parseInt($(elem).css('left')) || 0;
			pfrom_top=pto_top=parseInt($(elem).css('top')) || 0;
		}else{
			if(p.from===undefined){
				pfrom_left=parseInt($(elem).css('left')) || 0;
				pfrom_top=parseInt($(elem).css('top')) || 0;
			}else{
				pfrom_left=p.from[0];
				pfrom_top=p.from[1];
			}
			
			pto_left=p.to[0];
			pto_top=p.to[1];
		}
		
		if(w===false){
			w_from=w_to=$(elem).getElemHeightWidth().width || 0;
		}else{
			w_from=w.from===undefined ? $(elem).getElemHeightWidth().width || 0 : w.from;
			w_to=w.to;
		}
		
		if(h===false){
			h_from=h_to=$(elem).getElemHeightWidth().height || 0;
		}else{
			h_from=h.from===undefined ? $(elem).getElemHeightWidth().height || 0 : h.from;
			h_to=h.to;
		}
		
		var m=function(begin,end){
			var step;
			
			if (begin < end) {
				step = Math.ceil((end - begin) / 10);
                begin += step;
            }
            else if(begin > end) {
             	step = Math.ceil((begin - end) / 10);
                begin -= step;
            }
			
			return begin;
		};
		
		if(beginCallback)  beginCallback.call(elem, para);
			
        (function(){
			w_from=m(w_from,w_to);
			h_from=m(h_from,h_to);
			pfrom_left=m(pfrom_left,pto_left);
			pfrom_top=m(pfrom_top,pto_top);
			
			para={
				'width':w_from,
				'height':h_from,
				'left':pfrom_left,
				'top':pfrom_top,
				'time':time
			};
			
			if(doingCallback) doingCallback.call(elem, para);
			
            if (w_from==w_to && h_from===h_to && pfrom_left == pto_left && pfrom_top == pto_top){
				if(endCallback) endCallback.call(elem, para);
				return;
			} 
            	
            time=setTimeout(arguments.callee, speed);
        })();
    };
    
    return f;
})(Fuee);