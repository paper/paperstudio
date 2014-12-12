/*
 * @author paper
 */
var codeLine=(function(){
	var keyword='break,delete,function,return,typeof,case,do,'+
				'if,switch,var,catch,else,in,this,void,continue,'+
				'false,instanceof,throw,while,debugger,finally,new,'+
				'true,with,default,for,null,try',
		
		$=function(id){
			return document.getElementById(id);
		},

		tempMain,
		
		code_main=$('code_main');
		
		keyword_r=keyword.split(',');
		
	return function(){		
		tempMain=$('code_textarea').value.replace(/\n+|\r+/g,"");
		
		if(tempMain=='') return;
		
		//判断缩进
		//首先把格式弄好
		var //缩进数
			wei=0,
			//行数
			line=1;
		
		//tempMain=tempMain.replace(/\{|\}|\<|(?!for\((.)*?);(?!(.)*?\))/g,function(w){
		//tempMain=tempMain.replace(/\{|\}|\<|;(?!(\s)*\})|(for);/g,function(w){
		//ace(/\{|\}(?!(\s)*\,|;)|\<|\,(?!(\w|\,)*?\))|;(?!(\s)*\}|(\w)+\<|(\w)+\>|(\w)+\+\+\)|(\w)+\-\-\))/g,fun
		tempMain=tempMain.replace(/\{|\}|\<|;(?!(\s)*\}|(\w)+\<|(\w)+\>|(\w)+\+\+\)|(\w)+\-\-\))/g,function(w){
			if(w==';' || w==','){
				line++;
				
				var space='';
				for(var i=0;i<wei;i++){
					space+='&nbsp;&nbsp;&nbsp;';
				}
				
				return w=w+'<br /><span class="l">'+line+'</span>'+space;
			}
						
			if(w=='<'){
				return w='&lt;';
			}
		
			if(w=='{'){
				line++;
				
				wei++;
				var space='';
				for(var i=0;i<wei;i++){
					space+='&nbsp;&nbsp;&nbsp;';
				}
				
				return w=w+'<br /><span class="l">'+line+'</span>'+space;
				
			}else if(w=='}'){
				line++;
				
				wei--;
				var space='';
				for(var i=0;i<wei;i++){
					space+='&nbsp;&nbsp;&nbsp;';
				}
				
				return w='<br /><span class="l">'+(line-1)+'</span>'+space+w;
			}

		});
		
		var k='';
		for (var i = 0, len = keyword_r.length; i < len; i++) {
			if(i==len-1){
				k+='\\b'+keyword_r[i]+'\\b';
			}else{
				k+='\\b'+keyword_r[i]+'\\b|';
			}
		};
		var reg=new RegExp(k,'g');
		
		//处理注释
		tempMain=tempMain.replace(/\/\*(.)*?\*\//g,'<span class="z">$&</span>');
		//处理string高亮
		tempMain=tempMain.replace(/\'(.)*?\'/g,'<span class="s">$&</span>');
		//先处理关键字高亮
		tempMain=tempMain.replace(reg,'<span class="k">$&</span>');
		//处理符号高亮
		tempMain=tempMain.replace(/\(|\)|\,|\[|\]|\!\=|\!\!|\!|\?|\:|\-\-|\+\+|\+|\&\&|\=\=|\|\||\|/g,
		'<span class="f">$&</span>');
		
		code_main.innerHTML=tempMain;
	};
})();
