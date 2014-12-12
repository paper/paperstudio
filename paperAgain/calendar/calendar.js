/*
 * @Author paper
 * @Email: zhang.binjue@gmail.com
 * 
 * @Intro: 简约而且简单的日历控件
 * 
 * moneth 都是从0开始，到11结束的。
 */
function PCalendar(para){
	var obj=para || {},
	
		DATA={
			'month_name_en':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
			'month_name_zh':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			
			'thead_en':[['S','sunday'],
						['M','monday'],
						['T','tuesday'],
						['W','wednesday'],
						['T','thursday'],
						['F','friday'],
						['S','saturday']],
			
			'thead_zh':[['日','星期天'],
						['一','星期一'],
						['二','星期二'],
						['三','星期三'],
						['四','星期四'],
						['五','星期五'],
						['六','星期六']],
						
			'lang':obj.lang || 'zh',
			
			//yyyy-mm-dd 2011-06-05
			//yyyy-m-d 2011-6-5
			//yyyy/mm/dd 2011/06/05
			'format':obj.format || 'yyyy-mm-dd',
			
			//一般是指input节点
			'node':$id(obj.node) || false
		};
	
	function $id(elem){
		return typeof elem==='string' ? document.getElementById(elem) : elem;
	};
	
	var wrap=document.createElement('div');
	wrap.className='p-calendar';
	var table;
	
    function hide(elem){
        elem.style.display = "none";
    };
    
    function show(elem){
        elem.style.display = "block";
    };
	
	function getEventElement(e){
		e=e || window.event;
        return e.srcElement ? e.srcElement : e.target;
    };
	
	function stopBubble(e){
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
    };
	
	function asynInnerHTML(HTML, doingCallback, endCallback){
	    var temp = document.createElement('div'), 
			frag = document.createDocumentFragment();
	    temp.innerHTML = HTML;
	    (function(){
	        if (temp.firstChild) {
	            frag.appendChild(temp.firstChild);
	            doingCallback(frag);
	            setTimeout(arguments.callee, 0);
	        } else {
	            endCallback && endCallback(frag);
	        }
	    })();
	};
	
	function bind(node,handler,func){
		try{
			node.addEventListener(handler,func,false);
		}catch(e){
			node.attachEvent('on'+handler,function(){func.apply(node,arguments)});
		}
	};
	
	/*=================================
	 * 返回年月中所对应的天数
	 * 每个月的最后一天就是该月的天数，相当于下一个月的第一天的前一天
	 ===================================*/
	function getMonthDays(year,month){
		var date = new Date(year, month+1, 0);
		return date.getDate();
	};
	
	//输入年，月，日，得到星期几
	function getDay(year,month,date){
		var date = new Date(year, month, date);
		return date.getDay();
	};
	
	function empty(elem){
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
	};
	
	/*=================================
	 * 生成对应的caption
	 ===================================*/
	function createCaption(year,month,callback){
		table=document.createElement('table');
		
		var mon=DATA.lang==='en' ? DATA.month_name_en[month] : DATA.month_name_zh[month];
		var caption=document.createElement('caption');
		
		var html='<a href="javascript:;" class="p-calendar-prev" id="p_calendar_prev">&lt;</a>'+
		         '<span class="p-calendar-month" id="p_calendar_month" data-value="'+month+'">'+mon+'</span>'+
		         '<span class="p-calendar-year" id="p_calendar_year" data-value="'+year+'">'+year+'</span>'+
		         '<a href="javascript:;" class="p-calendar-next" id="p_calendar_next">&gt;</a>'+
				 '<ul class="p-calendar-months" style="display:none;" id="p_calendar_months"></ul>'+
				 '<ul class="p-calendar-years" style="display:none;" id="p_calendar_years"></ul>';
		
		asynInnerHTML(html, function(frag){
			caption.appendChild(frag);
		}, function(){
			table.appendChild(caption);
		
			if(typeof callback==='function'){
				callback();
			}
		});
	};//createCaption
	
	/*=================================
	 * 生成对应的thead
	 =================================*/
	function createThead(callback){
		var week = DATA.lang === 'en' ? DATA.thead_en : DATA.thead_zh;
		var thead = document.createElement('thead');
		var tr = document.createElement('tr');
		
		function insertTh(i){
			var th = document.createElement('th');
			th.innerHTML = week[i][0];
			th.title = week[i][1];
			th.className = 'p-calendar-' + DATA.thead_en[i][1];
			tr.appendChild(th);
		};
		
		for (var i = 0; i < 7; i++) {
			insertTh(i);
		}
		
		thead.appendChild(tr);
		table.appendChild(thead);
		if (typeof callback === 'function') {
			callback();
		}
	};//createThead
	
	/*=================================
	 * 生成对应的tbody
	 =================================*/
	function createTbody(year, month, callback){
		var tbody = document.createElement('tbody'), 
			//当前年月说对于的天数
			month_days = getMonthDays(year, month), 
			//从1开始
			month_days_i = 1, 
			//1号从哪里开始，也就是说，当前的年月1号是星期几
			//如果i_day=3 ，说明从星期3开始， j=3
			j_day = getDay(year, month, 1), 
			i, j, 
			//tbody里面tr的个数
			tr_amount = 6, 
			tr_temp, td_temp, 
			today = DATA.lang === 'en' ? 'Today' : '今天';
			
		//插入日期
		//当j==j_day时，运行callback
		//而且j==j_day只判断一次
		function insertDate(callback, j, j_day){
			if (j == j_day) {
				insertDate = function(callback){
					callback && callback();
				};
				insertDate(callback);
			}
		};
		
		//把6 -> 06
		function changeNumber(num){
			return num < 10 ? '0' + num : num;
		};//changeNumber

		//得到用户想要得到的日期格式
		function getUserDate(year, month, date){
			var r = DATA.format.match(/(\w+)/g);
			var r_split = DATA.format.match(/[^\w]/)[0];
			var result=[];
			
			for(var i=0;i<r.length;i++){
				switch(r[i]){
					case 'yyyy':
						result.push(year);break;
					case 'mm':
						result.push(changeNumber(month));break;
					case 'm':
						result.push(month);break;
					case 'dd':
						result.push(changeNumber(date));break;
					case 'd':
						result.push(date);break;
				}
			}
			
			return result.join(r_split);
		};
		
		//绑定日期的选择事件
		//绑定tbody事件就可以，然后用冒牌选择td里面的日期
		//主要还是解析日期的format
		function chooseDate(tbody, year, month, callback){
			bind(tbody, 'click', function(e){
				var d = getEventElement(e);
				if (d.nodeName == 'A' && d.className.indexOf('p-calendar-valid') > -1) {
					callback && callback( getUserDate(year, month+1,parseInt(d.getAttribute('data-date'),10)) );
				}
			});
		};//chooseDate
		
		//哪些日期是不能选择的
		//小于begin，大于end的，就不能选择。调用callback
		function checkInvalid(year, month, date, begin, end, callback){
			var now = new Date();
			begin = begin || [now.getFullYear(), now.getMonth(), now.getDate()];
			//9000年，肯定够了吧
			end = end || [9000, 12, 31];
			
			//小于begin的判断
			if (year < begin[0]) {
				callback && callback();
				return;
			} else if (year == begin[0] && month < begin[1]) {
				callback && callback();
				return;
			} else if (year == begin[0] && month == begin[1] && date < begin[2]) {
				callback && callback();
				return;
			}
			//大于end的判断
			if (year > end[0]) {
				callback && callback();
				return;
			} else if (year == end[0] && month > end[1]) {
				callback && callback();
				return;
			} else if (year == end[0] && month == end[1] && date > end[2]) {
				callback && callback();
				return;
			}
		};//checkInvalid
		
		//小于今天的不能用
		function beforeTodayInvalid(year, month, date, callback){
			checkInvalid(year, month, date, null, null, callback);
		};//beforeTodayInvalid
		
		//找出今天的日期
		function checkToday(year, month, date, callback){
			var now = new Date(), year_now = now.getFullYear(), month_now = now.getMonth(), date_now = now.getDate();
			if (year == year_now && month == month_now && date == date_now) {
				callback && callback();
			}
		};//checkToday

		for (i = 0; i < tr_amount; i++) {
			tr_temp = document.createElement('tr');
			for (j = 0; j < 7; j++) {
				td_temp = document.createElement('td');
				insertDate(function(){
					if (month_days_i <= month_days) {
						td_temp.innerHTML = '<a class="p-calendar-valid" href="javascript:;" data-date="'+month_days_i+'">' + month_days_i + '</a>';
						//如果是今天
						checkToday(year, month, month_days_i, function(){
							td_temp.innerHTML = '<a class="p-calendar-valid p-calendar-today" data-date="'+month_days_i+'" title="' + today + '" href="javascript:;">' + month_days_i + '</a>';
						});
						//小于今天不能选择
						beforeTodayInvalid(year, month, month_days_i, function(){
							td_temp.innerHTML = '<a class="p-calendar-invalid" data-date="'+month_days_i+'" href="javascript:;">' + month_days_i + '</a>';
						});
						//大于2012年1月1号的不能用
						//checkInvalid(year,month,month_days_i,null,[2012,0,1],function(){
						//	td_temp.innerHTML ='<a class="p-calendar-invalid" href="javascript:;">'+month_days_i+'</a>';
						//});
						month_days_i++;
					}
				}, j, j_day);
				tr_temp.appendChild(td_temp);
			}
			tbody.appendChild(tr_temp);
		}

		//日期的选择事件绑定
		chooseDate(tbody, year, month,function(s){
			//alert(s);
			document.getElementById('date').value=s;
		});
		
		table.appendChild(tbody);
		empty(wrap);
		wrap.appendChild(table);
		bind(wrap, 'click', function(){
			hide(document.getElementById('p_calendar_months'));
			hide(document.getElementById('p_calendar_years'));
		});
		callback && callback(wrap);
	};//end createTbody
	
	/*=================================
	 * 根据年月生成对应的日历
	 =================================*/
	function createCalendar(year,month){
		
		createCaption(year, month, function(){
			createThead(function(){
				createTbody(year, month, function(wrap){
					if(DATA.node!==false){
						var node_width=Fuee(DATA.node).getElemHeightWidth().width,
							node_height=Fuee(DATA.node).getElemHeightWidth().height,
							node_left=Fuee(DATA.node).getPosition().left,
							node_top=Fuee(DATA.node).getPosition().top;
						
						wrap.style.left=node_left+'px';
						wrap.style.top=node_top+node_height+'px';
					}
					
					
					document.body.appendChild(wrap);
					changeDate();
					
				});
			});
		});
	};//createCalendar
	
	/*=================================
	 * 改变月，年，左右方向键
	 * 
	 * 绑定左右的方向按钮，改变月份
	 * 绑定月，年的选择
	 =================================*/
	function changeDate(){
		var prev=document.getElementById('p_calendar_prev'),
			next=document.getElementById('p_calendar_next'),
			
			months=document.getElementById('p_calendar_months'),
			years=document.getElementById('p_calendar_years'),
			
			month=document.getElementById('p_calendar_month'),
			year=document.getElementById('p_calendar_year'),
			month_value=+month.getAttribute('data-value'),
			year_value=+year.getAttribute('data-value');
		
		//前一个月
		bind(prev,'click',function(e){
			stopBubble(e);
			if (month_value == 0) {
				month_value = 11;
				year_value--;
			} else {
				month_value--;
			}
			createCalendar(year_value, month_value);
		});
		
		//后一个月
		bind(next,'click',function(e){
			stopBubble(e);
			if (month_value == 11) {
				month_value = 0;
				year_value++;
			} else {
				month_value++;
			}
			createCalendar(year_value, month_value);
		});
		
		//点击了选择月份
		bind(month,'click',function(e){
			stopBubble(e);
			empty(months);
			var li, a;
			for (var i = 0; i < 12; i++) {
				li = document.createElement('li');
				a = document.createElement('a');
				a.innerHTML = i + 1;
				a.href = 'javascript:;';
				if (i == month_value) {
					a.className = 'current';
				}
				li.appendChild(a);
				months.appendChild(li);
				(function(i){
					bind(a, 'click', function(){
						createCalendar(year_value, i);
					});
				})(i);
			}
			show(months);
			hide(years);
		});
		
		//点击了选择年份
		bind(year,'click',function(e){
            stopBubble(e);
            empty(years);
            var li, a;
            for (var i = year_value - 4; i < year_value + 5; i++) {
                li = document.createElement('li');
                a = document.createElement('a');
                a.innerHTML = i;
                a.href = 'javascript:;';
                if (i == year_value) {
                    a.className = 'current';
                }
                li.appendChild(a);
                years.appendChild(li);
                (function(i){
                    bind(a, 'click', function(){
                        createCalendar(i, month_value);
                    });
                })(i);
            }
            show(years);
            hide(months);
		});
	};//changeDate
	
	return function(){
		var date=new Date();
		var year=date.getFullYear();
		var month=date.getMonth();
		
		
		
		//createCalendar(2012,0);
		createCalendar(year,month);
	}
	
};
