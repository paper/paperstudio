/*
 * @Author paper
 * @Email: zhang.binjue@gmail.com
 * @Blog : paperagain.diandian.com
 * @Intro: 简约又简单的日历控件
 * 
 * v3.1 
 * 增加一个黑色主题，而且修改了一些代码。
 * 主要是针对IE6 iframe的添加
 */
(function(window, undefined){
    var doc = document, FueeDOM = window.FueeDOM = function(name){
        return new FueeDOM.fn(name);
    };
    
    FueeDOM.fn = FueeDOM.prototype = function(name){
		this.elem=typeof name==='string' ? doc.getElementById(name) : name;
    };
    
    FueeDOM.fn.prototype = {
        css: function(prop){
            var elem = this.elem;
			
            if (elem.nodeType != 1) return;
            
            if (elem.style[prop]) return elem.style[prop];
            else if (elem.currentStyle) {
                //IE
                if (prop == "float") prop = "styleFloat";
                
                return elem.currentStyle[prop];
            } else if (doc.defaultView && doc.defaultView.getComputedStyle) {
                //W3C
                if (prop == "float") prop = "cssFloat";
                
                return doc.defaultView.getComputedStyle(elem, null)[prop];
            } else { return; }
        },
        
        getPosition: function(){
            var elem = this.elem, 
				ua = navigator.userAgent.toLowerCase();
            if (!elem.parentNode) return false;
            
            var parent = null, pos = [], box;
            
            //IE ,ff,chrome
            if (elem.getBoundingClientRect) {
                box = elem.getBoundingClientRect();
                var scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop), 
					scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
				
                return {
                    left: box.left + scrollLeft,
                    top: box.top + scrollTop
                };
            }            
			// gecko
            else if (doc.getBoxObjectFor) {
                box = doc.getBoxObjectFor(el);
                var borderLeft = (elem.style.borderLeftWidth) ? parseInt(elem.style.borderLeftWidth) : 0;
                var borderTop = (elem.style.borderTopWidth) ? parseInt(elem.style.borderTopWidth) : 0;
                pos = [box.x - borderLeft, box.y - borderTop];
            }            
			// safari
            else {
                pos = [elem.offsetLeft, elem.offsetTop];
                parent = elem.offsetParent;
                
                if (parent != elem) {
                    while (parent) {
                        pos[0] += parent.offsetLeft + parseInt(FueeDOM(parent).css("borderLeft")) || 0;
                        pos[1] += parent.offsetTop + parseInt(FueeDOM(parent).css("borderTop")) || 0;
                        parent = parent.offsetParent;
                    }
                }
                
                if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && elem.style.position == 'absolute')) {
                    pos[0] -= doc.body.offsetLeft;
                    pos[1] -= doc.body.offsetTop;
                }
            }
            
            parent = elem.parentNode;
            while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
                pos[0] -= parent.scrollLeft;
                pos[1] -= parent.scrollTop;
                if (parent.parentNode) {
                    parent = parent.parentNode;
                } else {
                    parent = null;
                }
            }
            
            return {
                left: pos[0],
                top: pos[1]
            };
        },
        
        getElemHeightWidth: function(){
            var elem = this.elem;
            
            return {
				height: elem.offsetHeight || parseInt(FueeDOM(elem).css("height")),
				width: elem.offsetWidth || parseInt(FueeDOM(elem).css("width"))
			}
        },
        
        getElemContentHeightWidth: function(){
            var elem = this.elem, 
				fourWay = ["Left", "Right", "Top", "Bottom"], 
				padding = [], 
				border = [];
           
            for (var i = 0; i < fourWay.length; i++) {
                padding[i] = parseInt(FueeDOM(elem).css("padding" + fourWay[i])) || 0;
                border[i] = parseInt(FueeDOM(elem).css("border" + fourWay[i] + "Width")) || 0;
            }
			
            return {
                width: FueeDOM(elem).getElemHeightWidth().width - padding[0] - padding[1] - border[0] - border[1],
                height: FueeDOM(elem).getElemHeightWidth().height - padding[2] - padding[3] - border[2] - border[3]
            }
        },
		
		height:function(){
			return FueeDOM(this.elem).getElemHeightWidth().height;
		},

		width:function(){
			return FueeDOM(this.elem).getElemHeightWidth().width;
		},
		
		left:function(){
			return FueeDOM(this.elem).getPosition().left;
		},
		top:function(){
			return FueeDOM(this.elem).getPosition().top;
		}
    };//end FueeDOM.fn.prototype
})(this, undefined);

