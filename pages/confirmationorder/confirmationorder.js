var util = require('../../utils/util.js');
var Moment = require("../../utils/moment.js");
var app = getApp();
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
Page({
  data: {
    year: '',
    month: '',
    day: '',
    days: {},
    systemInfo: {},
    weekStr: ['日', '一', '二', '三', '四', '五', '六'],
    checkDate: []
  },
  onLoad: function(option) {
    //获取前面缓存的开始时间和结束时间
    var userInfo = wx.getStorageSync('userInfo');
    var startTime = wx.getStorageSync('startTime');
    var endTime = wx.getStorageSync('endTime');
    var houseInfo = wx.getStorageSync('houseInfo');
    var day = wx.getStorageSync("dayCount");
    var _this = this;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    // 页面初始化 options为页面跳转所带来的参数
    this.createDateListData();
    this.setData({
      houseInfo: houseInfo,
      startTime: startTime, 
      endTime: endTime,
      liveDayCount: day, 
      userInfo: userInfo,
      year: year,
      month: month
    });
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          systemInfo: res,
        });
      }
    })
  },
  formSubmit: function(event) {
    var that = this;
    var formValue = event.detail.value;
    var houseInfo = that.data.houseInfo;
    //入住人数不能为空且必须为数字
    if ( formValue.liveNum === '') {
      wx.showModal({
        title: '提示',
        content: '入住人数不能为空',
        showCancel: false
      })
    } else if (formValue.linkman === '') {
      wx.showModal({
        title: '提示',
        content: '联系人不能为空',
        showCancel: false
      })
    }
    //手机号必须以1开头且11位都是数字
    else if (!/^1\d{10}$/.test(formValue.phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式错误',
        showCancel: false
      })
    } else if (formValue.trueName === '') {
      wx.showModal({
        title: '提示',
        content: '入住人姓名不能为空',
        showCancel: false
      })
    }
    //身份证必须为18位且前17位必须为数字，最后一位可以为数字或者大小写字母(X, x)
    else if (!/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(formValue.idcard)) {
      wx.showModal({
        title: '提示',
        content: '身份证格式错误',
        showCancel: false
      })
    }
    else if (that.data.liveDayCount > 90) {
      wx.showModal({
        title: '提示',
        content: '预订时间最长只能90天',
        showCancel: false
      })
    }
    else {
      var url = app.globalData.url + '/order/add';
      var data = {
        "userId": that.data.userInfo.id,
        "houseId": houseInfo.id,
        "price": houseInfo.price * that.data.liveDayCount, //单价乘以入住天数
        "liveNum": formValue.liveNum, //客户填的
        "liveTime": that.data.startTime, //客户首页选的
        "leaveTime": that.data.endTime, //客户首页选的
        "linkman": formValue.linkman,   //客户填的内容
        "phone": formValue.phone,  //客户填的内容
        "trueName": formValue.trueName, //客户填的内容
        "idcard": formValue.idcard, //客户填的内容
        "status": "dfk" //需要判断 已支付的话  为 "yfk"？？
      }
      util.sendRequest(url, 'POST', data, 'application/json', that.callback)
    }
  },
  callback: function(res) {
    var that = this;
    var orderDetails = res.data.obj;
   //调支付接口 跳转到订单详情页面
    var url = app.globalData.url + '/order/pay';
    wx.login({
      success: function (res) {
        var url = app.globalData.url + '/order/pay';
        var data = {
          "id": orderDetails.id,
          "code": res.code
        };
        //调支付接口 跳转到订单页面
        util.sendPaymentRequest(url, 'POST', data, 'application/x-www-form-urlencoded', util.goPaymentCallback);
      }
    })
  },
  /**创建日历数据 */
  createDateListData: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();
    //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    console.log("当前选中月nextMonth：" + nextMonth);
    //目标月1号对应的星期
    let startWeek = this.getWeek(year, nextMonth, 1); //new Date(year + ',' + (month + 1) + ',' + 1).getDay();  
    console.log("目标月1号对应的星期startWeek:" + startWeek);
    //获取目标月有多少天
    let dayNums = this.getTotalDayByMonth(year, nextMonth); //new Date(year, nextMonth, 0).getDate();         
    console.log("获取目标月有多少天dayNums:" + dayNums);
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    for (var j = -startWeek + 1; j <= dayNums; j++) {
      var tempWeek = -1;
      if (j > 0) {
        tempWeek = this.getWeek(year, nextMonth, j);
        //console.log(year + "年" + month + "月" + j + "日" + "星期" + tempWeek);
      }
      var clazz = '';
      if (tempWeek == 0 || tempWeek == 6)
        clazz = 'week'
      if (j < DATE_DAY && year == DATE_YEAR && nextMonth == DATE_MONTH)
        //当天之前的日期不可用
        clazz = 'unavailable ' + clazz;
      else
        clazz = '' + clazz
      /**如果当前日期已经选中，则变色 */
      var date = year + "-" + nextMonth + "-" + j;
      var index = this.checkItemExist(this.data.checkDate, date);
      if (index != -1) {
        clazz = clazz + ' active';
      }
      dateArr.push({
        day: j,
        class: clazz,
        amount: '￥99.8'
      })
    }
    this.setData({
      days: dateArr
    })
  },
  /**
   * 上个月
   */
  lastMonthEvent: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.createDateListData(year, month);
  },
  /**
   * 下个月
   */
  nextMonthEvent: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.createDateListData(year, month);
  },
  /*
   * 获取月的总天数
   */
  getTotalDayByMonth: function (year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
  },
  /*
   * 获取月的第一天是星期几
   */
  getWeek: function (year, month, day) {
    var d = new Date(year, month - 1, day);
    return d.getDay();
  },
  /**
   * 点击日期事件
   */
  onPressDateEvent: function (e) {
    var {
      year,
      month,
      day,
      amount
    } = e.currentTarget.dataset;
    console.log("当前点击的日期：" + year + "-" + month + "-" + day);
    //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
    if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0)
      return;

    this.renderPressStyle(year, month, day, amount);
  },
  renderPressStyle: function (year, month, day, amount) {
    var days = this.data.days;
    //渲染点击样式
    for (var j = 0; j < days.length; j++) {
      var tempDay = days[j].day;
      if (tempDay == day) {
        var date = year + "-" + month + "-" + day;
        var obj = {
          day: date,
          amount: amount
        };
        var checkDateJson = this.data.checkDate;
        var index = this.checkItemExist(checkDateJson, date);
        if (index == -1) {
          checkDateJson.push(obj);
          days[j].class = days[j].class + ' active';
        } else {
          checkDateJson.splice(index, 1);
          days[j].class = days[j].class.replace('active', ' ');
        }
        this.setData({
          checkDate: checkDateJson
        })
        console.log(JSON.stringify(this.data.checkDate));
        break;
      }
    }
    this.setData({
      days: days
    });

  },
  /**检查数组中是否存在该元素 */
  checkItemExist: function (arr, value) {
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i].day) {
        return i;
      }
    }
    return -1;
  }

})