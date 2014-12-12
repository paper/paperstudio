/*
 * @author paper
 */

function YHAlert(arg){
    var obj = arg ||{}, 
		msg = obj.msg || '你没有写提示内容!', 
		bd = document.getElementsByTagName('body')[0], 
		time = obj.time || 2000, 
 		way = obj.way == 'leftToRight' ? 'left' : 'top',
 	$ = function(id){
        return typeof id == 'string' ? document.getElementById(id) : id;
    }, 
	html = '<div id="YHAlert" style="visibility:hidden;"><div id="YHAlert_in">' +
    '<p id="YHAlert_p">' +
    msg +
    '</p>' +
    '</div></div>', 
	asynInnerHTML = function(HTML, doingCallback, endCallback){
        var temp = document.createElement('div'), 
			frag = document.createDocumentFragment();
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
	        div = document.createElement('div'),
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
            height: document.documentElement.clientHeight, 
            width: document.documentElement.clientWidth 
        }
    },
	getMax = function(){
        var dd = document.documentElement;
        return {
            height: Math.max(dd.scrollHeight, dd.clientHeight),
            width: Math.max(dd.scrollWidth, dd.clientWidth)
        }
    },
	getScroll = function(){
        return {
            top: Math.max(document.documentElement.scrollTop, document.body.scrollTop),
            left: Math.max(document.documentElement.scrollLeft, document.body.scrollLeft)
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
	fIn = function(elem, callback){
        var step = 3;
        setOpacity(elem, 0);
        elem.style.visibility = 'visible';
        elem.style[way] = parseInt(elem.style[way]) - 100 / step + 'px';
		
        var opacity = 0, t = setInterval(function(){
            setOpacity(elem, opacity);
            if (opacity >= 100) {
                setOpacity(elem, 100);
                clearInterval(t);
                if (callback) callback.call(elem);
            }
            opacity += step;
            elem.style[way] = parseInt(elem.style[way]) + 1 + 'px';
        }, 1);
    }, 
	fOut = function(elem, callback){
        elem.style.visibility = 'visible';
        var step = 3, opacity = 100, t = setInterval(function(){
            setOpacity(elem, opacity);
            if (opacity <= 0) {
                setOpacity(elem, 0);
                elem.style.visibility = 'hidden';
                clearInterval(t);
                if (callback) callback.call(elem);
            }
            opacity -= step;
            elem.style[way] = parseInt(elem.style[way]) + 1 + 'px';
        }, 1);
    };
    
    (function(){
        while ($('YHAlert')) {
            remove($('YHAlert'));
        };
        
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
				pos=ie==6?'absolute':'fixed',
				t=ie==6?parseInt(st + h / 2 - YHAlert_height * 6):parseInt(h / 2 - YHAlert_height * 6);
				
            setStyle(YHAlert, {
				'borderRadius': '5px',
                'MozBorderRadius': '5px',
                'WebkitBorderRadius': '5px',
                'boxShadow': '0 0 3px #ccc',
                'MozBoxShadow': '0 0 3px #ccc',
                'WebkitBoxShadow': '0 0 3px #ccc',
                'left': parseInt(w / 2 - 80) + 'px',
                'top': t+'px',
                'position': pos,
                'width': '160px',
                'backgroundColor': '#F3F7FD',
                'border': '1px solid #6ed3e3',
                'zIndex': '99999'
            });
			
			setStyle(YHAlert_in, {
              'borderRadius': '5px',
              'MozBorderRadius': '5px',
              'WebkitBorderRadius': '5px',
			  'backgroundColor':'#fefefe',
			  'padding':'15px 10px'
            });
			
            setStyle(YHAlert_p, {
                'textAlign': 'left',
                'fontSize': '14px',
                'margin': '0',
                'color': '#000',
                'lineHeight': '140%'
            });
            
            fIn(YHAlert, function(){
                setTimeout(function(){
                    fOut(YHAlert, function(){
                        remove(YHAlert);
                    });
                }, time);
            });
        });
    }());
};
