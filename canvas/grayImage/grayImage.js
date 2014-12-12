/*
 * @author paper
 */
var garyImage=(function(){
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
	
	function createCanvas(){
		var cvs=document.createElement('canvas');
		return cvs;
	};
	
	function prev(elem,num){
        var num = num || 1;
        
		if (typeof elem.previousElementSibling === 'undefined') {
			while (num != 0) {
				do {
					elem = elem.previousSibling;
				} while (elem && elem.nodeType != 1);
				num--;
			}
		}else{
			while (num != 0) {
				elem = elem.previousElementSibling;
				num--;
			}
		}
		
        return elem ? elem : null;
    };
	
	function show(elem){
		elem.style.display='';
	};
	
	function hide(elem){
		elem.style.display='none';
	}
	
	//@elem img's DOM or img's id
	return {
		discolor: function(elem){
			var elem = typeof elem == 'string' ? document.getElementById(elem) : elem;
			
			if (isIE) {
				elem.style.filter = 'gray';
			} else {
				//如果生成过，就使用原来的
				var prevNode=prev(elem);
				
				if(prevNode && prevNode.nodeName=='CANVAS' && prevNode.id==elem.src){
					show(prevNode);
					hide(elem);
					return true;
				}
				
				var cvs = createCanvas();
				var context = cvs.getContext('2d');
				var img = new Image();
				
				cvs.id=elem.src;
				cvs.className=elem.className;
				
				img.addEventListener('load', function(){
					var h = this.height,
						w = this.width;
					
					cvs.width = w;
					cvs.height = h;
					
					context.drawImage(this, 0, 0);
					
					var imgd = context.getImageData(0, 0, w, h), 
						pix = imgd.data;
					
					for (var i = 0, n = pix.length; i < n; i += 4) {
						var m = (pix[i] * 3 + pix[i + 1] * 6 + pix[i + 2]) / 10;
						
						pix[i] = m;
						pix[i + 1] = m;
						pix[i + 2] = m;
					}
					
					context.putImageData(imgd, 0, 0);
				}, false);
				img.src = elem.src;
				
				hide(elem);
				elem.parentNode.insertBefore(cvs, elem);
			}
		},
		
		restore:function(elem){
			if (isIE) {
				if(elem.style.filter=='gray'){
					elem.style.filter = '';
				}
			} else {
				var prevNode = prev(elem);
				
				if (elem.style.display == 'none' && prevNode.nodeName == 'CANVAS' && prevNode.id==elem.src) {
					hide(prevNode);
					show(elem);
				}
			}
		}
	}
})();
