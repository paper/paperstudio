/*
 * @author paper
 * The second way to load external JavaScript
 *
 * @param {Array.<string>} urls
 * @param {Function} loadingCallback
 * @param {Function} doneCallback
 */
var loadScriptEx = (function(){
    var head = document.getElementsByTagName("head")[0];
    var cache = [];
    
    //检验url这个脚本地址是否已经存在cache里面
    //存在返回true，不存在返回false
    function checkCache(url, r){
        if (r.length == 0) return false;
        
        for (var i = 0, len = r.length; i < len; i++) {
            if (url == r[i]) return true;
        }
        
        return false;
    };
    
    //loadingCallback,和doneCallback都只能做一次
    return function(urls, loadingCallback, doneCallback){
        var len = urls.length;
        var i = 0;
        var loadingCallbackKey = true;
        
        //加载1个js的函数
        function loadjs(url, loadingCallback, doneCallback){
            //脚本加载完毕
            function done(){
                cache.push(url + '-loadingDone');
                if (typeof doneCallback == 'function') doneCallback();
            };
            
            //保证loadingCallback能够加载且仅加载一次
            function loading(){
                if (loadingCallbackKey && typeof loadingCallback == 'function') {
                    loadingCallbackKey = false;
                    loadingCallback();
                }
            };
            
            //首先判断这个js是不是已经存在,
            if (checkCache(url, cache)) {
                //是不是加载完毕，还是正在加载...
                if (checkCache(url + '-loadingDone', cache)) {
                    if (typeof doneCallback == 'function') doneCallback();
                    return;
                } else {
                    (function(){
                        if (!checkCache(url + '-loadingDone', cache)) {
                            loading();
							//防止进程被卡死
                            setTimeout(arguments.callee, 10);
                        } else {
                            if (typeof doneCallback == 'function') doneCallback();
                            return;
                        }
                    })()
                }
            } else {
                var script = document.createElement("script");
                script.type = "text/javascript";
                
                loading();
                
                if (script.readyState) {
                    script.onreadystatechange = function(){
                        if (script.readyState == "loaded" || script.readyState == "complete") {
                            script.onreadystatechange = null;
                            done();
                        }
                    };
                } else {
                    script.onerror = function(){
                        done();
                        throw new Error('Oops~,maybe script\'s url is wrong!Check it!');
                    };
                    script.onload = function(){
                        done();
                    };
                }
                
                script.src = url;
                head.appendChild(script);
                cache.push(url);
            }
        };
        
        (function(){
            var fn = arguments.callee;
            
            if (i == len - 1) {
                loadjs(urls[i], loadingCallback, doneCallback);
                return;
            } else {
                loadjs(urls[i], loadingCallback, function(){
                    i++;
                    setTimeout(fn, 0);
                });
            }
        })()
    };
})();
