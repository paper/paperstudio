/*
 * @author paper
 */
var tip=(function(){
	var setStyle = function(elem, obj){
		for (var i in obj) {
			elem.style[i] = obj[i];
		}
	},
	
	bind=function(elem,type,fn){
        elem.addEventListener ? //FF
         	elem.addEventListener(type, fn, false) : 
		 	elem.attachEvent ? //IE
         		elem.attachEvent('on' + type, fn) : 
				elem['on' + type] = function(e){
            		fn(e);
        		};
	},
	
	f = function(o){
		var o=o||{},
		def={
			bgColor:o.bgColor || '#ffffaa',
			content:o.content || '正在加载。。。',	
			padding:o.padding || '5px',
			color:o.color || '#000',
			fontWeight:o.fontWeight || 'bold'
		},
		
		bd=document.getElementsByTagName('body')[0],
		
		spanTip = document.createElement('span');
		
		setStyle(spanTip,{
			'backgroundColor':def.bgColor,
			'padding':def.padding,
			'color':def.color,
			'fontWeight':def.fontWeight,
			'position':'absolute',
			'left':'50%',
			'zIndex':'9999',
			'fontSize':'12px'
		});
		
		spanTip.innerHTML=def.content;
		
		//找到所有不带target='_blank'的a
		var allLink=document.getElementsByTagName('a'),
			noJumpLink=[];
			
		for(var i=0,len=allLink.length;i<len;i++){
			var tempLink=allLink[i],
				relMsg=tempLink.getAttribute('rel');
			
			if(relMsg && relMsg.toLowerCase()=='hytip' && tempLink.getAttribute("target")!='_blank'){
				noJumpLink.push(tempLink);
			}
		}

		if(noJumpLink.length!=0){
			for(var j=0,l=noJumpLink.length;j<l;j++){
				(function(k){
					bind(noJumpLink[k],'click',function(){
						bd.appendChild(spanTip);
						var scroll_top = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
							w=spanTip.offsetWidth;
						setStyle(spanTip,{
							'top':scroll_top+5+'px',
							'marginLeft':-w/2+'px'
						});
						
						window.onunload=function(){
							spanTip.parentNode.removeChild(spanTip);
						};
					});
				})(j);
			}
		}
	};
	
	return f;
})();
tip();
