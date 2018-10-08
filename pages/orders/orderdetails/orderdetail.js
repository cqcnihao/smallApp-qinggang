var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    isWholeHouse: false
  },
  onLoadCallback: function(res) {
    this.setData({
      orderDetails: res.data.obj,
      isWholeHouse: res.data.obj.houseName.includes('整栋')
    })
  },
  onLoad: function (options) {
    var url = app.globalData.url + '/order/findOne?id=' + options.id;
    this.setData({
      orderId: options.id
    })
    util.sendRequest(url, 'GET', '', 'application/json', this.onLoadCallback);
  },
  //每次进入页面重新加载订单数据
  onShow: function() {
    var url = app.globalData.url + '/order/findOne?id=' + this.data.orderId;
    util.sendRequest(url, 'GET', '', 'application/json', this.onShowCallback);
  },
  onShowCallback: function (res) {
    this.setData({
      orderDetails: res.data.obj
    })
  },
  getPasswordCallback: function(res) {
    if (res.data.code === "-1") {
      wx.showModal({
        title: '提示',
        content: '只有在入住期间才能获取密码哟',
        showCancel: false
      })
    } else if (res.data.code === "1") {
      wx.showModal({
        title: '提示',
        content: '获取密码已成功，稍后我们会以短信形式发送至你订单信息中的手机号，请注意查收。',
        showCancel: false
      })
    }
  },
  getHousePassword: function() {
    var url = app.globalData.url + '/sms/identifying?id=' + this.data.orderDetails.id;
    util.sendRequest(url, 'GET', '', 'application/json', this.getPasswordCallback);
  },
  cancelOrderCallback: function(res) {
    this.setData({
      orderDetails: res.data.obj
    })
  },
  cancelOrder: function() {
    var that = this;
    var url = app.globalData.url + '/order/cancel?id=' + this.data.orderDetails.id;
    wx.showModal({
      title: '提示',
      content: '确认要取消订单吗？',
      success: function(res) {
        if (res.confirm){
          util.sendRequest(url, 'POST', '', 'application/json', that.cancelOrderCallback)
        }
      }
    })
  },
  goPayment: function() {
    var that = this;
    wx.login({
        success: function (res) {
          var url = app.globalData.url + '/order/pay';
          var data = {
            "id": that.data.orderDetails.id,
            "code": res.code
          };
          //调支付接口 跳转到订单页面
          util.sendRequest(url, 'POST', data, 'application/x-www-form-urlencoded', util.goPaymentCallback);
        }
    })
  },
  handleRefound: function() {
    var now = util.formatTime(new Date());
    var leaveTime = this.data.orderDetails.leaveTime;
    var day = util.countDayMount(now, leaveTime);
    if ( day>1) {
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
  },
  applyInvoice: function() {
    var orderDetails = JSON.stringify(this.data.orderDetails);
    if (this.data.orderDetails.invoice === 'true') {
      wx.showModal({
        title: '提示',
        content: '此订单已经开过发票，请耐心等待，如有疑问请联系客服',
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: 'applyInvoice/invoice?orderDetails=' + orderDetails,
      })
    }
  }
})