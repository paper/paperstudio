/*
 * @author paper
 */

var Iphone={
	version:'1.0',
	
	isIEBool:BJ.isIE(),
	
	moveWith:310,
	
	init:function(){
		//获取当前时间
		Iphone.getTimeNow();
		
		//弹出窗口的Cancel事件绑定
		BJ('iphoneAlertWindowCancel').bind('click',function(){
			BJ('iphoneAlertWindow').fOut('fast');
			Iphone.iphoneAlertWindowCancelCallback();
		});
		
		//弹出窗口的OK事件绑定
		BJ('iphoneAlertWindowOk').bind('click',function(){
			BJ('iphoneAlertWindow').fOut('fast');
			Iphone.iphoneAlertWindowOkCallback();
		});
		
		//绑定back与next事件
		BJ('iphoneTitleBack').bind('click',function(){
			var childrenLength=BJ('iphoneMainIn').children().getElem().length;
			
			Iphone.moving('left',function(){
				var curLeft=parseInt(BJ('iphoneMainIn').css('marginLeft'));

				if(curLeft==0){
					Iphone.toggleBackBt('hide');
					//BJ('#iphoneTitleBack').style.visibility='hidden';
				}
				
				if(childrenLength>1){
					Iphone.toggleNextBt('show');
					//BJ('#iphoneTitleNext').style.visibility='visible';
				}
			});
			
			
		});
		BJ('iphoneTitleNext').bind('click',function(){
			var w=Iphone.moveWith,
				childrenLength=BJ('iphoneMainIn').children().getElem().length;
			
			Iphone.moving('right',function(){
				var curLeft=parseInt(BJ('iphoneMainIn').css('marginLeft')),
					len=-curLeft/w;
				
				if(len==childrenLength-1){
					Iphone.toggleNextBt('hide');
				}
			});
		});
		
		//滑动解锁事件绑定
		Iphone.slideToUnlock(function(){
			if(Iphone.isIEBool){
				Iphone.isIE();
			}else{
				Iphone.notIE();
				
				//HOME事件绑定
				Iphone.reset();
			}
		});
		
		
		//功能按钮事件绑定
		Iphone.menuAction();
	},
	
	//弹出框
	//@html 内容
	//@callback 点击Ok的回调函数
	iphoneAlertWindow:function(html,callback){
		//先清空
		BJ('#iphoneAlertWindowMain').innerHTML='';
		//显示阴影
		//BJ('iphoneLightbox').show();
		Iphone.showLightbox();
		
		Iphone.iphoneInnerHTML(html,function(f){
			BJ('iphoneAlertWindowMain').append(f);
		},
		function(){
			callback();
		});
		
		BJ('iphoneAlertWindow').fIn('fast');
	},
	
	//interface
	iphoneAlertWindowOkCallback:function(){},
	
	//interface
	iphoneAlertWindowCancelCallback:function(){},
	
	//reset 回到初始菜单
	reset:function(){
		BJ('iphoneHome').bind('click',function(){
			BJ('iphoneMainIn').fOut('fast',function(){
				BJ('iphoneMainIn').css({
					marginLeft:0
				});
				
				//隐藏next与next
				Iphone.toggleBackBt('hide');
				Iphone.toggleNextBt('hide');
				//BJ('#iphoneTitleBack').style.visibility='hidden';
				//BJ('#iphoneTitleNext').style.visibility='hidden';
					
				BJ(this).fIn('fast');
			});
		});
	},
	
	isIE:function(){
		var html='<div class="pd15 f16 tsup fb">非常抱歉<br />这次我将不支持IE</div>';
		Iphone.iphoneAlertWindow(html,function(){
			//do nothing..
		});
	},
	
	notIE:function(){
		var html='<div class="pd15 f16 tsup fb">非常感谢您的支持<br />点击 OK 继续</div>';
		Iphone.iphoneAlertWindow(html,function(){
			Iphone.iphoneAlertWindowOkCallback=function(){
				//显示内容
				BJ('iphoneMainIn').fIn('fast');
				
				//去掉lightbox
				//BJ('iphoneLightbox').fOut('fast');
				Iphone.hideLightbox('fast');
			};
			
			Iphone.iphoneAlertWindowCancelCallback=function(){
				BJ('iphoneSlide').show();
			};
		});
	},
	
	getTimeNow:function(){
		Iphone.timeNow=setInterval(function(){
			var data=new Date(),
				h=data.getHours(),
				m=data.getMinutes();
			
			h=h>9?h:'0'+h;
			m=m>9?m:'0'+m;
			
			BJ('#iphoneTime').innerHTML=h+':'+m;
		},1000);
	},
	
	//滑动解锁
	slideToUnlock:function(callback){
		var min=24,
			max=227;
		
		BJ.drag({
			node:'iphoneSlideBt',
			onlyX:true,
			mousemove:function(){
				var that=this;
					//curLeft=parseInt(BJ(this).css('left'));
				
				if(that.cLeft<=min){
					that.lock=true;
					that.style.left=min+'px';
				}else if(that.cLeft>=max){
					that.lock=true;
					that.style.left=max+'px';

					setTimeout(function(){
						Iphone.slideToUnlockSuccess(callback);
					},400);
				}else{
					that.lock=false;
				}
			},
			mouseup:function(){
				var that=this,
					curLeft=parseInt(BJ(this).css('left'));
				
				Iphone.animate({
				    'elem': that, 
				    'begin': curLeft,
				    'end': min, 
				    'callback': function(begin){ 
				        this.style.left = begin + 'px';
				    }
				});
			}
		});
	},
	
	slideToUnlockSuccess:function(callback){
		BJ('iphoneSlide').fOut('fast');
		BJ('#iphoneTitleH1').innerHTML='Welcome';
		
		callback();
	},
	
	//基本动画函数
	animate:function(obj){
		 var elem = obj.elem, //元素
	        //obj.begin,				//起始位置
	        //obj.end,					//结束位置
	        callback = obj.callback, //调用的函数
			timeStep = obj.step || 10; //时间频率
			endCallback=obj.endCallback;	//动作结束后的回调函数
			
	        (function(){
	            if (obj.begin == obj.end){
					if(endCallback) endCallback.call(elem,obj.begin);
					return;
				} 
	                
	            var step;
	            if (obj.begin < obj.end) {
	                step = Math.ceil((obj.end - obj.begin) / 10);
	                obj.begin += step;
	            }
	            else {
	                step = Math.ceil((obj.begin - obj.end) / 10);
	                obj.begin -= step;
	            }
	            callback.call(elem, obj.begin);
	            
	            setTimeout(arguments.callee, timeStep);
	        })();
	},
	
	showLightbox:function(s){
		s==undefined?
			BJ('iphoneLightbox').show():
			BJ('iphoneLightbox').fIn(s);
	},
	
	hideLightbox:function(s){
		s==undefined?
			BJ('iphoneLightbox').hide():
			BJ('iphoneLightbox').fOut(s);
	},
	
	toggleBackBt:function(s){
		var ss={
			'show':'visible',
			'hide':'hidden'	
		}[s];
		
		BJ('#iphoneTitleBack').style.visibility=ss;
	},
	
	toggleNextBt:function(s){
		var ss={
			'show':'visible',
			'hide':'hidden'	
		}[s];
		
		BJ('#iphoneTitleNext').style.visibility=ss;
	},
	
	//点击功能后，向右滑动，或者向左
	//也判断什么时候出现back或者next
	moving:function(s,callback){
		Iphone.showLightbox();
		
		var w=Iphone.moveWith,
			step={
			'left':w,
			'right':-w
		}[s],
		
		curLeft=parseInt(BJ('iphoneMainIn').css('marginLeft')),
		childrenLength=BJ('iphoneMainIn').children().getElem().length;
		
		Iphone.animate({
		    'elem': BJ('#iphoneMainIn'), 
		    'begin': curLeft,
		    'end': curLeft+step, 
		    'callback': function(begin){ 
		        this.style.marginLeft = begin + 'px';
		    },
			'endCallback':function(){
				//back是否出现
				if(s=='right'){
					Iphone.toggleBackBt('show');
					//BJ('#iphoneTitleBack').style.visibility='visible';
				}
				
				//next是否出现
				var curLeft=parseInt(BJ('iphoneMainIn').css('marginLeft')),
					len=-curLeft/w;	
				if(len==childrenLength-1){
					Iphone.toggleNextBt('hide');
					//BJ('#iphoneTitleNext').style.visibility='hidden';
				}
				
				Iphone.hideLightbox();
				
				if(callback) callback();
			}
		});
	},
	
	//菜单的功能(ajax请求)
	menuAction:function(){
		BJ('iphoneMainA').find('li').bind('click',function(){
			var that=this,
				rel=that.getAttribute('rel'),
				oh3=BJ(that).find('h3'),
				hd=that.innerHTML,
				children=BJ('iphoneMainIn').children().getElem(),
				childrenLength=children.length;

			BJ.ajax({
				url:'iphone-1.0.json',
				before:function(){
					Iphone.showLightbox();
					oh3.addClass('loading');
				},
				success:function(msg){
					if(!msg) return;
					
					setTimeout(function(){
						Iphone.hideLightbox();
						oh3.removeClass('loading');
					
						var d=eval('('+msg+')');
						
						if(!d.iphone[rel]) return;
						
						var	className=d.iphone[rel].className,
							liClass=d.iphone[rel].contentLength==1?'one':'',
							exp=d.iphone[rel].exp,
							ht=d.iphone[rel].html,
							js=d.iphone[rel].js,
							s='';
						
						if(exp){
							for(var i=0;i<exp.length;i++){
								var temp=Iphone.getMenuActionJsonPara(exp[i][1]);
								
								if(temp){
									s+='<li><span class="name">'+exp[i][0]+'</span><span class="tsdown fb loading-icon" id="iphone_'+rel+'_'+temp+'"></span></li>';
								}else{
									s+='<li><span class="name">'+exp[i][0]+'</span>'+exp[i][1]+'</li>';				
								}	
							}
	
							ht='<div id="iphoneMain_'+rel+'" class="block">'+
										'<ul class="'+className+'">'+
											'<li class="'+liClass+'">'+
												hd+
												'<div class="clearfix pdt8">'+
													'<ul class="exp">'+
														s
													'</ul>'+
												'</div>'+
											'</li>'+
										'</ul>'+
									'</div>'
						}
						
						if(ht){								
							//首先移除后面的已经有的孩子
//							if(childrenLength>1){
//								for(var i=1;i<childrenLength;i++){
//									BJ(children[i]).remove();
//								}
//							}

							Iphone.removeNextsiblings('iphoneMainA');
							
							Iphone.iphoneInnerHTML(ht,function(f){
								BJ('iphoneMainIn').append(f);
							},function(){
								Iphone.moving('right',function(){
									if(js)Iphone.createJS(js);
								});
							});
						}
						
						
					},500);
				},
				error:function(){
					setTimeout(function(){
						Iphone.hideLightbox();
						oh3.removeClass('loading');
					},300);
				}
			});
		});
	},
	
	removeNextsiblings:function(elem){
		if(BJ(elem).nextAll())
			BJ(elem).nextAll().remove();
	},
	
	//动态创建JS
	createJS: function(src){
		var oHead = document.getElementsByTagName('head')[0],
			oScripts=oHead.getElementsByTagName('script'),
			oScript = document.createElement("script");
			//key=false;//false 为没有重复的脚本
		
		//首先判断这个脚本是否存在，如果存在就不创建
		for(var i=0,len=oScripts.length;i<len;i++){
			if(oScripts[i].getAttribute('src')===src){
				BJ(oScripts[i]).remove();
				break;
			}
		}
		
		oScript.type = "text/javascript";
		oScript.src = src;
		oHead.appendChild(oScript);
	},
	
	//获取里面的参数，是不是具有动态参数
	getMenuActionJsonPara:function(s){
		var reg=/^\@\w+\@$/;

		if(reg.test(s)){
			var r=s.match(/^\@(\w+)\@$/);
			return r[1];
		}else{
			return false;
		}
	},
	
	iphoneInnerHTML: function(HTML,doingCallback,endCallback){
		var temp = document.createElement('div'), 
			frag = document.createDocumentFragment();
		temp.innerHTML = HTML;
		(function(){
			if (temp.firstChild) {
				frag.appendChild(temp.firstChild);
				doingCallback(frag);
				setTimeout(arguments.callee, 0);	//递归
			}
			else {
				endCallback(frag);
			}
		})();
	},
	
	localStorage: (function(){
		var documentElement, isIE = !!document.all;
		
		if (isIE) {
			documentElement = document.documentElement;
			documentElement.addBehavior('#default#userdata');
			return {
				setItem: function(key, value){
					documentElement.setAttribute('value', value);
					documentElement.save(key);
				},
				getItem: function(key){
					documentElement.load(key);
					return documentElement.getAttribute('value');
				},
				removeItem: function(key){
					documentElement.removeAttribute('value');
					documentElement.save(key);
				}
			}
		}
		
		return { 
			setItem: function(key, value){
				localStorage[key]=value;
				/// <param name="key" type="String">Cache Key</param>
				/// <param name="value" type="Object"></param>
				//window.globalStorage[location.hostname][key] = value;
			},
			getItem: function(key){
				return localStorage[key];
				/// <param name="key" type="String">Cache Key</param>
				//return window.globalStorage[location.hostname][key];
			},
			removeItem: function(key){
				delete localStorage[key]
				/// <param name="key" type="String">Cache Key</param>
				//window.globalStorage[location.hostname].removeItem(key);
			}
		};
	}()) 
};

//初始化
Iphone.init();