/*
 * 2.0版本
 * 主要是优化体验和功能方面:
 * 
 * 1)由原来的空格暂停，改为空格直接下落。那么原来的继续按钮就更改为：回车键
 * 
 * 2)添加一种主题：各种方块的颜色可随即变化
 * 
 * 3)增加游戏辅助工具 
 * 
 * 4)优化了: blocks_dead的加入div的方法
 * 
 * 5)加入了: 如果难度提高后，你的分数增加step也会增加
 */
var Block = function(){
    //初始化数据
    this.data = {
		//容器的宽度和高度
		main_width:300,
		
		main_height:400,
		
		//初始化分数为0，消去一行就加10分
		mark:0,
		
		//初始化分数的递增幅度
		mark_step:10,
		
        //初始main里面块距离最上面的距离
        start_top: 0,
        
		//游戏开始
		strat:true,
		
		//gameover标识符,为true，表示gameover了
		gameover:false,
		
		//形状的begin初始化
		shape_begin:0,
		
		//下一个形状初始化
		shape_next:1,
		
        //键盘方向事件
        left: 37,
        right: 39,
        up: 38,
        down: 40,
		
		pause:80,	//按下 p      暂停
		play:13,	//按下 Enter  继续
		
		//直接下落
		quick:32,	//按下 空格   直接下落动作完成
        
        //块的大小
        box: 20,
        
        //下落的速度
        speed: 300,
        
		//记住当前下落时的位置(left)
		currentLeft:120,
		
		//记住当前下落时的位置(top)
		currentTop:0,
		
		//可以向左，向右，向下的key
		//默认都是ture，表示可以按下那个键
		leftKey:true,
		rightKey:true,
		downKey:true,
		
		//可以继续下落的key
		drapDownKey:true,
		
		//可以变形的key
		changeShapeKey:true,
		
		//暂停的key和继续的key
		//一开始是可以暂停，不可以继续
		pauseKey:true,
		playKey:false,
		
		//直接下落的key
		quickKey:true,
		
		//游戏辅助是否开启key
		//false表示关闭
		helpKey:false,
		
		//变形核对数组
		modelCheck:[3,7,11,15,19,23,27,31,35,39,43,47,51],
		
		//方块颜色的数量
		blockColorNum:5,
		//方块颜色随机的标示符
		blockColorRandom:false,
		
        //多种俄罗斯方块
        model: [
			[0, 1, 0, 
			 1, 1, 1, 
			 0, 0, 0],
			[0, 1, 0, 
			 0, 1, 1, 
			 0, 1, 0],
			[1, 1, 1, 
			 0, 1, 0, 
			 0, 0, 0],
			[0, 1, 0, 
			 1, 1, 0, 
			 0, 1, 0],
			
			[0, 1, 0, 
			 0, 1, 0, 
			 0, 1, 0],
			[0, 0, 0, 
			 1, 1, 1, 
			 0, 0, 0],
			[0, 1, 0, 
			 0, 1, 0, 
			 0, 1, 0],
			[0, 0, 0, 
			 1, 1, 1, 
			 0, 0, 0],
			
			[1, 1, 0, 
			 1, 1, 0, 
			 0, 0, 0],
			[1, 1, 0, 
			 1, 1, 0, 
			 0, 0, 0],
			[1, 1, 0, 
			 1, 1, 0, 
			 0, 0, 0],
			[1, 1, 0, 
			 1, 1, 0, 
			 0, 0, 0],
			
			[1, 1, 0, 
			 0, 1, 0, 
			 0, 1, 0],
			[0, 0, 1, 
			 1, 1, 1, 
			 0, 0, 0],
			[1, 0, 0, 
			 1, 0, 0, 
			 1, 1, 0],
			[1, 1, 1, 
			 1, 0, 0, 
			 0, 0, 0],
			
			[1, 1, 0, 
			 1, 0, 0, 
			 1, 0, 0],
			[1, 1, 1, 
			 0, 0, 1, 
			 0, 0, 0],
			[0, 0, 1, 
			 0, 0, 1, 
			 0, 1, 1],
			[0, 0, 0, 
			 1, 0, 0, 
			 1, 1, 1],
			
			[0, 1, 1, 
			 1, 1, 0, 
			 0, 0, 0],
			[1, 0, 0, 
			 1, 1, 0, 
			 0, 1, 0],
			[0, 1, 1, 
			 1, 1, 0, 
			 0, 0, 0],
			[1, 0, 0, 
			 1, 1, 0, 
			 0, 1, 0],
			
			[1, 1, 0, 
			 0, 1, 1, 
			 0, 0, 0],
			[0, 1, 0, 
			 1, 1, 0, 
			 1, 0, 0],
			[1, 1, 0, 
			 0, 1, 1, 
			 0, 0, 0],
			[0, 1, 0, 
			 1, 1, 0, 
			 1, 0, 0],
			
			[1, 1, 0, 
			 1, 0, 0, 
			 0, 0, 0],
			[1, 1, 0, 
			 0, 1, 0, 
			 0, 0, 0],
			[0, 1, 0, 
			 1, 1, 0, 
			 0, 0, 0],
			[1, 0, 0, 
			 1, 1, 0, 
			 0, 0, 0],
			
			[1, 1, 1, 
			 1, 0, 1, 
			 0, 0, 0],
			[0, 1, 1, 
			 0, 0, 1, 
			 0, 1, 1],
			[0, 0, 0, 
			 1, 0, 1, 
			 1, 1, 1],
			[1, 1, 0, 
			 1, 0, 0, 
			 1, 1, 0]
		]
    }
};

