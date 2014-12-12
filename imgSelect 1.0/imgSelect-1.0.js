/*
 * @author paper
 */
(function($){
	var ImgSelect=(function(){
		var $imagesWrapper=$('imagesWrapper'),
			imagesWrapperNode=$imagesWrapper.getElem(),
			
			$imagesList=$('imagesList'),
			imagesListNode=$imagesList.getElem(),
			$imagesListLi=$imagesList.find('li'),
			$imagesListImg=$imagesList.find('img'),
			imagesListLiNode=$imagesListLi.getElem(),

			$selectBox=$('selectBox'),
			selectBoxNode=$selectBox.getElem(),
			//拖动锁定的变量
			key=false,
			o={},
			
			//一个都没有选中的标记
			selsetNone=true,
			
			//如果两个都按下去，按照shift的功能
			ctrlKey=false,
			shiftKey=false,
			
			//是否取第一个位置的key
			shiftFirst=false,
			
			//开始位置和结束位置
			shiftBegin,
			shiftEnd,
			
			//ctrl与shift的判断
			//ctrl->17	shift->16
			checkKeyboard=function(){
				document.onkeydown=function(e){
					e=e || window.event;
					if(e.keyCode==17){
						ctrlKey=true;
					}else if(e.keyCode==16){
						shiftKey=true;
					}
				};
				
				document.onkeyup=function(e){
					e=e || window.event;
					if(e.keyCode==17){
						ctrlKey=false;
					}else if(e.keyCode==16){
						shiftKey=false;
					}
				};
			},
			
			//获取事件源
			getSrcElement=function(e){
				e = window.event || e; 
				return e.srcElement || e.target; 
			},
			
			//禁止图片拖拽
			stopImgDrag = function(){
				$imagesListImg.each(function(){
					this.ondragstart = function(){
						return false;
					}
				});
			},
			
			//给elem设置样式
			setStyle = function(elem, obj){
				for (var i in obj) {
					elem.style[i] = obj[i];
				}
			}, 
			
			//判断一个元素，它是不是在一个范围内。	(本质上就碰撞函数)
			//@ elemx1,elemy1,elemx2,elemy2   	(elem的左上位置和右下坐标)
			//@ x1,y1,x2,y2  是区域的范围			(左上位置和右下坐标)
			//返回的是boolean
			cover=function(elemx1,elemy1,elemx2,elemy2,x1,y1,x2,y2){		
				return x1>elemx2 || x2<elemx1 || y1>elemy2 || y2<elemy1 ? false : true;
			},
			
			//等到所有图片的位置（左上，右下）
			//返回成数组，初始化
			getImagesPos=function(){
				var r=[],
					wrapX=$imagesWrapper.getElementPos().x,
					wrapY=$imagesWrapper.getElementPos().y;
				
				$imagesListLi.each(function(){
					var l=$(this).getElementPos().x-wrapX,
						t=$(this).getElementPos().y-wrapY,
						h=$(this).getElemHeightWidth().height,
						w=$(this).getElemHeightWidth().width;
					
					r.push([l,t,l+w,t+h]);
				});
				
				return r;
			},
			
			//得到所有图片的位置
			imagesPos=getImagesPos(),
			imagesPosLength=imagesPos.length,
			
			//判断是否图片是否覆盖进来	
			checkCover=function(x1,y1,x2,y2){
				clearSelect();
				
				for(var i=0;i<imagesPosLength;i++){
					if(cover(imagesPos[i][0],imagesPos[i][1],imagesPos[i][2],imagesPos[i][3],x1,y1,x2,y2)){
						addSelectClass(imagesListLiNode[i]);
					}
				}
			},
			
			//核对一个元素是否被选中
			checkImgSelect=function(elem){
				return	elem.className.indexOf('select')>-1? true : false;
			},
			
			//给每个li加上标记
			//从0开始
			setSign=function(){
				$imagesListLi.each(function(i){
					this.sign=i;
				});
			},
			
			//得到一个位置			
			getShiftFirst=function(elem){
				if (!shiftFirst && selsetNone) {
					shiftBegin = elem.sign;
					//锁定
					shiftFirst = true;
				}
			},
			
			//清除所有的框的样式，而且要把获取第一个框的权限打开
			clearSelect=function(){
				$imagesListLi.removeClass('select');
				shiftFirst=false;
				selsetNone=true;
			},

			//给elem添加选中的样式
			addSelectClass=function(elem){
				$(elem).addClass('select');
				shiftFirst=true;
				selsetNone=false;
			},
			
			//移除某个elem的选中样式
			removeSelectClass=function(elem){
				$(elem).removeClass('select');
				
				//判断页面上是不是没有一个被选择了，不然要改变状态的。
				for(var i=0;i<imagesListLiNode.length;i++){
					if(checkImgSelect(imagesListLiNode[i])){
						shiftFirst=true;
						selsetNone=false;
						return;
					}
					
					if(!checkImgSelect(imagesListLiNode[i]) && i==imagesListLiNode.length-1){
						shiftFirst=false;
						selsetNone=true;
						return;
					}
				}
			},
			
			//得到选中的图片
			getSelectElem=function(){
				var r=[];
				$imagesListLi.each(function(){
					if(this.className.indexOf('select')>-1){
						r.push(this.sign);
					}
				});
				
				return r;
			},
			
			//显示统计的数据
			showSelectMsg=function(){
				var num=getSelectElem();
				num.length==0?
					$('#msg').innerHTML='您还没有选择！':
					$('#msg').innerHTML='您选中了：'+num.length+'个。 下标分别是：'+num;
			},
			
			fn=function(){
				//禁止选择IE
				imagesWrapperNode.onselectstart = function() { return  false; };
				//img禁止拖拽
				stopImgDrag();
				//给每个li加上标记
				setSign();
				
				//键盘监控
				checkKeyboard();
				
				$imagesList.bind({
					'mousedown':function(e){
						var srcElem=getSrcElement(e);
						if(srcElem.nodeName.toLowerCase()=='ul'){
							clearSelect();
						}
					}
				});
					
				$imagesListLi.bind({
					'mouseover':function(){
						$(this).addClass('over');
					},
					
					'mouseout':function(){
						$(this).removeClass('over');
					},
					
					'click':function(e){
						if(!ctrlKey && !shiftKey){
							clearSelect();
							getShiftFirst(this);
							addSelectClass(this);
						}else if(ctrlKey && !shiftKey){
							getShiftFirst(this);
							
							checkImgSelect(this)?
								removeSelectClass(this):
								addSelectClass(this);
						}else if(shiftKey){
							getShiftFirst(this);
							addSelectClass(this);

							shiftEnd=this.sign;

							//先清空
							clearSelect();
							if(shiftBegin!=shiftEnd){
								var max=Math.max(shiftBegin,shiftEnd),
									min=Math.min(shiftBegin,shiftEnd);
									
								for(var i=min;i<=max;i++){
									addSelectClass(imagesListLiNode[i]);
								}
							}else{
								addSelectClass(imagesListLiNode[shiftBegin]);
							}						
						}
						
						showSelectMsg();
						
						$.stopBubble(e);
					}		
				});
				
				imagesListNode.onmousedown=function(e){
					key = true;
				
					//从新得到一次所有图片的位置，防止图片个数，位置发生变化。
					imagesPos=getImagesPos();
					imagesPosLength=imagesPos.length;
					
					var getMouse = $.getMouse(e);
					o.beginX = getMouse.x;
					o.beginY = getMouse.y;
					
					o.wrapLeft=$imagesWrapper.getElementPos().x;
					o.wrapTop=$imagesWrapper.getElementPos().y;
					
					o.left = o.beginX - o.wrapLeft;
					o.top = o.beginY - o.wrapTop;
					
					setStyle(selectBoxNode, {
						'left': o.left + 'px',
						'top': o.top + 'px'
					});
					
					document.onmousemove=function(e){
						if (!key) return;

						var left,top,
							getMouse = $.getMouse(e);
						o.endX = getMouse.x; 
						o.endY = getMouse.y;

						if (o.endX <= o.beginX) {
							//左上
							if (o.endY <= o.beginY) {
								left=o.endX - o.wrapLeft;
								top=o.endY - o.wrapTop;
							}
							
							//左下
							else {
								left=o.endX - o.wrapLeft;
								top=o.top;
							}
						}
						else {
							//右上
							if (o.endY <= o.beginY) {
								left=o.left;
								top=o.endY - o.wrapTop;
							}
							else {
								left=o.left;
								top=o.top;
							}
						}
						
						setStyle(selectBoxNode, {
							'width': Math.abs(o.endX - o.beginX) + 'px',
							'height': Math.abs(o.endY - o.beginY) + 'px',
							'left': left + 'px',
							'top': top + 'px'
						});
						
						if(parseInt(selectBoxNode.style.width)<10 || parseInt(selectBoxNode.style.height)<10){
							$selectBox.hide();
						}else{
							$selectBox.show();
							//判断哪些图片进入到框框里面了
							//区域的两个对角
							var x1=parseInt(selectBoxNode.style.left),
								y1=parseInt(selectBoxNode.style.top),
								
								x2=x1+parseInt(selectBoxNode.style.width),
								y2=y1+parseInt(selectBoxNode.style.height);
								
							checkCover(x1,y1,x2,y2);
						}
					};
					document.onmouseup=function(e){
						key = false;
						
						setStyle(selectBoxNode, {
							'width': 0,
							'height': 0,
							'left':0,
							'top':0
						});
						
						$selectBox.hide();
						
						showSelectMsg();
					};
				};//imagesWrapperNode
				
			};//fn
		
		return fn;
	})();
	
	ImgSelect();
})(BJ);
