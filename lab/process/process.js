/*
 * @author paper
 */
var Process=function(para){
	this.para=para;
	this.def={
		title:'提示',
		progressTitle:'内容正在加载中，请稍候...',
		progressValue:1, //0-100
		tipForm:{
			position:'absolute',
			left:'50%',
			zIndex:9999,
			minWidth:250,
			minHeight:80,
			borderColor:'#CCD9E9',
			borderStyle:'solid',
			borderWidth:'1px',
			backgroundColor:'#CCD9E9',
			opacity:100
		},
		progressWrap:{
			borderColor:'#768DAC',
			borderStyle:'solid',
			borderWidth:'1px',
			width:250
		},
		progress:{
			height:18,
			backgroundColor:'#73A0E1'
		}
	};
};
/*
 * type(101);          // return 'Number'
 * type('hello');      // return 'String'
 * type({});           // return 'Object'
 * type([]);           // return 'Array'
 * type(function(){}); // return 'Function'
 * type(new Date());   // return 'Date'
 * type(document);     // return 'HTMLDocument'
 */
Process.prototype.type=function(o){
    return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
};
Process.prototype.getElemHeightWidth = function(elem){
    return {
        height: elem.offsetHeight,
        width: elem.offsetWidth
    }
};
Process.prototype.getScroll = function(){
	var D=document;
    return {
        top: Math.max(D.documentElement.scrollTop, D.body.scrollTop),
        left: Math.max(D.documentElement.scrollLeft, D.body.scrollLeft)
    }
};
Process.prototype.create=function(callback){
	var _this=this,
		para=_this.para || {},
		obj=_this.extend(_this.def,para);
	
	_this.createWindow(obj,function(){
		_this.doms=this;
		if(callback) callback.call(_this.doms);
	});
};
Process.prototype.createWindow=function(para,callback){
	var _this=this,
		m=Math.random(),
		bd=document.getElementsByTagName('body')[0];
	
	var html='<div id="tip-'+m+'" class="tip" style="left:'+para.tipForm.left+';min-height:'+para.tipForm.minHeight+'px;min-width:'+para.tipForm.minWidth+'px;position:'+para.tipForm.position+';background-color:'+para.tipForm.backgroundColor+';border:'+para.tipForm.borderWidth+' '+para.tipForm.borderStyle+' '+para.tipForm.borderColor+';border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;">'+
		'<div class="hd" style="padding:2px 5px;">'+
			'<h2 id="tip-title-'+m+'" style="color:#4B669B;font-weight:bolder;">'+para.title+'</h2>'+
		'</div>'+
		'<div class="bd">'+
			'<div class="bd-main" style="padding:3px">'+
				'<div class="process-wrap" style="padding:6px">'+
					'<p id="tip-info-'+m+'" class="info" style="font-size:14px;">'+para.progressTitle+'</p>'+
					'<div id="tip-processWrap-'+m+'" class="process" style="width:'+para.progressWrap.width+'px;border:'+para.progressWrap.borderWidth+' '+para.progressWrap.borderStyle+' '+para.progressWrap.borderColor+';padding:1px;background-color:#fff;">'+
						'<div id="tip-process-line-'+m+'" class="process-line" style="height:'+para.progress.height+'px;background-color:'+para.progress.backgroundColor+';width:'+para.progressValue+'%;"></div>'+
					'</div>'+
				'</div>'+				
			'</div>'+
		'</div>'+
	'</div>';

	_this.asynInnerHTML(html,function(f){
		bd.appendChild(f);
	},function(){
		//居中
		var tip=document.getElementById('tip-'+m),
			scrollTop=_this.getScroll().top,
			tipWH=_this.getElemHeightWidth(tip),
			tipWidth=tipWH.width,
			tipHeight=tipWH.height,
			minW=_this.def.tipForm.minWidth,
			minH=_this.def.tipForm.minHeight;
		
		tip.style.marginLeft=-1*tipWidth/2+'px';
		tip.style.top=scrollTop+140+'px';
		
		if(_this.isIE()==6){
			tip.style.width=tipWidth>minW?(tipWidth+'px'):(minW+'px');
			tip.style.height=tipHeight>minH?(tipHeight+'px'):(minH+'px');
			
			tip.style.marginLeft=-1*parseInt(tip.style.width)/2+'px';
		}
		
		if(callback){
			var o={
				tipForm:tip,
				title:document.getElementById('tip-title-'+m),
				progressTitle:document.getElementById('tip-info-'+m),
				progressWrap:document.getElementById('tip-processWrap-'+m),
				progress:document.getElementById('tip-process-line-'+m)
			};
			
			callback.call(o);
		}
	});
};
Process.prototype.asynInnerHTML = function(HTML, doingCallback, endCallback){
    var temp = document.createElement('div'), 
		frag = document.createDocumentFragment();
    temp.innerHTML = HTML;
    (function(){
        if (temp.firstChild){
            frag.appendChild(temp.firstChild);
            doingCallback(frag);
            setTimeout(arguments.callee, 0);
        } else {
            if (endCallback) endCallback(frag);
        }
    })();
};
Process.prototype.extend=function(def,para){
	var _this=this;
	if(_this.type(para)!='Object') return def;
	
	for(var i in def){
		if(def.hasOwnProperty(i)){
			if(_this.type(def[i])!='Object' && typeof para[i]!='undefined'){
				def[i]=para[i];
			}else{
				_this.extend(def[i],para[i]);
			}
		}
	}
	
	return def;
};
Process.prototype.isIE=function(){
    var v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
 
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
 
    return v > 4 ? v : undefined;
};
//@level is 0-100
Process.prototype.setOpacity=function(elem,level){
	elem.style.filter = elem.filters ? elem.style.filter = 'alpha(opacity=' + level + ')' : elem.style.opacity = level / 100;
};

//interface
Process.prototype.remove=function(){
	if(this.doms){
		var tf=this.doms.tipForm;
		tf.parentNode.removeChild(tf);
	}
};
Process.prototype.setTitle=function(value){
	if(this.doms){
		this.doms.title.innerHTML=value;
	}
};
Process.prototype.setProgressTitle=function(value){
	if(this.doms){
		this.doms.progressTitle.innerHTML=value;
	}
};
Process.prototype.setProcess=function(value){
	if(this.doms){
		this.doms.progress.style.width=value+'%';
	}
};