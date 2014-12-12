/*
 * @author paper
 * 
 * 目前不使用minus2了，觉得没有必要
 */

/*==========================================
 * 关卡原始数据
 ===========================================*/
var motion={
	"02":"wall",
	"12":"wall","17":"wall",
	"27":"wall"
};
var pathway={
	"00":"wall","01":"wall","02":"wall","03":"wall","07":"wall","08":"wall","09":"wall",
	"12":"wall","15":"wall","17":"wall",
	"20":"wall","24":"wall","25":"wall","29":"wall"
};
var wrap={
	"02":"wall","07":"wall",
	"12":"wall","13":"wall","14":"wall","15":"wall","16":"wall","17":"wall",
	"24":"wall","25":"wall"
};
var surprise={
	"04":"up1","05":"up1","07":"up1",
	"12":"up1","17":"up1",
	"22":"up1","24":"up1","25":"up1"
};
var going_up={
	"01":"wall","05":"wall","09":"wall",
	"11":"wall","12":"up1","13":"wall","14":"up1","17":"wall","18":"up1",
	"22":"up1","23":"wall","24":"up1","25":"wall","26":"wall","27":"wall","28":"up1","29":"wall"
};
var phase={
	"04":"up1","05":"wall",
	"12":"up1","13":"wall","14":"up1","17":"up1","18":"wall",
	"21":"wall","22":"up1","26":"up1","27":"up1","28":"wall","29":"wall"
};
var weave={
	"02":"down1","04":"down1","06":"wall","08":"down1",
	"11":"up1","12":"down1","13":"wall","14":"down1","15":"up1","16":"wall","17":"up1","18":"down1",
	"21":"up1","23":"wall","25":"up1","27":"up1"
};
var lock={
	"00":"wall","01":"down1","04":"up1","05":"wall","06":"down1","09":"wall",
	"12":"up1","13":"down1","14":"up1","15":"down1","16":"down1","17":"wall","18":"up1",
	"20":"wall","21":"wall","22":"wall","23":"down1","27":"up1","28":"up1","29":"wall"
};
var bridge={
	"01":"down1","03":"up1","04":"wall","05":"wall","06":"down1","08":"up1",
	"11":"down1","12":"up1","13":"up1","14":"up1","15":"down1","16":"down1","17":"down1","18":"up1",
	"22":"wall","27":"wall"
};
var flash={
	"02":"wall","04":"wall","06":"minus","09":"wall",
	"12":"minus","14":"wall","16":"wall","17":"minus","18":"minus",
	"22":"wall","24":"minus","26":"wall","29":"wall"
};
var deception={
	"01":"wall","03":"minus","05":"up1","07":"wall","09":"wall",
	"11":"minus","12":"up1","13":"wall","14":"down1","15":"up1","16":"wall","17":"minus","18":"down1",
	"21":"wall","23":"minus","24":"down1","25":"wall","26":"minus","27":"minus","28":"down1","28":"wall"
};
var sidestep={
	"00":"wall","01":"up1","02":"minus","03":"wall","04":"up1","05":"minus","06":"up1","07":"wall","09":"wall",
	"11":"minus","14":"minus","16":"minus","18":"down1",
	"21":"up1","22":"minus","23":"wall","24":"up1","25":"minus","27":"wall","28":"down1","29":"wall"
};
var offbeat={
	"03":"air","04":"minus","06":"minus","07":"air",
	"12":"minus","13":"air","15":"air","16":"minus",
	"22":"minus","24":"minus","25":"air","27":"air"
};
var hurdle={
	"01":"air","03":"minus","05":"wall","09":"wall",
	"11":"wall","12":"down1","13":"minus","14":"up1","15":"wall","16":"down1","17":"up1","18":"wall",
	"21":"wall","22":"down1","23":"wall","24":"air","26":"air","27":"wall","28":"minus"
};
var backdoor={
	"01":"wall","02":"minus","03":"minus","05":"wall","07":"up1","09":"minus",
	"11":"wall","12":"up1","13":"wall","14":"air","15":"up1","16":"down1","17":"wall","18":"wall",
	"21":"air","22":"air","23":"wall","24":"air","25":"up1","26":"air","27":"up1","29":"minus"
};
var axis={
	"03":"wall","05":"up2","06":"wall","09":"wall",
	"11":"wall","12":"up2","14":"down1","15":"up2",
	"21":"wall","24":"down1","26":"wall","27":"up2","28":"up2","29":"wall"
};
var sweep={
	"01":"wall","02":"up2","03":"up2","04":"up2","05":"up2","06":"up2","07":"up2","08":"up2","09":"wall",
	"17":"up1",
	"21":"wall","23":"minus","25":"down1","27":"up1","29":"wall"
};
var gate={
	"03":"wall","04":"wall","06":"up2","07":"minus",
	"11":"wall","12":"up2","13":"wall","15":"down1","16":"up2","17":"up1","18":"up2",
	"21":"wall","23":"minus","25":"down1","27":"up1","28":"up2","29":"wall"
};
var unzip={
	"02":"up2","03":"down2","04":"up1","05":"down1","06":"up2","07":"down2",

	"22":"up2","23":"down2","24":"up1","25":"down1","26":"up2","27":"down2"
};
var twins={
	"01":"minus","02":"down2","04":"down1","05":"air","06":"up2","08":"up1","09":"wall",
	"11":"wall","12":"down2","13":"up2","14":"down1","15":"wall","16":"up2","17":"down2","18":"up1",
	"21":"air","23":"up2","25":"minus","27":"down2","29":"wall"
};
var machine={
	"00":"up1","02":"down1","04":"up1","06":"down1","08":"up1",
	"11":"wall","12":"down1","13":"up2","14":"wall","15":"wall","16":"down1","17":"up2","18":"wall",
	"20":"up1","21":"down2","22":"minus","24":"up1","25":"down2","26":"minus","28":"up1","29":"down2"
};
var reduction={
	"02":"dot","03":"x","05":"up1","06":"air","07":"wall",
	"13":"x","15":"dot","16":"down2","17":"down2","18":"x",
	"22":"dot","23":"x","25":"up1","27":"dot","28":"wall"
};
var lure={
	"02":"air","03":"down2","04":"up1","06":"dot","07":"wall","08":"wall",
	"11":"wall","12":"up2","13":"down2","14":"up1","15":"up2","16":"down2","17":"dot","18":"x",
	"22":"up2","23":"dot","24":"x","25":"up2","27":"wall","28":"wall"
};
var final_dance={
	"01":"up2","02":"dot","03":"x","05":"up2","06":"wall","07":"wall","08":"wall","09":"wall",
	"12":"down2","14":"minus","15":"air","16":"dot","17":"dot","18":"x",
	"21":"up2","22":"down2","24":"down2","26":"wall","27":"wall","28":"wall","29":"wall"
};

