var userInfo = wx.getStorageSync('userInfo');
Page({
  data: {},
  
  onLoad: function (options) {
    if (userInfo !== "") { //当用户缓存数据不为空时，在页面加载时根据缓存数据设置用户信息
      this.setData({
        nickName: userInfo.nickname,
        avatarUrl: userInfo.portrait,
        show: false
      });
    } else {
      this.setData({
        show: true
      });
    }
  },
  toOrder: function () {
    wx.switchTab({
      url: '../orders/orders',
    })
  },
  onContactTap: function() {
    wx.showModal({
      title: '提示',
      content: '拨打客服热线： 123456789',
      success: function(res) {
        if(res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '123456789'
          })
        }
      }
    })
  },
  onFeedbackTap: function() {
    wx.navigateTo({
      url: 'suggest/suggest?userid=' + userInfo.id,
    })
  },
  handleAboutUsTap: function() {
    wx.navigateTo({
      url: 'about-us/about-us',
    })
  },
  checkOut: function() {
    try {
      //当用户点击退出时把用户数据设为空，并把相关用户信息缓存清除
      wx.removeStorageSync("userInfo");
      this.setData({
        show: true,
        nickName: '',
        avatarUrl: ''
      })
    } catch (e) {
      // Do something when catch error
    }
  },
  onGotUserInfo: function(e) {
    var that = this;
    var userIn = e.detail.userInfo; //获取用户信息
    wx.login({
      success: function(res) {
        if(res.code) {
          wx.request({
            url: 'http://192.168.1.6:8080/greenbar/user/add',
            method: 'POST',
            data: {
              "code": res.code,
              "portrait": userIn.avatarUrl,
              "nickname": userIn.nickName,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var data = res.data.obj;
              wx.setStorageSync('userInfo', data);
              that.setData({
                nickName: data.nickname,
                avatarUrl: data.portrait,
                show: false
              });
            },
            fail: function() {
              console.log('获取信息失败');
            }
          })
        }
      }
    })
  }
})