//游戏初始化
Block.prototype.init = function(){
	//分析cookie
	
	//主题的加载
	if(BJ.getCookie("theme")!==null){
		var tempTheme=parseInt(BJ.getCookie("theme"));
		
		BJ('theme').children().removeClass('select');
		BJ(BJ('theme').children().get()[tempTheme-1]).addClass('select');

		if(tempTheme==6){
			this.data.blockColorRandom=true;
		}else{
			//改变方块的主题
			BJ("#block").className="block bg"+tempTheme;
			BJ("#blocks_dead").className="block bg"+tempTheme;
			BJ("#window_block").className="block bg"+tempTheme;
		}
	}
	
	//速度加载
	if (BJ.getCookie("speed") !== null) {
		var tempSpeed = parseInt(BJ.getCookie("speed")), 
			tempNum = parseInt(BJ.getCookie("speed_input_num"));
		
		//改变按钮样式
		BJ('speed').children().removeClass('select');
		BJ(BJ('speed').children().get()[tempNum]).addClass('select');
		
		//调整速度
		this.data.speed = tempSpeed;
		BJ("hard_level").html(this.speedToLevel(tempSpeed));
	}
	
	//帮助加载
	if (BJ.getCookie("helpKey") !== null) {
		if(BJ.getCookie("helpKey")=="true"){
			//开启的情况下
			this.data.helpKey=true;
			BJ("#main").className="game-help";
			BJ("helpGame").html("关闭游戏辅助");
			BJ("#helpGame").className="input-class-select";
		}else{
			//关闭的情况下
			this.data.helpKey=false;
			BJ("#main").className="";
			BJ("helpGame").html("开启游戏辅助");
			BJ("#helpGame").className="input-class";
		}
	}
};

//block_children的数据刷新
Block.prototype.re_block_children=function(){
	this.data.block_children=BJ('block').children()==null ? null : BJ('block').children().get();
	this.data.block_children_length=BJ('block').children()==null ? null : BJ('block').children().get().length;
};

//blocks_dead_children的数据刷新
Block.prototype.re_blocks_dead_children=function(){
	this.data.blocks_dead_children=BJ('blocks_dead').children()==null ? null : BJ('blocks_dead').children().get();
	this.data.blocks_dead_children_length=BJ('blocks_dead').children()==null ? null : BJ('blocks_dead').children().get().length;
};

