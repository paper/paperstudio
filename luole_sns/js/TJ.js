/*=======================================
   @author paper
   甜酱 1.0
   
   基于 jq.1.4.4
 =======================================*/
var TJ=TJ || {};

//输入字数限制的最大值
TJ.maxlen=140;

TJ.asynInnerHTML = function(HTML, doingCallback, endCallback){
    var temp = document.createElement('div'), 
		frag = document.createDocumentFragment();
		
    temp.innerHTML = HTML;
    (function(){
        if (temp.firstChild) {
            frag.appendChild(temp.firstChild);
            doingCallback(frag);
            setTimeout(arguments.callee, 0);
        } else {
            if (endCallback) endCallback(frag);
        }
    })();
};

TJ.getTime=function(){
	var now=new Date();
	
	var year=now.getFullYear();
	var month=now.getMonth()+1;
	var date=now.getDate();
	
	var hour=now.getHours();
	var min=now.getMinutes();
	
	return year+'-'+month+'-'+date+" "+hour+":"+min;
};


/*
 * 创建基本统一的回复框架
 * @id 是每一条TJ-block的id (就是每个电影的唯一ID)
 * 
 */
TJ.createReplyUICommon=function(id,blurCallBack,writeCallBack,defaultCallback){
	if(TJ.removeReplyUI()===false) return;
	
	var $TJ_comment_list_item=$('<div class="TJ-comment-list-item" />');
	var TJ_comment_list_item_html='<div class="avatar"><img alt="'+g_name+'" src="'+g_face+'" /></div>'+
									'<div class="ui-comment-textarea-wrap">'+
										'<textarea autocomplete="off" class="active"></textarea>'+
										'<p class="words fr"><span>0</span>/140</p>'+
										'<p><a href="javascript:;" class="ui-reply-btn">写上去</a><span class="ui-loading"></span></p>'+
									'</div>';
	
	TJ.asynInnerHTML(TJ_comment_list_item_html,function(frag){
		$TJ_comment_list_item.append(frag);
	},function(){
		var $textarea=$TJ_comment_list_item.find("textarea");
		
		//限制输入的字数
		var $wordLimite=$TJ_comment_list_item.find(".words span");
		//点击“写上去” 生成的回复
		var $write=$TJ_comment_list_item.find(".ui-reply-btn");
		var write_key=true;
		
		var time=TJ.getTime();
		
		$textarea.addClass("focus");
		$textarea.bind("keyup",function(){
			var value=this.value;
			
			if(value.length>TJ.maxlen){
				this.value=value.substring(0,TJ.maxlen);
			}
			$wordLimite.html(this.value.length);	
		});
		
		$textarea.bind("focus",function(){
			$textarea.addClass("focus");
		});
		
		$textarea.bind("blur",function(){
			if ($.trim(this.value) == '') {
				blurCallBack && blurCallBack($TJ_comment_list_item,$textarea);
			}
			
			$textarea.removeClass("focus");
		});
		
		var write_key=true;
		//点击写上去
		$write.bind('click',function(){
			var textarea_value=$.trim($textarea.val());
			if(textarea_value == '') return;
			
			var that=this;
			
			//免得重复提交
			if(!write_key) return;
			write_key=false;
			
			//这个ajax，请求成功后返回的data，1要包含时间，2是内容，3是用户名（这里假设用户名是唯一的）
			$.ajax({
				url:"./ajax.html?replyContent="+encodeURIComponent(textarea_value)+"&id="+id,
				beforeSend:function(){
					$(that).addClass("ui-reply-btn-disabled");
					$(that).next().show().css("display","inline-block");
				},
				success:function(data){
					
					//清除回复框
					TJ.removeReplyUI(false);
					
					var ui_comment_block_html='<div class="TJ-comment-list-item">'+
												'<div class="avatar"><img alt="'+g_name+'" src="'+g_face+'" /></div>'+
												'<h3 class="name">'+g_name+'</h3>'+
												'<p>'+textarea_value+'</p>'+
												
												'<div class="time">'+
													'<span>'+time+'</span>'+
													'<a class="reply-btn" href="javascript:;" data-id="'+id+'" data-peopleName='+g_name+' >回复</a>'+
												'</div>'+
											'</div>';
											
					writeCallBack(ui_comment_block_html);
				},
				error:function(xhr){
					alert("系统繁忙，请稍候再试"+xhr.status);
					return;
				}
			})
			
		});
		
		defaultCallback && defaultCallback($TJ_comment_list_item,$textarea);
	});
};

//通过点击“textarea”来生成回复框
TJ.createReplyUIFromTextarea=function(textareaElem){
	var $textareaElem=$(textareaElem);
	var id=$textareaElem.attr("data-id");
	var textarea_html='<textarea autocomplete="off" data-id='+id+' placeholder="亲,说句话吧..."></textarea>';
	var $parent=$textareaElem.parent();
	
	TJ.createReplyUICommon(id,function($ui){
		$ui.remove();
		$textareaElem.show();
	},function(ui_comment_block_html){
		var $ui_comment_block=$('<li class="ui-comment-block" />');
		var $ui_comment_block_wrap=$("#ui-comment-block-wrap-"+id);
		
		$ui_comment_block.append(ui_comment_block_html);
		$ui_comment_block_wrap.append($ui_comment_block);
		
		TJ.showReplyUIBtn($ui_comment_block);
	},function($ui,$bigtextarea){
		$parent.append($ui);
		$textareaElem.hide();
		
		$bigtextarea.focus();
	});
};

