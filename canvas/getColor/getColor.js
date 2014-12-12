/*
 * @author paper
 */
var getColor=(function($){
	
	var numTo16=function(num){
	    var s = num.toString(16);
	    
		return s.length == 1?s = '0' + s:s;
	},
	
	loading=document.getElementById('loading'),
	cv = document.getElementById('myCanvas'),
	gc= document.getElementById('gc'),
	gcKey=false,
	imgElem = document.getElementById('img'),
	msg = document.getElementById('msg'),
	color = document.getElementById('color'),
	context = cv.getContext('2d'),
	w = cv.width, h = cv.height,
	x=0,y=0,
	img = new Image();
	
	img.addEventListener('load', function(){
		$(loading).remove();
	    context.drawImage(this, x, y);
	    
	    var imgd = context.getImageData(x, y, this.width, this.height),
	    	pix = imgd.data;
	    
	    context.putImageData(imgd, x, y);
	  
	    $(cv).bind({
	        'mousemove': function(e){
	            var getMouse=$.getMouse(e),
					mx = getMouse.x, my = getMouse.y,
					cv_pos=$(cv).getPosition(),
					cvx = cv_pos.left, cvy = cv_pos.top, 
					
	           		img_x = mx - cvx, img_y = my - cvy,           
	            	point = w * (img_y - 1) + img_x,         
	            	i = (point - 1) * 4;
	            
	            msg.style.backgroundColor = 'rgb(' + pix[i] + ',' + pix[i + 1] + ',' + pix[i + 2] + ')';
	            color.innerHTML = '#' + numTo16(pix[i]) + numTo16(pix[i + 1]) + numTo16(pix[i + 2]);
	        },
			'mouseover':function(){
				gcKey=true;
			},
			'mouseout':function(){
				gcKey=false;
			}
	    });
	    
	}, false);
	img.src = imgElem.src;
	
	document.onkeydown=function(e){
		if(gcKey && e.keyCode==67){
			gc.value=color.innerHTML;
			return false;
		}
	};
})(Fuee);
