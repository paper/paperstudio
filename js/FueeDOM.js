/*
 * @Author paper
 * @Email: zhang.binjue@gmail.com
 */
//获取元素节点的宽度，高度，相对document的位置
//都是没有单位的，默认是px
(function(window, undefined){
    var doc = document, FueeDOM = window.FueeDOM = function(name){
        return new FueeDOM.fn(name);
    };
    
    FueeDOM.fn = FueeDOM.prototype = function(name){
		this.elem=typeof name==='string' ? doc.getElementById(name) : name;
    };
    
    FueeDOM.fn.prototype = {
        css: function(prop){
            var elem = this.elem;
            
            if (typeof prop == "string") {
                
                if (elem.nodeType != 1) return;
                
                if (elem.style[prop]) return elem.style[prop];
                else if (elem.currentStyle) {
                    //IE
                    if (prop == "float") prop = "styleFloat";
                    
                    return elem.currentStyle[prop];
                } else if (doc.defaultView && doc.defaultView.getComputedStyle) {
                    //W3C
                    if (prop == "float") prop = "cssFloat";
                    
                    if (prop != "display" && (elem.style.display == "none" || doc.defaultView.getComputedStyle(elem, null)["display"] == "none")) {
                        FueeDOM(elem).bestDisplay();
                        var t = doc.defaultView.getComputedStyle(elem, null)[prop];
                        elem.style.display = "none";
                        return t;
                    }
                    
                    return doc.defaultView.getComputedStyle(elem, null)[prop];
                } else { return null; }
            } else {
                FueeDOM(elem).each(function(){
                    for (var i in prop) {
                        if (i == "opacity") this.style.filter = "alpha(opacity=" + prop[i] * 100 + ")";
                        this.style[i] = prop[i];
                    }
                });
                
                return FueeDOM(elem);
            }
        },
        
        each: function(callback){
            return FueeDOM.each(this.elem, callback);
        },
        
        //这个函数得到的位置是相对body的位置，如果它的父亲节点还有relative或者absolute的话，还得注意它最近父亲节点的位置
        //the elem is single
        getPosition: function(){
            var elem = this.elem, 
				ua = navigator.userAgent.toLowerCase();
            if (!elem.parentNode) return false;
            
            var parent = null, pos = [], box;
            
            //IE ,ff,chrome
            if (elem.getBoundingClientRect) {
                box = elem.getBoundingClientRect();
                var scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop), 
					scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
				
                return {
                    left: box.left + scrollLeft,
                    top: box.top + scrollTop
                };
            }            
			// gecko
            else if (doc.getBoxObjectFor) {
                box = doc.getBoxObjectFor(el);
                var borderLeft = (elem.style.borderLeftWidth) ? parseInt(elem.style.borderLeftWidth) : 0;
                var borderTop = (elem.style.borderTopWidth) ? parseInt(elem.style.borderTopWidth) : 0;
                pos = [box.x - borderLeft, box.y - borderTop];
            }            
			// safari
            else {
                pos = [elem.offsetLeft, elem.offsetTop];
                parent = elem.offsetParent;
                
                if (parent != elem) {
                    while (parent) {
                        pos[0] += parent.offsetLeft + parseInt(FueeDOM(parent).css("borderLeft")) || 0;
                        pos[1] += parent.offsetTop + parseInt(FueeDOM(parent).css("borderTop")) || 0;
                        parent = parent.offsetParent;
                    }
                }
                
                if (ua.indexOf('opera') != -1 ||
                (ua.indexOf('safari') != -1 && elem.style.position == 'absolute')) {
                    pos[0] -= doc.body.offsetLeft;
                    pos[1] -= doc.body.offsetTop;
                }
            }
            
            parent = elem.parentNode;
            // account for any scrolled ancestors
            while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
                pos[0] -= parent.scrollLeft;
                pos[1] -= parent.scrollTop;
                if (parent.parentNode) {
                    parent = parent.parentNode;
                } else {
                    parent = null;
                }
            }
            
            return {
                left: pos[0],
                top: pos[1]
            };
        },
        
        getElemHeightWidth: function(){
            var elem = this.elem;
            
            return {
				height: elem.offsetHeight || parseInt(FueeDOM(elem).css("height")),
				width: elem.offsetWidth || parseInt(FueeDOM(elem).css("width"))
			}
        },
        
        getElemContentHeightWidth: function(){
            var elem = this.elem, 
				fourWay = ["Left", "Right", "Top", "Bottom"], 
				padding = [], 
				border = [];
           
            for (var i = 0; i < fourWay.length; i++) {
                padding[i] = parseInt(FueeDOM(elem).css("padding" + fourWay[i])) || 0;
                border[i] = parseInt(FueeDOM(elem).css("border" + fourWay[i] + "Width")) || 0;
            }
			
            return {
                width: FueeDOM(elem).getElemHeightWidth().width - padding[0] - padding[1] - border[0] - border[1],
                height: FueeDOM(elem).getElemHeightWidth().height - padding[2] - padding[3] - border[2] - border[3]
            }

        },
		
		height:function(){
			return FueeDOM(this.elem).getElemContentHeightWidth().height;
		},
		innerHeight:function(){
			
		},
		outerHeight:function(){
			return FueeDOM(this.elem).getElemHeightWidth().height;
		},
		
		width:function(){
			return FueeDOM(this.elem).getElemContentHeightWidth().width;
		},
		innerWidth:function(){
			
		},
		outerWidth:function(){
			return FueeDOM(this.elem).getElemHeightWidth().width;
		},
		
		left:function(){
			return FueeDOM(this.elem).getPosition().left;
		},
		
		top:function(){
			return FueeDOM(this.elem).getPosition().top;
		}
    };//end FueeDOM.fn.prototype
    
    FueeDOM.each = function(r, callback){
        var tr = [];
       
        r.length === undefined ? tr.push(r) : tr = r;
        
        var i = 0, length = tr.length;
       
        for (var value = tr[0]; i < length && callback.call(value, i) !== false; value = tr[++i]) {}
    };
})(window, undefined);
