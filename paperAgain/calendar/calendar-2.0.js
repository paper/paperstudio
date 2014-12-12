
/*
 * @Author paper
 * @Email: zhang.binjue@gmail.com
 * 
 * @Intro: 日历控件
 * 
 * moneth 都是从0开始，到11结束的。
 * 使用了FueeDOM
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
            
            if (typeof prop == "string") {
                
                if (elem.nodeType != 1) return;
                
                if (elem.style[prop]) return elem.style[prop];
                else if (elem.currentStyle) {
                    //IE
                    if (prop == "float") prop = "styleFloat";
                    
                    return elem.currentStyle[prop];
                } else if (doc.defaultView && doc.defaultView.getComputedStyle) {
                    //W3C
                    if (prop == "float") prop = "cssFloat";
                    
                    if (prop != "display" && (elem.style.display == "none" || doc.defaultView.getComputedStyle(elem, null)["display"] == "none")) {
                        FueeDOM(elem).bestDisplay();
                        var t = doc.defaultView.getComputedStyle(elem, null)[prop];
                        elem.style.display = "none";
                        return t;
                    }
                    
                    return doc.defaultView.getComputedStyle(elem, null)[prop];
                } else { return null; }
            } else {
                FueeDOM(elem).each(function(){
                    for (var i in prop) {
                        if (i == "opacity") this.style.filter = "alpha(opacity=" + prop[i] * 100 + ")";
                        this.style[i] = prop[i];
                    }
                });
                
                return FueeDOM(elem);
            }
        },
        
        each: function(callback){
            return FueeDOM.each(this.elem, callback);
        },
        
        //这个函数得到的位置是相对body的位置，如果它的父亲节点还有relative或者absolute的话，还得注意它最近父亲节点的位置
        //the elem is single
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
                
                if (ua.indexOf('opera') != -1 ||
                (ua.indexOf('safari') != -1 && elem.style.position == 'absolute')) {
                    pos[0] -= doc.body.offsetLeft;
                    pos[1] -= doc.body.offsetTop;
                }
            }
            
            parent = elem.parentNode;
            // account for any scrolled ancestors
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
			return FueeDOM(this.elem).getElemContentHeightWidth().height;
		},
		innerHeight:function(){
			
		},
		outerHeight:function(){
			return FueeDOM(this.elem).getElemHeightWidth().height;
		},
		
		width:function(){
			return FueeDOM(this.elem).getElemContentHeightWidth().width;
		},
		innerWidth:function(){
			
		},
		outerWidth:function(){
			return FueeDOM(this.elem).getElemHeightWidth().width;
		},
		
		left:function(){
			return FueeDOM(this.elem).getPosition().left;
		},
		
		top:function(){
			return FueeDOM(this.elem).getPosition().top;
		}
    };//end FueeDOM.fn.prototype
    
    FueeDOM.each = function(r, callback){
        var tr = [];
       
        r.length === undefined ? tr.push(r) : tr = r;
        
        var i = 0, length = tr.length;
       
        for (var value = tr[0]; i < length && callback.call(value, i) !== false; value = tr[++i]) {}
    };
})(window, undefined);

function PCalendar(para){
	var that=this;
	
	this.obj=para || {};
	this.wrap;
	this.table;
	
	this.DATA={
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
					
		'lang':this.obj.lang || 'zh',
		
		//设置日历的位置，默认是下。
		//还有right设置
		'position' : this.obj.position || 'bottom',
		
		//默认不能选择全部日历，今天以前的都不能选。
		//如果你想选择全部日期的话，把它设置为true
		'chooseAll': this.obj.chooseAll || false,
		
		 //yyyy-mm-dd 2011-06-05 ; yyyy-m-d 2011-6-5 ; yyyy/mm/dd 2011/06/05
		'format':this.obj.format || 'yyyy-mm-dd',
		
		//一般是指input节点
		'node':this.$id(this.obj.node) || false,
		
		//点击日期的回调函数
		'callback':this.obj.callback || false
	}
	
	this.init();
};

//初始化
PCalendar.prototype.init=function(){
	//日历最外面的div容器
	this.wrap=document.createElement('div');
	this.wrap.className='p-calendar';
	
	var that=this,
		date=new Date(),
		year=date.getFullYear(),
	 	month=date.getMonth(),
		node=that.DATA.node;

	that.bind(node,'click',function(){
		that.createCalendar(year,month,function(){
			that.setCalendarPosition();
			that.show(that.wrap);
		});
	});
};

//设置日历的位置
PCalendar.prototype.setCalendarPosition=function(){
	var position=this.DATA.position,
		node=this.DATA.node,
		Fnode=FueeDOM(node),
		node_width=Fnode.outerWidth(),
		node_height=Fnode.outerHeight(),
		node_left=Fnode.left(),
		node_top=Fnode.top();
		
	if(position==='bottom'){
		this.wrap.style.left=node_left+'px';
		this.wrap.style.top=node_height+node_top+1+'px';
	}else if(position==='right'){
		this.wrap.style.left=node_left+node_width+1+'px';
		this.wrap.style.top=node_top+2+'px';
	}
};

PCalendar.prototype.$id=function(elem){
	return typeof elem==='string' ? document.getElementById(elem) : elem;
};

PCalendar.prototype.hide=function(elem){
	this.$id(elem).style.display='none';
};

PCalendar.prototype.remove=function(elem){
	elem=this.$id(elem);
	elem.parentNode.removeChild(elem);
};

PCalendar.prototype.show=function(elem){
	this.$id(elem).style.display='block';
};

PCalendar.prototype.target = function(e){
    e = e || window.event;
    return e.srcElement ? e.srcElement : e.target;
};

PCalendar.prototype.stopBubble = function(e){
    if (e && e.stopPropagation) {
        e.stopPropagation();
    } else {
        window.event.cancelBubble = true;
    }
};

PCalendar.prototype.asynInnerHTML = function(HTML, doingCallback, endCallback){
    var temp = document.createElement('div'), frag = document.createDocumentFragment();
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

PCalendar.prototype.bind = function(node, handler, func){
    try {
        node.addEventListener(handler, func, false);
    } catch (e) {
        node.attachEvent('on' + handler, function(){
            func.apply(node, arguments)
        });
    }
};

/*===========================================================
 * 返回年月中所对应的天数
 * 每个月的最后一天就是该月的天数，相当于下一个月的第一天的前一天
 ===========================================================*/
