/*
 * @author paper
 * 
 * version 2.0
 * 1) 算法优化	特别鸣谢：我的大学好友 -- 邓成芳同学
 * 2) 页面优化
 * 3）代码优化
 * 4) 添加双击数字，打开周围格子的功能
 * 
 * 说明：并没有写动态生成表格，动态改变地雷个数等等。
 * 		如果有这个必要的话，会在3.0版本中完成 。
 * 
 * [2010-3-11]修正了双击后，不能提示游戏通过的bug
 */

var bjDilei=(function(){
	var 
		//10行
		maxHeight=10,
		//20列
		maxWidth=20,
		//地雷个数
		dileiCount=30,
		//总的格子数目,10行20列 
		block=maxHeight*maxWidth,
		//不是地雷的个数
		otherCount=block-dileiCount,
		//table的id
		tableId="dilei-table",
		
		//设置下标，把数字转换为2长度的下标:4->"04",15->"15"
		numberToString=function(num){
			if(num>=10){
				return num.toString();
			}
			
			if(num<10 && num>=0){
				return "0"+num.toString();
			}
			
			if(num<0) return false;
		},
		
		//长度为2的下标，又转化为数字:"09"->9,"12"->12
		stringToNumber=function(s){
			var s1=s.charAt(0),
				s2=s.charAt(1);
		
			return parseInt(s1)*10+parseInt(s2);
		},
		
		//生成随机的两个数字的字符串
		//@maxWidth 横着过去的格子数目(列)，@maxHeight 竖着过去的格子数目(行)
		createRandomXY=function(maxWidth,maxHeight){
			//生成 0  -  (max-1)  
			//假设是10, 20	那个就是生成 0000-1909  10行20列
			var m=maxWidth-1,
				n=maxHeight-1;
			if(m<=1 || n<=1) return false;
			
			var	x=parseInt( Math.random()*m ),	//00-19
				y=parseInt( Math.random()*n );	//00-09
			
			return numberToString(x)+numberToString(y);
		},
		
		//得到一个对象的属性的长度
		getObjectLength=function(obj){
			var l=0;
			for(var i in obj){
				l++;
			}
			
			return l;
		},
		
		//随机生成地雷
		//@num 表示地雷的个数 
		//@maxWidth (列)，@maxHeight (行)
		/*	比如: dilei={
		 * 		"0408":"0408",
		 *		"0203":"0203"
		 *  }
		 *       
		 *  0408就是对应坐标系统的X和Y坐标,分别是04，08
		 *  0203就是对应坐标系统的X和Y坐标,分别是02，03
		 */
		createDilei=function(num,maxWidth,maxHeight){
			var o={};		//存放雷的对象
			
			//利用对象属性是不重复的原理
			while(getObjectLength(o)<num){
				var i=createRandomXY(maxWidth,maxHeight);
				o[i]=i;
			}
			
			return o;
		},
		
		//得到对象的下标集合
		getObjectAttr=function(o){
			var r=[];
			
			for(var i in o){
				r.push(i);
			}
			
			return r;
		},
		
		//得到对象的值集合
		getObjectValue=function(o){
			var r=[];
			
			for(var i in o){
				r.push(o[i]);
			}
			
			return r;
		},
		
		/* 把td都对象化 
		 * 通过下标来得到td的位置
		 *  tdo={
		 *  	"0000":dom,
		 *  	"1206":dom,	//06行，12列的td
		 *  	......
		 *  }
		 *  
		 *  直接用tds["1206"]来得到它的DOM，这样也对应了前面的地雷的位置
		 */
		getTdDom=function(tableId){
			var tdo={};
				table=document.getElementById(tableId),
				trs=table.getElementsByTagName("tr");
			
			for(var i=0,l=trs.length;i<l;i++){					//i 表示height,行(y)
				var tbsTemp=trs[i].getElementsByTagName("td");
				
				for (var j = 0, len = tbsTemp.length; j < len; j++) { //j 表示width，列(x)
					var ji = numberToString(j) + numberToString(i);
					tdo[ji] = tbsTemp[j];
					
					//把每个td进行标记
					//为了使得点击td的时候，知道它的位置
					tbsTemp[j].setAttribute("zuobiao", ji);
				}
			}
			
			return tdo;
		},
		
		//s 表示td对象的下标，来获取它周围的td下标集合
		getAroundTd=function(s,maxWidth,maxHeight){
			var r=[];
			
			//得到原先的下标的数字形式
			var x=stringToNumber(s.slice(0,2)),
				y=stringToNumber(s.slice(2,4)),
			
				xDel=numberToString(x-1),
				xAdd=numberToString(x+1),
				
				yDel=numberToString(y-1),
				yAdd=numberToString(y+1);
			
			//上面的
			if (yDel!==false) {
				//左上
				if (xDel!==false) {
					r.push(xDel + yDel);
				}
				
				//上
				r.push(numberToString(x) + yDel);
				
				//右上
				if (stringToNumber(xAdd)<maxWidth) {
					r.push(xAdd + yDel);
				}
			}
			//左边的
			if(xDel!==false){
				r.push(xDel+numberToString(y));
			}
			
			//右边
			if(stringToNumber(xAdd)<maxWidth){
				r.push(xAdd+numberToString(y));
			}
			
			//下面的
			if(stringToNumber(yAdd)<maxHeight){
				//左下
				if(xDel!==false){
					r.push(xDel+yAdd);
				}
				
				//下
				r.push(numberToString(x)+yAdd);
				
				//右下
				if(stringToNumber(xAdd)<maxWidth){
					r.push(xAdd+yAdd);
				}
			}

			return r;
		},
		
		//事件
		//如果td是空的，就把它周围的没有打开的td都打开
		//要是打开的周围也有空白的，就继续打开那个空白周围的（递归调用）
		//它是打开空白周围的td，不包括自己
		openEmpty = function(td, maxWidth, maxHeight, tdo){
			if (td.innerHTML == "") {
				//点击了空白，就要打开周围的全部空白
				var zuobiao = td.getAttribute("zuobiao"),
					emptyAround = getAroundTd(zuobiao, maxWidth, maxHeight);
				
				for (var i = 0; i < emptyAround.length; i++) {
					var tdNode = tdo[emptyAround[i]];
					
					if (tdNode.className!="empty" && tdNode.className!="sign") {
						openTd(tdNode);
						
						openEmpty(tdNode, maxWidth, maxHeight, tdo);
					}
				}
			}
		},
		
		//打开td
		//这里做一切的判断
		openTd=function(td){
			otherCount--;		//打开一个，数量减去1
			td.className="empty";
			if (td.innerHTML.indexOf("X") != -1) {
				alert("gameover!游戏结束，刷新页面重新开始");
				clearInterval(time);
				//location.reload();
			}
			if(td.innerHTML!=""){
				td.firstChild.style.display="inline";
			}
		},
		
		win=function(){
			if (dileiCount == 0 && otherCount == 0) {
				alert("恭喜！你赢了,刷新从新开始");
				clearInterval(time);
				return;
			}
		},
		
		//画地图。数字 ，地雷，空白
		drawMap=function(){
			var 
				//生成随机的地雷下标
				dilei=createDilei(dileiCount,maxWidth,maxHeight),	
				//得到td对象集合
				tdo=getTdDom(tableId);
			
			//地雷用X表示
			for(var i in dilei){
				tdo[i].innerHTML='<span style="display:none;">X</span>';
			}
			
			//画数字
			//首先复制一个tdo，然后设置它的值全部为0
			var tempTdo={};
			for(var i in tdo){
				tempTdo[i]=0;
			}
			
			//循环地雷，只要遇到是地雷，它的周围就加1
			for(var i in dilei){
				//首先获取它周围的td的下标地雷的个数，类型是数组
				var aroundTd = getAroundTd(i, maxWidth, maxHeight);
				for(var j=0,len=aroundTd.length;j<len;j++){
					tempTdo[aroundTd[j]]+=1;
				}
			}
			
			for(var i in tempTdo){
				//当周围不是0，而且不是地雷的情况下，就写出格子的数字
				if(tempTdo[i]!=0 && tdo[i].innerHTML.indexOf("X")==-1)
					tdo[i].innerHTML='<span style="display:none;">'+tempTdo[i]+'</span>';
			}
			
			//事件绑定
			for(var k in tdo){
				(function(i){
					tdo[i].onclick=function(){
						var _this=this;
						
						if(_this.className=="empty")return;

						openTd(_this);
						
						//点击到了空白的框，或者点击了只带有标记的框
						if (_this.innerHTML=="") {	
							openEmpty(_this, maxWidth, maxHeight, tdo);
						}
						
						win();
					};
					
					//双击打开数字的格子，如果周围标记了，就不打开。如果附近有地雷，就炸死他，如果附近有空白，就调用openEmpty
					tdo[i].ondblclick=function(e){
						var _this=this;
						
						if(_this.className=="empty" && _this.innerHTML!=""){
							var t=getAroundTd(_this.getAttribute("zuobiao"),maxWidth,maxHeight);
							for(var i=0,len=t.length;i<len;i++){
								var node=tdo[t[i]];
								
								if (node.className == "sign" || node.className=="empty") {
									continue;
								}
								else {
									//先打开
									openTd(node);
									
									if (node.innerHTML == "") {
										//打开周围
										openEmpty(node, maxWidth, maxHeight, tdo);
									}
								}

							}//for
							
							win();
						}
					};
				})(k);
			}
		};
		
		//计时
		var time=null;
		function getTime(){
			var h = document.getElementById("h"), //小时
 				m = document.getElementById("m"), //分钟
 				s = document.getElementById("s"); //秒
 				
			var cn = function(n){
				if (n == 0) {
					return "00";
				}
				
				if (n < 10) {
					return "0" + n.toString();
				}
				
				if (n >= 10) {
					return n.toString();
				}
			};
			
			var parseSeconed = function(s){
				var hh = parseInt(s / 3600), mm = parseInt((s - (hh * 3600)) / 60), ss = s - (hh * 3600) - mm * 60;
				
				return {
					h: hh,
					m: mm,
					s: ss
				}
			}
			
			var b = 0;
			
			time = setInterval(function(){
				b++;
				var ps = parseSeconed(b);
				
				h.innerHTML = cn(ps.h);
				m.innerHTML = cn(ps.m);
				s.innerHTML = cn(ps.s);
				
			}, 1000);
		};
		
		//右击事件
		var biaojisum=0;
		document.getElementById(tableId).oncontextmenu=function (e){
			e=e?e:window.event;
			var t=e.srcElement ? e.srcElement:e.target; 
			
			if(t.nodeName.toString().toLowerCase()=="td"){
				//标记 格子
				if(t.className==""){
					t.className="sign";
					
					biaojisum++;
					document.getElementById("biaojisum").innerHTML=biaojisum;
					
					if(t.innerHTML.indexOf("X")!=-1){
						dileiCount--;
					}
				}
				
				//取消 标记
				else if(t.className=="sign"){
					t.className="";
					
					biaojisum--;
					document.getElementById("biaojisum").innerHTML=biaojisum;
					
					if(t.innerHTML.indexOf("X")!=-1){
						dileiCount++;
					}
				}
			}
		
			win();
			
		    return false;
		};
		
		getTime();
				
		return drawMap;
})();

bjDilei();