var missions_r=[motion,pathway,wrap,surprise,going_up,phase,weave,lock,bridge,flash,deception,sidestep,
								offbeat,hurdle,backdoor,axis,sweep,gate,unzip,twins,machine,reduction,lure,final_dance];
var missions_name_r=['motion','pathway','wrap','surprise','going up','phase','weave','lock','bridge','flash',
									'deception','sidestep','offbeat','hurdle','backdoor','axis','sweep','gate','unzip','twins',
									'machine','reduction','lure','final dance'];


// x方向的左边界，右边界，每个间隔的距离
var x_min_range=10;
var x_max_range=730;
var dx=80;

// y方向的3个值，每个间隔的距离
var y_top=10,y_middle=90,y_bottom=170;
var dy=80;

//cover , air 调整距离的长度
var dd=6;

//当前的关卡,后面会用“本地存储”来存储玩家的游戏进度
var cur_mission=0;

//动画队列
var animate_queue=[];

//游戏容器
var game_wrap=$id("impasse-game-wrap");
//游戏标题
var mission_title=$id("mission-title");

//游戏进度导航
var missions_list=$id("impasse-ft").getElementsByTagName("li");
//用来记录你通过了哪些关卡
var missions_pass='';
//关卡的最大值
var missions_max=24;

//3个显示的容器
var impasse_gameover_wrap=$id("impasse-gameover");
var impasse_old_browser_wrap=$id("impasse-old-browser");
var impasse_success_wrap=$id("impasse-success");

