//Date 2010-8-24
var stopBaiduAD=(function(){
	var trim=function(s){
		return s.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "");
	},
	
	$=function(id){
		return typeof id=='string'?document.getElementById(id):id;
	},
	
	/* getAD=function(){
		var as=document.getElementsByTagName('a'),
			AD=[];
		
		for(var i=0,len=as.length;i<len;i++){
			if(getUrl(as[i].href)=='e.baidu.com'){
				AD.push(as[i]);
			}
		}
		return AD;
	}, */
	
	/* findADTable=function(AD){
		if(!AD) return;
	
		var ADTable=[],
			AD=AD.length===undefined?[AD]:AD;

		for(var i=0;i<AD.length;i++){
			var temp=AD[i];
			while(temp && temp.nodeName!='TABLE'){
				temp=temp.parentNode;
			}
			
			if(temp) ADTable.push(temp);
		}
		
		return ADTable;
	}, */
	
	findADTable=function(){
		var tbs=document.getElementsByTagName('table'),
			r=[];
		for(var i=0;i<tbs.length;i++){
			if(tbs[i].width=='100%' || tbs[i].parentNode.id!='wrapper' || tbs[i].id){
				continue;
			}else{
				r.push(tbs[i]);
			}
		}
		
		return r;
	},
	
	//find previousSibling
	prev=function(elem,num){
		if(!elem) return;
	
		var num = num || 1;
		while (num != 0) {
			do {
				elem = elem.previousSibling;
			}
			while (elem && elem.nodeType != 1);
			num--;
		}
		return elem ? elem : null;
	},
	
	//find nextSibling
	next=function(elem,num){
		if(!elem) return;
		
		var num = num || 1;
		while (num != 0) {
			do {
				elem = elem.nextSibling;
			}
			while (elem && elem.nodeType != 1);
			
			num--;
		}
        return elem ? elem : null;
	},
	
	children=function(elem,num){
		var el=typeof elem=='string'?$(elem):elem;
		if(!el) return;
		
		var children = [], childNodes = el.childNodes;
            for (var i = 0, l = childNodes.length; i < l; i++) {
                if (childNodes[i].nodeType == 1) {
                    children.push(childNodes[i]);
                }
            }
            
        return children.length == 0 ? 
					null : 
					num === undefined ? 
						children: 
						children[num];
	},
	
	//del elem
	remove=function(elem){
		var el=typeof elem=='string'?$(elem):elem;
		if(!el) return;
		
		if(el.length){
			for(var i=0;i<el.length;i++){
				if(el[i].parentNode) el[i].parentNode.removeChild(el[i]);
			}
		}else{
			if(el.parentNode) el.parentNode.removeChild(el);
		}
	},
	
	getUrl=function(s){
		var url=s || window.location.href,
			urlReg=/http:\/\/(?:(.+))\//;

		return url.match(urlReg)[1];
	};
	
	return function(){
		var url=getUrl();

		switch(url){
			case 'www.baidu.com':
				var ADS=findADTable();
				for(var i=0;i<ADS.length;i++){
					var nextADS=next(ADS[i]);
					if(nextADS.nodeName=='BR'){
						remove(nextADS);
					}
					remove(ADS[i]);
				}
				break;
			case 'image.baidu.com':
				remove('relEcom');
				remove('relecom54');
				break;
			case 'news.baidu.com':
				remove('ecad');
				break;
			case 'zhidao.baidu.com':
				remove('right');
				remove(children($('center'),0));
				break;
			case 'mp3.baidu.com':
				remove(prev($('leftRes'),2));
				break;
			case 'video.baidu.com':
				remove(prev($('weber')));
				break;
		}//switch
	};
})();

stopBaiduAD();