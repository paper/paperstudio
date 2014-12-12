/*
 * @author paper
 */

var AjaxPage=(function(){
	function asynInnerHTML(HTML,doingCallback,endCallback){
		var temp = document.createElement('div'), 
			frag = document.createDocumentFragment();
		temp.innerHTML = HTML;
		(function(){
			if (temp.firstChild) {
				frag.appendChild(temp.firstChild);
				if(doingCallback) doingCallback(frag);
				setTimeout(arguments.callee, 0);
			}
			else {
				if(endCallback) endCallback(frag);
			}
		})();
	};
	
	return function(obj,callback){
		var pageId=obj.pageId,
			curNum=obj.curNum,
			maxNum=obj.maxNum,
			url,
			para=obj.para || 'pageindex';
		
		if(obj.url && obj.url!='javascript:;'){
			url=obj.url+'?'+para+'=';
		}else{
			url='javascript:;'
		}
		
		var page=typeof pageId=='string'?document.getElementById(pageId):pageId;
		
		//把新生产的翻页代码，放到pid里面
		var sPrev='',
			sNext='',
			sResult='',
			sp='',
			sn='',
			sCur='<em>'+curNum+'</em>',
			gd='<span>...</span>';
		
		if(curNum==1){
			sPrev='<span>上一页</span>';
		}else{
			var prevNum=curNum-1;
			sPrev='<a href="'+url+prevNum+'">上一页</a>';
		}
		
		if(curNum==maxNum){
			sNext='<span>下一页</span>';
		}else{
			var nextNum=curNum+1;
			sNext='<a href="'+url+nextNum+'">下一页</a>';
		}
		
		if(maxNum<=6){
			for(var i=1;i<curNum;i++){
				sp+='<a href="'+url+i+'">'+i+'</a>';
			}
			
			for(var i=curNum+1;i<=maxNum;i++){
				sn+='<a href="'+url+i+'">'+i+'</a>';
			}
			
			sResult=sPrev+sp+sCur+sn+sNext;
		}else{
			if (curNum <= 4) {
				for (var i = 1; i < curNum; i++) {
					sp += '<a href="'+url+i+'">' + i + '</a>';
				}

				for (var i = curNum + 1; i <= 5; i++) {
					sn += '<a href="'+url+i+'">' + i + '</a>';
				}
				
				sNext='<a href="'+url+maxNum+'">' + maxNum + '</a>'+sNext;
				
				sResult=sPrev+sp+sCur+sn+gd+sNext;
			}else{
				sPrev=sPrev+'<a href="'+url+1+'">' + 1 + '</a>';
				
				if(curNum<maxNum-3){
					for (var i = curNum-2; i < curNum; i++) {
						sp += '<a href="'+url+i+'">' + i + '</a>';
					}
				
					for (var i = curNum + 1; i <= curNum+2; i++) {
						sn += '<a href="'+url+i+'">' + i + '</a>';
					}
					
					sNext='<a href="'+url+maxNum+'">' + maxNum + '</a>'+sNext;
					
					sResult=sPrev+gd+sp+sCur+sn+gd+sNext;
				}else{
					for (var i = maxNum-4; i < curNum; i++) {
						sp += '<a href="'+url+i+'">' + i + '</a>';
					}
					
					for (var i = curNum + 1; i <= maxNum; i++) {
						sn += '<a href="'+url+i+'">' + i + '</a>';
					}
					
					sResult=sPrev+gd+sp+sCur+sn+sNext;
				}
			}
		}
		
		page.innerHTML='';
		
		asynInnerHTML(sResult,function(f){
			page.appendChild(f);
		},function(){
			if(callback)callback();
		});
	};
})();
