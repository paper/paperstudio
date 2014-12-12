/*
 * @author paper
 */

window.onload=function(){
	//document.getElementById('MyEditor').getElementsByTagName('body')[0].focus();
};

function getIFrameDocument(aID){
	// if contentDocument exists, W3C compliant (Mozilla)
	if (document.getElementById(aID).contentDocument) {
		return document.getElementById(aID).contentDocument;
	} else {
		// IE
		return document.frames[aID].document;
	}
};

function doRichEditCommand(aName, aArg){
  getIFrameDocument('MyEditor').execCommand(aName,false, aArg);
  document.getElementById('MyEditor').contentWindow.focus();
}

function Bold(me){
	me.style.fontWeight=='bolder'?
		me.style.fontWeight='normal':me.style.fontWeight='bolder';
	
	doRichEditCommand('Bold','');
};

function ins_face(src){
    if (document.all) { //IE
    
		MyEditor.focus();
        var o = MyEditor.document.selection.createRange();
        o.pasteHTML('<img src='+src+' \>');
		MyEditor.focus();
		return false;  
    } else { //FF
        try {
            var rng = MyEditor.getSelection().getRangeAt(0);
            var img = document.createElement('img');
            img.setAttribute("src",src);
            rng.surroundContents(img);
			
			
			return false;  
        } catch (e) {}
    }
		
};

function save(){
	document.getElementById('article').value=MyEditor.document.body.innerHTML;
};
