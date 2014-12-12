/*
 * author		zhang binjue
 * blog			http://hi.baidu.com/paperstudio
 * copyright	No Rights Reserved :)
 * version		1.3
 * 
 * 2010-11-29
 * Add:  unbind function
 * 支持:function f(){};
 * 不支持:var f=function(){}; 
 */
(function(){
    var undefined, D = document, Fuee = window.Fuee = function(name){
        if (typeof name == "string" && name.charAt(0) == "#") {
            return new Fuee.fn(name.slice(1, name.length));
        } else {
            return new Fuee.fn(name);
        }
    };
    
    Fuee.fn = Fuee.prototype = function(name){
        if (typeof name == "string") {
            this.name = name;
            this.elem = D.getElementById(name);
        } else {
            //name is node
            this.elem = name;
        }
        
        if (!this.elem) {
            throw new Error('Fuee name is not defined!');
			return false;
        }
    };
    
    Fuee.getVersion = function(){
        return "1.3";
    };
    
    Fuee.fn.prototype = {
        css: function(prop){
            //prop like: paddingTop
            var elem = this.elem;
            
            //get elem css
            if (typeof prop == "string") {
                //make sure that elem is node,html's parentNode is document which is haven't style attribute
                if (elem.nodeType != 1) return;
                
                if (elem.style[prop]) return elem.style[prop];
                else if (elem.currentStyle) {
                    //IE
                    if (prop == "float") prop = "styleFloat";

                    return elem.currentStyle[prop];
                } else if (D.defaultView && D.defaultView.getComputedStyle) {
                    //W3C
                    if (prop == "float") prop = "cssFloat";
					
                    if (prop != "display" && (elem.style.display == "none" || D.defaultView.getComputedStyle(elem, null)["display"] == "none")) {
                        Fuee(elem).bestDisplay();
                        var t = D.defaultView.getComputedStyle(elem, null)[prop];
                        elem.style.display = "none";
                        return t;
                    }
                    
                    return D.defaultView.getComputedStyle(elem, null)[prop];
                } else {
                    return null;
                }
            } else {
                //set elem css
                //prop must be object
                Fuee(elem).each(function(){
                    for (var i in prop) {
                        if (i == "opacity") this.style.filter = "alpha(opacity=" + prop[i] * 100 + ")";
                        this.style[i] = prop[i];
                    }
                });
                
                return Fuee(elem);
            }
        },
        
        each: function(callback){
            return Fuee.each(this.elem, callback);
        },
        
        resetCSS: function(prop){
            var old = {}, elem = this.elem;
            
            for (var i in prop) {
                old[i] = Fuee(elem).css(i);
                elem.style[i] = prop[i];
            }
            
            return old;
        },
        
        //FueeObject.addClass('c1'); 	//add one
        //FueeObject.addClass('c1 c2'); //add two
        addClass: function(newClass){
            var elem = this.elem, newClass = newClass.split(' ');
            
            Fuee(elem).each(function(){
                var oldClass = this.className;
                
                if (oldClass == '') {
                    this.className = newClass.join(' ');
                } else {
                    oldClass = oldClass.split(' ');
                    
                    var pass = '', i, j, oldClassLen = oldClass.length, newClassLen = newClass.length;
                    
                    for (i = 0; i < newClassLen; i++) {
                        for (j = 0; j < oldClassLen; j++) {
                            //if new class is same to old,then do nothing
                            if (oldClass[j] == newClass[i]) break;
                            
                            if (j == oldClassLen - 1 && oldClass[j] != newClass[i]) {
                                pass += ' ' + newClass[i];
                            }
                        }
                    }
                    
                    this.className = oldClass.join(' ') + pass;
                }
            });
            
            return Fuee(elem);
        },
        
        //FueeObject.removeClass();			//remove all
        //FueeObject.removeClass("c1");		//remove one 
        //FueeObject.removeClass("c1 c2");	//remove two
        removeClass: function(name){
            var elem = this.elem;
            
            if (name === undefined) {
                Fuee(elem).each(function(){
                    this.className = "";
                });
            } else {
                Fuee(elem).each(function(){
                    var _name=name,
						oldClass = this.className;
                    
                    if (oldClass != '') {
                        oldClass = oldClass.split(" ");
                        _name = _name.split(" ");
                        
                        for (var i = 0; i < _name.length; i++) {
                            for (var j = 0; j < oldClass.length; j++) {
                                if (oldClass[j] == _name[i]) {
                                    oldClass.splice(j, 1);
                                    break;
                                }
                            }
                        }
                        
                        this.className = oldClass.join(" ");
                    }
                });
            }
            
            return Fuee(elem);
        },
        
        //@level 0-100
        setOpacity: function(level){
            Fuee(this.elem).each(function(){
                this.style.filter = this.filters ? this.style.filter = 'alpha(opacity=' + level + ')' : this.style.opacity = level / 100;
            });
        },
        
		//return 0-100
		getOpacity:function(){
			var elem=this.elem,
				pos=Fuee(elem).css('opacity'),
				fi=Fuee(elem).css('filter'),
				opa;
			
			if(Fuee.isIE){
				if (/^alpha\(opacity/.test(fi)) {
					opa=parseInt(fi.match(/(\d)/g).join(''));
				}else{
					opa=100;
				}
			}else{
				opa=pos*100;
			}
			
			return opa;
		},
		
        //form YUI
        //这个函数得到的位置是相对body的位置，如果它的父亲节点还有relative或者absolute的话，还得注意它最近父亲节点的位置
        //the elem is single
        getPosition: function(){
            var elem = this.elem, 
				ua = navigator.userAgent.toLowerCase(), 
 				elemNone = null; //check the elem is hide

            if (!elem.parentNode) return false;
            
			 //09-12-15	if the elem is hide,so show it
            if (Fuee(elem).css("display") == "none") {
                Fuee(elem).bestDisplay(); 
                elemNone = true;
            }
            
            var parent = null, pos = [], box;
            
            //IE ,ff,chrome
            if (elem.getBoundingClientRect) {
                box = elem.getBoundingClientRect();
                var scrollTop = Math.max(D.documentElement.scrollTop, D.body.scrollTop), 
					scrollLeft = Math.max(D.documentElement.scrollLeft, D.body.scrollLeft);
                
                if (elemNone)  elem.style.display = "none";
                
                return {
                    left: box.left + scrollLeft,
                    top: box.top + scrollTop
                };
            } 
			// gecko
			else if (D.getBoxObjectFor) {
                box = D.getBoxObjectFor(el);
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
                        pos[0] += parent.offsetLeft + parseInt(Fuee(parent).css("borderLeft")) || 0;
                        pos[1] += parent.offsetTop + parseInt(Fuee(parent).css("borderTop")) || 0;
                        parent = parent.offsetParent;
                    }
                }
                
                if (ua.indexOf('opera') != -1 ||
                (ua.indexOf('safari') != -1 && elem.style.position == 'absolute')) {
                    pos[0] -= D.body.offsetLeft;
                    pos[1] -= D.body.offsetTop;
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
            
            if (elemNone) elem.style.display = "none";
			
            return {
                left: pos[0],
                top: pos[1]
            };
        },

		//get the elem,return DOM
       getElem: function(num){
            if (!this.elem) return;
			var elem=this.elem,
				result;
			
			if(elem.length){
				num === undefined ? result=elem : result=elem[num];
			}else{
				result=elem;
			}
			
			return result;
        },
        
        //得到elem数组中的一个Fuee对象节点
		//return elem's Fuee object
        get: function(num){
            var elem = this.elem, num = num || 0;

            if (elem.length) {
                return Fuee(elem[num]);
            } else if(elem.nodeType==1){
				return Fuee(elem);
            }else{
				 throw new Error('elem is not DOM element');
				 return false;
			}
        },
        
        /* 寻找该节点下面的元素
         * 支持标签与class的层级查找
         *
         * FueeObject.find("p");						//即D.getElementById("divId").getElementsByTagName("p");
         * FueeObject.find(".classname");				//寻找divId下面带有classname的class的所有元素
         * FueeObject.find("p.classname");				//寻找divId下面带有classname的class的所有p元素
         * FueeObject.find("p.classname span");			//寻找divId下面带有classname的class的所有p元素下面的span
         * FueeObject.find("p.classname span",2);		//寻找divId下面带有classname的class的所有p元素下面的 第3个span
         */
        find: function(selector, num){
            var elem = this.elem, 
				result = [], 
				//根据tagname来获取它的节点数组
 				parts = selector.split(" "), 
				getTagName = function(parent, tagname){
	                var r = [];
	                
	                Fuee(parent).each(function(){
	                    var c = Fuee(this).getElem().getElementsByTagName(tagname);
	                    if (c.length != 0) r = r.concat(Fuee.realArray(c));
	                });
	                
	                return r;
	            },
				part = parts.shift(); //传入的参数，进行查找的第一部分
				 
            //no class
            if (part.indexOf(".") == -1) {
                result = getTagName(elem, part);
                
                if (result.length == 0) return false;
                
                return num === undefined ? 
						parts.length == 0 ? Fuee(result) : Fuee(result).find(parts.join(' ')) : 
						parts.length == 0 ? Fuee(result[num]) : Fuee(result).find(parts.join(' '), num);
            } 
			//hava class
 			else {
                var p = part.split("."), 
					partTagName = p[0] == '' ? '*' : p[0], 
					partClassName = p[1], 
					r = getTagName(elem, partTagName);
                
                //先得到所有的元素，然后再提取出className的元素
                Fuee(r).each(function(){
                    if (this.className.indexOf(partClassName) > -1) {
                        result.push(this);
                    }
                });
                
                if (result.length == 0) return false;
                return num === undefined ? 
						parts.length == 0 ? Fuee(result) : Fuee(result).find(parts.join(' ')) : 
						parts.length == 0 ? Fuee(result[num]) : Fuee(result).find(parts.join(' '), num);
            }
        },
        
        /*
         * FueeObject.bind("click",function(node){//....});
         * study jamespadolsey
         * don't support: mouseenter & mouseleave
         * 
         * FueeObject.bind("click",function(){});
         * or 
         * FueeObject.bind({
		 *	click:function(){},
		 *	mouseover:function(){}
		 * });
         */
         bind: function(obj){
            var elem = this.elem, 
				events = "blur,focus,load,resize,scroll,unload,click,dblclick," +
           				"mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," +
            			"change,select,submit,keydown,keypress,keyup,error",
                f = function(elem, type, callback){
					if (events.indexOf(type) == -1) {
                        throw new Error('the event\'s name is error.check it!');
                        return false;
                    }
					
                    var name = Fuee.getFunctionName(callback);
				
                    if (!name) {
                        Fuee(elem).each(function(i){
                            var _this = this, fn = function(e){
                                return callback.call(_this, window.event || e);
                            };
                            
                            if (_this.getI === undefined) {
                                _this.getI = i;
                            }
                            
                            Fuee.forBind(_this, type, fn);
                        });
                    } else {
                        Fuee(elem).each(function(i){
                            var _this = this;
                            _this.tempBindData = _this.tempBindData || {};
                            
                            _this.tempBindData[name] = function(e){
                                return callback.call(_this, window.event || e);
                            };
                            
                            if (_this.getI === undefined) {
                                _this.getI = i;
                            }
                            
                            Fuee.forBind(_this,type, _this.tempBindData[name]);
                        });
                    }
                };
						
           	
            if (arguments.length == 2) {
				f(elem,arguments[0],arguments[1]);
            } else {
                for (var i in obj) {
					f(elem,i,obj[i]);
                }
            }
            
            return Fuee(elem);
        },

		unbind:function(obj){
			var elem = this.elem, 
				f = function(elem,type, fn){
					var name = Fuee.getFunctionName(fn);
					
					Fuee(elem).each(function(){
						var _this = this;
						
						try {
							_this.removeEventListener(type, _this.tempBindData[name], false);
						} catch (e) {
							try {
								_this.detachEvent('on' + type, _this.tempBindData[name]);
							} catch (e) {
								throw new Error('dom is not binded!');
							}
						}
					});
				};
			
			if(arguments.length==2){
				f(elem,arguments[0],arguments[1]);
			}else{
				for (var i in obj) {
					f(elem,i,obj[i]);
                }
			}
			
			return Fuee(elem);
		},
		
		//prev brother,default 1
        prev: function(num){
            var num = num || 1, elem = this.elem;
            
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
			
            return elem ? Fuee(elem) : null;
        },
        
		//prev all brother
        prevAll: function(){
            var nodes = [], elem = this.elem;
			
			if(!Fuee(elem.parentNode).first()) return null;
			var firstNode = Fuee(elem.parentNode).first().getElem();
            
			//if elem is not the parent's first child,then go on
			if (typeof elem.previousElementSibling === 'undefined') {
				while (elem != firstNode) {
					elem = elem.previousSibling;
					if (elem && elem.nodeType == 1) {
						nodes.push(elem);
					}
				}
			}else{
				while (elem != firstNode) {
					elem = elem.previousElementSibling;
					nodes.push(elem);
				}
			}
			
            return nodes.length == 0 ? null : Fuee(nodes);
        },
        
        //next brother,default 1
        next: function(num){
            var num = num || 1, elem = this.elem;
            
			if(typeof elem.nextElementSibling==='undefined'){
				while (num != 0) {
	                do {
	                    elem = elem.nextSibling;
	                } while (elem && elem.nodeType != 1);
	                
	                num--;
	            }
			}else{
				while (num != 0) {
	                elem = elem.nextElementSibling;
	                num--;
	            }
			}
			
			return elem ? Fuee(elem) : null;
        },
        
         //next all brother
        nextAll: function(){
            var nodes = [], elem = this.elem;
			
			if(!Fuee(elem).parent().last()) return null;
			var	lastNode = Fuee(elem).parent().last().getElem();
            
			//if elem is not the parent's last child,then go on
			if (typeof elem.nextElementSibling === 'undefined') {
				while (elem != lastNode) {
					elem = elem.nextSibling;
					if (elem && elem.nodeType == 1) {
						nodes.push(elem);
					}
				}
			}else{
				while (elem != lastNode) {
					elem = elem.nextElementSibling;
					nodes.push(elem);
				}
			}
            
            return nodes.length == 0 ? null : Fuee(nodes);
        },
        
       //the first child
        first: function(){
			var elem = this.elem;

			//firstElementChild is faster
			if(typeof elem.firstElementChild==='undefined'){
				elem = elem.firstChild;
            
           		return elem == null ? null : (elem && elem.nodeType != 1) ? Fuee(elem).next() : Fuee(elem);
			}else{
				var fc=elem.firstElementChild;
	
				return fc ? Fuee(fc) : null;
			}
        },
        
        //the last child
        last: function(){
			var elem = this.elem;
			
			if(typeof elem.lastElementChild==='undefined'){
				elem = elem.lastChild;
            
           		return elem == null ? null : (elem && elem.nodeType != 1) ? Fuee(elem).prev() : Fuee(elem);
			}else{
				var lc=elem.lastElementChild;
	
				return lc ? Fuee(lc) : null;
			}
        },
        
		//num>=1
		//children(1) means the first children
        children: function(num){			
			var children = [], 
				childNodes = this.elem.childNodes;
            for (var i = 0, l = childNodes.length; i < l; i++) {
                if (childNodes[i].nodeType == 1) {
                    children.push(childNodes[i]);
                }
            }
			return children.length == 0 ? 
						null : 
						num === undefined ? Fuee(children) : Fuee(children[num - 1]);
        },
        
		//the num parent,default 1
        parent: function(num){
            var num = num || 1, elem = this.elem;
            while (num--) {
                elem = elem.parentNode;
            }
            
            return elem ? Fuee(elem) : null;
        },
        
        //get the elem's all brother
        siblings: function(){
            var r1 = this.prevAll(), r2 = this.nextAll();
            
            if (r1 != null && r2 != null) return Fuee(r1.getElem().concat(r2.getElem()));
            else if (r1 == null && r2 != null) return r2;
            else if (r1 != null && r2 == null) return r1;
            else return null;
        },
        
        //remove elem
        remove: function(){
           var elem = this.elem;
           try{
		   		Fuee(elem).each(function(){
                    this.parentNode.removeChild(this);
                });
		   }catch(e){
		   		throw new Error(e);
				return false;
		   }
        },
        
        //empty elem
        empty: function(){
            var elem = this.elem;
            
			Fuee(elem).each(function(){
				while (this.firstChild) {
					this.removeChild(this.firstChild);
				}
			});

            return Fuee(elem);
        },
        
        //another innerHTML
        html: function(content){
            var elem = this.elem;
            
            if (content === undefined) {
                return elem.innerHTML;
            } else {
                elem.innerHTML = content.toString();
                return Fuee(elem);
            }
        },
        
		//get the elem's text,it is different to innerHTML
        //FueeObject.text();
        //FueeObject.text({getArray:true});
        //support XML
        text: function(oFuee){
            var r = [], elem = this.elem, tempText = this.forText(r, elem);
            
            if (oFuee === undefined) {
                return tempText.join('') == '' ? null : tempText.join('');
            } else if (oFuee.getArray === true) {
                return tempText.length == 0 ? null : tempText;
            }
        },
        
        forText: function(r, node){
            var nodeChildren = node.childNodes, len = nodeChildren.length;
            
            for (var i = 0; i < len; i++) {
                if (nodeChildren[i].nodeType == 1) {
                    this.forText(r, nodeChildren[i]); //递归
                }
                if (nodeChildren[i].nodeType == 3) {
                    var nodeChildrenValue = Fuee.trim(nodeChildren[i].nodeValue);
                    if (nodeChildrenValue != "") {
                        r.push(nodeChildrenValue);
                    }
                }
            }
            return r;
        },
        
        // set or get elem's attribute
        // FueeObject.attr("class");						//get elem's className
        // FueeObject.attr("id","idName");					//set id to 'idName'
        
        // var elems=FueeObject.children();					//suppose elems's length is 3
        // elems.attr("rel","love");						//elems's rel attribute are 'love'
        // elems.attr("rel",["love","hate","like"]);		//elems[0]'rel is 'love',elems[1]'rel is 'hate',elems[2]'rel is 'like'
        // elems.attr("rel",["love","hate"]);				//elems[0]'rel is 'love',elems[1]'rel is 'hate',elems[2]'rel is 'hate',and so on
        attr: function(name, value){
            if (name === undefined || typeof name != "string") return '';
            
            var elem = this.elem, 
				name = {
               		'for': 'htmlFor',
                	'class': 'className'
            	}[name] || name;
            
                if (value !== undefined) {
                    //if value is Array
                    if (!value.length) {
                        value = [value];
                    }
                    
                    Fuee(elem).each(function(i){
                        this[name] = value[i];
                        if (this.setAttribute) {
                            value[i] == undefined ? this.setAttribute(name, value[value.length - 1]) : this.setAttribute(name, value[i]);
                        }
                    });
                    
                    return Fuee(elem);
                }
                else { return elem[name] || elem.getAttribute(name) || ''; }
        },
        
        //把带html的string类型，转化为以string最外的节点为根节点
        stringToElem: function(content){
            //2010-01-13 change
            var odiv = D.createElement("div"), frag = D.createDocumentFragment();
            
            odiv.innerHTML = content;
            
            while (odiv.firstChild) {
                frag.appendChild(odiv.firstChild);
            }
            
            return frag;
        },
        
        //插入到节点里面内容的最后面
        //tbody不行，因为IE6的tbody的innerHTML是只读不可写的
        append: function(content){
            var elem = this.elem;
            //这个bug很严重，innerHTML会使得elem下面的html全部重写了，这样导致绑定的事件不能使用
            //typeof content == "string" ? elem.innerHTML += content : elem.appendChild(content);
            typeof content == "string" ? elem.appendChild(this.stringToElem(content)) : elem.appendChild(content);
            return Fuee(elem);
        },
        
        //插入到节点里面内容的最前面
        //如果content是里面有的节点，会像剪切一样剪切过来
        //insertBefore用法：fChild当为null时其效果与appendChild一样
        prepend: function(content){
            var elem = this.elem, fChild = elem.firstChild;
            
            typeof content == "string" ? elem.insertBefore(this.stringToElem(content), fChild) : elem.insertBefore(content, fChild);
            
            return Fuee(elem);
        },
        
        //插入到某个节点的下面
        after: function(content){
            var elem = this.elem, parent = elem.parentNode;
            
            content = typeof content == "string" ? this.stringToElem(content) : content;
            
            parent.firstChild == elem ? parent.appendChild(content) : parent.insertBefore(content, elem.nextSibling);
            
            return Fuee(elem);
        },
        
        //插入到某个节点的上面
        before: function(content){
            var elem = this.elem, parent = elem.parentNode;
            
            content = typeof content == "string" ? this.stringToElem(content) : content;
            
            parent.insertBefore(content, elem);
            
            return Fuee(elem);
        },
        
        //得到单个元素，当它隐藏时，那么让它显示的最佳display是什么
        //很明显，这里只能支持单个元素
        bestDisplay: function(){
            var elem = this.elem, 
				tagname = elem.tagName, 
				node = D.createElement(tagname);
            
            D.body.appendChild(node);
            var defaultDisplay = Fuee(node).css("display"); //得到elem那个元素默认的样式
            Fuee(node).remove();
            
            if (elem.currentStyle) {
                var outDisplay = elem.currentStyle["display"];
            } else {
                var outDisplay = D.defaultView.getComputedStyle(elem, null)["display"];
            }
            
            //内联样式有none
            if (elem.style.display == "none") {
                elem.style.display = "";
            }
 			
            //外联有none
            if (outDisplay == "none") {
                elem.style.display = defaultDisplay;
            }
            return Fuee(elem);
        },
        
	   /* --------------------------------------------------------------------------------------------
	    * 基本动画
	    * ----------------------------------------------------------------------------------------------*/
        hide: function(speed, callback){
            var elem = this.elem;
            
            //没有动画
            if (speed === undefined) {
                Fuee(elem).each(function(){
                    this._oldDisplay = Fuee(this).css("display");
                    this.style.display = "none";
                });
            } else {
                if (typeof speed === "string") {
                    speed = {
                        "fast": 2,
                        "normal": 5,
                        "slow": 10
                    }[speed];
                }
                
                speed = speed < 100 ? speed : 5;
                
                Fuee(elem).each(function(){
                    var self = this,
						$self=Fuee(self);
						
                    if ($self.css("display") == 'none') return;
					
                    var h = $self.getElemContentHeightWidth().height, 
						w = $self.getElemContentHeightWidth().width,
                    	oldCSSTest = self.style.cssText;
                    	
                   	self.style.overflow = "hidden";
					
					self._oldOpacity=$self.getOpacity();
					self._oldDisplay = $self.css("display");
					var	time=Math.random().toString(),
						pos=self._oldOpacity;
				
					self[time]=setInterval(function(){
						pos--;
						$self.css({
                            height: (pos / self._oldOpacity) * h + "px",
                            width: (pos / self._oldOpacity) * w + "px"
                        });
                        
                        $self.setOpacity(pos);
                        
                        if (pos == 0) {
							clearInterval(self[time]);
							
                            self.style.cssText = oldCSSTest;
                            self.style.display = "none";
                            if (callback) callback.call(self);
                        }
					},speed);
                });
            }
            
            return Fuee(elem);
        },
        
        show: function(speed, callback){
            var elem = this.elem;
            
            //没有动画
            if (speed === undefined) {
                Fuee(elem).each(function(){
                    var self = this;
                    
                    if (self._oldDisplay == undefined) {
                        Fuee(self).bestDisplay();
                    } else {
                        self._oldDisplay == 'none' ? Fuee(self).bestDisplay() : self.style.display = self._oldDisplay;
                    }
                });
            } else {
                if (typeof speed === "string") {
                    speed = {
                        "fast": 2,
                        "normal": 5,
                        "slow": 10
                    }[speed];
                }
                speed = speed < 100 ? speed : 5;
                
                Fuee(elem).each(function(){
                    var self = this,
						$self=Fuee(self);
                    
                    if ($self.css("display") == 'block' || $self.css("display") == 'inline') return;
                    var oldCSSTest = self.style.cssText,
                   		h = $self.getElemContentHeightWidth().height, 
						w = $self.getElemContentHeightWidth().width,
                    	time=Math.random().toString(),
						max=self._oldOpacity?self._oldOpacity:100,
						pos=0;
						
                    Fuee(self).css({
                        height: "0",
                        overflow: "hidden",
                        opacity: "0"
                    });
                    $self.show();
 
					self[time]=setInterval(function(){
						pos++;
						Fuee(self).css({
                            height: (pos / max) * h + "px",
                            width: (pos / max) * w + "px"
                        });
                        
                        Fuee(self).setOpacity(pos);
                        
                        if (pos == max) {
							clearInterval(self[time]);
							
                            self.style.cssText = oldCSSTest;
							$self.show();
                            if (callback) callback.call(self);
                        }
					},speed);
                });
            }
            
            return Fuee(elem);
        },
        
        //sDowm
        //通过高度变化（向下增大）来动态地显示所有匹配的元素，在显示完成后可选地触发一个回调函数。
        //@speed {String:"fast","normal","slow"}	callback表示动作完后的回调函数 参数是节点本身
        sDown: function(speed, callback){
            var elem = this.elem;
            
            if (speed === undefined) {
                var speed = 5;
            } else {
                if (typeof speed === "string") {
                
                    speed = {
                        "fast": 1,
                        "normal": 5,
                        "slow": 10
                    }[speed];
                }
                
                var speed = speed < 100 ? speed : 3;
            }
            
            Fuee(elem).each(function(){
                if (Fuee(this).css("display") != "none") return;
                
                Fuee(this).show();
                
                var self = this, 
					h = Fuee(self).getElemContentHeightWidth().height, 
					paddingTop = parseInt(Fuee(self).css("paddingTop")) || 0, 
					paddingBottom = parseInt(Fuee(self).css("paddingBottom")) || 0,
                	borderTop = parseInt(Fuee(self).css("borderTopWidth")) || 0, 
					borderBottom = parseInt(Fuee(self).css("borderBottomWidth")) || 0, 
					oldCSSTest = self.style.cssText; 
                
				if (!Fuee.isIE) Fuee(self).setOpacity(0);
                
                Fuee(self).css({
                    height: '0',
                    paddingTop: "0",
                    paddingBottom: "0",
                    borderTopWidth: "0",
                    borderBottomWidth: "0",
                    overflow: "hidden"
                });
                
                for (var i = 0; i <= 100; i++) {
                    (function(pos){
                        setTimeout(function(){
                        
                            Fuee(self).css({
                                height: (pos / 100) * h + "px",
                                paddingTop: (pos / 100) * paddingTop + "px",
                                paddingBottom: (pos / 100) * paddingBottom + "px",
                                borderTopWidth: (pos / 100) * borderTop + "px",
                                borderBottomWidth: (pos / 100) * borderBottom + "px"
                            });
                            
                            if (!Fuee.isIE) Fuee(self).setOpacity(pos);
                            
                            if (pos == 100) {
                                self.style.cssText = oldCSSTest;
                                Fuee(self).show();
                                if (callback) callback.call(self);
                            }
                        }, (pos + 1) * (speed + 1));
                    })(i);
                }//for
            });
            
            return Fuee(elem);
        },
        
        //sUp
        //通过高度变化（向上缩小）来动态地隐藏所有匹配的元素，在隐藏完成后可选地触发一个回调函数。
        sUp: function(speed, callback){
            var elem = this.elem;
            
            if (speed === undefined) {
                var speed = 5;
            } else {
                if (typeof speed === "string") {
                    speed = {
                        "fast": 2,
                        "normal": 5,
                        "slow": 10
                    }[speed];
                }
                
                var speed = speed < 100 ? speed : 3;
            }
            
            Fuee(elem).each(function(){
                if (Fuee(this).css("display") == "none") return;
                
                var self = this, 
					h = Fuee(self).getElemContentHeightWidth().height, 
					paddingTop = parseInt(Fuee(self).css("paddingTop")) || 0, 
					paddingBottom = parseInt(Fuee(self).css("paddingBottom")) || 0, 
					borderTop = parseInt(Fuee(self).css("borderTopWidth")) || 0, 
					borderBottom = parseInt(Fuee(self).css("borderBottomWidth")) || 0, 
					oldCSSTest = self.style.cssText;
                self.style.overflow = "hidden";
                
                for (var i = 100; i >= 0; i -= 1) {
                    (function(pos){
                        setTimeout(function(){
                            Fuee(self).css({
                                height: (pos / 100) * h + "px",
                                paddingTop: (pos / 100) * paddingTop + "px",
                                paddingBottom: (pos / 100) * paddingBottom + "px",
                                borderTopWidth: (pos / 100) * borderTop + "px",
                                borderBottomWidth: (pos / 100) * borderBottom + "px"
                            });
                            
							Fuee(self).setOpacity(pos);
                            
                            if (pos == 0) {
                                self.style.cssText = oldCSSTest;
                                Fuee(self).hide();
                                if (callback) callback.call(self);
                            }
                        }, (-pos + 101) * (speed + 1));
                    })(i);
                }//for
            });
            
            return Fuee(elem);
        },
        
        //淡淡出现
        fIn: function(speed, callback){
            var elem = this.elem;
            
            if (typeof speed == "string") {
                speed = {
                    "fast": 40,
                    "normal": 10,
                    "slow": 5
                }[speed];
            }
            
            var speed = speed === undefined ? 10 : speed < 100 ? speed : 10;
            
            Fuee(elem).each(function(){
                var self = this;
                
                if (self.fOutTime || self.fInTime || Fuee(self).css("display") != "none") return;
                
                Fuee(self).show();
                var pos = 0, 
					endPos = Fuee(self).css("opacity") * 100 || 100, 
					oldCSSText = self.style.cssText;
                Fuee(self).setOpacity(pos);
                self.style.zoom = 1; //for ie
                self.fInTime = setInterval(function(){
                    pos = pos + speed / 5;
                    if (pos >= endPos) {
                        clearInterval(self.fInTime);
                        self.fInTime = null;
                        
                        self.style.cssText = oldCSSText;
                        if (callback) callback.call(self);
                    } else {
                        Fuee(self).setOpacity(pos);
                    }
                }, 1);
            });
            
            return Fuee(elem);
        },
        
        //淡淡消失
        fOut: function(speed, callback){
            var elem = this.elem;
            
            if (typeof speed == "string") {
            
                speed = {
                    "fast": 40,
                    "normal": 10,
                    "slow": 5
                }[speed];
            }
            
            var speed = speed === undefined ? 10 : speed < 100 ? speed : 10;
            
            Fuee(elem).each(function(){
                var self = this;
                
                if (self.fOutTime || self.fInTime || Fuee(self).css("display") == "none") return;
                
                var pos = Fuee(self).css("opacity") * 100 || 100, 
					endPos = 0, 
					oldCSSText = self.style.cssText;
                Fuee(self).setOpacity(pos);
                self.style.zoom = 1; //for ie
                self.fOutTime = setInterval(function(){
                    pos = pos - speed / 5;
                    if (pos <= endPos) {
                        clearInterval(self.fOutTime);
                        self.fOutTime = null;
                        
                        self.style.cssText = oldCSSText;
                        Fuee(self).hide();
                        if (callback) callback.call(self);
                    } else {
                        Fuee(self).setOpacity(pos);
                    }
                }, 1);
            });
            
            return Fuee(elem);
        }
    };//end extent
    
    //一些全局函数
    Fuee.each = function(r, callback){
        var tr = [];
		//if r is not Array,but a node
        r.length === undefined ? tr.push(r) : tr = r;
        
        var i = 0, length = tr.length;
		//里面的函数如果return false就可以推出each循环
        for (var value = tr[0]; i < length && callback.call(value, i) !== false; value = tr[++i]) {}
    };
	
    Fuee.trim = function(s){
        if (typeof s == "string") {
            return s.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
        }
    };
	
    //set cookie
    Fuee.setCookie = function(name, value, days){
        var Days = days || 30; //this cookie will be saved 30 days default
        var exp = new Date(); //example:new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        D.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    };
    
    //get cookie
    Fuee.getCookie = function(name){
        var arr = D.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;
    };
    
    //del cookie
    Fuee.delCookie = function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = Fuee.getCookie(name);
        if (cval != null) D.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    };
    
    //check ie,return number or undefined
	Fuee.isIE = (function(){
	    var v = 3,
	        div = D.createElement('div'),
	        all = div.getElementsByTagName('i');
	 
	    while (
	        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	        all[0]
	    );
	 
	    return v > 4 ? v : undefined;
	}());
	
    //check opera
    Fuee.isOpera = function(){
        return navigator.userAgent.indexOf("Opera") > -1 ? true : false;
    };
    
   //check firefox
    Fuee.isFirefox = function(){
        return navigator.userAgent.indexOf("Firefox") > -1 ? true : false;
    };
    
	//for ie6 image cache
    Fuee.ieImage = function(){
        try {
            D.execCommand("BackgroundImageCache", false, true);
        } catch (e) {}
    };
    
	//get mouse's position,no px
    Fuee.getMouse = function(e){
        e = e || window.event;
        if (e.pageX || e.pageY) {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }
        var dd = D.documentElement;
        return {
            x: e.clientX + dd.scrollLeft - dd.clientLeft,
            y: e.clientY + dd.scrollTop - dd.clientTop
        };
    };
    
    //获取页面可见区域的宽度和高度	 即当前页面body整个高度与宽度
    //注意是body，而不是整个浏览器的宽度与高度
    Fuee.getBody = function(){
        return {
            height: D.body.clientHeight, 
            width: D.body.clientWidth
        }
    };
    
    //获取可见区域的宽度和高度,即工作区域
    //浏览的放大与缩小会影响该值
    Fuee.getArea = function(){
        return {
            height: D.documentElement.clientHeight, 
            width: D.documentElement.clientWidth 
        }
    };
    
    //网页被卷去的高度与宽度
    Fuee.getScroll = function(){
        return {
            top: Math.max(D.documentElement.scrollTop, D.body.scrollTop), 
            left: Math.max(D.documentElement.scrollLeft, D.body.scrollLeft) 
        }
    };
    
    //返回页面最大的宽度与高度[整个页面]
    //有DOCTYPE声明的前提
    Fuee.getMax = function(){
        var dd = D.documentElement;
        return {
            height: Math.max(dd.scrollHeight, dd.clientHeight),
            width: Math.max(dd.scrollWidth, dd.clientWidth)
        }
    };
    
	//ie6 select bug is resolved
    Fuee.lightbox = function(oFuee){
		//window size check key
        Fuee.lightboxCheck = true; 
        var ob = oFuee === undefined ? {} : oFuee, opacity = ob.opacity || 0.4, zIndex = ob.zIndex || 1000, color = ob.color || "#000";
        
        if (Fuee.isIE==6) {
            var html = '<div style=\" filter:alpha(opacity=' + opacity * 100 + '); height:' + Fuee.getMax().height + 'px;width:' + Fuee.getMax().width + 'px;z-index:' + zIndex + ';background:' + color + ';opacity:' + opacity + ';left:0;top:0;position:absolute;\"><\/div>' +
            '<iframe frameborder="no" marginwidth="0" marginheight="0" scrolling="no" style=\" opacity:0; filter:alpha(opacity=0);height:' +
            Fuee.getMax().height +
            'px;width:' +
            Fuee.getMax().width +
            'px;z-index:' +
            (zIndex - 1) +
            ';left:0;top:0;position:absolute;\"><\/iframe>';
        } else {
            var html = '<div style=\" filter:alpha(opacity=' + opacity * 100 + '); height:' + Fuee.getMax().height + 'px;width:' + Fuee.getMax().width + 'px;z-index:' + zIndex + ';background:' + color + ';opacity:' + opacity + ';left:0;top:0;position:absolute;\"><\/div>';
        }
        
        var div = D.createElement("div");
        
        div.setAttribute("id", "Fuee-lightbox");
        div.innerHTML = html;
        D.body.appendChild(div);
        
        window.onresize = function(){
            if (Fuee.lightboxCheck) {
                Fuee("Fuee-lightbox").first().css({
                    height: Fuee.getMax().height + "px",
                    width: Fuee.getMax().width + "px"
                });
            }
        };
    };
    
    Fuee.removeLightbox = function(){
        Fuee.lightboxCheck = false;
        if (D.getElementById("Fuee-lightbox")) {
            Fuee("Fuee-lightbox").remove();
        }
    };
    
    //stop event bubble
    Fuee.stopBubble = function(e){
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
    };
    
	//to prevent default
    Fuee.stopDefault = function(e){
        if (e && e.preventDefault) {
            e.preventDefault();
        } else {
            window.event.returnValue = false;
        }
        return false;
    };
    
    //get real array
    Fuee.realArray = function(c){
        try {
            return Array.prototype.slice.call(c);
        } catch (e) {
            var r = [], len = c.length;
            for (var i = 0; i < len; i++) {
                r[i] = c[i];
            }
            return r;
        }
    };
    
    //获取事件源，不必传入event参数了
    //不支持opera 10
    Fuee.getEvent = function(){
        if (D.all) return window.event;
        func = Fuee.getEvent.caller;
        while (func != null) {
            var arg0 = func.arguments[0];
            if (arg0) {
                if ((arg0.constructor == Event || arg0.constructor == MouseEvent) ||
                (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    };
    
    Fuee.getEventElement = function(){
        var e = Fuee.getEvent();
        return e.srcElement ? e.srcElement : e.target;
    };
    
    //===========================================================================================================
    //Fuee.fn extensional function
    Fuee.extend = function(oFuee){
        for (var i in oFuee) {
            //首先判断扩展的函数名是否有冲突
            for (var k in Fuee.fn.prototype) {
                if (i == k) {
                    alert("expand the function name already exists!");
                    return false;
                }
            }
            Fuee.fn.prototype[i] = oFuee[i];
        }
    };
    
    Fuee.extend({
    
        /*
         * 鼠标放在上面持续oFuee.timeOn时间，才会触发oFuee.on
         * 鼠标离开上面持续oFuee.timeOut时间，才会触发oFuee.out
         * 那个点只自带了onmouseover和onmouseout函数
         *
         * Fuee("divId").hold({
         * 		timeOut:100,	//不必须，默认为1
         * 		timeOn:100,		//不必须，默认为1
         * 		on:function(){//do something...},	//必须
         * 		out:function(){//do something...},	//不必须
         * 		move:fucntion(){}					//不必须
         * });
         */
        hold: function(oFuee){
            var elem = this.elem;
 
            Fuee(elem).each(function(){
                var node = this;
                
                oFuee.timeOn = oFuee.timeOn === undefined ? 1 : oFuee.timeOn;
                oFuee.timeOut = oFuee.timeOut === undefined ? 1 : oFuee.timeOut;
                
                Fuee(node).bind({
                    "mouseover": function(e){
                        var _this = this;
                        clearTimeout(_this.timeOut);
                        
                        _this.timeOn = setTimeout(function(){
                            if (oFuee.on !== undefined) oFuee.on.call(_this,e);
                        }, oFuee.timeOn);
                    },
                    
                    "mouseout": function(e){
                        var _this = this;
                        clearTimeout(_this.timeOn);
                        
                        _this.timeOut = setTimeout(function(){
                            if (oFuee.out !== undefined) oFuee.out.call(_this,e);
                        }, oFuee.timeOut);
                    },
					
					"mousemove":function(e){
						var _this = this;
						if (oFuee.move !== undefined) oFuee.move.call(_this,e);
					}
                });
            });
        },
        
        /*
         * 得到元素 【整体】的宽度与高度 [ 即使元素是隐藏的，也可以得到 ]
         * 包括padding和border
         */
        getElemHeightWidth: function(){
            var elem = this.elem;
            
            if (Fuee(elem).css("display") != 'none') {
                return {
                    height: elem.offsetHeight || parseInt(Fuee(elem).css("height")),
                    width: elem.offsetWidth || parseInt(Fuee(elem).css("width"))
                }
            }
            
            var old = Fuee(elem).resetCSS({
                display: '',
                visibility: 'hidden'
            });
            
            var hw = {
                height: elem.offsetHeight || parseInt(Fuee(elem).css("height")),
                width: elem.offsetWidth || parseInt(Fuee(elem).css("width"))
            };
            
            Fuee(elem).css(old);
            
            return hw;
        },
        
        /*
         * 得到元素【内容】的宽度与高度 [ 即使元素是隐藏的，也可以得到 ]
         * 去除padding和border
         */
        getElemContentHeightWidth: function(){
            var elem = this.elem, fourWay = ["Left", "Right", "Top", "Bottom"], opadding = [], oborder = [];
            
            if (Fuee(elem).css("display") != 'none') {
                for (var i = 0; i < fourWay.length; i++) {
                    opadding[i] = parseInt(Fuee(elem).css("padding" + fourWay[i])) || 0;
                    
                    oborder[i] = parseInt(Fuee(elem).css("border" + fourWay[i] + "Width")) || 0;
                }//for
                return {
                    width: Fuee(elem).getElemHeightWidth().width - opadding[0] - opadding[1] - oborder[0] - oborder[1],
                    height: Fuee(elem).getElemHeightWidth().height - opadding[2] - opadding[3] - oborder[2] - oborder[3]
                }
            }
            
            var old = Fuee(elem).resetCSS({
                display: '',
                visibility: 'hidden'
            });
            
            for (var i = 0; i < fourWay.length; i++) {
                opadding[i] = parseInt(Fuee(elem).css("padding" + fourWay[i])) || 0;
                oborder[i] = parseInt(Fuee(elem).css("border" + fourWay[i] + "Width")) || 0;
            }
            
            var hw = {
                width: Fuee(elem).getElemHeightWidth().width - opadding[0] - opadding[1] - oborder[0] - oborder[1],
                height: Fuee(elem).getElemHeightWidth().height - opadding[2] - opadding[3] - oborder[2] - oborder[3]
            };
            
            Fuee(elem).css(old);
            
            return hw;
        },
        
        /*
         * 说明下，现在暂时不支持颜色的语意表达，比如red，blue等，这个其实也很好实现。
         *
         * FueeObject.changeColor({
         *  "type": "backgroundColor", 		//默认是背景颜色，如果 "type":"color"说明改变的是字体颜色,
         *  "from":"#223",					//不是必须	,如果没有定义，就是从元素里面获取它的样式，如果它没有就获取它父亲节点的，一直找下去
         *   //最后都没有,就设置为#fff
         *
         *  "to": "#000", 					//必须，也应该支持rgb(0,0,0)，#003399;	反正颜色这3种格式，都应该支持
         *  "speed":"slow"					//默认是 normal
         *  "changing":function(){},		//正在改变颜色中的回调函数
         *  "end":function(){}				//改变完后的回调函数
         *});
         */
        changeColor: function(oFuee){
            var elem = this.elem, 
				type = oFuee.type === undefined ? "backgroundColor" : oFuee.type, 
				to = oFuee.to, 
				from = oFuee.from === undefined ? false : oFuee.from, 
				speed = oFuee.speed === undefined ? "normal" : oFuee.speed;
            
			speed={
				'normal':70,
				'fast':10,
				'slow':100
			}[speed];
          
            //传入节点，获取它的颜色
            //font color 不存在transparent的问题，而且直接可以获取的到，不必去递归获取父亲的颜色继承
            var getColor = function(node){
                //如果事先没有定义
                if (from === false) {
                    if (type === "color") {
                        return Fuee(node).css("color");
                    } else if (type === "backgroundColor") {
                        //第2种可能是针对chrome和safira
                        if (Fuee(node).css("backgroundColor") === "transparent" || Fuee(node).css("backgroundColor") === "rgba(0, 0, 0, 0)") {
                            while (Fuee(node).parent()) {
                                var parentBgColor = Fuee(node).parent().css("backgroundColor");
                                
                                if (parentBgColor !== "transparent" && !!parentBgColor) {
                                    return parentBgColor;
                                }
                                
                                node = Fuee(node).parent().getElem();
                            }
                            //如果都没有得到
                            return "#fff";
                        } else {
                            return Fuee(node).css("backgroundColor");
                        }
                    } else {
                        alert("type格式定义错误.");
                    }
                } else {
                    node.style[type] = from;
                    return from;
                }
            };
            
            //获取10进制的rgb格式
            //color 是颜色的string格式
            
            //取 rgb(r,g,b)里面的r,g,b的值
            var colorFormat = function(color){
                //rgb(12,13,14)
                if (/^rgb/.test(color)) {
                    var c = color.split(",");
                    
                    return {
                        r: +c[0].slice(4, c[0].length),
                        g: +c[1],
                        b: +c[2].slice(0, c[2].length - 1)
                    }
                } //#123
                 else if (/^\#/.test(color) && color.length == 4) {
                    return {
                        r: parseInt("0x" + color.slice(1, 2) + color.slice(1, 2), 16),
                        g: parseInt("0x" + color.slice(2, 3) + color.slice(2, 3), 16),
                        b: parseInt("0x" + color.slice(3, 4) + color.slice(3, 4), 16)
                    }
                } //#112233
                 else if (/^\#/.test(color) && color.length == 7) {
                    return {
                        r: parseInt("0x" + color.slice(1, 3), 16),
                        g: parseInt("0x" + color.slice(3, 5), 16),
                        b: parseInt("0x" + color.slice(5, 7), 16)
                    }
                } else {
                    alert("the color format is error.");
                    return false;
                }
            };
            
            //颜色值改变的平滑函数
            var colorChanging = function(begin, end){
                if (begin < end) {
                    begin = begin + Math.ceil((end - begin) / speed);
                }
                
                if (begin > end) {
                    begin = begin - Math.ceil((begin - end) / speed);
                }
                
                return begin;
            };
            
            Fuee(elem).each(function(){
                var _this = this, beforeColor = colorFormat(getColor(_this)), afterColor = colorFormat(to), beginR = beforeColor.r, beginG = beforeColor.g, beginB = beforeColor.b;
                
                //防止多次同时调用changeColor是，由于时间函数名相同而引起的bug	
                //这样多次调用也相当于异步了，互不影响
                var m = Math.random(), time = "changeColorTime" + m.toString();
                
                _this[time] = setInterval(function(){
                    beginR = colorChanging(beginR, afterColor.r);
                    beginG = colorChanging(beginG, afterColor.g);
                    beginB = colorChanging(beginB, afterColor.b);
                    
                    _this.style[type] = 'rgb(' + beginR + ',' + beginG + ',' + beginB + ')';
                    
                    if (oFuee.changing) {
                        oFuee.changing.call(_this);
                    }
                    
                    if (beginR === afterColor.r && beginG === afterColor.g && beginB === afterColor.b) {
                        clearInterval(_this[time]);
                        if (oFuee.end) {
                            oFuee.end.call(_this);
                        }
                    }
                }, 1);
            })
        }
    });
    
    //Ajax
    /*====================================================================================================================
     * e.g.
     * 		Fuee.ajax({
     * 			url:"index.jsp",
     * 			before:function(){//do something...},
     * 			success:function(msg){ do something...},
     * 			error:function(){////do something...},
     *          xml:true,
     *          stop:function(){}
     *		})
     ====================================================================================================================*/
    Fuee.ajax = function(obj){
        if (!obj.url) return;
        var xmlhttp = (function(){
            try {
                return new XMLHttpRequest();
            } catch (e) {
                if (window.ActiveXObject) {
                    var ActiveXName = ['MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.4.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp', 'Microsoft.XMLHttp'];
                    for (var i = 0; i < ActiveXName.length; i++) {
                        try {
                            return new ActiveXObject(ActiveXName[i]);
                        } catch (e) {
							throw new  Error('your browser is not support ajax!');
							return false;
						}
                    }
                } else {
                   throw new Error('your browser is not support ajax!');
				   return false;
                }
            }
        })();
        
        var type = obj.type || 'get', 
 			asyn = obj.asyn || true; 
        if (xmlhttp) {
            xmlhttp.open(type, obj.url, asyn);
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState != 4) {
                    if (obj.before !== undefined) {
                        obj.before();
                    }
                } else {
                    if (xmlhttp.status == 200) {
                        if (obj.success !== undefined) obj.xml === true ? obj.success(xmlhttp) : obj.success(Fuee.trim(xmlhttp.responseText));
                    } else {
                        alert("Error: status code is " + xmlhttp.status);
                    }
                }
            };
            
			//cancel ajax request
            if (obj.stop !== undefined) {
                var time = obj.time || 10000;
                setTimeout(function(){
                    if (xmlhttp.readyState != 4) {
                        xmlhttp.abort();
                        obj.stop();
                        return;
                    }
                }, time);
            }
            
			//solve IE ajax cache problem
            xmlhttp.setRequestHeader("If-Modified-Since", "0");
            
            if (type == 'post') {
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.setRequestHeader("Connection", "close");
                xmlhttp.send(obj.params);
            } else {
                xmlhttp.send(null);
            }
        } else {
            if (obj.error !== undefined) obj.error();
        }
    };
  
    //parse xml
    Fuee.parseXML = function(xmlhttp){
		
        var xmlDoc = xmlhttp.responseXML.documentElement, 
			//存放找到节点，就push到这个数组里面
 			result = [];
        
        return {
            //找到字符串里面的节点变成数组
            //"books book name" =>[books,book,name]
            //"books"=>[books]
            stringToArray: function(s){
                return s.split(" ");
            },
            
            //知道父亲节点，返回孩子结点的函数
            //这个函数可以独立进行  [ 深度递归遍历 ]
            //@nodes 传入的是节点名称数组 => e.g.[books,book,name]
            findChild: function(root, nodes){
                var self = this, tempRoot = root.getElementsByTagName(nodes[0]); //这个还是一个集合，即使得到一个值，也是集合
                if (nodes.length == 1) {
                    result.push(tempRoot[0]); //所以这里要返回一个值的集合的值    
                } else {
                    for (var i = 0, len = tempRoot.length; i < len; i++) {
                        var tempNodes = nodes.concat();
                        tempNodes.shift();
                        self.findChild(tempRoot[i], tempNodes);
                    }
                }
            },
            
            //寻找xml文件里面的节点，返回的是节点数组
            //支持层次结构
            find: function(xmlNode){
                //把xmlNode解析
                //"books book name"=>[books,book,name]
                //"name"=>[name];
                var nodes = this.stringToArray(xmlNode);
                
                if (nodes.length == 1) {
                    return xmlDoc.getElementsByTagName(xmlNode);
                } else {
                    this.findChild(xmlDoc, nodes);
                    return result;
                }
            },//find
            //返回xml节点里面的值，如果一个节点就返回一个值，如果很多节点，就返回值的数值
            //已知这个节点不包含其他的节点，只是包含字符串或者值
            //xmlNode除了直接入节点名称外，另外还可以传入层次结构
            //例如:Fuee.parseXML(msg).findValue("books book name"); Fuee.parseXML(msg).findValue("book name"); 这个对于这个xml文件来说是一样的
            //或者 Fuee.parseXML(msg).findValue("me name");
            //返回的结果是value的数组模式
            findValue: function(xmlNode){
                var value = [], 
 					nodes = this.stringToArray(xmlNode);
                
                if (nodes.length == 1) {
                    var xmlNodes = xmlDoc.getElementsByTagName(xmlNode);
                    Fuee(xmlNodes).each(function(){
                        value.push(Fuee(this).text());
                    });
                } else {
                    Fuee(this.find(xmlNode)).each(function(){
                        value.push(Fuee.trim(Fuee(this).text())); 
                    });
                }
                
                return value;
            }//findValue
        }
    };
    
    //drag功能 	[2010-6-11号改版]
    //node是要移动的节点，hand是鼠标只能放在这里进行拖动 【 如果hand没有定义，则表示鼠标通过node来进行拖动 】
    //拖拽的内容在FF下不能为空，至少加个&nbsp;，这样FF才不会出现拖拽不平滑的bug
    /*
     * oFuee{
     * 		node,	//必须
     * 	 	hand,
     * 		cursor, //移动时的鼠标样式
     *  	onlyX,	//为true则只能x方向
     *  	onlyY,	//同上
     *  	opacity,
     *  	mouseup(hand),		//鼠标释放后的回调函数	this才是真正的node
     *  	mousemove(hand),	//鼠标移动时回调函数
     *  	mousedown(hand)		//鼠标按下去时回调函数
     *  }
     */
    Fuee.drag = function(oFuee){
        return new Fuee.drag.fn(oFuee);
    };
    Fuee.drag.fn = Fuee.drag.prototype = function(oFuee){
        var key = false, //移动块的锁定功能
 			elem, //被移动的块
 			hand, //鼠标放在块的什么地方移动
 			parentnode = null; //获取离他最近的relation或者absolute父亲的节点的位置	
        
		//node,hand只能是节点的id的string类型或者DOM节点
        elem = typeof oFuee.node == "string" ? D.getElementById(oFuee.node) : oFuee.node;
        
        if (oFuee.hand) {
            hand = typeof oFuee.hand == "string" ? D.getElementById(oFuee.hand) : oFuee.hand;
        } else {
            hand = elem;
        }
		
		var handNull=(hand.innerHTML=='');
		
        elem.style.zoom = 1; //解决IE透明没有定义宽度与高度的问题
        //寻找elem的父亲节点有没有position属性，并找到它
        var el = elem; //复制一份
        while (Fuee(el).parent()) {
            var p = Fuee(el).parent(), position = p.css("position");
            
            if (position == "relative" || position == "absolute") {
                parentnode = p.getElem();
                break;
            } else {
                el = p.getElem();
            }
        }
		
        var oldOpacityTemp = Fuee(elem).css("opacity"), 
			oldOpacity = oldOpacityTemp <= 1 ? oldOpacityTemp * 100 : oldOpacityTemp, 
			oldCursor = Fuee(hand).css("cursor"), 
			oldOverflow = hand.style.overflow,
        	$oldCss = elem.style.cssText;
			
        //初始化，回调函数
        if (oFuee.init) {
            oFuee.init.call(elem, $oldCss);
        }
        
        //2010-8-19
        //找到里面的图片，禁止拖拽，影响拖动
        if (hand.nodeName == 'IMG') {
            hand.ondragstart = function(){
                return false;
            };
        } else {
            if (Fuee(hand).find('img')) {
                Fuee(hand).find('img').each(function(){
                    this.ondragstart = function(){
                        return false;
                    };
                });
            }
        }
        
        hand.onmousedown = function(e){
			if(handNull) hand.innerHTML='&nbsp;';
			
            if (hand.setCapture) hand.setCapture();
            else if (window.captureEvents) window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            e = e || window.event;
            key = true;
            
            //点击下去后，鼠标的坐标
            var x = Fuee.getMouse(e).x, y = Fuee.getMouse(e).y;
            
            if (parentnode) {
                var px = Fuee(parentnode).getPosition().left, py = Fuee(parentnode).getPosition().top, //父亲节点的border宽度也要剪掉，不然也会发上boder-width的偏移
 pBorderTop = parseInt(Fuee(parentnode).css("borderTopWidth")) || 0, pBorderLeft = parseInt(Fuee(parentnode).css("borderLeftWidth")) || 0, pPaddingLeft = parseInt(Fuee(parentnode).css("paddingLeft")) || 0;
                
                elem.style.left = Fuee(elem).getPosition().left - px - pBorderLeft + "px";
                elem.style.top = Fuee(elem).getPosition().top - py - pBorderTop + "px";
            } else {
                elem.style.left = Fuee(elem).getPosition().left + "px";
                elem.style.top = Fuee(elem).getPosition().top + "px";
            }
            
            //放在这里是为了获取它按下去时的left和top
            if (oFuee.mousedown) {
                oFuee.mousedown.call(elem, e, hand);
            }
            
            //改变了属性的放在callback的下面
            hand.style.cursor = oFuee.cursor || "auto"; //鼠标指针发生变化
            //elem.style.position = "absolute"; //变成绝对路径才能移动
            //elem.style.margin = 0; //清空margin，防止点元素发生瞬间位移
            //elem.style.overflow = "hidden"; //ff的bug        
			elem.style.cssText+=';position:absolute;margin:0;overflow:hidden;';
			
            //如果定义了半透明，就加入半透明
            if (oFuee.opacity) {
                Fuee(elem).setOpacity(oFuee.opacity); //移动时，被移动的物体半透明
            }
            
            //node最开始的位置
            elem.beginLeft = parseInt(elem.style.left);
            elem.beginTop = parseInt(elem.style.top);
            
            D.onmousemove = function(e){
                if (!key) return;
                e = e || window.event;
                
                var xCurrent = Fuee.getMouse(e).x, yCurrent = Fuee.getMouse(e).y;
                
                //鼠标移到的差值
                elem.cx = xCurrent - x;
                elem.cy = yCurrent - y;
                
                //最开始的位置+鼠标的差值，就是当前的位置，这个再清晰不过了。	
                elem.cLeft = elem.beginLeft + elem.cx;
                elem.cTop = elem.beginTop + elem.cy;
                
                //通过elem的cLeft和cTop来传递给外面，能够确定elem.lock是否锁定它是否移动	
                if (!elem.lock) {
                    if (oFuee.onlyX === true) {
                        elem.style.left = elem.cLeft + "px";
                    } else if (oFuee.onlyY === true) {
                        elem.style.top = elem.cTop + "px";
                    } else {
                        elem.style.left = elem.cLeft + "px";
                        elem.style.top = elem.cTop + "px";
                    }
                }
                
                if (oFuee.mousemove) {
                    oFuee.mousemove.call(elem, e, hand);
                }
            };//D.onmousemove
            D.onmouseup = function(e){
                if (!key) return;
				if(handNull) hand.innerHTML='';
				
                e = e || window.event;
                if (hand.releaseCapture) hand.releaseCapture();
                else if (window.releaseEvents) window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                
                //如果定义了半透明，移动结束时就不半透明
                if (oFuee.opacity) {
                    Fuee(elem).setOpacity(oldOpacity); //移动时，被移动的物体半透明
                }
                
                hand.style.cursor = oldCursor; //鼠标指针发生变化
                hand.style.overflow = oldOverflow; //复位
                if (oFuee.mouseup) oFuee.mouseup.call(elem, e, hand);
                
                key = false;
                
            };//D.onmouseup
        };// D.onmousedown
    };//Fuee.drag.fn
    
    Fuee.asynInnerHTML = function(HTML, doingCallback, endCallback){
        var temp = D.createElement('div'), frag = D.createDocumentFragment();
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
    };
    
	Fuee.forBind=(function(){
        var $ = function(id){
            return typeof id == 'string' ? document.getElementById(id) : id;
        }, w3c = function(elem, type, fn){
            $(elem).addEventListener(type, fn, false);
        }, IE = function(elem, type, fn){
            $(elem).attachEvent('on' + type, fn);
        }, DOM = function(elem, type, fn){
            el['on' + type] = function(e){
				return fn(e);
			}();
        };
        
        return function(elem, type, fn){
            var el = $(elem);
            
            try {
                el.addEventListener(type, fn, false);
                return w3c;
            } catch (e) {
                try {
                    el.attachEvent('on' + type, fn);
                    return IE;
                } catch (e) {
                    el['on' + type] = function(ev){
						return fn(ev);
					}();
                    return DOM;
                }
            }
        };
    })();
	
    //localStorage 本地记录
    Fuee.localStorage = (function(){
        if (Fuee.isIE) {
            documentElement = D.documentElement;
            documentElement.addBehavior('#default#userdata');
            return {
                set: function(key, value){
                    documentElement.setAttribute('value', value);
                    documentElement.save(key);
                },
                get: function(key){
                    documentElement.load(key);
                    return documentElement.getAttribute('value');
                },
                remove: function(key){
                    documentElement.removeAttribute('value');
                    documentElement.save(key);
                }
            }
        }
        
        return {
            set: function(key, value){
                localStorage[key] = value;
            },
            get: function(key){
                return localStorage[key];
            },
            remove: function(key){
                key == undefined ? localStorage.clear() : delete localStorage[key];
            }
        };
    })();
	
	/*
	 * type(101);          // return 'Number'
	 * type('hello');      // return 'String'
	 * type({});           // return 'Object'
	 * type([]);           // return 'Array'
	 * type(function(){}); // return 'Function'
	 * type(new Date());   // return 'Date'
	 * type(document);     // return 'HTMLDocument'
	 */
	Fuee.type=function(o){
	    return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
	};
	
	Fuee.getFunctionName = function(func){
		var functionBody = func.toString(),
			functionName = functionBody.match(/function (\w*)/);
			
		return functionName == null || functionName.length == 0? null : functionName[1];
	};
})();

//default
if(Fuee.isIE==6){
	Fuee.ieImage();
}