PCalendar.prototype.getMonthDays = function(year, month){
    var date = new Date(year, month + 1, 0);
    return date.getDate();
};

//输入年，月，日，得到星期几
PCalendar.prototype.getDay = function(year, month, date){
    var date = new Date(year, month, date);
    return date.getDay();
};

//清空一个节点
PCalendar.prototype.empty = function(elem){
	el=this.$id(elem);
	
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
};

//判断是不是函数
PCalendar.prototype.isFunction = function(func){
	return typeof func==="function";
};

/*=================================
 * 根据年月，生成对应的caption
 * 左右箭头换月份导航+月份选择+年份选择
 ===================================*/
PCalendar.prototype.createCaption = function(year, month, callback){
	var that=this;
	
	that.table = document.createElement('table');
	var caption = document.createElement('caption');
	
	var mon = that.DATA.lang === 'en' ? that.DATA.month_name_en[month] : that.DATA.month_name_zh[month];
	var html =  '<a id="p_calendar_prev" href="javascript:;" class="p-calendar-prev" >&lt;</a>' +
				'<span id="p_calendar_month" class="p-calendar-month" data-value="'+month+'">'+mon+'</span>' +
				'<span id="p_calendar_year" class="p-calendar-year" data-value="'+year+'">'+year+'</span>' +
				'<a id="p_calendar_next" href="javascript:;" class="p-calendar-next">&gt;</a>' +
				'<ul id="p_calendar_months" class="p-calendar-months" style="display:none;"></ul>' +
				'<ul id="p_calendar_years" class="p-calendar-years" style="display:none;"></ul>';
	
	that.asynInnerHTML(html, function(frag){
		caption.appendChild(frag);
	}, function(){
		that.table.appendChild(caption);
		
		that.isFunction(callback) && callback();
	});
};

/*=================================
 * 生成对应的thead
 * 星期内容
 =================================*/
PCalendar.prototype.createThead = function(callback){
	var that=this;
    var week = that.DATA.lang === 'en' ? that.DATA.thead_en : that.DATA.thead_zh;
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    var th;
	
    function insertTh(i){
        th = document.createElement('th');
        th.innerHTML = week[i][0];
        th.title = week[i][1];
        th.className = 'p-calendar-' + that.DATA.thead_en[i][1];
        tr.appendChild(th);
    };
    
    for (var i = 0; i < 7; i++) {
        insertTh(i);
    }
    
    thead.appendChild(tr);
    this.table.appendChild(thead);
	
    that.isFunction(callback) && callback();
};

