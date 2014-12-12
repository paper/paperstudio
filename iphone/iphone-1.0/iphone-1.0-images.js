/*
 * @author paper
 */

var imagesShow=(function(){
	var fn=function(){
		if(!BJ('#iphoneImageShow'))
			BJ('iphoneWindow').append('<div style="display:none;" id="iphoneImageShow"></div>');
		
		BJ('iphoneMain').find('.images-list li').bind('click',function(){
			var that=this;
			
			BJ('#iphoneImageShow').innerHTML=that.innerHTML;
			
			BJ('iphoneLightbox').css({
				opacity:0.95
			});
			BJ('iphoneLightbox').fIn('fast');
			BJ('iphoneImageShow').fIn('fast');
			
			
			BJ('iphoneImageShow').bind('click',function(){
				BJ(this.firstChild).remove();
				
				BJ('iphoneImageShow').hide();
				BJ('iphoneLightbox').fOut('fast',function(){
					BJ(this).css({
						opacity:0
					});
				});
			});
		});
	};
	
	return fn;
})();
imagesShow();
