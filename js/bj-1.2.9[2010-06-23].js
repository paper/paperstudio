/*
 * author 		zhang binjue
 * blog			http://hi.baidu.com/paperstudio
 * copyright	No Rights Reserved
 * version		1.2.9
 * reference	Jquery.js
 * 
 * [2009-12-29]  扩展 changeColor	（改变字体或者背景的颜色）
 * [2010-01-13]  stringToElem 重写
 * [2010-01-25]  稍微修改下trim，支持清除 &nbsp
 * [2010-02-01]  稍微修改了下bind
 * 
 * [2010-05-02]  drag函数的一些细节，mouseup也要锁起!!
 * [2010-05-03]  修改了hide与show结合的时候会引起show失败的bug
 * 
 * [2010-05-26] 修改了drag，ff的bug，要设置overflow
 * 				修改了append的严重bug
 * 
 * [2010-05-27] 添加get函数：
 * 				例如对应只能支持传入单一参数的函数，要是有get(0)才行：
 * 				BJ('div').find('.class') //这个返回的BJ(result) result里面是数组形式的
 * 				BJ('div').find('.class').html(),或者 BJ('div').find('.class').text() 都是不支持的。
 * 				所以要：BJ('div').find('.class').get(0).html()这样才行
 * 
 * [2010-05-30] 修正了attr的一个只能传string和array，不能传number的bug。
 * 
 * [2010-06-11] 修正了drag的一个小bug，详细见代码。以前的方式也保留了[留作备案]。
 * 				修正了就是当鼠标移除去的时候，还可以操作拖动层，这个不好！
 * 
 * [2010-06-12] 修正了isIE6的一个bug，原来IE7和IE8都会有 MSIE 6.0 ，我晕
 */
