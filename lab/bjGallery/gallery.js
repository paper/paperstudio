/*
 * @author paper
 * @blog   hi.baidu.com/paperstudio
 * @date   2009-12-24
 */

var bjGallery=(function(){
	var next=1,			//下一个需要显示的图片位置,以为一开始的位置是0
		zIndex,			//下一个最大的zIndex的值
		time = null,	//轮播控制的时间
		imagesLength,	//图片个数
		key=false,		//判断html是否加载完了
		wraper,			//包裹的容器
		
		//事件绑定
		bindFunction=function(obj){
			var htmlTime=setInterval(function(){
				
				if(document.getElementById("bj-gallery-done-sign")){
					key=true;
					clearInterval(htmlTime);
				}
				
				if (key) {
					//显示第num个图片
					var getImage = function(num){
						var navAs = BJ(wraper).find(".bj-gallery-nav a");
						//改变样式
						navAs.removeClass();
						BJ(navAs.getElem()[num]).addClass("select");
						
						//改变li模块
						var imagesLi = BJ(wraper).find(".bj-gallery-img-wrapper li").getElem();
						
						if(typeof obj.animate!=="undefined" && obj.animate===true){
							BJ(imagesLi[num]).css({
								"zIndex": zIndex
							}).hide().fIn(80);
						}else{
							BJ(imagesLi[num]).css({
								"zIndex": zIndex
							});
						}

						zIndex++;
					};
					
					//停止轮播
					var stopAuto = function(){
						if (time)
							clearInterval(time);
					};
					
					//轮播开始
					var startAuto = function(){
						stopAuto();
						time = setInterval(function(){
							//显示下一个图片
							getImage(next);
							next++;
							if (next == imagesLength) {
								next = 0;
							}
						}, obj.speed);
					};
					
					//如果定义了speed,就运行
					if (typeof obj.speed !== "undefined") {
						startAuto();
						
						BJ(wraper).find(".bj-gallery").bind({
							mouseover: function(){
								stopAuto();
							},
							
							mouseout: function(){
								startAuto();
							}
						});
						
						BJ(wraper).find(".bj-gallery-nav").bind({
							mouseover: function(){
								stopAuto();
							}
						});
					}
					
					BJ(wraper).find(".bj-gallery-nav a").bind({
						click: function(){
							if (this.className == "select") {
								return;
							}
							//因为是鼠标直接获取，所以显示鼠标点击的那张图片
							var cur = parseInt(BJ(this).attr("rel"));
							getImage(cur);
							
							if(cur==imagesLength-1){
								next=0;
							}else{
								next=cur+1;
							}
							
						}
					});
					
				}//key
			},10);
			
		};

		//开始
		function startGallery(obj){
			wraper=obj.wraper;
				
			var wraperHeight=parseInt(BJ(wraper).css("height")),
				wraperWidth=parseInt(BJ(wraper).css("width")),
				images=obj.images;
				
			imagesLength=images.length;
			zIndex=imagesLength+1;
			
			//生成样式
			var bjGalleryStyle=document.createElement("style"),
				
				bjGalleryStyleMain='.bj-gallery{'
					+'position:relative;'
					+'overflow:hidden;'
				+'}'
				+'.bj-gallery .bj-gallery-img-wrapper{'
					+'width:100%;'
					+'height:100%;'
					+'z-index:1;'
					+'position:absolute;'
				+'}'
				+'.bj-gallery .bj-gallery-img-wrapper ol{'
					+'width:100%;'
					+'height:100%;'
				+'}'
				+'.bj-gallery .bj-gallery-img-wrapper ol li{'
					+'position:absolute;'
					+'display:block;'
				+'}'
				+'.bj-gallery .bj-gallery-img-wrapper ol li .bj-gallery-info{'
				+'	height:50px;'
				+'	position:absolute;'
				+'	width:'+wraperWidth+'px;'
				+'}'
				+'.bj-gallery .bj-gallery-img-wrapper ol li .bj-gallery-info p{'
				+'	color:#fff;'
				+'	line-height:1.5;'
				+'	padding:7px 5px 0 10px;'
				+'}'
				+'.bj-gallery .bj-gallery-img-wrapper ol li .bj-gallery-info-blackbg{'
				+'	background-color:#000;'
				+'	opacity:0.5;'
				+'	filter:alpha(opacity=30);'
				+'	height:50px;'
				+'	width:'+wraperWidth+'px;'
				+'	position:absolute;'
				+'	top:0;'
				+'	left:0;'
				+'}'
				+'.bj-gallery .bj-gallery-img-wrapper ol li .bj-gallery-img{}'
				+'.bj-gallery .bj-gallery-img-wrapper ol li .bj-gallery-img img{}'
				+'.bj-gallery .bj-gallery-nav{'
				+'	right:0;'
				+'	bottom:0;'
				+'	position:absolute;'
				+'	z-index:2;'
				+'}'
				+'.bj-gallery .bj-gallery-nav ol{'
				+'	float:left;'
				+'}'
				+'.bj-gallery .bj-gallery-nav ol li{'
				+'	float:left;'
				+'	display:inline;'
				+'}'
				+'.bj-gallery .bj-gallery-nav ol li a{'
				+'	float:left;'
				+'	width:30px;'
				+'	height:15px;'
				+'	line-height:15px;'
				+'	text-align:center;'
				+'	border-top:1px solid #000;'
				+'	border-left:1px solid #000;'
				+'	color:#fff;'
				+'	background-color:#333;'
				+'	outline:none;'
				+'}'
				+'.bj-gallery .bj-gallery-nav ol li a.select,.bj-gallery .bj-gallery-nav ol li a:hover{'
				+'	text-decoration:none;'
				+'	font-weight:bolder;'
				+'	background-color:#cecece;'
				+'	color:#000;'
				+'}';
			
			bjGalleryStyle.setAttribute('type', 'text/css');

            if (bjGalleryStyle.styleSheet) {// IE
                bjGalleryStyle.styleSheet.cssText = bjGalleryStyleMain;
            }
            else {// w3c
                bjGalleryStyle.appendChild(document.createTextNode(bjGalleryStyleMain));
            }
			document.getElementsByTagName('head')[0].appendChild(bjGalleryStyle); 
			
			//首先生成4个图片li
			var imageLiHtml='';
			for(var i=0;i<imagesLength;i++){
				var info=typeof images[i].info==="undefined"? "暂无说明" : images[i].info,
					alt=typeof images[i].alt==="undefined"? "" : images[i].alt,
					href=typeof images[i].href==="undefined"? "javascript:;" : images[i].href;
				
				imageLiHtml+='<li style="z-index:'+(imagesLength-i)+'">'
								+'<div class="bj-gallery-info-blackbg"></div>'
								+'<div class="bj-gallery-info">'
									+'<p>'+info+'</p>'
								+'</div>'
								+'<div class="bj-gallery-img">'
									+'<a href="'+href+'"><img src="'+images[i].src+'" alt="'+alt+'" width="'+wraperWidth+'" height="'+wraperHeight+'" /></a>'
								+'</div>'
							+'</li>';
			}
			
			//在生成nav的4个li
			var navLiHtml='';
			for(var i=0;i<imagesLength;i++){
				//默认从开头开始
				if(i==0){
					navLiHtml+='<li><a href="javascript:;" class="select" rel="'+i+'">'+(i+1)+'</a></li>';
					continue;	
				}
				
				navLiHtml+='<li><a href="javascript:;" rel="'+i+'">'+(i+1)+'</a></li>';
			}
			
			//整合全部的html
			var galleryHtml='';
			galleryHtml='<div class="bj-gallery" style="width:'+wraperWidth+'px;height:'+wraperHeight+'px">'
							+'<div class="bj-gallery-img-wrapper">'
								+'<ol>'
									+imageLiHtml
								+'</ol>'
							+'</div>'
							
							+'<div class="bj-gallery-nav">'
								+'<ol>'
									+navLiHtml
								+'</ol>'
								+'<div id="bj-gallery-done-sign" style="display:none;"></div>'
							+'</div>'
						+'</div>';
			
			setTimeout(function(){
				BJ(wraper).html(galleryHtml);
			},10);
			
			//绑定函数
			bindFunction(obj);
		};
		
		return startGallery;
})();
