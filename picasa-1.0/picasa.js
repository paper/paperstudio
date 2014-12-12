/*
 * @author paper
 */
(function($){
	var ht=document.getElementsByTagName('html')[0],
		bodyDOM=document.getElementsByTagName('body')[0],
		aLinks=document.getElementsByTagName('a'),
		aLinks_picasa=[],
		imgover=false;
	
	for(var i=0,len=aLinks.length;i<len;i++){
		if(aLinks[i].rel==='picasa'){
			aLinks_picasa.push(aLinks[i]);
		};
	}
	
	$(aLinks_picasa).each(function(){
		$(this).bind({
			'click':function(e){
				$.stopDefault(e);
				createPicasa(this);
			}
		})
	});
	
	var createPicasa=function(el){
		picasa.oldHtmlStyle=ht.style.cssText;
		picasa.oldScrollTop=document.documentElement.scrollTop;
		
		ht.style.height="100%";
		ht.style.width="100%";
		ht.style.overflow="hidden";
		
		//$.lightbox();
		//alert('dd')
		var html='<div id="picasa">'+
				'<div id="picasa-image-wrap" class="picasa-image">'+
					'<img id="picasa-image-node" src="'+el.href+'" />'+
				'</div>'+
				'<div id="picasa-close" title="关闭"></div>'+
				
				'<div id="picasa-nav">'+
					'<div class="picasa-nav-images"></div>'+
					'<div class="picasa-nav-op">'+
						'<a href="javascript:;" id="picasa-image-toBig">放大</a>|'+
						'<a href="javascript:;" id="picasa-image-toSmall">缩小</a>|'+
						'<a href="javascript:;" id="picasa-image-toNormal">1:1</a>|'+
						'<span id="picasa-nav-msg"></span>'
					'</div>'+
				'</div>'+
			'</div>';
		
		$.asynInnerHTML(html,function(f){
			bodyDOM.appendChild(f);
		},function(){
			$.lightbox();
			
			checkImageLoad(function(){
				picasa();
			});
		});
	};
	
	var checkImageLoad=function(fn){
		var imgNode=document.getElementById('picasa-image-node');
		document.getElementById('picasa-nav-msg').innerHTML='<span class="loading">图片正在加载</span>';
		
		$('#picasa-close').bind({
			'click':function(){
				if(!imgover) removePicasa();
			}
		});
		
		if (imgNode.complete) {
			if (fn) fn();
		}
		else {
			imgNode.onload = function(){
				if (fn) fn();
			}
		}
	};
	
	var removePicasa=function(){
		$('#picasa').remove();
		$.removeLightbox();
		ht.style.cssText=picasa.oldHtmlStyle;
		window.scroll(0,picasa.oldScrollTop);
	};
	
	var picasa = function(){
		document.getElementById('picasa-nav-msg').innerHTML='';
		window.scroll(0,0);
		imgover=true;
		
		
		var imgNode =document.getElementById('picasa-image-node'),
			imgNode_height_default=imgNode_height = imgNode.height,
			imgNode_width_default=imgNode_width = imgNode.width,
			window_width=$.getArea().width,
			window_height=$.getArea().height;
		
		if(imgNode_width>960){
			imgNode_width=960;
			imgNode.style.width=960+'px';
			imgNode_height = imgNode.height;
		}else if(imgNode_height>600){
			imgNode_height=600;
			imgNode.style.height=600+'px';
			imgNode_width = imgNode.width;
		}
		
		//居中
		imgNode.style.left =~~(window_width/2 -imgNode_width/2) + 'px';
		imgNode.style.top = ~~(window_height/2- imgNode_height/2) + 'px';
		
		$.drag({
			node: imgNode
		});
		
		/*
		 * animateArray({
		 *  elem:node,
		 *  from:[100,200],
		 *  to:[40,50],
		 *  callback:function(l,t){
		 *   node.style.left=l+'px';
		 *   node.style.top=t+'px';
		 *  }
		 * })
		 */
		var animateArray= (function(){
		    var f = function(obj){
		        var elem = obj.elem, 
		        	from=obj.from,				
		        	to=obj.to,			
		        	callback = obj.callback, 
		        	endCallback=obj.endCallback,
				 	speed = obj.speed || 1,
					from0=~~from[0],from1=~~from[1],to0=~~to[0],to1=~~to[1],
					k=Math.abs(from1-to1)/Math.abs(from0-to0);
				 	
		        (function(){
		            if (Math.abs(from0-to0)<1 && Math.abs(from1-to1)<1){
						if(endCallback) endCallback.call(elem,from0,from1);
						return;
					} 
		            
					var step0;
					//if(from0<to0){
						step0=(to0 - from0) / 4;
						from0 += step0;
					//}else{
						//step0=Math.ceil((from0 - to0) / 10);
						//from0 -= step0;
					//}
					
					var step1=step0*k;
					//document.getElementById('msg').innerHTML=from1;
					//if(from1<to1){
						from1 += step1;
					//}else{
					//	from1 -= step1;
					//}

		            callback.call(elem,from0,from1);
		            
		            setTimeout(arguments.callee, speed);
		        })();
		    };
		    
		    return f;
		})();
		
		$('#picasa-image-toBig').bind({
			'click':function(){
				//imgNode.style.left=100+'px';
				
				var curLeft=parseInt(imgNode.style.left),
					curTop=parseInt(imgNode.style.top),
					cur_imgNode_height = imgNode.height, 
					cur_imgNode_width = imgNode.width;
				
					//step_w=100,
					//step_h=(cur_imgNode_width+step_w)/(imgNode_width/imgNode_height)-cur_imgNode_height;
				if(cur_imgNode_width>600){
					var step_w=200;
				}else{
					var step_w=100;
				}
				var step_h=(cur_imgNode_width+step_w)/(imgNode_width/imgNode_height)-cur_imgNode_height;
				
				animateArray({
					elem:imgNode,
					from:[curLeft,curTop],
					to:[curLeft-step_w/2,curTop-step_h/2],
					callback:function(l,t){
						this.style.left=l+'px';
						this.style.top=t+'px';
					}
				});
				
				animateArray({
					elem:imgNode,
					from:[cur_imgNode_width,cur_imgNode_height],
					to:[cur_imgNode_width+step_w,cur_imgNode_height+step_h],
					callback:function(w,h){
						this.style.width=w+'px';
						this.style.height=h+'px';
					}
				});
			}
		});
		
		$('#picasa-image-toSmall').bind({
			'click':function(){
				var curLeft=parseInt(imgNode.style.left),
					curTop=parseInt(imgNode.style.top),
					cur_imgNode_height = imgNode.height, 
					cur_imgNode_width = imgNode.width;
				
					//step_w=100,
					//step_h=cur_imgNode_height-(cur_imgNode_width-step_w)/(imgNode_width/imgNode_height);
				if(cur_imgNode_width>600){
					var step_w=200;
				}else{
					var step_w=100;
				}
				var step_h=cur_imgNode_height-(cur_imgNode_width-step_w)/(imgNode_width/imgNode_height);
				if(cur_imgNode_width<=150 || cur_imgNode_height<=step_h) return;
				
				animateArray({
					elem:imgNode,
					from:[curLeft,curTop],
					to:[curLeft+step_w/2,curTop+step_h/2],
					callback:function(l,t){
						this.style.left=l+'px';
						this.style.top=t+'px';
					}
				});
				
				animateArray({
					elem:imgNode,
					from:[cur_imgNode_width,cur_imgNode_height],
					to:[cur_imgNode_width-step_w,cur_imgNode_height-step_h],
					callback:function(w,h){
						this.style.width=w+'px';
						this.style.height=h+'px';
					}
				});
			}
		});
		
		$('#picasa-image-toNormal').bind({
			'click':function(){
				var curLeft=parseInt(imgNode.style.left),
					curTop=parseInt(imgNode.style.top),
					cur_imgNode_height = imgNode.height, 
					cur_imgNode_width = imgNode.width;
				
				if(Math.abs(cur_imgNode_width-imgNode_width_default)<2 && Math.abs(cur_imgNode_height-imgNode_height_default)<2){
					return;
				}
					
				animateArray({
					elem:imgNode,
					from:[curLeft,curTop],
					to:[curLeft-(imgNode_width_default-cur_imgNode_width)/2,curTop-(imgNode_height_default-cur_imgNode_height)/2],
					callback:function(l,t){
						this.style.left=l+'px';
						this.style.top=t+'px';
					}
				});

				animateArray({
					elem:imgNode,
					from:[cur_imgNode_width,cur_imgNode_height],
					to:[imgNode_width_default,imgNode_height_default],
					callback:function(w,h){
						this.style.width=w+'px';
						this.style.height=h+'px';
					}
				});
			}
		});
		
		$('#picasa-close').bind({
			'click':function(){
				var curLeft=parseInt(imgNode.style.left),
					curTop=parseInt(imgNode.style.top),
					cur_imgNode_height = imgNode.height, 
					cur_imgNode_width = imgNode.width;
				
					//step_w=100,
					//step_h=cur_imgNode_height-(cur_imgNode_width-step_w)/(imgNode_width/imgNode_height);

				animateArray({
					elem:imgNode,
					from:[curLeft,curTop],
					to:[curLeft+cur_imgNode_width/2,curTop+cur_imgNode_height/2],
					callback:function(l,t){
						this.style.left=l+'px';
						this.style.top=t+'px';
					}
				});
				
				animateArray({
					elem:imgNode,
					from:[cur_imgNode_width,cur_imgNode_height],
					to:[5,5],
					callback:function(w,h){
						this.style.width=w+'px';
						this.style.height=h+'px';
					},
					endCallback:function(){
						removePicasa();
					}
				});
			}
		});
	};
})(Fuee);