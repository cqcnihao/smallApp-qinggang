// pages/orders/orderdetails/refound/refound.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
  submitRefound: function() {
    var that = this;
    if (typeof (that.data.textareaContent) === 'undefined') {
      wx.showModal({
        title: '提示',
        content: '退款原因不能为空',
        showCancel: false
      })
    } else {
      wx.request({
        url: 'http://192.168.1.6:8080/greenbar/order/refund',
        method: 'POST',
        data: {
          "orderId": that.data.orderId,
          "cause": that.data.textareaContent
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data)
        },
        fail: function () {
          console.log('退款原因提交失败')
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})