//显示“回复”按钮，并绑定事件
TJ.showReplyUIBtn = function($ui_comment_block){
	var $reply_btn=$ui_comment_block.find('.reply-btn');
					
	//鼠标移上去就显示“回复”，移开就不显示.
	$ui_comment_block.mouseover(function(){
		$reply_btn.show();
	}).mouseout(function(){
		$reply_btn.hide();
	});
	
	$reply_btn.bind('click',function(){
		TJ.createReplyUIFromReplayBtn(this);
	});
};

//通过点击“回复”来生成回复框
TJ.createReplyUIFromReplayBtn=function(btnElem){
	var $btnElem=$(btnElem);
	var name=$btnElem.attr("data-peopleName");
	var id=$btnElem.attr("data-id");
	var $parent=$btnElem.parents(".ui-comment-block");
	
	var $TJ_comment_list_item_reply=$('<li class="TJ-comment-list-item-reply ui-comment-block" />');
	
	TJ.createReplyUICommon(id,function($ui){
		$TJ_comment_list_item_reply.remove();
	},function(ui_comment_block_html){
		var $name=$('<span class="to-name" />').html('@'+name);
		var $ui_comment_block=$('<li class="TJ-comment-list-item-reply ui-comment-block" />');
		
		$ui_comment_block.append(ui_comment_block_html);
		$ui_comment_block.find("h3.name").after($name);
		$parent.after($ui_comment_block);
		
		TJ.showReplyUIBtn($ui_comment_block);
	},function($ui,$bigtextarea){
		
		$TJ_comment_list_item_reply.append('<div class="TJ-comment-list-item-reply-to-name">@'+name+'</div>');
		$TJ_comment_list_item_reply.append($ui);
		
		$parent.after($TJ_comment_list_item_reply);
		$bigtextarea.focus();
	});
};

//每次创建回复框的时候，先查看是否已经存在了回复框，是否回复框里面已经有了文字
//如果已经有了回复的框，就询问是否删除之前写的，创建新的框
//如果需要删除后创业，就返回true，否则返回false
//@tip 如果为false，就是不提示，就删除回复框
TJ.removeReplyUI=function(tip){
	tip=typeof tip==="undefined" ? true : false;
	
	var $textareaActive=$("textarea.active");

	if($textareaActive.length==0) return true;
	
	if($.trim($textareaActive.val())=='' || tip===false){
		return removeReply();
	}
	
	if(confirm("是否要删除之前的输入的评论呢？")){
		return  removeReply();
	}else{
		$textareaActive.focus();
		return false;
	}
	
	//删除
	function removeReply(){
		if($textareaActive.parents(".TJ-comment-list-item-reply").length!=0){
			$textareaActive.parents(".TJ-comment-list-item-reply").remove();
		}else{
			$textareaActive.parents(".TJ-comment-list-item").prev().show();
			$textareaActive.parents(".TJ-comment-list-item").remove();
		}
		
		return true;
	};
};

/*
 * 点击展开全部评论
 */
TJ.showAllComments=function(id,obj,key){
	var $commentsWrap=$("#ui-comment-block-wrap-"+id);
	var $loading=$("#j-ui-loading-"+id);
	var obj=obj || {};

	if(key===true){
		$.ajax({
			url: './commentTest.txt?id=' + id,
			beforeSend: function(){
				$loading.show();
				
				obj.beforeSend && obj.beforeSend();
			},
			success: function(data){
				var json = $.parseJSON(data);
				var allComments = json["allComments"];
				var html = '';
				var temp_comment;
				for (var i = 0, len = allComments.length; i < len; i++) {
					temp_comment = allComments[i];
					
					var name = temp_comment[0], 
						face = temp_comment[1], 
						content = temp_comment[2], 
						time = temp_comment[3];
					
					if (temp_comment.length == 4) {
						html += '<li class="ui-comment-block"><div class="TJ-comment-list-item"><div class="avatar"><img src="' + face + '" alt="' + name + '"></div><h3 class="name">' + name + '</h3><p>' + content + '</p><div class="time"><span>' + time + '</span><a data-peoplename="' + name + '" data-id="' + id + '" href="javascript:;" class="reply-btn" style="display: none;">回复</a></div></div></li>';
					}
					else {
						var name2 = temp_comment[4];
						
						html += '<li class="TJ-comment-list-item-reply ui-comment-block"><div class="TJ-comment-list-item"><div class="avatar"><img src="' + face + '" alt="' + name + '"></div><h3 class="name">' + name + '</h3><span class="to-name">@' + name2 + '</span><p>' + content + '</p><div class="time"><span>' + time + '</span><a data-peoplename="' + name + '" data-id="' + id + '" href="javascript:;" class="reply-btn" style="display: none;">回复</a></div></div></li>';
					}
				}
				
				$commentsWrap.empty();
				
				TJ.asynInnerHTML(html, function(frag){
					$commentsWrap.append(frag);
				}, function(){
					//绑定事件
					$commentsWrap.find(".ui-comment-block").mouseover(function(){
						$(this).find(".reply-btn").show();
					}).mouseout(function(){
						$(this).find(".reply-btn").hide();
					});
					
					$commentsWrap.find(".ui-comment-block .reply-btn").bind("click", function(){
						TJ.createReplyUIFromReplayBtn(this);
					});
					
					$loading.hide();
					
					obj.success && obj.success(len);
				});
			},
			error: function(xhr){
				$loading.hide();
				alert("系统繁忙，请稍候再试。" + xhr.status);
				
				obj.error && obj.error();
				return;
			}
		});
	}
};













