/*
 * @author paper
 */

var avoidBall=(function(){
	var 
		//容器与你控制元素
		box=BJ('#box'),
		you=BJ('#you'),
		
		//容器的大小
		boxWidth=500,
		boxHeight=500,
		
		//飞机的大小
		youWidth=25,
		youHeight=30,
		
		//飞机能够飞的范围
		minWidth=0,
		minHeight=0,
		maxWidth=boxWidth-youWidth,
		maxHeight=boxHeight-youHeight;
		
		//键盘方向事件
        left=37,
        right=39,
        up=38,
        down=40,
		
		leftKey=false,
		rightKey=false,
		upKey=false,
		downKey=false,
		
		document.onkeydown = function(e){
			//注册IE事件
			if (window.event) {
				e = window.event;
			}
			
			var keycode=e.keyCode,
				curLeft=parseInt(BJ(you).css('left')),
				curTop=parseInt(BJ(you).css('top')),
				step=15;
			
			if(keycode==left || leftKey){
				leftKey=true;
				you.style.left=curLeft-step+'px';
			}
			
			if(keycode==right || rightKey){
				rightKey=true;
				you.style.left=curLeft+step+'px';
			}
			
			if(keycode==up || upKey){
				upKey=true;
				you.style.top=curTop-step+'px';
			}
			
			if(keycode==down || downKey){
				downKey=true;
				you.style.top=curTop+step+'px';
			}
		}
		
		document.onkeyup = function(e){
			//注册IE事件
			if (window.event) {
				e = window.event;
			}
			
			var keycode=e.keyCode;
			
			if(keycode==left){
				leftKey=false;
			}
			
			if(keycode==right){
				rightKey=false;
			}
			 
			if(keycode==up){
				upKey=false;
			}
			
			if(keycode==down){
				downKey=false;
			}
		}
})();

	
	
	
