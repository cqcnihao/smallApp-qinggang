var util = require('../../../../utils/util.js');
var app = getApp();

Page({
  data: {
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.id
    })
  },
  ontextareaContent: function (event) {
    this.setData({
      textareaContent: event.detail.value
    })
  },
  refundCallback: function(res) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '退款申请已发送成功，请耐心等待',
      showCancel: false,
      success: function(res) {
        that.setData({
          textareaContent: ''
        })
      }
    })
  },
  submitRefound: function() {
    var that = this;
    if (typeof (that.data.textareaContent) === 'undefined') {
      wx.showModal({
        title: '提示',
        content: '退款原因不能为空',
        showCancel: false
      })
    } else {
      var url = app.globalData.url + '/order/refund';
      var data = {
        "orderId": that.data.orderId,
        "cause": that.data.textareaContent
      };
      util.sendRequest(url, 'POST', data, 'application/x-www-form-urlencoded', that.refundCallback);
    }
  }
})