// up1 的全部节点
var up1_elems;
// down1 的全部节点
var	down1_elems;
// up2 的全部节点
var up2_elems;
// down2 的全部节点
var	down2_elems;
// wall 的全部节点
var wall_elems;
// x 的全部节点
var x_elems;
//所有的游戏节点,是指span，不包括you & end
var all_elems;
//所有的游戏节点的长度
var all_elems_length;

function $id(elem){
	return typeof elem==="string" ? document.getElementById(elem) : elem;
};

/*======== 显示 =========*/
function show(elem){
	$id(elem).style.display="block";
};

/*======== 隐藏 =========*/
function hide(elem){
	$id(elem).style.display="none";
};

/*======== 淡入 =========*/
function fadeIn(elem,callback){
	var el=$id(elem),
		  min=0,
			fn,
			speed=20,step=10;
			
	el.style.opacity=min;
	show(el);
	
	fn=function(){
		min+=step;
		if(min>=100){
			el.style.opacity=1;

			callback && callback.call(el);
			return;
		}
		el.style.opacity=min/100;
		setTimeout(fn,speed);
	};
	
	fn();
};

/*======== 淡出 =========*/
function fadeOut(elem,callback){
	var el=$id(elem),
		  max=100,
			fn,
			speed=20,step=10;
	
	fn=function(){
		max-=step;
		if(max<=0){
			el.style.opacity=0;
			hide(el);
			callback && callback.call(el);
			return;
		}
		el.style.opacity=max/100;
		setTimeout(fn,speed);
	};
	
	fn();
};

//通过class找到节点，并且不是live nodeList
//有时候需要这种情况
//这里的根目录都是指 game_wrap 了，
function getElemsByClassName(classname){
	var r=[];
	
	for(var i=0;i<all_elems_length;i++){
		if(all_elems[i].className==classname){
			r.push(all_elems[i]);
		}
	}
	
	return r;
};

// elem节点从begin -> end
function move(elem,begin,end,doingCallback,endCallback){
	if(begin==end) return;
	
	animate_queue.push(+new Date());
	
	function returnCallback(end){
		animate_queue.pop();			
		doingCallback && doingCallback(end);
		endCallback && endCallback(end);
		return;
	};
	
	var speed=20,
		ceil_v=2,
		step,
		moveFn;
	
	if(begin<end){
		moveFn = function(){
			setTimeout(function(){
				if(begin>=end){
					return returnCallback(end);
				}
				
				step=Math.ceil( (end-begin)/ceil_v );
				begin+=step;
				doingCallback && doingCallback(begin);
				
				moveFn();
			}, speed);
		};
	}else{
		moveFn = function(){
			setTimeout(function(){
				if(begin<=end){
					return returnCallback(end);
				}
				
				step=Math.ceil( (begin-end)/ceil_v );
				begin-=step;
				doingCallback && doingCallback(begin);
				
				moveFn();
			}, speed);
		};
	}
	
	moveFn();
};

function moveUp(elem,callback){

	var cur_elem_top=parseInt(elem.style.top),
		begin=cur_elem_top,
		end=cur_elem_top-dy;
	
	//遇到上边界，就从下边界出来
	if(begin==y_top){
		
		move(elem,begin,end,function(b){
			elem.style.top=b+'px';
		},function(){
			begin=y_bottom+dy;
			end=y_bottom;
	
			move(elem,begin,end,function(b){
				elem.style.top=b+'px';
			},function(){
				callback && callback.call(elem);
			});
		});
	}else{
		move(elem,begin,end,function(b){
			elem.style.top=b+'px';
		},function(){
			callback && callback.call(elem);
		});
	}

};

