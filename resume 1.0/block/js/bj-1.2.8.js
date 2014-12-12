/*
 * author 		zhang binjue
 * blog			http://hi.baidu.com/paperstudio
 * copyright	No Rights Reserved
 * version		1.2.8
 * reference	Jquery-1.3.2.js
 *
 * 主要是处理 函数可以传递的运行
 * 
 * 2009-09-30
 * ->	优化动画函数~~~
 * 		修改了一点each函数，不晓得对不对~~~  --！
 * 
 * 2009-09-30
 * ->	修改ajax函数
 * 		a.加了判断status的功能
 * 		b.加了ajax超时的判断处理功能
 * 	
 * 2009-10-09
 * ->	增加了text函数(获取单个节点下面的内容[不包含节点])
 * 		去掉了 getFirstChildValue 函数
 * 
 * 2009-10-09
 * ->	修改了很多DOM函数，主要是对null进行了判断，防止出错，也为了方便判断是否有数据
 * 
 * 2009-10-10
 * ->	修改next(num),prev(num)可以带参数，来获取特定的位置的节点
 * 
 * 2009-10-12
 * ->	修正了drag 里面 mouseup_callback的一个严重的bug
 *
 * 2009-10-13
 * ->	重写text方法
 *
 * 2009-10-21
 * ->	修正loghtbox没有参数时，不出来的bug
 */
