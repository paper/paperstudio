/*
 * @author paper
 */

var bjDialog=(function(){
	var createCSS=function(o){
		var style='.bjDialog table {'
			+'border-collapse: collapse;'
			+'border-spacing: 0;'
			+'}'
			+'.bjDialog{'
			+'	position:absolute;overflow:hidden;'
			+'}'
			+'.bjDialogIframe{'
			+'	display:block;'
			+'	border:0 none;'
			+'	position:absolute;'
			+'	z-index:-3;'
			+'	top:0;'
			+'	left:0;'
			+'}'
			+'.bjDialog-iframe-updiv{'
			+'	display:block;'
			+'	background-color:'+o.bgcolor+';'
			+'	position:absolute;'
			+'	z-index:-2;'
			+'	top:2px;'
			+'	left:2px;'
			+'}'
			+'.bjDialog table.bjDialog-table{'
			+'	position:relative;'
			+'}'
			+'.bjDialog table.bjDialog-table td{'
	        +'  vertical-align:top;'
			+'}'
			+'.bjDialog *{'
			+'	padding:0;'
			+'	margin:0;'
			+'	font-size:12px;'
			+'	font-family:Arial,Tahoma,Helvetica,sans-serif;'
			+'}'
			+'.bjDialog-lt-bg,.bjDialog-rt-bg,'
			+'.bjDialog-lb-bg,.bjDialog-rb-bg{'
			+'	background:url('+o.url+'/bjDialog_box.gif) no-repeat;'
			+'}'
			+'.bjDialog-lt-bg{'
			+'	background-position:0 0;'
			+'	width:13px;'
			+'	height:32px;'
			+'}'
			+'.bjDialog-rt-bg{'
			+'	background-position:-18px 0;'
			+'	width:13px;'
			+'	height:32px;'
			+'}'
			+'.bjDialog-lb-bg{'
			+'	background-position:0 -40px;'
			+'	width:13px;'
			+'	height:12px;'
			+'}'
			+'.bjDialog-rb-bg{'
			+'	background-position:-18px -40px;'
			+'	width:13px;'
			+'	height:12px;'
			+'}'
			+'.bjDialog-t-bg{'
			+'	background:url('+o.url+'/bjDialog_boxT.gif) repeat-x;'
			+'	height:32px;'
			+'}'
			+'.bjDialog-b-bg{'
			+'	background:url('+o.url+'/bjDialog_boxB.gif) repeat-x;'
			+'	height:12px;'
			+'}'
			+'.bjDialog-l-bg{'
			+'	background:url('+o.url+'/bjDialog_boxL.gif) repeat-y;'
			+'}'
			+'.bjDialog-r-bg{'
			+'	background:url('+o.url+'/bjDialog_boxR.gif) repeat-y;'
			+'}'
			
			+'.bjDialog-title{'
			+'	float:left;'
			+'  position:relative;'
			+'  padding:7px 0 0 0;'
			+'  margin-left:-5px;'
			+'  height:15px;'
			+'  line-height:15px;'
			+'}'
			+'.bjDialog-title h3{'
			+'	float:left;'
			+'	font-size:12px;'
			+'	color:#fff;'
			+'	padding-left:20px;'
			+'	height:14px;'
			+'	position:relative;'
			+'	background:url('+o.url+'/bjDialog_titleGif.gif) no-repeat 0 0;'
			+'}'
			+'.bjDialog-close{'
			+'	float:right;'
			+'	position:relative;'
			+'	width:34px;'
			+'	height:18px;'
			+'	margin:0 -5px 0 0;'
			+'}'
			+'.bjDialog-close a{'
			+'	outline:none;'
			+'	cursor:pointer;'
			+'	float:right;'
			+'	text-indent:-9999px;'
			+'	width:34px;'
			+'	height:18px;'
			+'	display:block;'
			+'	background:url('+o.url+'/bjDialog_close.gif) no-repeat;'
			+'}'
			+'.bjDialog-close a:hover{'
			+'	background:url('+o.url+'/bjDialog_closeHover.gif) no-repeat;'
			+'}'
			+'.bjDialog-main{'
			+'	overflow:hidden;'
			+'}'
			//下面的按钮样式
			+'.bjDialog-main-bottom-bg{'
			+'	display:block;'
			+'	background-color:#fff;'
			+'	position:absolute;'
			+'	z-index:-1;'
			+'	bottom:2px;'
			+'	left:2px;'
			//+'	width:295px;'
			+'	height:50px;'
			+'	border-top:1px solid #1e7096;'
			+'}'
			+'.bjDialog-main-bottom-bg div{'
			+'	background-color:#E9E6E6;'
			+'	margin-top:1px;'
			+'	width:100%;'
			+'	height:100%;'
			+'}'
			+'.bjDialog-main-bottom{'
			+'	position:relative;'
			+'}'
			+'.bjDialog-main-bottom a{'
			+'	margin:22px 5px 0 10px;'
			+'	float:right;'
			+'	padding-left:5px;'
			+'	color:#fff;'
			+'	display:inline;'
			+'	text-align:center;'
			+'	text-decoration:none;'
			+'	width:60px;'
			+'	height:24px;'
			+'	line-height:24px;'
			+'}'
			+'.bjDialog-main-bottom a span{'
			+'	display:block;'
			+'	padding-right:5px;'
			+'}'
			+'.bjDialog-main-bottom a:hover{'
			+'	text-decoration:none;'
			+'}'
			+'.bjDialog-main-bottom a.bjDialog-bt1{'
			+'	background:url('+o.url+'/bjDialog_buttonStyleOne.png) no-repeat left center;'
			+'}'
			+'.bjDialog-main-bottom a.bjDialog-bt1 span{'
			+'	background:url('+o.url+'/bjDialog_buttonStyleOne.png) no-repeat right center;'
			+'}'
			+'.bjDialog-main-bottom a.bjDialog-bt2{'
			+'	background:url('+o.url+'/bjDialog_buttonStyleTwo.png) no-repeat left center;'
			+'}'
			+'.bjDialog-main-bottom a.bjDialog-bt2 span{'
			+'	background:url('+o.url+'/bjDialog_buttonStyleTwo.png) no-repeat right center;'
			+'}';
			
			var hd=document.getElementsByTagName('head')[0];
			
			var DStyle=document.createElement("style");
			DStyle.setAttribute('type','text/css');
			DStyle.setAttribute('id','bjDialog-css');
			
            if (DStyle.styleSheet) {// IE
                DStyle.styleSheet.cssText = style;
            }
            else {// w3c
                DStyle.appendChild(document.createTextNode(style));
            }
			hd.appendChild(DStyle); 
			
			var metas=document.getElementsByTagName("meta");
			for(var i=0,L=metas.length;i<L;i++){
				if(metas[i].getAttribute("content")==="IE=EmulateIE7"){
					break;
				}
				
				if(metas[i].getAttribute("content")!=="IE=EmulateIE7" && i==L-1){
					var metaTemp=document.createElement("meta");
					metaTemp.setAttribute("http-equiv","X-UA-Compatible");
					metaTemp.setAttribute("content","IE=EmulateIE7");
					hd.appendChild(metaTemp); 
				}
			}
	};

	var createHTML=function(o,callback){
		
		var html='<div class="bjDialog" id="bjDialog" style="display:none;">'
				+'<table id="bjDialog-table" class="bjDialog-table">'
					+'<tr>'
						+'<td class="bjDialog-lt-bg"></td>'
						+'<td class="bjDialog-t-bg" id="bjDialog-hand">'
							+'<div class="bjDialog-title">'
								+'<h3><span>'+o.title+'</span></h3>'
							+'</div>'
							+'<div class="bjDialog-close">'
								+'<a id="bjDialog-close-a" href="javascript:void(0);" title="关闭">关闭</a>'
							+'</div>'
						+'</td>'
						+'<td class="bjDialog-rt-bg"></td>'
					+'</tr>'
					+'<tr id="bjDialog-table-maintr">'
						+'<td class="bjDialog-l-bg"></td>'
						+'<td>'
							+'<div id="bjDialog-main" class="bjDialog-main">'
								+o.content
							+'</div>'
							+'<div id="bjDialog-main-bottom" class="bjDialog-main-bottom" style="height:50px;display:none;">'
								+'<a href="javascript:;" id="bjDialog-main-bottom-cancel" class="bjDialog-bt2"><span>取消</span></a>'
								+'<a href="javascript:;" id="bjDialog-main-bottom-ok" class="bjDialog-bt1"><span>确定</span></a>'
							+'</div>'
						+'</td>'
						+'<td class="bjDialog-r-bg"></td>'
					+'</tr>'
					+'<tr>'
						+'<td class="bjDialog-lb-bg"></td>'
						+'<td class="bjDialog-b-bg"></td>'
						+'<td class="bjDialog-rb-bg"></td>'
					+'</tr>'
				+'</table>'
				+'<div class="bjDialog-main-bottom-bg" id="bjDialog-main-bottom-bg" style="display:none;"><div></div></div>'
				+'<div class="bjDialog-iframe-updiv" id="bjDialog-iframe-updiv"></div>'
				+'<iframe style="filter:alpha(opacity=0);" frameborder="no" marginwidth="0" marginheight="0" scrolling="no" class="bjDialogIframe" id="bjDialog-iframe"></iframe>'
				+'</div>';
					
		document.getElementsByTagName("body")[0].innerHTML+=html;
		
		//加载完了html后，才运行callback	
		var t=setInterval(function(){
			if(document.getElementById("bjDialog-iframe")){
				
				if(typeof callback!=="undefined"){
					callback();
				}
				clearInterval(t);
			}
		},1);
		
		//这里应该修改为html的异步添加，就是防止万一content的html代码很多
		//要是content很少的话，会闪烁的很快，不是很好~~好纠结啊
		/*var odiv=document.getElementById("bjDialog-main"),
			temp=document.createElement("div"),
			frag=document.createDocumentFragment();
		
		temp.innerHTML=o.content;

		(function(){
			if (temp.firstChild) {
				frag.appendChild(temp.firstChild);
				odiv.innerHTML="正在加载...";
				setTimeout(arguments.callee, 0);
			}else{
				odiv.innerHTML="";
				odiv.appendChild(frag);
				
				if(typeof callback!=="undefined"){
					callback();
				}
			}
		})();*/
		
	};
	
	var Dialog=function(obj){
		//如果已经存在一个，就不做了
		if(document.getElementById("bjDialog")){
			return false;
		}
		
		var _this=this;
		
		//默认属性
		var def={
			title:"标题未定义",						//默认的标题		当标题没有设置时
			content:"内容为空，这仅仅是测试文字.",	//默认的内容		当内容没有设置时
			url:"images/bjDialogImages",			//默认dialog的背景图片包的路径
			bgcolor:"#fff",							//默认背景		颜色为白色
			height:150,								//默认高度		当内容没有150高度时，自动设置为150px
			width:300,								//默认宽度		当内容没有300宽度时，自动设置为300px
			closeAuto:false,						//自动关闭		如果设置时，例如：3000表示3秒
			hideCloseButton:false					//隐藏关闭按钮	设置为true时，隐藏右上角的关闭按钮
		},
		
		//得到新的对象参数
		getNewObject=function(o){
			var r=def;
			for(var i in o){
				r[i]=typeof o[i]!=="undefined"?o[i]:def[i];
			}
			return r;
		};
		
		//关闭dialog函数
		_this.closeDialog=function(){
			//防止它正在读秒的时候，你点了关闭
			if(_this.closeAutoTime)
				clearTimeout(_this.closeAutoTime);
			BJ.removeLightbox();
			BJ("bjDialog").remove();
			BJ("bjDialog-css").remove();
		};
		
		var obj=typeof obj==="undefined"?{}:obj,
			o=getNewObject(obj),
		
		//默认加载完了html再触发的事件
		defaultFunc=function(){
			//首先设置它的表现形式
			var bjDialogWidth=BJ("bjDialog").getElemHeightWidth().width,
				bjDialogHeight=BJ("bjDialog").getElemHeightWidth().height,
				h=bjDialogHeight<o.height?o.height:bjDialogHeight,
				w=bjDialogWidth<o.width?o.width:bjDialogWidth;
			
			BJ("bjDialog").css({
				height:h+"px"
			});
			
			BJ("bjDialog-table").css({
				width:w+"px"
			});
			
			BJ("bjDialog-table-maintr").css({
				height:h-44+"px"
			});
			
			BJ("bjDialog-iframe").css({
				height:h+"px",
				width:w+"px"
			});
			
			BJ("bjDialog-iframe-updiv").css({
				height:h-5+"px",
				width:w-5+"px"
			});
				
			BJ("bjDialog").css({
				zIndex:9999,
				marginLeft:-(w/2)+"px",
				left:"50%",
				top:"20%"
			});

			//后面设置它的行为
			BJ.ieImage();
			BJ.drag({
				node: BJ("#bjDialog"),
				hand: BJ("#bjDialog-hand"),
				cursor: "move"
			});
			
			BJ("bjDialog-close-a").bind({
				click:function(e){
					BJ.stopBubble(e);
					_this.closeDialog();
				}
			});
			
			BJ("bjDialog-main-bottom-cancel").bind({
				click:function(){
					_this.closeDialog();
				}
			});
			
			if(typeof o.lightbox==="undefined" || o.lightbox!==false){
				BJ.lightbox({
					zIndex:8000
				});
			}

			if(o.closeAuto!==false){
				_this.closeAutoTime=setTimeout(function(){
					_this.closeDialog();
				},o.closeAuto);
			}
			
			if(o.hideCloseButton===true){
				BJ("bjDialog-close-a").hide();
			}
			
			if(typeof o.ok!=="undefined"){
				//处理样式
				BJ("bjDialog-main-bottom-bg").show();
				BJ("bjDialog-main-bottom").show();
				BJ("bjDialog-main").css({
					height:h-94+"px"
				});
				BJ("bjDialog-main-bottom-bg").css({
					width:w-5+"px"
				});
				
				//事件绑定
				BJ("bjDialog-main-bottom-ok").bind({
					click:function(){
						o.ok.call(_this);
					}
				})
			}
			
			if (BJ.isIE(6)){
				BJ("bjDialog").show();
			}
			else {
				BJ("bjDialog").fIn("fast");
			}
		};
			
		createCSS(o);
		createHTML(o,function(){
			defaultFunc();
			
			if (typeof obj.callback !== "undefined"){
				obj.callback();
			}
		});
	};
	
	return Dialog;
})();
