/*
  @Author paper
  @Date 2012-5-4
  
  表格
*/

var PTable=(function(window){
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
	
	var bind=(function(){
		var $=function(id){
			return typeof id=='string'?document.getElementById(id):id;
		},

		w3c=function(elem,type,fn){
			$(elem).addEventListener(type,fn,false);
		},

		IE=function(elem,type,fn){
			$(elem).attachEvent('on'+type,fn);
		},

		DOM=function(elem,type,fn){
			$(elem)['on'+type]=fn;
		};

		return function(elem, type, callback){
			var el = $(elem);
			
			var fn=function(e){
				return callback.call(el,e || window.event);
			};
			
			try {
				el.addEventListener(type, fn, false);
				return w3c;
			} catch (e) {
				try {
					el.attachEvent('on' + type, fn);
					return IE;
				} catch (e) {
					el['on' + type] = fn;
					return DOM;
				}
			}
		};
	})();
	
	return function(tableId){
		var tableElem=typeof tableId==="string" ? document.getElementById(tableId) : tableId;
		
		var trElems=tableElem.getElementsByTagName("tr");
		
		if(isIE==6){
			for(var i=0,len=trElems.length;i<len;i++){
				(function(i){
					bind(trElems[i],"mouseover",function(){
						this.className="hover";
					});
					
					bind(trElems[i],"mouseout",function(){
						this.className="";
					});
				})(i);
			}
		}//end if ie=6
		
	};
})(window);