//传入方块数值，生成初始化方块
//也应该能够得到变形后的方块
Block.prototype.createBlockDivs=function(r,wrap,left_begin,top_begin){
	var self=this,
		left_begin=typeof left_begin=="undefined"? 120 : left_begin,
		top_begin=typeof top_begin=="undefined"? 0 : top_begin,
		left_step1=self.data.box+left_begin,
		left_step2=2*self.data.box+left_begin;
		top_step1=self.data.box+top_begin,
		top_step2=2*self.data.box+top_begin;
		
		
		if (!self.data.blockColorRandom) {
			var blockColorClass="";
		}else{
			var blockColorClass="blockColor"+parseInt(self.data.blockColorNum*Math.random()+1);
		}
		
		for (var i = 0; i < r.length; i++) {
			if (r[i] == 1 && i == 0) {
				BJ(wrap).append('<div class="'+blockColorClass+'" style="left:' + left_begin + 'px;top:' + top_begin + 'px"></div>')
			}
			if (r[i] == 1 && i == 1) {
				BJ(wrap).append('<div class="'+blockColorClass+'" style="left:' + left_step1 + 'px;top:' + top_begin + 'px"></div>');
			}
			if (r[i] == 1 && i == 2) {
				BJ(wrap).append('<div class="'+blockColorClass+'" style="left:' + left_step2 + 'px;top:' + top_begin + 'px"></div>');
			}
			if (r[i] == 1 && i == 3) {
				BJ(wrap).append('<div class="'+blockColorClass+'" style="left:' + left_begin + 'px;top:' + top_step1 + 'px"></div>');
			}
			if (r[i] == 1 && i == 4) {
				BJ(wrap).append('<div class="'+blockColorClass+'" style="left:' + left_step1 + 'px;top:' + top_step1 + 'px"></div>');
			}
			if (r[i] == 1 && i == 5) {
				BJ(wrap).append('<div class="'+blockColorClass+'" style="left:' + left_step2 + 'px;top:' + top_step1 + 'px"></div>');
			}
			if (r[i] == 1 && i == 6) {
				BJ(wrap).append('<div class="'+blockColorClass+'" style="left:' + left_begin + 'px;top:' + top_step2 + 'px"></div>');
			}
			if (r[i] == 1 && i == 7) {
				BJ(wrap).append('<div class="'+blockColorClass+'" style="left:' + left_step1 + 'px;top:' + top_step2 + 'px"></div>');
			}
			if (r[i] == 1 && i == 8) {
				BJ(wrap).append('<div class="'+blockColorClass+'" style="left:' + left_step2 + 'px;top:' + top_step2 + 'px"></div>');
			}
		}//for
		
	//重新把block_children的数据改变一次
	//因为块的内容更新了，变形了嘛~~~
	self.re_block_children();
};

//生成辅助的背景
Block.prototype.createHelpBg=function(){
	var self=this;
	
	if(!self.data.helpKey){return;}
	
	BJ("help_bg").empty();
	
	var tempArray=[];	//用来存放left不同的值

	if(BJ("block").children()!=null){
		tempArray.push(parseInt(self.data.block_children[0].style.left));
		
		for (var i = 1; i < self.data.block_children_length; i++) {
			var tempArrayCopy = tempArray.concat();
			for (var j = 0; j < tempArrayCopy.length; j++) {
				if (parseInt(self.data.block_children[i].style.left) == tempArrayCopy[j])break;
				
				if (parseInt(self.data.block_children[i].style.left) != tempArrayCopy[j] && j == tempArrayCopy.length - 1) {
					tempArray.push(parseInt(self.data.block_children[i].style.left));
				}
			}
		}
		
		BJ(tempArray).each(function(i){
			var tempDiv=document.createElement("div");
			tempDiv.style.left=tempArray[i]+"px";
			BJ("help_bg").append(tempDiv);
		});
	}
};

//消行
Block.prototype.delBlocks=function(){
	var self=this,
		len=self.data.main_width/self.data.box,
		tempArray=[];	//用来保存能够消去一行的下标
	
	for(var i=0;i<self.data.blocks_dead_children_length;i++){
		var aim_block_top=self.data.blocks_dead_children[i].style.top;	//目标块的高度
		 
		for (var k = 0; k < self.data.blocks_dead_children_length; k++) {
			if(aim_block_top==self.data.blocks_dead_children[k].style.top){
				tempArray.push(k);
			}
		}
		
		if(tempArray.length==len){
			//改变分数和等级
			self.data.mark+=self.data.mark_step;
			BJ("your_mark").html(self.data.mark);
			
			//记下消去的块所对应的高度
			var delTop=parseInt(self.data.blocks_dead_children[tempArray[0]].style.top);
			
			//消去刚才存下的k下标的数据
			for(var q=0;q<len;q++){
				BJ(self.data.blocks_dead_children[tempArray[q]]).remove();
			}
			
			//从新恢复blocks_dead_children数据
			self.re_blocks_dead_children();
			
			//小于消去的那个top的block，top都加self.data.box高度
			if (self.data.blocks_dead_children_length != null) {
				for (var m = 0; m < self.data.blocks_dead_children_length; m++) {
					if (parseInt(self.data.blocks_dead_children[m].style.top) < delTop) {
						self.data.blocks_dead_children[m].style.top = parseInt(self.data.blocks_dead_children[m].style.top) + self.data.box + "px";
					}
				}
			}
		}
		
		//复位
		tempArray=[];
	}
};

