/*
 * @author paper
 */

//IE 图片缓存问题
BJ.ieImage();

//云的移动函数
var Cloud=(function(){
	var wrapper=document.getElementById("wrapper"),
	
		x=0,
		
		time=null,
		
		cloudMove=function(){
			time=setInterval(function(){
				wrapper.style.backgroundPosition=x+"px 0";
				x+=1;
			},50);
		};
	
	return cloudMove;
})();
Cloud();

//IE6 的警告
var warnIE6=function(){
	if (BJ.isIE(6)) {
		if (!BJ.getCookie("warningIE6")) {
			BJ("warningIE6").show()
		}
		else {
			BJ("warningIE6").remove();
		}
	}else{
		BJ("warningIE6").remove();
	}
};
warnIE6();

//关闭警告，而且不再提示
var closeWarning=function(){
	BJ("warningIE6").remove();
	BJ.setCookie("warningIE6","close");
};
