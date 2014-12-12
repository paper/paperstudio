/*
 * author		zhang binjue
 * blog			http://paperagain.wordpress.com
 * copyright	No Rights Reserved
 * version		2.0
 * 
 */
(function(window,undefined){
    function extend(parent, child){
        var i,
			toStr=Object.prototype.toString;
        child = child || {};
        
        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === 'object') {
                    child[i] = toStr.call(parent[i]) == '[object Array]' ? [] : {};
                    extend(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
        }
        
        return child;
    };
})(this,undefined);
