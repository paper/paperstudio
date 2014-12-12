/*
 * @author paper
 */

//menu 的切换函数
function show_menu(menu_name){
	var num=parseInt(menu_name.charAt(menu_name.length-1)),
		menu_ul=document.getElementById("menu_ul"),
		menu_ul_as=menu_ul.getElementsByTagName("a");
		
	for(var i=0,len=menu_ul_as.length;i<len;i++){
		menu_ul_as[i].className="";
	}
	BJ("container").children().hide();
	//alert(num);
	menu_ul_as[num-1].className="select";
	BJ("main"+num).show();
};

/*
 * 左边slider的关闭与展开的效果
 */
function open_and_close(self){
	var title_class=BJ(self).parent().attr("class").split(" ")[1];
	if(title_class=="open"){
		BJ(self).parent().attr("class","slider-block-title close");
		BJ(self).parent().next().hide();
	}else{
		BJ(self).parent().attr("class","slider-block-title open");
		BJ(self).parent().next().show();
	}
};

//点击左边的链接，右边显示内容
//@mainId 块的id
//@subName 内容的名字
function show_info_main(mainId,subName,self){
	//首先改变样式
	var temp_as=BJ(self).parent(5).get().getElementsByTagName("a");
	var len=temp_as.length;
	for(var i=0;i<len;i++){
		temp_as[i].className="";
	}
	self.className="select";
	
	//改变内容
	document.getElementById(mainId+"-title").innerHTML=subName;		//改变标题
	var infos=BJ(mainId+"-info").children().get();
	for(var i=0,len=infos.length;i<len;i++){
		infos[i].style.display="none";
	}
	BJ("#"+mainId+"-"+subName).style.display="block";
};