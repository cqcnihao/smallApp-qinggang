var app = getApp();

Page({
  data: {},
  onLoad: function(option) {
    this.setData({
      userId: option.userid
    })
  },
  ontextareaContent: function(event) {
    this.setData({
      textareaContent: event.detail.value
    })
  },
  onEmailAccount: function (event) {
    this.setData({
      emailAccount: event.detail.value
    })
  },
  onphoneNum: function (event) {
    this.setData({
      phoneNum: event.detail.value
    })
  },
  onsuggestTap: function() {
    var that=this;
    if (typeof (that.data.textareaContent) === 'undefined') {
      wx.showModal({
        title: '提示',
        content: '问题或建议不能为空',
        showCancel: false
      })
    } 
    if (!/^1\d{10}$/.test(that.data.phoneNum)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式错误',
        showCancel: false
      })
    } 
    else {
      wx.request({
        url: 'http://192.168.1.3:8080/greenbar/feedback/add',
        method: 'POST',
        data: {
          "id": that.data.userId,
          "textareaContent": that.data.textareaContent,
          "emailAccount": that.data.emailAccount,
          "phoneNum": that.data.phoneNum 
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log(res.data)
        },
        fail: function() {
          console.log('建议提交失败')
        }
      })
    }
  }
})