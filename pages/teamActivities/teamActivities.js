
Page({

  data: {
  
  },
  onLoad:function() {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
  },
  teamReserve: function() {
    var userInfo = this.data.userInfo;
    if (!userInfo) {
      wx.showModal({
        title: '提示',
        content: '用户未登录，无法提交预订，点击确定按钮前去登录',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/my/index',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: './teamInfo/teamInfo?id=' + userInfo.id,
      })
    }
  }
})