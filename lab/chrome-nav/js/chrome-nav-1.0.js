/*
 * @author paper
 */

/*=====================================
 * 点击切换导航和下面的内容
 =====================================*/
var changeNav=(function(){
	var chromeNav=BJ('chromeNav'),
		chromeNavUl=chromeNav.first().getElem(),
		chromeNavLi=chromeNav.find('li').getElem(),
		
		chromeMain=BJ('chromeMain'),
		chromeMainChildren=chromeMain.children().getElem(),
		
		len=chromeNavLi.length,	//导航的个数
		w=187,		//导航条的宽度,也是每个导航的直接的间隔
		min=0,		//拖动导航的最小位置
		max=w*len,	//拖动导航的最大位置
		
		//需要移动的范围区间
		range=[],
	
		clearNavClass=function(){
			for(var i=0;i<chromeNavLi.length;i++){
				chromeNavLi[i].className='';
			}
		},
		
		hideAllMain=function(){
			for(var i=0;i<chromeMainChildren.length;i++){
				chromeMainChildren[i].style.display="none";
			}
		};
		
		//确定块需要移动的范围区间
		range[0]=min;
		for(var i=1;i<len+1;i++){
			range.push( w*(2*i-1)/2 );
		}

		return function(){
			for (var i = 0; i < chromeNavLi.length; i++) {
				(function(k){
					BJ.drag({
						node: chromeNavLi[k],
						onlyX:true,
						opacity:80,
						mousedown:function(){
							var that = this;
							
							clearNavClass();
							BJ(this).addClass('cur');
							
							hideAllMain();
							BJ(chromeMainChildren[BJ(this).attr('rel') - 1]).show();
							
							that.clone = that.cloneNode(true);
							that.clone.style.cssText = '';
							that.clone.innerHTML='';
							BJ(that).before(that.clone);
							
							//把选中的li放到ul的最后
							BJ(chromeNavUl).append(that);
							
							//得到除了clone的li之外的其他最新节点与位置
							var chromeNavLiTemp=chromeNav.find('li').getElem();
							that.tempLi=[];
							for(var i=0;i<chromeNavLiTemp.length;i++){
								if(chromeNavLiTemp[i].innerHTML!='')
									that.tempLi.push(chromeNavLiTemp[i]);
							}
						},
						mousemove:function(){
								var that = this, 
									nowLeft = parseInt(that.style.left);
								
								//拖动那个li的移动范围
								if (nowLeft <= min) {
									that.style.left = min + 'px';
								}
								else 
									if (nowLeft >= max) {
										that.style.left = max + 'px';
									}
								
								//确定clone节点的位置
								if (nowLeft <= range[0]) {
									BJ(that.tempLi[0]).before(that.clone);
								}
								else 
									if (nowLeft >= range[len]) {
										BJ(that.tempLi[len - 1]).before(that.clone);
									}
									else {
										for (var i = 0; i < len; i++) {
											if (nowLeft > range[i] && nowLeft < range[i + 1]) {
												BJ(that.tempLi[i]).before(that.clone);
											}
										}
									}
						},
						mouseup: function(){					
							var that = this;
							
							that.style.cssText = '';
							BJ(that.clone).before(that);
							
							//下面的很重要，是IE游览器双击把that也删除的bug解决方案!!!
							if(!!that.clone)
								BJ(that.clone).remove();
						}
					});					
				})(i);
			}//for
		};
})();
changeNav();