/*==========================================
 * 生成对应的tbody，td里面a的内容
 ===========================================*/
PCalendar.prototype.createTdContent=function(){
	return {
		valid:function(i){
			return '<a class="p-calendar-valid" href="javascript:;" data-date="'+i+'">' + i + '</a>';
		},
		
		invalid:function(i){
			return  '<a class="p-calendar-invalid" data-date="'+i+'" href="javascript:;">' + i + '</a>';
		},
		
		today:function(i,today){
			return '<a class="p-calendar-valid p-calendar-today" data-date="'+i+'" title="' + today + '" href="javascript:;">' + i + '</a>';
		}
	}
};

/*==========================================
 * 生成对应的tbody
 ===========================================*/
PCalendar.prototype.createTbody=function(year, month, callback){
	var that=this;
	
	var tbody = document.createElement('tbody'), 
		
		tdContent=that.createTdContent(),
	
		//当前年月说对于的天数
		month_days = that.getMonthDays(year, month), 
		//从1开始
		month_days_i = 1, 
		//1号从哪里开始，也就是说，当前的年月1号是星期几
		//如果i_day=3 ，说明从星期3开始， j=3
		j_day = that.getDay(year, month, 1), 
		i, j, 
		//tbody里面tr的个数
		tr_amount = 6, 
		tr_temp, td_temp, 
		today = that.DATA.lang === 'en' ? 'Today' : '今天';
		
	//插入日期,当j==j_day时，运行callback,而且j==j_day只判断一次
	function insertDate(callback,condition){
		if (condition) {
			insertDate = function(callback){
				that.isFunction(callback) && callback();
			};
			insertDate(callback);
		}
	};
	
	//小于今天的不能用
	function beforeTodayInvalid(year, month, date, callback){
		that.checkInvalid(year, month, date, null, null, callback);
	};
	
	//创建td
	for (i = 0; i < tr_amount; i++) {
		tr_temp = document.createElement('tr');
		for (j = 0; j < 7; j++) {
			td_temp = document.createElement('td');
			
			insertDate(function(){
				if (month_days_i <= month_days) {
	
					td_temp.innerHTML = tdContent.valid(month_days_i);
					
					//如果是今天
					that.findToday(year, month, month_days_i, function(){
						td_temp.innerHTML = tdContent.today(month_days_i,today);
					});
					
					if(!that.DATA.chooseAll){
						//小于今天不能选择
						beforeTodayInvalid(year, month, month_days_i, function(){
							td_temp.innerHTML = tdContent.invalid(month_days_i);
						});
					}

					month_days_i++;
				}
			},(j==j_day));
			
			tr_temp.appendChild(td_temp);
		}
		tbody.appendChild(tr_temp);
	}//end for

	//点击（选择）日期的事件绑定
	that.chooseDate(tbody, year, month,function(date_format){
		var node=that.DATA.node;
		var wrap=that.wrap;
		var callback=that.DATA.callback;
		
		if(callback===false){
			node.value=date_format;
			that.remove(wrap);
			
		}else if(that.isFunction(callback)){
			callback.call(wrap,date_format);
		}
	});
	
	that.table.appendChild(tbody);
	that.empty(that.wrap);
	that.wrap.appendChild(that.table);

	that.isFunction(callback) && callback(that.wrap);
};//end createTbody

/*=========================================================
 * 根据年月生成对应的日历
 =========================================================*/
PCalendar.prototype.createCalendar=function(year,month,callback){
	var that=this;
	var node=that.DATA.node;
	
	that.createCaption(year, month, function(){
		that.createThead(function(){
			that.createTbody(year, month, function(wrap){
				document.body.appendChild(wrap);
				that.changeDate();
				
				that.isFunction(callback) && callback.call(node);
			});
		});
	});
};

/*===================================================
 * 改变月，年，左右方向键
 * 
 * 绑定左右的方向按钮，改变月份
 * 绑定月，年的选择
 ===================================================*/