function moveDown(elem,callback){
	var cur_elem_top=parseInt(elem.style.top),
		begin=cur_elem_top,
		end=cur_elem_top+dy;
	
	//遇到下边界，就从上边界出来
	if(begin==y_bottom){
		move(elem,begin,end,function(b){
			elem.style.top=b+'px';
		},function(){
			begin=y_top-dy;
			end=y_top;
			
			move(elem,begin,end,function(b){
				elem.style.top=b+'px';
			},function(){
				callback && callback.call(elem);
			});
		});
	}else{
		move(elem,begin,end,function(b){
			elem.style.top=b+'px';
		},function(){
			callback && callback.call(elem);
		});
	}
};

function moveLeft(elem,callback){
	var cur_elem_left=parseInt(elem.style.left),
		begin=cur_elem_left,
		end=cur_elem_left-dx;
	
	if(begin==x_min_range){
		callback && callback.call(elem);
	}else{
		move(elem,begin,end,function(b){
			elem.style.left=b+'px';
		},function(){
			callback && callback.call(elem);
		});
	}
};

function moveRight(elem,callback){
	var cur_elem_left=parseInt(elem.style.left),
		begin=cur_elem_left,
		end=cur_elem_left+dx;
	
	if (begin == x_max_range) {
		callback && callback.call(elem);
	}else{
		move(elem,begin,end,function(b){
			elem.style.left=b+'px';
		},function(){
			callback && callback.call(elem);
		});
	}
};

//判断所有游戏元素的动画是否全部结束，
//结束后调用callback
function checkAnimateQueueEnd(callback){
	var fn=function(){
		setTimeout(function(){
			if(animate_queue.length==0){
				callback && callback();
				return;
			}
			
			fn();
		},20);
	};
	
	fn();
};

//解除 游戏键盘方向键的绑定
function unbindKeyBoard(){
	document.onkeydown=function(){};
	document.onkeyup=function(){};
};

//游戏键盘方向键的绑定
function bindKeyBoard(){
	var you=document.getElementById("you");
	var key_code;
	
	//首先钥匙是开放的，谁拿到钥匙，就关闭门(false)。然后完成动作后，又把钥匙设置为开发的。
	//方向键的锁，只有通过onkeyup才能解锁
	var onkeydown_key=true;
	
	//游戏全部元素能否移动的锁
	var move_key=true;
	
	//+ ，- 允许按下去的锁
	var plus_minus_key=true;
	
	//方向键按下去结束时的回调函数
	function keydownEndCallback(){
		//首先判断，整个游戏的动画队列是否都全部结束？ 如果结束，在进行
		checkAnimateQueueEnd(function(){
			//判断碰撞
			checkCollide(you);
			
			//判断cover的生成或者变成wall
			createCover();
			
			//解开可以move you的锁
			move_key=true;
		});
	};
	
	//方向键按：上，下时那一刻，触发的函数
	function keyUpDownCallback(){
		//先锁住任何元素的移动
		move_key=false;
		
		removeAllCover();
		
		toggleMinusAir();
	
		moveUpElems(up1_elems);
		moveDownElems(down1_elems);
	};
	
	//方向键按：左，右时那一刻，触发的函数
	function keyLeftRightCallback(){
		move_key=false;
		
		removeAllCover();
		
		moveUpElems(up2_elems);
		moveDownElems(down2_elems);
	};
	
	document.onkeydown=function(e){
		if(!onkeydown_key || !move_key) return;
		onkeydown_key=false;
		
		key_code=e.keyCode;
	
		switch(e.keyCode){
			//上
			case 38:
				keyUpDownCallback();
			
				moveUp(you,function(){
					keydownEndCallback();
				});
				break;
				
			//下	
			case 40:
				keyUpDownCallback();
				
				moveDown(you,function(){
					keydownEndCallback();
				});
				break;
				
			//左 
			case 37:
				if(parseInt(you.style.left)==x_min_range){
					break;
				}
			
				keyLeftRightCallback();
			
				moveLeft(you,function(){
					keydownEndCallback();
				});
				break;
				
			//右
			case 39:
				if(parseInt(you.style.right)==x_max_range){
					break;
				}
			
				keyLeftRightCallback();
			
				moveRight(you,function(){
					keydownEndCallback();
				});
				break;
			
			// w (+)
			case 87:
				//因为关卡是从0开始，所以cur_mission最大值是missions_max-1 
				if(cur_mission==missions_max-1 || !plus_minus_key) return;
				plus_minus_key=false;
				createMissionByNumber(++cur_mission,function(){
					plus_minus_key=true;
				});
				break;
			
			// s (-) 
			case 83:
				if(cur_mission==0 || !plus_minus_key) return;
				plus_minus_key=false;
				createMissionByNumber(--cur_mission,function(){
					plus_minus_key=true;
				});
				break;
		}
	};
	
	document.onkeyup=function(e){
		onkeydown_key=true;
	};
	
};//bindKeyBoard

