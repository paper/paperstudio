/*
  @Author paper
  基于jq 1.4.4
  弹出层
*/

function popWindow(){};

popWindow.isIE = (function(){
	var v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');
 
	while (
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		all[0]
	);
 
	return v > 4 ? v : undefined;
}());

popWindow.getMax=function(){
	var dd = document.documentElement;
	return {
		height: Math.max(dd.scrollHeight, dd.clientHeight),
		width: Math.max(dd.scrollWidth, dd.clientWidth)
	}
};

/*
 生成背景lightbox
*/
popWindow.createLightbox=function(para){
	//如果有背景，就不再生成了。
	if($(".popWindow-bg").length>=1) return;

	//window size check key
	popWindow.lightboxCheck = true;
	
	var obj = typeof para === "undefined" ? {} : para, 
		opacity = obj.opacity || 0.4, 
		zIndex = obj.zIndex || 1000, 
		color = obj.color || "#000",
		
		getMax=popWindow.getMax(),
		height=getMax.height,
		width=getMax.width,
	
		div = document.createElement("div"),
		time=null,
		html='';
	
	if (popWindow.isIE==6) {
		html = '<div style=\" filter:alpha(opacity=' + opacity * 100 + '); height:' + height + 'px;width:' + width + 'px;z-index:' + zIndex + ';background-color:' + color + ';left:0;top:0;position:absolute;\"><\/div>' +
		'<iframe frameborder="no" marginwidth="0" marginheight="0" scrolling="no" style=\"filter:alpha(opacity=0);height:' +height +'px;width:' +width +'px;z-index:' +(zIndex - 1) +';left:0;top:0;position:absolute;\"><\/iframe>';
	
	} else {
		html = '<div style=\" filter:alpha(opacity=' + opacity * 100 + '); height:' + height + 'px;width:' + width + 'px;z-index:' + zIndex + ';background-color:' + color + ';opacity:' + opacity + ';left:0;top:0;position:absolute;\"><\/div>';
	}
	
	div.className="popWindow-bg";
	div.innerHTML = html;
	$("body").append(div);
	
	$(window).bind("resize",function(){
		if (popWindow.lightboxCheck) {
			clearTimeout(time);
			
			time=setTimeout(function(){
				$(".popWindow-bg").children().css({
					height: popWindow.getMax().height + "px",
					width: popWindow.getMax().width + "px"
				});
			},50);
		
		}
	});
};

/*
 移除背景lightbox
*/
popWindow.removeLightbox=function(){
	//如果查询到只有一个弹出层的话，就删除背景层
	if($(".popWindow-wrap").length<=1){
		popWindow.lightboxCheck=false;
		$(".popWindow-bg").remove();
	}
};

//根据容器的宽度高度，进行页面居中
popWindow.setCenter=function(elem,animate){
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
		scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop),
		
		step=50;
	
	if(animate===true){
		$elem.animate({
			"left":clientWidth>w ? (clientWidth/2-w/2+'px') : 0,
			"top":clientHeight>h ? (clientHeight/2-h/2+scrollTop-step+'px'):(scrollTop-setp+'px')
		});
	}else{
		$elem.css({
			"left":clientWidth>w ? (clientWidth/2-w/2+'px') : 0,
			"top":clientHeight>h ? (clientHeight/2-h/2+scrollTop-step+'px'):(scrollTop-step+'px')
		});
	}
};


popWindow.createPopWindow=function(para){
	popWindow.createLightbox();
	
	var obj=typeof para==="undefined" ? {} : para,
		h2=typeof obj.h2==="undefined" ? "提示信息" : obj.h2,
		url=typeof obj.url==="undefined" ? null : obj.url,
		data=typeof obj.data==="undefined" ? '' : obj.data,
		width=typeof obj.width==="undefined" ? 300 : obj.width,
		msg=typeof obj.msg==="undefined" ? null : obj.msg;
	
	var popwindowHdHeight=34;
	var html='<div class="popWindow-main">'+
				'<div class="popWindow-hd">'+
					'<h2>'+h2+'</h2>'+
					'<a href="javascript:;" class="popWindow-close" title="关闭">X</a>'+
				'</div>'+
				'<div class="popWindow-bd">'+
					'<span class="popWindow-loading">正在加载。。。请稍候</span>'
				'</div>'+
			  '</div>';
				
	var t=+new Date();
	var id="popWindow"+t;
	var popwindow=document.createElement("div");
	popwindow.id=id;
	popwindow.className="popWindow-wrap";
	
	var $popwindow=$(popwindow);
	//生成弹窗
	$popwindow.append(html);
	$("body").append(popwindow);
	$popwindowBd=$popwindow.find(".popWindow-bd");
	
	//移除弹窗 绑定事件
	$popwindow.find(".popWindow-hd a").click(function(){
		popWindow.removeLightbox();
		popWindow.removePopWindow(popwindow);
	});
	
	//之前的宽度，高度
	var bw,bh,aw,ah;
	
	popWindow.setCenter(popwindow);
	bw=$popwindow.width();
	bh=$popwindow.height();
	
	function insetContent(d,animate,time){
		animate=typeof time==="undefined" ? true : animate;
		time=typeof time==="undefined" ? 200 : time;
		
		setTimeout(function(){
			$popwindowBd.hide();
			$popwindowBd.html(d);

			aw=width;
			ah=$popwindowBd.height()+popwindowHdHeight;
			
			$popwindow.css({
				width:bw+"px",
				height:bh+"px"
			});
			$popwindowBd.show();
			
			if(animate===true){
				$popwindow.animate({
					width:aw+"px",
					height:ah+"px"
				},{
					step:function(){
						popWindow.setCenter(popwindow);
					},
					complete: function() {
						$popwindow.css("height","auto");
					}
				});
			}else{
				$popwindow.css({
					width:aw+"px",
					height:"auto"
				});
				popWindow.setCenter(popwindow);
			}
			
		},time);
	};
	
	//ajax加载新的内容
	if(url){
		$.ajax({
			url:url+"?t="+t+"&"+data,
			beforeSend:function(){
				$popwindowBd.html('<span class="popWindow-loading">正在加载。。。请稍候</span>');
			},
			success:function(d){
				insetContent(d);
			}
		});
	}else{
		 insetContent(msg,false,0);
	}
	
};

popWindow.removePopWindow=function(elem){
	if(typeof elem==="undefined"){
		$('.popWindow-wrap').remove();
	}else{
		elem=typeof elem=="string" ? document.getElementById(elem) : elem;
		$(elem).remove();
		elem=null;
	}
	
	popWindow.removeLightbox();
};

popWindow.createOnlyMsgPopWindow=function(msg){
	msg=typeof msg==="undefined" ? "Error:msg 参数必须填写内容" : msg;

	popWindow.createPopWindow({
		msg:msg
	});
};







