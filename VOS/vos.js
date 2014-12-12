/*
 * @author paper
 */
var _VOS_DATA=[];
var VOS=(function($){
	var keyData={
		's':83,	// 0
		'd':68, // 1
		'f':70, // 2
		'space':32, // 3
		'j':74, // 4
		'k':75, // 5
		'l':76 // 6
	};
	
	var li_height=500;
	
	var keyData2=[83,68,70,32,74,75,76];
	
	var findMusicNode=function(r,keyCode){
		for(var i=0,len=r.length;i<len;i++){
			if(r[i]==keyCode){
				return i;
			}
		}
		
		return null;
	};
	
	var ol=document.getElementById('vos_ol'),
		ol_lis=ol.getElementsByTagName('li'),
		record_bt=document.getElementById('record'),
		stop_bt=document.getElementById('stop'),
		play_bt=document.getElementById('play'),
		oldBoy=document.getElementById('oldBoy');
		
	var record_key=true;
	var play_key=false;
	var vos_record_startTime;
	var vos_play_startTime;
	
	var show=function(elem){
		elem.style.display='';
	};
	
	var hide=function(elem){
		elem.style.display='none';
	};
	
	var disable=function(elem){
		elem.disabled=true;
	};
	
	var useful=function(elem){
		elem.disabled=false;
	};
	
	var debug=function(msg){
		document.getElementById('msg').innerHTML=msg.toString();
	};
	
	//@num 哪一个音节 0~6
	var createMusicNode=function(num){
		var span=document.createElement('span');
		span.className='th'+num;
		
		ol_lis[num].appendChild(span);
		
		return span;
	};
	
	//音节自由下落
	var musicNodeSlipDown=function(elem,speed){
		var t=0,h=li_height-10,time,speed=speed || 10;
		//var start=+new Date();
		
		time=setInterval(function(){
			//debug(+new Date()-start);
			if(t>=h){
				clearInterval(time);
				elem.parentNode.removeChild(elem);
			}
			elem.style.top=t+'px';
			t+=2;
		},speed);
	};

	function stop(){};
	
	function play_down(e){
		var	keycode=e.keyCode,
			musicNode=findMusicNode(keyData2,keycode);
		
		if(musicNode!==null){
			Fuee(ol_lis[musicNode]).addClass('c');
		}
	};
	
	function play_up(e){
		var	keycode=e.keyCode,
			musicNode=findMusicNode(keyData2,keycode);
		
		if(musicNode!==null){
			Fuee(ol_lis[musicNode]).removeClass('c');
		}
	};
	
	//记录琴谱
	function record_down(e){
		if(!record_key) return;
		
		var	keycode=e.keyCode,
			musicNode=findMusicNode(keyData2,keycode);
		
		if(musicNode!==null){
			Fuee(ol_lis[musicNode]).addClass('c');
			var now=+new Date();
			
			_VOS_DATA.push(parseInt((now-vos_record_startTime)/100));
			_VOS_DATA.push(musicNode);
		}
	};
	function record_up(e){
		var	keycode=e.keyCode,
			musicNode=findMusicNode(keyData2,keycode);
		
		if(musicNode!==null){
			Fuee(ol_lis[musicNode]).removeClass('c');
		}
	};
	
	//生成琴谱
	function createMusic(){
		var i = 0, len = _VOS_DATA.length;
		if (len == 0) {
			return;
		}
		
		vos_play_startTime = +new Date();
		setTimeout(function(){
			oldBoy.play();
		}, 3605);
		
		var play_time = setInterval(function(){
			var now = +new Date(), spaceTime = parseInt((now - vos_play_startTime) / 100);
			
			if (spaceTime == _VOS_DATA[i]) {
				var n = _VOS_DATA[i + 1];
				var musicNode = createMusicNode(n);
				musicNodeSlipDown(musicNode);
				
				i += 2;
			}
			if (i == len) {
				clearInterval(play_time);
			}
		}, 10);
	};
	
	return {
		vos_record:function(){
			record_key=true;
			
			show(stop_bt);
			hide(record_bt);
			_VOS_DATA=[];			//数据重置 
			vos_record_startTime = +new Date();
			oldBoy.play();
			
			$(document).bind('keydown',record_down);
			$(document).bind('keyup',record_up);
		},
		vos_stop:function(){
			$(document).unbind('keydown',record_down);
			$(document).unbind('keyup',record_up);
			debug(_VOS_DATA);
			
			record_key=false;
			
			hide(stop_bt);
			show(record_bt);

			oldBoy.pause();
			oldBoy.currentTime = 0;

			if(_VOS_DATA.length!==0){
				useful(play_bt);
			}
		},
		vos_play:function(){
			//生成下落的音符
			createMusic();
				
			//弹奏
			$(document).bind('keydown',play_down);
			$(document).bind('keyup',play_up);
		}
	}
})(Fuee);
