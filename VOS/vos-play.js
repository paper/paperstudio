/*
 * @author paper
 */
var _VOS_DATA = [];
var VOS = (function($){
    var keyData = {
        's': 83, // 0
        'd': 68, // 1
        'f': 70, // 2
        'space': 32, // 3
        'j': 74, // 4
        'k': 75, // 5
        'l': 76 // 6
    };
    
    var li_height = 500;
    
    var keyData2 = [83, 68, 70, 32, 74, 75, 76];
    
    var findMusicNode = function(r, keyCode){
        for (var i = 0, len = r.length; i < len; i++) {
            if (r[i] == keyCode) {
                return i;
            }
        }
        
        return null;
    };
    
    var ol = document.getElementById('vos_ol'), 
		ol_lis = ol.getElementsByTagName('li'), 
		play_bt = document.getElementById('play'), 
		oldBoy = document.getElementById('oldBoy'), 
		show_click = document.getElementById('show_click'), 
		show_click_num = 0,
		delayTime=1,
		break_img=document.getElementById('break');
    
    var play_fail = function(){
        show_click.innerHTML = 0;
        show_click_num = 0;
    };
    
    var play_success = function(elem,num){
        elem.success_sign = true;
        show_click.innerHTML = show_click_num + 1;
        show_click_num++;
		
		break_img.className='break'+num;
		setTimeout(function(){
			break_img.className='';
		},200);
		
        remove(elem);
    };
    
    var play_miss = function(elem){
        show_click.innerHTML = 'Miss';
        remove(elem);
    };
    
    var remove = function(elem){
        if (elem && elem.parentNode) elem.parentNode.removeChild(elem);
    };
    
    var show = function(elem){
        elem.style.display = '';
    };
    
    var hide = function(elem){
        elem.style.display = 'none';
    };
    
    var disable = function(elem){
        elem.disabled = true;
    };
    
    var useful = function(elem){
        elem.disabled = false;
    };
    
    var debug = function(msg){
        document.getElementById('msg').value = msg;
    };
    
    //创建音节
    //@num 音节 0~6
    //音节自由下落
    var musicNodeSlipDown = function(num, speed){
        var elem = document.createElement('span');
        elem.className = 'th' + num;
        ol_lis[num].appendChild(elem);
        
        var t = 1, h = li_height, time, speed = speed || 10;
        //var start=+new Date();
        
        time = setInterval(function(){
            if (!elem.success_sign) {
                if (t > h) {
                    clearInterval(time);
                    play_miss(elem);
                } else {
                    elem.style.top = t + 'px';
                    t += 2;
                }
            } else {
                clearInterval(time);
            }
        }, speed);
    };
    
    var vos_play_startTime;
    
    function play_down(e){
        var keycode = e.keyCode, musicNode = findMusicNode(keyData2, keycode);
        
        if (musicNode !== null) {
            var $li = Fuee(ol_lis[musicNode]);
            $li.addClass('c');
            
            //判断是否击中
            var range = [li_height - 60, li_height+10], $spans = $li.find('span');
            
            if (!$spans) {
                play_fail();
            } else {
                var span = $spans.getElem(0), span_top = parseInt(span.style.top);
                
                if (span_top >= range[0] && span_top <= range[1]) {
                    play_success(span,musicNode);
                } else {
                    play_fail();
                }
            }
        }
    };
    
    function play_up(e){
        var keycode = e.keyCode, musicNode = findMusicNode(keyData2, keycode);
        
        if (musicNode !== null) {
            Fuee(ol_lis[musicNode]).removeClass('c');
        }
    };
    
	//计算延迟时间
	//一个音节从出生到下落完成需要多少时间
	function countDelayTime(callback){
		document.getElementById('loading_word').innerHTML='正在计算浏览器速度。。。请稍候';
		
		var elem = document.createElement('span');
        elem.className = 'th0';
        ol_lis[0].appendChild(elem);
		
        var t = 1, h = li_height-12, time,now=+new Date();
        
        time = setInterval(function(){
            if (t >=h) {
                clearInterval(time);
				
				delayTime=(+new Date()-now);
				document.getElementById('loading_word').innerHTML='计算完毕!';
				remove(elem);
				
				if(typeof callback=='function'){
					callback();
				}
            } else {
                elem.style.top = t + 'px';
                t += 2;
            }
        }, 10);
	};
	
    //生成琴谱
    function createMusic(dt){
		
        var i = 0, len = _VOS_DATA.length;
        if (len == 0) {
            return;
        }
        
        vos_play_startTime = +new Date();
        setTimeout(function(){
            oldBoy.play();
        }, dt);
        
        var play_time = setInterval(function(){
            var now = +new Date(), spaceTime = parseInt((now - vos_play_startTime) / 100);
            
            if (spaceTime == _VOS_DATA[i]) {
                var n = _VOS_DATA[i + 1];
                musicNodeSlipDown(n);
                
                i += 2;
            }
            if (i == len) {
                clearInterval(play_time);
                setTimeout(function(){
                    show(play_bt);
					
					oldBoy.parse();
					oldBoy.currentTime=0;
                }, 5000);
            }
        }, 10);
    };
    
    return {
		init:function(){
			//计算延迟时间
			countDelayTime(function(){
				document.getElementById('loading_word').innerHTML='正在载入乐谱...';
				//var s='38,4,40,5,42,6,51,2,54,1,60,0,67,5,74,4,86,5,92,6,101,4,104,2,111,1,116,0,124,5,136,4,141,6,148,5,155,2,157,1,166,4,172,3,179,6,186,5,192,4,201,2,205,3,210,5,216,4,229,1,229,5,235,2,236,4,242,0,242,6,251,5,254,4,260,2,266,1,280,3,286,5,292,4,301,2,304,1,310,0,310,6,317,1,317,5,323,3,329,2,330,4,336,1,336,5,342,4,348,2,351,1,360,0,366,6,373,5,380,4,392,2,395,5,398,1,404,2,409,4,417,3,425,0,428,1,431,2';
				//document.getElementById('msg').value=s;
				
				document.getElementById('loading_word').innerHTML='载入完毕!';
				Fuee('#lightbox').fOut('slow');
			});
		},
        vos_play: function(){
            _VOS_DATA = document.getElementById('msg').value.split(',');
            hide(play_bt);
            show_click_num = 0;
			//alert(delayTime)
			//生成下落的音符
            createMusic(delayTime);

            //弹奏
            $(document).bind('keydown', play_down);
            $(document).bind('keyup', play_up);
        }
    }
})(Fuee);