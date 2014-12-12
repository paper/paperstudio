/*
 * @author paper
 */
(function($){
	var ImageFocus=window.ImageFocus=(function(){
		var getId=function(id){
			return typeof id=='string'?document.getElementById(id):id;
		};
		
		return function(wrap,focus,forcode){
			var wrap=getId(wrap),
				$wrap=$(wrap),
				focus=getId(focus),
				$focus=$(focus),
				forcode=getId(forcode),
				$forcode=$(forcode),
				
				wrapHeightWidth=$wrap.getElemHeightWidth(),
				focusHeightWidth=$focus.getElemHeightWidth(),
				
				maxWidth=wrapHeightWidth.width,
				maxHeight=wrapHeightWidth.height,
				fWidth=focusHeightWidth.width,
				fHeight=focusHeightWidth.height,
				fWidthHalf=fWidth/2,
				fHeightHalf=fHeight/2,
				
				rangeWidth=maxWidth-fWidth,
				rangeHeight=maxHeight-fHeight;
	
			var setFocus=function(e){
				var mouse=$.getMouse(e),
					mouseX=mouse.x,
					mouseY=mouse.y,
					
					wrapPosition=$wrap.getPosition(),
					wrapLeft=wrapPosition.left,
					wrapTop=wrapPosition.top,
					
					x=mouseX-wrapLeft,
					y=mouseY-wrapTop;
				
				focus.style.left=x-fWidthHalf+'px';
				focus.style.top=y-fHeightHalf+'px';
				
				var curLeft=x-fWidthHalf,
					curTop=y-fHeightHalf;
				
				if(curLeft<0){
					focus.style.left=0;
					curLeft=0;
				}
				
				if(curTop<0){
					focus.style.top=0;
					curTop=0;
				}
				
				if(curLeft>rangeWidth){
					focus.style.left=rangeWidth+'px';
					curLeft=rangeWidth;
				}
				
				if(curTop>rangeHeight){
					focus.style.top=rangeHeight+'px';
					curTop=rangeHeight;
				}
				
				focus.style.backgroundPosition='-'+curLeft+'px -'+curTop+'px';
			};
			
			$forcode.hold({
				timeOut: 250,
				timeOn: 100,
				on: function(e){
					$focus.show();
				},
				
				out:function(){
					$focus.fOut('fast');
				},
				
				move:function(e){
					setFocus(e);
				}
			});
		};	
	})();
})(Fuee);