//又从新开始新的块游戏
Block.prototype.reset = function(){
	var self=this;
	
	//把block里面的块放到blocks_dead里面
	for (var j = 0; j < self.data.block_children_length; j++) {
		BJ("blocks_dead").append(self.data.block_children[j]);
	}
	
	//只要改变了内部的内容，就必须从新赋值
	self.re_blocks_dead_children();
	
	
	BJ("block").empty();
	BJ("temp_block").empty();
	BJ("window_block").empty();
	self.stop();
	
	//消行
	self.delBlocks();
	
	//一些东西的需要reset
	self.data.currentTop=0;
	self.data.currentLeft=120;
	
	//再次下落
	self.move_down();
};

//方块的自动下落，等到了最底下的时候就不下落，继续调用初始函数（应该是随机山形状的一种，然后从上开始下落）
Block.prototype.move_down = function(){
    var self = this;
	
	//出现在main里面的方块
	self.createBlockDivs(self.data.model[self.data.shape_begin],"block",self.currentLeft);
	
	//出现在临时里面的方块
	self.createBlockDivs(self.data.model[self.data.shape_begin],"temp_block",self.currentLeft);
	
	self.createHelpBg();
	
	//块的位置
	self.re_block_children();
	self.re_blocks_dead_children();
	
	//生成随即的一种形状
	self.data.shape_next=parseInt(self.data.model.length*Math.random(),10);
	
	//下一个要出现的形状
	self.createBlockDivs(self.data.model[self.data.shape_next],"window_block",3,3);
	
	self.data.shape_begin_current=self.data.shape_begin;	//保存当前的形状
	self.data.shape_begin=self.data.shape_next;
	
	//gameover判断
	if (self.data.blocks_dead_children != null) {
		for (var m = 0; m < self.data.block_children_length; m++) {
			for (var n = 0; n < self.data.blocks_dead_children_length; n++) {
				if (self.data.block_children[m].style.left == self.data.blocks_dead_children[n].style.left && parseInt(self.data.block_children[m].style.top) == parseInt(self.data.blocks_dead_children[n].style.top)) {
					self.data.gameover=true;
					
					self.stop();
					self.alertGameover();
					return;
				}
			}
		}
	}
	
	//确定好形状后，下落动画开始
	self.animate();
};

Block.prototype.stop=function(){
	clearInterval(this.drop_down_time);
};

//下落动画
Block.prototype.animate=function(){
	var self=this;
	
	self.drop_down_time = setInterval(function(){
		if (self.data.block_children !== null) {
						
			//首先临时记下，假设下落后 每个div块的位置
			var tempDrapDownTop=[],
				tempDrapDownLeft=[];
				
			for (var i = 0; i < self.data.block_children_length; i++) {
				tempDrapDownTop[i] = parseInt(BJ(self.data.block_children[i]).css("top")) + self.data.box;
				tempDrapDownLeft[i] = parseInt(BJ(self.data.block_children[i]).css("left"));
			}
			
			//首先判断blocks_dead里面是不是为空，如果为空，就是说明是初始化，直接判断与底面的接触就可以了
			if (self.data.blocks_dead_children == null) {
				for (var k = 0; k < self.data.block_children_length; k++) {
					if (tempDrapDownTop[k] > self.data.main_height - self.data.box) {
						self.data.drapDownKey=false;//表示不能下落了
						break;
					}
				}
			}
			else {
				for (var m = 0; m < self.data.block_children_length; m++) {
					for (var n = 0; n < self.data.blocks_dead_children_length; n++) {
						
						//与dead block发生碰撞
						if (tempDrapDownLeft[m] == parseInt(self.data.blocks_dead_children[n].style.left) && tempDrapDownTop[m] == parseInt(self.data.blocks_dead_children[n].style.top)) {	
							self.data.drapDownKey=false;//表示不能下落了
							break;
						}
						
						//与边缘发生碰撞
						if (m == self.data.block_children_length - 1 && n == self.data.blocks_dead_children_length - 1) {
							for (var k = 0; k < self.data.block_children_length; k++) {
								if (tempDrapDownTop[k] > self.data.main_height - self.data.box) {
									self.data.drapDownKey=false;//表示不能下落了
									break;
								}
							}
						}
					}
				}
			}//else 
			
			//允许下落
			if(self.data.drapDownKey){
				//改变状态
				for (var i = 0; i < self.data.block_children_length; i++) {
					self.data.block_children[i].style.top = parseInt(BJ(self.data.block_children[i]).css("top")) + self.data.box + "px";
				}
			
				//记下当前的高度
				self.data.currentTop += self.data.box;
			}else{
				self.data.drapDownKey=true;
				self.reset();
			}
			
		}//if block_children!=null
    }, self.data.speed);
};

