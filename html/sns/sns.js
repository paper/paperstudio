/*
 * @author paper
 */

/*
 * 确定图片的大小
 * 最大规格限制
 * chrome 调整大小失败，Chrome我获取不到里面图片的尺寸，郁闷。
 */
var imageSizeLock=(function(){
	var img_width_max=140,
		img_height_max=140,
		imgs=document.getElementById('main').getElementsByTagName('img'),
		imgs_length=imgs.length,
		
		fn=function(){
			for(var i=0;i<imgs_length;i++){
				var temp_img=imgs[i];
				
				if (temp_img.width > temp_img.height) {
					if (temp_img.width > img_width_max) {
						temp_img.width = img_width_max;
					}
				}
				else {
					if (temp_img.height > img_height_max) {
						temp_img.height = img_height_max;
					}
				}
			}
		};
		
	return fn;	
})();
//imageSizeLock();

/*
 * 回复留言
 */
var reply=(function(){
	var reply_input = document.getElementById('main').getElementsByTagName('input'), 
		input_length = reply_input.length, 
		maxlen=80,
		
		stringToElem=function(content){
			var odiv=document.createElement("div"),
				frag=document.createDocumentFragment();
			
			odiv.innerHTML=content;
			
			while(odiv.firstChild){
				frag.appendChild(odiv.firstChild);
			}
			
			return frag;
		},
		
		 //插入到某个节点的上面
		before=function(elem,content){
			var parent = elem.parentNode;
            
            content = typeof content == "string" ? stringToElem(content) : content;
            
            parent.insertBefore(content, elem);
		},
		
		fn = function(){
		for (var i = 0; i < input_length; i++) {
			(function(k){
				reply_input[k].onfocus = function(){
					var that = this, 
						p = that.parentNode,
						oul=p.parentNode,
						pid = p.getAttribute('id'), 
						s = '<textarea name="' + pid + '_textarea" maxlength="'+maxlen+'" id="' + pid + '_textarea"></textarea>' +
							'<input type="button" class="replay-bt" value="回复" id="' +
							pid +
							'_textarea_bt"/>' +
							'<span class="word-limit"><em id="' +
							pid +
							'_textarea_limit">0</em>/'+maxlen+'</span>';
						ss = '<input type="text" class="add-replay" value="添加回复" />';
					p.innerHTML = s;
					
					var otextarea = document.getElementById(pid + '_textarea'),
						oem=document.getElementById(pid + '_textarea_limit'),
						obt=document.getElementById(pid + '_textarea_bt');
					
					//字数限制
					otextarea.onkeyup=function(){
						var otextarea_value=otextarea.value;
						
						oem.innerHTML=otextarea_value.length;
						if(otextarea_value.length>maxlen){
							otextarea.value=otextarea_value.substring(0,maxlen);
						}
					};
					
					obt.onclick=function(){
						this.disabled=true;
						this.className='replay-bt-disable';
						oem.className='loading';
						
						setTimeout(function(){
							var dd=new Date(),
								d=+dd,
								y=dd.getFullYear(),
								m=dd.getMonth()+1,
								day=dd.getDate(),
							
								h=dd.getHours(),
								mm=dd.getMinutes(),
							
								time=y+"-"+m+"-"+day+" "+h+":"+mm;
							
								reply_html='<li id="reply_'+d+'">'+
									'<div class="reply-face">'+
										'<a href="#" class="reply-face"><img width="30" height="30" src="images/face2.png" /></a>'+
									'</div>'+
									'<div class="reply-info">'+
										'<a href="#">何某</a>'+
										' <span>'+time+'</span>'+
									'</div>'+
									'<div class="reply-content">'+
										'<p>'+otextarea.value+'</p>'+
									'</div>'+
								'</li>';
							
							before(p,reply_html);
						
							p.innerHTML = ss;
							reply();//绑定事件
						},1000);
					};
						
					otextarea.select();//for IE
					otextarea.focus();
					
					otextarea.onblur = function(){
						if (otextarea.value == '') {
							p.innerHTML = ss;
							reply();
						}
					};
					
				};
			})(i);
		}
	};
	
	return fn;
})();
reply();