// ==UserScript==
// @name        douban
// @namespace   douban
// @description 给页面添加：“按评论排序”  按钮
// @include     http://movie.douban.com/subject/*
// @version     1
// ==/UserScript==

function Ajax(obj){
	
	var xhr = new XMLHttpRequest(),
		url = obj.url,
		success = obj.success;
	
	xhr.open('get',url,true);
	xhr.onreadystatechange = function(){
		if( xhr.readyState == 4 && xhr.status == 200 ){
			success && success(xhr.responseText);
		}
	}
	
	xhr.send(null);
};

function getById(idName){
	return typeof idName === 'string' ? document.getElementById(idName) : null;
};

function showElem(elem){
	elem = typeof elem === 'string' ? document.getElementById(elem) : elem;
	
	elem.style.display = 'block';
};

function hideElem(elem){
	elem = typeof elem === 'string' ? document.getElementById(elem) : elem;
	
	elem.style.display = 'none';
};



//创建 “按评论排序”的按钮
function createBtn( callback ){
	var bar = document.getElementsByClassName('opt-bar-line')[0],
		oldHtml = bar.innerHTML,
		btnHtml_A = '&nbsp;·&nbsp;<a href="javascript:;" id="JS_douban_user_sortbyfeedback_onepage" title="快速">对当前页面图片评论排序</a>',
		btnHtml_B = '&nbsp;·&nbsp;<a href="javascript:;" id="JS_douban_user_sortbyfeedback_allpage" title="比较慢，慎重">对所有图片评论排序</a>';
		
	bar.innerHTML = oldHtml + btnHtml_A + btnHtml_B;
	
	callback && callback();
};

//里面传入NodeList类型的names
function sortNames(){
	if( arguments.length < 1 ) return;
	
	var names = [],
		
		i,
		arguments_len = arguments.length,
		names_len = 0,
		
		r = [],
		r2 = [],
		tmp,
		a,
		
		item,
		tmp_li,
		
		frag = document.createDocumentFragment();
	
	for(i=0; i<arguments_len; i++){
		names = names.concat( Array.prototype.slice.call(arguments[i]) );
	}

	names_len = names.length;
	
	//得到对应的评论数
	for(i=0; i<names_len; i++){
		tmp = names[i];
		a = tmp.querySelector('a');
		
		if( a ){
			r.push( parseInt(a.innerHTML, 10) );
		}else{
			r.push(0);
		}
	}
	
	//生成对应数据（评论数 和 对应的下标）
	for(i=0; i < names_len; i++){
		r2.push( [r[i], i] );
	}
	
	//排序
	r2.sort(function(a,b){
	  return b[0] - a[0];
	});
	
	//生成最新排序数据
	for(i=0; i < names_len; i++){
		item = names[r2[i][1]].parentNode;
		item.className = '';
		
		if( (i+1) % 4 === 0){
			tmp_li = document.createElement('li');
			tmp_li.className = 'sep';
			
			item.className = 'last';
			frag.appendChild( item );
			frag.appendChild( tmp_li );
		}else{
			frag.appendChild( item );
		}
	}
	
	return frag;
	
};

//当前页面的图片评论排序（右高到低）
function sortImages(){
	var wrap = document.querySelector('#content .article ul'),
		names = document.querySelectorAll('#content .article ul li .name'),
		frag = sortNames(names);
	
	//填入页面
	wrap.innerHTML = '';
	wrap.appendChild( frag );
};

function createLoading(){
	var loading_dom = getById('JS_douban_user_sortbyfeedback_loading');
	
	if( loading_dom ){
		showElem( loading_dom );
		return loading_dom;
	}
	
	var body = document.getElementsByTagName('body')[0],
		loading_div = document.createElement('div');
		
	loading_div.id = 'JS_douban_user_sortbyfeedback_loading';
	loading_div.innerHTML = '正在处理...';
	loading_div.style.cssText = ';position:fixed;left:0;top:220px;background:#000;color:#fff;padding:5px 10px 7px;display:none;';
	body.appendChild( loading_div );
	showElem( loading_div );
	
	return loading_div;
};

function hideLoading(){
	var loading_dom = getById('JS_douban_user_sortbyfeedback_loading');
	
	if( loading_dom ){
		hideElem( loading_dom );
		return;
	}
};

//得到所有图片，然后进行排序生成在页面里面
//这里就有点复杂了。。。
function sortAllImages( callback ){
	var body = document.getElementsByTagName('body')[0],
		wrap = document.querySelector('#content .article ul'),
		paginator = document.querySelector('#content .paginator'),
		count = document.querySelector('#content .paginator .count');
	
	//临时数组
	var r = [];
	
	//每页里面的图片数量
	var onePageImagesNum = 40;
	
	//最大图片数量 
	var countMax = +(count.innerHTML).match(/\d+/)[0];
	
	//最大页码
	var pageMax = Math.ceil( countMax / onePageImagesNum ) ;
	//页码
	var pageNum = 1;
	
	var href = window.location.href;
	var url = href.indexOf('?') > -1 
			  ? href.indexOf('start=') > -1 
				? href 
			    :
				href+'&start=0'
			  :
			  href+'?&start=0';
	
	//隐藏翻页
	hideElem(paginator);
	
	createLoading();
	
	function scrollAjax( callback ){
		
		if( pageNum <= pageMax ){
			
			var startNum = onePageImagesNum*(pageNum - 1);
			var nextUrl = url.replace(/start=(\d+)/,'start='+startNum);
			
			Ajax({
				url : nextUrl,
				success : function(txt){
					
					//屏蔽不需要的js 和 css
					var s = txt.replace(/<head>[\s\S]*<\/head>|<script[^<]*<\/script>/g,'');
					
					//创建临时存储，放代码
					var div = document.createElement('div');
					hideElem(div);
					div.innerHTML = s;
					body.appendChild( div );
					
					var tmp_names = div.querySelectorAll('#content .article ul li .name');
				
					r.push( tmp_names );
					
					body.removeChild( div );
					
					pageNum++;
					
					scrollAjax(callback);	
				}
			});
			
		}else{
			callback && callback();
			return;
		}
	};
	
	//调用
	scrollAjax(function(){
		hideLoading();
		
		var frag = sortNames.apply(null, r);
					
		//填入页面
		wrap.innerHTML = '';
		wrap.appendChild( frag );
		
		callback && callback();
	});
	
};

//绑定触发事件
createBtn(function(){
	var btn_onepage = getById('JS_douban_user_sortbyfeedback_onepage'),
		btn_allpage = getById('JS_douban_user_sortbyfeedback_allpage'),
		
		btn_onepage_key = true,
		btn_allpage_key = true;
	
	btn_onepage.addEventListener('click', function(){
		if( !btn_onepage_key ) return;
		
		btn_onepage_key = false;
		sortImages();
		
		btn_onepage.innerHTML = btn_onepage.innerHTML + '(已排序)';
	});
	
	
	btn_allpage.addEventListener('click', function(){
		if( !btn_allpage_key ) return;
		
		//两边都不能点了，都已经排序了
		btn_allpage_key = false;
		btn_onepage_key = false;
		
		sortAllImages(function(){
			var btn_onepage_innerHTML = btn_onepage.innerHTML;
			
			if( btn_onepage_innerHTML.indexOf('已排序') == -1 ){
				btn_onepage.innerHTML = btn_onepage_innerHTML + '(已排序)';
			}
			
			btn_allpage.innerHTML = btn_allpage.innerHTML + '(已排序)';
		});
		
	});
	
});



