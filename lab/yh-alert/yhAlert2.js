/*
 * @author paper
 * 
 * 方向可以自己组织
 * top->T,down->D,left->L,right-R
 * 第1个字母和第3个字母:form->F,to-T
 * 
 * 比如：FTTT 表示from top to top
 * 		FLTD 表示from left to down
 */
var YHAlert=(function(){
	var D=document,
	$ = function(id){
        return typeof id == 'string' ? D.getElementById(id) : id;
    },
	asynInnerHTML = function(HTML, doingCallback, endCallback){
        var temp = D.createElement('div'), 
			frag = D.createDocumentFragment();
        temp.innerHTML = HTML;
        (function(){
            if (temp.firstChild) {
                frag.appendChild(temp.firstChild);
                doingCallback(frag);
                setTimeout(arguments.callee, 0);
            } else {
                if (endCallback) endCallback(frag);
            }
        })();
    }, 
	ie = (function(){
	    var undef,
	        v = 3,
	        div = D.createElement('div'),
	        all = div.getElementsByTagName('i');
	 
	    while (
	        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	        all[0]
	    );
	 
	    return v > 4 ? v : undef;
	}()),
	remove = function(elem){
        if (elem.parentNode) elem.parentNode.removeChild(elem);
    }, 
	getArea = function(){
        return {
            height: D.documentElement.clientHeight, 
            width: D.documentElement.clientWidth 
        }
    },
	getMax = function(){
        var dd = D.documentElement;
        return {
            height: Math.max(dd.scrollHeight, dd.clientHeight),
            width: Math.max(dd.scrollWidth, dd.clientWidth)
        }
    },
	getScroll = function(){
        return {
            top: Math.max(D.documentElement.scrollTop, D.body.scrollTop),
            left: Math.max(D.documentElement.scrollLeft, D.body.scrollLeft)
        }
    }, 
	setStyle = function(elem, styles){
        for (var i in styles) {
            elem.style[i] = styles[i];
        }
    },   
    setOpacity = function(elem, level){
        elem.filters ? elem.style.filter = 'alpha(opacity=' + level + ')' : elem.style.opacity = level / 100;
    }, 
	step=5,max=100,
	fIn = function(elem,doingCallback,endCallback){
        elem.style.visibility = 'visible';
		setOpacity(elem,0);
        var opacity = 0, 
			t = setInterval(function(){
	            setOpacity(elem, opacity);
				
	            if (opacity >= max) {
	                setOpacity(elem, max);
	                clearInterval(t);
	                if (endCallback) endCallback.call(elem);
	            }
	            opacity += step;
				if (doingCallback) doingCallback.call(elem);
        	}, 10);
    }, 
	fOut = function(elem,doingCallback,endCallback){
        elem.style.visibility = 'visible';
        var opacity = max, 
			t = setInterval(function(){
	            setOpacity(elem, opacity);
	            if (opacity <= 0) {
	                setOpacity(elem, 0);
	                elem.style.visibility = 'hidden';
	                clearInterval(t);
	                if (endCallback) endCallback.call(elem);
	            }
	            opacity -= step;
				if (doingCallback) doingCallback.call(elem);
	        }, 10);
    },
	
	FT=function(elem,callback){
		elem.style.top = parseInt(elem.style.top) - 100 / step + 'px';
		var temp=parseInt(elem.style.top);
		
		fIn(elem,function(){
			this.style.top = (++temp) + 'px';
		},function(){
			if(callback) callback.call(elem);
		});
	},
	TT=function(elem,callback){
		var temp=parseInt(elem.style.top);
		
		fOut(elem,function(){
			this.style.top = (--temp) + 'px';
		},function(){
			if(callback) callback.call(elem);
		});
	},
	
	FL=function(elem,callback){
		elem.style.left = parseInt(elem.style.left) - 100 / step + 'px';
		var temp=parseInt(elem.style.left);
		
		fIn(elem,function(){
			this.style.left = (++temp) + 'px';
		},function(){
			if(callback) callback.call(elem);
		});
	},
	TL=function(elem,callback){
		var temp=parseInt(elem.style.left);
		
		fOut(elem,function(){
			this.style.left = (--temp) + 'px';
		},function(){
			if(callback) callback.call(elem);
		});
	},
	
	FR=function(elem,callback){
		elem.style.left = parseInt(elem.style.left) + 100 / step + 'px';
		var temp=parseInt(elem.style.left);
		
		fIn(elem,function(){
			this.style.left = (--temp) + 'px';
		},function(){
			if(callback) callback.call(elem);
		});
	},
	TR=function(elem,callback){
		var temp=parseInt(elem.style.left);
		
		fOut(elem,function(){
			this.style.left = (++temp) + 'px';
		},function(){
			if(callback) callback.call(elem);
		});
	},
	
	FD=function(elem,callback){
		elem.style.top = parseInt(elem.style.top) + 100 / step + 'px';
		var temp=parseInt(elem.style.top);
		
		fIn(elem,function(){
			this.style.top = (--temp) + 'px';
		},function(){
			if(callback) callback.call(elem);
		});
	},
	TD=function(elem,callback){
		var temp=parseInt(elem.style.top);
		
		fOut(elem,function(){
			this.style.top = (++temp) + 'px';
		},function(){
			if(callback) callback.call(elem);
		});
	};
	
	return function(obj){
		var obj=obj || {},
			msg = obj.msg || '你没有填写任何提示内容!', 
			bd = D.getElementsByTagName('body')[0], 
			time = obj.time || 2000,
			way = obj.way || 'FTTD',	//default: from top to down
			html = '<div id="YHAlert" style="visibility:hidden;"><div id="YHAlert_in">' +
				    '<p id="YHAlert_p">' +
				    msg +
				    '</p>' +
				    '</div></div>';
		
		while ($('YHAlert')){
			remove($('YHAlert'));
		}
        
        asynInnerHTML(html, function(f){
            bd.appendChild(f);
        }, function(){
			var YHAlert = $('YHAlert'), 
				YHAlert_in = $('YHAlert_in'), 
				YHAlert_p = $('YHAlert_p'), 
				w = getArea().width, 
				h = getArea().height, 
				st = getScroll().top, 
				YHAlert_height = parseInt(YHAlert.offsetHeight), 
				pos = ie == 6 ? 'absolute' : 'fixed', 
				t = ie == 6 ? parseInt(st + h / 2 - YHAlert_height) : parseInt(h / 2 - YHAlert_height);
			
			setStyle(YHAlert, {
				'borderRadius': '5px',
				'MozBorderRadius': '5px',
				'WebkitBorderRadius': '5px',
				'boxShadow': '0 0 3px #ccc',
				'MozBoxShadow': '0 0 3px #ccc',
				'WebkitBoxShadow': '0 0 3px #ccc',
				'left': parseInt(w / 2 - 80) + 'px',
				'top': t + 'px',
				'position': pos,
				'width': '160px',
				'backgroundColor': '#F3F7FD',
				'border': '2px solid #6ed3e3',
				'zIndex': '99999',
				'visibility':'hidden'
			});
			
			setStyle(YHAlert_in, {
				'borderRadius': '5px',
				'MozBorderRadius': '5px',
				'WebkitBorderRadius': '5px',
				'backgroundColor': '#fefefe',
				'padding': '15px 10px'
			});
			
			setStyle(YHAlert_p, {
				'textAlign': 'left',
				'fontSize': '14px',
				'margin': '0',
				'color': '#000',
				'lineHeight': '140%'
			});
			
			var ways=['FT','TT','FL','TL','FR','TR','FD','TD'],
				firstDo=way.slice(0,2),
				secondDo=way.slice(2,4);
			
			for(var i in ways){
				if(firstDo==ways[i]){
					break;
				}
				
				if(firstDo!=ways[i] && i==ways.length-1){
					throw Error('Error:your way\'s parameter is wrong! Check it!');
				}
			}
			
			for(var i in ways){
				if(secondDo==ways[i]){
					break;
				}
				
				if(secondDo!=ways[i] && i==ways.length-1){
					throw Error('Error:your way\'s parameter is wrong! Check it!');
				}
			}
			
			eval(firstDo)(YHAlert,function(){
				setTimeout(function(){
					if(secondDo){
						eval(secondDo)(YHAlert);
					}
				},time);
			});
		});
	};
})();
