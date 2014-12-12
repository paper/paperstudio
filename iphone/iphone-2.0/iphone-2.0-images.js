/*
 * @author paper
 */

var imagesShow=(function(){
	var fn=function(){
			
		var imgs=BJ('iphoneMain_images').find('img').getElem(),
			leftKey=true,
			RightKey=true,
			
			html='<div id="iphoneImageShow" style="display: none;">'+
						'<div id="iphoneImageShowToLeft"></div>'+
						'<div id="iphoneImageShowToRight"></div>'+
						'<div id="iphoneImageShowClose"></div>'+
						
						'<div id="iphoneImageShowImageWrap"></div>'+
						
						'<a id="iphoneImageShowSetBg" href="javascript:;">设它为桌面背景</a>'+
					'</div>',
			
			showImg=function(){
				//BJ('iphoneImageShowLoading').show();
				
				BJ('iphoneImageShowImageWrap').fOut('fast',function(){
					var curImg=+BJ('iphoneImageShowImageWrap').attr('rel');
					
					BJ('iphoneImageShowImageWrap').empty();
					BJ(this).append(imgs[curImg].cloneNode(true));
					BJ(this).fIn('fast',function(){
						leftKey=true;
						RightKey=true;
						//BJ('iphoneImageShowLoading').hide();
					});
				});
			};
		
		if(!BJ('#iphoneImageShow'))
			BJ('iphoneWindow').append(html);
		
		BJ('iphoneMain').find('.images-list li').bind('click',function(){
			var that=this,
				rel=+BJ(this).attr('rel');
			
			BJ('iphoneImageShowImageWrap').attr('rel',rel);
			
			BJ('#iphoneImageShowImageWrap').innerHTML=that.innerHTML;
			
			BJ('iphoneLightbox').css({
				opacity:0.8
			});
			BJ('iphoneLightbox').fIn('fast');
			BJ('iphoneImageShow').fIn('fast');
		});
		
		//向左
		BJ('iphoneImageShowToLeft').bind('click',function(){
			if (leftKey) {
				var curImg=+BJ('iphoneImageShowImageWrap').attr('rel');
				
				leftKey=false;
				RightKey=false;
				
				if (curImg == 0) {
					curImg = imgs.length - 1;
				}
				else {
					curImg--;
				}
				
				BJ('iphoneImageShowImageWrap').attr('rel',curImg);
				showImg();
			}
		});
		
		//向右
		BJ('iphoneImageShowToRight').bind('click',function(){
			if (RightKey) {
				var curImg=+BJ('iphoneImageShowImageWrap').attr('rel');
				
				leftKey=false;
				RightKey=false;
				
				if (curImg == imgs.length - 1) {
					curImg = 0;
				}
				else {
					curImg++;
				}
				
				BJ('iphoneImageShowImageWrap').attr('rel',curImg);
				showImg();
			}
		});
		
		//关闭
		BJ('iphoneImageShowClose').bind('click',function(){
			BJ('iphoneImageShow').fOut(50);
			BJ('iphoneAlertWindow').hide();
			Iphone.hideLightbox();
		});
		
		//设置桌面背景
		BJ('iphoneImageShowSetBg').bind('click',function(){
			var html = '<div class="pd15 f16 tsup fb">是否将该图片设置为壁纸<br />点击 OK 确定</div>';
			Iphone.iphoneAlertWindow(html, function(){
				Iphone.iphoneAlertWindowOkCallback = function(){
					var rel=+BJ('iphoneImageShowImageWrap').attr('rel'),
						classname='iphoneBg'+(rel+1);

					BJ('#iphoneWindow').className=classname;
					Iphone.localStorage.set('iphoneBg',classname);
				};
				
				Iphone.iphoneAlertWindowCancelCallback = function(){
					//Iphone.showLightbox();
				};
			});
		});
	};
	
	return fn;
})();
imagesShow();
