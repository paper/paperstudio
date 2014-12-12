/*
 * @author paper
 */
var blockGallery=(function($){
	return function(wrapper,num,space,callback){
		var $blocks=$(wrapper).children(),
			space=space || 10,
			$before,
			$up;
			
		$blocks.bind({
			'mouseover':function(){
				$(this).addClass('on');
			},	
			'mouseout':function(){
				$(this).removeClass('on');
			}
		});
		
		$blocks.each(function(i){
//			$(this).css({
//				'position':'absolute'
//			});
			
			if(i==0){
				$(this).css({
					'top':0,
					'left':0
				});
			}
			
			if(i<num && i>0){
				$before=$blocks.get(i-1);
				$(this).css({
					'top':0,
					'left':parseInt($before.css('left'))+$before.getElemHeightWidth().width+space+'px'
				});
			}
			
			if(i>=num){
				$before=$blocks.get(i-1);
				$up=$blocks.get(i-num);
	
				if (i % num == 0) {
					$(this).css({
						'left': 0,
						'top': parseInt($up.css('top')) + $up.getElemHeightWidth().height + space + 'px'
					});
				}
				else {
					$(this).css({
						'top': parseInt($up.css('top')) + $up.getElemHeightWidth().height + space + 'px',
						'left': parseInt($before.css('left')) + $before.getElemHeightWidth().width + space + 'px'
					});
				}
			}
		});
		
		if(callback)callback();
	};
})(Fuee);