(function(){
    var undefined, BJ = window.BJ = function(name){
        if (typeof name == "string" && name.charAt(0) == "#") {
            return document.getElementById(name.slice(1, name.length));
        }
        return new BJ.fn(name);
    };
    
    BJ.fn = BJ.prototype = function(name){
        if (typeof name == "string") {
            //节点的名称
            this.name = name;
            
            //取得这个节点
            this.elem = document.getElementById(name);
        }
        else {
            //传入的name是节点
            this.elem = name;
        }
        
    };
    
    BJ.fn.prototype = {
		//不是IE的情况下： 隐藏元素(display==none)必须显示出来才能得带它的样式
		//不过现在我修改了这个"bug"
        css: function(prop){
            //prop骆驼形式
            //获取css样式[内联与外联]
            //具有不完整性，也就是说这个函数有bug
			var elem=this.elem;
			
            if (typeof prop == "string") {
				//保证它一定是元素节点，防止elem报道html的父亲节点document去了，它是没有.style的
				if(elem.nodeType!=1){return;}
				
                if (elem.style[prop]) {
                    return elem.style[prop];
                }
                else 
                    if (elem.currentStyle) {
                        //IE
                        if (prop == "float")
                            prop = "styleFloat";
                        return elem.currentStyle[prop];
                    }
                    else 
                        if (document.defaultView && document.defaultView.getComputedStyle) {
                            //DOM
                            if (prop == "float")
                                prop = "cssFloat";
							
							if(prop!="display" && ( elem.style.display=="none" || document.defaultView.getComputedStyle(elem, null)["display"]=="none" )){
								BJ(elem).bestDisplay();			
								var t=document.defaultView.getComputedStyle(elem, null)[prop];
								elem.style.display="none";
								return t;
							}
							
                            return document.defaultView.getComputedStyle(elem, null)[prop];
                        }
                        else {
                            return null;
                        }
            }
            else {
                //写CSS
                BJ(elem).each(function(){
                    for (var i in prop) {
                        if (i == "opacity") 
                            this.style.filter = "alpha(opacity=" + prop[i] * 100 + ")";
                        this.style[i] = prop[i];
                    }
                });
				
				return BJ(elem);
            }
        },
	
        each: function(callback){
            return BJ.each(this.elem, callback);
        },
        
        resetCSS: function(prop){
            var old = {};
            
            for (var i in prop) {
                //记录旧的
                old[i] = BJ(this.elem).css(i);
                //设置新的
                this.elem.style[i] = prop[i];
            }
            //返回旧的的
            return old;
        },
        
        //BJ("div").addClass('c1'); 	添加1个
        //BJ("div").addClass('c1 c2'); 	添加2个
        addClass: function(name){
            var elem = this.elem;
            
            BJ(elem).each(function(){
                var _name = name, //保存name，因为name是全局变量
 					oldClass = this.className;
                
                if (oldClass == '') {
                    this.className = name;
                }
                else {
                    oldClass = oldClass.split(" ");
                    _name = _name.split(" ");
                    var namePass = ''; //用来存放通过验证的classname
                    for (var i = 0; i < _name.length; i++) {
                        for (var j = 0; j < oldClass.length; j++) {
                            //如果新加的class是以前有的，那么就不加上去了
                            if (oldClass[j] == _name[i]) {
                                break;
                            }
                            
                            if (j == oldClass.length - 1 && oldClass[j] != _name[i]) {
                                namePass = namePass + " " + _name[i];
                            }
                        }
                    }
                    
                    this.className = oldClass.join(" ") + namePass;
                }
            });
            
            return BJ(elem);
        },
        
        //BJ("div").removeClass();			全部移除
        //BJ("div").removeClass("c1");		移除1个
        //BJ("div").removeClass("c1 c2");	移除2个
        removeClass: function(name){
            var elem = this.elem;
            
            if (name === undefined) {
                BJ(elem).each(function(){
                    this.className = "";
                });
            }
            else {
                BJ(elem).each(function(){
                    var _name = name, oldClass = this.className;
                    
                    if (oldClass == '') 
                        return;
                    
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
                });
            }
            
            return BJ(elem);
        },
        
        //@level 0-100
        setOpacity: function(level){
            BJ(this.elem).each(function(){
                this.style.filter = this.filters ? this.style.filter = 'alpha(opacity=' + level + ')' : this.style.opacity = level / 100;
            });
        },
        
        //form YUI
        //这个得在所有的浏览器好好测试下! 感觉这个函数很悬~~
		//这个函数得到的位置是相对body的位置，如果它的父亲节点还有relative或者absolute的话，还得注意它最近父亲节点的位置
		//@ x就是left ，y就是top
		//很明显，这个elem也只能是一个元素
        getElementPos: function(){
            var elem = this.elem, 
				ua = navigator.userAgent.toLowerCase(), isOpera = (ua.indexOf('opera') != -1), 
				isIE = (ua.indexOf('msie') != -1 && !isOpera), // not opera spoof
				elemNone=null;	//用来判断 元素是否为空
			
			//如果元素没有父亲节点，那就是:html节点了，或者隐藏就不做？？？
			//[09-12-15]	修改后的话，隐藏元素也要得到它的位置
            if (elem.parentNode === null) {
                return false;
            }

			if(BJ(elem).css("display")=="none"){
				BJ(elem).bestDisplay();	//最佳显示
				elemNone=true;
			}
			
            var parent = null, 
				pos = [], 
				box;

            //IE ,ff,chrome
            if (elem.getBoundingClientRect) {
                box = elem.getBoundingClientRect();
                var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
                
				//还原它是隐藏元素
				if(elemNone){
					elem.style.display="none";
				}
				
                return {
                    x: box.left + scrollLeft,
                    y: box.top + scrollTop
                };
            }
            
            else 
                // gecko
                if (document.getBoxObjectFor) {      
                    box = document.getBoxObjectFor(el);
                    var borderLeft = (elem.style.borderLeftWidth) ? parseInt(elem.style.borderLeftWidth) : 0;
                    var borderTop = (elem.style.borderTopWidth) ? parseInt(elem.style.borderTopWidth) : 0;
                    pos = [box.x - borderLeft, box.y - borderTop];            
                }
                
                else // safari
                {		
                    pos = [elem.offsetLeft, elem.offsetTop];
                    parent = elem.offsetParent;
                    
                    if (parent != elem) {
                        while (parent) {        
                            pos[0] += parent.offsetLeft+parseInt(BJ(parent).css("borderLeft")) || 0;                           
                            pos[1] += parent.offsetTop+parseInt(BJ(parent).css("borderTop")) || 0;                           
                            parent = parent.offsetParent;                          
                        }
                    }
                    
                    if (ua.indexOf('opera') != -1 ||
                    (ua.indexOf('safari') != -1 && elem.style.position == 'absolute')) {                    
                        pos[0] -= document.body.offsetLeft;                       
                        pos[1] -= document.body.offsetTop;                     
                    }
                }
            
            if (elem.parentNode) {
                parent = elem.parentNode;
            }
            else {
                parent = null;
            }
            
            // account for any scrolled ancestors
            while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
                pos[0] -= parent.scrollLeft;
                pos[1] -= parent.scrollTop;
                if (parent.parentNode) {
                    parent = parent.parentNode;
                }
                else {
                    parent = null;
                }
            }
			
			//还原它是隐藏元素
			if(elemNone){
				elem.style.display="none";
			}
            return {
                x: pos[0],
                y: pos[1]
            };
        },
		
		//得到这个元素
        getElem: function(){
            return this.elem;
        },
        
		get:function(num){
			var elem=this.elem,
				num=num || 0;
			
			if(elem.length){
				return BJ(elem[num]);
			}
			else{
				throw Error('elem is not array');
			}
		},
		
        /* 寻找该节点下面的元素
         * 支持标签与class的层级查找
         * 
         * BJ("divId").find("p");						//即document.getElementById("divId").getElementsByTagName("p");
         * BJ("divId").find(".classname");				//寻找divId下面带有classname的class的所有元素
         * BJ("divId").find("p.classname");				//寻找divId下面带有classname的class的所有p元素
         * BJ("divId").find("p.classname span");		//寻找divId下面带有classname的class的所有p元素下面的span
         */
        find: function(selector){
            var elem = this.elem, 
				result = [], 
				//根据tagname来获取它的节点数组
				parts = selector.split(" "), 
 				getTagName = function(parent, tagname){
					var r = [];
					
					BJ(parent).each(function(){
						var c = BJ(this).getElem().getElementsByTagName(tagname);
						if (c.length != 0) 
							r = r.concat(BJ.realArray(c));
					});
					
					return r;
				}, 
				
			part = parts.shift(); //传入的参数，进行查找的第一部分
			
            //仅仅是标签
            if (part.indexOf(".") == -1) {
                result = getTagName(elem, part);
                
				if(result.length==0) return false;
                return parts.length == 0 ? BJ(result) : BJ(result).find(parts.join(' '));
                
            }
            //带有类
            else {
                var p = part.split("."), 
					partTagName = p[0] == '' ? '*' : p[0], 
					partClassName = p[1], 
					r = getTagName(elem, partTagName);
                
                //先得到所有的元素，然后再提取出className的元素
                BJ(r).each(function(){
                    if (this.className.indexOf(partClassName) > -1) {
                        result.push(this);
                    }
                });
                
				
				if(result.length==0) return false;
                return parts.length == 0 ? BJ(result) : BJ(result).find(parts.join(' '));
            }
        },
        
        /*
         * 上面的find是1.2.9的一个重点，下面的bind触发事件的函数，也是重点
         * BJ("div").bind("click",function(node){//....});
         * study jamespadolsey
         * 
         * 可惜现在不支持绑定mouseenter mouseleave
         */
        bind: function(obj){
            var elem = this.elem,
				events="blur,focus,load,resize,scroll,unload,click,dblclick," +
						"mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," +
						"change,select,submit,keydown,keypress,keyup,error";
            
			/*
			 * BJ("div").bind("click",function(){});
			 */
			if(arguments.length==2){
				var type=arguments[0],
					fn=arguments[1];
				
				if(events.indexOf(type)==-1){
					alert("绑定事件的名称存在错误!");
					return;
				}
				
				BJ(elem).each(function(){
					var _this=this;
					
					_this.addEventListener ? //FF
							_this.addEventListener(type, fn, false) : 
							_this.attachEvent ? //IE
								_this.attachEvent('on' + type, fn) : 
								_this['on' + type] = function(e){
                        			fn.call(_this,window.event || e);
                    			};
				});

			}else{
				for (var i in obj) {
	                (function(k){
	                    var callback = obj[k], type = k;
	                    
						if(events.indexOf(type)==-1){
							alert("绑定事件的名称存在错误!");
							return;
						}
						
	                    BJ(elem).each(function(){
	                        var _this = this;
	                        
	                        var fn = function(e){
	                            return callback.call(_this, window.event || e); //把_this作为callback的this，而且还有个事件参数
	                        };
	                       
							_this.addEventListener ? //FF
	 							_this.addEventListener(type, fn, false) : 
									_this.attachEvent ? //IE
	 								_this.attachEvent('on' + type, fn) : 
										_this['on' + type] = function(e){
	                            			fn(e);
	                        			};
	                    });//each	
	                })(i);
           		}
			}
			
            return BJ(elem);
        },
        
        //上第num(默认为1)个兄弟
        prev: function(num){
            var num = num || 1, elem = this.elem;
            
            while (num != 0) {
                do {
                    elem = elem.previousSibling;
                }
                while (elem && elem.nodeType != 1);
                num--;
            }
            return elem ? BJ(elem) : null;
        },
        
        //上面所有的兄弟
        prevAll: function(){
            var nodes = [], elem = this.elem, firstNode = BJ(elem.parentNode).first().getElem();
            
            while (elem != firstNode) { //如果最后一个节点不是它的父亲的第一个孩子，就继续循环
                elem = elem.previousSibling;
                if (elem && elem.nodeType == 1) {
                    nodes.push(elem);
                }
            };//while
            return nodes.length == 0 ? null : BJ(nodes);
        },
        
        //下第num(默认为1)个兄弟
        next: function(num){
            var num = num || 1, elem = this.elem;
            
            while (num != 0) {
                do {
                    elem = elem.nextSibling;
                }
                while (elem && elem.nodeType != 1);
                
                num--;
            }
            
            return elem ? BJ(elem) : null;
        },
        
        //下面所有的兄弟
        nextAll: function(){
            var nodes = [], elem = this.elem, lastNode = BJ(elem).parent().last().getElem();
            
            while (elem != lastNode) { //如果最后一个节点不是它的父亲的最后一个孩子，就继续循环
                elem = elem.nextSibling;
                //alert(elem);
                if (elem && elem.nodeType == 1) {
                    nodes.push(elem);
                }
            };//while
            return nodes.length == 0 ? null : BJ(nodes);
        },
        
        //第1个孩子
        first: function(){
            var elem = this.elem, elem = elem.firstChild;
            
            return elem == null ? null : (elem && elem.nodeType != 1) ? BJ(elem).next() : BJ(elem);
        },
        
        //最后1个孩子
        last: function(){
            var elem = this.elem, elem = elem.lastChild;
            return elem == null ? null : (elem && elem.nodeType != 1) ? BJ(elem).prev() : BJ(elem);
        },
        
        //num>=1 口语的第1个孩子的话，num取1
        children: function(num){
            var children = [], childNodes = this.elem.childNodes;
            for (var i = 0, l = childNodes.length; i < l; i++) {
                if (childNodes[i].nodeType == 1) {
                    children.push(childNodes[i]);
                }
            }
            
            return children.length == 0 ? null : num === undefined ? BJ(children) : BJ(children[num - 1]);
        },
        
        //第num(默认是1)个父亲
        parent: function(num){
            var num = num || 1, elem = this.elem;
            while (num--) {
                elem = elem.parentNode;
            }
            
            return elem ? BJ(elem) : null;
        },
        
        //获取它的所有兄弟
        siblings: function(){
            var r1 = this.prevAll(), r2 = this.nextAll();
            
            if (r1 != null && r2 != null) 
                return BJ(r1.getElem().concat(r2.getElem()));
            else 
                if (r1 == null && r2 != null) 
                    return r2;
                else 
                    if (r1 != null && r2 == null) 
                        return r1;
                    else 
                        return null;
        },
        
        //移除节点
        remove: function(){
			var elem=this.elem;
			if (elem) {
				BJ(elem).each(function(){
					this.parentNode.removeChild(this);
				});
			}
        },
        
        //清空这个节点
        empty: function(){
            var elem = this.elem;
            
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            };
            
            return BJ(elem);
        },
        
        //innerHTML另一个版本而已~~
        html: function(content){
            var elem = this.elem;
			
            if (content === undefined) {
                return BJ.trim(elem.innerHTML.toString());
            }
            else {
                elem.innerHTML = content.toString();
                return BJ(elem);
            }
        },
        
        //获取节点的内部所有文本，区别于innerHTML
        //BJ("divId").text(); 取出所有的文字(返回格式是字符串)，不包括节点标签
        //BJ("divId").text({getArray:true}); 取出所有的文字(返回格式为数组)，不包括节点标签
        //支持XML
        text: function(obj){
            var r = [], elem = this.elem, tempText = this.forText(r, elem);
            
            if (obj === undefined) {
                return tempText.join('') == '' ? null : tempText.join('');
            }
            else 
                if (obj.getArray === true) {
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
                    //如果取到的值不为空，那么就取出来
                    var nodeChildrenValue = BJ.trim(nodeChildren[i].nodeValue);
                    if (nodeChildrenValue != "") {
                        r.push(nodeChildrenValue);
                    }
                }
            }
            return r;
        },
        
        //获取或者设置节点里面的属性		
        // BJ("div").attr("class");						//等到div的class
        // BJ("div").attr("id","idName");				//设置div的id属性
        
        // var ps=BJ("div").children();					//假设ps的长度为3
        // BJ(ps).attr("rel","love");					//把div下面的p的rel全部设置为love
        // BJ(ps).attr("rel",["love","hate","like"]);	//把div下面的p的rel相应的设置为"love","hate","like",一一对应
        // BJ(ps).attr("rel",["love","hate"]);			//把div下面的p的rel相应的设置为"love","hate","hate",后面的都和数组的最后一个对应
        attr: function(name, value){
            if (name === undefined || typeof name != "string") 
                return '';
            
            var elem = this.elem, 
				name = {
               		'for': 'htmlFor',
                	'class': 'className'
            	}[name] ||	name;
            
            //赋值
            if (value !== undefined) {
                //如果value是数组
				if (!value.length) {
					value = [value];
				}
				
				BJ(elem).each(function(i){
					this[name] = value[i];
					if (this.setAttribute) {
						value[i] == undefined ? this.setAttribute(name, value[value.length - 1]) : this.setAttribute(name, value[i]);
					}
				});
				
                return BJ(elem);
            }
            //取值
            else {
                return elem[name] || elem.getAttribute(name) || '';
            }
        },
        
        //把带html的string类型，转化为以string最外的节点为根节点
        stringToElem: function(content){
			//2010-01-13 重写
			//利用文档片段来写
			var odiv=document.createElement("div"),
				frag=document.createDocumentFragment();
			
			odiv.innerHTML=content;
			
			while(odiv.firstChild){
				frag.appendChild(odiv.firstChild);
			}
			
			return frag;
			
            /*
             //before......
			 //有个问题就是<p class="ee">900890</p>
             
             if (/^<\w+>/.test(content)) {
                var nodeName = content.match(/\w+/g, '<$1>')[0].toLowerCase(), node = document.createElement(nodeName);
                
                node.innerHTML = content.substr(nodeName.length + 2, content.length - ((nodeName.length + 2) * 2 + 1));
                return node;
            }
            else {
                return document.createTextNode(content);
            }*/
        },
        
        //插入到节点里面内容的最后面
        //tbody不行，因为IE6的tbody的innerHTML是只读不可写的
        append: function(content){
            var elem = this.elem;
			//这个bug很严重，innerHTML会使得elem下面的html全部重写了，这样导致绑定的事件不能使用
            //typeof content == "string" ? elem.innerHTML += content : elem.appendChild(content);
			typeof content == "string" ? elem.appendChild(this.stringToElem(content)) : elem.appendChild(content);
            return BJ(elem);
        },
        
        //插入到节点里面内容的最前面
        //如果content是里面有的节点，会像剪切一样剪切过来
        //insertBefore用法：fChild当为null时其效果与appendChild一样
        prepend: function(content){
            var elem = this.elem, fChild = elem.firstChild;
            
            typeof content == "string" ? elem.insertBefore(this.stringToElem(content), fChild) : elem.insertBefore(content, fChild);
            
            return BJ(elem);
        },
        
        //插入到某个节点的下面
        after: function(content){
            var elem = this.elem, parent = elem.parentNode;
            
            content = typeof content == "string" ? this.stringToElem(content) : content;

            parent.firstChild == elem ? parent.appendChild(content) : parent.insertBefore(content, elem.nextSibling);
            
            return BJ(elem);
        },
        
        //插入到某个节点的上面
        before: function(content){
            var elem = this.elem, parent = elem.parentNode;
            
            content = typeof content == "string" ? this.stringToElem(content) : content;
            
            parent.insertBefore(content, elem);
            
            return BJ(elem);
        },
        
		//得到单个元素，当它隐藏时，那么让它显示的最佳display是什么
		//很明显，这里只能支持单个元素
		bestDisplay:function(){
			var elem=this.elem,
				tagname = elem.tagName, 
				node = document.createElement(tagname);
			
			document.body.appendChild(node);
			var tempDisplay = BJ(node).css("display");	//得到elem那个元素默认的样式
			BJ(node).remove();
			
			if(elem.currentStyle){
				var outDisplay=elem.currentStyle["display"];
			}else{
				var outDisplay=document.defaultView.getComputedStyle(elem, null)["display"];
			}
			
			//内联样式有none
            if (elem.style.display == "none") {
                elem.style.display = "";
                
                //如果外联还有none
                if (outDisplay == "none") {
                    elem.style.display = tempDisplay;
                }
            }
			//内联样式没有none
            else {
                //外联有none
                if (outDisplay == "none") {
                    elem.style.display = tempDisplay;
                }
            }
			
			return BJ(elem);
		},
		
        /* --------------------------------------------------------------------------------------------
         * 基本动画
         *
         * 注释掉的大量代码，是原先为了写出更加平滑的动画【因为处理了padding和border】，但是感觉这个必要性不是很强，所以先注释掉
         ----------------------------------------------------------------------------------------------*/
        hide: function(speed, callback){
            var elem = this.elem;
            
            //没有动画
            if (speed === undefined) {
                BJ(elem).each(function(){
                    this.$oldDisplay = BJ(this).css("display"); //找到元素display的当前状态
                    if (this.$oldDisplay !== 'none') {
                        this.style.display = "none";
                    }
                });
            }
            else {
                if (typeof speed === "string") {
					speed={
						"fast":2,
						"normal":5,
						"slow":10
					}[speed];
                }
                
                speed = speed < 100 ? speed : 5;
                
                BJ(elem).each(function(){
                    var self = this;
                    
                    if (BJ(self).css("display") == 'none') 
                        return; //如果本身就是隐藏的，就不执行
                    var h = BJ(self).getElemContentHeightWidth().height, w = BJ(self).getElemContentHeightWidth().width,                    /*paddingTop = parseInt(BJ(self).css("paddingTop")) || 0, 
                     paddingBottom = parseInt(BJ(self).css("paddingBottom")) || 0,
                     borderTop = parseInt(BJ(self).css("borderTopWidth")) || 0,
                     borderBottom = parseInt(BJ(self).css("borderBottomWidth")) || 0,
                     paddingLeft = parseInt(BJ(self).css("paddingleft")) || 0,
                     paddingRight = parseInt(BJ(self).css("paddingRight")) || 0,
                     borderLeft = parseInt(BJ(self).css("borderLeftWidth")) || 0,
                     borderRight = parseInt(BJ(self).css("borderRightWidth")) || 0,*/
                    oldCSSTest = self.style.cssText; //以前的内联样式
                    self.style.overflow = "hidden";
                    
                    for (var i = 100; i >= 0; i--) {
                        (function(pos){
                            setTimeout(function(){
                                BJ(self).css({
                                    /*paddingTop : (pos / 100) * paddingTop + "px",
                                     paddingBottom : (pos / 100) * paddingBottom + "px",
                                     borderTopWidth : (pos / 100) * borderTop + "px",
                                     borderBottomWidth : (pos / 100) * borderBottom + "px",
                                     
                                     paddingLeft : (pos / 100) * paddingLeft + "px",
                                     paddingRight : (pos / 100) * paddingRight + "px",
                                     borderLeftWidth : (pos / 100) * borderLeft + "px",
                                     borderRightWidth : (pos / 100) * borderRight + "px"*/
                                    height: (pos / 100) * h + "px",
                                    width: (pos / 100) * w + "px"
                                });
                                
                                BJ(self).setOpacity(pos);
                                
                                if (pos == 0) {
                                    self.style.cssText = oldCSSTest;
                                    self.curDisplay = BJ(self).css("display"); //找到元素display的当前状态
                                    if (self.curDisplay != 'none') 
                                        self.$oldDisplay = self.curDisplay;
                                    self.style.display = "none";
                                    if (callback) 
                                        callback.call(self);
                                }
                            }, (-pos + 101) * (speed + 1));
                        })(i);
                    }//for
                });
            }
            
            return BJ(elem);
        },
        
        show: function(speed, callback){
            var elem = this.elem;
            
            //没有动画
            if (speed === undefined) {
                BJ(elem).each(function(){
					var self=this;
                	
					if(self.$oldDisplay==undefined){
						BJ(self).bestDisplay();
					}else{
						self.$oldDisplay=='none'?
							BJ(self).bestDisplay():
                        	self.style.display = self.$oldDisplay;
					}
                });
            }
            else {
                if (typeof speed === "string") {
					
					speed={
						"fast":2,
						"normal":5,
						"slow":10
					}[speed];
                }
                
                speed = speed < 100 ? speed : 5;
                
                BJ(elem).each(function(){
                    var self = this;
                    
                    if (BJ(self).css("display") == 'block' || BJ(self).css("display") == 'inline') 
                        return; //如果本身就是显示的，就不执行
                    var                    /*paddingTop = parseInt(BJ(self).css("paddingTop")) || 0, 
                     paddingBottom = parseInt(BJ(self).css("paddingBottom")) || 0,
                     borderTop = parseInt(BJ(self).css("borderTopWidth")) || 0,
                     borderBottom = parseInt(BJ(self).css("borderBottomWidth")) || 0,
                     paddingLeft = parseInt(BJ(self).css("paddingleft")) || 0,
                     paddingRight = parseInt(BJ(self).css("paddingRight")) || 0,
                     borderLeft = parseInt(BJ(self).css("borderLeftWidth")) || 0,
                     borderRight = parseInt(BJ(self).css("borderRightWidth")) || 0,*/
                    oldCSSTest = self.style.cssText; //以前的内联样式
                    h = BJ(self).getElemContentHeightWidth().height, w = BJ(self).getElemContentHeightWidth().width;
                    
                    BJ(self).css({
                        height: "0",
                        //padding : "0",
                        //borderWidth : "0",
                        overflow: "hidden",
                        opacity: "0"
                    });
                    BJ(self).show();
                    
                    for (var i = 0; i <= 100; i++) {
                        (function(pos){
                            setTimeout(function(){
                                BJ(self).css({
                                    /*paddingTop : (pos / 100) * paddingTop + "px",
                                     paddingBottom : (pos / 100) * paddingBottom + "px",
                                     borderTopWidth : (pos / 100) * borderTop + "px",
                                     borderBottomWidth : (pos / 100) * borderBottom + "px",
                                     
                                     paddingLeft : (pos / 100) * paddingLeft + "px",
                                     paddingRight : (pos / 100) * paddingRight + "px",
                                     borderLeftWidth : (pos / 100) * borderLeft + "px",
                                     borderRightWidth : (pos / 100) * borderRight + "px",*/
                                    height: (pos / 100) * h + "px",
                                    width: (pos / 100) * w + "px"
                                });
                                
                                BJ(self).setOpacity(pos);
                                
                                if (pos == 100) {
                                    self.style.cssText = oldCSSTest;
                                    //设置为它的原始属性，如果没有，则为block
									if (self.$oldDisplay == undefined) {
										self.style.display = BJ(self).bestDisplay();
									}
									else {
										self.$oldDisplay == 'none' ? self.style.display = BJ(self).bestDisplay() : self.style.display = self.$oldDisplay;
									}
										
                                    if (callback) 
                                        callback.call(self);
                                }
                            }, (pos + 1) * (speed + 1));
                        })(i);
                    }//for
                });
            }
            
            return BJ(elem);
        },
        
        //sDowm
        //通过高度变化（向下增大）来动态地显示所有匹配的元素，在显示完成后可选地触发一个回调函数。
        //@speed {String:"fast","normal","slow"}	callback表示动作完后的回调函数 参数是节点本身
        sDown: function(speed, callback){
            var elem = this.elem;
  		
            if (speed === undefined) {
                var speed = 5;
            }
            else {
                if (typeof speed === "string") {
					
					speed={
						"fast":1,
						"normal":5,
						"slow":10
					}[speed];
                }
                
                var speed = speed < 100 ? speed : 3;
            }
           
            BJ(elem).each(function(){
                if (BJ(this).css("display") != "none") 
                    return;
					
                BJ(this).show();
				
                var self = this, 
					h = BJ(self).getElemContentHeightWidth().height, 
					paddingTop = parseInt(BJ(self).css("paddingTop")) || 0, 
					paddingBottom = parseInt(BJ(self).css("paddingBottom")) || 0;
                	borderTop = parseInt(BJ(self).css("borderTopWidth")) || 0, 
					borderBottom = parseInt(BJ(self).css("borderBottomWidth")) || 0, 
					oldCSSTest = self.style.cssText; //以前的内联样式
				
                if (!BJ.isIE()) //IE6 会卡~~
                    BJ(self).setOpacity(0);
                
				BJ(self).css({
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
							
                           BJ(self).css({
                                height: (pos / 100) * h + "px",
                                paddingTop: (pos / 100) * paddingTop + "px",
                                paddingBottom: (pos / 100) * paddingBottom + "px",
                                borderTopWidth: (pos / 100) * borderTop + "px",
                                borderBottomWidth: (pos / 100) * borderBottom + "px"
                            });
							
                            if (!BJ.isIE()) 
                            	BJ(self).setOpacity(pos);
                            
                            if (pos == 100) {
                                self.style.cssText = oldCSSTest;
                                BJ(self).show();
                                if (callback) 
                                    callback.call(self);
                            }
                        }, (pos + 1) * (speed + 1));
                    })(i);
                }//for
            });
            
            return BJ(elem);
        },
        
        //sUp
        //通过高度变化（向上缩小）来动态地隐藏所有匹配的元素，在隐藏完成后可选地触发一个回调函数。
        sUp: function(speed, callback){
            var elem = this.elem;
            
            if (speed === undefined) {
                var speed = 5;
            }
            else {
                if (typeof speed === "string") {
                    speed={
						"fast":2,
						"normal":5,
						"slow":10
					}[speed];
                }
                
                var speed = speed < 100 ? speed : 3;
            }

            BJ(elem).each(function(){
                if (BJ(this).css("display") == "none") 
                    return;
                
                var self = this, 
					h = BJ(self).getElemContentHeightWidth().height, 
					paddingTop = parseInt(BJ(self).css("paddingTop")) || 0, 
					paddingBottom = parseInt(BJ(self).css("paddingBottom")) || 0, 
					borderTop = parseInt(BJ(self).css("borderTopWidth")) || 0, 
					borderBottom = parseInt(BJ(self).css("borderBottomWidth")) || 0, 
					oldCSSTest = self.style.cssText; //以前的内联样式
               		self.style.overflow = "hidden";
                
                for (var i = 100; i >= 0; i -= 1) {
                    (function(pos){
                        setTimeout(function(){
                            BJ(self).css({
                                height: (pos / 100) * h + "px",
                                paddingTop: (pos / 100) * paddingTop + "px",
                                paddingBottom: (pos / 100) * paddingBottom + "px",
                                borderTopWidth: (pos / 100) * borderTop + "px",
                                borderBottomWidth: (pos / 100) * borderBottom + "px"
                            });
                            
                            if (!BJ.isIE()) //IE6 会卡~~
                                BJ(self).setOpacity(pos);
                            
                            if (pos == 0) {
                                self.style.cssText = oldCSSTest;
                                BJ(self).hide();
                                if (callback) 
                                    callback.call(self);
                            }
                        }, (-pos + 101) * (speed + 1));
                    })(i);
                }//for
            });
            
            return BJ(elem);
        },
        
        //淡淡出现
        fIn: function(speed, callback){
            var elem = this.elem;
            
            if (typeof speed == "string") {
				speed={
					"fast":40,
					"normal":10,
					"slow":5
				}[speed];
            }
            
            var speed = speed === undefined ? 10 : speed < 100 ? speed : 10;
            
            BJ(elem).each(function(){
                var self = this;
                
				 if (self.fOutTime || self.fInTime || BJ(self).css("display")!="none")
                    return;
                
                BJ(self).show();
                var pos = 0,endPos = BJ(self).css("opacity") * 100 || 100,oldCSSText = self.style.cssText; //记录下以前的内联样式
                BJ(self).setOpacity(pos);
                self.style.zoom = 1; //for ie
                self.fInTime = setInterval(function(){
                    pos = pos + speed / 5;
                    if (pos >= endPos) {
                        clearInterval(self.fInTime);
                        self.fInTime=null;
						
                        self.style.cssText = oldCSSText;
                        if (callback)
                            callback.call(self);
                    }
                    else {
                        BJ(self).setOpacity(pos);
                    }
                }, 1);
            });
            
            return BJ(elem);
        },
        
        //淡淡消失
        fOut: function(speed, callback){
            var elem = this.elem;
			
            if (typeof speed == "string") {
				
				speed={
					"fast":40,
					"normal":10,
					"slow":5
				}[speed];
            }
            
            var speed = speed === undefined ? 10 : speed < 100 ? speed : 10;
            
            BJ(elem).each(function(){
                var self = this;
                
                if (self.fOutTime || self.fInTime || BJ(self).css("display")=="none")
                    return;
                
                var pos = BJ(self).css("opacity") * 100 || 100, endPos = 0, oldCSSText = self.style.cssText; //记录下以前的内联样式
                BJ(self).setOpacity(pos);
                self.style.zoom = 1; //for ie
                
                self.fOutTime = setInterval(function(){
                    pos = pos - speed / 5;
                    if (pos <= endPos) {
                        clearInterval(self.fOutTime);
                        self.fOutTime=null;
						
                        self.style.cssText = oldCSSText;
                        BJ(self).hide();
                        if (callback) 
                            callback.call(self);
                    }
                    else {
                        BJ(self).setOpacity(pos);
                    }
                }, 1);
            });
            
            return BJ(elem);
        }
    };//end extent
    
    //一些全局函数
    BJ.each = function(r, callback){
        var tr = [];
        //如果传进去不是数组,是一个节点
        r.length === undefined ? tr.push(r) : tr = r;
        
        var i = 0, length = tr.length;
        for (var value = tr[0]; i < length && callback.call(value, i) !== false; value = tr[++i]) {
        }
    };//each
    BJ.trim = function(s){
        if (typeof s == "string"){
			return s.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
		} 
    };
    
    //cookie操作
    //写cookie
    BJ.setCookie = function(name, value, days){ //3个参数，一个是cookie的名子，一个是值，一个是天数
        var Days = days || 30; //此 cookie 将默认被保存 30 天
        var exp = new Date(); //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    };
    
    //取cookie
    BJ.getCookie = function(name){
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) 
            return unescape(arr[2]);
        return null;
    };
    
    //删除cookie
    BJ.delCookie = function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = BJ.getCookie(name);
        if (cval != null) 
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    };
    
    //判断浏览器是不是IE	是返回true，不是返回false
    //加了判断IE6和IE7
    BJ.isIE = function(v){
        var msg = navigator.userAgent;
        
        if (v === undefined) {
            return msg.indexOf("MSIE") > -1 ? true : false;
        }
        if (+v == 6) {
            return msg.indexOf("MSIE 6.0") > -1 &&  msg.indexOf("MSIE 6.0") < 50? true : false;
        }
        if (+v == 7) {
            return msg.indexOf("MSIE 7.0") > -1 ? true : false;
        }
		if (+v == 8) {
            return msg.indexOf("MSIE 8.0") > -1 ? true : false;
        }
    };
    
    //判断浏览器是不是Opera	是返回true，不是返回false
    BJ.isOpera = function(){
        return navigator.userAgent.indexOf("Opera") > -1 ? true : false;
    };
    
    //判断浏览器是不是Firefox	是返回true，不是返回false
    BJ.isFirefox = function(){
        return navigator.userAgent.indexOf("Firefox") > -1 ? true : false;
    };
    
    //解决IE6图片闪烁，图片缓存的问题
    //try写法是为了在FF里面不报错
    BJ.ieImage = function(){
        try {
            document.execCommand("BackgroundImageCache", false, true);
        } 
        catch (e) {
        }
    };
    
    //获取鼠标的位置	x，y返回的值是不带px的
    //对于整个页面的 x 和 y 坐标
    BJ.getMouse = function(e){
        e = e || window.event;
        if (e.pageX || e.pageY) {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }
        var dd = document.documentElement;
        return {
            x: e.clientX + dd.scrollLeft - dd.clientLeft,
            y: e.clientY + dd.scrollTop - dd.clientTop
        };
    };
    
    //获取页面可见区域的宽度和高度	 即当前页面body整个高度与宽度
    //注意是body，而不是整个浏览器的宽度与高度
    BJ.getBody = function(){
        return {
            height: document.body.clientHeight, //body对象高度		
            width: document.body.clientWidth //body对象宽度
        }
    };
    
    //获取可见区域的宽度和高度,即工作区域
    //浏览的放大，与缩小会影响该值
    BJ.getArea = function(){
        return {
            height: document.documentElement.clientHeight, //可见区域高度
            width: document.documentElement.clientWidth //可见区域宽度
        }
    };
    
    //网页被卷去的高度与宽度
    BJ.getScroll = function(){
        return {
            top: document.documentElement.scrollTop, //网页被卷去的高
            left: document.body.scrollLeft //网页被卷去的左
        }
    };
    
    //返回页面最大的宽度与高度[整个页面]
    //有DOCTYPE声明的前提
    BJ.getMax = function(){
        var dd = document.documentElement;
        return {
            height: Math.max(dd.scrollHeight, dd.clientHeight),
            width: Math.max(dd.scrollWidth, dd.clientWidth)
        }
    };
    
    //lightbox
    //可以改变窗口大小
    /*BJ.lightbox = function(obj){
        BJ.lightboxCheck = true; //控制窗口改变
        var ob = obj === undefined ? {} : obj, 
			opacity = ob.opacity || 0.4, 
			zIndex = ob.zIndex || 1000, 
			color = ob.color || "#000", 
			html = '<div style=\" filter:alpha(opacity=' + opacity * 100 + '); height:' + BJ.getMax().height + 'px;width:' + BJ.getMax().width + 'px;z-index:' + zIndex + ';background-color:' + color + ';opacity:' + opacity + ';left:0;top:0;position:absolute;\"><\/div>', 
			div = document.createElement("div");
        
        div.setAttribute("id", "BJ-lightbox");
        div.innerHTML = html;
        document.body.appendChild(div);
        
        window.onresize = function(){
            if (BJ.lightboxCheck) {
                BJ("BJ-lightbox").first().css({
                    height: BJ.getMax().height + "px",
                    width: BJ.getMax().width + "px"
                });
            }
        };
    };*/
	
	//这里用的是iframe
	//这样的话，IE6的select问题也解决了
	BJ.lightbox = function(obj){
        BJ.lightboxCheck = true; //控制窗口改变
        var ob = obj === undefined ? {} : obj, 
			opacity = ob.opacity || 0.4, 
			zIndex = ob.zIndex || 1000, 
			color = ob.color || "#000";
			
			if(BJ.isIE(6)){
				var	html = '<div style=\" filter:alpha(opacity=' + opacity * 100 + '); height:' + BJ.getMax().height + 'px;width:' + BJ.getMax().width + 'px;z-index:' + zIndex + ';background:'+color+';opacity:' + opacity + ';left:0;top:0;position:absolute;\"><\/div>'
					+'<iframe frameborder="no" marginwidth="0" marginheight="0" scrolling="no" style=\" opacity:0; filter:alpha(opacity=0);height:' + BJ.getMax().height + 'px;width:' + BJ.getMax().width + 'px;z-index:' + (zIndex-1) + ';left:0;top:0;position:absolute;\"><\/iframe>';
			}else{
				var	html = '<div style=\" filter:alpha(opacity=' + opacity * 100 + '); height:' + BJ.getMax().height + 'px;width:' + BJ.getMax().width + 'px;z-index:' + zIndex + ';background:'+color+';opacity:' + opacity + ';left:0;top:0;position:absolute;\"><\/div>';
			}
			
		var div = document.createElement("div");
        
        div.setAttribute("id", "BJ-lightbox");
        div.innerHTML = html;
        document.body.appendChild(div);
        
        window.onresize = function(){
            if (BJ.lightboxCheck) {
                BJ("BJ-lightbox").first().css({
                    height: BJ.getMax().height + "px",
                    width: BJ.getMax().width + "px"
                });
            }
        };
    };
    
    BJ.removeLightbox = function(){
        BJ.lightboxCheck = false;
        if (document.getElementById("BJ-lightbox")) {
            BJ("BJ-lightbox").remove();
        }
    };
    
    //阻止事件冒泡
    BJ.stopBubble = function(e){
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            //IE
            window.event.cancelBubble = true;
        }
    };
    
    //取消元素在某些事件上触发的默认行为
    BJ.stopDefault = function(e){
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        else {
            //IE
            window.event.returnValue = false;
        }
        return false;
    };
    
    //获取真的数组
    BJ.realArray = function(c){
        try {
            return Array.prototype.slice.call(c);
        } 
        catch (e) {
            var r = [], len = c.length;
            for (var i = 0; i < len; i++) {
                r[i] = c[i];
            }
            return r;
        }
    };
	
	BJ.getVersion=function(){
		return "1.2.9";
	};
    
	//获取事件源，不必传入event参数了
	//不支持opera 10
    BJ.getEvent=function(){
        if (document.all) {
            return window.event;//如果是ie
        }
        func = BJ.getEvent.caller;
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
	
	BJ.getEventElement=function(){
		var e=BJ.getEvent();
		return e.srcElement ? e.srcElement:e.target; 
	};
	
    //===========================================================================================================
    //BJ.fn的扩展函数	
    BJ.extend = function(obj){
        for (var i in obj) {
            //首先判断扩展的函数名是否有冲突
            for (var k in BJ.fn.prototype) {
                if (i == k) {
                    alert("扩展中的函数名已经存在，请修改!");
                    return false;
                }
            }
            BJ.fn.prototype[i] = obj[i];
        }
    };
    
    BJ.extend({
    
        /*
         * 用extend写一个测试函数
         * 鼠标放在上面持续obj.timeOn时间，才会触发obj.on
         * 鼠标离开上面持续obj.timeOut时间，才会触发obj.out
         * 那个点只自带了onmouseover和onmouseout函数
         *
         * BJ("divId").hold({
         * 		timeOut:100,	//不必须，默认为1
         * 		timeOn:100,		//不必须，默认为1
         * 		on:function(){//do something...},	//必须
         * 		out:function(){//do something...}	//不必须
         * });
         */
		hold: function(obj){
            var elem = this.elem;
            
            BJ(elem).each(function(){
                var node = this;
                
				obj.timeOn=obj.timeOn===undefined ? 1 : obj.timeOn ;
				obj.timeOut=obj.timeOut===undefined ? 1: obj.timeOut;
				
				BJ(node).bind({
					"mouseover": function(){
						var _this = this;
						clearTimeout(_this.timeOut);
						
						_this.timeOn = setTimeout(function(){
							if (obj.on !== undefined) 
								obj.on.call(_this);
						}, obj.timeOn);
					},
					
					"mouseout": function(){
						var _this = this;
						clearTimeout(_this.timeOn);
						
						_this.timeOut = setTimeout(function(){
							if (obj.out !== undefined) 
								obj.out.call(_this);
						}, obj.timeOut);
					}
				});
				
                /*node.onmouseover = function(){
					 var _this = this;	 
					 clearTimeout(_this.timeOut);

                    _this.timeOn = setTimeout(function(){
                        if (obj.on !== undefined)
                            obj.on.call(_this);
                    }, obj.timeOn);
                };
                
                node.onmouseout = function(){
					var _this=this;
                    clearTimeout(_this.timeOn);
					
					 _this.timeOut = setTimeout(function(){
                        if (obj.out !== undefined)
                            obj.out.call(_this);
                    }, obj.timeOut);
                };*/
            });
        },
        
        /*
         * 得到元素 【整体】的宽度与高度 [ 即使元素是隐藏的，也可以得到 ]
         * 包括padding和border
         */
        getElemHeightWidth: function(){
            var elem = this.elem;
            
            if (BJ(elem).css("display") != 'none') {
                return {
                    height: elem.offsetHeight || parseInt(BJ(elem).css("height")),
                    width: elem.offsetWidth || parseInt(BJ(elem).css("width"))
                }
            }
            
            var old = BJ(elem).resetCSS({
                display: '',
                visibility: 'hidden'
            });
            
            var hw = {
                height: elem.offsetHeight || parseInt(BJ(elem).css("height")),
                width: elem.offsetWidth || parseInt(BJ(elem).css("width"))
            };
            
            BJ(elem).css(old);
            
            return hw;
        },
        
        /*
         * 得到元素【内容】的宽度与高度 [ 即使元素是隐藏的，也可以得到 ]
         * 去除padding和border
         */
        getElemContentHeightWidth: function(){
            var elem = this.elem, fourWay = ["Left", "Right", "Top", "Bottom"], opadding = [], oborder = [];
            
            if (BJ(elem).css("display") != 'none') {
                for (var i = 0; i < fourWay.length; i++) {
                    opadding[i] = parseInt(BJ(elem).css("padding" + fourWay[i])) || 0;
                    
                    oborder[i] = parseInt(BJ(elem).css("border" + fourWay[i] + "Width")) || 0;
                }//for
                return {
                    width: BJ(elem).getElemHeightWidth().width - opadding[0] - opadding[1] - oborder[0] - oborder[1],
                    height: BJ(elem).getElemHeightWidth().height - opadding[2] - opadding[3] - oborder[2] - oborder[3]
                }
            }
            
            var old = BJ(elem).resetCSS({
                display: '',
                visibility: 'hidden'
            });
			
            for (var i = 0; i < fourWay.length; i++) {
                opadding[i] = parseInt(BJ(elem).css("padding" + fourWay[i])) || 0;
                oborder[i] = parseInt(BJ(elem).css("border" + fourWay[i] + "Width")) || 0;
            }
            
            var hw = {
                width: BJ(elem).getElemHeightWidth().width - opadding[0] - opadding[1] - oborder[0] - oborder[1],
                height: BJ(elem).getElemHeightWidth().height - opadding[2] - opadding[3] - oborder[2] - oborder[3]
            };
            
            BJ(elem).css(old);
            
            return hw;
        },
		
		/*
		 * //说明下，现在暂时不支持颜色的语意表达，比如red，blue等，这个其实也很好实现。
		 * 
		 * BJ("div").changeColor({
		        "type": "backgroundColor", 		//默认是背景颜色，如果 "type":"color"说明改变的是字体颜色,
		        "from":"#223",					//不是必须	,如果没有定义，就是从元素里面获取它的样式，如果它没有就获取它父亲节点的，一直找下去
		        								//最后都没有,就设置为#fff
												
		        "to": "#000", 					//必须，也应该支持rgb(0,0,0)，#003399;	反正颜色这3种格式，都应该支持
		        "speed":"slow"					//默认是 normal
		        "changing":function(){},		//正在改变颜色中的回调函数
		        "end":function(){}				//改变完后的回调函数
		    });
		 */
		changeColor: function(obj){
	        var elem = this.elem,
	      		type = obj.type === undefined ? "backgroundColor" : obj.type,
	 			to = obj.to,
				from = obj.from === undefined ? false : obj.from,			
				speed = obj.speed === undefined ? "normal" : obj.speed;
	        
			switch(speed){
				case "normal":speed=70;break;
				case "fast":speed=30;break;
				case "slow":speed=100;break;
			};
			
			//传入节点，获取它的颜色
			//font color 不存在transparent的问题，而且直接可以获取的到，不必去递归获取父亲的颜色继承
			var getColor=function(node){
				//如果事先没有定义
				if(from===false){
					if(type==="color"){
						return BJ(node).css("color");
					}
					else if(type==="backgroundColor"){
						//第2种可能是针对chrome和safira
						if(BJ(node).css("backgroundColor")==="transparent" || BJ(node).css("backgroundColor")==="rgba(0, 0, 0, 0)"){
							while(BJ(node).parent()){
								var parentBgColor=BJ(node).parent().css("backgroundColor");
								
								if(parentBgColor!=="transparent" && !!parentBgColor){
									return parentBgColor;
								}
								
								node=BJ(node).parent().getElem();
							}
							//如果都没有得到
							return "#fff";
						}else{
							return BJ(node).css("backgroundColor");
						}
					}else{
						alert("type格式定义错误.");
					}
				}else{
					node.style[type]=from;
					return from;
				}
			};
			
			//获取10进制的rgb格式
			//color 是颜色的string格式
			
			//取 rgb(r,g,b)里面的r,g,b的值
			var colorFormat=function(color){
				//rgb(12,13,14)
				if(/^rgb/.test(color)){
					var c = color.split(",");
					
					return {
						r:+c[0].slice(4, c[0].length),
						g:+c[1],
						b:+c[2].slice(0, c[2].length - 1)
					}
				}
				
				//#123
				else if(/^\#/.test(color) && color.length==4){
					return {
						r:parseInt("0x" + color.slice(1, 2)+color.slice(1, 2), 16),
						g:parseInt("0x" + color.slice(2, 3)+color.slice(2, 3), 16),
						b:parseInt("0x" + color.slice(3, 4)+color.slice(3, 4), 16)
					}
				}
				
				//#112233
				else if(/^\#/.test(color) && color.length==7){
					return {
						r:parseInt("0x" + color.slice(1, 3), 16),
						g:parseInt("0x" + color.slice(3, 5), 16),
						b:parseInt("0x" + color.slice(5, 7), 16)
					}
				}
				
				else{
					alert("颜色格式错误.");
					return false;
				}
			};
			
			//颜色值改变的平滑函数
			var colorChanging=function(begin,end){
				 if (begin < end) {
	                begin = begin + Math.ceil((end - begin) / speed);
	            }
	            
	            if (begin > end) {
	                begin = begin - Math.ceil((begin - end) / speed);
	            }
				
	            return begin;
			};
			
			BJ(elem).each(function(){
				var _this = this,
					beforeColor=colorFormat(getColor(_this)),
					afterColor=colorFormat(to),
					beginR=beforeColor.r,
					beginG=beforeColor.g,
					beginB=beforeColor.b;
				
				//防止多次同时调用changeColor是，由于时间函数名相同而引起的bug	
				//这样多次调用也相当于异步了，互不影响
				var m=Math.random(),
					time="changeColorTime"+m.toString();
				
				_this[time]=setInterval(function(){
					beginR = colorChanging(beginR, afterColor.r);
					beginG = colorChanging(beginG, afterColor.g);
					beginB = colorChanging(beginB, afterColor.b);
					
					_this.style[type]='rgb(' + beginR + ',' + beginG + ',' + beginB + ')';

					if(obj.changing){
						obj.changing.call(_this);
					}
					
					if(beginR===afterColor.r && beginG===afterColor.g && beginB===afterColor.b){
						clearInterval(_this[time]);
						if(obj.end){
							obj.end.call(_this);
						}
					}
				}, 1);
			})
	    }
    });
    
    //Ajax
    /*====================================================================================================================
     * e.g.
     * 		BJ.ajax({
     * 			url:"index.jsp",
     * 			before:function(){//do something...},
     * 			success:function(msg){ do something...},
     * 			error:function(){////do something...},
     *          xml:true,
     *          stop:function(){}
     *		})
     ====================================================================================================================*/
    BJ.ajax = function(obj){
        if (!obj.url) 
            return;
        var xmlhttp = (function(){
            try {
                return new XMLHttpRequest(); // Firefox, Opera 8.0+, Safari , IE7
            } 
            catch (e) {
                if (window.ActiveXObject) {
                    var ActiveXName = ['MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.4.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp', 'Microsoft.XMLHttp'];
                    for (var i = 0; i < ActiveXName.length; i++) {
                        try {
                            return new ActiveXObject(ActiveXName[i]); //Internet Explorer 5.0+
                        } 
                        catch (e) {
                            return false;
                        }
                    }
                }
                else {
                    return false;
                }
            }
        })();
        
        var type = obj.type || "get",  //默认是get
 			asyn = obj.asyn || true;  //默认是异步
        if (xmlhttp) {
            xmlhttp.open(type, obj.url, asyn);
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState != 4) {
                    //如果before在object内，就运行，否则就不运行
                    //一般用作loading
                    if (obj.before!==undefined) {
                        obj.before();
                    }
                }
                else {
                    if (xmlhttp.status == 200) {
						if(obj.success!==undefined)
                        	obj.xml === true ? obj.success(xmlhttp) : obj.success(BJ.trim(xmlhttp.responseText));
                    }
                    else {
                        alert("Error: status code is " + xmlhttp.status);
                    }
                }
            };
            
            //如果延时了，就可以调用stop函数，进行处理，把之前的ajax请求取消掉          
            if (obj.stop !== undefined) {
                var time = obj.time || 10000; //默认超时是10秒的时间
                setTimeout(function(){
                    if (xmlhttp.readyState != 4) {
                        xmlhttp.abort();
                        obj.stop();
                        return;
                    }
                }, time);
            }
            
            //解决IE ajax请求缓存的问题
            xmlhttp.setRequestHeader("If-Modified-Since", "0");
            //xmlhttp.setRequestHeader("Cache-Control","no-cache");
            
            xmlhttp.send(null);
        }
        else {
            //如果error在obeject内，就运行，否则就不运行
            if (obj.error!==undefined) {
                obj.error();
            }
        }
    };
    /* xml文件样板
     <?xml version="1.0" encoding="utf-8"?>
     <root>
     <books id="bookss">
     <book>
     <name id="hlm">红楼梦</name>
     <author>曹雪芹</author>
     <info>红楼梦写于十八世纪中叶的清乾隆时代，内容以贾、王、史、薛四大家族为背景，以贾宝玉、林黛玉的爱情悲剧为主线，
     描写了封建官僚贾、王、史、薛四大家族，特别是贾家的衰落过程，揭露了封建统治者的罪恶，说明了封建王朝必将衰落的历史命运。
     作品语言优美生动，善于刻画人物，塑造了贾宝玉、林黛玉、王熙凤、薛宝钗、尤三姐等个性鲜明的人物。本书规模宏大，结构严谨，
     具有很高的艺术成就。</info>
     </book>
     <book>
     <name id="xyj">西游记</name>
     <author>吴承恩</author>
     <info>西游记以民间传说的唐僧取经的故事和有关话本及杂剧（元末明初杨讷作）基础上创作而成。西游记前七回叙述孙悟空出世，有大闹天宫等故事。
     此后写孙悟空随唐僧西天取经，沿途除妖降魔、战胜困难的故事。书中唐僧、孙悟空、猪八戒、沙僧等形象刻画生动，规模宏大，结构完整。</info>
     </book>
     <book>
     <name id="sgyy">三国演义</name>
     <author>罗贯中</author>
     <info>《三国演义》故事开始于刘备、关羽、张飞桃园三结义，结束于王浚平吴，描写了东汉末年和三国时代魏、蜀、吴三国之间的军事、政治斗争。
     文字浅显、人物形象刻画深刻、情节曲折、结构宏大。</info>
     </book>
     <book>
     <name id="shz">水浒传</name>
     <author>施耐庵</author>
     <info>作者在《宣和遗事》及相关话本、故事的基础上创作而成。全书以描写农民战争为主要题材，塑造了李逵、武松、林冲、
     鲁智深等梁山英雄，揭示了当时的社会矛盾。故事曲折、语言生动、人物性格鲜明，具有很高的艺术成就。</info>
     </book>
     </books>
     <me>
     <name truename="珏">paper</name>
     <age>24</age>
     <blog><![CDATA[
     http://hi.baidu.com/paperstudio
     ]]></blog>
     <job>js、css and xhtml</job>
     </me>
     </root>
     */
    //解析xml
    BJ.parseXML = function(xmlhttp){
        var xmlDoc = xmlhttp.responseXML.documentElement, //存放找到节点，就push到这个数组里面
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
                }
                else {
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
                }
                else {
                    this.findChild(xmlDoc, nodes);
                    return result;
                }//else
            },//find
            //返回xml节点里面的值，如果一个节点就返回一个值，如果很多节点，就返回值的数值
            //已知这个节点不包含其他的节点，只是包含字符串或者值
            //xmlNode除了直接入节点名称外，另外还可以传入层次结构
            //例如:BJ.parseXML(msg).findValue("books book name"); BJ.parseXML(msg).findValue("book name"); 这个对于这个xml文件来说是一样的
            //或者 BJ.parseXML(msg).findValue("me name");
            //返回的结果是value的数组模式
            findValue: function(xmlNode){
                var value = [], //用来存放返回值的数组
 					nodes = this.stringToArray(xmlNode);
                
                if (nodes.length == 1) {
                    var xmlNodes = xmlDoc.getElementsByTagName(xmlNode);
                    BJ(xmlNodes).each(function(){
                        value.push(BJ(this).text());
                    });
                }
                else {
                    BJ(this.find(xmlNode)).each(function(){
                        value.push(BJ.trim(BJ(this).text())); //去除两边的空格
                    });
                }
                
                return value;
            }//findValue
        }
    };
	
