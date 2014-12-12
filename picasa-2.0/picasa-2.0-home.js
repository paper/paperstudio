/*
 * @author paper
 */
(function($){
	var ht=document.getElementsByTagName('html')[0],
		bd=document.getElementsByTagName('body')[0],
		aLinks=document.getElementsByTagName('a'),
		picasa_nav_cover,
		aLinks_picasa=[],//真正的图片路径
		aLinks_picasa_imgSrc=[],//小图片路径
		curI=0,
		loadingOver=false;
	
	//提取picasa数组
	for(var i=0,len=aLinks.length;i<len;i++){
		if(aLinks[i].rel==='picasa'){
			aLinks_picasa.push(aLinks[i]);
			aLinks_picasa_imgSrc.push($(aLinks[i]).children(1).getElem());
		};
	}
	
	//如果没有的话，就不做了。
	if(aLinks_picasa.length==0) return;
	
	//给页面上每个带有rel==picasa的图片链接绑定事件
	$(aLinks_picasa).bind({
		'click':function(e){
			$.stopDefault(e);
			createPicasa(this,this.getI);
		}
	});
	
	var animate = (function(){
	    var f = function(obj){
	        var elem = obj.elem, 
	        	begin=obj.begin,				
	        	end=obj.end,					
	       		callback = obj.callback, 
	       		callbackOver=obj.callbackOver,
			 	speed = obj.speed || 10; //时间频率
			 
			$(picasa_nav_cover).show(); 	
			(function(){
	            if (begin == end){
					$(picasa_nav_cover).hide();
					if (callbackOver)	callbackOver.call(elem, begin);
					return;
				}
	            
	            var step;
	            if (begin < end) {
	                step = Math.ceil((end - begin) / 10);
	                begin += step;
	            }
	            else {
	                step = Math.ceil((begin - end) / 10);
	                begin -= step;
	            }
	            callback.call(elem, begin);
	            
	            setTimeout(arguments.callee, speed);
	        })();
	    };
	    
	    return f;
	})();
	
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
			
			$('picasa-nav-cover').show();	
	        (function(){
	            if (Math.abs(from0-to0)<1 && Math.abs(from1-to1)<1){
					$('picasa-nav-cover').hide();	
					
					if(endCallback) endCallback.call(elem,from0,from1);
					return;
				} 
	            
				var step0;
				if(to0>from0){
					step0=Math.ceil((to0 - from0) / 2);
					from0 += step0;
				}else{
					step0=Math.ceil((from0 - to0) / 2);
					from0 -= step0;
				}
	
				var step1=step0*k;
				if(to1>from1){
					from1 += step1;
				}else{
					from1 -= step1;
				}

	            callback.call(elem,from0,from1);
	            
	            setTimeout(arguments.callee, speed);
	        })();
	    };
	    
	    return f;
	})();
	
	//创建picasa UI
	var createPicasa=function(el,xb){
		picasa.oldHtmlStyle=ht.style.cssText;
		picasa.oldScrollTop=document.documentElement.scrollTop || 0;
		picasa.oldScrollLeft=document.documentElement.scrollLeft || 0;
		
		ht.style.height="100%";
		ht.style.width="100%";
		ht.style.overflow="hidden";
		
		var images_list='',
			images_list_li='',
			html='';
		
		for(var i=0;i<aLinks_picasa.length;i++){
			images_list_li+='<li><a href="'+aLinks_picasa[i].href+'"><img src="'+aLinks_picasa_imgSrc[i].src+'" /></a></li>';
		}
		images_list='<ul>'+images_list_li+'</ul>';

		html='<div id="picasa">'+
				'<span id="picasa-nav-msg"></span>'+
				'<div id="picasa-image-wrap" class="picasa-image">'+
					//'<img id="picasa-image-node" src="" />'+
				'</div>'+
				'<div id="picasa-close" title="关闭"></div>'+
				'<div id="picasa-nav">'+
					'<div id="picasa-nav-cover"></div>'+
					'<div class="picasa-nav-images" id="picasa-nav-images">'+images_list+'</div>'+
					'<div class="picasa-nav-op">'+
						'<a href="javascript:;" id="picasa-image-toBig">放大</a>'+
						'<a href="javascript:;" id="picasa-image-toSmall">缩小</a>'+
						'<a href="javascript:;" id="picasa-image-toNormal">原始</a>'+
					'</div>'+
				'</div>'+
			'</div>';
		
		$.asynInnerHTML(html,function(f){
			bd.appendChild(f);
		},function(){
			init(xb);
			
			createImage(el.href,function(){
				picasa();
			});
		});
	};//end createPicasa
	
	//移除框架
	var removePicasa=function(){
		$('#picasa').remove();
		$.removeLightbox();
		ht.style.cssText=picasa.oldHtmlStyle;
		window.scroll(picasa.oldScrollLeft,picasa.oldScrollTop);
	};//end removePicasa
	
	//创建图片
	var createImage=function(src,callback){
		while(document.getElementById('picasa-image-node')){
			$('#picasa-image-node').remove();
		}
		
		var picasa_nav_msg=document.getElementById('picasa-nav-msg'),
			img = new Image(); //创建一个Image对象，实现图片的预下载  
     	img.src = src;
		img.id='picasa-image-node';
		picasa_nav_msg.innerHTML='<span class="loading">图片正在加载</span>';
		loadingOver=false;
		document.getElementById('picasa-image-wrap').appendChild(img);
		
		var init=function(){
			picasa_nav_msg.innerHTML='';
			loadingOver=true;
			$.drag({
				node:'picasa-image-node'
			});
		};
		
        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
        	init();
			
            callback.call(img);
            return; // 直接返回，不用再处理onload事件  
        }else{
			 img.onload = function(){ //图片下载完毕时异步调用callback 函数。  
        		init();
				
            	callback.call(img);//将回调函数的 this替换为Image对象  
       		 };
		}
	};//end checkImageLoad
	
	//初始化UI框架
	var init=function(xb){
		$.lightbox();
		picasa_nav_cover=document.getElementById('picasa-nav-cover');
		
		//可以移除，防止图片一直加载导致不能关闭
		$('#picasa-close').bind({
			'click':function(){
				if(!loadingOver) removePicasa();
			}
		});
		
		curI=xb;

		//获取picasa-nav的宽度
		var picasa_nav_width=$('#picasa-nav').getElemHeightWidth().width,
			picasa_nav_images=document.getElementById('picasa-nav-images');
		document.getElementById('picasa-nav-images').style.left=picasa_nav_width/2-17+'px';
		
		animate({
		    elem: picasa_nav_images, 
		    begin: parseInt(picasa_nav_images.style.left),
		    end: parseInt(picasa_nav_images.style.left)-curI*34, 
		    callback: function(begin){
		        this.style.left = begin + "px"; 
		    },
			callbackOver:function(){
				$('#picasa-nav-images').find('a').get(curI).addClass('on');
			}
		});			
	};//end init
	
	//图片加载完毕后的一些事件绑定
	var picasa = function(){
		window.scroll(0,0);
		loadingOver=true;
		
		//为了改变还原1：1，记住这个大小
		var imgNode_height_default,imgNode_width_default,
			//设置图片居中，并返回它真实的width和height
			//这个前提是图片加载完毕
			setImageCenter=function(imgId){
				var img=typeof imgId=='string'?document.getElementById(imgId):imgId,
					img_height = parseInt(img.height) || 0,
					img_width = parseInt(img.width) || 0,
					k=img_height/img_width;
					
				//改变默认宽度与高度
				imgNode_height_default=img_height;
				imgNode_width_default=img_width;
				
				//页面的大小
				window_width=$.getArea().width;
				window_height=$.getArea().height;
				
				img.style.position='absolute';
				
				//图片要是太大的话，缩小
				if(img_width>960){
					img_width=960;
					img_height = ~~(960*k);
				}else if(img_height>600){
					img_height=600;
					img_width=~~(600/k);
				}
				
				img.style.width=img_width+'px';
				img.style.height=img_height+'px';
				
				//居中
				img.style.left=~~(window_width/2 -img_width/2) + 'px';
				img.style.top=~~(window_height/2- img_height/2) + 'px';
			},
			imgNode_wrap=document.getElementById('picasa-image-wrap'),
			imgNode =document.getElementById('picasa-image-node'),
			$picasa_nav_images_a=$('#picasa-nav-images').find('a'),
			picasa_nav_images=document.getElementById('picasa-nav-images');
			
		setImageCenter(imgNode);
		
		//创建隐藏的已加载了的图片
		var imageCopy=function(imgNode){
			if(!document.getElementById('picasa_temp_image_wrapper')){
				var oid=document.createElement('div'),
					img=document.createElement('img');
				
				oid.id='picasa_temp_image_wrapper';
				oid.style.position='absolute';
				oid.style.left='-99999px';
				oid.style.top='-99999px';
				
				img.src=imgNode.src;
				oid.appendChild(img);
				bd.appendChild(oid);
			}else{
				var picasa_temp_image_wrapper=document.getElementById('picasa_temp_image_wrapper'),
					imgs=picasa_temp_image_wrapper.getElementsByTagName('img');
				
				for(var i=0;i<imgs.length;i++){
					if(imgs[i].src==imgNode.src){
						break;
					}
					
					if(imgs[i].src!=imgNode.src && i==imgs.length-1){
						var img=document.createElement('img');
						img.src=imgNode.src;
						picasa_temp_image_wrapper.appendChild(img);
					}
				}
			}
		};//createImageTemp
		
		//下面小图片的导航	
		//这里会动态加载其他的图片
		$picasa_nav_images_a.bind({
			'click':function(e){
				$.stopDefault(e);
				
				var that=this,
					thisI=that.getI,
					src=that.href;
					
				if(thisI==curI) return;
				$picasa_nav_images_a.removeClass('on');

				animate({
				    elem: picasa_nav_images, 
				    begin: parseInt(picasa_nav_images.style.left),
				    end: parseInt(picasa_nav_images.style.left)-(thisI-curI)*34, 
				    callback: function(begin){
				        this.style.left = begin + "px"; 
				    },
					callbackOver:function(){
						//获取on class
						$(that).addClass('on');
						
						//把当前的i值改变
						curI=thisI;
						
						createImage(src,function(){
							imageCopy(this);
							
							//居中后，要重写图片默认宽度与高度
							setImageCenter(this);
						});
					}
				});		
			}
		});//下面小图片的导航
		
		//放大
		$('#picasa-image-toBig').bind({
			'click':function(){
				if(!loadingOver) return;
				
				var imgNode=document.getElementById('picasa-image-node'),
					curLeft=parseInt(imgNode.style.left),
					curTop=parseInt(imgNode.style.top),
					cur_imgNode_height = parseInt(imgNode.height), 
					cur_imgNode_width = parseInt(imgNode.width),
					
					step_w=cur_imgNode_width>600?200:100,
					step_h=(cur_imgNode_width+step_w)/(imgNode_width_default/imgNode_height_default)-cur_imgNode_height;
				
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
		});//放大
		
		//缩小
		$('#picasa-image-toSmall').bind({
			'click':function(){
				if(!loadingOver) return;
				
				var imgNode=document.getElementById('picasa-image-node'),
					curLeft=parseInt(imgNode.style.left),
					curTop=parseInt(imgNode.style.top),
					cur_imgNode_height = parseInt(imgNode.height), 
					cur_imgNode_width = parseInt(imgNode.width),

					step_w=cur_imgNode_width>600?200:100,
					step_h=cur_imgNode_height-(cur_imgNode_width-step_w)/(imgNode_width_default/imgNode_height_default);
					
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
		});//缩小
		
		//回到1:1
		$('#picasa-image-toNormal').bind({
			'click':function(){
				if(!loadingOver) return;
				
				var imgNode=document.getElementById('picasa-image-node'),
					curLeft=parseInt(imgNode.style.left),
					curTop=parseInt(imgNode.style.top),
					cur_imgNode_height = parseInt(imgNode.height), 
					cur_imgNode_width = parseInt(imgNode.width);
				
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
		});//回到1:1
		
		//关闭
		$('#picasa-close').bind({
			'click':function(){
				var imgNode=document.getElementById('picasa-image-node'),
					curLeft=parseInt(imgNode.style.left),
					curTop=parseInt(imgNode.style.top),
					cur_imgNode_height = parseInt(imgNode.height), 
					cur_imgNode_width = parseInt(imgNode.width);
					
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
		});//关闭
		
	};//picasa
})(Fuee);