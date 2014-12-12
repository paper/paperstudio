/*
 * @author paper
 */
var toggleBlockMain=(function(){
	var toggle=function(name,bt){
		var all=document.getElementById(name);
		
		BJ(all).css("display")=="none"?
			BJ(all).sDown("fast",function(){
				bt.innerHTML='&laquo; Hide more';
			}):
			BJ(all).sUp("fast",function(){
				bt.innerHTML='Read more &raquo;';
			});
	};
	
	return toggle;
})();
