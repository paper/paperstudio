/*
  @Author paper
	
  树状菜单
  
  基于jq1.4.4（只是处理点击展开事件）
  
  最后一个参数是，树状菜单显示的顺序
  第3个菜单是树状菜单是告诉你如何分组的
  
  后台传过来的数据格式是：
  data=[ 
    0['1', '用户管理', '0,1', '/user.php/act=list', '/menu/user.jpg', '1', '1'],
	1['2', '用户列表', '0,1,2', '/user.php/act=list', '/menu/userAdd.jpg', '1', '1'],
	2['3', '添加用户', '0,1,3', '/user.php/act=add', '/menu/userlist.jpg', '1', '3'],
	3['4', '编辑用户', '0,1,4', '/user.php/act=edit', '/menu/useredit.jpg', '1', '2'],
	
	4['14', '编辑用户1', '0,1,4,1', '/user.php/act=edit', '/menu/useredit.jpg', '1', '2'],
	5['15', '编辑用户2', '0,1,4,2', '/user.php/act=edit', '/menu/useredit.jpg', '1', '2'],
	
	6['5', '删除用户', '0,1,5', '/user.php/act=del', '/menu/userdel.jpg', '1', '4'],

	7['6', '任务管理', '0,6', '/task.php/act=list', '/menu/task.jpg', '1', '2'],
	8['8', '任务列表', '0,6,1', '/task.php/act=list', '/menu/tasklist.jpg', '1', '1'],
	9['10', '添加任务','0,6,10', '/task.php/act=add', '/menu/taskadd.jpg', '1', '4'],
	10['12', '修改任务','0,6,12', '/task.php/act=edit', '/menu/taskedit.jpg', '1', '3'],

	11['7', '消息管理', '0,7', '/msg.php/act=list', '/menu/msg.jpg', '1', '3'],
	12['9', '消息列表', '0,7,1', '/msg.php/act=list', '/menu/msglist.jpg', '1', '1'],
	13['11', '添加消息','0,7,11', '/msg.php/act=add', '/menu/msglist.jpg', '1', '4'],
	14['13', '修改消息','0,7,13', '/msg.php/act=edit', '/menu/msgedit.jpg', '1', '3']
  ];
  
  把这个变成object，这样生成html就非常方便了。
  obj={
	"0":{
		"1":1,
		"2":1,
		"3":{
			"4":1,
			"5":1
		},
		"6":1
	},
	
	"7":{
		"8":1,
		"9":1,
		"10":1
	},
	
	"11":{
		"12":1,
		"13":1,
		"14":1
	}
	
	
  };
  
*/


var data=[ 
    ['1', '用户管理', '0,1', '/user.php/act=list', '/menu/user.jpg', '1', '1'],
	['2', '用户列表', '0,1,2', '/user.php/act=list', '/menu/userAdd.jpg', '1', '1'],
	['3', '添加用户', '0,1,3', '/user.php/act=add', '/menu/userlist.jpg', '1', '3'],
	['4', '编辑用户', '0,1,4', '/user.php/act=edit', '/menu/useredit.jpg', '1', '2'],
	
	['14', '编辑用户1', '0,1,4,1', '/user.php/act=edit', '/menu/useredit.jpg', '1', '2'],
	['15', '编辑用户2', '0,1,4,2', '/user.php/act=edit', '/menu/useredit.jpg', '1', '2'],
	
	['5', '删除用户', '0,1,5', '/user.php/act=del', '/menu/userdel.jpg', '1', '4'],

	['6', '任务管理', '0,6', '/task.php/act=list', '/menu/task.jpg', '1', '2'],
	['8', '任务列表', '0,6,1', '/task.php/act=list', '/menu/tasklist.jpg', '1', '1'],
	['10', '添加任务','0,6,10', '/task.php/act=add', '/menu/taskadd.jpg', '1', '4'],
	['12', '修改任务','0,6,12', '/task.php/act=edit', '/menu/taskedit.jpg', '1', '3'],

	['7', '消息管理', '0,7', '/msg.php/act=list', '/menu/msg.jpg', '1', '3'],
	['9', '消息列表', '0,7,1', '/msg.php/act=list', '/menu/msglist.jpg', '1', '1'],
	['11', '添加消息','0,7,11', '/msg.php/act=add', '/menu/msglist.jpg', '1', '4'],
	['13', '修改消息','0,7,13', '/msg.php/act=edit', '/menu/msgedit.jpg', '1', '3']
  ];
  
function PTree(data,wrapperId){
	
	var obj={},
		len=data.length;
	
	function getPathLength(s){
		return s.split(",").length;
	};
	
	function isEmptyObject(obj){
		for ( var name in obj ){
			return false;
		}
		return true;
	}; 
	
	function getObjTree(){
		
		//首先找到数组的根节点
		var i=0,
			path;
		
		for(;i<len;i++){
			path=data[i][2];
			
			if( getPathLength(path)==2 ){
				obj[''+i]={};
				
				findChildren(obj[''+i],i);
			}
		}
		
		return;
	};

	
	//根据根节点，找到孩子。记得递归
	//@rootObj 是对应的对象 比如 "0"对应的obj["0"]
	//@root 是data的下标，比如这次例子的：0,7,11
	function findChildren(rootObj,root){
		
		var rootPath=data[root][2],
			len1=getPathLength(rootPath),
			len2=len1+1,
		
			i=0,
			path;
			
		for(;i<len;i++){
			path=data[i][2];
			
			if( getPathLength(path)==len2 &&  path.indexOf(rootPath)>-1 ){
				
				rootObj[''+i]={};

				findChildren(rootObj[''+i],i);
			}
		}
		
		return;
	};
	
	
	getObjTree();
	
	//根据这个obj，生成html代码
	function createHtmlFromRoot(rootObj,i){
		var branch_root_html='<div class="ptree-branch-root"><span class="ptree-branch-add"></span><a href="'+data[i][3]+'">'+data[i][1]+'</a></div>'
		
		var branch_main_html='';
		
		for(var j in rootObj){
			if(isEmptyObject(rootObj[j])){
				branch_main_html+='<li><span class="ptree-branch-link"></span><a href=""'+data[j][3]+'"">'+data[j][1]+'</a></li>'
			}else{
				branch_main_html+=createHtmlFromRoot(rootObj[j],j);
			}
		}
		
		branch_main_html='<ul class="ptree-branch-main" style="display:none;">'+branch_main_html+'</ul>';
		
		return '<li>'+branch_root_html+branch_main_html+'</li>';
	};
	
	function createTreeHtml(){
		var html='';
	
		for(var i in obj){
			html+=createHtmlFromRoot(obj[i],i);
		}
		
		return '<div class="ptree"><ul class="ptree-root">'+html+'</ul></div>';
	};
	
	
	//return createTreeHtml();
	
	var $wrap=$("#"+wrapperId);
	$wrap.html(  createTreeHtml() );
	
	//绑定事件
	$wrap.find(".ptree-branch-add").click(function(){
		var $main=$(this).parent().next();
		
		if(this.className=="ptree-branch-add"){
			$main.slideDown("fast");
			this.className="ptree-branch-minus";
		}else{
			$main.slideUp("fast");
			this.className="ptree-branch-add";
		}
	});
};






