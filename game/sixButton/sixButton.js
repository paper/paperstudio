/*
 * @author paper
 * Time 2010-03-27
 */
var SixButton=(function(){
	var sixButton=document.getElementById('sixButton'),
		buttons=sixButton.getElementsByTagName('li'),
		
		//找到第下num个兄弟
		//默认是num=1
		next = function(node, num){
			var num = num || 1, elem = node;
			
			while (num != 0) {
				do {
					if(elem)
						elem = elem.nextSibling;
				}
				while (elem && elem.nodeType != 1);
				
				num--;
			}
			
			return elem ? elem : null;
		},
		
		//找到第上num个兄弟
		//默认是num=1
		pre = function(node, num){
			var num = num || 1, elem = node;

			while (num != 0) {
				do {
					if(elem)
						elem = elem.previousSibling; 
				}
				while (elem && elem.nodeType != 1);
				
				num--;
			}
			
			return elem ? elem : null;
		},
		
		checkWin=function(buttons){
			//判断一下，是不是游戏结束了
			if(buttons[0].className=='up' 
			&& buttons[1].className=='up' 
			&& buttons[2].className=='up'
			&& buttons[3].className=='empty'
			&& buttons[4].className=='down'
			&& buttons[5].className=='down'
			&& buttons[6].className=='down'){
				alert('恭喜你，你居然成功了！所以千万别小看自己。不断尝试就一定行的！');
				return;
			}
		},
		
		//判断当前点击的那个按键的方向的下一格或者跳一格，是不是为空，为空，就改变class，不为空，就不动
		//node是表示当前点击的节点
		checkEmpty=function(node,buttons){
			var curClassName=node.className,
				rel=node.getAttribute('rel');
			
			if(curClassName=='empty') return;
			
			if(curClassName=='down'){
				var nextOne=next(node);
				
				if(nextOne && nextOne.className=='empty'){
					node.className='empty';
					nextOne.className='down';
					checkWin(buttons);
					return;
				}
				
				var nextTwo=next(node,2);
				
				if(nextTwo && nextTwo.className=='empty'){
					node.className='empty';
					nextTwo.className='down';
					checkWin(buttons);
					return;
				}
			}
			
			if(curClassName=='up'){
				var preOne=pre(node);
	
				if(preOne && preOne.className=='empty'){
					node.className='empty';
					preOne.className='up';
					checkWin(buttons);
					return;
				}
				
				var preTwo=pre(node,2);
				
				if(preTwo && preTwo.className=='empty'){
					node.className='empty';
					preTwo.className='up';
					checkWin(buttons);
					return;
				}
			}
		},
		
		bind=function(){
			for (var i = 0, len = buttons.length; i < len; i++) {
				(function(k){
					buttons[k].onclick = function(){
						checkEmpty(this,buttons);
					};
				})(i);
			}//for
		};
		
		return bind;
})();
SixButton();

//重置游戏
var GameAgain=(function(){
	var resetButton=document.getElementById('re'),
		sixButton=document.getElementById('sixButton'),
	
	gameAgain=function(){
		resetButton.onclick=function(){
			sixButton.innerHTML='<li class="down" rel="0"></li>'
						+'<li class="down" rel="1"></li>'
						+'<li class="down" rel="2"></li>'
						+'<li class="empty" rel="3"></li>'
						+'<li class="up" rel="4"></li>'
						+'<li class="up" rel="5"></li>'
						+'<li class="up" rel="6"></li>';
			
			SixButton();
		};
	};
	
	return gameAgain;
})();
GameAgain();