/*==========================================================================
 * 游戏元素相关的移动 或者 变换
 ==========================================================================*/
//如果移动到了dot节点
//把x变成air,并做标记(data-toggle=x)
function moveToDot(dot_elem){
	hide(dot_elem);
	
	var i=0,
		len=x_elems.length;
			
	//把x变成air,并做标记
	if(x_elems[0].className=="x"){
		for(;i<len;i++){
			setElemToAir(x_elems[i]);
		}
	}else{
		for(;i<len;i++){
			setAirToElem(x_elems[i]);
		}
	}
};

//判断碰撞
function checkCollide(elem){
	var cur_left=parseInt(elem.style.left),
		cur_top=parseInt(elem.style.top);
	
	//达到了end那个节点的位置
	if(cur_left==x_max_range && cur_top==y_middle){
		gameSuccess();
		
		return;
	}
	
	//首先要把和you相同left的障碍物的top提取出来和you的top做对比，如果不是air节点，都属于碰撞了！
	var left,top,gameElems_temp;
	for(var i=0;i<all_elems_length;i++){
		gameElems_temp=all_elems[i];
		
		left=parseInt(gameElems_temp.style.left);
		top=parseInt(gameElems_temp.style.top);
		
		//如果遇到消失的dot节点，不算碰撞
		if(cur_left==left && cur_top==top && gameElems_temp.style.display!=="none"){
			//如果移动到了dot节点
			if(gameElems_temp.className=="dot"){
				moveToDot(gameElems_temp);
			}else{
				gameOver(function(){
					gameStart();
				});
			}
		}
	}//end for
};

//up1,up2的移动
function moveUpElems(up_elems){
	if(up_elems.length==0) return;
		
	for(var i=0,len=up_elems.length;i<len;i++){
		moveUp(up_elems[i]);
	}
};
//down1,down2的移动
function moveDownElems(down_elems){
	if(down_elems.length==0) return;
	
	for(var i=0,len=down_elems.length;i<len;i++){
		moveDown(down_elems[i]);
	}
};

function setElemToAir(elem){
	var oldClassName=elem.className;
	
	elem.style.left=parseInt(elem.style.left)-dd+"px";
	elem.style.top=parseInt(elem.style.top)-dd+"px";
	
	elem.className="air";
	elem.setAttribute("data-toggle",oldClassName);
};

function setAirToElem(air){
	var newClassName=air.getAttribute("data-toggle");

	air.style.left=parseInt(air.style.left)+dd+"px";
	air.style.top=parseInt(air.style.top)+dd+"px";
	air.className=newClassName;
};

//控制上下，minus 变成 air，然后又从air，变成 minus
function toggleMinusAir(){
	//这里如果用getElementsByClassName实在是太复杂，因为它是live Nodelist....
	//var elems=game_wrap.getElementsByTagName("span");
	var temp_elem;
	
	for(var i=0;i<all_elems_length;i++){
		temp_elem=all_elems[i];
		
		if(temp_elem.className=="minus"){
			setElemToAir(temp_elem);
		}else if(temp_elem.className=="air" && temp_elem.getAttribute("data-toggle")=="minus"){
			setAirToElem(temp_elem);
		}
	}
};

//首先移除掉全部的cover
function removeAllCover(){
	var covers=game_wrap.getElementsByClassName("cover");
	if(covers.length==0) return;
	
	while(covers[0]){
		game_wrap.removeChild(covers[0]);
	}
};

