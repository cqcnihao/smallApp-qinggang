var userInfo = wx.getStorageSync('userInfo');

Page({
  data: {
  },
  onShow: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    var that= this;
    if (userInfo !== "") { //不加if限制，当用户未登录时id为undefined发送请求会报错
      wx.request({
        url: "http://192.168.1.6:8080/greenbar/order/findAll?id=" + userInfo.id, //这个id为用户的id
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