var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
  },
  onLoad: function(option) {
    //获取前面缓存的开始时间和结束时间
    var userInfo = wx.getStorageSync('userInfo');
    var startTime = wx.getStorageSync('startTime');
    var endTime = wx.getStorageSync('endTime');
    var houseInfo = wx.getStorageSync('houseInfo');
    var day = wx.getStorageSync("dayCount")
    this.setData({
      houseInfo: houseInfo,
      startTime: startTime, 
      endTime: endTime,
      liveDayCount: day, 
      userInfo: userInfo
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
    } else if (formValue === '') {
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
    else if (!that.data.userInfo) {
      wx.showModal({
        title: '提示',
        content: '用户未登录，无法提交订单，点击确定按钮前去登录',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/my/index',
            })
          }
        }
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
})