//监控键盘事件
Block.prototype.listenKeyDown = function(){
    var self = this;
    
    document.onkeydown = function(e){
    	//注册IE事件
		if(window.event){
			e=window.event;
		}
		
		//alert(e.keyCode);
		
        if (e.keyCode == self.data.left) {
			if(self.data.gameover){return;}
			
			if (self.data.block_children!=null) {
				//假设可以向左边移动
				var tempLeft=[],//存放假设移动后的block里面所有的left值
					tempTop=[];//存放假设移动后的block里面所有的top值
				
				BJ("block").children().each(function(){
					tempLeft.push(parseInt(BJ(this).css("left")) - self.data.box);
					tempTop.push(parseInt(BJ(this).css("top")));
	            });
							
				//边缘碰撞分析
				BJ(tempLeft).each(function(i){
					if(tempLeft[i]<0){
						//边缘碰撞考虑
						//这个情况是，如果要按下左键的话，会超过左边的边界
						self.data.leftKey=false;
						return;
					}else{
						//与dead block的碰撞考虑
						for(var j=0;j<self.data.blocks_dead_children_length;j++){
							if(tempLeft[i]==parseInt(self.data.blocks_dead_children[j].style.left) && tempTop[i]==parseInt(self.data.blocks_dead_children[j].style.top)){
								//这个情况是，如果要按下左键的话，会和一个dead块重合
								self.data.leftKey=false;
								return;
							}
						}
					}
				});
				
				if (self.data.leftKey) {
					//如果上面都没有return的话：
					//记下当前的left
					self.data.currentLeft = self.data.currentLeft - self.data.box;
					
					//改变当前的left
					BJ("block").children().each(function(){
						var me = this;
						BJ(me).css({
							'left': parseInt(BJ(me).css("left")) - self.data.box + "px"
						});
					});
					
					self.createHelpBg();
				}else{
					self.data.leftKey=true;
				}
            }//!=null
        }/*if left*/
        
        if (e.keyCode == self.data.right) {
			if(self.data.gameover){return;}
			if (self.data.block_children!=null) {
			 	
				//假设可以向右边移动
				var tempLeft=[],//存放假设移动后的block里面所有的left值
					tempTop=[];//存放假设移动后的block里面所有的top值
				
				BJ("block").children().each(function(){
					tempLeft.push(parseInt(BJ(this).css("left")) + self.data.box);
					tempTop.push(parseInt(BJ(this).css("top")));
	            });
							
				//边缘碰撞分析
				BJ(tempLeft).each(function(i){
					if(tempLeft[i]>self.data.main_width-self.data.box){
						//边缘碰撞考虑
						//这个情况是，如果要按下右键的话，会超过右边的边界
						self.data.rightKey=false;
						return;
					}else{
						//与dead block的碰撞考虑
						for(var j=0;j<self.data.blocks_dead_children_length;j++){
							if(tempLeft[i]==parseInt(self.data.blocks_dead_children[j].style.left) && tempTop[i]==parseInt(self.data.blocks_dead_children[j].style.top)){
								//这个情况是，如果要按下左键的话，会和一个dead块重合
								self.data.rightKey=false;
								return;
							}
						}
					}
				});
				
				if (self.data.rightKey) {
					//如果上面都没有return的话：
					//记下当前的left
					self.data.currentLeft = self.data.currentLeft + self.data.box;
					
					//改变当前的left
					BJ("block").children().each(function(){
						var me = this;
						BJ(me).css({
							'left': parseInt(BJ(me).css("left")) + self.data.box + "px"
						});
					});
					
					self.createHelpBg();
				}else{
					self.data.rightKey=true;
				}
            }//!=null
        }//if right
		
		if (e.keyCode == self.data.down) {
			if(self.data.gameover){return;}
			if (self.data.block_children != null) {
				//假设能够按下向下的键
				var tempLeft = [], //存放假设移动后的block里面所有的top值
					tempTop = []; //存放假设移动后的block里面所有的top值
					
				BJ("block").children().each(function(){
					tempTop.push(parseInt(BJ(this).css("top")) + self.data.box);
					tempLeft.push(parseInt(BJ(this).css("left")));
				});
				
				//边缘碰撞分析
				BJ(tempTop).each(function(i){
					if (tempTop[i] > self.data.main_height-self.data.box) {
						//边缘碰撞考虑
						//这个情况是，如果要按下 下键 的话，会超过下边边的边界
						self.data.downKey = false;
						return;
					}
					else {
						//与dead block的碰撞考虑
						for (var j = 0; j < self.data.blocks_dead_children_length; j++) {
							if (tempLeft[i] == parseInt(self.data.blocks_dead_children[j].style.left) && tempTop[i] == parseInt(self.data.blocks_dead_children[j].style.top)) {
								//这个情况是，如果要按下左键的话，会和一个dead块重合
								self.data.downKey = false;
								return;
							}
						}
					}
				});
				
				if (self.data.downKey) {
					//如果上面都没有return的话：
					//记下当前的Top
					self.data.currentTop = self.data.currentTop + self.data.box;
					
					//改变当前的Top
					BJ("block").children().each(function(){
						var me = this;
						BJ(me).css({
							'top': parseInt(BJ(me).css("top")) + self.data.box + "px"
						});
					});
				}
				else {
					self.data.downKey = true;
				}
			}//!=null
		}//if down
		
		//改变形状		
		if (e.keyCode == self.data.up) {
			if(self.data.gameover){return;}
			if (self.data.block_children != null) {
				for(var i=0;i<self.data.modelCheck.length;i++){
					if(self.data.shape_begin_current==self.data.modelCheck[i]){
						self.data.shape_begin_current-=4;
						break;
					}
				}
				
				self.data.shape_begin_current++;
				
				//变形时的碰撞分析
				//首先是假设可以变形，分析会发生什么
				
				
				//左边缘
				if (self.data.currentLeft < 0) {
					self.data.currentLeft = 0;
				}
				
				//右边缘
				if (self.data.currentLeft > 240) {
					self.data.currentLeft = 240;
				}
				
				//先清空临时区域块
				BJ("temp_block").empty();
				//假设变形后
				//要得到每个形状的left和top值
				self.createBlockDivs(self.data.model[self.data.shape_begin_current], "temp_block", self.data.currentLeft, self.data.currentTop);
				
				
				//与dead block的碰撞考虑
				BJ("temp_block").children().each(function(i){
					for (var j = 0; j < self.data.blocks_dead_children_length; j++) {
						if (BJ("temp_block").children().get()[i].style.left == self.data.blocks_dead_children[j].style.left && BJ("temp_block").children().get()[i].style.top == self.data.blocks_dead_children[j].style.top) {
							//这个情况是，如果要按下上键变形的话，会和一个dead块重合
							self.data.changeShapeKey = false;
						}
					}
				});
				if (!self.data.changeShapeKey) {
					self.data.changeShapeKey = true;
					return;
				}
				else {
					BJ("block").empty();
					self.createBlockDivs(self.data.model[self.data.shape_begin_current], "block", self.data.currentLeft, self.data.currentTop);
					self.createHelpBg();
				}
			}
        }//if up
		
		//暂停		
		if (e.keyCode == self.data.pause) {
			if(self.data.gameover){return;}
			
			if(self.data.pauseKey){
				self.stop();
		   		self.alertPause();
				
				self.data.pauseKey=false;
				self.data.playKey=true;
			}
          
        }//if pause
		
		//继续
		if (e.keyCode == self.data.play) {
			if(self.data.gameover){return;}
			
			if(self.data.playKey){
				self.animate();
				self.alertPlay();
				
				self.data.pauseKey=true;
				self.data.playKey=false;
			}
        }//if pause
		
		//空格直接下落完成
		if (e.keyCode == self.data.quick) {
			if(self.data.gameover){return;}
			if (self.data.block_children != null) {
				//首先要停下落块
				self.stop();
				
				do{
					//假设能够向下一格
					var tempLeft = [], //存放假设下落一格后的block里面所有的left值
	 					tempTop = []; 	//存放假设下落一格后的block里面所有的top值
					BJ("block").children().each(function(){
						tempTop.push(parseInt(BJ(this).css("top")) + self.data.box);
						tempLeft.push(parseInt(BJ(this).css("left")));
					});
					
					//边缘碰撞分析
					BJ(tempTop).each(function(i){
						if (tempTop[i] > self.data.main_height - self.data.box) {
							//边缘碰撞考虑
							//这个情况是，如果要按下 下键 的话，会超过下边边的边界
							self.data.quickKey = false;
						}
						else {
							//与dead block的碰撞考虑
							for (var j = 0; j < self.data.blocks_dead_children_length; j++) {
								if (tempLeft[i] == parseInt(self.data.blocks_dead_children[j].style.left) && tempTop[i] == parseInt(self.data.blocks_dead_children[j].style.top)) {
									//这个情况是，如果要按下左键的话，会和一个dead块重合
									self.data.quickKey = false;
									break;
								}
							}
						}
					});
					
					if (self.data.quickKey) {
						//如果上面都没有return的话：
						//记下当前的Top
						self.data.currentTop = self.data.currentTop + self.data.box;
						
						//改变当前的Top
						BJ("block").children().each(function(){
							var me = this;
							BJ(me).css({
								'top': parseInt(BJ(me).css("top")) + self.data.box + "px"
							});
						});
					}
				}while(self.data.quickKey)
				
				self.data.quickKey=true;
				self.reset();
			}//!=null
		}//if pause
    };
};


