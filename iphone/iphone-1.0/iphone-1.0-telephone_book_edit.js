/*
 * @author paper
 */
var telephoneBookEdit=(function(){
	var telephoneNumber=BJ('telephoneNumber'),
		telephoneNumberInput=BJ('telephoneNumberInput'),
		telephoneState=BJ('telephoneState'),
		key=false,
		
		telephoneName=BJ('telephoneName'),
		telephoneNameInput=BJ('telephoneNameInput'),
		telephoneNameState=BJ('telephoneNameState'),
		keyName=false,
		
		fn=function(){
			BJ('#telephoneChangeBt').onclick=function(){
				var that=this,
					rel=that.getAttribute('rel');
					
				if(that.innerHTML=='Edit'){
					if(key) return;
					
					that.innerHTML='Ok';
					
					BJ('#telephoneNumberInput').value=BJ('#telephoneNumber').innerHTML;
					
					telephoneNumber.hide();
					telephoneNumberInput.show();
					
					key=true;
					
				}else if(that.innerHTML=='Ok'){
					telephoneState.removeClass();
					telephoneState.addClass('loading-icon fr');
					
					setTimeout(function(){
						var reg=/^(\d){11}$/;
						
						if(reg.test(BJ('#telephoneNumberInput').value)){
							that.innerHTML='Edit';
							
							var v=BJ('#telephoneNumberInput').value;
							
							BJ('#telephoneNumber').innerHTML=v;
							BJ('#'+rel+'_number').innerHTML=v;
							
							
							var n=rel+'_number';
							Iphone.localStorage.setItem(n,v);
							
							telephoneNumber.show();
							telephoneNumberInput.hide();
							
							telephoneState.removeClass();
							telephoneState.addClass('ok-icon fr');
						}else{
							telephoneState.removeClass();
							telephoneState.addClass('error-icon fr');
							
							return false;
						}
						
						key=false;
					},300);
				}
			};
			
			BJ('#telephoneChangeNameBt').onclick=function(){
				var that=this,
					rel=that.getAttribute('rel');
					
				if(that.innerHTML=='Edit'){
					if(keyName) return;
					
					that.innerHTML='Ok';
					
					BJ('#telephoneNameInput').value=BJ('#telephoneName').innerHTML;
					
					telephoneName.hide();
					telephoneNameInput.show();
					
					keyName=true;
					
				}else if(that.innerHTML=='Ok'){
					telephoneNameState.removeClass();
					telephoneNameState.addClass('loading-icon fr');
					
					setTimeout(function(){
						var reg=/^(\S)+$/;
						
						if(reg.test(BJ('#telephoneNameInput').value)){
							that.innerHTML='Edit';
							
							var v=BJ('#telephoneNameInput').value;
							
							BJ('#telephoneName').innerHTML=v;
							BJ('#'+rel+'_name').innerHTML=v;
							
							try {
								var n=rel+'_name';
								Iphone.localStorage.setItem(n,v);
							}catch(e){}
							
							telephoneName.show();
							telephoneNameInput.hide();
							
							telephoneNameState.removeClass();
							telephoneNameState.addClass('ok-icon fr');
						}else{
							telephoneNameState.removeClass();
							telephoneNameState.addClass('error-icon fr');
							
							return false;
						}
						
						keyName=false;
					},300);
				}
			};
	};
	
	return fn;
})();
telephoneBookEdit();