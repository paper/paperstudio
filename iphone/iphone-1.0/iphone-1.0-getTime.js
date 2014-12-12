/*
 * @author paper
 */
var IphoneGetTime=(function(){
	var timeNow=null,
		iphone_clock_getTime=document.getElementById('iphone_clock_getTime');
		
		setTimeout(function(){
			BJ('iphone_clock_getTime').removeClass('loading-icon');
		},1000);
		
		fn=function(){
			timeNow=setInterval(function(){
				var data=new Date(),
				Y=data.getFullYear(),
				M=data.getMonth()+1,
				D=data.getDate(),
				
				h=data.getHours(),
				m=data.getMinutes(),
				s=data.getSeconds();
			
				M=M>9?M:'0'+M;
				D=D>9?D:'0'+D;	
				h=h>9?h:'0'+h;
				m=m>9?m:'0'+m;
				s=s>9?s:'0'+s;
				
				iphone_clock_getTime.innerHTML=Y+'-'+M+'-'+D+' '+h+':'+m+':'+s;
			},1000);
		};
		
	return fn;
})();
IphoneGetTime();
