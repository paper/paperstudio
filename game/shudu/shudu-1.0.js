/*
 * @author paper
 * 
 * version 1.0
 */
var shudu=(function(){
	var table_id='wrap',
		all_td=BJ(table_id).find('td').getElem(),
		
		shudu_alert_number=BJ('shudu_alert_number'),
		alert_number_a=BJ('alert_number').find('a').getElem(),
		//可以填的td个数
		empty_td=0,
		
	//加载地图	
    loadingMap=function(level,num){
		BJ.lightbox({
			'color':'#fff'
		});
		shudu_alert_number.hide();
		BJ.ajax({
			url:level+'.json',
			before:function(){
				BJ("#msg_state").innerHTML='正在加载。。。';
				BJ("#msg_state").className='loading';
			},
			success:function(msg){
				var m=eval('('+msg+')'),
					name=level.toString()+num.toString(),
					r=m.result[name];
				
				//把它清空
				empty_td=0;
				
				for(var i=0;i<all_td.length;i++){
					//先清除以前的sys样式和内容，这样再次加载的时候就不会冲突了
					BJ(all_td[i]).removeClass('sys');
					BJ(all_td[i]).empty();
					
					var cur=r.charAt(i);
					
					if(cur!='0'){
						all_td[i].innerHTML=cur;
						BJ(all_td[i]).addClass('sys');
					}else{
						empty_td++;
					}
				}
				
				BJ.removeLightbox();
				BJ("#msg_state").innerHTML='数据加载完成';
				BJ("#msg_state").className='ok';
			}
		});
	},
		
	//判断9个数字中，没有重复的数字
	//如果有的话，就返回false，反正返回true
	//r 就是含有9个数字的数组
	nineNumber=function(r){
		//先定义9个0的数组
		var temp=[0,0,0,0,0,0,0,0,0],
			sum=0,
			temp_length=temp.length,
			r_length=r.length;
		
		//这里的技巧就是，如果r里面有一样的数字化，这样的话temp的和肯定小于9
		//r的值作为temp的下标
		for(var i=0;i<r_length;i++){
			temp[r[i]-1]=1;		
		}

		for(var j=0;j<temp_length;j++){
			sum+=temp[j];
		}
		
		//alert(r+"   "+temp);
		
		return sum==9?true : false;
	},
	
	//获取真正的数组
	realArray=function(c){
        try {
            return Array.prototype.slice.call(c);
        } 
        catch (e) {
            var r = [], len = c.length;
            for (var i = 0; i < len; i++) {
                r[i] = c[i];
            }
            return r;
        }
	},
	
	//当格子全部填完的时候，需要核对是不是对了。
	checkWin=function(){
		if(empty_td==0){
			//获取数字数组，而不是td DOM数组
			var all_td_array=[];
			for(var p=0;p<all_td.length;p++){
				all_td_array.push(parseInt(all_td[p].innerHTML));
			}
			var all_td_array_length=all_td_array.length;
			
			//alert(all_td_array_length);
			
			//横向判断，每行都没有重复的数字
			for(var i=0;i<all_td_array_length;i+=9){
				var t=all_td_array.slice(i,i+9);
				
				//出现了错误
				if(!nineNumber(t)){
					//key=false;
					//alert("ddddd");
					BJ("#msg_state").innerHTML='结果错误！请自己检查！目前别指望我告诉你错在哪。:)';
					BJ("#msg_state").className='error';
					return false;
				}
			}
			
			//纵向判断
			//if(key){
				for (var j = 0; j < 9; j++) {
					var tt = [];
					
					for (var k = 0; k < 9; k++) {
						tt.push(all_td_array[j + 9 * k]);
					}
					
					if (!nineNumber(tt)) {
						//key = false;
						//alert("tt:"+tt);
						BJ("#msg_state").innerHTML = '结果错误！请自己检查！';
						BJ("#msg_state").className = 'error';
						return false;
					}
				}
			//}
			
			//如果都没有出错
			BJ("#msg_state").innerHTML = '恭喜你，答对了！';
			BJ("#msg_state").className = 'right';
		}
	};
		
	var init = function(){
		//加载地图
		loadingMap('easy',1);
		
		//点了那个td
		var cur_td;
		
		//绑定td的click事件
		BJ(all_td).bind({
			click: function(){
				var that = this;
				
				if (that.className.indexOf('sys') == -1) {
					cur_td=that;
					
					var x = BJ(that).getElementPos().x, 
						y = BJ(that).getElementPos().y;

					shudu_alert_number.css({
						left: x + 20 + 'px',
						top: y + 35 + 'px'
					});
					
					shudu_alert_number.show();
				}
			}
		});
		
		//绑定弹出框的数字点击事件
		BJ(alert_number_a).bind({
			click:function(){
				var that=this,
					num=that.getAttribute('title');
				
				//这样的话，就少了一个格子
				if(cur_td.innerHTML==''){
					empty_td--;
				}
				
				cur_td.innerHTML=num;
				shudu_alert_number.hide();

				checkWin();
			}
		});
		
		//换底图
		BJ('shudu_map').find('a').bind({
			click:function(){
				//改变样式
				BJ('shudu_map').find('a').removeClass();
				this.className='cur';
				
				
				if(this.getAttribute('rel')=='getMap'){
//					var s='';
//					for(var i=0;i<all_td.length;i++){
//						if(all_td[i].innerHTML==''){
//							s+='0';
//						}else{
//							s+=all_td[i].innerHTML;
//						}
//					}
					//alert(s);
				}else{
					var map=this.getAttribute('rel').split(',');
				
					loadingMap(map[0],parseInt(map[1]));
				}
			}
		});
		
		//右键取消填入数字事件
		BJ('#'+table_id).oncontextmenu=function (e){
			var e=e?e:window.event,
				t=e.srcElement ? e.srcElement:e.target; 
			
			//如果不是系统数字而且不为空的话，右击去掉用户自己填入的数字
			if(t.innerHTML!='' && t.className.indexOf('sys')==-1){
				t.innerHTML='';
				
				//多了一个可以点击的格子
				empty_td++;
			}
			
		    return false;
		};
	};
		
	return init;
	
})();
shudu();
