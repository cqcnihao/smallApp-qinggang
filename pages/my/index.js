
// var app = getApp();
// var userInfo = app.globalData.userInfo;
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
      content: '拨打青杠客服： 123456789',
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
      url: 'suggest/suggest?userid=' + this.data.userInfo.id,
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
            url: 'http://192.168.1.3:8080/greenbar/user/add',
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
              console.log(res.data);
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
    // var that = this;
    // if (openId) {
    //   wx.getUserInfo({
    //     success: function (res) {
    //       that.setData({
    //         nickName: res.userInfo.nickName,
    //         avatarUrl: res.userInfo.avatarUrl,
    //       })
    //     },
    //     fail: function () {
    //       // fail
    //       console.log("获取失败！")
    //     },
    //     complete: function () {
    //       // complete
    //       console.log("获取用户信息完成！")
    //     }
    //   })
    // } else {
    //   wx.login({
    //     success: function (res) {
    //       console.log(res.code);
    //       if (res.code) {
    //         wx.getUserInfo({
    //           withCredentials: true,
    //           success: function (res_user) {
    //             console.log(res_user);
    //             wx.request({
    //               url: 'http://192.168.1.3:8080/greenbar/user/add',
    //               data: {
    //                 "code": res.code,
    //                 "portrait": res_user.userInfo.avatarUrl,
    //                 "nickname": res_user.userInfo.nickName,
    //               },
    //               method: 'POST',
    //               header: {
    //                 'content-type': 'application/x-www-form-urlencoded'
    //               },
    //               success: function (res) {
    //                 console.log(res.data);
    //                 that.setData({
    //                   nickName: res.data.nickName,
    //                   avatarUrl: res.data.avatarUrl,
    //                 });
    //                 wx.setStorageSync('openId', res.data.openId); //缓存用户数据
    //               },
    //               fail: function() {
    //                 console.log('获取信息失败');
    //               }
    //             })
    //           },
    //           fail: function () {
    //             wx.showModal({
    //               title: '警告通知',
    //               content: '您点击了拒绝授权将无法正常显示个人信息，点击确定重新获取授权。',
    //               success: function () {
    //                 if (res.confirm) {
    //                   wx.openSetting({
    //                     success: function (res) {
    //                       if (res.authSetting['scope.userInfo']) {
    //                         wx.login({
    //                           success: function (res) {
    //                             var code = res.code;
    //                             if (code) {
    //                               wx.getUserInfo({
    //                                 withCredentials: true,
    //                                 success: function (res_user) {
    //                                   wx.request({
    //                                     url: 'http://192.168.1.3:8080/greenbar/user/add',
    //                                     data: {
    //                                       "code": code,
    //                                       "nickname": res_user.userInfo.avatarUrl,
    //                                       "portrait": res_user.userInfo.avatarUrl,
    //                                     },
    //                                     method: 'POST',
    //                                     header: {
    //                                       'content-type': 'application/json'
    //                                     },
    //                                     success: function (res) {

    //                                       that.setData({
    //                                         nickName: res.data.nickName,
    //                                         avatarUrl: res.data.avatarUrl,
    //                                       });
    //                                       wx.setStorageSync('userInfo', res.data); //缓存用户数据
    //                                     },
    //                                     fail: function() {
    //                                       console.log('请求数据出错')
    //                                     }
    //                                   })
    //                                 }
    //                               })
    //                             }
    //                           }
    //                         });//第二次login
    //                       }
    //                     },
    //                     fail: function (res) {
    //                     }
    //                   })
    //                 }
    //               }
    //             })
    //           }
    //         })
    //       }
    //     }
    //   })
    // }
  }
})