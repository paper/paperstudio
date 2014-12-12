/*
 * @author paper
 */
(function(){
	var doc=document,
		bd=doc.getElementById('google_body'),
		x=0,y=0,
		H=1200,W=1920,
		keyX=keyY=true,
		w=window.screen.width,
		h=window.screen.height,
		
//		getMax = function(){
//	        var dd = doc.documentElement,
//				Max=Math.max;
//	        return {
//	            height: Max(dd.scrollHeight, dd.clientHeight),
//	            width: Max(dd.scrollWidth, dd.clientWidth)
//	        }
//    	},
	
		toggle=function(key,firstFn,secondFn){
			key?firstFn() : secondFn();
		},
		
		bgMove=function(){
			toggle(keyX,function(){
				x++;
				if(W<=w+x) keyX=false;
				
			},function(){
				x--;
				if(x<=0) keyX=true;
			});
			
			toggle(keyY,function(){
				y++;
				if(H<=h+y) keyY=false;
			},function(){
				y--;
				if(y<=0) keyY=true;
			});
			
			try{
				bd.style.backgroundPosition='-'+x+'px -'+y+'px';
			}catch(e){
				x=0;y=0;
			}
		};

	setInterval(function(){
		bgMove();
	},100);
	
	var links=doc.getElementById('links').getElementsByTagName('a');
	for(var i=0,len=links.length;i<len;i++){
		links[i].onclick=function(){
			bd.style.backgroundImage='url('+this.innerHTML.toLowerCase()+'.jpg)';
		};
	}
	
	try {
            doc.execCommand("BackgroundImageCache", false, true);
        } catch (e) {}
})();
