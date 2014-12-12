/*
 * @author paper
 */
function findGod(){
    var args = arguments, 
		length = args.length, 
		undefined, 
		node, 
		nodeParent, 
		nodeCache, 
		max = -1, 
		count = 0, 
		firstResult;
    
    if (length < 2) {    throw Error('至少两个参数'); }
    
    function $(id){
       	return typeof id === 'string' ? document.getElementById(id) : id;
    };
    
    /*
     * 取出第1个元素，遍历它的父亲节点，获得一个结果集
     * 这个结果集里面肯定含有最终答案，如果没有就返回document节点(根据需可以返回false)
     * @return {Array}
     */
    function getFirstResult(){
        var r = [], first = $(args[0]), parent = first.parentNode;
        
        while (parent && parent.nodeType != 9) {
            if (parent._data_findGod === undefined) {
                parent._data_findGod = count++;
            }
            
            r.push(parent);
            
            parent = parent.parentNode;
        }
        
        return r;
    };
    
    firstResult = getFirstResult();
    
    for (var i = 1; i < length; i++) {
        node = $(args[i]);
        nodeParent = node.parentNode;
        
        while (nodeParent && nodeParent.nodeType != 9) {
            nodeCache = nodeParent._data_findGod;
            
            //这里是关键！
            //始终取最大的值作为临时存储,而且这个值的巧妙之处就是：还是firstResult的下标
            if (nodeCache !== undefined) {
                max = +nodeCache > max ? +nodeCache : max;
                break;
            }
            
            nodeParent = nodeParent.parentNode;
            
            //如果找到最后没有找到相交的，说明不存在公共的祖先元素，就立马退出。
            if (nodeParent.nodeType == 9) { return document; }
        }
    }
    
    //console.log(firstResult[max] || document);
    return firstResult[max] || document;
};

//findGod("H", "D");