//判断wall,up1,up2,down1,down2上面是否有游戏元素
//如果有，就动态生成cover元素。
function createCover(){

	//通过分析all_elems的坐标，来判断，那些游戏节点是重合的
	//首先把元素的坐标，变成数组[left,top]放入数组r中
	var r=[];
	for(var i=0;i<all_elems_length;i++){
		r.push([ parseInt(all_elems[i].style.left),parseInt(all_elems[i].style.top) ]);
	}
	
	//根据得到的重合的left,top生成一个cover节点
	function cCover(left,top){
		var c=createGameElem("cover");
		c.style.left=left-dd+'px';
		c.style.top=top-dd+'px';
		
		game_wrap.appendChild(c);
	};
	
	//进行判断，如果数据重复，就调用callback
	function getDoubleElem(r,callback){
		var len=r.length;
		var i=0,j;
		
		//这里虽然是双重循环，但是循环的次数并不多
		for(;i<len-1;i++){
			for(j=i+1;j<len;j++){
				if(r[i][0]==r[j][0] && r[i][1]==r[j][1]){
					callback(r[i][0],r[j][1]);
					continue;
				}
			}
		}
	};
	
	getDoubleElem(r,function(left,top){
		cCover(left,top);
	});
};


/*==========================================================================
 * 生成关卡相关函数 与 游戏成功，结束
 ==========================================================================*/
//如果num在进度里面的话。返回true
function isInMissionsPass(num){
	return missions_pass.split(",").indexOf(num+"") > -1;
};

//初始化存储数据
//minus一开始获取不到，因为有可能初始化是air状态
function storeGameElems(){
	all_elems=game_wrap.getElementsByTagName("span");
	all_elems_length=all_elems.length;
	
	//live nodeList
	up1_elems=game_wrap.getElementsByClassName("up1");
	down1_elems=game_wrap.getElementsByClassName("down1");
	up2_elems=game_wrap.getElementsByClassName("up2");
	down2_elems=game_wrap.getElementsByClassName("down2");
	wall_elems=game_wrap.getElementsByClassName("wall");

	x_elems=getElemsByClassName("x");
};

function gameOver(callback){
	//移除绑定键盘方向键
	unbindKeyBoard();
	
	//谈谈出现game over
	fadeIn(impasse_gameover_wrap,function(){
		callback && callback();
	});
};

function gameStart(callback){
	setTimeout(function(){
		//创建关卡
		createMissionByNumber(cur_mission);

		//谈谈消失game over，游戏又重新开始
		fadeOut(impasse_gameover_wrap,function(){
			callback && callback();
		});
	},200);
};

//游戏成功后，然后创建新Mission
function gameSuccess(){
	if(missions_pass==""){
		missions_pass+=cur_mission;
	}else{
		//如果这个cur_mission已经存在missions_pass里面，就不需要存了。
		if(!isInMissionsPass(cur_mission)){
			missions_pass+=","+cur_mission;
		}
	}
	localStorage["missions_pass_history"] = missions_pass;

	missions_list[cur_mission].className="pass";
		
	//游戏结束了吗？就是玩家全部通关，立即结束游戏
	if(gameEnd()) return;
	
	//如果游戏没有结束！智能选择哪一关是下一关
	gameNextMission();
};

//智能选择哪一关是下一关，（造成这个原因是，游戏可以随意跳关）
function gameNextMission(){
	//先存起来
	var cur_mission_temp=cur_mission,
		nextElem,prevElem;
	
	//往前找
	nextElem=missions_list[cur_mission].nextElementSibling;
	while(nextElem){
		cur_mission++;

		if(nextElem.className!="pass"){
			return createMissionByNumber(cur_mission);
			
		}
		nextElem=nextElem.nextElementSibling;
	}
	
	//把之前存的还原
	cur_mission=cur_mission_temp;
	prevElem=missions_list[cur_mission].previousElementSibling;
	while(prevElem){
		cur_mission--;
		
		if(prevElem.className!="pass"){
			return createMissionByNumber(cur_mission);
		}

		prevElem=prevElem.previousElementSibling;
	}
};

