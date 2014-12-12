/*
 * @author paper
 */

/*
 * //说明下，现在暂时不支持颜色的语意表达，比如red，blue等，这个其实也很好实现。
 * 
 * BJ("div").changeColor({
        "type": "backgroundColor", 		//默认是背景颜色，如果 "type":"fontColor",
        "from":"#223",					//不是必须	,如果没有定义，就是从元素里面获取它的样式，如果它没有就获取它父亲节点的，一直找下去，最后都没有，
        								//就设置为#fff
										
        "to": "#000", 					//必须，也应该支持rgb(0,0,0)，#003399;	反正颜色这3种格式，都应该支持
        "speed":"slow"					//默认是 normal
        "changing":function(){},
        "end":function(){}
    });
 */

BJ.extend({
    changeColor: function(obj){
        var elem = this.elem;
        
        var type = obj.type === undefined ? "backgroundColor" : obj.type, //from=obj.from,
 			to = obj.to,
			from = obj.from === undefined ? false : obj.from,			
			speed = obj.speed === undefined ? "normal" : obj.speed;
        
		switch(speed){
			case "normal":speed=70;break;
			case "fast":speed=30;break;
			case "slow":speed=100;break;
		}
		
		//传入节点，获取它的颜色
		//font color 不存在transparent的问题，而且直接可以获取的到，不必去递归获取父亲的颜色继承
		var getColor=function(node){
			//如果事先没有定义
			if(from===false){
				if(type==="color"){
					return BJ(node).css("color");
				}
				else if(type==="backgroundColor"){
					//第2种可能是针对chrome和safira
					if(BJ(node).css("backgroundColor")==="transparent" || BJ(node).css("backgroundColor")=="rgba(0, 0, 0, 0)"){
						while(BJ(node).parent()){
							var parentBgColor=BJ(node).parent().css("backgroundColor");
							
							if(parentBgColor!=="transparent"){
								return parentBgColor;
							}
							
							node=BJ(node).parent();
						}
						//如果都没有得到
						return "#fff";
					}else{
						return BJ(node).css("backgroundColor");
					}
				}else{
					alert("颜色格式错误.");
				}
			}else{
				return from;
			}
		};
		
		//获取10进制的rgb格式
		//color 是颜色的string格式
		
		//取 rgb(r,g,b)里面的r,g,b的值
		var colorFormat=function(color){
			//rgb(12,13,14)
			if(/^rgb/.test(color)){
				var c = color.split(",");
				
				return {
					r:+c[0].slice(4, c[0].length),
					g:+c[1],
					b:+c[2].slice(0, c[2].length - 1)
				}
			}
			
			//#123
			else if(/^\#/.test(color) && color.length==4){
				return {
					r:parseInt("0x" + color.slice(1, 2)+color.slice(1, 2), 16),
					g:parseInt("0x" + color.slice(2, 3)+color.slice(2, 3), 16),
					b:parseInt("0x" + color.slice(3, 4)+color.slice(3, 4), 16)
				}
			}
			
			//#112233
			else if(/^\#/.test(color) && color.length==7){
				return {
					r:parseInt("0x" + color.slice(1, 3), 16),
					g:parseInt("0x" + color.slice(3, 5), 16),
					b:parseInt("0x" + color.slice(5, 7), 16)
				}
			}
			
			else{
				alert("颜色格式错误.");
				return false;
			}
		};
		
		//颜色值改变的平滑函数
		var colorChanging=function(begin,end){
			 if (begin < end) {
                begin = begin + Math.ceil((end - begin) / speed);
            }
            
            if (begin > end) {
                begin = begin - Math.ceil((begin - end) / speed);
            }
			
            return begin;
		};
		
		
		BJ(elem).each(function(){
			var _this = this,
				beforeColor=colorFormat(getColor(_this)),
				afterColor=colorFormat(to),
				beginR=beforeColor.r,
				beginG=beforeColor.g,
				beginB=beforeColor.b;
	
			_this.time=setInterval(function(){
				beginR = colorChanging(beginR, afterColor.r);
				beginG = colorChanging(beginG, afterColor.g);
				beginB = colorChanging(beginB, afterColor.b);
				
				if(type=="backgroundColor"){
					BJ(_this).css({
						backgroundColor: 'rgb(' + beginR + ',' + beginG + ',' + beginB + ')'
					});
				}else{
					BJ(_this).css({
						color: 'rgb(' + beginR + ',' + beginG + ',' + beginB + ')'
					});
				}

				if(obj.changing){
					obj.changing.call(_this);
				}
				
				if(beginR===afterColor.r && beginG===afterColor.g && beginB===afterColor.b){
					clearInterval(_this.time);
					if(obj.end){
						obj.end.call(_this);
					}
				}
				
			}, 1);
		});
    }
});
