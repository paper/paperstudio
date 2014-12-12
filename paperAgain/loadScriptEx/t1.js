/*
 * @author paper
 */
function test1(msg,node){
	node=typeof node=='string'?document.getElementById(node):node;
	node.innerHTML=msg;
};
