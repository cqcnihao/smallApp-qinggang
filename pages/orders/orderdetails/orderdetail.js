var util = require('../../../utils/util.js');
Page({
  data: { 
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://192.168.1.3:8080/greenbar/order/findOne?id=' + options.id,
      method: "GET",
      dataType: "json",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          orderDetails: res.data.obj,
        })
      }
    })
  },
  getHousePassword: function() {
    var that = this;
      wx.request({
        url: 'http://192.168.1.3:8080/greenbar/sms/identifying?id=' + that.data.orderDetails.id,
        method: "GET",
        dataType: "json",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //根据后台返回数据，code为-1时，给客户提示无法获取开房密码
          if (res.data.code === "-1") {
            wx.showModal({
              title: '提示',
              content: '只有在入住期间才能获取密码哟',
              showCancel: false
            })
          }
        }
      }) 
  },
  cancelOrder: function() {
    var that= this;
    wx.request({
      url: 'http://192.168.1.3:8080/greenbar/order/cancel?id=' + that.data.orderDetails.id,
      method: "POST",
      dataType: "json",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('订单取消成功');
        console.log(res.data);
      }
    })
  },
  handleRefound: function() {
    var now = util.formatTime(new Date());
    var nowYear = Number(now.split("-")[0]);
    var nowMonth = Number(now.split("-")[1]);
    var nowDay = Number(now.split("-")[2]);
    var nowDate = new Date(nowYear, nowMonth, nowDay);
    var nowTime = nowDate.getTime();
    var leaveYear = Number(this.data.orderDetails.leaveTime.split("-")[0]);
    var leaveTimeMonth = Number(this.data.orderDetails.leaveTime.split("-")[1]);
    var leaveDay = Number(this.data.orderDetails.leaveTime.split("-")[2]);
    var leaveDate = new Date(leaveYear, leaveTimeMonth, leaveDay);
    var leaveTime = leaveDate.getTime(); 
    //计算离店日和申请退款日的差值，差值大于等于1才能跳转到退款页面
    var day = parseInt((leaveTime - nowTime)/(1000*60*60*24));
    if ( day>=1) {
      wx.navigateTo({
        url: 'refund/refund?id=' + this.data.orderDetails.id,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '不在退款有效期，无法退款。',
        showCancel: false
      })  
    }
  }
})