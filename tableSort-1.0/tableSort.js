/*
 * @author paper
 */
var tableSort=(function($){
	return function(elem,elemBody){
		var table=typeof elem==='string'?document.getElementById(elem):elem,
			tableBody=typeof elemBody==='string'?document.getElementById(elemBody):elemBody,
			$ths=$(table).find('th'),
			
			//初始的tr数据
			$trs=$(tableBody).find('tr');
		
		//绑定th对于下面的td DOM
		var bindThData=function(){
			var o={};
			
			$ths.each(function(i){
				var name=$(this).text(),
					r=[];
	
				$trs.each(function(){
					//存储th对于下面全部td的Fuee对象
					r.push($(this).find('td').get(i));
				});
				
				o[name]=r;
			});
			
			return o;
		};
		
		//给tr的基数加上odd class 
		var addTrOddClass=function(){
			//因为排序之前去除了trs，所以要从新绑定
			var $trs=$(tableBody).find('tr');
			
			//应为tr的顺序变了，所以要从新绑定
			$trs.removeClass('odd');
			
			$trs.each(function(i){
				if(i%2!==0){
					$(this).addClass('odd');
				}
			});
		};
		
		//初始化函数
		var init=function(){
			//初始化加上odd class
			addTrOddClass();
			
			//得到th对于下面td的Fuee数组
			var obj=bindThData();
			
			$ths.bind({
				'click':function(){
					//取出一组出来
					var r=obj[$(this).text()];
	
					if(this.key!==true){
						//对这组进行排序，默认是先排从大到小
						r.sort(function($a,$b){
							var aValue=isNaN($a.text().charAt(0))?$a.text():+$a.text(),
								bValue=isNaN($b.text().charAt(0))?$b.text():+$b.text();
							
							return aValue>bValue?-1:1;
						});
						
						this.key=true;
					}else{
						r.sort(function($a,$b){
							var aValue=isNaN($a.text().charAt(0))?$a.text():+$a.text(),
								bValue=isNaN($b.text().charAt(0))?$b.text():+$b.text();
							
							return aValue>bValue?1:-1;
						});
						
						this.key=false;
					}

					//创建临时存储
					var frag=document.createDocumentFragment();
					for(var i=0,len=r.length;i<len;i++){
						frag.appendChild(r[i].parent().getElem());
					}
					
					//删除当前的
					$(tableBody).empty();
					
					//放上最新的
					$(tableBody).append(frag);
					
					//加上odd class
					addTrOddClass();
				}
			})
		}();

	};
})(Fuee);

tableSort('tableSortA','tableSortA_body');
