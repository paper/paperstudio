/*
 * @author paper
 */
var _VOS_DATA = [];
var VOS = (function($){
    var musicPipelineHeight = 500,
		musicNodeHeight=15,
		keyData=[83, 68, 70, 32, 74, 75, 76],
		
		ol = document.getElementById('vos_ol'), 
		ol_lis = ol.getElementsByTagName('li'), 
		play_bt = document.getElementById('play'),
		
		music = document.getElementById('music'), 
		
		//成绩
		mark = document.getElementById('mark'), 
		mark_value = 0,
		
		delayTime=1,	//下落需要多少时间
		break_img=document.getElementById('break'),
		
		vos_play_startTime,
		
		speed=5;
	
	
    var findMusicNode = function(r, keyCode){
        for (var i = 0, len = r.length; i < len; i++) {
            if (r[i] == keyCode) {
                return i;
            }
        }
        
        return null;
    },
	play_fail = function(){
        mark.innerHTML = 'Bad';
        mark_value = 0;
    },
	play_success = function(elem,num){
		elem.setAttribute('success','yeah');
		
        mark.innerHTML = mark_value + 1;
        mark_value++;
		
		//发出击中的火花
		break_img.className='break'+num;
		setTimeout(function(){
			break_img.className='';
		},200);
    },
	play_miss = function(elem){
		if(!elem.getAttribute('success')){
			mark.innerHTML = 'Miss';
			mark_value = 0;
		}
				
        remove(elem);
    },
	remove = function(elem){
        if (elem && elem.parentNode){
			elem.parentNode.removeChild(elem);
		}
    },
	show = function(elem){
        elem.style.display = '';
    },
	hide = function(elem){
        elem.style.display = 'none';
    },
	loadingWord=function(msg){
		document.getElementById('loading_word').innerHTML=msg;
	};
    
    //创建音节并且自由下落
    //@num 音节 0~6
    var musicNodeSlipDown = function(num,callback){
        var elem = document.createElement('span'),
			top = 0,
			time;
			
        elem.className = 'th' + num;
        ol_lis[num].appendChild(elem);
        
        time = setInterval(function(){
           if (top > musicPipelineHeight) {
                clearInterval(time);
				
				if(typeof callback=='function'){
					callback.call(elem);
				}
            } else {
                elem.style.top = top + 'px';
                top += 2;
            }
        }, speed);
    };
    
	//计算延迟时间
	//7个音节从出生到下落完成需要多少时间
	function countDelayTime(callback){
		loadingWord('正在计算浏览器速度。请稍候。。。');
		var len=5,
			now=+new Date(),
			time;
			
		musicNodeSlipDown(6,function(){
			delayTime=(+new Date()-now);
			remove(this);

			loadingWord('计算完毕！');
			if(typeof callback=='function'){
				callback();
			}
		});
		
		time=setInterval(function(){
			musicNodeSlipDown(len,function(){
				remove(this);
			});
			len--;
			
			if(len<0){
				clearInterval(time);
			}
		},speed);
	};
	
	//gameover
	function restart(){
		show(play_bt);
					
		music.pause();
		music.currentTime=0;
		
		$(document).unbind('keydown', play_down);
		$(document).unbind('keyup', play_up);
	};
	
    //生成琴谱
    function createMusic(dt){
        var i = 0, 
			len = _VOS_DATA.length;
        if (len == 0) return;
        
        vos_play_startTime = +new Date();
        setTimeout(function(){
            music.play();
        }, dt);
        
        var play_time = setInterval(function(){
            var now = +new Date(), 
				spaceTime = parseInt((now - vos_play_startTime) / 100);
            
            if (spaceTime == _VOS_DATA[i]) {
                var n = _VOS_DATA[i + 1];
                musicNodeSlipDown(n,function(){
					play_miss(this);
				});
                
                i += 2;
            }
            if (i == len) {
                clearInterval(play_time);
				
                setTimeout(function(){
                    restart();
                }, 3000+delayTime);
            }
        }, speed);
    };
    
	//弹奏   
    function play_down(e){
        var keycode = e.keyCode, 
			musicNode = findMusicNode(keyData, keycode);
        
        if (musicNode !== null) {
            var $li = Fuee(ol_lis[musicNode]);
            $li.addClass('c');
            
            //判断是否击中
            var range = [musicPipelineHeight - 50, musicPipelineHeight-musicNodeHeight], 
				$spans = $li.find('span');
            
            if (!$spans) {
                play_fail();
            } else {
                var span = $spans.getElem(0), 
					span_top = parseInt(span.style.top);
                
                if (span_top >= range[0] && span_top <= range[1]) {
                    play_success(span,musicNode);
                } else {
                    play_fail();
                }
            }
        }
    };
    
    function play_up(e){
        var keycode = e.keyCode, 
			musicNode = findMusicNode(keyData, keycode);
        
        if (musicNode !== null) {
            Fuee(ol_lis[musicNode]).removeClass('c');
        }
    };
	
    return {
		init:function(seress){
			var $divs=Fuee(ol).find('div');
			$divs.hide();
			
			
			//计算延迟时间
			countDelayTime(function(){
				loadingWord('正在载入乐谱...');
				
				document.getElementById('msg').value=seress;
				loadingWord('载入完毕！');
				
				$divs.fIn('slow');
				Fuee('#lightbox').fOut('slow');
			});
		},
        vos_play: function(){
            _VOS_DATA = document.getElementById('msg').value.split(',');
            hide(play_bt);
            mark_value = 0;
			mark.innerHTML = '';
			
			//生成下落的音符
            createMusic(delayTime);

            //弹奏
            $(document).bind('keydown', play_down);
            $(document).bind('keyup', play_up);
        }
    }
})(Fuee);
