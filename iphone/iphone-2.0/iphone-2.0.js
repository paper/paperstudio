/*
 * @author paper
 */

var Iphone={
	version:'2.0',
	
	isIEBool:BJ.isIE(),
	
	//如果回到首页，不进行操作的话，就自动锁定页面
	lockIphoneTimeout:null,
	
	//自动锁定页面的时间
	//默认8秒
	lockKeyTime:8000,
	
	jsonData:'iphone-2.0.json',
	
	moveWith:310,
	
	init:function(){
		//获取当前时间
		Iphone.getTimeNow();
		
		//Iphone.localStorage.remove();
		
		//读取背景图片
		try{
			Iphone.localStorage.get('iphoneBg')?
				BJ('#iphoneWindow').className=Iphone.localStorage.get('iphoneBg'):
				BJ('#iphoneWindow').className='iphoneBg4';
		}catch(e){
			//alert(e);
		}
		
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
		
		//绑定back事件
		BJ('iphoneTitleBack').bind('click',function(){
			var childrenLength=BJ('iphoneMainIn').children().getElem().length;
			
			Iphone.moving('left',function(){
				var curLeft=parseInt(BJ('iphoneMainIn').css('marginLeft'));

				if(curLeft==0){
					//回到了主页，开启锁定
					Iphone.lockIphoneStart();
					
					Iphone.toggleBackBt('hide');
				}
				
				if(childrenLength>1){
					Iphone.toggleNextBt('show');
				}
			});
		});
		
		//绑定next事件
		BJ('iphoneTitleNext').bind('click',function(){
			var w=Iphone.moveWith,
				childrenLength=BJ('iphoneMainIn').children().getElem().length;
			
			//不是主页，解除锁定
			Iphone.lockIphoneStop();
			
			Iphone.moving('right',function(){
				var curLeft=BJ('#iphoneMainIn').style.marginLeft,
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
			}
		});
		
		//一开始(刷新的时候)是锁定状态的
		Iphone.lockIphoneState=true;
		
		BJ('iphoneHome').bind('click',function(){
			//当是锁定状态的时候，是不能点击HOME的
			if(!Iphone.lockIphoneState){
				
				//不能重复点击HOME
				if(!Iphone.iphoneHomeLock){
					//锁定
					Iphone.iphoneHomeLock=true;
					
					Iphone.menu(function(){
						//解锁
						Iphone.iphoneHomeLock=false;
					});
				}
			}
		});
		
		//功能按钮事件绑定
		Iphone.menuAction();
	},
	
	isIE:function(){
		var html='<div class="pd15 f16 tsup fb">非常抱歉<br />这次我将不支持IE</div>';
		Iphone.iphoneAlertWindow(html,function(){
			//do nothing..
		});
	},
	
	notIE:function(){
		//谢谢支持，只做一次
		if(!Iphone.notIEOnce){
			Iphone.notIEOnce=true;
			
			var html = '<div class="pd15 f16 tsup fb">非常感谢您的支持<br />点击 OK 继续</div>';
			Iphone.iphoneAlertWindow(html, function(){
				Iphone.iphoneAlertWindowOkCallback = function(){
					Iphone.menu();
				};
				
				Iphone.iphoneAlertWindowCancelCallback = function(){
					BJ('iphoneSlide').show();
				};
			});
		}else{
			Iphone.menu();
		}
	},
	
	//菜单的功能(ajax请求)
	menuAction:function(){
		BJ('iphoneMainA').find('li').bind('click',function(){
			//关闭自动锁定
			Iphone.lockIphoneStop();
		
			var that=this,
				rel=that.getAttribute('rel'),
				oh3=BJ(that).find('h3'),
				hd=that.innerHTML,
				children=BJ('iphoneMainIn').children().getElem(),
				childrenLength=children.length;

			BJ.ajax({
				url:Iphone.jsonData,
				before:function(){
					Iphone.showLightbox();
					oh3.addClass('loading');
				},
				success:function(msg){
					if(!msg) return;
					
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
								'</div>';
					}
					
					setTimeout(function(){
						if(ht){								
							//先移除后面的兄弟
							Iphone.removeNextsiblings('iphoneMainA');
							
							Iphone.iphoneInnerHTML(ht,function(f){
								BJ('iphoneMainIn').append(f);
							},function(){
								if(js)Iphone.createJS(js);
								
								Iphone.hideLightbox();
								oh3.removeClass('loading');
					
								Iphone.moving('right');
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
	
	/*========================================================================================================================
	 * 基本函数
	 * 不要经常改动
	 ==========================================================================================================================*/
		
	/*========================================
	 * 页面锁定
	========================================= */
	playSound:function(id){
		var pid=document.getElementById(id);
		//if(!BJ.isFirefox())
		//	pid.load();
		//pid.play();
		
		pid.pause();
		pid.currentTime = 0;
		pid.play();
	},
	
	lockIphoneStart:function(){
		if (!Iphone.lockIphoneState) {
			Iphone.lockIphoneTimeout = setTimeout(function(){
				BJ('iphoneWindow').children().hide();
				
				BJ('iphone3GLock').fIn('fast');
				BJ('iphoneTitleLock').fIn('fast');
				BJ('iphoneSlide').fIn('fast');
				
				//播放声音
				Iphone.playSound('iphoneSound_lock');
				//BJ('#iphoneSound_lock').play();
				
				Iphone.showLightbox();
				Iphone.lockIphoneState=true;
			}, Iphone.lockKeyTime);
		}
	},
	
	lockIphoneStop:function(){
		clearTimeout(Iphone.lockIphoneTimeout);
		
		//不是锁定状态
		Iphone.lockIphoneState=false;
		
		//HOME可以点击
		Iphone.iphoneHomeLock=false;
	},
		
	//回到初始菜单
	menu:function(callback){
		//关闭锁定iphone事件
		Iphone.lockIphoneStop();
		
		BJ('iphoneWindow').children().hide();
		
		BJ('iphone3G').show();
		BJ('iphoneTitle').show();
		
		//隐藏next与next
		Iphone.toggleBackBt('hide');
		Iphone.toggleNextBt('hide');

		BJ('#iphoneMainIn').style.marginLeft=0;
		BJ('iphoneMain').fIn('fast',function(){
			//不是锁定状态
			Iphone.lockIphoneState=false;
			
			//触发锁定iphone事件
			Iphone.lockIphoneStart();
			
			if(callback) callback();
		});
	},

	getTimeNow:function(){
		var gt=function(){
			var data=new Date(),
				h=data.getHours(),
				m=data.getMinutes(),
				
				Y=data.getFullYear(),
				M=data.getMonth(),
				D=data.getDate(),
				w=data.getDay(),
				
				week=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
				month=['January','February','March','April','May','June','July','august','September','October','November','December'];
			
			h=h>9?h:'0'+h;
			m=m>9?m:'0'+m;
			
			BJ('#iphoneTime').innerHTML=h+':'+m;
			BJ('#iphoneTitleLockTime1').innerHTML=h+':'+m;
			
			BJ('#iphoneTitleLockTime2').innerHTML=week[w]+' , '+month[M]+' '+D;
		};
		
		//先计算一次
		gt();
		
		Iphone.timeNow=setInterval(function(){
			gt();
		},1000);
	},
	
	/*============================================
	 * 滑动解锁
	 =============================================*/
	slideToUnlock:function(callback){
		var min=24,
			max=227;
		
		BJ.drag({
			node:'iphoneSlideBt',
			onlyX:true,
			mousemove:function(){
				var that=this,
					curLeft=parseInt(BJ(this).css('left'));
				
				if(curLeft<=min){
					that.style.left=min+'px';
				}else if(curLeft>=max){
					that.style.left=max+'px';
					
					//这里只能做一次，因为mousemove，可能触发多次的大于max的curLeft
					if(!Iphone.slideToUnlockCallbackDoOnce){
						Iphone.slideToUnlockCallbackDoOnce=true;
						
						setTimeout(function(){
							BJ('iphoneSlide').fOut('fast');
							Iphone.slideToUnlockCallbackDoOnce=false;
							if(callback) callback();
						},500);
					}
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
	
	
	showLightbox:function(obj){
		if(obj==undefined){
			BJ('iphoneLightbox').setOpacity(0);
			BJ('iphoneLightbox').show();
			return;
		}
		
		if(obj.opacity!==undefined)
			BJ('iphoneLightbox').setOpacity(opacity);
		
		obj.s==undefined?
			BJ('iphoneLightbox').show():
			BJ('iphoneLightbox').fIn(s);
	},
	
	hideLightbox:function(obj){
		if(obj==undefined){
			BJ('iphoneLightbox').hide();
			return;
		}
		
		if(obj.opacity!==undefined)
			BJ('iphoneLightbox').setOpacity(opacity);
		
		obj.s==undefined?
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
	
	/*===============================================
	 * 通用弹出框
	 * @html 内容
	 * @callback 点击Ok的回调函数
	 ==============================================*/
	iphoneAlertWindow:function(html,callback){
		Iphone.playSound('iphoneSound_alert');
		//BJ('#iphoneSound_alert').play();
		
		//先清空
		BJ('#iphoneAlertWindowMain').innerHTML='';
		Iphone.showLightbox('fast',50);
		
		BJ('iphoneAlertWindow').fIn('fast');
		
		Iphone.iphoneInnerHTML(html,function(f){
			BJ('iphoneAlertWindowMain').append(f);
		},
		function(){
			if(callback) callback();
		});
	},
	
	//interface
	iphoneAlertWindowOkCallback:function(){},
	
	//interface
	iphoneAlertWindowCancelCallback:function(){},
	
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
		
		Iphone.playSound('iphoneSound_moving');
		//BJ('#iphoneSound_moving').play();
		
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
				}
				
				//next是否出现
				var curLeft=parseInt(BJ('iphoneMainIn').css('marginLeft')),
					len=-curLeft/w;	
				if(len==childrenLength-1){
					Iphone.toggleNextBt('hide');
				}
				
				Iphone.hideLightbox();
				
				if(callback) callback();
			}
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
		return { 
			set: function(key, value){
				localStorage[key]=value;
			},
			get: function(key){
				return localStorage[key];
			},
			remove: function(key){
				key==undefined?
					localStorage.clear():
					delete localStorage[key];
			}
		};
	}()) 
};

//初始化
Iphone.init();