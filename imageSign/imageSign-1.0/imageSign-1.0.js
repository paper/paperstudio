/*
 * @author paper
 */
var imageSign=(function(){
	var o = {}, odiv, key = false, clickOther = false, $imageWrap = BJ('imageWrap'), 
		curIndex=+BJ('#curZIndex').value,
		setStyle = function(elem, obj){
		for (var i in obj) {
			elem.style[i] = obj[i];
		}
	}, asynInnerHTML = function(HTML, doingCallback, endCallback){
		var temp = document.createElement('div'), frag = document.createDocumentFragment();
		temp.innerHTML = HTML;
		(function(){
			if (temp.firstChild) {
				frag.appendChild(temp.firstChild);
				doingCallback(frag);
				setTimeout(arguments.callee, 0);
			}
			else {
				if (endCallback) 
					endCallback(frag);
			}
		})();
	}, localStorageFn = (function(){
		if (BJ.isIE()) {
			documentElement = document.documentElement;
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
	})(),
	
	saveSign=function(){
		//保存起来
		var sa=BJ('#imageWrap').innerHTML.toString();
		localStorageFn.set('m',sa);
	};
	
	//localStorageFn.remove('m');
	
	//load
	try{
		if(localStorageFn.get('m')){
			BJ('#imageWrap').innerHTML=localStorageFn.get('m');
		}
	}catch(e){
		alert(e);
	}
	
	$imageWrap.bind({
		'mousedown':function(e){
			key=true;
			
			o.wrapLeft=$imageWrap.getElementPos().x;
			o.wrapTop=$imageWrap.getElementPos().y;

			while(BJ('#imageSignCreateTemp'))
				BJ('imageSignCreateTemp').remove();
			while(BJ('#imageSignCreateTemp_text'))
				BJ('imageSignCreateTemp_text').remove();
			
			var getMouse=BJ.getMouse(e);
			o.beginX=getMouse.x;
			o.beginY=getMouse.y;
			
			o.left=o.beginX-o.wrapLeft,
			o.top=o.beginY-o.wrapTop;
			
			odiv=document.createElement('div');
			odiv.setAttribute('id','imageSignCreateTemp');
			
			setStyle(odiv,{
				'left':o.left+'px',
				'top':o.top+'px',
				'border':'1px dashed #fff',
				'position':'absolute',
				'display':'block',
				'position':'absolute',
				'filter':'alpha(opacity=40)',
				'opacity':0.4,
				'background':'#000',
				'zIndex':++curIndex,
				'overflow':'hidden'
			});
			
			$imageWrap.append(odiv);
		},
		
		'mousemove':function(e){
			if(!key) return;
			
			var getMouse=BJ.getMouse(e);
				o.endX=getMouse.x,
				o.endY=getMouse.y;
		
			setStyle(odiv,{
				'width':Math.abs(o.endX-o.beginX)+'px',
				'height':Math.abs(o.endY-o.beginY)+'px'
			});
			
			if(o.endX<=o.beginX){
				if(o.endY<=o.beginY){
					setStyle(odiv,{
						'left':o.endX-o.wrapLeft+'px',
						'top':o.endY-o.wrapTop+'px'
					});
				}else{
					setStyle(odiv,{
						'left':o.endX-o.wrapLeft+'px',
						'top':o.top+'px'
					});
				}
			}else{
				if(o.endY<=o.beginY){
					setStyle(odiv,{
						'left':o.left+'px',
						'top':o.endY-o.wrapTop+'px'
					});
				}else{
					//do nothing...
				}
			}
		},
		
		'mouseup':function(e){
			key=false;
			
			if(!BJ('#imageSignCreateTemp'))return;
			if(parseInt(BJ('#imageSignCreateTemp').style.height)<30 || parseInt(BJ('#imageSignCreateTemp').style.width)<54){
				BJ('imageSignCreateTemp').remove();
				return;
			}
			
			//生成text
			var h=parseInt(BJ('#imageSignCreateTemp').style.height) || 0,
				t=parseInt(BJ('#imageSignCreateTemp').style.top)+h+5,
				l=parseInt(BJ('#imageSignCreateTemp').style.left),
				html='<div class="imageSignCreateTemp-text" id="imageSignCreateTemp_text" style="filter:alpha(opacity=60);opacity:0.6;background-color:#FFFFFF;border:1px solid #000000;height:60px;top:'+t+'px;left:'+l+'px;overflow:hidden;position:absolute;width:230px;z-index:99999;">'+
					'<div class="t">'+
						'<textarea id="imageSignCreateTemp_textarea"></textarea>'+
					'</div>'+
					'<div class="b">'+
						'<div class="word-limit"><span id="word_limit_num">1</span>/<span id="word_limit_max">30</span></div>'+
						'<div class="word-ok">'+
							'<a href="javascript:;" id="imageSignCreateTemp_ok">OK</a>'+
						'</div>'+
					'</div>'+
				'</div>';
			
			if(h==0) return;
			
			asynInnerHTML(html,function(g){
				$imageWrap.append(g);
			},function(g){
				BJ('imageSignCreateTemp_text').bind({
					'mousedown':function(e){
						BJ.stopBubble(e);
					},
					'mouseup':function(e){
						BJ.stopBubble(e);
					}
				});
				
				//限制字数
				var otextarea = BJ('#imageSignCreateTemp_textarea'), 
					maxlen = +BJ('#word_limit_max').innerHTML;
				otextarea.onkeyup = function(){
					var otextarea_value = otextarea.value;
					
					BJ('#word_limit_num').innerHTML = otextarea_value.length;
					if (otextarea_value.length > maxlen) {
						otextarea.value = otextarea_value.substring(0, maxlen);
					}
				};
				otextarea.focus();
				
				//点击OK保存
				BJ('#imageSignCreateTemp_ok').onclick = function(e){
					//留下区域框
					var imageSignCreateTempCopy = BJ('#imageSignCreateTemp').cloneNode(true), d = +new Date();
					setStyle(imageSignCreateTempCopy, {
						'border': '1px solid #fff',
						'filter': 'alpha(opacity=30)',
						'opacity': 0.3
					});
					imageSignCreateTempCopy.setAttribute('id', 'imageSignCreateTemp' + d);
					BJ('imageSignCreateTemp').remove();
					$imageWrap.append(imageSignCreateTempCopy);
					imageSignCreateTempCopy.setAttribute('onmouseover','imageSign.showChildren(this);');
					imageSignCreateTempCopy.setAttribute('onmouseout','imageSign.hideChildren(this);');
					imageSignCreateTempCopy.setAttribute('onmousedown','imageSign.stopD(event)');
					
					
					//生成移除按钮
					var imageSignCreateTemp_close = document.createElement('a');
					imageSignCreateTemp_close.href = 'javascript:;';
					imageSignCreateTemp_close.title = '删除这个';
					imageSignCreateTemp_close.innerHTML = 'remove';
					imageSignCreateTemp_close.setAttribute('onclick','imageSign.rm(this,event)');
					imageSignCreateTemp_close.setAttribute('onmousedown','imageSign.stopD(event)');
					
					setStyle(imageSignCreateTemp_close, {
						'position': 'absolute',
						'display': 'none',
						'right': '5px',
						'top': '5px',
						'fontWeight': 'bold',
						'color': '#fff',
						'textDecoration': 'underline'
					});
					BJ(imageSignCreateTempCopy).append(imageSignCreateTemp_close);
					BJ(imageSignCreateTempCopy).bind({
						'mouseover':function(){
							//BJ(imageSignCreateTemp_close).show();
							imageSign.showChildren(this);
						},
						'mouseout':function(){
							imageSign.hideChildren(this);
							//BJ(imageSignCreateTemp_close).hide();
						},
						'mousedown':function(e){
							BJ.stopBubble(e);
						}
					});
					
					BJ(imageSignCreateTemp_close).bind({
						'click':function(e){
							BJ.stopBubble(e);
							
							var p=BJ(this).parent();		
							p.next().remove();
							p.remove();
						},
						'mousedown':function(e){
							BJ.stopBubble(e);
						}
					});
				
					//留下文字
					var v = BJ('#imageSignCreateTemp_textarea').value || '什么都没填～～',
						otxt = document.createElement('div'), 
						l = BJ('#imageSignCreateTemp_text').style.left, 
						t = BJ('#imageSignCreateTemp_text').style.top;
					
					setStyle(otxt, {
						'border': '1px solid #fff',
						'filter': 'alpha(opacity=40)',
						'opacity': 0.4,
						'left': l,
						'top': t,
						'padding': '5px',
						'position': 'absolute',
						'color': '#fff',
						'backgroundColor': '#000'
					});
					otxt.innerHTML = v;
					BJ('imageSignCreateTemp_text').remove();
					$imageWrap.append(otxt);
					
					saveSign();
				};
			});
		}
	});
		
	document.onmouseup=function(){
		key=false;
	};
	
	return {
		rm:function(me,e){	
			BJ.stopBubble(e);
					
			var p=BJ(me).parent();		
			p.next().remove();
			p.remove();
			
			saveSign();
		},
		
		showChildren:function(me){
			var fc=BJ(me).children(1);
			fc.show();
			var z=+BJ('#curZIndex').value+1;
			
			me.style.zIndex=z;
			BJ(me).next().getElem().style.zIndex=z;
			BJ('#curZIndex').value=z;
			
			BJ(me).next().setOpacity(60);
			BJ(me).setOpacity(60);
		},
		
		hideChildren:function(me){
			BJ(me).children().hide();
			
			BJ(me).next().setOpacity(30);
			BJ(me).setOpacity(30);
		},
		
		stopD:function(e){
			BJ.stopBubble(e);
		},
		
		removeAll:function(){
			localStorageFn.remove('m');
		}
	};
})();
