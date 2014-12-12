/*
 * @author paper
 */
function test2(msg,node){
	node=typeof node=='string'?document.getElementById(node):node;
	node.innerHTML=msg;
};