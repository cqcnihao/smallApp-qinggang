var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
  },
  onLoad: function(option) {
    //获取前面缓存的开始时间和结束时间
    var startTime = wx.getStorageSync('startTime');
    var endTime = wx.getStorageSync('endTime');
    var houseInfo = wx.getStorageSync('houseInfo');
    var leaveYear = Number(endTime.split("-")[0]);
    var leaveTimeMonth = Number(endTime.split("-")[1]);
    var leaveDay = Number(endTime.split("-")[2]);
    var leaveDate = new Date(leaveYear, leaveTimeMonth, leaveDay);
    var leaveTime = leaveDate.getTime(); 
    var startYear = Number(startTime.split("-")[0]);
    var startTimeMonth = Number(startTime.split("-")[1]);
    var startDay = Number(startTime.split("-")[2]);
    var startDate = new Date(startYear, startTimeMonth, startDay);
    var livetime = startDate.getTime();
    //计算入住的天数
    var day = parseInt((leaveTime - livetime) / (1000 * 60 * 60 * 24));
    // var data = JSON.parse(option.data); 该方法失效改用缓存
    this.setData({
      houseInfo: houseInfo,
      startTime: startTime, 
      endTime: endTime,
      liveDayCount: day, 
    })
  },
  //以下几个input事件处理程序是为了获取顾客输入的值
  liveNumInput: function(event) {
      this.setData({
        liveNum: event.detail.value
      }) 
  },
  linkmanInput: function(event) {
    this.setData({ 
      linkman: event.detail.value
    })
  },
  phoneInput: function(event) {
    this.setData({
      phone: event.detail.value
    })
  },
  trueNameInput: function (event) {
    this.setData({
      trueName: event.detail.value
    })
  },
  idcardInput: function(event){
    this.setData({
      idcard: event.detail.value
    })
  },
  handleBtnTap: function() {
    var that = this;
    var houseInfo = that.data.houseInfo;
    //入住人数不能为空且必须为数字
    if (typeof (that.data.liveNum) === 'undefined') { 
      wx.showModal({
        title: '提示',
        content: '入住人数不能为空',
        showCancel: false
      })  
    } else if (typeof(that.data.linkman)=== 'undefined') {
      wx.showModal({
        title: '提示',
        content: '联系人不能为空',
        showCancel: false
      })  
    } 
    //手机号必须以1开头且11位都是数字
    else if (!/^1\d{10}$/.test(that.data.phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式错误',
        showCancel: false
      })  
    } else if (typeof(that.data.trueName) === 'undefined') {
      wx.showModal({
        title: '提示',
        content: '入住人姓名不能为空',
        showCancel: false
      })  
    } 
    //身份证必须为18位且前17位必须为数字，最后一位可以为数字或者大小写字母(X, x)
    else if (!/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.data.idcard)) {
      wx.showModal({
        title: '提示',
        content: '身份证格式错误',
        showCancel: false
      })  
    }
    else if (!userInfo) {
      wx.showModal({
        title: '提示',
        content: '用户未登录，请回到首页-->我的-->授权登录',
        showCancel: false
      })
    }
    else {
      wx.request({
        url: 'http://192.168.1.3:8080/greenbar/order/add',
        method: "POST",
        data: {
          "userId": userInfo.id,  //需要改为返回的
          "houseId": houseInfo.id,
          "price": houseInfo.price * that.data.liveDayCount, //单价乘以入住天数
          "liveNum": that.data.liveNum, //客户填的
          "liveTime": that.data.startTime, //客户首页选的
          "leaveTime": that.data.endTime, //客户首页选的
          "linkman": that.data.linkman,   //客户填的内容
          "phone": that.data.phone,  //客户填的内容
          "trueName": that.data.trueName, //客户填的内容
          "idcard": that.data.idcard, //客户填的内容
          "status": "dfk" //需要判断 已支付的话  为 "yfk"？？
        },
        header: {
          "Content-Type": "application/json" //post请求的请求头
        },
        complete: function (res) {
          that.setData({});
          console.log(res.data);
          if (res == null || res.data == null) {
            console.error("网络请求失败");
            return;
          }
        }
      })
    }
  }
})