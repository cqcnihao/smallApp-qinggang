
var app = getApp();
var userInfo = wx.getStorageSync('userInfo');
Page({
  data: {
  },

  onLoad: function (options) {
    var that= this;
    wx.request({
      url: "http://192.168.1.3:8080/greenbar/order/findAll?id=" + userInfo.id, //这个id为用户的id
      method: "GET",
      dataType: "json",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == "1") {//当code为1的时候
          that.setData({
            orderArray: res.data.obj,
          });
          console.log(res.data.obj);
        } else {
          that.setData({
            code: res.data.code,
          });
        }

      },
      fail: function (res) {
        console.log("网络异常");
      }
    });
  },
  onorderDetail: function(event) {
    wx.navigateTo({
      url: 'orderdetails/orderdetail?id=' + event.currentTarget.id, //传入订单id
    })
  }
})