//改变主题
Block.prototype.changeTheme=function(num){
	//改变主题样式
	BJ('theme').children().removeClass('select');
	BJ(BJ('theme').children().get()[num-1]).addClass('select');
		
	if(num==6){
		//生成的方块颜色随机
		this.data.blockColorRandom=true;
	}else{
		//方块颜色随机关闭
		this.data.blockColorRandom=false;
		
		//改变方块的主题
		BJ("#block").className="block bg"+num;
		BJ("#blocks_dead").className="block bg"+num;
		BJ("#window_block").className="block bg"+num;
	}
	
	//记录到cookie里面
	BJ.setCookie("theme",num);
};

//速度与等级的换算
Block.prototype.speedToLevel=function(speed){
	var level='';
	switch(speed){
		case 1000:level="幼儿园";this.data.mark_step=10;break;
		case 300:level="高中生";this.data.mark_step=20;break;
		case 100:level="大学生";this.data.mark_step=30;break;
	}
	
	return level;
};

//改变速度
Block.prototype.changeSpeed=function(speed,num){
	//改变主题样式
	BJ('speed').children().removeClass('select');
	BJ(BJ('speed').children().get()[num]).addClass('select');
	
	//记录到cookie里面
	BJ.setCookie("speed",speed);
	BJ.setCookie("speed_input_num",num);
	
	BJ("hard_level").html(this.speedToLevel(speed));
		
	if(!this.data.gameover){
		this.stop();
		this.data.speed=speed;
		this.animate();
	}
};

