/*
 * @author paper
 */

var Slider=(function(){
	var asynInnerHTML=function(HTML,doingCallback,endCallback){
		var temp = document.createElement('div'), 
			frag = document.createDocumentFragment();
		temp.innerHTML = HTML;
		(function(){
			if (temp.firstChild) {
				frag.appendChild(temp.firstChild);
				doingCallback(frag);
				setTimeout(arguments.callee, 0);
			}
			else {
				if(endCallback)
					endCallback(frag);
			}
		})();
	};

	var fn=function(sliderId,obj){
		var obj=obj || {},
			html_X='<input type="hidden" name="'+sliderId+'_value" />'+
				'<div class="slider-point-x br5"></div>'+
				'<div class="slider-line-x br5 lineBg"></div>'+
				'<div class="slider-tip-x br5 bs5" style="display:none;">',
				
			//定义方向
			X=obj.onlyX || true;
			
			if(obj.onlyY){
				var Y=obj.onlyY;
				X=false;
			}
			
			if (X) {
				BJ(sliderId).empty();
				
				asynInnerHTML(html_X, function(f){
					BJ(sliderId).append(f);
				}, function(){
					bindPoint_X();
				});
			}else if(Y){
				asynInnerHTML(html_Y, function(f){
					BJ(sliderId).append(f);
				}, function(){
					bindPoint_Y();
				});
			}
	
		//横向运动函数	
		var bindPoint_X=function(){
			var sliderDom=BJ('#'+sliderId),
				sliderPoint=BJ(sliderId).find('.slider-point-x').getElem()[0],
				sliderLine=BJ(sliderId).find('.slider-line-x').getElem()[0],
				sliderTip=BJ(sliderId).find('.slider-tip-x').getElem()[0],
				sliderInput=BJ(sliderId).find('input').getElem()[0],
				
				sliderPointWidth=parseInt(BJ(sliderPoint).css('width')),
				sliderLineWidth=parseInt(BJ(sliderDom).css('width')),
				
				min=0,
				max=sliderLineWidth-sliderPointWidth,
				//callback的参数
				callbackPara={};
			
			//设置初始化的位置
			if(obj.initPercent){
				BJ(sliderPoint).css({
					'left':max*obj.initPercent/100+'px'
				});
				
				//input的值也要变化 and tip
				sliderInput.value=sliderTip.innerHTML=obj.initPercent;
			}else{
				BJ(sliderPoint).css({
					'left':'0'
				});
				
				//input的值也要变化 and tip
				sliderInput.value=sliderTip.innerHTML=0;
			}
			
			if(obj.tipShow){
				var l=parseInt(sliderPoint.style.left),
					sliderTipWidth=parseInt(BJ(sliderTip).getElemHeightWidth().width),
					tip=sliderPointWidth/2-sliderTipWidth/2;
					
				sliderTip.style.left=l+tip+'px';
				BJ(sliderTip).show();
			} 
			
			//绑定point drag	
			BJ.drag({
				node:sliderPoint,
				onlyX:X,
				mousemove:function(){
					var that=this,
						//鼠标对于的位置与距离
						cLeft=that.cLeft,
						//point的真正位置
						l=parseInt(that.style.left),
						x=Math.ceil(100*l/max),
						sliderTipWidth=parseInt(BJ(sliderTip).getElemHeightWidth().width),
						//tip-point的居中差值
						tip=sliderPointWidth/2-sliderTipWidth/2;
					
					//以step分段移动
					if (obj.step) {
						that.lock = true;
						
						if(cLeft<=0){
							cLeft=0;
						}else if(cLeft>=max){
							cLeft=max;
						}
						var tipTemp=Math.ceil(100*cLeft/max);
					
						
						if (cLeft <= min) {
							that.style.left = min + 'px';
						}
						else if (cLeft >= max) {
							that.style.left = max + 'px';
						}
						
						if(tipTemp%obj.step==0){
							that.style.left = cLeft + 'px';
						}
					}
					else {
						if (cLeft <= min) {
							that.style.left = min + 'px';
							that.lock = true;
						}
						else if (cLeft >= max) {
							that.style.left = max + 'px';
							that.lock = true;
						}else{
							that.lock = false;
						}
					}
					
					//tip and input
					BJ(sliderTip).show();
					sliderTip.style.left=l+tip+'px';
					sliderInput.value=sliderTip.innerHTML=x;
					
					callbackPara={
						'sliderInput':sliderInput,
						'sliderTip':sliderTip,
						'x':x
					};
					
					if(obj.mousemove){
						obj.mousemove.call(that,callbackPara);
					}
				},
				mouseup:function(){
					if(!obj.tipShow) BJ(sliderTip).hide();
					
					if(obj.mouseup){
						obj.mouseup.call(that,callbackPara);
					}
				}
			});
		}//bindPoint_X	
	};//fn
	
	return fn;
})();