//游戏全部通关后！
function gameEnd(){
	var pass_r=missions_pass.split(",");
	
	if(pass_r.length==missions_max){
		unbindKeyBoard();
		localStorage.clear();
		fadeIn(impasse_success_wrap);
		mission_title.innerHTML="Congratulations !";
		
		return true;
	}
};

//得到游戏的进度 和 改变游戏关卡时的进度展现
function getMissionProgress(i){
	//pass_r 是字符串数组 
	var pass_r=missions_pass.split(",");

	for(var j=0;j<missions_max;j++){
		if(pass_r.indexOf(j+"")==-1){
			missions_list[j].className="";
		}else{
			missions_list[j].className="pass";
		}
	}
	
	missions_list[i].className="cur";
	localStorage["cur_mission_history"] = i;
};

//通过关卡数字，生成关卡 （ 0开头 ）
function createMissionByNumber(i,callback){
	//移除绑定键盘方向键
	unbindKeyBoard();
	
	//关卡的标题
	mission_title.innerHTML=missions_name_r[i];
	
	//得到游戏进度，改变游戏进度里面小点的光亮
	getMissionProgress(i);

	//生成关卡，并绑定键盘方向键
	createMission(missions_r[i],function(){
		//存储生产的元素
		storeGameElems();
		
		//绑定游戏方向键盘
		bindKeyBoard();
		
		callback && callback();
	});
};

//生成地图的代码
function createMission(json,callback){
	var x,y,coordinate;
	var game_elem;
	var wrap=document.getElementById("impasse-game-wrap");
	var classname;
	
	wrap.innerHTML="";
	
	for(var i in json){
		x=+i.charAt(0);
		y=+i.charAt(1);
		
		classname=json[i];
		
		game_elem=createGameElem(classname);
		
		//设置节点坐标
		coordinate=getCoordinate(x,y,classname);
		game_elem.style.left=coordinate.left+'px';
		game_elem.style.top=coordinate.top+'px';
		
		wrap.appendChild(game_elem);
	}
	
	//生成 you 和 end
	var you=createGameElem("you","div");
	you.id="you";
	you.style.left=x_min_range+"px";
	you.style.top=y_middle+"px";
	
	var end=createGameElem("end","div");
	end.id="end";
	end.style.left=x_max_range+"px";
	end.style.top=y_middle+"px";
	
	wrap.appendChild(you);
	wrap.appendChild(end);
	
	callback && callback();
};

//通过传进来的游戏节点的行x，列y，得到游戏节点的坐标
function getCoordinate(x,y,classname){
	return {
		left:classname=="air" ? x_min_range+dx*y-dd : x_min_range+dx*y,
		top:classname=="air" ? y_top+dy*x-dd :  y_top+dy*x
	}
};

//创建游戏元素
function createGameElem(classname,elemStyle){
	elemStyle = elemStyle || "span";
	
	var elem=document.createElement(elemStyle);
	elem.className=classname;
	//初始化如果是air的话，就带上minus属性
	if(classname=="air"){
		elem.setAttribute("data-toggle","minus");
	}
	
	return elem;
};


/*==================================
 * 游戏初始化 
 ====================================*/
var isIE = (function(){
	    var v = 3,
	        div = document.createElement('div'),
	        all = div.getElementsByTagName('i');
	 
	    while (
	        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
	        all[0]
	    );
	 
	    return v > 4 ? v : undefined;
	}());

function init(){
	if(isIE<9){
		mission_title.innerHTML="oops~";
		impasse_old_browser_wrap.style.display="block";
		return;
	}
	
	//localStorage["missions_pass_history"]='0,2,6,7,8,9,23,22,21,20,19,18,15,16,17,14,13,12,11,10,5,4,3';
	//刷新后进行本地存储
	cur_mission=localStorage["cur_mission_history"]==null ? 0 : localStorage["cur_mission_history"];
	missions_pass=localStorage["missions_pass_history"]==null ? "" : localStorage["missions_pass_history"];

	createMissionByNumber(cur_mission);
};
//localStorage.clear();
init();









