var app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {},
  onLoad: function(option) {
    this.setData({
      userId: option.userid
    })
  },
  callback: function(res) {
    var that = this;
    if(res.data.code === '1') {
      wx.showToast({
        title: '建议提交成功',
        icon: 'success',
        duration: 1500,
        success: function() {
          that.setData({
            formValue: ''
          })
        }
      })
    }
  },
  formSubmit: function(event) {
    var that = this;
    var formValue = event.detail.value;
    this.setData({
      formValue: formValue
    });
    if (formValue.textareaContent === '') {
      wx.showModal({
        title: '提示',
        content: '问题或建议不能为空',
        showCancel: false
      })
    }
    if (!/^1\d{10}$/.test(formValue.phoneNum)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式错误',
        showCancel: false
      })
    }
    else {
      var url = app.globalData.url + '/feedback/add';
      var data = {
        "id": that.data.userId,
        "textareaContent": formValue.textareaContent,
        "emailAccount": formValue.emailAccount,
        "phoneNum": formValue.phoneNum
      }
      util.sendRequest(url, 'POST', data, 'application/x-www-form-urlencoded', that.callback)
    }
  }
})