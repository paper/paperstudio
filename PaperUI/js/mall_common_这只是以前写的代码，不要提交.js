/*
 * @Author : Jue
 */
(function($){
	var isIE = (function(){
	    var v = 3,
	        div = document.createElement('div'),
	        all = div.getElementsByTagName('i');
	 
	    while (
	        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	        all[0]
	    );
	 
	    return v > 4 ? v : undefined;
	}());
	
	/*=============================================
	 *  创建半透明的覆盖层
	 ============================================*/
	var lightBoxBgId=null;
	var createLightBoxBg=window.createLightBoxBg=function(){
		if(lightBoxBgId) return;
	
		var t=+new Date();
		lightBoxBgId='lightBoxBgId'+t;
		
		var node=document.createElement("div");
		node.id=lightBoxBgId;
		
		var height=$(document).height();
		
		if(isIE==6){
			var html = '<div style=\" filter:alpha(opacity=60); height:' + height + 'px;width:100%;z-index:100;background:#000;opacity:0.6;left:0;top:0;position:absolute;\"><\/div>' +
            '<iframe frameborder="no" marginwidth="0" marginheight="0" scrolling="no" style=\" opacity:0; filter:alpha(opacity=0);height:' +
            height +'px;width:100%;z-index:99;left:0;top:0;position:absolute;\"><\/iframe>';
		}else{
			 var html = '<div style=\" filter:alpha(opacity=60); height:' + height + 'px;width:100%;px;z-index:100;background:#000;opacity:0.6;left:0;top:0;position:absolute;\"><\/div>';
		}
		
		node.innerHTML=html;
		
		$("body").append(node);
	};
	
	var removeLightBoxBg=window.removeLightBoxBg=function(){
		if(!lightBoxBgId) return;
		
		$("#"+lightBoxBgId).fadeOut("fast",function(){
			$(this).remove();
		});
		lightBoxBgId=null;
	};
	
	//根据容器的宽度高度，进行页面居中
	var setCenter=window.setCenter=function(elem,animate){
		var $elem;
		
		if(typeof elem==='string'){
			if(elem.charAt(0)==="#"){
				$elem=$(elem);
			}else{
				$elem=$("#"+elem);
			}			
		}else{
			$elem=$(elem);
		}
		
		var w=$elem.width(),
			h=$elem.height(),
			clientHeight=document.documentElement.clientHeight,
			clientWidth=document.documentElement.clientWidth,
			scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
		
		if(animate===true){
			$elem.animate({
				"left":clientWidth>w ? (clientWidth/2-w/2+'px') : 0,
				"top":clientHeight>h ? (clientHeight/2-h/2+scrollTop+'px'):(scrollTop+'px')
			});
		}else{
			$elem.css({
				"left":clientWidth>w ? (clientWidth/2-w/2+'px') : 0,
				"top":clientHeight>h ? (clientHeight/2-h/2+scrollTop+'px'):(scrollTop+'px')
			});
		}
	};
	
	/*=============================================
	 *  商城 统一的弹出框
	 ============================================*/
	var popwindow=window.popwindow=function(h2,url,data,width){
		createLightBoxBg();
		
		data=data || "";
		
		var popwindowHdHeight=32;
		var html='<div class="popwindow-hd">'+
					'<h2>'+h2+'</h2>'+
					'<a href="javascript:;" title="关闭" class="close">关闭</a>'+
				'</div>'+
				'<div class="popwindow-bd">'+
					'<span class="popwindow-loading">正在加载。。。请稍候</span>'+
				'</div>';
		
		var t=+new Date();
		var id="popwindow"+t;
		var popwindow=document.createElement("div");
		popwindow.id=id;
		popwindow.className="popwindow";
		
		var $popwindow=$(popwindow);
		//生成弹窗
		$popwindow.append(html);
		$("body").append(popwindow);
		$popwindowBd=$popwindow.find(".popwindow-bd");
		
		//移除弹窗 绑定事件
		$popwindow.find(".popwindow-hd a").click(function(){
			removePopwindow(popwindow);
		});
		
		//之前的宽度，高度
		var bw,bh,aw,ah;
		//ajax加载新的内容
		$.ajax({
			url:url+"?t="+t+"&"+data,
			beforeSend:function(){
				$popwindowBd.html('<span class="popwindow-loading">正在加载。。。请稍候</span>');
				setCenter(popwindow);
				
				bw=$popwindow.width();
				bh=$popwindow.height();
			},
			success:function(data){
				setTimeout(function(){
					$popwindowBd.hide();
					$popwindowBd.html(data);

					aw=width;
					ah=$popwindowBd.height()+popwindowHdHeight;
					
					$popwindow.css({
						width:bw+"px",
						height:bh+"px"
					});
					$popwindowBd.show();
					$popwindow.animate({
						width:aw+"px",
						height:ah+"px"
					},{
						step:function(){
							setCenter(popwindow);
						},
						complete: function() {
							$popwindow.css("height","auto");
						}
					});
				},200);
			}
		});
	};
	
	//传入弹出窗口的id或者节点DOM，移除弹窗
	var removePopwindow=window.removePopwindow=function(elem){
		if(typeof elem==="undefined"){
			$('.popwindow').remove();
		}else{
			elem=typeof elem=="string" ? document.getElementById(elem) : elem;
			$(elem).remove();
			elem=null;
		}
		
		removeLightBoxBg();
	};
	
	//必须是大于1的数字
	//elem 是输入的input
	var biggerOne=window.biggerOne=function(elem,max,callback){
		if(elem.value==''){
			if(typeof arguments[1]==="function"){
				arguments[1](elem.value);
			}else if(typeof arguments[2]==="function"){
				arguments[2](elem.value);
			}
			
			return;
		} 
		
		var v=elem.value;

		v=parseInt(v);
		
		if(isNaN(v)){
			v=1;
		}
		
		var len = arguments.length;
		if(len==1){
			if(v==0){
				elem.value=1;
			}else{
				elem.value=v;
			}
		}else if(len==2){
			
			if(typeof arguments[1]==="function"){
				if(v==0){
					elem.value=1;
				}else{
					elem.value=v;
				}
			
				arguments[1](elem.value);
			}else{
				if(v==0){
					elem.value=1;
				}else if(v>max){
					elem.value=max;
				}else{
					elem.value=v;
				}
			}
			
		}else if(len==3){
			if(v==0){
				elem.value=1;
			}else if(v>max){
				elem.value=max;
			}else{
				elem.value=v;
			}
			
			callback && callback(elem.value);
		}
	};
	
})(jQuery);