PCalendar.prototype.changeDate=function(){
	var that=this,
		prev=that.$id('p_calendar_prev'),
		next=that.$id('p_calendar_next'),
		
		months=that.$id('p_calendar_months'),
		years=that.$id('p_calendar_years'),
		
		month=that.$id('p_calendar_month'),
		year=that.$id('p_calendar_year'),
		month_value=+month.getAttribute('data-value'),
		year_value=+year.getAttribute('data-value');
        
    //前一个月
    that.bind(prev, 'click', function(e){
       // that.stopBubble(e);
        
        if (month_value == 0) {
            month_value = 11;
            year_value--;
        } else {
            month_value--;
        }

        that.createCalendar(year_value, month_value);
    });
    
    //后一个月
    that.bind(next, 'click', function(e){
        //that.stopBubble(e);
        
        if (month_value == 11) {
            month_value = 0;
            year_value++;
        } else {
            month_value++;
        }
		
        that.createCalendar(year_value, month_value);
    });
    
    //点击了选择月份
    that.bind(month, 'click', function(e){
       // that.stopBubble(e);
        that.empty(months);
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
                that.bind(a, 'click', function(){
                    that.createCalendar(year_value, i);
                });
            })(i);
        }
        that.show(months);
        that.hide(years);
    });
    
    //点击了选择年份
    that.bind(year, 'click', function(e){
       // that.stopBubble(e);
        that.empty(years);
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
                that.bind(a, 'click', function(){
                    that.createCalendar(i, month_value);
                });
            })(i);
        }
        that.show(years);
        that.hide(months);
    });
	
	that.bind(that.wrap, 'click', function(){
		that.hide(months);
		that.hide(years);
	});
	
	that.bind(document, 'click', function(e){
		var elem=that.target(e);
		
	
			console.log(elem);
		
		
		
	});
	
};//changeDate

//得到用户想要得到的日期格式
PCalendar.prototype.getUserDate = function(year, month, date){
    var formats = this.DATA.format.match(/(\w+)/g);
    var format_split = this.DATA.format.match(/[^\w]/)[0];
    var result = [];
    
    //比如：把6 -> 06
    function changeNumber(num){
        return num < 10 ? '0' + num : num;
    };
    
    for (var i = 0, len = formats.length; i < len; i++) {
        switch (formats[i]) {
            case 'yyyy':
                result.push(year);
                break;
            case 'mm':
                result.push(changeNumber(month));
                break;
            case 'm':
                result.push(month);
                break;
            case 'dd':
                result.push(changeNumber(date));
                break;
            case 'd':
                result.push(date);
                break;
        }
    }
    
    return result.join(format_split);
};

//绑定日期的选择事件
//绑定tbody事件就可以，然后用冒牌选择td里面的日期
//主要还是解析日期的format
PCalendar.prototype.chooseDate=function(tbody, year, month, callback){
	var that=this;
	
	that.bind(tbody, 'click', function(e){
		var a_date = that.target(e);
		
		if (a_date.className.indexOf('p-calendar-valid') > -1 && a_date.nodeName.toLowerCase() === 'a') {
			that.isFunction(callback) && callback( that.getUserDate(year, month+1,parseInt(a_date.getAttribute('data-date'),10)) );
		}
	});
};

//哪些日期是不能选择的
//小于begin，大于end，就不能选择（变灰），调用callback处理
PCalendar.prototype.checkInvalid=function(year, month, date, begin, end, callback){
	var now = new Date();
	
	//默认是今天
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

//找出今天的日期
PCalendar.prototype.findToday=function(year, month, date, callback){
	var now = new Date(), 
		year_now = now.getFullYear(), 
		month_now = now.getMonth(),
		date_now = now.getDate();
		
	if (year == year_now && month == month_now && date == date_now) {
		this.isFunction(callback) && callback();
	}
};

//判断条件condition是否为true，如果为true，就执行func
//如果再次调用checkOnce就不必再次判断condition的值，直接执行func
//相当于，func被门关到"小黑屋"，打开门后，func就一直都是自由了。
//PCalendar.prototype.checkOnce=(function(){
//	var cache = {};
//	var isEmptyObject = function(obj){
//		for (var i in obj) {
//			return false;
//		}
//		return true;
//	};
//	
//	return function(condition, func, note){
//		note = typeof note === 'undefined' ? '' : note.toString();
//		
//		if (!isEmptyObject(cache) && cache[func.toString() + note] === true) {
//			func();
//		} else if(condition) {
//			func();
//			cache[func.toString() + note] = true;
//		}
//	}
//})();