//	//drag功能
//	//node是要移动的节点，hand是鼠标只能放在这里进行拖动 【 如果hand没有定义，则表示鼠标通过node来进行拖动 】
//	//拖拽的内容在FF下不能为空，至少加个&nbsp;，这样FF才不会出现拖拽不平滑的bug
//	/*
//	 * obj{
//	 * 		node,	//必须
//	 * 	 	hand,
//	 * 		cursor, //移动时的鼠标样式
//	 *  	onlyX,	//为true则只能x方向
//	 *  	onlyY,	//同上
//	 *  	opacity,
//	 *  	mouseup(hand),		//鼠标释放后的回调函数	this才是真正的node
//	 *  	mousemove(hand),	//鼠标移动时回调函数
//	 *  	mousedown(hand)		//鼠标按下去时回调函数
//	 *  }
//	 */
//	BJ.drag=function(obj){
//		return new BJ.drag.fn(obj);
//	};
//	BJ.drag.fn = BJ.drag.prototype = function(obj){
//		var key = false, 			//移动块的锁定功能
//			elem,					//被移动的块
//			hand, 					//鼠标放在块的什么地方移动
//			parentnode = null;		//获取离他最近的relation或者absolute父亲的节点的位置	
//		
//		//node,hand只能是节点的id的string类型或者DOM节点
//		elem = typeof obj.node == "string"?
//				document.getElementById(obj.node):
//				obj.node;
//
//		if (obj.hand) {
//			hand = typeof obj.hand == "string" ? 
//					document.getElementById(obj.hand) : 
//					obj.hand; 
//		}
//		else {
//			hand = elem;
//		}
//		
//		elem.style.zoom = 1; //解决IE透明没有定义宽度与高度的问题
//		
//		//寻找elem的父亲节点有没有position属性，并找到它
//		var el=elem;	//复制一份
//		while (BJ(el).parent()) {
//			var p=BJ(el).parent(),
//				position=p.css("position");
//			
//			if(position=="relative" || position=="absolute"){
//				parentnode = p.getElem();break;
//			}else{
//				el=p.getElem();
//			}
//		}//while
//			
//		var oldOpacityTemp = BJ(elem).css("opacity"),
//			oldOpacity = oldOpacityTemp <=1  ? oldOpacityTemp * 100 : oldOpacityTemp,
//			oldCursor=BJ(hand).css("cursor"),
//			oldOverflow=hand.style.overflow;
//		
//		var $oldCss=elem.style.cssText;
//		//初始化，回调函数
//		if(obj.init){
//			obj.init.call(elem,$oldCss);
//		}
//		
//		hand.onmousedown = function(event){
//            if (hand.setCapture) hand.setCapture();
//            else if (window.captureEvents) window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
//			
//			key = true;
//			
//			//点击下去后，鼠标的坐标
//			var x = BJ.getMouse(event).x, 
//				y = BJ.getMouse(event).y;
//			
//			if (parentnode) {
//				var px = BJ(parentnode).getElementPos().x, 
//					py = BJ(parentnode).getElementPos().y,
//					//父亲节点的border宽度也要剪掉，不然也会发上boder-width的偏移
//					pBorderTop=parseInt(BJ(parentnode).css("borderTopWidth")) || 0,
//					pBorderLeft=parseInt(BJ(parentnode).css("borderLeftWidth")) || 0,
//					
//					pPaddingLeft=parseInt(BJ(parentnode).css("paddingLeft")) || 0;
//					
//				if(!BJ.isIE(6)){
//					elem.style.left = BJ(elem).getElementPos().x - px - pBorderLeft + "px";
//					elem.style.top = BJ(elem).getElementPos().y - py - pBorderTop + "px";
//				}else{
//					elem.style.left = BJ(elem).getElementPos().x - px - pPaddingLeft - pBorderLeft  + "px";
//					elem.style.top = BJ(elem).getElementPos().y - py + "px";
//				}
//			}
//			else {
//				elem.style.left = BJ(elem).getElementPos().x + "px";
//				elem.style.top = BJ(elem).getElementPos().y + "px";
//			}
//
//			//放在这里是为了获取它按下去时的left和top
//			if (obj.mousedown) {
//				obj.mousedown.call(elem,hand);
//			}
//			
//			//改变了属性的放在callback的下面
//			hand.style.cursor = obj.cursor || "auto"; 		//鼠标指针发生变化
//			elem.style.position = "absolute";				//变成绝对路径才能移动
//			elem.style.margin=0;							//清空margin，防止点元素发生瞬间位移
//			elem.style.overflow= "hidden";					//ff的bug
//			
//			//如果定义了半透明，就加入半透明
//			if (obj.opacity) {
//				BJ(elem).setOpacity(obj.opacity); //移动时，被移动的物体半透明
//			}
//			
//			document.onmousemove = function(e){
//				if (!key) return;
//				var event = window.event || e, xCurrent = BJ.getMouse(event).x, yCurrent = BJ.getMouse(event).y;
//				
//				if (obj.onlyX === true) {
//					elem.style.left = parseInt(elem.style.left) + xCurrent - x + "px";
//				}
//				else if (obj.onlyY === true) {
//					elem.style.top = parseInt(elem.style.top) + yCurrent - y + "px";
//				}
//				else {
//					elem.style.left = parseInt(elem.style.left) + xCurrent - x + "px";
//					elem.style.top = parseInt(elem.style.top) + yCurrent - y + "px";
//				}
//				
//				x = xCurrent;
//				y = yCurrent;
//				
//				if (obj.mousemove) {
//					obj.mousemove.call(elem,hand);
//				}
//			};//document.onmousemove
//			
//			document.onmouseup = function(){
//				if(!key) return;
//                if (hand.releaseCapture) hand.releaseCapture();
//                else if (window.releaseEvents)  window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
//				
//				//如果定义了半透明，移动结束时就不半透明
//				if (obj.opacity) {
//					BJ(elem).setOpacity(oldOpacity); //移动时，被移动的物体半透明
//				}
//				
//				hand.style.cursor = oldCursor; 		//鼠标指针发生变化
//				hand.style.overflow = oldOverflow; //复位
//				
//				if (obj.mouseup)
//					obj.mouseup.call(elem,hand);
//				
//				key=false;
//			};//document.onmouseup
//			
//		};// document.onmousedown
//		
//	};//BJ.drag.fn

	//drag功能 	[2010-6-11号改版]
	//node是要移动的节点，hand是鼠标只能放在这里进行拖动 【 如果hand没有定义，则表示鼠标通过node来进行拖动 】
	//拖拽的内容在FF下不能为空，至少加个&nbsp;，这样FF才不会出现拖拽不平滑的bug
	/*
	 * obj{
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
	BJ.drag=function(obj){
		return new BJ.drag.fn(obj);
	};
	BJ.drag.fn = BJ.drag.prototype = function(obj){
		var key = false, 			//移动块的锁定功能
			elem,					//被移动的块
			hand, 					//鼠标放在块的什么地方移动
			parentnode = null;		//获取离他最近的relation或者absolute父亲的节点的位置	
		
		//node,hand只能是节点的id的string类型或者DOM节点
		elem = typeof obj.node == "string"?
				document.getElementById(obj.node):
				obj.node;

		if (obj.hand) {
			hand = typeof obj.hand == "string" ? 
					document.getElementById(obj.hand) : 
					obj.hand; 
		}
		else {
			hand = elem;
		}
		
		elem.style.zoom = 1; //解决IE透明没有定义宽度与高度的问题
		
		//寻找elem的父亲节点有没有position属性，并找到它
		var el=elem;	//复制一份
		while (BJ(el).parent()) {
			var p=BJ(el).parent(),
				position=p.css("position");
			
			if(position=="relative" || position=="absolute"){
				parentnode = p.getElem();break;
			}else{
				el=p.getElem();
			}
		}//while
			
		var oldOpacityTemp = BJ(elem).css("opacity"),
			oldOpacity = oldOpacityTemp <=1  ? oldOpacityTemp * 100 : oldOpacityTemp,
			oldCursor=BJ(hand).css("cursor"),
			oldOverflow=hand.style.overflow;
		
		var $oldCss=elem.style.cssText;
		//初始化，回调函数
		if(obj.init){
			obj.init.call(elem,$oldCss);
		}
		
		hand.onmousedown = function(e){
            if (hand.setCapture) hand.setCapture();
            else if (window.captureEvents) window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			e=e || window.event;
			key = true;
			
			//点击下去后，鼠标的坐标
			var x = BJ.getMouse(e).x, 
				y = BJ.getMouse(e).y;
        
			if (parentnode) {
				var px = BJ(parentnode).getElementPos().x, 
					py = BJ(parentnode).getElementPos().y,
					//父亲节点的border宽度也要剪掉，不然也会发上boder-width的偏移
					pBorderTop=parseInt(BJ(parentnode).css("borderTopWidth")) || 0,
					pBorderLeft=parseInt(BJ(parentnode).css("borderLeftWidth")) || 0,
					
					pPaddingLeft=parseInt(BJ(parentnode).css("paddingLeft")) || 0;

				elem.style.left = BJ(elem).getElementPos().x - px - pBorderLeft + "px";
				elem.style.top = BJ(elem).getElementPos().y - py - pBorderTop + "px";
			}
			else {
				elem.style.left = BJ(elem).getElementPos().x + "px";
				elem.style.top = BJ(elem).getElementPos().y + "px";
			}

			//放在这里是为了获取它按下去时的left和top
			if (obj.mousedown) {
				obj.mousedown.call(elem,e,hand);
			}
			
			//改变了属性的放在callback的下面
			hand.style.cursor = obj.cursor || "auto"; 		//鼠标指针发生变化
			elem.style.position = "absolute";				//变成绝对路径才能移动
			elem.style.margin=0;							//清空margin，防止点元素发生瞬间位移
			elem.style.overflow= "hidden";					//ff的bug
			
			//如果定义了半透明，就加入半透明
			if (obj.opacity) {
				BJ(elem).setOpacity(obj.opacity); //移动时，被移动的物体半透明
			}
			
			document.onmousemove = function(e){
				if (!key) return;
				e=e || window.event;
			
				var xCurrent = BJ.getMouse(e).x, 
					yCurrent = BJ.getMouse(e).y;
					
				elem.cLeft=parseInt(elem.style.left) + xCurrent - x;
				elem.cTop=parseInt(elem.style.top) + yCurrent - y;
					
				if (!elem.lock) {
					if (obj.onlyX === true) {
						elem.style.left = elem.cLeft + "px";
					}
					else 
						if (obj.onlyY === true) {
							elem.style.top = elem.cTop + "px";
						}
						else {
							elem.style.left = elem.cLeft + "px";
							elem.style.top = elem.cTop + "px";
						}
					
					x = xCurrent;
					y = yCurrent;
				}
					
				if (obj.mousemove) {
					obj.mousemove.call(elem,e,hand);
				}
			};//document.onmousemove
			
			document.onmouseup = function(e){
			   if(!key) return;
			   e=e || window.event;
               if (hand.releaseCapture) hand.releaseCapture();
               else if (window.releaseEvents)  window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
				
				//如果定义了半透明，移动结束时就不半透明
				if (obj.opacity) {
					BJ(elem).setOpacity(oldOpacity); //移动时，被移动的物体半透明
				}
				
				hand.style.cursor = oldCursor; 		//鼠标指针发生变化
				hand.style.overflow = oldOverflow; //复位
				
				if (obj.mouseup)
					obj.mouseup.call(elem,e,hand);
				
				key=false;
			
			};//document.onmouseup
			
		};// document.onmousedown
		
	};//BJ.drag.fn
})();