(function(window,undefined){
	var doc = document, wrap , table , iframe,
		isIE = (function(){
		    var v = 3,
		        div = doc.createElement('div'),
		        all = div.getElementsByTagName('i');
		 
		    while (
		        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		        all[0]
		    );
		 
		    return v > 4 ? v : undefined;
		}()),
	
		PCalendar = window.PCalendar = function(para){
        	var obj=para || {},
			
			//函数必须传入当前的DATA作为参数，不然的话会被后面的PCalendar函数里面的参数覆盖掉！！！
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
				
				//一般是指input节点,必须
				'node':$(obj.node),
				
				//日历语言			
				'lang':obj.lang || 'zh',
				
				//设置日历的位置，默认是bottom。还有right设置
				'position' : obj.position || 'bottom',
				
				//默认选择全部日历。
				//如果你想:今天以前的都不能选，把它设置为false
				'allValide': obj.allValide===false ? false : true,
				
				 //yyyy-mm-dd -> 2011-06-05 ; yyyy-m-d -> 2011-6-5 ; yyyy/mm/dd -> 2011/06/05
				'format':obj.format || 'yyyy-mm-dd',
				
				//级联节点
				//Ex: 	'beginDateNode':'beginNodeId' ; 'endDateNode':'endNodeId'
				'beginDateNode':$(obj.beginDateNode) || null,
				'endDateNode':$(obj.endDateNode) || null,
				
				//自定义上下限
				//Ex: 	'beginDate':[2010,5,4] ; 'endDate':[2012,12,1] 
				'beginDate':obj.beginDate || null,
				'endDate':obj.endDate || null,
				
				//点击日期的回调函数
				//Ex:	'callback':function(formatString){...};
				'callback':obj.callback || null,
				
				//点击清空日期的回调函数
				//Ex:	'clearCallback':function(){...};
				'clearCallback':obj.clearCallback || null
			};
			
			//这里传入的DATA！
			init(DATA);
    	};
		
	function $(elem){
		return typeof elem==='string' ? doc.getElementById(elem) : elem;
	};
	
	function hide(elem){
		$(elem).style.display='none';
	};
	
	function show(elem){
		$(elem).style.display='block';
	};
	
	function remove(elem){
		var el=$(elem);
		if(el && el.parentNode) el.parentNode.removeChild(el);
		el=null;
	};
	
	 //清空一个节点
    function empty(elem){
        el = $(elem);
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    };
	
    //判断是不是函数
    function isFunction(func){
        return typeof func === "function";
    };
	
	function target(e){
		e = e || window.event;
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
	
	function bind(elem, handler, func){
		try {
			elem.addEventListener(handler, func, false);
		} catch (e) {
			elem.attachEvent('on' + handler, function(){
				func.apply(elem, arguments);
			});
		}
	};
	
	function addClass(node,name){
		var old=node.className;
		
		if(old.indexOf(name)==-1){
			node.className=(old+" "+name);
		}
	};
	
	function removeClass(node,name){
		var old=node.className;
		
		node.className=old.replace(name,'');
	};
	
	//返回年月中所对应的天数. 每个月的最后一天就是该月的天数，相当于下一个月的第一天的前一天
    function getMonthDays(year, month){
        var date = new Date(year, month + 1, 0);
        return date.getDate();
    };
	
    //输入年，月，日，得到星期几
    function getDay(year, month, date){
        var date = new Date(year, month, date);
        return date.getDay();
    };
   
	/*=================================
	 * 根据年月，生成对应的caption
	 * 左右箭头换月份导航+月份选择+年份选择
	 ===================================*/
	function createCaption (this_DATA,year, month, callback){
		table = document.createElement('table');
		var caption = document.createElement('caption');
		
		var prev_title,next_title,mon;
		if(this_DATA.lang==='en'){
			prev_title='Last month';
			next_title='Next month';
			
			mon=this_DATA.month_name_en[month];
		}else{
			prev_title='上个月';
			next_title='下个月';
			
			mon=this_DATA.month_name_zh[month];
		}
		
		var html =  '<a id="p_calendar_prev" href="javascript:;" title="'+prev_title+'" class="p-calendar-prev" >&lt;</a>' +
					'<span id="p_calendar_month" class="p-calendar-month" data-value="'+month+'">'+mon+'</span>' +
					'<span id="p_calendar_year" class="p-calendar-year" data-value="'+year+'">'+year+'</span>' +
					'<a id="p_calendar_next" href="javascript:;" title="'+next_title+'" class="p-calendar-next">&gt;</a>' +
					'<ul id="p_calendar_months" class="p-calendar-months" style="display:none;"></ul>' +
					'<ul id="p_calendar_years" class="p-calendar-years" style="display:none;"></ul>';
		
		asynInnerHTML(html, function(frag){
			caption.appendChild(frag);
		}, function(){
			table.appendChild(caption);
			isFunction(callback) && callback();
		});
	};
	
	//生成对应的thead, 星期内容(日，六...)
	function createThead (this_DATA,callback){
	    var week = this_DATA.lang === 'en' ? this_DATA.thead_en : this_DATA.thead_zh,
	    	thead = doc.createElement('thead'),
	    	tr = doc.createElement('tr'),
	    	th;
		
	    function insertTh(i){
	        th = doc.createElement('th');
	        th.innerHTML = week[i][0];
	        th.title = week[i][1];
	        th.className = 'p-calendar-' + this_DATA.thead_en[i][1];
	        tr.appendChild(th);
	    };
	    
	    for (var i = 0; i < 7; i++) {
	        insertTh(i);
	    }
	   
	    thead.appendChild(tr);
	    table.appendChild(thead);
		
	    isFunction(callback) && callback();
	};
	
	/*==========================================
	 * 生成对应的tbody，td里面a的内容
	 ===========================================*/
	function createTdContent(){
		return {
			normal:function(i){
				return '<a href="javascript:;" data-date="'+i+'">' + i + '</a>';
			}
		}
	};
	
	//生成对应的tbody
	function createTbody(this_DATA,year,month,callback){
		var tbody = document.createElement('tbody'), 
			tdContent=createTdContent(),
	
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
			
			today_word,
			clear_title_word,
			clear_word,
			
			dateRange=getDateRange();
		
		if(this_DATA.lang==='en'){
			today_word='Today';
			clear_title_word='Clear date';
			clear_word='C';
		}else{
			today_word='今天';
			clear_title_word='清空日期';
			clear_word='清';
		}
		
		//插入日期,当j==j_day时，运行callback,而且j==j_day只判断一次
		function insertDate(callback,condition){
			if (condition) {
				insertDate = function(callback){
					isFunction(callback) && callback();
				};
				insertDate(callback);
			}
		};
		
		//小于今天的不能用
		function beforeTodayInvalid(year, month, date, callback){
			var now=new Date();
			
			checkInvalid(year, month, date, [now.getFullYear(),now.getMonth(),now.getDate()], null, callback);
		};
		
		//判断input框里面是否有了临时数据。
		//有就返回临时数据，反之返回无限小，或者无限大
		function getTimeRange(elem){
			return getTime(null,elem,0,0,0);
		};
		
		//大于设置了begin节点的日期
		function greaterThanBegin(beginNode,year,month,date,callback){
			var time=getTimeRange(beginNode);

			if(time===null){
				checkInvalid(year, month, date, null, null, callback);
			}else{
				var year_begin=time.year,
					month_begin=time.month,
					date_begin=time.date;
				
				checkInvalid(year, month, date, [year_begin,month_begin,date_begin], null, callback);
			}
		};
		
		//小于设置了end节点的日期
		function lessThanEnd(endNode,year,month,date,callback){
			var time=getTimeRange(endNode);
			
			if(time===null){
				checkInvalid(year, month, date, null, null, callback);
			}else{
				var year_end=time.year,
					month_end=time.month,
					date_end=time.date;
					
				checkInvalid(year, month, date, null, [year_end,month_end,date_end], callback);
			}
		};
		
		//设置td为无效日期
		function invaild(td){
			removeClass(td,'p-calendar-valid');
			addClass(td,'p-calendar-invalid');
		};
		
		//因为传进来的月份大了1，所以要减回来
		function getDateRange(){
			var beginDate=this_DATA.beginDate,
				endDate=this_DATA.endDate;
			
			if(beginDate!==null){
				beginDate=[beginDate[0],beginDate[1]-1,beginDate[2]];
			}
			
			if(endDate!==null){
				endDate=[endDate[0],endDate[1]-1,endDate[2]];
			}
			
			return{
				'beginDate':beginDate,
				'endDate':endDate
			}
		};
		
		//创建td
		for (i = 0; i < tr_amount; i++) {
			tr_temp = document.createElement('tr');
			for (j = 0; j < 7; j++) {
				td_temp = document.createElement('td');
				
				insertDate(function(){
					if (month_days_i <= month_days) {
						addClass(td_temp,'p-calendar-valid');
						td_temp.innerHTML = tdContent.normal(month_days_i);
						
						//如果是今天
						findToday(year, month, month_days_i, function(){
							addClass(td_temp,'p-calendar-today');
							td_temp.title=today_word;
						});
						
						//找到当前
						findCurrent(this_DATA,year,month,month_days_i,function(){
							addClass(td_temp,'p-calendar-current');
						});
						
						//小于今天不能选择
						if(!this_DATA.allValide){
							beforeTodayInvalid(year, month, month_days_i, function(){
								invaild(td_temp);
							});
						}
				
						//如果它必须大于某个begin节点
						if(this_DATA.beginDateNode){
							greaterThanBegin(this_DATA.beginDateNode,year, month, month_days_i,function(){
								invaild(td_temp);
							});
						}
						
						//如果它必须大于某个end节点
						if(this_DATA.endDateNode){
							lessThanEnd(this_DATA.endDateNode,year, month, month_days_i,function(){
								invaild(td_temp);
							});
						}
						
						//手动设置了日期的上限和下限
						checkInvalid(year, month, month_days_i,dateRange.beginDate,dateRange.endDate,function(){
							invaild(td_temp);
						});
						
						month_days_i++;
					}
				},(j==j_day));
				
				//最后一个格子放：清空日期
				if(i==tr_amount-1 && j==6){
					addClass(td_temp,'p-calendar-clear');
					td_temp.title=clear_title_word;
					td_temp.innerHTML ='<a href="javascript:;">'+clear_word+'</a>';
				}
				
				tr_temp.appendChild(td_temp);
			}
			
			tbody.appendChild(tr_temp);
		}//end for
		
		table.appendChild(tbody);
		empty(wrap);
		wrap.appendChild(table);
		
		//点击（选择）日期的事件绑定
		chooseDate(this_DATA,tbody,year, month,function(date_format){
			isFunction(this_DATA.callback) && this_DATA.callback.call(wrap,date_format);
		});
		
		isFunction(callback) && callback(wrap);
	};//end createTbody
	
	function hackForIE(left,top){
		if(isIE==6){
			var width=FueeDOM(wrap).width(),
				height=FueeDOM(wrap).height();
				
			var frame='<iframe id="pcalendar_iframe" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="height:' +
            ''+height+'px;width:'+width+'px;z-index:9998;left:'+left+';top:'+top+';position:absolute;"><\/iframe>';
			
			asynInnerHTML(frame,function(frag){
				doc.body.appendChild(frag);
			},function(){
				iframe=document.getElementById("pcalendar_iframe");
			});
		}
	};
	
	// 根据年月生成对应的日历
	function createCalendar(this_DATA,year,month,callback){
		createCaption(this_DATA,year, month, function(){
			
			createThead(this_DATA,function(){
				
				createTbody(this_DATA,year, month, function(wrap){	
					doc.body.appendChild(wrap);
					
					changeDateBind(this_DATA);
					isFunction(callback) && callback.call(this_DATA);
				});
			});
		});
	};
	
	//找出今天的日期.如果是今天，就调用callback
	function findToday(year, month, date, callback){
		var now = new Date(), 
			year_now = now.getFullYear(), 
			month_now = now.getMonth(),
			date_now = now.getDate();
			
		if (year == year_now && month == month_now && date == date_now) {
			isFunction(callback) && callback();
		}
	};
	
	//如果year, month,date和节点的临时存储日期相同时，调用callback
	function findCurrent(this_DATA,year, month,date,callback){
		var time=getTime(this_DATA);
		var year_c=time.year;
		var month_c=time.month;	
		var date_c=time.date;	
		
		if (year == year_c && month == month_c && date == date_c) {
			isFunction(callback) && callback();
		}
	};
	
	/*===================================================
	 * 改变月，年，左右方向键
	 * 
	 * 绑定左右的方向按钮，改变月份
	 * 绑定月，年的选择
	 * 
	 * wrap,document的事件绑定
	 ===================================================*/
	function changeDateBind(this_DATA){
		var prev=$('p_calendar_prev'),
			next=$('p_calendar_next'),
			
			months=$('p_calendar_months'),
			years=$('p_calendar_years'),
			
			month=$('p_calendar_month'),	
			year=$('p_calendar_year'),
			month_value=+month.getAttribute('data-value'),
			year_value=+year.getAttribute('data-value');
	        
	    //前一个月
	    bind(prev, 'click', function(e){
	        if (month_value == 0) {
	            month_value = 11;
	            year_value--;
	        } else {
	            month_value--;
	        }
	
	        createCalendar(this_DATA,year_value, month_value);
	    });
	    
	    //后一个月
	    bind(next, 'click', function(e){
	        if (month_value == 11) {
	            month_value = 0;
	            year_value++;
	        } else {
	            month_value++;
	        }
			
	        createCalendar(this_DATA,year_value, month_value);
	    });
	    
	    //点击了选择月份
	    bind(month, 'click', function(e){
			stopBubble(e);	
	        empty(months);
			
	        var li, a;
	        for (var i = 0; i < 12; i++) {
	            li = doc.createElement('li');
	            a = doc.createElement('a');
	            a.innerHTML = i + 1;
	            a.href = 'javascript:;';
	            if (i == month_value) {
	                a.className = 'current';
	            }
	            li.appendChild(a);
	            months.appendChild(li);
	            (function(i){
	                bind(a, 'click', function(){
	                    createCalendar(this_DATA,year_value, i);
	                });
	            })(i);
	        }
			
	        show(months);
	        hide(years);
	    });
	    
	    //点击了选择年份
	    bind(year, 'click', function(e){
			stopBubble(e);
			
			empty(years);
			
	        var li, a;
	        for (var i = year_value - 5; i < year_value + 6; i++) {
	            li = doc.createElement('li');
	            a = doc.createElement('a');
	            a.innerHTML = i;
	            a.href = 'javascript:;';
	            if (i == year_value) {
	                a.className = 'current';
	            }
	            li.appendChild(a);
	            years.appendChild(li);
	            (function(i){
	                bind(a, 'click', function(){
	                    createCalendar(this_DATA,i, month_value);
	                });
	            })(i);
	        }
			
	        show(years);
	        hide(months);
	    });
		
		//点击wrap隐藏months，years
		bind(wrap, 'click', function(e){
			stopBubble(e);
			
			hide(months);
			hide(years);
			
			show(wrap);
		});
		
		//点击doc移除wrap
		bind(doc, 'click', function(e){
			remove(wrap);
			remove(iframe);
		});
		
	};//changeDateBind
	
	//得到用户想要得到的日期格式
	function getUserDate (this_DATA,year, month, date){
	    var formats =this_DATA.format.match(/(\w+)/g),
	   		format_split = this_DATA.format.match(/[^\w]/)[0],
	    	result = [],
			objResult={};
	    
	    //比如：把6 -> 06
	    function changeNumber(num){
	        return num < 10 ? '0' + num : num;
	    };
	    
	    for (var i = 0, len = formats.length; i < len; i++) {
	        switch (formats[i]) {
	            case 'yyyy':
	                result.push(year);
					objResult['year']=year;
	                break;
	            case 'mm':
	                result.push(changeNumber(month));
					objResult['month']=changeNumber(month-1);
	                break;
	            case 'm':
	                result.push(month);
					//这里获得的数据是用来处理的，所以要减一
					objResult['month']=month-1;
	                break;
	            case 'dd':
	                result.push(changeNumber(date));
					objResult['date']=changeNumber(date);
	                break;
	            case 'd':
	                result.push(date);
					objResult['date']=date;
	                break;
	        }
	    }
	    
	    return{
			'formatString':result.join(format_split),
			'formatObject':objResult
		}
	};
	
	//绑定日期的选择事件
	//绑定tbody事件就可以，然后用冒泡选择td里面的日期
	//主要还是解析日期的format
	function chooseDate(this_DATA,tbody, year, month, callback){
		bind(tbody, 'click', function(e){
			stopBubble(e);
			
			var a_date = target(e),
			 	td_date = a_date.parentNode,
			 	userdate = getUserDate(this_DATA,year, month+1,parseInt(a_date.getAttribute('data-date'),10)),
				node=this_DATA.node;
			
			//赋值
			if (td_date.className.indexOf('p-calendar-valid') > -1 && a_date.nodeName.toLowerCase() === 'a') {
				//给节点设置属性
				setNodeAttribute(this_DATA,userdate.formatObject);
				
				//赋值到节点里面
				if(node.nodeName.toLowerCase()=='input' && node.type=='text'){
					node.value=userdate.formatString;
				}
				
				isFunction(callback) && callback( userdate.formatString );
				
				remove(wrap);
				remove(iframe);
			}
			
			//清空日期
			if (td_date.className.indexOf('p-calendar-clear') > -1 && a_date.nodeName.toLowerCase() === 'a') {
				clearDate(this_DATA,userdate.formatObject,this_DATA.clearCallback);
				
				remove(wrap);
				remove(iframe);
			}

		});
	};

	//给节点写上data-year,data-month,data-date这些属性。方便以后使用这些数据
	function setNodeAttribute(this_DATA,formatObject){
		var node=this_DATA.node;
		
		for(var i in formatObject){
			node.setAttribute('data-'+i,formatObject[i]);
		}
	};
	
	function clearDate(this_DATA,formatObject,callback){
		var node=this_DATA.node;
		
		//如果是input输入框
		if(node.nodeName.toLowerCase()=='input' && node.type=='text'){
			node.value='';
		}
		
		for(var i in formatObject){
			node.removeAttribute('data-'+i);
		}
		
		isFunction(callback) && callback();
	};
	
	//哪些日期是不能选择的
	//小于begin，大于end，就不能选择（变灰），调用callback处理
	function checkInvalid(year, month, date, begin, end, callback){
		//默认是无限小
		begin = begin===undefined ? null : begin;
		
		//默认是无限大
		end = end===undefined ? null : end;
		
		if (begin !== null) {
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
		}
		
		if (end !== null) {
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
		}
	};//checkInvalid
	
	//设置日历的位置
	function setCalendarPosition(this_DATA){
		var position=this_DATA.position,
			Fnode=FueeDOM(this_DATA.node),
			node_width=Fnode.width(),
			node_height=Fnode.height(),
			node_left=Fnode.left(),
			node_top=Fnode.top();
	
		if(position==='bottom'){
			wrap.style.left=node_left+'px';
			wrap.style.top=node_height+node_top+1+'px';
		}else if(position==='right'){
			wrap.style.left=node_left+node_width+1+'px';
			wrap.style.top=node_top+1+'px';
		}
	};
	
	//判断input框里面是否有了临时数据,不然就返回临时数据，否则设置的year,month,date，如果没有设置，就返回今天的年月日
	function getTime(this_DATA,elem,year,month,date){
		var node=elem===undefined ? this_DATA.node:elem,
			now=new Date(),
			
			//month，date有可能是0，所以使用:month=month || now.getMonth() 是不合理的
			//所以下面的表达方式虽然长了点，但是很保险！也能清晰，方便理解！
			year_n=typeof year!=='number' ? now.getFullYear() : year,
			month_n=typeof month!=='number' ? now.getMonth() : month,
			date_n=typeof date!=='number' ? now.getDate() : date,
			
			year_o=node.getAttribute('data-year')?+node.getAttribute('data-year') : year_n,
	 		month_o=node.getAttribute('data-month')?+node.getAttribute('data-month') : month_n,
			date_o=node.getAttribute('data-date')?+node.getAttribute('data-date') : date_n;
		
		if(year_o===0 && month_o===0 && date_o===0){
			return null;
		}
		
		return {
			year:year_o,
			month:month_o,
			date:date_o
		}
	};
	
	//初始化
	function init(this_DATA){
		var node=this_DATA.node;
		node.autocomplete='off';
		node.setAttribute('readonly','readonly');
		
		bind(node,'click',function(e){
			stopBubble(e);
			
			remove(wrap);
			remove(iframe);
			
			//日历最外面的div容器
			wrap=document.createElement('div');
			wrap.className='p-calendar';
			hide(wrap);
		
			//当input里面没有数据时，默认是取今天。
			var time=getTime(this_DATA);
			var year=time.year;
			var month=time.month;
	
			createCalendar(this_DATA,year,month,function(){
				setCalendarPosition(this_DATA);
				show(wrap);
				
				setTimeout(function(){
					hackForIE(wrap.style.left,wrap.style.top);
				},10);
			});
		});
		
	};
	
})(this,undefined);

