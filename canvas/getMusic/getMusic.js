/*
 * @author paper
 */
 window.onload = function(){
 	var ImgToMusic = (function($){
 		var music = $('audio').children().getElem(), loading = document.getElementById('loading'), cv = document.getElementById('myCanvas'), imgElem = document.getElementById('img'), context = cv.getContext('2d'), w, h, x = 0, y = 0, img = new Image();
 		
 		//var mus;
 		img.addEventListener('load', function(){
 			$(loading).remove();
 			cv.width = w = parseInt(imgElem.width);
 			cv.height = h = parseInt(imgElem.height);
 			context.drawImage(this, x, y);
 			
 			var imgd = context.getImageData(x, y, this.width, this.height), pix = imgd.data, r = [], musicR = [];
 			context.putImageData(imgd, x, y);
 			
 			for (var i = 0, n = pix.length; i < n; i += 4) {
 				r.push(pix[i] + pix[i + 1] + pix[i + 2]);
 			}
 			
 			var max = 255 * 3, m = ~ ~ (max / 8);
 			
 			for (var j = 0, len = r.length; j < len; j++) {
 				if (r[r[j]] >= 0 && r[j] < m) musicR.push(1);
 				else if (r[j] >= m && r[j] < 2 * m) musicR.push(2);
 				else if (r[j] >= 2 * m && r[j] < 3 * m) musicR.push(3);
 				else if (r[j] >= 3 * m && r[j] < 4 * m) musicR.push(4);
 				else if (r[j] >= 4 * m && r[j] < 5 * m) musicR.push(5);
 				else if (r[j] >= 5 * m && r[j] < 6 * m) musicR.push(6);
 				else if (r[j] >= 6 * m && r[j] < 7 * m) musicR.push(7);
 				else if (r[j] >= 7 * m && r[j] <= max) musicR.push(8);
 			}
 			
			var play = document.getElementById('play');
 			play.disabled = false;
 			
			play.onclick = function(){
				//music[0].play();
				//document.getElementById('audio_1').play();
				
				for (var k = 1, l = musicR.length; k < l; k += 10) {
 					(function(m){
 						setTimeout(function(){
 							music[musicR[m] - 1].play();
 						}, m * 10);
 					})(k);
 				}
				play.disabled = true;
			};
 		}, false);
 		img.src = imgElem.src;
 		
 	})(Fuee);
}
