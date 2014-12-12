/*
 * @author paper
 */
var ajaxSuggestion=(function(){
	var	fn=function(inputId,suggestId,url){		
			var input_width=BJ(inputId).getElemHeightWidth().width,
				input_height=BJ(inputId).getElemHeightWidth().height,
				input_dom=BJ('#'+inputId),
				keyboard_up=38,
				keyboard_down=40,
				keyboard_left=37,
				keyboard_right=39,
				
				//为了确定方向键的临时所处位置
				tempRel=-1,
				
				init=function(){
					BJ(suggestId).hide();
					BJ(suggestId).empty();
					
					tempRel=-1;
				},
				
				//input输入框的临时内容，用来确定，长度是否发生变化，如果发生变化就ajax请求
				tempValue='',
	
				//up->38 down->40
				checkKeyboard=function(){
					document.onkeydown=function(e){
						e=e || window.event;
						
						if(BJ(suggestId).css('display')=='none')return;
						
						var 
							//候选的个数，最大为10个
							$tds=BJ(suggestId).find('td'),
							tds=$tds.getElem(),
							len=tds.length;
				
						//如果点击了方向键的  下
						if(e.keyCode==keyboard_down){
							tempRel++;
							
							//BJ('#msg').innerHTML=tempRel;
							$tds.removeClass('active');
							
							if(tempRel>len-1){
								tempRel=0;
							}
							BJ(tds[tempRel]).addClass('active');
							tempValue=input_dom.value=BJ(tds[tempRel]).text();

						}
						//如果点击了方向键的  上
						else if(e.keyCode==keyboard_up){
							tempRel--;
							//BJ('#msg').innerHTML=tempRel;
							$tds.removeClass('active');
							
							if(tempRel<0){
								tempRel=len-1;
							}
							BJ(tds[tempRel]).addClass('active');
							tempValue=input_dom.value=BJ(tds[tempRel]).text();
						}
					};
				};
			
			BJ(suggestId).css({
				'width':input_width-2+'px',
				'top':input_height+'px'
			});
			
			checkKeyboard();

			BJ(inputId).bind({
				'focus':function(){
					//BJ(suggestId).show();
				},
				'keyup':function(e){
					var e=e || window.event;

					if(!/^(\s)*$/.test(input_dom.value) && 
						input_dom.value.length!==tempValue.length && 
						e.keyCode!==keyboard_down && 
						e.keyCode!==keyboard_up &&
						e.keyCode!==keyboard_left && 
						e.keyCode!==keyboard_right){
		
						tempValue=input_dom.value;
	
						BJ.ajax({
							url:'t.json',
							before:function(){},
							success:function(msg){
								init();
								
								if(msg==0){
									BJ(suggestId).hide();
									return;
								}
						
								var data=eval('('+msg+')'),
									r=data.result,
									html='<table><tr><td>'+r.join('</td></tr><tr><td>')+'</table>';
		
								BJ.asynInnerHTML(html,function(f){
									BJ(suggestId).append(f);
								},function(){
									BJ(suggestId).find('td').bind({
										'mouseover': function(){
											tempRel=-1;
											BJ(suggestId).find('td').removeClass('active');
											BJ(this).addClass('active');
										},
										'mouseout': function(){
											BJ(this).removeClass('active');
										},
										'mousedown':function(){
											input_dom.value=BJ(this).text();
										}
									});
									
									BJ(suggestId).show();
								});
							}
						});
					}else{
						//BJ(suggestId).hide();
					}
				},
				'blur':function(){
					BJ(suggestId).hide();
				}
			});//input bind
			
		};//fn
	
	return fn;
})();
ajaxSuggestion('kw','kw_ajax_suggestion');
