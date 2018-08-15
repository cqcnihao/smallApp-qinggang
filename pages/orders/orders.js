var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
  },
  callback: function(res) {
    if (res.data.code == "1") {//当code为1的时候
      this.setData({
        orderArray: res.data.obj,
        show: false
      });
    } else {
      this.setData({
        show: true
      });
    }
  },
  onShow: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    var that= this;
    if (userInfo !== "") { //不加if限制，当用户未登录时id为undefined发送请求会报错
      var url = app.globalData.url + '/order/findAll?id=' + userInfo.id;
      util.sendRequest(url, 'GET', '', 'application/json', that.callback)
    }
    this.setData({
      userInfo: userInfo
    })
  },
  onorderDetail: function(event) {
    wx.navigateTo({
      url: 'orderdetails/orderdetail?id=' + event.currentTarget.id, //传入订单id
    })
  }
})