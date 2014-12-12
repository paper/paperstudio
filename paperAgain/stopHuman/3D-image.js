/*
 * @author paper
 */
var image3D = (function(){
	var doc=document;
	
    function $(node){
        return typeof node == 'string' ? doc.getElementById(node) : node;
    };
    
    function getMouse(e){
        e = e || window.event;
        if (e.pageX || e.pageY) {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }
        var dd = doc.documentElement;
        return {
            x: e.clientX + dd.scrollLeft - dd.clientLeft,
            y: e.clientY + dd.scrollTop - dd.clientTop
        };
    };
    
    function getPosition(node){
		var elem = $(node), 
			box = elem.getBoundingClientRect(), 
			scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop), 
			scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
		return {
			left: box.left + scrollLeft,
			top: box.top + scrollTop
		};
	};
    
    function bind(node, type, fn){
        var elem = $(node);
        try {
            elem.addEventListener(type, fn, false);
        } catch (e) {
            try {
                elem.attachEvent('on' + type, fn);
            } catch (e) {
                elem['on' + type] = function(ev){
                    return fn(ev);
                }();
            }
        }
    };
	
	function imagesMove(rName,rValue,rNamePos,m,n){
		for(var i=0,len=rName.length;i<len;i++){
			(function(i){
				var elem = $(rName[i]),
					v=rValue[i],
					p=rNamePos[i],
       				_x = Math.round(m / v),
       				_y = Math.round(n / v);

            	elem.style.left = p[0] - _x + 'px';
            	elem.style.top = p[1] - _y + 'px';
			})(i)
		}
	};
	
	/*
	 * obj={
	 * 	'image3D_wrapId':'space',
	 * 	'image3D_images':{
	 * 		'plane':60,
	 * 		'cat':60,
	 * 		'word':60,
	 * 		'dog':20,
	 * 		'moon':20,
	 * 		'bg':20
	 *   }
	 * }
	 */
	return function(obj){
		var wrap=$(obj.image3D_wrapId);
		
		var rName=[],
			rValue=[],
			rNamePos=[],
			left,top,tempR;
		for(var i in obj.image3D_images){
			rName.push(i);
			rValue.push(obj.image3D_images[i]);
			left=parseInt($(i).style.left);
			top=parseInt($(i).style.top);
			
			tempR=[left,top];
			rNamePos.push(tempR);
		}
		
		var wrapPosKey=false,
			wrapLeft,
			wrapTop;
		
        bind(wrap, 'mousemove', function(e){
			if(!wrapPosKey){
				var getPos = getPosition(wrap);
	            wrapLeft = getPos.left;
	            wrapTop = getPos.top;
				
				wrapPosKey=true;
			}

	        var getMouseValue=getMouse(e),
				x = getMouseValue.x,
	            y = getMouseValue.y,
	            m = x - wrapLeft,
	            n = y - wrapTop;
           	
			imagesMove(rName,rValue,rNamePos,m,n);
        });
		
        bind(wrap, 'mouseout', function(e){
			wrapPosKey=false;
        });
	};
	
})();
