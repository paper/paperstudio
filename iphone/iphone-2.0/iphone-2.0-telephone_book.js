/*
 * @author paper
 */
var telephoneBook=(function(){
	var fn=function(){
		//读取修改号码的数据
		try{
			for(var i=0;i<=5;i++){
			if(!!Iphone.localStorage.get('tele'+i+'_number'))
				BJ('#tele'+i+'_number').innerHTML=Iphone.localStorage.get('tele'+i+'_number');
			
			if(!!Iphone.localStorage.get('tele'+i+'_name'))
				BJ('#tele'+i+'_name').innerHTML=Iphone.localStorage.get('tele'+i+'_name');
			}
		}catch(e){}
		
		BJ('iphoneMain_telephone_book').find('.telephone-list').bind('click',function(){
		
		var that=this,
			oh4=BJ(that).find('h4').get(),
			oimg=BJ(that).find('img').get(),
			oname=BJ(that).find('.name').get(),
			onumber=BJ(that).find('.number').get(),
			rel=that.getAttribute('rel'),
			
			html='<div id="iphoneMain_telephone_book_'+oname.text()+'" class="block">'+
								'<ul class="iphone-list iphone-list-noMiniArrow">'+
									'<li class="one">'+
										'<img src="'+oimg.attr("src")+'" class="face" />'+
										'<h3 id="iphoneMain_telephone_book_h3">'+oname.text()+'</h3>'+
										
										'<div class="pdt10 clear">'+
											'<div class="mt mb10 fb">'+
												'修改名字'+
												'<span id="telephoneNameState" class="fr"></span>'+
											'</div>'+
											
											'<span class="fb f14" id="telephoneName">'+oname.text()+'</span>'+
											'<input style="display:none;" id="telephoneNameInput" type="text" value="'+oname.text()+'" class="iphone-inputText" />'+
											'<a href="javascript:;" class="bt fr" id="telephoneChangeNameBt" rel='+rel+'>Edit</a>'+
										'</div>'+
										
										'<div class="pdt10 clear">'+
											'<div class="mt mb10 fb">'+
												'修改号码'+
												'<span id="telephoneState" class="fr"></span>'+
											'</div>'+
											
											'<span class="fb f14" id="telephoneNumber">'+onumber.text()+'</span>'+
											'<input style="display:none;" id="telephoneNumberInput" type="text" value="'+onumber.text()+'" class="iphone-inputText" />'+
											'<a href="javascript:;" class="bt fr" id="telephoneChangeBt" rel='+rel+'>Edit</a>'+
										'</div>'+
									'</li>'+
								'</ul>'+
							'</div>';
		
			Iphone.showLightbox();
			oh4.addClass('loading');	
			
			setTimeout(function(){
				Iphone.hideLightbox();
				oh4.removeClass('loading');
									
					//首先移除后面所有的兄弟
					Iphone.removeNextsiblings('iphoneMain_telephone_book');
					
					Iphone.iphoneInnerHTML(html,function(f){
						BJ('iphoneMainIn').append(f);
					},function(){
						Iphone.createJS('iphone-2.0-telephone_book_edit.js');
						Iphone.moving('right');
					});
	
			},300);			
		});
	};
	
	return fn;
})();
telephoneBook();
