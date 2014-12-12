/*
 * @author paper
 */

function aready(callback){
	try{
		document.addEventListener("DOMContentLoaded", function(){
			document.removeEventListener("DOMContentLoaded", arguments.callee, false);
			callback();
		}, false);
	}catch(e){
		if (document.documentElement.doScroll && window.self == window.top) {
            (function(){
                try {
                    document.documentElement.doScroll("left");
                } catch (e) {
					setTimeout(arguments.callee, 5);
                    return;
                }
                callback();
            })();
        } else {
            document.attachEvent("onreadystatechange", function(){
                if (document.readyState === "complete" || document.readyState === "loaded") {
                    document.detachEvent("onreadystatechange", arguments.callee);
                    callback();
                }
            });
        }
	}
};

