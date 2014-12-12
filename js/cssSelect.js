/*
 * @author paper
 */
function find(selector,root){
				/*
				 * selector是节点的搜索顺序。
				 * elem的父亲节点是否在selector里面
				 */
				function checkParent(selector,elem){		
					var selectorArray=selector.toUpperCase().split(' ');
					var parentName=selectorArray.pop();
					
					var parent=elem.parentNode;
					while(parent && parent.nodeName!=parentName){
						parent=parent.parentNode;
					}
	
					if(parent){
						if(selectorArray.length==0){
							return true;
						}else{
							return checkParent(selectorArray.join(' '),parent);
						}
					}else{
						return false;
					}
				};
				
				root=root || document;
				
				var parts=selector.toUpperCase().split(' '),
					query=parts[parts.length-1],
					rest=parts.slice(0,-1).join(' '),
					elems=root.getElementsByTagName(query),
					result=[];
				
				console.log(elems.length)
				
				for(var i=0,len=elems.length;i<len;i++){
					if(rest){
						console.log(checkParent(rest,elems[i]));
						
						if(checkParent(rest,elems[i])){
							result.push(elems[i]);
						}
					}else{
						result.push(elems[i]);
					}
				}
				
				return result;
			};
			
			var spans=find('ul');
			assert(true,spans.length);