//游戏辅助工具
Block.prototype.helpGame=function(_this){
	var self=this;
	
	if(self.data.helpKey){
		//关闭
		self.data.helpKey=false;
		BJ("#main").className="";
		BJ(_this).html("开启游戏辅助");
		_this.className="input-class";
		
		BJ("help_bg").empty();	//清空辅助背景
	}else{
		//开启
		self.data.helpKey=true;
		BJ("#main").className="game-help";
		BJ(_this).html("关闭游戏辅助");
		_this.className="input-class-select";
		
		self.createHelpBg();	//生成辅助背景
	}
	
	//写进cookie
	BJ.setCookie("helpKey",self.data.helpKey);
};


//gameover弹出窗口
Block.prototype.alertGameover=function(){
	BJ.removeLightbox();
	
	var html='<div class="pd10"><p>游戏结束<br />你的分数是：'+this.data.mark+'</p>'+
			'<p><input type="button" value="从新开始" onclick="location.reload();" /></p></div>';
			
	BJ('message').html(html);
	BJ('message').show();
	BJ.lightbox();
};

//暂停弹出窗口
Block.prototype.alertPause=function(){
	BJ.removeLightbox();
	
	var html='<div class="pd10"><p>按回车键Enter继续</p></div>';
	BJ('message').html(html);
	BJ('message').show();
	BJ.lightbox();
};

//空格继续窗口
Block.prototype.alertPlay=function(){
	BJ.removeLightbox();
	BJ('message').hide();
};