(function(){
    var window = this, undefined, BJ = window.BJ = function(name){
        //如果没有参数
        if (name === undefined) { //原来是 name=="" || name==null 这样IE6有错，郁闷
            return; //不能为空 ,为空的话，直接使用BJ.function.....
        }
        else {
            if (typeof name == "string" && name.charAt(0) == "#") { //如果传入的带#号，表示仅仅是为了获得那个节点
                var nameTemp = name.substring(1, name.length);
                return document.getElementById(nameTemp);
            }
            return new BJ.fn(name); //如果不带#号，表示得到BJ对象
        }
    };
    
    /*====================================================================================================================
     * 没有引用某个节点的BJ（即没有带参数的BJ全局函数）
     * 不涉及到节点的一些问题，如ajax等
     * e.g.
     * 		BJ.ajax({
     * 			url:"index.jsp",
     * 			before:function(){//do something...},
     * 			success:function(rpText){ do something...},
     * 			error:function(){////do something...}
     *		})
     ====================================================================================================================*/
    BJ.ajax = function(ob){
        if (!ob.url)
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
        
        var type = ob.type || "get";	//默认是get
        var asyn = ob.asyn || true;	//默认是异步
        if (xmlhttp) {
            xmlhttp.open(type, ob.url, asyn);
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState != 4) {
                    //如果before在object内，就运行，否则就不运行
                    //一般用作loading
                    if (ob.before) {
                        ob.before();
                    }

                }
                else {
					//如果想要确认status是否为200，则必须设置checkStatue为true
					if(ob.checkStatus===true){
						if(xmlhttp.status==200){
							 ob.xml ? ob.success(xmlhttp) : ob.success(BJ.trim(xmlhttp.responseText));
						}else{
							alert("Error: status code is " + xmlhttp.status);
						}
					}else{
						//这个success函数必须要有！！
                    	//注意，success函数传入了值进去
                   	 	//或者仅仅把xmlhttp传入success也可以，然后在success的function里面写var tempText=xmlhttp.responseText 也可以的。
                    	//或许这个以后会做修改，目前还是直接把返回的文本给success,因为这个还是很常用的
                    	
                    	//如果新加入了一个xml,参数为true，说明传进来的是xml[这样的话就传xmlhttp，像怎样就怎样]，默认是得到它的txt
                    	ob.xml ? ob.success(xmlhttp) : ob.success(BJ.trim(xmlhttp.responseText));
					}
                }
            };
			
			//如果延时了，就可以调用stop函数，进行处理，把之前的ajax请求取消掉          
            if (ob.stop !== undefined) {
                var time = ob.time || 10000;	//默认超时是10秒的时间
                
                setTimeout(function(){
                    if (xmlhttp.readyState != 4) {
                        xmlhttp.abort();
                        ob.stop();
                        return;
                    }
                }, time);
            }

			//这个好像可以解决IE ajax请求缓存的问题，如果不行，就把它注释吧，正在测试
			xmlhttp.setRequestHeader("If-Modified-Since","0"); 
			//xmlhttp.setRequestHeader("Cache-Control","no-cache");
			
            xmlhttp.send(null);
        }
        else {
            //如果error在obeject内，就运行，否则就不运行
            if (ob.error) {
                ob.error();
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
        var xmlDoc = xmlhttp.responseXML.documentElement;
		
        //存放找到节点，就push到这个数组里面
        var find_child_result = [];
        
        //复制一份
        var tempDoc = xmlDoc;
        
        return {
            //找到字符串里面的节点变成数组
            //"books book name" =>[books,book,name]
            //"books"=>[books]
            stringToArray: function(s){
                var A = [];
                if (s.indexOf(" ") > -1) {
                    A = s.split(" ");
                }
                else {
                    A[0] = s;
                }
                return A;
            },
            
            //知道父亲节点，返回孩子结点的函数
            //这个函数可以独立进行  [ 深度递归遍历 ]
            //@nodes 传入的是节点名称数组 => e.g.[books,book,name]
            find_child: function(root, nodes){
                //alert("nodes.length="+nodes.length+"  "+nodes);
                var self = this, tempRoot = root.getElementsByTagName(nodes[0]); //这个还是一个集合，即使得到一个值，也是集合
                if (nodes.length == 1) {
                    find_child_result.push(tempRoot[0]); //所以这里要返回一个值的集合的值    
                }
                else {
                    for (var i = 0; i < tempRoot.length; i++) {
                        var tempNodes = nodes.concat();
                        tempNodes.shift();
                        self.find_child(tempRoot[i], tempNodes);
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
                    this.find_child(xmlDoc, nodes);
                    return find_child_result;
                }//else
            },//find
            //返回xml节点里面的值，如果一个节点就返回一个值，如果很多节点，就返回值的数值
            //已知这个节点不包含其他的节点，只是包含字符串或者值
            //xmlNode除了直接入节点名称外，另外还可以传入层次结构
            //例如:BJ.parseXML(msg).findValue("books book name"); BJ.parseXML(msg).findValue("book name"); 这个对于这个xml文件来说是一样的
            //或者 BJ.parseXML(msg).findValue("me name");
            //返回的结果是value的数组模式
            findValue: function(xmlNode){
                var values = [], //用来存放返回值的数组
 					nodes = this.stringToArray(xmlNode);
                
                if (nodes.length == 1) {
                    var xmlNodes = xmlDoc.getElementsByTagName(xmlNode);
                    BJ(xmlNodes).each(function(){
                        values.push(BJ(this).text());
                    });
                    return values.length == 1 ? values[0] : values;
                }
                else {
                    BJ(this.find(xmlNode)).each(function(){
                        values.push(BJ.trim(BJ(this).text())); //去除两边的空格
                    });
                    return values;
                }
            }//findValue
        }
    };
    
    /*
     BJ.type(101);          // return 'Number'
     BJ.type('hello');      // return 'String'
     BJ.type({});           // return 'Object'
     BJ.type([]);           // return 'Array'
     BJ.type(function(){}); // return 'Function'
     BJ.type(new Date());   // return 'Date'
     BJ.type(document);     // return 'HTMLDocument'
     
     */
    BJ.type = function(o){
        return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
    };
    
    //判断浏览器是不是IE	是返回true，不是返回false
    BJ.isIE = function(){
        return navigator.userAgent.indexOf("MSIE") > -1 ? true : false;
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
    //要放在window.onload里面
    BJ.ieImage = function(){
        try {
            document.execCommand("BackgroundImageCache", false, true);
        } 
        catch (e) {
        }
    };
    
    //获取鼠标的位置	x，y返回的值是不带px的
	//对于整个页面的 x 和 y 坐标
    BJ.getMouse = function(ev){
        ev = ev || window.event;
        if (ev.pageX || ev.pageY) {
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        }
        return {
            x: ev.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
            y: ev.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
        };
    };
    
    //获取工作的区域
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
    //以后lightbox用这个保险点 :-)
    BJ.getMax = function(){
        return {
            height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight),
            width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth)
        }
    };
    
    //addLoadEvent
    //window.onload加载函数
    BJ.addLoadEvent = function(func){
        var oldonload = window.onload;
        if (typeof window.onload != 'function') 
            window.onload = func;
        else {
            window.onload = function(){
                oldonload();
                func();
            }
        }
    };
    
    //cookie操作
    //写cookie
    BJ.setCookie = function(name, value, days){ 			//3个参数，一个是cookie的名子，一个是值，一个是天数
        var Days = days || 30; 								//此 cookie 将默认被保存 30 天
        var exp = new Date(); 								//new Date("December 31, 9998");
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
    
    //去掉字符串两边的空格
    BJ.trim = function(s){
        if (typeof s == "string") 
            return s.replace(/^\s+|\s+$/g, "");
    };
    
    //精简了jquery的each
    // r 目前必需是数组
    //数组里面可以是数字，节点，或字符串
    BJ.each = function(r, callback){
        var tr = [];
        r.length === undefined ? //如果传进去 不是 数组 !
 				tr.push(r) : tr = r;
        
        var i = 0, length = tr.length;
        for (var value = tr[0]; i < length && callback.call(value, i) !== false; value = tr[++i]) {}
    };//each
    
    //lightbox
	//解决了改变窗口大小，背景大小不变的bug
    BJ.lightbox = function(obj){
		BJ.lightbox_check=true;
		
		var ob=obj===undefined ? {} : obj;	//bug 修正
		
        var op = ob.opacity || 40,
			z =  ob.zindex || 1000,
			c= ob.color || "#000";
		
        var lightbox_html = '<div style=\" filter:alpha(opacity=' + op + '); height:' + BJ.getMax().height + 'px;width:' + BJ.getMax().width + 'px;z-index:' + z + ';background-color:'+c+';opacity:' + op / 100 + ';left:0;top:0;position:absolute;\"><\/div>';
        var BJ_lightbox=document.createElement("div");
        BJ_lightbox.setAttribute("id","BJ_lightbox");
        BJ_lightbox.innerHTML += lightbox_html;
		document.body.appendChild(BJ_lightbox);
		
		window.onresize=function(){
			if (BJ.lightbox_check) {
				BJ("BJ_lightbox").first().css({
					height:BJ.getMax().height+"px",
					width:BJ.getMax().width+"px"
				});
			}
		};
    };
    
    BJ.removeLightbox = function(){
		BJ.lightbox_check=false;
		if(document.getElementById("BJ_lightbox")!=null){
			 BJ("BJ_lightbox").remove();
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
    
    
//drag功能
//拖拽功能,被拖动的块的css一定是绝对位置
//node是要移动的节点，hand是鼠标只能放在这里进行拖动 【 如果hand没有定义，则表示鼠标通过node来进行拖动 】
//return 一个new的函数的实例，是为了运行多个BJ.drag时，只能运行最后一个函数,因为this是共用了 ！！！
//callback是鼠标释放的时候，运行的函数
/*
 * obj{
 * 		node,	//必须
 * 	 	hand,
 *  	onlyX,	//为true则只能x方向
 *  	onlyY,	//同上
 *  	opacity,
 *  	mouseup_callback(node),		//鼠标释放后的回调函数
 *  	mousemove_callback(node),	//鼠标移动时回调函数
 *  	mousedown_callback(node)	//鼠标按下去时回调函数
 *  }
 */
BJ.drag=function(obj){
	return new BJ.drag.fn(obj);
};
BJ.drag.fn=BJ.drag.prototype=function(obj){
	this.key=false;		//移动块的锁定功能
	
	this.elem;	//被移动的块
	this.p;		//鼠标放在块的什么地方移动
	
	//node只能是节点的id的string类型或者node的DOM节点
	if(typeof obj.node=="string")	//node是节点的id-name
		this.elem=document.getElementById(obj.node);
	else
		this.elem=obj.node;	//node是一个节点
	
	if(obj.hand){
		if(typeof obj.hand=="string")	//hand是节点的id-name
			this.p=document.getElementById(obj.hand);
		else 
			this.p=obj.hand;	//hand是一个节点	
	}else{
		this.p=this.elem;
	}
	
	this.p.style.zoom=1;	//解决IE透明没有定义宽度与高度的问题
	
	var self=this;
	self.p.onmousedown=function(event){
		try{
			self.p.setCapture(); 	
		}catch(e){}
			
		if(obj.mousedown_callback){
			obj.mousedown_callback(self.elem);
		}
		
		self.key=true;
		
		self.p.style.cursor="move";	//鼠标指针发生变化
		
		//如果定义了半透明，就加入半透明
		if(obj.opacity){
			BJ(self.elem).setOpacity(obj.opacity);	//移动时，被移动的物体半透明
		}
		
		//点击下去后，鼠标的坐标
		self.x=BJ.getMouse(event).x;
		self.y=BJ.getMouse(event).y;
		
		//alert(parseInt(BJ(self.elem).css("top")));
		//self.elem.style.left=isNaN(parseInt(BJ(self.elem).css("left")))?0:BJ(self.elem).css("left");
		//self.elem.style.top=isNaN(parseInt(BJ(self.elem).css("top")))?0:BJ(self.elem).css("top");
		
		self.elem.style.left=isNaN(parseInt(BJ(self.elem).css("left")))?"0px":BJ(self.elem).css("left");
		self.elem.style.top=isNaN(parseInt(BJ(self.elem).css("top")))?"0px":BJ(self.elem).css("top");
		
        document.onmouseup = function(){
			try{
				self.p.releaseCapture(); 	
			}catch(e){}
			
			if(obj.mouseup_callback){
				if(self.key)
					obj.mouseup_callback(self.elem);
			}
			
			//如果定义了半透明，移动结束时就不半透明
			if(obj.opacity){
				BJ(self.elem).setOpacity(100);	//移动时，被移动的物体半透明
			}
			
			 //this.onmousemove = null;
			self.key=false;
			self.p.style.cursor="auto";			//鼠标指针发生变化
        };
		
		try{
			 event.preventDefault();
		}catch(e){}

        document.onmousemove = function(e){
			if(!self.key){return ;}
            var event = window.event || e;
            if (document.all && event.button == 0) {
                this.onmousemove = null;
                return false;
            };
			self.x_current=	BJ.getMouse(event).x;
			self.y_current=	BJ.getMouse(event).y;
			
			if(obj.onlyX){
				self.elem.style.left=parseInt(self.elem.style.left,10)+self.x_current-self.x+"px";
			}
			else if(obj.onlyY){
				self.elem.style.top=parseInt(self.elem.style.top,10)+self.y_current-self.y+"px";
			}
			else{
				self.elem.style.left=parseInt(self.elem.style.left,10)+self.x_current-self.x+"px";
				self.elem.style.top=parseInt(self.elem.style.top,10)+self.y_current-self.y+"px";
			}

			self.x=self.x_current;
			self.y=self.y_current;
			
			if(obj.mousemove_callback){
				obj.mousemove_callback(self.elem);
			}
        };
	};
};
    
    
    /*====================================================================================================================
     * 带有某个节点的BJ
     * 主要是处理这个节点有关的东西
     * 一般是处理带有id属性的节点的一些问题
     * 
     * e.g.
     * 		BJ("idName").first();	//第一个孩子
     * 		BJ("idName").hide();	//隐藏
     * 		BJ("idName").html();	//取它内部的html
     * 		BJ(this).hide("fast");	//对this对应元素的隐藏
     * 		......
     ====================================================================================================================*/
    BJ.fn = BJ.prototype = function(name){
        //当前的节点
        //目前这个版本就只做带有id的节点
        if (typeof name == "string") {
        
            //节点的名称
            this.name = name;
            
            this.elem = document.getElementById(name);
        }
        else {
            //传入得是一个节点或者节点数组
			//不支持传入string的数组
            this.elem = name;
            //alert(this.elem.getAttribute("id"));
        }
        
        //一个新的节点
        //初始化为当前的节点
        //便于节点移动后，可以复位,siblings()就是一个例子
        this.node = this.elem;
    };
    
    
    
    //===========================================================================================================
    //BJ.fn的扩展函数
    //@all 表示是否扩展全局函数插件或者节点扩展函数,为true表示扩展全局函数，默认是对节点添加扩展函数
    BJ.extend = function(name, func, all){
        var all = all || false; //默认是对节点添加扩展函数
        if (all) {
            for (var i in BJ) {
                if (name == i) {
                    alert("扩展中的函数名已经存在，请修改!");
                    return false;
                }
            }
            BJ[name] = func;
        }
        else {
            for (var i in BJ.fn.prototype) {
                if (name == i) {
                    alert("扩展中的函数名已经存在，请修改!");
                    return false;
                }
            }
            BJ.fn.prototype[name] = func;
        }
    };
    
    //BJ扩展的addClass与removeClass函数
    BJ.extend("addClass", function(c){
        BJ(this.elem).each(function(){
            var oldClass = this.className.toString().split(" ");
            for (var i = 0; i < oldClass.length; i++) {
                if (oldClass[i] == c) { //如果新加的class是以前有的，那么就不加上去了
                    return;
                }
            }
            var newClass = oldClass == "" ? c : oldClass.join(" ") + " " + c;
            this.className = newClass;
        });
		
		return BJ(this.elem);
    });
    
    BJ.extend("removeClass", function(c){
        if (c === undefined) {
            BJ(this.elem).each(function(){
                this.className = "";
            });
        }
        else {
            BJ(this.elem).each(function(){
                var oldClass = this.className.toString().split(" ");
                for (var i = 0; i < oldClass.length; i++) {
                    if (oldClass[i] == c) {
                        oldClass.splice(i, 1);
                    }
                }
                this.className = oldClass.join(" ");
            })
        }
		
		return BJ(this.elem);
    });
    
    //鼠标放在上面持续time时间，才会触发callback函数
    //那个点只自带了onmouseover和onmouseout函数
    BJ.extend("hold_on", function(time, callback){
        this.elem.onmouseover = function(){
            this.time = [];
            BJ(this).each(function(i){
                var self = this;
                
                self.time[i] = setTimeout(function(){
                    callback(self);
                }, time);
            });
        };
        
        this.elem.onmouseout = function(){
            BJ(this.time).each(function(){
                clearTimeout(this);
            });
        };
    });
    
    //===========================================================================================================
     
    //重置css，但是保留原来的css
    BJ.fn.prototype.resetCSS = function(prop){
        var old = {};
        
        for (var i in prop) {
            //记录旧的
            old[i] = BJ(this.elem).css(i);
            //设置新的
            this.elem.style[i] = prop[i];
        }
        //返回旧的的
        return old;
    };
    
    //prop 写的是css里面的属性 有“-”的后面的一个字母变为大写
    //margin-left (改为--->) marginLeft(prop写的形式)
	//获取到得值保留了后面的单位
    BJ.fn.prototype.css = function(prop){
        //获取css样式
        /*
         * BJ("divId").css("paddingLeft");
         * BJ(divDom).css("padddingLeft");
         */
        if (typeof prop === "string") {
            var obj = this.elem;
            
            if (obj.style[prop]) 
                return obj.style[prop];
            else 
                if (obj.currentStyle) { //判断IE
                    return obj.currentStyle[prop];
                }
                else 
                    if (document.defaultView && document.defaultView.getComputedStyle) { //判断FF
                        if (prop == 'opacity') { //透明度方面IE与其他的浏览器不同
                            var opacity = obj.filters('alpha').opacity;
                            return isNaN(opacity) ? 1 : (opacity ? opacity / 100 : 0); //number
                        }
                        
                        propprop = prop.replace(/([A-Z])/g, "-$1");
                        propprop = prop.toLowerCase();
                        
                        return document.defaultView.getComputedStyle(obj, null)[prop];
                    }
                    else {
                        return null;
                    }
        }//if
        //设置css样式
        //也可以和resetCSS结合使用，用来恢复它们的原有属性
        /*BJ("divId").css({
         	"marginLeft":"10px",	//骆驼形式
         	"top":"20px"
         });
         */
        else {
            BJ(this.elem).each(function(){		
                for (var i in prop) {
                    if (i == "opacity") 
                        this.style.filter = "alpha(opacity=" + prop[i] * 100 + ")";
                    this.style[i] = prop[i];
                }
            });
        }//else
    };
    
    //传入的是节点数组
    BJ.fn.prototype.each = function(callback){
        return BJ.each(this.elem, callback);
    };
    
    //得到元素真正的宽度与高度 [ 即使元素是隐藏的，也可以得到 ]
    //去除padding和border
    BJ.fn.prototype.getHW = function(){
        var self = this, fourWay = ["Left", "Right", "Top", "Bottom"], opadding = [], oborder = [];
        
        if (BJ(this.elem).css("display") != 'none') {
        
            for (var i = 0; i < fourWay.length; i++) {
                (function(pos){
                    opadding[pos] = parseInt(BJ(self.elem).css("padding" + fourWay[pos])) || 0;
                    
                    oborder[pos] = parseInt(BJ(self.elem).css("border" + fourWay[pos] + "Width")) || 0;
                })(i);
            }//for
            return {
                width: BJ(self.elem).getFullHeigt_FullWidth().fullWidth - opadding[0] - opadding[1] - oborder[0] - oborder[1],
                height: BJ(self.elem).getFullHeigt_FullWidth().fullHeight - opadding[2] - opadding[3] - oborder[2] - oborder[3]
            }
        }
        
        var old = BJ(self.elem).resetCSS({
            display: '',
            visibility: 'hidden'
        });
        
        for (var i = 0; i < fourWay.length; i++) {
            (function(pos){
                opadding[pos] = parseInt(BJ(self.elem).css("padding" + fourWay[pos])) || 0;
                
                oborder[pos] = parseInt(BJ(self.elem).css("border" + fourWay[pos] + "Width")) || 0;
            })(i);
        }
        
        var hw = {
            width: BJ(self.elem).getFullHeigt_FullWidth().fullWidth - opadding[0] - opadding[1] - oborder[0] - oborder[1],
            height: BJ(self.elem).getFullHeigt_FullWidth().fullHeight - opadding[2] - opadding[3] - oborder[2] - oborder[3]
        };
        
        BJ(self.elem).css(old);
        return hw;
    };
    
    //查找元素完整的高度，而且隐藏元素也可以得到
    //包括了边框和内边距
    BJ.fn.prototype.getFullHeigt_FullWidth = function(){
        if (BJ(this.elem).css("display") != 'none') {
            return {
                fullHeight: this.elem.offsetHeight || parseInt(BJ(this.elem).css("height")),
                fullWidth: this.elem.offsetWidth || parseInt(BJ(this.elem).css("width"))
            }
        }
        
        var old = BJ(this.elem).resetCSS({
            display: '',
            visibility: 'hidden'
        });
        
        var hw = {
            fullHeight: this.elem.offsetHeight || parseInt(BJ(this.elem).css("height")),
            fullWidth: this.elem.offsetWidth || parseInt(BJ(this.elem).css("width"))
        };
        
        BJ(this.elem).css(old);
        return hw;
    };
    
    //设置元素的透明度
    //@level 从0-100
    BJ.fn.prototype.setOpacity = function(level){
        BJ(this.elem).each(function(){
            if (this.filters) 
                this.style.filter = 'alpha(opacity=' + level + ')';
            else 
                this.style.opacity = level / 100;
        });
    };
    
	
	// 说明：用 Javascript 获取指定页面元素的位置
	// 来源：YUI DOM 
	BJ.fn.prototype.getElementPos = function(){
		var el = this.elem;
        var ua = navigator.userAgent.toLowerCase();     
        var isOpera = (ua.indexOf('opera') != -1);       
        var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
        
        if (el.parentNode === null || el.style.display == 'none') {
            return false;  
        }
        var parent = null;
        var pos = [];
        var box;
        if (el.getBoundingClientRect) //IE
        {       
            box = el.getBoundingClientRect();           
            var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);          
            var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            return {
                x: box.left + scrollLeft,
                y: box.top + scrollTop
            };
            
        }
        
        else 
            if (document.getBoxObjectFor) // gecko
            {
            
                box = document.getBoxObjectFor(el);
                var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;              
                var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
                pos = [box.x - borderLeft, box.y - borderTop];
                
            }
            
            else // safari & opera
            {
                pos = [el.offsetLeft, el.offsetTop];
                parent = el.offsetParent;
                
                if (parent != el) {
                
                    while (parent) {
                    
                        pos[0] += parent.offsetLeft;
                        
                        pos[1] += parent.offsetTop;
                        
                        parent = parent.offsetParent;
                        
                    }
                    
                }
                
                if (ua.indexOf('opera') != -1 ||
                (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {
                
                    pos[0] -= document.body.offsetLeft;
                    
                    pos[1] -= document.body.offsetTop;
                    
                }
                
            }
        if (el.parentNode) {
            parent = el.parentNode;
        }
        
        else {
            parent = null;
        }

        while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
            pos[0] -= parent.scrollLeft;
            pos[1] -= parent.scrollTop;
            if (parent.parentNode) {
                parent = parent.parentNode;
            } 
            else {
                parent = null;
            }
        } 
        return {
            x: pos[0],
            y: pos[1]
        };
	};
	
	
    /* --------------------------------------------------------------------------------------------
     * 基本动画
     ----------------------------------------------------------------------------------------------*/
    //隐藏它
    //@speed 隐藏它变成动态的
    //@speed 如果需要调用callback，则是hide(0,function(){}) 或者 hide("slow",function(){})
    BJ.fn.prototype.hide = function(speed, callback){
        if (speed) {
            var n_speed;
            if (typeof speed === "string") {
                if (speed == "fast") 
                    n_speed = 1;
                if (speed == "normal") 
                    n_speed = 3;
                if (speed == "slow") 
                    n_speed = 5;
            }
            var tSpeed = n_speed < 100 ? n_speed : 3;
            
            BJ(this.elem).each(function(){
                var self = this;
                if (BJ(this).css("display") == 'none') 
                    return; //如果本身就是隐藏的，就不执行
                var h = BJ(self).getHW().height, w = BJ(self).getHW().width, padding_top = parseInt(BJ(self).css("paddingTop")) || 0, padding_bottom = parseInt(BJ(self).css("paddingBottom")) || 0, border_top = parseInt(BJ(self).css("borderTopWidth")) || 0, border_bottom = parseInt(BJ(self).css("borderBottomWidth")) || 0, padding_left = parseInt(BJ(self).css("paddingleft")) || 0, padding_right = parseInt(BJ(self).css("paddingRight")) || 0, border_left = parseInt(BJ(self).css("borderLeftWidth")) || 0, border_right = parseInt(BJ(self).css("borderRightWidth")) || 0;
                var oldCSSTest = self.style.cssText; //以前的内联样式
                self.style.overflow = "hidden";
                
                for (var i = 100; i >= 0; i -= 1) {
                    (function(pos){
                        setTimeout(function(){
                            self.style.height = (pos / 100) * h + "px";
                            self.style.width = (pos / 100) * w + "px";
                            self.style.paddingTop = (pos / 100) * padding_top + "px";
                            self.style.paddingBottom = (pos / 100) * padding_bottom + "px";
                            self.style.borderTopWidth = (pos / 100) * border_top + "px";
                            self.style.borderBottomWidth = (pos / 100) * border_bottom + "px";
                            
                            self.style.paddingLeft = (pos / 100) * padding_left + "px";
                            self.style.paddingRight = (pos / 100) * padding_right + "px";
                            self.style.borderLeftWidth = (pos / 100) * border_left + "px";
                            self.style.borderRightWidth = (pos / 100) * border_right + "px";
                            
                            if (pos == 0) {
                                self.style.cssText = "";
                                self.style.cssText = oldCSSTest;
                                self.curDisplay = BJ(self).css("display"); //找到元素display的当前状态
                                if (self.curDisplay != 'none') 
                                    self.$oldDisplay = self.curDisplay;
                                self.style.display = "none";
                                if (callback) 
                                    callback(self);
                            }
                        }, (-pos + 101) * (tSpeed + 1));
                    })(i);
                }//for
            });
        }
        //没有动画效果
        else {
            BJ(this.elem).each(function(){
                this.curDisplay = BJ(this).css("display"); //找到元素display的当前状态
                if (this.curDisplay != 'none') 
                    this.$oldDisplay = this.curDisplay;
                this.style.display = "none";
                if (callback) {
                    callback(this);
                }
            });
        }
		
		return BJ(this.elem);
    };
    
    //显示它
    BJ.fn.prototype.show = function(speed, callback){
        if (speed) {
            var n_speed;
            if (typeof speed === "string") {
                if (speed == "fast") 
                    n_speed = 1;
                if (speed == "normal") 
                    n_speed = 3;
                if (speed == "slow") 
                    n_speed = 5;
            }
            var tSpeed = n_speed < 100 ? n_speed : 3;
            
            BJ(this.elem).each(function(){
                var self = this;
                if (BJ(self).css("display") == 'block') 
                    return; //如果本身就是显示的，就不执行
                var h = BJ(self).getHW().height, w = BJ(self).getHW().width, padding_top = parseInt(BJ(self).css("paddingTop")) || 0, padding_bottom = parseInt(BJ(self).css("paddingBottom")) || 0, padding_left = parseInt(BJ(self).css("paddingleft")) || 0, padding_right = parseInt(BJ(self).css("paddingRight")) || 0, border_top = parseInt(BJ(self).css("borderTopWidth")) || 0, border_bottom = parseInt(BJ(self).css("borderBottomWidth")) || 0, border_left = parseInt(BJ(self).css("borderLeftWidth")) || 0, border_right = parseInt(BJ(self).css("borderRightWidth")) || 0;
                var oldCSSTest = self.style.cssText; //以前的内联样式
                self.style.height = "0px";
                self.style.padding = "0px";
                self.style.borderWidth = "0px";
                self.style.overflow = "hidden";
                BJ(self).show();
                
                for (var i = 0; i <= 100; i += 1) {
                    (function(pos){
                        setTimeout(function(){
                            self.style.height = (pos / 100) * h + "px";
                            self.style.width = (pos / 100) * w + "px";
                            self.style.paddingTop = (pos / 100) * padding_top + "px";
                            self.style.paddingBottom = (pos / 100) * padding_bottom + "px";
                            self.style.borderTopWidth = (pos / 100) * border_top + "px";
                            self.style.borderBottomWidth = (pos / 100) * border_bottom + "px";
                            
                            self.style.paddingLeft = (pos / 100) * padding_left + "px";
                            self.style.paddingRight = (pos / 100) * padding_right + "px";
                            self.style.borderLeftWidth = (pos / 100) * border_left + "px";
                            self.style.borderRightWidth = (pos / 100) * border_right + "px";
                            
                            if (pos == 100) {
                                self.style.cssText = "";
                                self.style.cssText = oldCSSTest;
                                //设置为它的原始属性，如果没有，则为block
                                self.style.display = self.$oldDisplay || '';
                                if (callback) 
                                    callback(self);
                            }
                        }, (pos + 1) * (tSpeed + 1));
                    })(i);
                }//for
            });
        }
        else {
            BJ(this.elem).each(function(){
                //设置为它的原始属性，如果没有，则为block
                this.style.display = this.$oldDisplay || 'block';
                if (callback) {
                    callback(this);
                }
            });
        }
		
		return BJ(this.elem);
    };
    
    //sDowm
    //通过高度变化（向下增大）来动态地显示所有匹配的元素，在显示完成后可选地触发一个回调函数。
    //@speed {String:"fast","normal","slow"}	callback表示动作完后的回调函数 参数是节点本身
    BJ.fn.prototype.sDown = function(speed, callback){	
		if(speed===undefined){
			var tSpeed=3;
		}else{
            if (typeof speed === "string") {
                if (speed == "fast") 
                    speed = 1;
                if (speed == "normal") 
                    speed = 3;
                if (speed == "slow") 
                    speed = 5;
            }
            var tSpeed = speed < 100 ? speed : 3;
		}
        
        BJ(this.elem).each(function(){
            if (BJ(this).css("display") != "none") 
                return;
            
            var self = this, h = BJ(self).getHW().height, padding_top = parseInt(BJ(self).css("paddingTop")) || 0, padding_bottom = parseInt(BJ(self).css("paddingBottom")) || 0;
            border_top = parseInt(BJ(self).css("borderTopWidth")) || 0, border_bottom = parseInt(BJ(self).css("borderBottomWidth")) || 0;
            
            var oldCSSTest = self.style.cssText; //以前的内联样式
            self.style.height = '0px';
            self.style.paddingTop = "0px";
            self.style.paddingBottom = "0px";
            self.style.borderTopWidth = "0px";
            self.style.borderBottomWidth = "0px";
            self.style.overflow = "hidden";  
            BJ(self).show();
            
            for (var i = 0; i <= 100; i += 1) {
                (function(pos){
                    setTimeout(function(){
                        self.style.height = (pos / 100) * h + "px";
                        self.style.paddingTop = (pos / 100) * padding_top + "px";
                        self.style.paddingBottom = (pos / 100) * padding_bottom + "px";
                        self.style.borderTopWidth = (pos / 100) * border_top + "px";
                        self.style.borderBottomWidth = (pos / 100) * border_bottom + "px";
                        
                        if (pos == 100) {
                            self.style.cssText = "";
                            self.style.cssText = oldCSSTest;
                            BJ(self).show();
                            if (callback) 
                                callback(self);
                        }
                    }, (pos + 1) * (tSpeed + 1));
                })(i);
            }//for
        });
		
		return BJ(this.elem);
    };
    
    //sUp
    //通过高度变化（向上缩小）来动态地隐藏所有匹配的元素，在隐藏完成后可选地触发一个回调函数。
    BJ.fn.prototype.sUp = function(speed, callback){
        if(speed===undefined){
			var tSpeed=3;
		}else{
            if (typeof speed === "string") {
                if (speed == "fast") 
                    speed = 1;
                if (speed == "normal") 
                    speed = 3;
                if (speed == "slow") 
                    speed = 5;
            }
            var tSpeed = speed < 100 ? speed : 3;
		}
        
        BJ(this.elem).each(function(){
            if (BJ(this).css("display") == "none") return;
            
            var self = this, h = BJ(self).getHW().height, padding_top = parseInt(BJ(self).css("paddingTop")) || 0, padding_bottom = parseInt(BJ(self).css("paddingBottom")) || 0;
            border_top = parseInt(BJ(self).css("borderTopWidth")) || 0, border_bottom = parseInt(BJ(self).css("borderBottomWidth")) || 0;
            
            var oldCSSTest = self.style.cssText; //以前的内联样式
            self.style.overflow = "hidden";
            for (var i = 100; i >= 0; i -= 1) {
                (function(pos){
                    setTimeout(function(){
                        self.style.height = (pos / 100) * h + "px";
                        self.style.paddingTop = (pos / 100) * padding_top + "px";
                        self.style.paddingBottom = (pos / 100) * padding_bottom + "px";
                        self.style.borderTopWidth = (pos / 100) * border_top + "px";
                        self.style.borderBottomWidth = (pos / 100) * border_bottom + "px";
                        
                        if (pos == 0) {
                            self.style.cssText = "";
                            self.style.cssText = oldCSSTest;
                            BJ(self).hide();
                            if (callback) 
                                callback(self);
                        }
                    }, (-pos + 101) * (tSpeed + 1));
                })(i);
            }//for
        });
		
		return BJ(this.elem);
    };
    
    //淡淡消失 与 淡淡出现 公共的函数
    BJ.fn.prototype.fOutIn = function(speed){
        //基本属性问题
        //this.elem.style.zoom=1;		//IE用filter ，必须定义高度或者宽度，用zoom=1来解决这个问题
        var tspeed;
        //速度问题
        if (typeof speed == "string") {
            switch (speed) {
                case "fast":
                    tspeed = 20;
                    break;
                case "normal":
                    tspeed = 10;
                    break;
                case "slow":
                    tspeed = 5;
                    break;
            }
            return tspeed;
        }
        return speed == undefined ? 10 : speed < 100 ? speed : 5;
    };
    
    //淡淡的消失
    BJ.fn.prototype.fOut = function(speed, callback){
        var speed = this.fOutIn(speed);

        BJ(this.elem).each(function(){
            var self = this;
			
			if(BJ(self).css("display")=="none"){
				return;
			};
			var pos=100;
            var oldCSSText = self.style.cssText; //记录下以前的内联样式
            BJ(self).setOpacity(pos);
            self.style.zoom = 1; //for ie

			self.fOutTime=setInterval(function(){
				pos=pos-speed/5;
				if (pos <= 0) {
					clearInterval(self.fOutTime);
					
					self.style.cssText = "";
                    self.style.cssText = oldCSSText;
                    BJ(self).hide();
					if (callback) 
                        callback(self);
				}else {
					BJ(self).setOpacity(pos);
				}
			},1);
        });
		
		return BJ(this.elem);
    };
    
    //淡淡的出现
    BJ.fn.prototype.fIn = function(speed, callback){
        var speed = this.fOutIn(speed);
		
        BJ(this.elem).each(function(){
            var self = this;
			
			if(BJ(self).css("display")=="block"){
				return;
			};
			var pos=0;
            var oldCSSText = self.style.cssText; //记录下以前的内联样式 肯定是隐藏的
            BJ(self).setOpacity(pos);
            BJ(self).show();
            self.style.zoom = 1; //for ie
          
			self.fInTime=setInterval(function(){
				pos=pos+speed/5;
				if (pos>=100) {
					clearInterval(self.fInTime);
					
					self.style.cssText = "";
                    self.style.cssText = oldCSSText;
                    BJ(self).show();
					if (callback) 
                        callback(self);
				}else {
					BJ(self).setOpacity(pos);
				}
			},1);
        });
		
		return BJ(this.elem);
    };
    
    
    /* --------------------------------------------------------------------------------------------
     * 基本DOM操作
     ----------------------------------------------------------------------------------------------*/
	
	//为了支持函数之间的 "." 操作符，所以需要一个get函数，来获取你不想用点运算符时，返回dom节点或者数组
	BJ.fn.prototype.get=function(){
		return this.elem;
	},
	
    //它的直接下面的孩子【不包括孙子 和 typeNode!=1 的节点】
    //返回BJ类型
    BJ.fn.prototype.children = function(){
        var children = [];
        for (var i = 0, l = this.node.childNodes.length; i < l; i++) {
            if (this.node.childNodes[i].nodeType != 1) 
                continue;
            children.push(this.node.childNodes[i]);
        }
		
        return children.length==0?null : BJ(children);
    };
    
    //它的 上num个 兄弟节点
    //如果上面没有兄弟，就返回为null
    BJ.fn.prototype.prev = function(num){
        var num = num || 1;
        
        while (num != 0) {
            do {
                this.node = this.node.previousSibling;
            }while (this.node && this.node.nodeType != 1);
            
            num--;
        }
        
        return this.node ? BJ(this.node) : null;
    };
    
    //它的 上面 得全部兄弟节点
    //如果上面一个兄弟都没有，就返回为null
    //否则返回的是一个节点的集合
    BJ.fn.prototype.prevAll = function(){
        var nodes = [];
        while (this.node != BJ(this.node.parentNode).first().get()) { //如果最后一个节点不是它的父亲的第一个孩子，就继续循环
            this.node = this.node.previousSibling;
            if (this.node && this.node.nodeType == 1) {
                nodes.push(this.node);
            }
        };//while
        
        return nodes.length==0 ? null : BJ(nodes);
    };
    
    //它的 下num个 兄弟节点
    //如果下面没有兄弟，就返回为null
    BJ.fn.prototype.next = function(num){
        var num = num || 1;
        
        while (num != 0) {
            do {
                this.node = this.node.nextSibling;
            }while (this.node && this.node.nodeType != 1);
            
            num--;
        }
        
        return this.node ? BJ(this.node) : null;
    };
    
    //它的 下面 得全部兄弟节点
    //如果下面一个兄弟都没有，就返回为null
    //否则返回的是一个节点的集合
    BJ.fn.prototype.nextAll = function(){
        var nodes = [];
        while (this.node != BJ(this.node.parentNode).last().get()) { //如果最后一个节点不是它的父亲的最后一个孩子，就继续循环
            this.node = this.node.nextSibling;
            if (this.node && this.node.nodeType == 1) {
                nodes.push(this.node);
            }
        };//while
        
        return nodes.length==0 ? null : BJ(nodes);
    };
    
    //它的 全部 兄弟节点
    //如果没有则返回null，有的话返回一个节点的集合
    //也就是nextAll与prevAll的集合
    BJ.fn.prototype.siblings = function(){
        var r1 = this.prevAll();
        this.node = this.elem; //复位节点，不然 ，下面的nextAll函数就不对了，因为this.node跑到上面去了
        var r2 = this.nextAll();
		
		if(r1!=null && r2!=null)
			return BJ(r1.get().concat(r2.get()));
		else if(r1==null && r2!=null)
			return r2;
		else if(r1!=null && r2==null)
			return r1;
		else (r1==null && r2==null)
			return null
    };
    
    //返回它的 父亲
    //num表示你想返回它的第几个父亲
    BJ.fn.prototype.parent = function(num){
        var num = num || 1;
        for (var i = 0; i < num; i++) {
            if (this.node != null) {
                this.node = this.node.parentNode;
            }
        }
        return this.node ? BJ(this.node) : null;
    };
    
    //它的第一个孩子节点
    //同样，没有的话就返回null
    BJ.fn.prototype.first = function(){
        this.node = this.node.firstChild;
        
		if(this.node==null)	return null;
		
		return this.node && this.node.nodeType != 1 ? this.next() : BJ(this.node);
    };
    
    //它的最后一个孩子
    BJ.fn.prototype.last = function(){
        this.node = this.node.lastChild;
		
		if(this.node==null)	return null;
		
        return this.node && this.node.nodeType != 1 ? this.prev() : BJ(this.node);
    };
    
    //获取节点里面的属性的值
    //设置节点里面的属性
    /*	
     * BJ("div").attr("class");						//等到div的class
     * BJ("div").attr("id","idName");				//设置div的id属性
     * var ps=BJ("div").children();
     * BJ(ps).attr("class","love");					//把div下面的p的class全部设置为love
     * BJ(ps).attr("class",["love","hate","like"]);	//把div下面的p的class相应的设置为"love","hate","like",一一对应
     */
    BJ.fn.prototype.attr = function(name, value){
        if (!name || name.constructor != String) 
            return '';
        
        var name = {
            'for': 'htmlFor',
            'class': 'className'
        }[name] || name;
        
        if (value !== undefined) {
            if (value.constructor == Array) {
                BJ(this.elem).each(function(i){
                    var self = this;
                    
                    self[name] = value[i];
                    if (self.setAttribute) {
                        self.setAttribute(name, value[i]);
                    }
                })
            }
            else {
                BJ(this.elem).each(function(){
                    var self = this;
                    
                    self[name] = value;
                    if (self.setAttribute) {
                        self.setAttribute(name, value);
                    }
                })
            }
			
			return BJ(this.elem);
        }
        else {
            return this.elem[name] || this.elem.getAttribute(name) || '';
        }
    };
    
    //===============================================================================================================
    //文档的处理
    //===============================================================================================================
    //把带html的string类型，转化为以string最外的节点为根节点
    //如果string的类型不是一个html的形式，那么就会出错
    BJ.fn.prototype.stringToElem = function(content){
		if (content.charAt(0) == "<" && content.indexOf(">") > -1) {
			try {
				var rootNodeName = content.substring(1, content.indexOf(">")).toLowerCase();
				var tempNode = document.createElement(rootNodeName);
				tempNode.innerHTML = content.substr(rootNodeName.length + 2, content.length - ((rootNodeName.length + 2) * 2 + 1));
				return tempNode;
			} 
			catch (e) {
				return document.createTextNode(content);
			}
		}
		else {
			return document.createTextNode(content);
		}
	};
    
    //===================================================
    //内部插入
    //===================================================
    //插入到节点里面内容的最后面
    BJ.fn.prototype.append = function(content){
		if(typeof content=="string"){
			this.elem.innerHTML += content;
		}else{
			this.elem.appendChild(content);
		}
		
		return BJ(this.elem);
    };
    
    //插入到节点里面内容的最前面
    /*
     * e.g.
     * 		BJ("text").prepend("<span>12345</span>");
     * 		or
     * 		BJ("text").prepend(document.createElement("span"));
     */
    BJ.fn.prototype.prepend = function(content){
        var fChild = this.elem.firstChild;
        if (content.nodeType == 1) {
            this.elem.insertBefore(content, fChild);
        }
        else {
            //取到content字符串的根节点的名称
            var tempNode = this.stringToElem(content);
            this.elem.insertBefore(tempNode, fChild);
        }
		
		return BJ(this.elem);
    };
    
    //===================================================
    //外部插入
    //===================================================
    
    //插入到某个节点的下面
    BJ.fn.prototype.after = function(content){
        var parent = this.elem.parentNode;
        var tNode = null;
        content.nodeType == 1 ? tNode = content : tNode = this.stringToElem(content);
        
        if (parent.firstChild == this.elem) {
            parent.appendChild(tNode);
        }
        else {
            parent.insertBefore(tNode, this.elem.nextSibling);
        }
		
		return BJ(this.elem);
    };
    
    //插入到某个节点的上面
    BJ.fn.prototype.before = function(content){
        var parent = this.elem.parentNode;
        var tNode = null;
        typeof content == "string" ? tNode = this.stringToElem(content) : tNode = content;
		
		//alert(tNode.nodeType);
		
        parent.insertBefore(tNode, this.elem);
		
		return BJ(this.elem);
    };
    
    //重写innerHTML
    BJ.fn.prototype.html = function(content){
        if (content === undefined) {
            return BJ.trim(this.elem.innerHTML.toString());
        }
        else {
            this.elem.innerHTML = content.toString();
			return BJ(this.elem);
        }
    };
    
	//获取节点下面的全部内容（不包含标签）
	//仅仅对单个节点进行操作
	//当然可以替代 ： firstChild.nodeValue 了
	//没有的话，就返回null
	//支持XML
	//text 和 forText是一起的
	//返回的是用join('')合并后的string，如果带有getArray参数，就返回数组，这样更加灵活
	
	//以前用innerText 和 textContent 虽然简单，但不支持XML，可惜，而且不支持得到的数据转换为数组，所以text()重写。
	BJ.fn.prototype.text=function(obj){
		var s=[];
		if (obj === undefined) {
			var temp=this.forText(s, this.elem).join('');
			return temp=='' ? null : temp;
		}
		else if (obj.getArray == true) {
			var temp=this.forText(s, this.elem);
			return temp.length==0 ? null : temp;
		}
	};
	
	BJ.fn.prototype.forText=function(s,node){
        var node_san = node.childNodes;
        
        for (var i = 0,len=node_san.length; i < len; i++) {
            if (node_san[i].nodeType ==1) {
				this.forText(s, node_san[i]);	//递归
            }
            else if(node_san[i].nodeType ==3){
				 if (BJ.trim(node_san[i].nodeValue)== "")	//如果取到的值为空，那么就不取出来
                    continue;
                s.push(BJ.trim(node_san[i].nodeValue));
            }else{
				 continue;
			}
        }
        return s;
	},
    
    //清空节点里面所有东西
	//并返回那个节点
    BJ.fn.prototype.empty = function(){
        while (this.elem.firstChild) {
            this.elem.removeChild(this.elem.firstChild);
        };
		
        return BJ(this.elem);
    };
    
    //删除这个节点
    BJ.fn.prototype.remove = function(){
		if(this.elem!=null) this.elem.parentNode.removeChild(this.elem);
    };
    
})();//end Bj