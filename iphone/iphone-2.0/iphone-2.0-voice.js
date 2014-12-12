/*
 * @author paper
 */
var changeVoice=(function(){
	//alert(localStorage.foo);
	
	var voiceChangeLineHover = BJ('#voiceChangeLineHover'), 
		voiceChangeNumber = BJ('#voiceChangeNumber'),
		
		fn = function(){
			if (voiceChangeLineHover) {
				var min = 0, 
					max = 250, 
					step = 10,
					w=max-min;
				
				//读出cookie
				if(BJ.getCookie('iphone_voice_nowVoice')){
					voiceChangeNumber.innerHTML=BJ.getCookie('iphone_voice_nowVoice');
					BJ('#voiceChangeBt').style.left=BJ.getCookie('iphone_voice_voiceChangeBt')+'px';
					BJ('#voiceChangeLineHover').style.width=parseInt(BJ.getCookie('iphone_voice_voiceChangeBt'))+step+'px';
				}
				
				BJ.drag({
					node: 'voiceChangeBt',
					onlyX: true,
					mousemove: function(){
						var that = this, 
							l = parseInt(that.style.left);
						
						if (l < min) {
							that.style.left = min + 'px';
							l=min;
						}
						
						if (l > max) {
							that.style.left = max + 'px';
							l=max;
						}
							
						BJ('voiceChangeState').removeClass();
						BJ('voiceChangeState').addClass('loading-icon fr');
						
						voiceChangeLineHover.style.width = l + step + 'px';
						voiceChangeNumber.innerHTML = Math.floor(l * 100 / w);
	
					},
					mouseup:function(){
						var nowVoice=parseInt(voiceChangeNumber.innerHTML),
							l=parseInt(this.style.left);
							
						Iphone.playSound('iphoneSound_voiceTest');
						BJ('#iphoneSound_voiceTest').volume=nowVoice/100;
						
						//写进cookie
						BJ.setCookie('iphone_voice_nowVoice',nowVoice);
						BJ.setCookie('iphone_voice_voiceChangeBt',l);
						
						BJ('voiceChangeState').removeClass();
						BJ('voiceChangeState').addClass('ok-icon fr');
					}
				});
			}
		};
	
	return fn;
})();
changeVoice();
